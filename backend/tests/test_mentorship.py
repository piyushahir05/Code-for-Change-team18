"""
The full request -> accept -> schedule mentorship flow needs the
'requested'/'accepted' status values and the mode/location/topic columns
that only exist after backend/migrations/0001_*.sql is applied (see
app/db/models/mentorship.py). These tests are skipped until then.
"""
from app.db.models.user import UserRole
from tests.conftest import requires_migration

pytestmark = requires_migration


def _make_mentor(client, auth_as):
    headers, user = auth_as(UserRole.MENTOR)
    profile = client.put("/api/mentors/profile", json={"expertise": ["Electrician"]}, headers=headers).json()
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
        json={
            "mentor_id": mentor_profile["id"],
            "scheduled_start": "2030-01-01T10:00:00",
            "scheduled_end": "2030-01-01T10:30:00",
            "topic": "Career roadmap",
        },
        headers=student_headers,
    )
    assert request.status_code == 201
    session = request.json()
    assert session["status"] == "requested"

    accept = client.put(f"/api/mentorships/{session['id']}/accept", headers=mentor_headers)
    assert accept.status_code == 200
    assert accept.json()["status"] == "accepted"

    schedule = client.post(
        f"/api/mentorships/{session['id']}/schedule",
        json={"mode": "online", "meeting_link": "https://meet.example.com/abc"},
        headers=mentor_headers,
    )
    assert schedule.status_code == 200
    body = schedule.json()
    assert body["status"] == "scheduled"
    assert body["mode"] == "online"
    assert body["meeting_link"] == "https://meet.example.com/abc"


def test_schedule_physical_requires_location(client, auth_as):
    mentor_headers, mentor_profile = _make_mentor(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    session = client.post(
        "/api/mentorships",
        json={"mentor_id": mentor_profile["id"], "scheduled_start": "2030-01-01T10:00:00", "scheduled_end": "2030-01-01T10:30:00"},
        headers=student_headers,
    ).json()

    missing_location = client.post(
        f"/api/mentorships/{session['id']}/schedule",
        json={"mode": "physical"},
        headers=mentor_headers,
    )
    assert missing_location.status_code == 422

    with_location = client.post(
        f"/api/mentorships/{session['id']}/schedule",
        json={"mode": "physical", "location": "ITI Campus, Pune"},
        headers=mentor_headers,
    )
    assert with_location.status_code == 200
    assert with_location.json()["location"] == "ITI Campus, Pune"


def test_mentor_cannot_manage_another_mentors_session(client, auth_as):
    mentor_headers, mentor_profile = _make_mentor(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    session = client.post(
        "/api/mentorships",
        json={"mentor_id": mentor_profile["id"], "scheduled_start": "2030-01-01T10:00:00", "scheduled_end": "2030-01-01T10:30:00"},
        headers=student_headers,
    ).json()

    other_mentor_headers, _ = _make_mentor(client, auth_as)
    response = client.put(f"/api/mentorships/{session['id']}/accept", headers=other_mentor_headers)
    assert response.status_code == 403


def test_student_can_cancel_own_session(client, auth_as):
    mentor_headers, mentor_profile = _make_mentor(client, auth_as)
    student_headers, _ = _make_student(client, auth_as)
    session = client.post(
        "/api/mentorships",
        json={"mentor_id": mentor_profile["id"], "scheduled_start": "2030-01-01T10:00:00", "scheduled_end": "2030-01-01T10:30:00"},
        headers=student_headers,
    ).json()

    response = client.put(f"/api/mentorships/{session['id']}/cancel", headers=student_headers)
    assert response.status_code == 200
    assert response.json()["status"] == "cancelled"
