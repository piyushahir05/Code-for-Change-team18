from typing import List

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(min_length=1)


class ChatResponse(BaseModel):
    reply: str


class ProfileAnalysisResponse(BaseModel):
    summary: str
    focus_areas: List[str] = Field(default_factory=list)
    next_steps: List[str] = Field(default_factory=list)
