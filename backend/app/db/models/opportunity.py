import enum
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import String, Text, Numeric, Date, DateTime, ForeignKey, Enum, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class OpportunityType(str, enum.Enum):
    JOB = "JOB"
    APPRENTICESHIP = "APPRENTICESHIP"
    RECRUITMENT_DRIVE = "RECRUITMENT_DRIVE"


class OpportunityStatus(str, enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    CLOSED = "CLOSED"


class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    recruiter_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("recruiter_profiles.id", ondelete="CASCADE"), nullable=False
    )

    type: Mapped[OpportunityType] = mapped_column(Enum(OpportunityType, name="opportunity_type"), nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    company: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    salary: Mapped[Optional[float]] = mapped_column(Numeric(12, 2), nullable=True)
    stipend: Mapped[Optional[float]] = mapped_column(Numeric(12, 2), nullable=True)
    eligibility: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    experience: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    deadline: Mapped[Optional[datetime]] = mapped_column(Date, nullable=True)
    status: Mapped[OpportunityStatus] = mapped_column(
        Enum(OpportunityStatus, name="opportunity_status"), nullable=False, default=OpportunityStatus.PENDING
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    recruiter = relationship("RecruiterProfile", back_populates="opportunities")
    skills: Mapped[List["OpportunitySkill"]] = relationship(
        "OpportunitySkill", back_populates="opportunity", cascade="all, delete-orphan"
    )
    applications = relationship(
        "Application", back_populates="opportunity", cascade="all, delete-orphan"
    )


class OpportunitySkill(Base):
    """Represents both required skills and required trades for an opportunity."""

    __tablename__ = "opportunity_skills"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    opportunity_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False
    )
    skill_or_trade: Mapped[str] = mapped_column(String(255), nullable=False)

    opportunity = relationship("Opportunity", back_populates="skills")
