from app.db.models.user import UserRole


def test_list_and_verify_unverified_user(client, auth_as):
    student_headers, student_user = auth_as(UserRole.STUDENT, verified=False)
    admin_headers, _ = auth_as(UserRole.ADMIN)

    listing = client.get("/api/admin/verifications", headers=admin_headers)
    assert listing.status_code == 200
    assert student_user.id in [u["id"] for u in listing.json()]

    verify = client.put(f"/api/admin/users/{student_user.id}/verify", headers=admin_headers)
    assert verify.status_code == 200
    assert verify.json()["verification_status"] == "verified"

    listing_after = client.get("/api/admin/verifications", headers=admin_headers)
    assert student_user.id not in [u["id"] for u in listing_after.json()]


def test_verifying_recruiter_syncs_recruiter_profile(client, auth_as):
    recruiter_headers, recruiter_user = auth_as(UserRole.RECRUITER, verified=False)
    client.put("/api/recruiters/profile", json={"company_name": "X"}, headers=recruiter_headers)

    admin_headers, _ = auth_as(UserRole.ADMIN)
    client.put(f"/api/admin/users/{recruiter_user.id}/verify", headers=admin_headers)

    profile = client.get("/api/recruiters/profile", headers=recruiter_headers)
    assert profile.json()["verification_status"] == "verified"


def test_analytics_requires_admin(client, auth_as):
    headers, _ = auth_as(UserRole.RECRUITER)
    response = client.get("/api/admin/analytics", headers=headers)
    assert response.status_code == 403

    admin_headers, _ = auth_as(UserRole.ADMIN)
    response = client.get("/api/admin/analytics", headers=admin_headers)
    assert response.status_code == 200
    assert "total_students" in response.json()
