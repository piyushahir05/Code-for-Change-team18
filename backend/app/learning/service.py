from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

from app.core.errors import NotFoundError
from app.db.models.learning import LearningProgress, LearningResource, LearningStatus
from app.db.models.student import StudentProfile
from app.recommendations.service import recommendation_service


def list_resources(
    db: Session, category: Optional[str] = None, skill: Optional[str] = None, trade: Optional[str] = None
) -> List[LearningResource]:
    query = db.query(LearningResource)
    if category:
        query = query.filter(LearningResource.category == category)
    if skill:
        query = query.filter(LearningResource.skill == skill)
    if trade:
        query = query.filter(LearningResource.trade == trade)
    return query.order_by(LearningResource.id.desc()).all()


def get_recommended_resources(db: Session, student: StudentProfile) -> List[LearningResource]:
    return recommendation_service.get_recommended_resources(db, student)


def list_progress_for_student(db: Session, student: StudentProfile) -> List[LearningProgress]:
    return (
        db.query(LearningProgress)
        .options(joinedload(LearningProgress.resource))
        .filter(LearningProgress.student_id == student.id)
        .all()
    )


def update_progress(
    db: Session, student: StudentProfile, resource_id: int, status: LearningStatus, progress_percentage: int
) -> LearningProgress:
    resource = db.query(LearningResource).filter(LearningResource.id == resource_id).first()
    if not resource:
        raise NotFoundError("Learning resource not found")

    entry = (
        db.query(LearningProgress)
        .filter(LearningProgress.student_id == student.id, LearningProgress.resource_id == resource_id)
        .first()
    )
    now = datetime.utcnow()
    if not entry:
        entry = LearningProgress(student_id=student.id, resource_id=resource_id)
        db.add(entry)

    if entry.status == LearningStatus.NOT_STARTED and status != LearningStatus.NOT_STARTED:
        entry.started_at = now
    if status == LearningStatus.COMPLETED and entry.status != LearningStatus.COMPLETED:
        entry.completed_at = now
        progress_percentage = 100

    entry.status = status
    entry.progress_percentage = progress_percentage

    db.commit()
    db.refresh(entry)
    return entry
