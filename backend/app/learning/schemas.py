import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.db.models.learning import LearningStatus


class LearningResourceOut(BaseModel):
    id: uuid.UUID
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    skill: Optional[str] = None
    trade: Optional[str] = None
    language: Optional[str] = None
    difficulty: Optional[str] = None
    duration: Optional[str] = None
    source: Optional[str] = None
    external_url: Optional[str] = None

    class Config:
        from_attributes = True


class LearningProgressUpdate(BaseModel):
    status: LearningStatus
    progress_percentage: int = Field(ge=0, le=100)


class LearningProgressOut(BaseModel):
    id: uuid.UUID
    resource_id: uuid.UUID
    status: LearningStatus
    progress_percentage: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    resource: LearningResourceOut

    class Config:
        from_attributes = True
