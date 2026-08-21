import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, DateTime, ForeignKey, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MentorshipMode(str, enum.Enum):
    PHYSICAL = "PHYSICAL"
    ONLINE = "ONLINE"


class MentorshipStatus(str, enum.Enum):
    REQUESTED = "REQUESTED"
    ACCEPTED = "ACCEPTED"
    SCHEDULED = "SCHEDULED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"


class MentorshipSession(Base):
    __tablename__ = "mentorship_sessions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mentor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("mentor_profiles.id", ondelete="CASCADE"), nullable=False
    )
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    mode: Mapped[Optional[MentorshipMode]] = mapped_column(
        Enum(MentorshipMode, name="mentorship_mode"), nullable=True
    )
    topic: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    scheduled_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    meeting_link: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[MentorshipStatus] = mapped_column(
        Enum(MentorshipStatus, name="mentorship_status"), nullable=False, default=MentorshipStatus.REQUESTED
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    mentor = relationship("MentorProfile")
    student = relationship("StudentProfile")
