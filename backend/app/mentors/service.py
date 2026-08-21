import uuid
from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.errors import ForbiddenError, NotFoundError
from app.db.models.mentor import MentorAssignment, MentorProfile
from app.db.models.student import StudentProfile
from app.db.models.user import User
from app.mentors.schemas import MentorProfileUpdate


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
    if expertise:
        query = query.filter(MentorProfile.expertise.ilike(f"%{expertise}%"))
    return query.all()


def get_mentor_or_404(db: Session, mentor_id: uuid.UUID) -> MentorProfile:
    mentor = db.query(MentorProfile).filter(MentorProfile.id == mentor_id).first()
    if not mentor:
        raise NotFoundError("Mentor not found")
    return mentor


def list_assigned_students(db: Session, mentor: MentorProfile) -> List[MentorAssignment]:
    return db.query(MentorAssignment).filter(MentorAssignment.mentor_id == mentor.id).all()


def get_assigned_student_or_403(db: Session, mentor: MentorProfile, student_id: uuid.UUID) -> StudentProfile:
    assignment = (
        db.query(MentorAssignment)
        .filter(MentorAssignment.mentor_id == mentor.id, MentorAssignment.student_id == student_id)
        .first()
    )
    if not assignment:
        raise ForbiddenError("This student is not assigned to you")
    return assignment.student


def ensure_assignment(db: Session, mentor_id: uuid.UUID, student_id: uuid.UUID) -> MentorAssignment:
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
