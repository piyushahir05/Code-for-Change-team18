from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.errors import ForbiddenError, NotFoundError
from app.db.models.mentor import MentorAssignment, MentorAvailability, MentorProfile
from app.db.models.student import StudentProfile
from app.db.models.user import User
from app.mentors.schemas import MentorAvailabilityIn, MentorProfileUpdate


def get_or_create_profile(db: Session, user: User) -> MentorProfile:
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == user.id).first()
    if not profile:
        profile = MentorProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def update_profile(db: Session, user: User, payload: MentorProfileUpdate) -> MentorProfile:
    profile = get_or_create_profile(db, user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile


def list_mentors(db: Session, expertise: Optional[str] = None) -> List[MentorProfile]:
    query = db.query(MentorProfile)
    mentors = query.all()
    if expertise:
        needle = expertise.lower()
        mentors = [m for m in mentors if m.expertise and any(needle in e.lower() for e in m.expertise)]
    return mentors


def get_mentor_or_404(db: Session, mentor_id: int) -> MentorProfile:
    mentor = db.query(MentorProfile).filter(MentorProfile.id == mentor_id).first()
    if not mentor:
        raise NotFoundError("Mentor not found")
    return mentor


def list_assigned_students(db: Session, mentor: MentorProfile) -> List[MentorAssignment]:
    return db.query(MentorAssignment).filter(MentorAssignment.mentor_id == mentor.id).all()


def get_assigned_student_or_403(db: Session, mentor: MentorProfile, student_id: int) -> StudentProfile:
    assignment = (
        db.query(MentorAssignment)
        .filter(MentorAssignment.mentor_id == mentor.id, MentorAssignment.student_id == student_id)
        .first()
    )
    if not assignment:
        raise ForbiddenError("This student is not assigned to you")
    return assignment.student


def ensure_assignment(db: Session, mentor_id: int, student_id: int) -> MentorAssignment:
    assignment = (
        db.query(MentorAssignment)
        .filter(MentorAssignment.mentor_id == mentor_id, MentorAssignment.student_id == student_id)
        .first()
    )
    if not assignment:
        assignment = MentorAssignment(mentor_id=mentor_id, student_id=student_id)
        db.add(assignment)
        db.commit()
        db.refresh(assignment)
    return assignment


# --- Availability -----------------------------------------------------
# IMPLEMENTATION ASSUMPTION: not in the section 32 route contract, but
# required input for mentorship scheduling now that the actual schema
# models mentorship around mentor_availability + mentor_meetings rather
# than a single request/accept/schedule session table.

def list_availability(db: Session, mentor: MentorProfile) -> List[MentorAvailability]:
    return db.query(MentorAvailability).filter(MentorAvailability.mentor_id == mentor.id).all()


def add_availability(db: Session, mentor: MentorProfile, payload: MentorAvailabilityIn) -> MentorAvailability:
    slot = MentorAvailability(
        mentor_id=mentor.id,
        day_of_week=payload.day_of_week,
        start_time=payload.start_time,
        end_time=payload.end_time,
        is_active=payload.is_active,
    )
    db.add(slot)
    db.commit()
    db.refresh(slot)
    return slot


def delete_availability(db: Session, mentor: MentorProfile, availability_id: int) -> None:
    slot = (
        db.query(MentorAvailability)
        .filter(MentorAvailability.id == availability_id, MentorAvailability.mentor_id == mentor.id)
        .first()
    )
    if not slot:
        raise NotFoundError("Availability slot not found")
    db.delete(slot)
    db.commit()
