from app.db.models.user import UserRole


def test_get_and_update_recruiter_profile(client, auth_as):
    headers, _ = auth_as(UserRole.RECRUITER)

    response = client.get("/api/recruiters/profile", headers=headers)
    assert response.status_code == 200

    response = client.put(
        "/api/recruiters/profile",
        json={"company_name": "Voltage Tech Industries", "industry": "Manufacturing"},
        headers=headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["company_name"] == "Voltage Tech Industries"


def test_recruiter_cannot_access_student_profile(client, auth_as):
    headers, _ = auth_as(UserRole.RECRUITER)
    response = client.get("/api/students/profile", headers=headers)
    assert response.status_code == 403
