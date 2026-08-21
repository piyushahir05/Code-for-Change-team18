import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.admin import service
from app.admin.schemas import AnalyticsOut
from app.auth.schemas import UserOut
from app.core.dependencies import require_admin
from app.db.models.opportunity import OpportunityStatus
from app.db.models.user import User, UserRole
from app.db.session import get_db
from app.opportunities import service as opportunities_service
from app.opportunities.schemas import OpportunityOut
from app.users import service as users_service

router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])


@router.get("/verifications", response_model=List[UserOut])
def list_verifications(role: Optional[UserRole] = None, db: Session = Depends(get_db)):
    return users_service.list_unverified_users(db, role)


@router.put("/users/{user_id}/verify", response_model=UserOut)
def verify_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    user = users_service.get_user_or_404(db, user_id)
    return service.verify_user_and_notify(db, user)


# IMPLEMENTATION ASSUMPTION: section 32 defines approve/reject routes but not
# a listing route for the admin opportunity-approval queue (section 36
# requires one). Defaults to PENDING to match the approval queue's purpose.
@router.get("/opportunities", response_model=List[OpportunityOut])
def list_opportunities_for_review(
    status: OpportunityStatus = OpportunityStatus.PENDING,
    admin: User = Depends(require_admin),
    db: Session = Depends(get_db),
):
    opportunities = opportunities_service.list_opportunities_for_viewer(db, admin, status)
    return [OpportunityOut.from_model(o) for o in opportunities]


@router.put("/opportunities/{opportunity_id}/approve", response_model=OpportunityOut)
def approve_opportunity(opportunity_id: uuid.UUID, db: Session = Depends(get_db)):
    opportunity = service.approve_opportunity(db, opportunity_id)
    return OpportunityOut.from_model(opportunity)


@router.put("/opportunities/{opportunity_id}/reject", response_model=OpportunityOut)
def reject_opportunity(opportunity_id: uuid.UUID, db: Session = Depends(get_db)):
    opportunity = service.reject_opportunity(db, opportunity_id)
    return OpportunityOut.from_model(opportunity)


@router.get("/analytics", response_model=AnalyticsOut)
def analytics(db: Session = Depends(get_db)):
    return service.get_analytics(db)
