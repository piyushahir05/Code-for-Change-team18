import uuid

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.errors import ForbiddenError, NotFoundError
from app.core.security import decode_supabase_jwt
from app.db.models.mentor import MentorProfile
from app.db.models.recruiter import RecruiterProfile
from app.db.models.student import StudentProfile
from app.db.models.user import User, UserRole
from app.db.session import get_db

bearer_scheme = HTTPBearer(auto_error=True)


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    db: Session = Depends(get_db),
) -> User:
    """
    Validates the Supabase-issued JWT, then loads the matching application
    user. The frontend/role claimed by the token is never trusted for
    authorization - only the `users.role` column loaded here is used.
    """
    payload = decode_supabase_jwt(credentials.credentials)
    raw_user_id = payload.get("sub")
    if not raw_user_id:
        raise NotFoundError("Invalid authentication token")
    try:
        supabase_user_id = uuid.UUID(raw_user_id)
    except (ValueError, TypeError):
        raise NotFoundError("Invalid authentication token")

    user = db.query(User).filter(User.id == supabase_user_id).first()
    if not user:
        raise NotFoundError(
            "Authenticated but no application user found. Complete registration via /api/auth/register."
        )
    return user


def require_role(*roles: UserRole):
    def checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise ForbiddenError(f"This action requires role(s): {', '.join(r.value for r in roles)}")
        return current_user

    return checker


require_student = require_role(UserRole.STUDENT)
require_mentor = require_role(UserRole.MENTOR)
require_recruiter = require_role(UserRole.RECRUITER)
require_admin = require_role(UserRole.ADMIN)


def get_current_student_profile(
    current_user: User = Depends(require_student),
    db: Session = Depends(get_db),
) -> StudentProfile:
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise NotFoundError("Student profile not found. Create it via PUT /api/students/profile first.")
    return profile


def get_current_mentor_profile(
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
) -> MentorProfile:
    profile = db.query(MentorProfile).filter(MentorProfile.user_id == current_user.id).first()
    if not profile:
        raise NotFoundError("Mentor profile not found. Create it via PUT /api/mentors/profile first.")
    return profile


def get_current_recruiter_profile(
    current_user: User = Depends(require_recruiter),
    db: Session = Depends(get_db),
) -> RecruiterProfile:
    profile = db.query(RecruiterProfile).filter(RecruiterProfile.user_id == current_user.id).first()
    if not profile:
        raise NotFoundError("Recruiter profile not found. Create it via PUT /api/recruiters/profile first.")
    return profile
