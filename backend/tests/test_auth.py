from app.db.models.user import UserRole


def test_me_requires_authentication(client):
    response = client.get("/api/auth/me")
    assert response.status_code in (401, 403)


def test_me_returns_current_user(client, auth_as):
    headers, user = auth_as(UserRole.STUDENT)
    response = client.get("/api/auth/me", headers=headers)
    assert response.status_code == 200
    body = response.json()
    assert body["id"] == str(user.id)
    assert body["role"] == "STUDENT"


def test_invalid_token_is_rejected(client):
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert response.status_code == 401


def test_token_for_unknown_user_is_rejected(client):
    import uuid
    from tests.conftest import make_token

    token = make_token(uuid.uuid4(), "ghost@example.com")
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404
