from app.admin.schemas import AnalyticsOut
from app.db.models.application import Application, ApplicationStatus
from app.db.models.mentor import MentorProfile
from app.db.models.opportunity import Opportunity, OpportunityStatus
from app.db.models.recruiter import RecruiterProfile
from app.db.models.student import StudentProfile
from app.db.models.user import User, UserRole
from app.notifications.service import create_notification
from app.opportunities.service import set_opportunity_status
from sqlalchemy.orm import Session
import uuid


def approve_opportunity(db: Session, opportunity_id: uuid.UUID) -> Opportunity:
    opportunity = set_opportunity_status(db, opportunity_id, OpportunityStatus.APPROVED)
    create_notification(
        db,
        user_id=opportunity.recruiter.user_id,
        title="Opportunity approved",
        message=f"Your opportunity '{opportunity.title}' was approved and is now visible to students.",
        type="OPPORTUNITY_APPROVED",
    )
    return opportunity


def reject_opportunity(db: Session, opportunity_id: uuid.UUID) -> Opportunity:
    opportunity = set_opportunity_status(db, opportunity_id, OpportunityStatus.REJECTED)
    create_notification(
        db,
        user_id=opportunity.recruiter.user_id,
        title="Opportunity rejected",
        message=f"Your opportunity '{opportunity.title}' was not approved.",
        type="OPPORTUNITY_REJECTED",
    )
    return opportunity


def verify_user_and_notify(db: Session, user: User) -> User:
    user.is_verified = True
    db.commit()
    db.refresh(user)
    create_notification(
        db,
        user_id=user.id,
        title="Verification approved",
        message="Your account has been verified by an administrator.",
        type="VERIFICATION_APPROVED",
    )
    return user


def get_analytics(db: Session) -> AnalyticsOut:
    total_students = db.query(StudentProfile).count()
    verified_students = (
        db.query(User).filter(User.role == UserRole.STUDENT, User.is_verified.is_(True)).count()
    )
    total_mentors = db.query(MentorProfile).count()
    total_recruiters = db.query(RecruiterProfile).count()
    verified_recruiters = (
        db.query(User).filter(User.role == UserRole.RECRUITER, User.is_verified.is_(True)).count()
    )
    active_opportunities = (
        db.query(Opportunity).filter(Opportunity.status == OpportunityStatus.APPROVED).count()
    )
    total_applications = db.query(Application).count()
    placements = db.query(Application).filter(Application.status == ApplicationStatus.SELECTED).count()

    return AnalyticsOut(
        total_students=total_students,
        verified_students=verified_students,
        total_mentors=total_mentors,
        total_recruiters=total_recruiters,
        verified_recruiters=verified_recruiters,
        active_opportunities=active_opportunities,
        total_applications=total_applications,
        placements=placements,
    )
