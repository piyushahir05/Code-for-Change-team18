import uuid
from datetime import datetime

from pydantic import BaseModel


class NotificationOut(BaseModel):
    id: uuid.UUID
    title: str
    message: str
    type: str
    read: bool
    created_at: datetime

    class Config:
        from_attributes = True
