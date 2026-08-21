from app.db.models.student import StudentProfile, StudentSkill
from app.db.models.user import User, UserRole
from app.recommendations.service import recommendation_service
import uuid


def test_career_readiness_score_increases_with_profile_completeness(db_session):
    user = User(id=uuid.uuid4(), email="a@example.com", full_name="A", role=UserRole.STUDENT, is_verified=True)
    db_session.add(user)
    db_session.flush()

    empty_profile = StudentProfile(user_id=user.id)
    db_session.add(empty_profile)
    db_session.flush()
    empty_score = recommendation_service.get_career_readiness_score(empty_profile)

    empty_profile.profile_completion = 80
    empty_profile.career_goal = "Industrial Electrician"
    empty_profile.experience = "1 year"
    db_session.add(StudentSkill(student_profile_id=empty_profile.id, skill_name="Basic Wiring", is_gap=False))
    db_session.flush()
    filled_score = recommendation_service.get_career_readiness_score(empty_profile)

    assert filled_score > empty_score


def test_skill_gaps_only_returns_gap_skills(db_session):
    user = User(id=uuid.uuid4(), email="b@example.com", full_name="B", role=UserRole.STUDENT, is_verified=True)
    db_session.add(user)
    db_session.flush()
    profile = StudentProfile(user_id=user.id)
    db_session.add(profile)
    db_session.flush()
    db_session.add_all([
        StudentSkill(student_profile_id=profile.id, skill_name="Basic Wiring", is_gap=False),
        StudentSkill(student_profile_id=profile.id, skill_name="Industrial Control Panels", is_gap=True),
    ])
    db_session.flush()

    gaps = recommendation_service.get_skill_gaps(profile)
    assert gaps == ["Industrial Control Panels"]
