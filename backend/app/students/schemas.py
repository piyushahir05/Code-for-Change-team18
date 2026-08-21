from typing import List, Optional

from pydantic import BaseModel, Field


class StudentSkillIn(BaseModel):
    skill_name: str
    is_gap: bool = False


class StudentSkillOut(BaseModel):
    id: int
    skill_name: Optional[str] = None
    is_gap: Optional[bool] = None

    class Config:
        from_attributes = True


class StudentInterestOut(BaseModel):
    id: int
    interest: Optional[str] = None

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
    # NOTE: skill_confidence is an integer in the actual schema (e.g. a 0-100
    # self-rating), not free text.
    skill_confidence: Optional[int] = None
    preferred_language: Optional[str] = None
    skills: Optional[List[StudentSkillIn]] = None
    interests: Optional[List[str]] = None


class StudentProfileOut(BaseModel):
    id: int
    user_id: Optional[int] = None
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
    skill_confidence: Optional[int] = None
    profile_completion: Optional[int] = None
    career_readiness_score: Optional[int] = None
    preferred_language: Optional[str] = None
    skills: List[StudentSkillOut] = Field(default_factory=list)
    interests: List[StudentInterestOut] = Field(default_factory=list)

    class Config:
        from_attributes = True
