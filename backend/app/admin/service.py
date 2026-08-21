from sqlalchemy.orm import Session

from app.admin.schemas import AnalyticsOut
from app.db.models.application import Application, ApplicationStatus
from app.db.models.mentor import MentorProfile
from app.db.models.opportunity import Opportunity, OpportunityStatus
from app.db.models.recruiter import RecruiterProfile
from app.db.models.student import StudentProfile
from app.db.models.user import User, UserRole, VerificationStatus
from app.notifications.service import create_notification
from app.opportunities.service import set_opportunity_status


def approve_opportunity(db: Session, opportunity_id: int) -> Opportunity:
    opportunity = set_opportunity_status(db, opportunity_id, OpportunityStatus.ACTIVE)
    if opportunity.recruiter and opportunity.recruiter.user_id:
        create_notification(
            db,
            user_id=opportunity.recruiter.user_id,
            title="Opportunity approved",
            message=f"Your opportunity '{opportunity.title}' was approved and is now visible to students.",
            type="OPPORTUNITY_APPROVED",
        )
    return opportunity


def reject_opportunity(db: Session, opportunity_id: int) -> Opportunity:
    # NOTE: the actual opportunity_status enum has no dedicated REJECTED value
    # (draft/active/closed/filled only) - CLOSED is the closest available
    # terminal, non-visible state. See app/db/models/opportunity.py docstring.
    opportunity = set_opportunity_status(db, opportunity_id, OpportunityStatus.CLOSED)
    if opportunity.recruiter and opportunity.recruiter.user_id:
        create_notification(
            db,
            user_id=opportunity.recruiter.user_id,
            title="Opportunity rejected",
            message=f"Your opportunity '{opportunity.title}' was not approved.",
            type="OPPORTUNITY_REJECTED",
        )
    return opportunity


def verify_user_and_notify(db: Session, user: User) -> User:
    user.verification_status = VerificationStatus.VERIFIED

    # recruiter_profiles keeps its own (denormalized, mirrored) verification_status
    # column in the actual schema - keep it in sync.
    if user.role == UserRole.RECRUITER:
        recruiter = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == user.id).first()
        if recruiter:
            recruiter.verification_status = VerificationStatus.VERIFIED

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
        db.query(User)
        .filter(User.role == UserRole.STUDENT, User.verification_status == VerificationStatus.VERIFIED)
        .count()
    )
    total_mentors = db.query(MentorProfile).count()
    total_recruiters = db.query(RecruiterProfile).count()
    verified_recruiters = (
        db.query(User)
        .filter(User.role == UserRole.RECRUITER, User.verification_status == VerificationStatus.VERIFIED)
        .count()
    )
    active_opportunities = (
        db.query(Opportunity).filter(Opportunity.status == OpportunityStatus.ACTIVE).count()
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
