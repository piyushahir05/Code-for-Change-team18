from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session

from app.applications.schemas import ApplicationCreate
from app.core.errors import BadRequestError, ConflictError, ForbiddenError, NotFoundError
from app.db.models.application import Application, ApplicationStatus
from app.db.models.opportunity import Opportunity, OpportunityStatus
from app.db.models.recruiter import RecruiterProfile
from app.db.models.student import StudentProfile
from app.notifications.service import create_notification


def create_application(db: Session, student: StudentProfile, payload: ApplicationCreate) -> Application:
    opportunity = db.query(Opportunity).filter(Opportunity.id == payload.opportunity_id).first()
    if not opportunity or opportunity.status != OpportunityStatus.ACTIVE:
        raise NotFoundError("Opportunity not found or not open for applications")

    # NOTE: the actual applications table has no UNIQUE(student_id, opportunity_id)
    # constraint (unlike the Master Context spec) - this pre-check is the only
    # duplicate-prevention in place until the proposed additive migration in
    # backend/migrations/ adds that constraint.
    existing = (
        db.query(Application)
        .filter(Application.student_id == student.id, Application.opportunity_id == opportunity.id)
        .first()
    )
    if existing:
        raise ConflictError("You have already applied to this opportunity")

    now = datetime.utcnow()
    application = Application(
        student_id=student.id,
        opportunity_id=opportunity.id,
        status=ApplicationStatus.APPLIED,
        applied_at=now,
        updated_at=now,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


def list_applications_for_student(db: Session, student: StudentProfile) -> List[Application]:
    return (
        db.query(Application)
        .filter(Application.student_id == student.id)
        .order_by(Application.id.desc())
        .all()
    )


def list_applications_for_recruiter(
    db: Session, recruiter: RecruiterProfile, opportunity_id: Optional[int] = None
) -> List[Application]:
    query = (
        db.query(Application)
        .join(Opportunity, Application.opportunity_id == Opportunity.id)
        .filter(Opportunity.recruiter_id == recruiter.id)
    )
    if opportunity_id:
        query = query.filter(Application.opportunity_id == opportunity_id)
    return query.order_by(Application.id.desc()).all()


def update_application_status(
    db: Session, recruiter: RecruiterProfile, application_id: int, new_status: ApplicationStatus
) -> Application:
    application = db.query(Application).filter(Application.id == application_id).first()
    if not application:
        raise NotFoundError("Application not found")

    opportunity = db.query(Opportunity).filter(Opportunity.id == application.opportunity_id).first()
    if not opportunity or opportunity.recruiter_id != recruiter.id:
        raise ForbiddenError("You can only manage applications for your own opportunities")

    if new_status == ApplicationStatus.APPLIED:
        raise BadRequestError("Cannot manually revert an application back to APPLIED")

    application.status = new_status
    application.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(application)

    student_user_id = application.student.user_id
    if student_user_id:
        create_notification(
            db,
            user_id=student_user_id,
            title="Application status updated",
            message=f"Your application for '{opportunity.title}' is now {new_status.value}.",
            type="APPLICATION_STATUS",
        )
    return application
