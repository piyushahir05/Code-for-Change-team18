import uuid
from datetime import datetime

from pydantic import BaseModel

from app.db.models.application import ApplicationStatus


class ApplicationCreate(BaseModel):
    opportunity_id: uuid.UUID


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationOut(BaseModel):
    id: uuid.UUID
    student_id: uuid.UUID
    opportunity_id: uuid.UUID
    status: ApplicationStatus
    applied_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
