from app.db.models.user import UserRole


def test_get_and_update_recruiter_profile(client, auth_as):
    headers, _ = auth_as(UserRole.RECRUITER)

    response = client.get("/api/recruiters/profile", headers=headers)
    assert response.status_code == 200
    assert response.json()["verification_status"] == "pending"

    response = client.put(
        "/api/recruiters/profile",
        json={"company_name": "Voltage Tech Industries", "industry": "Manufacturing", "location": "Pune"},
        headers=headers,
    )
    assert response.status_code == 200
    body = response.json()
    assert body["company_name"] == "Voltage Tech Industries"
    assert body["location"] == "Pune"


def test_recruiter_cannot_access_student_profile(client, auth_as):
    headers, _ = auth_as(UserRole.RECRUITER)
    response = client.get("/api/students/profile", headers=headers)
    assert response.status_code == 403


def test_unverified_recruiter_cannot_create_opportunity(client, auth_as):
    headers, _ = auth_as(UserRole.RECRUITER)
    client.put("/api/recruiters/profile", json={"company_name": "Unverified Co"}, headers=headers)

    response = client.post(
        "/api/opportunities",
        json={"type": "job", "title": "Junior Electrician", "skills": []},
        headers=headers,
    )
    assert response.status_code == 403
