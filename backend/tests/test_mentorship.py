from app.db.models.user import UserRole


def _make_mentor(client, auth_as):
    headers, user = auth_as(UserRole.MENTOR)
    profile = client.put("/api/mentors/profile", json={"expertise": "Electrician"}, headers=headers).json()
    return headers, profile


def _make_student(client, auth_as):
    headers, user = auth_as(UserRole.STUDENT)
    client.put("/api/students/profile", json={"trade": "Electrician"}, headers=headers)
    return headers, user


def test_request_accept_and_schedule_online_mentorship(client, auth_as):
    mentor_headers, mentor_profile = _make_mentor(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)

    request = client.post(
        "/api/mentorships",
        json={"mentor_id": mentor_profile["id"], "topic": "Career roadmap"},
        headers=student_headers,
    )
    assert request.status_code == 201
    session = request.json()
    assert session["status"] == "REQUESTED"

    accept = client.put(f"/api/mentorships/{session['id']}/accept", headers=mentor_headers)
    assert accept.status_code == 200
    assert accept.json()["status"] == "ACCEPTED"

    schedule = client.post(
        f"/api/mentorships/{session['id']}/schedule",
        json={"mode": "ONLINE", "scheduled_at": "2030-01-01T10:00:00Z", "meeting_link": "https://meet.example.com/abc"},
        headers=mentor_headers,
    )
    assert schedule.status_code == 200
    body = schedule.json()
    assert body["status"] == "SCHEDULED"
    assert body["mode"] == "ONLINE"
    assert body["meeting_link"] == "https://meet.example.com/abc"


def test_schedule_physical_requires_location(client, auth_as):
    mentor_headers, mentor_profile = _make_mentor(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    session = client.post(
        "/api/mentorships", json={"mentor_id": mentor_profile["id"]}, headers=student_headers
    ).json()

    missing_location = client.post(
        f"/api/mentorships/{session['id']}/schedule",
        json={"mode": "PHYSICAL", "scheduled_at": "2030-01-01T10:00:00Z"},
        headers=mentor_headers,
    )
    assert missing_location.status_code == 400

    with_location = client.post(
        f"/api/mentorships/{session['id']}/schedule",
        json={"mode": "PHYSICAL", "scheduled_at": "2030-01-01T10:00:00Z", "location": "ITI Campus, Pune"},
        headers=mentor_headers,
    )
    assert with_location.status_code == 200
    assert with_location.json()["location"] == "ITI Campus, Pune"


def test_mentor_cannot_manage_another_mentors_session(client, auth_as):
    mentor_headers, mentor_profile = _make_mentor(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    session = client.post(
        "/api/mentorships", json={"mentor_id": mentor_profile["id"]}, headers=student_headers
    ).json()

    other_mentor_headers, _ = _make_mentor(client, auth_as)
    response = client.put(f"/api/mentorships/{session['id']}/accept", headers=other_mentor_headers)
    assert response.status_code == 403


def test_student_can_cancel_own_session(client, auth_as):
    mentor_headers, mentor_profile = _make_mentor(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    session = client.post(
        "/api/mentorships", json={"mentor_id": mentor_profile["id"]}, headers=student_headers
    ).json()

    response = client.put(f"/api/mentorships/{session['id']}/cancel", headers=student_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "CANCELLED"
