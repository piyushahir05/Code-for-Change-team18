from app.db.models.user import UserRole


def _make_student(client, auth_as):
    headers, user = auth_as(UserRole.STUDENT)
    client.put("/api/students/profile", json={"trade": "Electrician"}, headers=headers)
    return headers, user


def _approved_opportunity(client, auth_as):
    recruiter_headers, _ = auth_as(UserRole.RECRUITER)
    client.put("/api/recruiters/profile", json={"company_name": "Voltage Tech"}, headers=recruiter_headers)
    opp = client.post(
        "/api/opportunities",
        json={"type": "JOB", "title": "Junior Electrician", "skills": ["Electrician"]},
        headers=recruiter_headers,
    ).json()

    admin_headers, _ = auth_as(UserRole.ADMIN)
    client.put(f"/api/admin/opportunities/{opp['id']}/approve", headers=admin_headers)
    return opp, recruiter_headers


def test_student_can_apply_to_approved_opportunity(client, auth_as):
    opp, _ = _approved_opportunity(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)

    response = client.post("/api/applications", json={"opportunity_id": opp["id"]}, headers=student_headers)
    assert response.status_code == 201
    assert response.json()["status"] == "APPLIED"


def test_duplicate_application_is_rejected(client, auth_as):
    opp, _ = _approved_opportunity(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)

    first = client.post("/api/applications", json={"opportunity_id": opp["id"]}, headers=student_headers)
    assert first.status_code == 201

    second = client.post("/api/applications", json={"opportunity_id": opp["id"]}, headers=student_headers)
    assert second.status_code == 409


def test_cannot_apply_to_pending_opportunity(client, auth_as):
    recruiter_headers, _ = auth_as(UserRole.RECRUITER)
    client.put("/api/recruiters/profile", json={"company_name": "Voltage Tech"}, headers=recruiter_headers)
    opp = client.post(
        "/api/opportunities",
        json={"type": "JOB", "title": "Junior Electrician", "skills": []},
        headers=recruiter_headers,
    ).json()

    student_headers, _ = _make_student(client, auth_as)
    response = client.post("/api/applications", json={"opportunity_id": opp["id"]}, headers=student_headers)
    assert response.status_code == 404


def test_recruiter_sees_and_updates_own_opportunity_applications(client, auth_as):
    opp, recruiter_headers = _approved_opportunity(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    application = client.post(
        "/api/applications", json={"opportunity_id": opp["id"]}, headers=student_headers
    ).json()

    listing = client.get("/api/applications/recruiter", headers=recruiter_headers)
    assert listing.status_code == 200
    assert application["id"] in [a["id"] for a in listing.json()]

    update = client.put(
        f"/api/applications/{application['id']}/status",
        json={"status": "SHORTLISTED"},
        headers=recruiter_headers,
    )
    assert update.status_code == 200
    assert update.json()["status"] == "SHORTLISTED"

    student_view = client.get("/api/applications/student", headers=student_headers)
    assert student_view.json()[0]["status"] == "SHORTLISTED"


def test_recruiter_cannot_update_another_recruiters_application(client, auth_as):
    opp, _ = _approved_opportunity(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    application = client.post(
        "/api/applications", json={"opportunity_id": opp["id"]}, headers=student_headers
    ).json()

    other_recruiter_headers, _ = auth_as(UserRole.RECRUITER)
    client.put("/api/recruiters/profile", json={"company_name": "Other Co"}, headers=other_recruiter_headers)

    response = client.put(
        f"/api/applications/{application['id']}/status",
        json={"status": "SHORTLISTED"},
        headers=other_recruiter_headers,
    )
    assert response.status_code == 403
