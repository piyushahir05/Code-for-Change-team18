from sqlalchemy.orm import Session

from app.db.models.student import StudentInterest, StudentProfile, StudentSkill
from app.db.models.user import User
from app.recommendations.service import recommendation_service
from app.students.schemas import StudentProfileUpdate

_BASE_FIELDS = [
    "age", "gender", "location", "iti", "trade", "education", "experience",
    "career_goal", "preferred_industry", "preferred_location",
    "skill_confidence", "preferred_language",
]


def _recalculate_completion(profile: StudentProfile) -> int:
    filled = sum(1 for field in _BASE_FIELDS if getattr(profile, field))
    total = len(_BASE_FIELDS) + 2  # + skills + interests
    if profile.skills:
        filled += 1
    if profile.interests:
        filled += 1
    return round((filled / total) * 100)


def get_or_create_profile(db: Session, user: User) -> StudentProfile:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user.id).first()
    if not profile:
        profile = StudentProfile(user_id=user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


def update_profile(db: Session, user: User, payload: StudentProfileUpdate) -> StudentProfile:
    profile = get_or_create_profile(db, user)

    update_data = payload.model_dump(exclude_unset=True, exclude={"skills", "interests"})
    for field, value in update_data.items():
        setattr(profile, field, value)

    if payload.skills is not None:
        profile.skills = [
            StudentSkill(skill_name=s.skill_name, is_gap=s.is_gap) for s in payload.skills
        ]
    if payload.interests is not None:
        profile.interests = [StudentInterest(interest=i) for i in payload.interests]

    db.flush()
    profile.profile_completion = _recalculate_completion(profile)
    profile.career_readiness_score = recommendation_service.get_career_readiness_score(profile)

    db.commit()
    db.refresh(profile)
    return profile


def refresh_readiness_score(db: Session, profile: StudentProfile) -> StudentProfile:
    profile.career_readiness_score = recommendation_service.get_career_readiness_score(profile)
    db.commit()
    db.refresh(profile)
    return profile
