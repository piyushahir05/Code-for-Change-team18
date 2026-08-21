from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import require_recruiter
from app.db.models.user import User
from app.db.session import get_db
from app.recruiters import service
from app.recruiters.schemas import RecruiterProfileOut, RecruiterProfileUpdate

# IMPLEMENTATION ASSUMPTION: own-profile routes for "Create recruiter profile"
# (section 13) - not enumerated in section 32's route contract, which only
# lists the opportunity/application routes for recruiters.
router = APIRouter(prefix="/api/recruiters", tags=["recruiters"])


@router.get("/profile", response_model=RecruiterProfileOut)
def get_my_profile(current_user: User = Depends(require_recruiter), db: Session = Depends(get_db)):
    return service.get_or_create_profile(db, current_user)


@router.put("/profile", response_model=RecruiterProfileOut)
def update_my_profile(
    payload: RecruiterProfileUpdate,
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
):
    return service.update_profile(db, current_user, payload)
