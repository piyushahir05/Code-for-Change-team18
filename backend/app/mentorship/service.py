from datetime import datetime
from typing import List

from sqlalchemy.orm import Session

from app.core.errors import BadRequestError, ForbiddenError, NotFoundError
from app.db.models.mentor import MentorProfile
from app.db.models.mentorship import MentorMeeting, MentorshipStatus
from app.db.models.student import StudentProfile
from app.mentors.service import ensure_assignment, get_mentor_or_404
from app.mentorship.schemas import MentorshipRequestCreate, MentorshipScheduleRequest
from app.notifications.service import create_notification


def _get_session_or_404(db: Session, session_id: int) -> MentorMeeting:
    session = db.query(MentorMeeting).filter(MentorMeeting.id == session_id).first()
    if not session:
        raise NotFoundError("Mentorship session not found")
    return session


def list_sessions_for_student(db: Session, student: StudentProfile) -> List[MentorMeeting]:
    return db.query(MentorMeeting).filter(MentorMeeting.student_id == student.id).all()


def list_sessions_for_mentor(db: Session, mentor: MentorProfile) -> List[MentorMeeting]:
    return db.query(MentorMeeting).filter(MentorMeeting.mentor_id == mentor.id).all()


def request_mentorship(db: Session, student: StudentProfile, payload: MentorshipRequestCreate) -> MentorMeeting:
    mentor = get_mentor_or_404(db, payload.mentor_id)
    assignment = ensure_assignment(db, mentor.id, student.id)

    session = MentorMeeting(
        mentor_id=mentor.id,
        student_id=student.id,
        assignment_id=assignment.id,
        scheduled_start=payload.scheduled_start,
        scheduled_end=payload.scheduled_end,
        topic=payload.topic,
        status=MentorshipStatus.REQUESTED.value,
        created_at=datetime.utcnow(),
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    if mentor.user_id:
        create_notification(
            db,
            user_id=mentor.user_id,
            title="New mentorship request",
            message="A student has requested mentorship" + (f" on '{payload.topic}'" if payload.topic else "") + ".",
            type="MENTORSHIP_REQUESTED",
        )
    return session


def _require_own_session_as_mentor(db: Session, mentor: MentorProfile, session_id: int) -> MentorMeeting:
    session = _get_session_or_404(db, session_id)
    if session.mentor_id != mentor.id:
        raise ForbiddenError("This mentorship session does not belong to you")
    return session


def accept_mentorship(db: Session, mentor: MentorProfile, session_id: int) -> MentorMeeting:
    session = _require_own_session_as_mentor(db, mentor, session_id)
    session.status = MentorshipStatus.ACCEPTED.value
    db.commit()
    db.refresh(session)
    if session.student.user_id:
        create_notification(
            db,
            user_id=session.student.user_id,
            title="Mentorship accepted",
            message="Your mentor accepted your mentorship request.",
            type="MENTORSHIP_ACCEPTED",
        )
    return session


def reject_mentorship(db: Session, mentor: MentorProfile, session_id: int) -> MentorMeeting:
    session = _require_own_session_as_mentor(db, mentor, session_id)
    session.status = MentorshipStatus.CANCELLED.value
    db.commit()
    db.refresh(session)
    if session.student.user_id:
        create_notification(
            db,
            user_id=session.student.user_id,
            title="Mentorship request declined",
            message="Your mentor was unable to accept your mentorship request.",
            type="MENTORSHIP_REJECTED",
        )
    return session


def schedule_mentorship(
    db: Session, mentor: MentorProfile, session_id: int, payload: MentorshipScheduleRequest
) -> MentorMeeting:
    session = _require_own_session_as_mentor(db, mentor, session_id)

    if payload.scheduled_start and payload.scheduled_end and payload.scheduled_end <= payload.scheduled_start:
        raise BadRequestError("scheduled_end must be after scheduled_start")

    session.mode = payload.mode.value
    if payload.scheduled_start:
        session.scheduled_start = payload.scheduled_start
    if payload.scheduled_end:
        session.scheduled_end = payload.scheduled_end
    session.meeting_link = payload.meeting_link
    session.location = payload.location
    session.status = MentorshipStatus.SCHEDULED.value
    db.commit()
    db.refresh(session)

    if session.student.user_id:
        create_notification(
            db,
            user_id=session.student.user_id,
            title="Mentorship session scheduled",
            message=f"Your mentorship session is scheduled ({payload.mode.value}).",
            type="MENTORSHIP_SCHEDULED",
        )
    return session


def cancel_mentorship(db: Session, current_user_id: int, session_id: int) -> MentorMeeting:
    session = _get_session_or_404(db, session_id)
    is_mentor = session.mentor.user_id == current_user_id
    is_student = session.student.user_id == current_user_id
    if not (is_mentor or is_student):
        raise ForbiddenError("This mentorship session does not belong to you")

    session.status = MentorshipStatus.CANCELLED.value
    db.commit()
    db.refresh(session)
    return session
