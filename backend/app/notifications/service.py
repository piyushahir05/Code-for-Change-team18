import logging
from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from app.core.errors import ForbiddenError, NotFoundError
from app.db.models.notification import Notification

logger = logging.getLogger("app.notifications")


def create_notification(db: Session, user_id: int, title: str, message: str, type: str) -> Optional[Notification]:
    """
    Simple database-backed notification. Called internally by other modules
    on events such as verification, opportunity approval, application status
    changes, and mentorship updates.

    NOTE: the `notifications` table does not exist in the teammate's live
    schema yet - see backend/migrations/0001_*.sql for the proposed additive
    CREATE TABLE. Until that migration runs, this fails soft (logs and
    returns None) instead of raising, so a missing notifications table can
    never break the primary action it's attached to (e.g. an application
    status update must succeed even if the notification insert can't).
    """
    try:
        notification = Notification(
            user_id=user_id, title=title, message=message, type=type, created_at=datetime.utcnow()
        )
        db.add(notification)
        db.commit()
        db.refresh(notification)
        return notification
    except Exception:
        db.rollback()
        logger.warning(
            "Could not create notification (user_id=%s, type=%s) - has backend/migrations/0001_*.sql "
            "been applied yet?",
            user_id,
            type,
        )
        return None


def list_notifications_for_user(db: Session, user_id: int) -> List[Notification]:
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.id.desc())
        .all()
    )


def mark_notification_read(db: Session, user_id: int, notification_id: int) -> Notification:
    notification = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notification:
        raise NotFoundError("Notification not found")
    if notification.user_id != user_id:
        raise ForbiddenError("You cannot modify another user's notification")
    notification.read = True
    db.commit()
    db.refresh(notification)
    return notification
