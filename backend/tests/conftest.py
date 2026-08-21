"""
Test fixtures.

IMPORTANT: these tests run against a real PostgreSQL database via
DATABASE_URL - not SQLite. This schema uses several Postgres-only features
(ARRAY columns, native ENUM types) that a SQLite fallback can't represent
faithfully, and the whole point of this pass was to make the backend match
the team's actual Postgres schema - testing against a different database
engine would silently reintroduce the same kind of mismatch.

Point DATABASE_URL (in your environment or .env) at a throwaway/dev
Postgres database - NOT the shared team Supabase project - before running
pytest. Every test runs inside a transaction that is rolled back afterward,
so no committed rows survive a normal test run, but application code still
calls db.commit() internally, which is why an ISOLATED database matters:
never point this at data you (or your teammates) care about.

SAFETY GUARD: if DATABASE_URL's host contains "supabase.co" (the shared
project pattern), the entire suite refuses to run and skips instead, unless
ALLOW_LIVE_SUPABASE_TESTS=1 is explicitly set. This exists because a
project's real .env can easily end up pointed at the shared database by
default - don't remove this guard without a good reason.

If DATABASE_URL isn't reachable, every test in this suite is also skipped
with a clear reason instead of silently switching to SQLite.
"""
import os

os.environ.setdefault("JWT_SECRET", "test-jwt-secret")
os.environ.setdefault("AI_PROVIDER", "mock")

from datetime import datetime, timedelta, timezone

import pytest
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy import text
from sqlalchemy.exc import OperationalError
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base
from app.db import models  # noqa: F401 - registers every model on Base.metadata
from app.db.models.user import User, UserRole, VerificationStatus
from app.db.session import engine, get_db
from app.main import app

TEST_SECRET = os.environ["JWT_SECRET"]

TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def _looks_like_live_supabase(url: str) -> bool:
    """.supabase.co is the shared project host pattern - block it by default so
    `pytest` can never silently run writes against the team's real database,
    even though each test's own transaction is rolled back (see db_session
    fixture) - an interrupted test run (killed process, crash) can still
    leave a connection dropped mid-transaction, and this is a shared team
    resource, not a personal scratch database."""
    return "supabase.co" in url


def _db_available() -> bool:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return True
    except OperationalError:
        return False


IS_LIVE_SUPABASE = _looks_like_live_supabase(settings.DATABASE_URL)
ALLOW_LIVE_SUPABASE = os.environ.get("ALLOW_LIVE_SUPABASE_TESTS") == "1"
DB_AVAILABLE = (not IS_LIVE_SUPABASE or ALLOW_LIVE_SUPABASE) and _db_available()

if IS_LIVE_SUPABASE and not ALLOW_LIVE_SUPABASE:
    SKIP_REASON = (
        "DATABASE_URL points at a *.supabase.co host - refusing to run tests against it. "
        "This looks like the shared team Supabase project. Point DATABASE_URL at a "
        "throwaway/dev Postgres database instead, or set ALLOW_LIVE_SUPABASE_TESTS=1 if you "
        "are certain this is safe to write test data against and roll back."
    )
else:
    SKIP_REASON = (
        f"DATABASE_URL ({settings.DATABASE_URL}) is not reachable. Point it at a throwaway/dev "
        "Postgres database (not the shared team Supabase project) to run this suite - see "
        "tests/conftest.py."
    )


@pytest.fixture(autouse=True)
def _skip_if_db_unavailable():
    if not DB_AVAILABLE:
        pytest.skip(SKIP_REASON)


def _migration_applied() -> bool:
    """Whether backend/migrations/0001_*.sql has been run against DATABASE_URL -
    the full mentorship request/accept/schedule flow and the notifications
    table both depend on it."""
    if not DB_AVAILABLE:
        return False
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT mode, location, topic FROM mentor_meetings LIMIT 0"))
            conn.execute(text("SELECT 1 FROM notifications LIMIT 0"))
        return True
    except Exception:
        return False


MIGRATION_APPLIED = _migration_applied()
requires_migration = pytest.mark.skipif(
    not MIGRATION_APPLIED,
    reason=(
        "backend/migrations/0001_additive_notifications_and_mentorship.sql has not been applied "
        "to DATABASE_URL yet - run it in Supabase SQL Editor (or your dev Postgres) first."
    ),
)


@pytest.fixture()
def db_session():
    """Each test gets its own transaction, rolled back afterward - the schema
    itself (tables/enums) must already exist, matching production."""
    Base.metadata.create_all(bind=engine, checkfirst=True)
    connection = engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    try:
        yield session
    finally:
        session.close()
        transaction.rollback()
        connection.close()


@pytest.fixture()
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.pop(get_db, None)


def make_token(user_id: int) -> str:
    payload = {
        "sub": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, TEST_SECRET, algorithm=settings.JWT_ALGORITHM)


def create_user(db_session, role: UserRole, email: str, verified: bool = True) -> User:
    user = User(
        name=email.split("@")[0],
        email=email,
        password_hash=None,
        role=role,
        verification_status=VerificationStatus.VERIFIED if verified else VerificationStatus.PENDING,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture()
def auth_as(db_session):
    """Returns a factory: auth_as(role) -> (headers, user)."""

    import uuid

    def _factory(role: UserRole, email: str = None, verified: bool = True):
        email = email or f"{role.value}-{uuid.uuid4().hex[:8]}@example.com"
        user = create_user(db_session, role, email, verified)
        token = make_token(user.id)
        return {"Authorization": f"Bearer {token}"}, user

    return _factory
