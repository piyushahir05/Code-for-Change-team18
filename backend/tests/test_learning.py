from app.db.models.learning import LearningResource
from app.db.models.user import UserRole


def _seed_resource(db_session, **overrides):
    resource = LearningResource(
        title=overrides.get("title", "Industrial Control Panels Fundamentals"),
        skill=overrides.get("skill", "Industrial Control Panels"),
        trade=overrides.get("trade", "Electrician"),
        category="Trade Skills",
    )
    db_session.add(resource)
    db_session.commit()
    db_session.refresh(resource)
    return resource


def test_list_resources(client, db_session):
    _seed_resource(db_session)
    response = client.get("/api/resources")
    assert response.status_code == 200
    assert len(response.json()) == 1


def test_recommended_resources_prioritizes_skill_gaps(client, db_session, auth_as):
    _seed_resource(db_session, title="Matches gap", skill="Industrial Control Panels")
    _seed_resource(db_session, title="Unrelated", skill="CNC Basics", trade="Fitter")

    headers, _ = auth_as(UserRole.STUDENT)
    client.put(
        "/api/students/profile",
        json={"trade": "Electrician", "skills": [{"skill_name": "Industrial Control Panels", "is_gap": True}]},
        headers=headers,
    )

    response = client.get("/api/resources/recommended", headers=headers)
    assert response.status_code == 200
    titles = [r["title"] for r in response.json()]
    assert titles[0] == "Matches gap"


def test_update_progress_to_completed_sets_100_percent(client, db_session, auth_as):
    resource = _seed_resource(db_session)
    headers, _ = auth_as(UserRole.STUDENT)
    client.put("/api/students/profile", json={"trade": "Electrician"}, headers=headers)

    response = client.post(
        f"/api/resources/{resource.id}/progress",
        json={"status": "completed", "progress_percentage": 50},
        headers=headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "completed"
    assert body["progress_percentage"] == 100
    assert body["completed_at"] is not None

    progress = client.get("/api/students/progress", headers=headers)
    assert len(progress.json()) == 1
