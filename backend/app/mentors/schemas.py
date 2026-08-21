from datetime import time
from typing import List, Optional

from pydantic import BaseModel, Field, field_validator

from app.students.schemas import StudentProfileOut


class MentorProfileUpdate(BaseModel):
    organization: Optional[str] = None
    experience: Optional[str] = None
    expertise: Optional[List[str]] = None


class MentorProfileOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    organization: Optional[str] = None
    experience: Optional[str] = None
    # expertise is a nullable Postgres text[] column - NULL is common (e.g. a
    # freshly created profile), so coerce it to [] rather than rejecting it.
    expertise: List[str] = Field(default_factory=list)

    @field_validator("expertise", mode="before")
    @classmethod
    def _null_expertise_to_empty_list(cls, value):
        return value or []

    class Config:
        from_attributes = True


class AssignedStudentOut(BaseModel):
    assignment_id: int
    student: StudentProfileOut


class MentorAvailabilityIn(BaseModel):
    day_of_week: int = Field(ge=1, le=7, description="1=Monday .. 7=Sunday")
    start_time: time
    end_time: time
    is_active: bool = True


class MentorAvailabilityOut(BaseModel):
    id: int
    mentor_id: int
    day_of_week: int
    start_time: time
    end_time: time
    is_active: bool

    class Config:
        from_attributes = True
