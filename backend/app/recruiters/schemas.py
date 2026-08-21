import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class RecruiterProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None


class RecruiterProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    industry: Optional[str] = None
    website: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
