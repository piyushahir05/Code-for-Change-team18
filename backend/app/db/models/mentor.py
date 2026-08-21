from typing import List, Optional

from sqlalchemy import String, Integer, Boolean, Time, ForeignKey, UniqueConstraint, CheckConstraint
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=True
    )
    organization: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    experience: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    # text[] in Postgres - a mentor's areas of expertise.
    expertise: Mapped[Optional[List[str]]] = mapped_column(ARRAY(String), nullable=True)

    user = relationship("User", back_populates="mentor_profile")
    student_assignments = relationship(
        "MentorAssignment", back_populates="mentor", cascade="all, delete-orphan"
    )
    availability: Mapped[List["MentorAvailability"]] = relationship(
        "MentorAvailability", back_populates="mentor", cascade="all, delete-orphan"
    )


class MentorAssignment(Base):
    """Many-to-many relationship: which mentor is connected to which student."""

    __tablename__ = "mentor_assignments"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    mentor_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("mentor_profiles.id", ondelete="CASCADE"), nullable=True
    )
    student_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )

    mentor = relationship("MentorProfile", back_populates="student_assignments")
    student = relationship("StudentProfile", back_populates="mentor_assignments")


class MentorAvailability(Base):
    """A mentor's recurring weekly availability window."""

    __tablename__ = "mentor_availability"
    __table_args__ = (
        CheckConstraint("day_of_week BETWEEN 1 AND 7", name="mentor_availability_day_of_week_check"),
        CheckConstraint("end_time > start_time", name="mentor_availability_check"),
        UniqueConstraint("mentor_id", "day_of_week", "start_time", "end_time", name="mentor_availability_mentor_id_day_of_week_start_time_end_ti_key"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    mentor_id: Mapped[int] = mapped_column(ForeignKey("mentor_profiles.id", ondelete="CASCADE"), nullable=False)
    day_of_week: Mapped[int] = mapped_column(Integer, nullable=False)
    start_time: Mapped[object] = mapped_column(Time, nullable=False)
    end_time: Mapped[object] = mapped_column(Time, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)

    mentor = relationship("MentorProfile", back_populates="availability")
