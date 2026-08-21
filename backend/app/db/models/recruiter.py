import uuid
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, DateTime, ForeignKey, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class RecruiterProfile(Base):
    __tablename__ = "recruiter_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False
    )

    company_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    company_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    industry: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = relationship("User", back_populates="recruiter_profile")
    opportunities = relationship(
        "Opportunity", back_populates="recruiter", cascade="all, delete-orphan"
    )
