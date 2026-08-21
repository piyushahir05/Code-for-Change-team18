import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, Integer, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class LearningStatus(str, enum.Enum):
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class LearningResource(Base):
    __tablename__ = "learning_resources"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    skill: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    trade: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    language: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    difficulty: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    duration: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    external_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    progress_entries = relationship(
        "LearningProgress", back_populates="resource", cascade="all, delete-orphan"
    )


class LearningProgress(Base):
    __tablename__ = "learning_progress"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    resource_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("learning_resources.id", ondelete="CASCADE"), nullable=True
    )
    status: Mapped[Optional[LearningStatus]] = mapped_column(
        Enum(
            LearningStatus,
            name="learning_progress_status",
            values_callable=lambda obj: [e.value for e in obj],
        ),
        nullable=True,
    )
    progress_percentage: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    started_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    completed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    student = relationship("StudentProfile", back_populates="learning_progress")
    resource = relationship("LearningResource", back_populates="progress_entries")
