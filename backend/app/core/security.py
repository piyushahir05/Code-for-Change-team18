"""
JWT validation for Supabase Auth tokens, and a thin wrapper around the
Supabase client used for admin (service-role) and auth (anon) operations.

Supabase Auth issues HS256 JWTs signed with the project's JWT secret.
FastAPI never issues its own tokens - it only verifies the ones Supabase
already handed to the frontend.
"""
from functools import lru_cache
from typing import Optional

from fastapi import HTTPException, status
from jose import jwt, JWTError
from supabase import create_client, Client

from app.core.config import settings


def decode_supabase_jwt(token: str) -> dict:
    if not settings.SUPABASE_JWT_SECRET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Server misconfiguration: SUPABASE_JWT_SECRET is not set",
        )
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


@lru_cache
def get_supabase_admin() -> Optional[Client]:
    """Service-role client. Server-side only - never expose this key to the frontend."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        return None
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)


@lru_cache
def get_supabase_anon() -> Optional[Client]:
    """Anon-key client, used only to proxy sign-in on behalf of the frontend."""
    if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
        return None
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
