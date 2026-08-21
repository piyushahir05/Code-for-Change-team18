import uuid
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_user
from app.db.models.user import User
from app.db.session import get_db
from app.notifications import service
from app.notifications.schemas import NotificationOut

# IMPLEMENTATION ASSUMPTION: the master context defines the notifications
# table and its triggers but no dedicated route in the shared API contract.
# These two endpoints back the notification bell shown on every dashboard.
router = APIRouter(prefix="/api/notifications", tags=["notifications"])


@router.get("", response_model=List[NotificationOut])
def list_my_notifications(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return service.list_notifications_for_user(db, current_user.id)


@router.put("/{notification_id}/read", response_model=NotificationOut)
def mark_read(
    notification_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.mark_notification_read(db, current_user.id, notification_id)
