from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.db.models.application import ApplicationStatus


class ApplicationCreate(BaseModel):
    opportunity_id: int


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationOut(BaseModel):
    id: int
    student_id: Optional[int] = None
    opportunity_id: Optional[int] = None
    status: Optional[ApplicationStatus] = None
    applied_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
