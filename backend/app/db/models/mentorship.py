import enum
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class MentorshipMode(str, enum.Enum):
    PHYSICAL = "physical"
    ONLINE = "online"


class MentorshipStatus(str, enum.Enum):
    """
    mentor_meetings.status is a plain `text` column with a CHECK constraint
    (not a Postgres ENUM type). The live DB's CHECK currently only allows
    ('scheduled','completed','cancelled','rescheduled'). REQUESTED/ACCEPTED
    require the additive migration in backend/migrations/ to widen that
    CHECK constraint - see README. Until that migration runs, only
    'scheduled' rows can be written successfully.
    """

    REQUESTED = "requested"
    ACCEPTED = "accepted"
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"


class MentorMeeting(Base):
    """
    Maps to public.mentor_meetings. Replaces the originally-designed
    single `mentorship_sessions` table, which does not exist in the actual
    schema - the teammate instead built an availability-slot + booked
    meeting model (see MentorAvailability in mentor.py).

    `mode` and `location` are NOT in the live schema yet - they are part of
    the proposed additive migration (backend/migrations/0001_*.sql). They
    are declared here because the team chose to keep the original
    request/accept/schedule/physical-or-online flow shape; until the
    migration is applied, any query touching this table will fail with
    "column does not exist" for those two columns.
    """

    __tablename__ = "mentor_meetings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    mentor_id: Mapped[int] = mapped_column(ForeignKey("mentor_profiles.id", ondelete="CASCADE"), nullable=False)
    student_id: Mapped[int] = mapped_column(ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    assignment_id: Mapped[int] = mapped_column(
        ForeignKey("mentor_assignments.id", ondelete="CASCADE"), nullable=False
    )
    scheduled_start: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    scheduled_end: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    meeting_link: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String, nullable=False, default=MentorshipStatus.SCHEDULED.value)
    created_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # --- Requires backend/migrations/0001_*.sql (see docstring above) ---
    mode: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    topic: Mapped[Optional[str]] = mapped_column(String, nullable=True)

    mentor = relationship("MentorProfile")
    student = relationship("StudentProfile")
    assignment = relationship("MentorAssignment")
