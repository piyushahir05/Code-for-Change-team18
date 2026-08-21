from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from app.db.models.learning import LearningStatus


class LearningResourceOut(BaseModel):
    id: int
    title: Optional[str] = None
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
    id: int
    resource_id: Optional[int] = None
    status: Optional[LearningStatus] = None
    progress_percentage: Optional[int] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    resource: LearningResourceOut

    class Config:
        from_attributes = True
