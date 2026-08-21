from typing import List, Optional

from sqlalchemy import String, Integer, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=True
    )

    age: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    gender: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    iti: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    trade: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    education: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    experience: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    career_goal: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    preferred_industry: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    preferred_location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    # NOTE: skill_confidence is an int in the actual schema (not free text).
    skill_confidence: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    profile_completion: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    career_readiness_score: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    preferred_language: Mapped[Optional[str]] = mapped_column(String, nullable=True)

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

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_profile_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    skill_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_gap: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)

    student_profile = relationship("StudentProfile", back_populates="skills")


class StudentInterest(Base):
    __tablename__ = "student_interests"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_profile_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    interest: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    student_profile = relationship("StudentProfile", back_populates="interests")
