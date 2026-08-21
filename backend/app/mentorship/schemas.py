import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.db.models.mentorship import MentorshipMode, MentorshipStatus


class MentorshipRequestCreate(BaseModel):
    mentor_id: uuid.UUID
    topic: Optional[str] = None


class MentorshipScheduleRequest(BaseModel):
    mode: MentorshipMode
    scheduled_at: datetime
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    notes: Optional[str] = None


class MentorshipSessionOut(BaseModel):
    id: uuid.UUID
    mentor_id: uuid.UUID
    student_id: uuid.UUID
    mode: Optional[MentorshipMode] = None
    topic: Optional[str] = None
    scheduled_at: Optional[datetime] = None
    location: Optional[str] = None
    meeting_link: Optional[str] = None
    notes: Optional[str] = None
    status: MentorshipStatus
    created_at: datetime

    class Config:
        from_attributes = True
