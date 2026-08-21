from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.errors import NotFoundError
from app.db.models.recruiter import RecruiterProfile
from app.db.models.user import User, UserRole, VerificationStatus


def get_user_or_404(db: Session, user_id: int) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")
    return user


def list_unverified_users(db: Session, role: Optional[UserRole] = None) -> List[User]:
    query = db.query(User).filter(User.verification_status == VerificationStatus.PENDING)
    if role:
        query = query.filter(User.role == role)
    return query.order_by(User.id.asc()).all()


def verify_user(db: Session, user_id: int) -> User:
    user = get_user_or_404(db, user_id)
    user.verification_status = VerificationStatus.VERIFIED

    # recruiter_profiles keeps its own (denormalized, mirrored) verification_status
    # column in the actual schema - keep it in sync.
    if user.role == UserRole.RECRUITER:
        recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
        if recruiter:
            recruiter.verification_status = VerificationStatus.VERIFIED

    db.commit()
    db.refresh(user)
    return user
