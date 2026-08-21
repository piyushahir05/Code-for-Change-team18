from app.db.models.user import UserRole


def test_chat_works_without_profile(client, auth_as):
    headers, _ = auth_as(UserRole.STUDENT)
    response = client.post("/api/ai/chat", json={"message": "What should I learn?"}, headers=headers)
    assert response.status_code == 200
    assert "reply" in response.json()


def test_profile_analysis_uses_mock_fallback_and_reflects_gaps(client, auth_as):
    headers, _ = auth_as(UserRole.STUDENT)
    client.put(
        "/api/students/profile",
        json={"trade": "Electrician", "career_goal": "Industrial Electrician",
              "skills": [{"skill_name": "Industrial Control Panels", "is_gap": True}]},
        headers=headers,
    )
    response = client.post("/api/ai/profile-analysis", headers=headers)
    assert response.status_code == 200
    body = response.json()
    assert "Industrial Control Panels" in body["focus_areas"]


def test_ai_requires_authentication(client):
    response = client.post("/api/ai/chat", json={"message": "hi"})
    assert response.status_code in (401, 403)
