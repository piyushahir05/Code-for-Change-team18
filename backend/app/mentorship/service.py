import uuid
from typing import List

from sqlalchemy.orm import Session

from app.core.errors import BadRequestError, ForbiddenError, NotFoundError
from app.db.models.mentor import MentorProfile
from app.db.models.mentorship import MentorshipMode, MentorshipSession, MentorshipStatus
from app.db.models.student import StudentProfile
from app.mentors.service import ensure_assignment, get_mentor_or_404
from app.mentorship.schemas import MentorshipRequestCreate, MentorshipScheduleRequest
from app.notifications.service import create_notification


def _get_session_or_404(db: Session, session_id: uuid.UUID) -> MentorshipSession:
    session = db.query(MentorshipSession).filter(MentorshipSession.id == session_id).first()
    if not session:
        raise NotFoundError("Mentorship session not found")
    return session


def list_sessions_for_student(db: Session, student: StudentProfile) -> List[MentorshipSession]:
    return db.query(MentorshipSession).filter(MentorshipSession.student_id == student.id).all()


def list_sessions_for_mentor(db: Session, mentor: MentorProfile) -> List[MentorshipSession]:
    return db.query(MentorshipSession).filter(MentorshipSession.mentor_id == mentor.id).all()


def request_mentorship(db: Session, student: StudentProfile, payload: MentorshipRequestCreate) -> MentorshipSession:
    mentor = get_mentor_or_404(db, payload.mentor_id)
    ensure_assignment(db, mentor.id, student.id)

    session = MentorshipSession(
        mentor_id=mentor.id,
        student_id=student.id,
        topic=payload.topic,
        status=MentorshipStatus.REQUESTED,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    create_notification(
        db,
        user_id=mentor.user_id,
        title="New mentorship request",
        message=f"A student has requested mentorship" + (f" on '{payload.topic}'" if payload.topic else "") + ".",
        type="MENTORSHIP_REQUESTED",
    )
    return session


def _require_own_session_as_mentor(db: Session, mentor: MentorProfile, session_id: uuid.UUID) -> MentorshipSession:
    session = _get_session_or_404(db, session_id)
    if session.mentor_id != mentor.id:
        raise ForbiddenError("This mentorship session does not belong to you")
    return session


def accept_mentorship(db: Session, mentor: MentorProfile, session_id: uuid.UUID) -> MentorshipSession:
    session = _require_own_session_as_mentor(db, mentor, session_id)
    session.status = MentorshipStatus.ACCEPTED
    db.commit()
    db.refresh(session)
    create_notification(
        db,
        user_id=session.student.user_id,
        title="Mentorship accepted",
        message="Your mentor accepted your mentorship request.",
        type="MENTORSHIP_ACCEPTED",
    )
    return session


def reject_mentorship(db: Session, mentor: MentorProfile, session_id: uuid.UUID) -> MentorshipSession:
    session = _require_own_session_as_mentor(db, mentor, session_id)
    session.status = MentorshipStatus.CANCELLED
    db.commit()
    db.refresh(session)
    create_notification(
        db,
        user_id=session.student.user_id,
        title="Mentorship request declined",
        message="Your mentor was unable to accept your mentorship request.",
        type="MENTORSHIP_REJECTED",
    )
    return session


def schedule_mentorship(
    db: Session, mentor: MentorProfile, session_id: uuid.UUID, payload: MentorshipScheduleRequest
) -> MentorshipSession:
    session = _require_own_session_as_mentor(db, mentor, session_id)

    if payload.mode == MentorshipMode.PHYSICAL and not payload.location:
        raise BadRequestError("location is required for a PHYSICAL mentorship session")
    if payload.mode == MentorshipMode.ONLINE and not payload.meeting_link:
        raise BadRequestError("meeting_link is required for an ONLINE mentorship session")

    session.mode = payload.mode
    session.scheduled_at = payload.scheduled_at
    session.location = payload.location
    session.meeting_link = payload.meeting_link
    session.notes = payload.notes
    session.status = MentorshipStatus.SCHEDULED
    db.commit()
    db.refresh(session)

    create_notification(
        db,
        user_id=session.student.user_id,
        title="Mentorship session scheduled",
        message=f"Your mentorship session is scheduled ({payload.mode.value}).",
        type="MENTORSHIP_SCHEDULED",
    )
    return session


def cancel_mentorship(db: Session, current_user_id, session_id: uuid.UUID) -> MentorshipSession:
    session = _get_session_or_404(db, session_id)
    is_mentor = session.mentor.user_id == current_user_id
    is_student = session.student.user_id == current_user_id
    if not (is_mentor or is_student):
        raise ForbiddenError("This mentorship session does not belong to you")

    session.status = MentorshipStatus.CANCELLED
    db.commit()
    db.refresh(session)
    return session
