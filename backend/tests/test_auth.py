from app.db.models.user import UserRole


def test_register_and_me(client):
    payload = {"email": "newstudent@example.com", "password": "Password123!", "name": "New Student", "role": "student"}
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 201
    body = response.json()
    assert body["user"]["email"] == "newstudent@example.com"
    assert body["user"]["role"] == "student"
    assert body["user"]["verification_status"] == "pending"

    me = client.get("/api/auth/me", headers={"Authorization": f"Bearer {body['access_token']}"})
    assert me.status_code == 200
    assert me.json()["email"] == "newstudent@example.com"


def test_register_duplicate_email_is_rejected(client):
    payload = {"email": "dupe@example.com", "password": "Password123!", "name": "Dupe", "role": "student"}
    first = client.post("/api/auth/register", json=payload)
    assert first.status_code == 201
    second = client.post("/api/auth/register", json=payload)
    assert second.status_code == 409


def test_register_admin_role_is_rejected(client):
    payload = {"email": "wannabe-admin@example.com", "password": "Password123!", "name": "X", "role": "admin"}
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400


def test_login_with_correct_password(client):
    register = client.post(
        "/api/auth/register",
        json={"email": "login-test@example.com", "password": "Password123!", "name": "Login Test", "role": "student"},
    )
    assert register.status_code == 201

    login = client.post("/api/auth/login", json={"email": "login-test@example.com", "password": "Password123!"})
    assert login.status_code == 200
    assert "access_token" in login.json()


def test_login_with_wrong_password_is_rejected(client):
    client.post(
        "/api/auth/register",
        json={"email": "wrongpass@example.com", "password": "Password123!", "name": "X", "role": "student"},
    )
    login = client.post("/api/auth/login", json={"email": "wrongpass@example.com", "password": "WrongPassword!"})
    assert login.status_code == 401


def test_me_requires_authentication(client):
    response = client.get("/api/auth/me")
    assert response.status_code in (401, 403)


def test_invalid_token_is_rejected(client):
    response = client.get("/api/auth/me", headers={"Authorization": "Bearer not-a-real-token"})
    assert response.status_code == 401


def test_token_for_unknown_user_is_rejected(client):
    from tests.conftest import make_token

    token = make_token(999999999)
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 404
