import uuid
from typing import List

from sqlalchemy.orm import Session

from app.core.errors import ForbiddenError, NotFoundError
from app.db.models.notification import Notification


def create_notification(db: Session, user_id: uuid.UUID, title: str, message: str, type: str) -> Notification:
    """Simple database-backed notification. Called internally by other modules
    on events such as verification, opportunity approval, application status
    changes, and mentorship updates."""
    notification = Notification(user_id=user_id, title=title, message=message, type=type)
    db.add(notification)
    db.commit()
    db.refresh(notification)
    return notification


def list_notifications_for_user(db: Session, user_id: uuid.UUID) -> List[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.created_at.desc())
        .all()
    )


def mark_notification_read(db: Session, user_id: uuid.UUID, notification_id: uuid.UUID) -> Notification:
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise NotFoundError("Notification not found")
    if notification.user_id != user_id:
        raise ForbiddenError("You cannot modify another user's notification")
    notification.read = True
    db.commit()
    db.refresh(notification)
    return notification
