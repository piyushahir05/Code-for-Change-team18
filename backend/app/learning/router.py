import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_student_profile
from app.db.models.student import StudentProfile
from app.db.session import get_db
from app.learning import service
from app.learning.schemas import LearningProgressOut, LearningProgressUpdate, LearningResourceOut

router = APIRouter(prefix="/api/resources", tags=["learning"])


@router.get("", response_model=List[LearningResourceOut])
def list_resources(
    category: Optional[str] = None,
    skill: Optional[str] = None,
    trade: Optional[str] = None,
    db: Session = Depends(get_db),
):
    return service.list_resources(db, category, skill, trade)


@router.get("/recommended", response_model=List[LearningResourceOut])
def recommended_resources(
    student: StudentProfile = Depends(get_current_student_profile),
    db: Session = Depends(get_db),
):
    return service.get_recommended_resources(db, student)


@router.post("/{resource_id}/progress", response_model=LearningProgressOut)
def update_progress(
    resource_id: uuid.UUID,
    payload: LearningProgressUpdate,
    student: StudentProfile = Depends(get_current_student_profile),
    db: Session = Depends(get_db),
):
    return service.update_progress(db, student, resource_id, payload.status, payload.progress_percentage)
