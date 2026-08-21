import enum
import uuid
from datetime import datetime

from sqlalchemy import String, Boolean, DateTime, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    MENTOR = "MENTOR"
    ADMIN = "ADMIN"
    RECRUITER = "RECRUITER"


class User(Base):
    """
    Application-level user record.

    id mirrors the Supabase Auth user id (auth.users.id) - Supabase owns
    authentication/password storage, this table owns application/role data.
    """

    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole, name="user_role"), nullable=False)
    is_verified: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    student_profile = relationship(
        "StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    mentor_profile = relationship(
        "MentorProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    recruiter_profile = relationship(
        "RecruiterProfile", back_populates="user", uselist=False, cascade="all, delete-orphan"
    )
    notifications = relationship(
        "Notification", back_populates="user", cascade="all, delete-orphan"
    )
