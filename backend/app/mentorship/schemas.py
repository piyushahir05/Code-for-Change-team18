from datetime import datetime
from typing import Optional

from pydantic import BaseModel, model_validator

from app.db.models.mentorship import MentorshipMode, MentorshipStatus


class MentorshipRequestCreate(BaseModel):
    mentor_id: int
    # mentor_meetings.scheduled_start/scheduled_end are NOT NULL in the actual
    # schema, so a request must propose a concrete time window up front
    # (there's no separate "just ask, pick a time later" state available).
    scheduled_start: datetime
    scheduled_end: datetime
    topic: Optional[str] = None

    @model_validator(mode="after")
    def _check_window(self):
        if self.scheduled_end <= self.scheduled_start:
            raise ValueError("scheduled_end must be after scheduled_start")
        return self


class MentorshipScheduleRequest(BaseModel):
    """
    NOTE: `mode` and `location` require the additive migration in
    backend/migrations/0001_*.sql (mentor_meetings has no such columns yet).
    """

    mode: MentorshipMode
    scheduled_start: Optional[datetime] = None
    scheduled_end: Optional[datetime] = None
    meeting_link: Optional[str] = None
    location: Optional[str] = None

    @model_validator(mode="after")
    def _check_channel(self):
        if self.mode == MentorshipMode.PHYSICAL and not self.location:
            raise ValueError("location is required for a PHYSICAL mentorship session")
        if self.mode == MentorshipMode.ONLINE and not self.meeting_link:
            raise ValueError("meeting_link is required for an ONLINE mentorship session")
        return self


class MentorshipSessionOut(BaseModel):
    id: int
    mentor_id: int
    student_id: int
    assignment_id: int
    mode: Optional[str] = None
    topic: Optional[str] = None
    scheduled_start: datetime
    scheduled_end: datetime
    meeting_link: Optional[str] = None
    location: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
