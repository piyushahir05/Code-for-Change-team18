import uuid
from typing import List, Optional

from sqlalchemy.exc import IntegrityError
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
    if not opportunity or opportunity.status != OpportunityStatus.APPROVED:
        raise NotFoundError("Opportunity not found or not open for applications")

    existing = (
        db.query(Application)
        .filter(Application.student_id == student.id, Application.opportunity_id == opportunity.id)
        .first()
    )
    if existing:
        raise ConflictError("You have already applied to this opportunity")

    application = Application(student_id=student.id, opportunity_id=opportunity.id, status=ApplicationStatus.APPLIED)
    db.add(application)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise ConflictError("You have already applied to this opportunity")
    db.refresh(application)
    return application


def list_applications_for_student(db: Session, student: StudentProfile) -> List[Application]:
    return (
        db.query(Application)
        .filter(Application.student_id == student.id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def list_applications_for_recruiter(
    db: Session, recruiter: RecruiterProfile, opportunity_id: Optional[uuid.UUID] = None
) -> List[Application]:
    query = (
        db.query(Application)
        .join(Opportunity, Application.opportunity_id == Opportunity.id)
        .filter(Opportunity.recruiter_id == recruiter.id)
    )
    if opportunity_id:
        query = query.filter(Application.opportunity_id == opportunity_id)
    return query.order_by(Application.applied_at.desc()).all()


def update_application_status(
    db: Session, recruiter: RecruiterProfile, application_id: uuid.UUID, new_status: ApplicationStatus
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
    db.commit()
    db.refresh(application)

    student_user_id = application.student.user_id
    create_notification(
        db,
        user_id=student_user_id,
        title="Application status updated",
        message=f"Your application for '{opportunity.title}' is now {new_status.value}.",
        type="APPLICATION_STATUS",
    )
    return application
