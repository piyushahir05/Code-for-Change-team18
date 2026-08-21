from datetime import date
from typing import List, Optional

from pydantic import BaseModel, Field

from app.db.models.opportunity import OpportunityStatus, OpportunityType


class OpportunityCreate(BaseModel):
    type: OpportunityType
    title: str = Field(min_length=1)
    description: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[int] = None
    stipend: Optional[int] = None
    eligibility: Optional[str] = None
    experience: Optional[str] = None
    deadline: Optional[date] = None
    skills: List[str] = Field(default_factory=list)


class OpportunityUpdate(BaseModel):
    """Recruiters may edit their own opportunity's content. `status` is
    deliberately excluded - only admin approve/reject/close endpoints may
    change it, per the master context opportunity workflow."""

    type: Optional[OpportunityType] = None
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[int] = None
    stipend: Optional[int] = None
    eligibility: Optional[str] = None
    experience: Optional[str] = None
    deadline: Optional[date] = None
    skills: Optional[List[str]] = None


class OpportunityOut(BaseModel):
    id: int
    recruiter_id: Optional[int] = None
    type: Optional[OpportunityType] = None
    title: Optional[str] = None
    description: Optional[str] = None
    company: Optional[str] = None
    location: Optional[str] = None
    salary: Optional[int] = None
    stipend: Optional[int] = None
    eligibility: Optional[str] = None
    experience: Optional[str] = None
    deadline: Optional[date] = None
    status: Optional[OpportunityStatus] = None
    skills: List[str] = Field(default_factory=list)

    class Config:
        from_attributes = True

    @classmethod
    def from_model(cls, opportunity):
        data = {c: getattr(opportunity, c) for c in [
            "id", "recruiter_id", "type", "title", "description", "company",
            "location", "salary", "stipend", "eligibility", "experience",
            "deadline", "status",
        ]}
        data["skills"] = [s.skill_or_trade for s in opportunity.skills if s.skill_or_trade]
        return cls(**data)
