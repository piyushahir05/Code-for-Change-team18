from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_student_profile, require_student
from app.db.models.student import StudentProfile
from app.db.models.user import User
from app.db.session import get_db
from app.learning.schemas import LearningProgressOut
from app.learning.service import list_progress_for_student
from app.opportunities.schemas import OpportunityOut
from app.recommendations.schemas import RecommendationsOut
from app.recommendations.service import recommendation_service
from app.students import service
from app.students.schemas import StudentProfileOut, StudentProfileUpdate

router = APIRouter(prefix="/api/students", tags=["students"])


@router.get("/profile", response_model=StudentProfileOut)
def get_profile(current_user: User = Depends(require_student), db: Session = Depends(get_db)):
    profile = service.get_or_create_profile(db, current_user)
    return profile


@router.put("/profile", response_model=StudentProfileOut)
def update_profile(
    payload: StudentProfileUpdate,
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
):
    return service.update_profile(db, current_user, payload)


@router.get("/recommendations", response_model=RecommendationsOut)
def get_recommendations(
    student: StudentProfile = Depends(get_current_student_profile),
    db: Session = Depends(get_db),
):
    service.refresh_readiness_score(db, student)
    data = recommendation_service.get_student_recommendations(db, student)
    data["recommended_opportunities"] = [
        OpportunityOut.from_model(o) for o in data["recommended_opportunities"]
    ]
    return data


@router.get("/progress", response_model=List[LearningProgressOut])
def get_progress(
    student: StudentProfile = Depends(get_current_student_profile),
    db: Session = Depends(get_db),
):
    return list_progress_for_student(db, student)
