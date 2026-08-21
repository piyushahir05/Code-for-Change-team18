from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.schemas import AuthResponse, LoginRequest, RegisterRequest, UserOut
from app.core.dependencies import get_current_user
from app.core.errors import BadRequestError, ConflictError
from app.core.security import create_access_token, hash_password, verify_password
from app.db.models.user import User, UserRole, VerificationStatus
from app.db.session import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    This schema has no Supabase Auth link (no auth.users FK) - public.users
    owns its own password_hash column directly. Registration hashes the
    password with bcrypt (the same format Postgres pgcrypto's
    crypt(password, gen_salt('bf')) produces, so seeded demo accounts and
    accounts created here are interchangeable) and issues our own JWT.
    """
    if payload.role == UserRole.ADMIN:
        raise BadRequestError("Admin accounts cannot be created through public registration.")

    if db.query(User).filter(User.email == payload.email).first():
        raise ConflictError("An account with this email already exists.")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password),
        role=payload.role,
        verification_status=VerificationStatus.PENDING,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(user.id)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")

    token = create_access_token(user.id)
    return AuthResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)
