import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, DateTime, ForeignKey, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MentorProfile(Base):
    __tablename__ = "mentor_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    # IMPLEMENTATION ASSUMPTION: exact mentor profile fields are not enumerated
    # in the master context beyond "Create mentor profile" - kept minimal.
    bio: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    expertise: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    organization: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="mentor_profile")
    student_assignments = relationship(
        "MentorAssignment", back_populates="mentor", cascade="all, delete-orphan"
    )


class MentorAssignment(Base):
    """Many-to-many relationship: which mentor is connected to which student."""

    __tablename__ = "mentor_assignments"
    __table_args__ = (UniqueConstraint("mentor_id", "student_id", name="uq_mentor_student"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mentor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("mentor_profiles.id", ondelete="CASCADE"), nullable=False
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    mentor = relationship("MentorProfile", back_populates="student_assignments")
    student = relationship("StudentProfile", back_populates="mentor_assignments")
