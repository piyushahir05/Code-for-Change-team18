from app.db.models.user import UserRole


def test_get_profile_auto_creates(client, auth_as):
    headers, _ = auth_as(UserRole.STUDENT)
    response = client.get("/api/students/profile", headers=headers)
    assert response.status_code == 200
    assert response.json()["profile_completion"] == 0


def test_update_profile_with_skills_and_interests(client, auth_as):
    headers, _ = auth_as(UserRole.STUDENT)
    payload = {
        "trade": "Electrician",
        "career_goal": "Industrial Electrician",
        "location": "Pune",
        "skills": [
            {"skill_name": "Basic Wiring", "is_gap": False},
            {"skill_name": "Industrial Control Panels", "is_gap": True},
        ],
        "interests": ["Renewable Energy"],
    }
    response = client.put("/api/students/profile", json=payload, headers=headers)
    assert response.status_code == 200
    body = response.json()
    assert body["trade"] == "Electrician"
    assert len(body["skills"]) == 2
    assert len(body["interests"]) == 1
    assert body["profile_completion"] > 0
    assert body["career_readiness_score"] > 0


def test_recommendations_endpoint(client, auth_as):
    headers, _ = auth_as(UserRole.STUDENT)
    client.put(
        "/api/students/profile",
        json={"trade": "Electrician", "career_goal": "Industrial Electrician",
              "skills": [{"skill_name": "Industrial Control Panels", "is_gap": True}]},
        headers=headers,
    )
    response = client.get("/api/students/recommendations", headers=headers)
    assert response.status_code == 200
    body = response.json()
    assert "career_readiness_score" in body
    assert "Industrial Control Panels" in body["skill_gaps"]
    assert isinstance(body["recommended_opportunities"], list)


def test_student_cannot_access_recruiter_endpoints(client, auth_as):
    headers, _ = auth_as(UserRole.STUDENT)
    response = client.get("/api/recruiters/profile", headers=headers)
    assert response.status_code == 403


def test_student_cannot_access_admin_endpoints(client, auth_as):
    headers, _ = auth_as(UserRole.STUDENT)
    response = client.get("/api/admin/analytics", headers=headers)
    assert response.status_code == 403
