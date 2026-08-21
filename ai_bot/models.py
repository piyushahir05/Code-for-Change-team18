from pydantic import BaseModel
from typing import Optional, List


class ChatRequest(BaseModel):
    student_id: int
    message: Optional[str] = None  # None = open chatbot (dashboard mode)


class RecommendedTopic(BaseModel):
    topic: str
    reason: str


class RecommendedCourse(BaseModel):
    course: str
    reason: str


class RoadmapStep(BaseModel):
    step: int
    title: str
    description: str


class NextAction(BaseModel):
    title: str
    description: str


class ChatResponse(BaseModel):
    greeting: str
    profile_summary: str
    recommended_topics: List[RecommendedTopic]
    recommended_courses: List[RecommendedCourse]
    roadmap: List[RoadmapStep]
    next_action: NextAction
    model_used: Optional[str] = None   # which model actually responded
    error: Optional[str] = None


class StudentListItem(BaseModel):
    id: int
    name: str
    trade: str
    career_goal: str
    career_readiness_score: int
