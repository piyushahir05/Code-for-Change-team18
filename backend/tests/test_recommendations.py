from app.db.models.student import StudentProfile, StudentSkill
from app.db.models.user import User, UserRole
from app.recommendations.service import recommendation_service


def test_career_readiness_score_increases_with_profile_completeness(db_session):
    user = User(name="A", email="a@example.com", role=UserRole.STUDENT)
    db_session.add(user)
    db_session.flush()

    profile = StudentProfile(user_id=user.id, profile_completion=0)
    db_session.add(profile)
    db_session.flush()
    empty_score = recommendation_service.get_career_readiness_score(profile)

    profile.profile_completion = 80
    profile.career_goal = "Industrial Electrician"
    profile.experience = "1 year"
    db_session.add(StudentSkill(student_profile_id=profile.id, skill_name="Basic Wiring", is_gap=False))
    db_session.flush()
    filled_score = recommendation_service.get_career_readiness_score(profile)

    assert filled_score > empty_score
    assert isinstance(filled_score, int)


def test_skill_gaps_only_returns_gap_skills(db_session):
    user = User(name="B", email="b@example.com", role=UserRole.STUDENT)
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
