import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import String, Integer, Float, Boolean, DateTime, ForeignKey, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    iti: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    trade: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    education: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    experience: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    career_goal: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    preferred_industry: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    preferred_location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    skill_confidence: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    profile_completion: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    career_readiness_score: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    preferred_language: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="student_profile")
    skills: Mapped[List["StudentSkill"]] = relationship(
        "StudentSkill", back_populates="student_profile", cascade="all, delete-orphan"
    )
    interests: Mapped[List["StudentInterest"]] = relationship(
        "StudentInterest", back_populates="student_profile", cascade="all, delete-orphan"
    )
    applications = relationship(
        "Application", back_populates="student", cascade="all, delete-orphan"
    )
    learning_progress = relationship(
        "LearningProgress", back_populates="student", cascade="all, delete-orphan"
    )
    mentor_assignments = relationship(
        "MentorAssignment", back_populates="student", cascade="all, delete-orphan"
    )


class StudentSkill(Base):
    __tablename__ = "student_skills"
    __table_args__ = (UniqueConstraint("student_profile_id", "skill_name", name="uq_student_skill"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    skill_name: Mapped[str] = mapped_column(String(255), nullable=False)
    is_gap: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student_profile = relationship("StudentProfile", back_populates="skills")


class StudentInterest(Base):
    __tablename__ = "student_interests"
    __table_args__ = (UniqueConstraint("student_profile_id", "interest", name="uq_student_interest"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_profile_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    interest: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    student_profile = relationship("StudentProfile", back_populates="interests")
