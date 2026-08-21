from typing import Optional

from pydantic import BaseModel, EmailStr, Field

from app.db.models.user import UserRole, VerificationStatus


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str = Field(min_length=1)
    # Public registration cannot create ADMIN accounts.
    role: UserRole = UserRole.STUDENT


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: Optional[str] = None
    name: Optional[str] = None
    role: Optional[UserRole] = None
    verification_status: Optional[VerificationStatus] = None

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
