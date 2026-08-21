import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class StudentSkillIn(BaseModel):
    skill_name: str
    is_gap: bool = False


class StudentSkillOut(BaseModel):
    id: uuid.UUID
    skill_name: str
    is_gap: bool

    class Config:
        from_attributes = True


class StudentInterestOut(BaseModel):
    id: uuid.UUID
    interest: str

    class Config:
        from_attributes = True


class StudentProfileUpdate(BaseModel):
    """
    IMPLEMENTATION ASSUMPTION: the master context does not define separate
    routes for entering skills/interests, only that they exist as relational
    tables. This endpoint accepts them as nested lists and replaces the
    student's full skill/interest set on each save (simplest onboarding UX -
    matches the "complete profile" capability in section 10).
    """

    age: Optional[int] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    iti: Optional[str] = None
    trade: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    career_goal: Optional[str] = None
    preferred_industry: Optional[str] = None
    preferred_location: Optional[str] = None
    skill_confidence: Optional[str] = None
    preferred_language: Optional[str] = None
    skills: Optional[List[StudentSkillIn]] = None
    interests: Optional[List[str]] = None


class StudentProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    age: Optional[int] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    iti: Optional[str] = None
    trade: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    career_goal: Optional[str] = None
    preferred_industry: Optional[str] = None
    preferred_location: Optional[str] = None
    skill_confidence: Optional[str] = None
    profile_completion: int
    career_readiness_score: float
    preferred_language: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    skills: List[StudentSkillOut] = Field(default_factory=list)
    interests: List[StudentInterestOut] = Field(default_factory=list)

    class Config:
        from_attributes = True
