import uuid

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from app.auth.schemas import AuthResponse, LoginRequest, RegisterRequest, UserOut
from app.core.dependencies import get_current_user
from app.core.errors import BadRequestError, ConflictError
from app.core.security import get_supabase_admin, get_supabase_anon
from app.db.models.user import User, UserRole
from app.db.session import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Creates the Supabase Auth user (source of truth for credentials) and the
    matching application `users` row, then signs the user in immediately.
    """
    if payload.role == UserRole.ADMIN:
        raise BadRequestError("Admin accounts cannot be created through public registration.")

    if db.query(User).filter(User.email == payload.email).first():
        raise ConflictError("An account with this email already exists.")

    admin_client = get_supabase_admin()
    anon_client = get_supabase_anon()
    if admin_client is None or anon_client is None:
        raise BadRequestError("Supabase is not configured on the server (missing SUPABASE_URL/keys).")

    try:
        created = admin_client.auth.admin.create_user(
            {
                "email": payload.email,
                "password": payload.password,
                "email_confirm": True,
                "user_metadata": {"full_name": payload.full_name, "role": payload.role.value},
            }
        )
    except Exception as exc:
        raise BadRequestError(f"Could not create Supabase Auth user: {exc}")
    supabase_user_id = uuid.UUID(str(created.user.id))

    user = User(
        id=supabase_user_id,
        email=payload.email,
        full_name=payload.full_name,
        role=payload.role,
        is_verified=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    try:
        session = anon_client.auth.sign_in_with_password(
            {"email": payload.email, "password": payload.password}
        )
    except Exception as exc:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"Could not sign in newly created user: {exc}")

    return AuthResponse(access_token=session.session.access_token, user=UserOut.model_validate(user))


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    anon_client = get_supabase_anon()
    if anon_client is None:
        raise BadRequestError("Supabase is not configured on the server (missing SUPABASE_URL/ANON_KEY).")

    try:
        session = anon_client.auth.sign_in_with_password(
            {"email": payload.email, "password": payload.password}
        )
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid email or password.")

    user = db.query(User).filter(User.id == uuid.UUID(str(session.user.id))).first()
    if not user:
        raise BadRequestError(
            "This account exists in Supabase Auth but has no application profile. Contact an admin."
        )

    return AuthResponse(access_token=session.session.access_token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return UserOut.model_validate(current_user)
