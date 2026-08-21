import os

os.environ.setdefault("SUPABASE_JWT_SECRET", "test-jwt-secret")
os.environ.setdefault("AI_PROVIDER", "mock")
os.environ.setdefault("SUPABASE_URL", "")
os.environ.setdefault("SUPABASE_ANON_KEY", "")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "")

import uuid
from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.db.base import Base
from app.db.models.user import User, UserRole
from app.db.session import get_db
from app.main import app

TEST_SECRET = os.environ["SUPABASE_JWT_SECRET"]

engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture()
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture()
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.pop(get_db, None)


def make_token(user_id: uuid.UUID, email: str) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "aud": "authenticated",
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, TEST_SECRET, algorithm="HS256")


def create_user(db_session, role: UserRole, email: str, verified: bool = True) -> User:
    user = User(id=uuid.uuid4(), email=email, full_name=email.split("@")[0], role=role, is_verified=verified)
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def auth_as(db_session):
    """Returns a factory: auth_as(role) -> (headers, user)."""

    def _factory(role: UserRole, email: str = None, verified: bool = True):
        email = email or f"{role.value.lower()}-{uuid.uuid4().hex[:6]}@example.com"
        user = create_user(db_session, role, email, verified)
        token = make_token(user.id, user.email)
        return {"Authorization": f"Bearer {token}"}, user

    return _factory
