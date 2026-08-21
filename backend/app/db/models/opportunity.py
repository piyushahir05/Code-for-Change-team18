import enum
from datetime import date as date_
from typing import List, Optional

from sqlalchemy import String, Text, Integer, Date, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class OpportunityType(str, enum.Enum):
    JOB = "job"
    APPRENTICESHIP = "apprenticeship"
    INTERNSHIP = "internship"
    TRAINING = "training"


class OpportunityStatus(str, enum.Enum):
    """
    NOTE: the actual DB enum has no dedicated PENDING/APPROVED/REJECTED
    states (Master Context section 21 assumed those). It only has:
    draft, active, closed, filled. This backend maps the admin approval
    workflow onto it as closely as the schema allows:
      draft  -> awaiting admin review (not visible to students)
      active -> approved, visible to students
      closed -> rejected by admin OR closed/expired (single bucket - the
                schema cannot distinguish these two cases)
      filled -> all positions filled
    See README "Unresolved mismatches" for detail.
    """

    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    FILLED = "filled"


class Opportunity(Base):
    __tablename__ = "opportunities"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    recruiter_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("recruiter_profiles.id", ondelete="CASCADE"), nullable=True
    )

    type: Mapped[Optional[OpportunityType]] = mapped_column(
        Enum(OpportunityType, name="opportunity_type", values_callable=lambda obj: [e.value for e in obj]),
        nullable=True,
    )
    title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    company: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    salary: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    stipend: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    eligibility: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    experience: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    deadline: Mapped[Optional[date_]] = mapped_column(Date, nullable=True)
    status: Mapped[Optional[OpportunityStatus]] = mapped_column(
        Enum(OpportunityStatus, name="opportunity_status", values_callable=lambda obj: [e.value for e in obj]),
        nullable=True,
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

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    opportunity_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=True
    )
    skill_or_trade: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    opportunity = relationship("Opportunity", back_populates="skills")
