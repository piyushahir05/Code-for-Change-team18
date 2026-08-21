import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ApplicationStatus(str, enum.Enum):
    APPLIED = "applied"
    SHORTLISTED = "shortlisted"
    INTERVIEW = "interview"
    SELECTED = "selected"
    REJECTED = "rejected"


class Application(Base):
    """
    IMPORTANT: recruiter_id is intentionally NOT stored here.
    Recruiter is derived via application -> opportunity -> recruiter.

    NOTE: the actual DB table has NO UNIQUE(student_id, opportunity_id)
    constraint (unlike what the Master Context specifies). Duplicate
    applications are prevented at the application layer only (see
    app/applications/service.py) until that constraint is added via the
    proposed additive migration in backend/migrations/.
    """

    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    student_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=True
    )
    opportunity_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=True
    )
    status: Mapped[Optional[ApplicationStatus]] = mapped_column(
        Enum(ApplicationStatus, name="application_status", values_callable=lambda obj: [e.value for e in obj]),
        nullable=True,
    )
    applied_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    updated_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    student = relationship("StudentProfile", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")
