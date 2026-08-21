import enum
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Enum, func, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ApplicationStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    UNDER_REVIEW = "UNDER_REVIEW"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW = "INTERVIEW"
    SELECTED = "SELECTED"
    REJECTED = "REJECTED"


class Application(Base):
    """
    IMPORTANT: recruiter_id is intentionally NOT stored here.
    Recruiter is derived via application -> opportunity -> recruiter.
    """

    __tablename__ = "applications"
    __table_args__ = (
        UniqueConstraint("student_id", "opportunity_id", name="uq_student_opportunity_application"),
    )

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False
    )
    opportunity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False
    )
    status: Mapped[ApplicationStatus] = mapped_column(
        Enum(ApplicationStatus, name="application_status"), nullable=False, default=ApplicationStatus.APPLIED
    )
    applied_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    student = relationship("StudentProfile", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")
