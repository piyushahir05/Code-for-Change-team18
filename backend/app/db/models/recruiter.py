from typing import Optional

from sqlalchemy import String, Text, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.db.models.user import VerificationStatus


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    user_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=True
    )
    company_name: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    company_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    verification_status: Mapped[Optional[VerificationStatus]] = mapped_column(
        Enum(
            VerificationStatus,
            name="user_verification_status",
            values_callable=lambda obj: [e.value for e in obj],
        ),
        nullable=True,
    )

    user = relationship("User", back_populates="recruiter_profile")
    opportunities = relationship(
        "Opportunity", back_populates="recruiter", cascade="all, delete-orphan"
    )
