from typing import Optional

from pydantic import BaseModel

from app.db.models.user import VerificationStatus


class RecruiterProfileUpdate(BaseModel):
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None


class RecruiterProfileOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    company_name: Optional[str] = None
    company_description: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    verification_status: Optional[VerificationStatus] = None

    class Config:
        from_attributes = True
