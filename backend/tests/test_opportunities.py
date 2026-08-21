from app.db.models.user import UserRole


def _make_verified_recruiter(client, auth_as):
    headers, user = auth_as(UserRole.RECRUITER)
    client.put("/api/recruiters/profile", json={"company_name": "Voltage Tech"}, headers=headers)

    admin_headers, _ = auth_as(UserRole.ADMIN)
    verify = client.put(f"/api/admin/users/{user.id}/verify", headers=admin_headers)
    assert verify.status_code == 200

    return headers, user


def _create_opportunity(client, headers, title="Industrial Electrician Apprentice"):
    payload = {
        "type": "apprenticeship",
        "title": title,
        "description": "Hands-on apprenticeship.",
        "company": "Voltage Tech",
        "location": "Pune",
        "stipend": 12000,
        "eligibility": "ITI Electrician trade",
        "skills": ["Electrician", "Industrial Control Panels"],
    }
    return client.post("/api/opportunities", json=payload, headers=headers)


def test_create_opportunity_starts_draft(client, auth_as):
    headers, _ = _make_verified_recruiter(client, auth_as)
    response = _create_opportunity(client, headers)
    assert response.status_code == 201
    body = response.json()
    assert body["status"] == "draft"
    assert set(body["skills"]) == {"Electrician", "Industrial Control Panels"}


def test_student_cannot_see_draft_opportunity(client, auth_as):
    recruiter_headers, _ = _make_verified_recruiter(client, auth_as)
    opp = _create_opportunity(client, recruiter_headers).json()

    student_headers, _ = auth_as(UserRole.STUDENT)
    response = client.get("/api/opportunities", headers=student_headers)
    assert response.status_code == 200
    assert opp["id"] not in [o["id"] for o in response.json()]

    detail = client.get(f"/api/opportunities/{opp['id']}", headers=student_headers)
    assert detail.status_code == 404


def test_admin_approve_makes_it_visible_to_students(client, auth_as):
    recruiter_headers, _ = _make_verified_recruiter(client, auth_as)
    opp = _create_opportunity(client, recruiter_headers).json()

    admin_headers, _ = auth_as(UserRole.ADMIN)
    approve = client.put(f"/api/admin/opportunities/{opp['id']}/approve", headers=admin_headers)
    assert approve.status_code == 200
    assert approve.json()["status"] == "active"

    student_headers, _ = auth_as(UserRole.STUDENT)
    listing = client.get("/api/opportunities", headers=student_headers)
    assert opp["id"] in [o["id"] for o in listing.json()]


def test_admin_reject_sets_closed(client, auth_as):
    recruiter_headers, _ = _make_verified_recruiter(client, auth_as)
    opp = _create_opportunity(client, recruiter_headers).json()

    admin_headers, _ = auth_as(UserRole.ADMIN)
    reject = client.put(f"/api/admin/opportunities/{opp['id']}/reject", headers=admin_headers)
    assert reject.status_code == 200
    assert reject.json()["status"] == "closed"


def test_recruiter_cannot_edit_another_recruiters_opportunity(client, auth_as):
    recruiter_headers, _ = _make_verified_recruiter(client, auth_as)
    opp = _create_opportunity(client, recruiter_headers).json()

    other_headers, _ = _make_verified_recruiter(client, auth_as)
    response = client.put(
        f"/api/opportunities/{opp['id']}", json={"title": "Hijacked"}, headers=other_headers
    )
    assert response.status_code == 403
