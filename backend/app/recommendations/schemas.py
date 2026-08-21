from typing import List

from pydantic import BaseModel

from app.opportunities.schemas import OpportunityOut


class RecommendedResource(BaseModel):
    id: str
    title: str
    skill: str | None = None
    reason: str


class RecommendationsOut(BaseModel):
    career_readiness_score: float
    skill_gaps: List[str]
    recommended_learning: List[RecommendedResource]
    recommended_career_paths: List[str]
    recommended_opportunities: List[OpportunityOut]
