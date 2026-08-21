from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from app.core.errors import ForbiddenError, NotFoundError
from app.db.models.opportunity import Opportunity, OpportunitySkill, OpportunityStatus
from app.db.models.recruiter import RecruiterProfile
from app.db.models.user import User, UserRole, VerificationStatus
from app.opportunities.schemas import OpportunityCreate, OpportunityUpdate


def _base_query(db: Session):
    return db.query(Opportunity).options(joinedload(Opportunity.skills))


def create_opportunity(db: Session, recruiter: RecruiterProfile, payload: OpportunityCreate) -> Opportunity:
    # Master Context section 13: "Recruiter cannot directly publish an
    # opportunity" until NGO-verified.
    if recruiter.verification_status != VerificationStatus.VERIFIED:
        raise ForbiddenError("Your recruiter account must be verified by an admin before you can create opportunities")

    opportunity = Opportunity(
        recruiter_id=recruiter.id,
        type=payload.type,
        title=payload.title,
        description=payload.description,
        company=payload.company,
        location=payload.location,
        salary=payload.salary,
        stipend=payload.stipend,
        eligibility=payload.eligibility,
        experience=payload.experience,
        deadline=payload.deadline,
        status=OpportunityStatus.DRAFT,
    )
    opportunity.skills = [OpportunitySkill(skill_or_trade=s) for s in payload.skills]
    db.add(opportunity)
    db.commit()
    db.refresh(opportunity)
    return opportunity


def get_opportunity_or_404(db: Session, opportunity_id: int) -> Opportunity:
    opportunity = _base_query(db).filter(Opportunity.id == opportunity_id).first()
    if not opportunity:
        raise NotFoundError("Opportunity not found")
    return opportunity


def get_opportunity_for_viewer(db: Session, opportunity_id: int, current_user: User) -> Opportunity:
    opportunity = get_opportunity_or_404(db, opportunity_id)
    if opportunity.status != OpportunityStatus.ACTIVE:
        is_owner = (
            current_user.role == UserRole.RECRUITER
            and current_user.recruiter_profile
            and opportunity.recruiter_id == current_user.recruiter_profile.id
        )
        is_admin = current_user.role == UserRole.ADMIN
        if not (is_owner or is_admin):
            raise NotFoundError("Opportunity not found")
    return opportunity


def list_opportunities_for_viewer(
    db: Session, current_user: User, status: Optional[OpportunityStatus] = None
) -> List[Opportunity]:
    query = _base_query(db)

    if current_user.role == UserRole.ADMIN:
        if status:
            query = query.filter(Opportunity.status == status)
    elif current_user.role == UserRole.RECRUITER:
        if not current_user.recruiter_profile:
            return []
        query = query.filter(Opportunity.recruiter_id == current_user.recruiter_profile.id)
        if status:
            query = query.filter(Opportunity.status == status)
    else:
        # Students and mentors only ever see active (admin-approved) opportunities.
        query = query.filter(Opportunity.status == OpportunityStatus.ACTIVE)

    return query.order_by(Opportunity.id.desc()).all()


def update_opportunity(
    db: Session, opportunity_id: int, recruiter: RecruiterProfile, payload: OpportunityUpdate
) -> Opportunity:
    opportunity = get_opportunity_or_404(db, opportunity_id)
    if opportunity.recruiter_id != recruiter.id:
        raise ForbiddenError("You can only edit your own opportunities")

    update_data = payload.model_dump(exclude_unset=True, exclude={"skills"})
    for field, value in update_data.items():
        setattr(opportunity, field, value)

    if payload.skills is not None:
        opportunity.skills = [OpportunitySkill(skill_or_trade=s) for s in payload.skills]

    db.commit()
    db.refresh(opportunity)
    return opportunity


def set_opportunity_status(db: Session, opportunity_id: int, status: OpportunityStatus) -> Opportunity:
    opportunity = get_opportunity_or_404(db, opportunity_id)
    opportunity.status = status
    db.commit()
    db.refresh(opportunity)
    return opportunity
