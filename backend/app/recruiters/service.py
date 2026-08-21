from sqlalchemy.orm import Session

from app.db.models.recruiter import RecruiterProfile
from app.db.models.user import User
from app.recruiters.schemas import RecruiterProfileUpdate


def get_or_create_profile(db: Session, user: User) -> RecruiterProfile:
    profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
    if not profile:
        profile = RecruiterProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def update_profile(db: Session, user: User, payload: RecruiterProfileUpdate) -> RecruiterProfile:
    profile = get_or_create_profile(db, user)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile
