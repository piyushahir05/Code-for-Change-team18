import enum
import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, Integer, DateTime, ForeignKey, Enum, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class LearningStatus(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    skill: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    trade: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    language: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    difficulty: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    duration: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    external_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    progress_entries = relationship(
        "LearningProgress", back_populates="resource", cascade="all, delete-orphan"
    )


class LearningProgress(Base):
    __tablename__ = "learning_progress"
    __table_args__ = (UniqueConstraint("student_id", "resource_id", name="uq_student_resource_progress"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    resource_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("learning_resources.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[LearningStatus] = mapped_column(
        Enum(LearningStatus, name="learning_status"), nullable=False, default=LearningStatus.NOT_STARTED
    )
    progress_percentage: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)

    student = relationship("StudentProfile", back_populates="learning_progress")
    resource = relationship("LearningResource", back_populates="progress_entries")
