import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.students.schemas import StudentProfileOut


class MentorProfileUpdate(BaseModel):
    bio: Optional[str] = None
    expertise: Optional[str] = None
    organization: Optional[str] = None


class MentorProfileOut(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    bio: Optional[str] = None
    expertise: Optional[str] = None
    organization: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class AssignedStudentOut(BaseModel):
    assignment_id: uuid.UUID
    student: StudentProfileOut
