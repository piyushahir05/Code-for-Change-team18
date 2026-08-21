import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_recruiter_profile, get_current_user
from app.db.models.opportunity import OpportunityStatus
from app.db.models.recruiter import RecruiterProfile
from app.db.models.user import User
from app.db.session import get_db
from app.opportunities import service
from app.opportunities.schemas import OpportunityCreate, OpportunityOut, OpportunityUpdate

router = APIRouter(prefix="/api/opportunities", tags=["opportunities"])


@router.get("", response_model=List[OpportunityOut])
def list_opportunities(
    status: Optional[OpportunityStatus] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Students/mentors always see APPROVED opportunities only. Recruiters see
    their own (any status). Admins may filter by any status."""
    opportunities = service.list_opportunities_for_viewer(db, current_user, status)
    return [OpportunityOut.from_model(o) for o in opportunities]


@router.get("/{opportunity_id}", response_model=OpportunityOut)
def get_opportunity(
    opportunity_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    opportunity = service.get_opportunity_for_viewer(db, opportunity_id, current_user)
    return OpportunityOut.from_model(opportunity)


@router.post("", response_model=OpportunityOut, status_code=201)
def create_opportunity(
    payload: OpportunityCreate,
    recruiter: RecruiterProfile = Depends(get_current_recruiter_profile),
    db: Session = Depends(get_db),
):
    """New opportunities always start PENDING and require admin approval
    before students can see them."""
    opportunity = service.create_opportunity(db, recruiter, payload)
    return OpportunityOut.from_model(opportunity)


@router.put("/{opportunity_id}", response_model=OpportunityOut)
def update_opportunity(
    opportunity_id: uuid.UUID,
    payload: OpportunityUpdate,
    recruiter: RecruiterProfile = Depends(get_current_recruiter_profile),
    db: Session = Depends(get_db),
):
    opportunity = service.update_opportunity(db, opportunity_id, recruiter, payload)
    return OpportunityOut.from_model(opportunity)
