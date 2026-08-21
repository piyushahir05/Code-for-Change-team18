from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.ai.schemas import ChatRequest, ChatResponse, ProfileAnalysisResponse
from app.ai.service import ai_service
from app.core.dependencies import get_current_user, require_student
from app.db.models.student import StudentProfile
from app.db.models.user import User
from app.db.session import get_db
from app.recommendations.service import recommendation_service

router = APIRouter(prefix="/api/ai", tags=["ai"])


def _build_student_context(db: Session, profile: Optional[StudentProfile]) -> Optional[dict]:
    if not profile:
        return None
    return {
        "trade": profile.trade,
        "career_goal": profile.career_goal,
        "preferred_industry": profile.preferred_industry,
        "preferred_location": profile.preferred_location,
        "experience": profile.experience,
        "skills": [s.skill_name for s in profile.skills],
        "skill_gaps": recommendation_service.get_skill_gaps(profile),
        "interests": [i.interest for i in profile.interests],
        "career_readiness_score": recommendation_service.get_career_readiness_score(profile),
    }


@router.post("/profile-analysis", response_model=ProfileAnalysisResponse)
def profile_analysis(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    from app.students.service import get_or_create_profile

    profile = get_or_create_profile(db, current_user)
    context = _build_student_context(db, profile)
    result = ai_service.profile_analysis(context or {})
    return ProfileAnalysisResponse(**result)


@router.post("/chat", response_model=ChatResponse)
def chat(
    payload: ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    context = _build_student_context(db, current_user.student_profile)
    reply = ai_service.chat(payload.message, context)
    return ChatResponse(reply=reply)
