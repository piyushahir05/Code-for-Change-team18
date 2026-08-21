import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.applications import service
from app.applications.schemas import ApplicationCreate, ApplicationOut, ApplicationStatusUpdate
from app.core.dependencies import get_current_recruiter_profile, get_current_student_profile
from app.db.models.recruiter import RecruiterProfile
from app.db.models.student import StudentProfile
from app.db.session import get_db

router = APIRouter(prefix="/api/applications", tags=["applications"])


@router.post("", response_model=ApplicationOut, status_code=201)
def apply_to_opportunity(
    payload: ApplicationCreate,
    student: StudentProfile = Depends(get_current_student_profile),
    db: Session = Depends(get_db),
):
    application = service.create_application(db, student, payload)
    return ApplicationOut.model_validate(application)


@router.get("/student", response_model=List[ApplicationOut])
def list_my_applications(
    student: StudentProfile = Depends(get_current_student_profile),
    db: Session = Depends(get_db),
):
    applications = service.list_applications_for_student(db, student)
    return [ApplicationOut.model_validate(a) for a in applications]


@router.get("/recruiter", response_model=List[ApplicationOut])
def list_applications_for_my_opportunities(
    opportunity_id: Optional[uuid.UUID] = None,
    recruiter: RecruiterProfile = Depends(get_current_recruiter_profile),
    db: Session = Depends(get_db),
):
    applications = service.list_applications_for_recruiter(db, recruiter, opportunity_id)
    return [ApplicationOut.model_validate(a) for a in applications]


@router.put("/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: uuid.UUID,
    payload: ApplicationStatusUpdate,
    recruiter: RecruiterProfile = Depends(get_current_recruiter_profile),
    db: Session = Depends(get_db),
):
    application = service.update_application_status(db, recruiter, application_id, payload.status)
    return ApplicationOut.model_validate(application)
