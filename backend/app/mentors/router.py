from typing import List, Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_mentor_profile, get_current_user, require_mentor
from app.db.models.mentor import MentorProfile
from app.db.models.user import User
from app.db.session import get_db
from app.mentors import service
from app.mentors.schemas import (
    AssignedStudentOut,
    MentorAvailabilityIn,
    MentorAvailabilityOut,
    MentorProfileOut,
    MentorProfileUpdate,
)
from app.students.schemas import StudentProfileOut

router = APIRouter(prefix="/api/mentors", tags=["mentors"])


# IMPLEMENTATION ASSUMPTION: own-profile routes, mirroring /api/students/profile
# and /api/recruiters/profile - needed for "Create mentor profile" (section 11).
@router.get("/profile", response_model=MentorProfileOut)
def get_my_profile(current_user: User = Depends(require_mentor), db: Session = Depends(get_db)):
    return service.get_or_create_profile(db, current_user)


@router.put("/profile", response_model=MentorProfileOut)
def update_my_profile(
    payload: MentorProfileUpdate,
    current_user: User = Depends(require_mentor),
    db: Session = Depends(get_db),
):
    return service.update_profile(db, current_user, payload)


# IMPLEMENTATION ASSUMPTION: the mentor's recurring weekly availability,
# required input for booking a mentor_meetings row against the actual schema.
@router.get("/availability", response_model=List[MentorAvailabilityOut])
def list_my_availability(
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    return service.list_availability(db, mentor)


@router.post("/availability", response_model=MentorAvailabilityOut, status_code=201)
def add_my_availability(
    payload: MentorAvailabilityIn,
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    return service.add_availability(db, mentor, payload)


@router.delete("/availability/{availability_id}", status_code=204)
def delete_my_availability(
    availability_id: int,
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    service.delete_availability(db, mentor, availability_id)


@router.get("", response_model=List[MentorProfileOut])
def list_mentors(
    expertise: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.list_mentors(db, expertise)


# IMPLEMENTATION ASSUMPTION: backs the mentor dashboard's assigned-students
# list (section 35) - not enumerated in section 32's route contract.
@router.get("/students", response_model=List[AssignedStudentOut])
def list_assigned_students(
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    assignments = service.list_assigned_students(db, mentor)
    return [AssignedStudentOut(assignment_id=a.id, student=a.student) for a in assignments]


@router.get("/students/{student_id}", response_model=StudentProfileOut)
def get_assigned_student(
    student_id: int,
    mentor: MentorProfile = Depends(get_current_mentor_profile),
    db: Session = Depends(get_db),
):
    return service.get_assigned_student_or_403(db, mentor, student_id)


@router.get("/{mentor_id}", response_model=MentorProfileOut)
def get_mentor(
    mentor_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return service.get_mentor_or_404(db, mentor_id)
