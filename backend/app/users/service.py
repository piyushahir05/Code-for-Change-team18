import uuid
from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.errors import NotFoundError
from app.db.models.user import User, UserRole


def get_user_or_404(db: Session, user_id: uuid.UUID) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise NotFoundError("User not found")
    return user


def list_unverified_users(db: Session, role: Optional[UserRole] = None) -> List[User]:
    query = db.query(User).filter(User.is_verified.is_(False))
    if role:
        query = query.filter(User.role == role)
    return query.order_by(User.created_at.asc()).all()


def verify_user(db: Session, user_id: uuid.UUID) -> User:
    user = get_user_or_404(db, user_id)
    user.is_verified = True
    db.commit()
    db.refresh(user)
    return user
