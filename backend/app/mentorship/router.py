from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import (
    get_current_mentor_profile,
    get_current_student_profile,
    get_current_user,
)
from app.core.errors import ForbiddenError
from app.db.models.mentor import MentorProfile
from app.db.models.student import StudentProfile
from app.db.models.user import User, UserRole
from app.db.session import get_db
from app.mentorship import service
from app.mentorship.schemas import (
    MentorshipRequestCreate,
    MentorshipScheduleRequest,
    MentorshipSessionOut,
)

router = APIRouter(prefix="/api/mentorships", tags=["mentorship"])


@router.get("", response_model=List[MentorshipSessionOut])
def list_my_mentorships(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == UserRole.STUDENT and current_user.student_profile:
        return service.list_sessions_for_student(db, current_user.student_profile)
    if current_user.role == UserRole.MENTOR and current_user.mentor_profile:
        return service.list_sessions_for_mentor(db, current_user.mentor_profile)
    return []


@router.post("", response_model=MentorshipSessionOut, status_code=201)
def request_mentorship(
    payload: MentorshipRequestCreate,
    student: StudentProfile = Depends(get_current_student_profile),
    db: Session = Depends(get_db),
):
    return service.request_mentorship(db, student, payload)


@router.put("/{session_id}/accept", response_model=MentorshipSessionOut)
def accept_mentorship(
    session_id: int,
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    return service.accept_mentorship(db, mentor, session_id)


@router.put("/{session_id}/reject", response_model=MentorshipSessionOut)
def reject_mentorship(
    session_id: int,
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    return service.reject_mentorship(db, mentor, session_id)


@router.post("/{session_id}/schedule", response_model=MentorshipSessionOut)
def schedule_mentorship(
    session_id: int,
    payload: MentorshipScheduleRequest,
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    return service.schedule_mentorship(db, mentor, session_id, payload)


@router.put("/{session_id}/cancel", response_model=MentorshipSessionOut)
def cancel_mentorship(
    session_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.cancel_mentorship(db, current_user.id, session_id)
