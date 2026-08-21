from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENVIRONMENT: str = "development"

    # Direct PostgreSQL connection to the team's Supabase project (SQLAlchemy/psycopg2).
    # This is the actual database the teammate's schema.sql / init_database_full.sql was
    # applied to - get the connection string from Supabase -> Project Settings -> Database.
    DATABASE_URL: str = "postgresql+psycopg2://postgres:password@localhost:5432/postgres"

    # Optional: matches the teammate's backend/.env.example naming exactly. Not used by the
    # SQLAlchemy data path (DATABASE_URL is), but kept available for any future use of the
    # Supabase client (e.g. Storage) against the same project.
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # App-issued auth. The teammate's schema has no auth.users link at all - public.users is
    # a plain table with its own password_hash column (bcrypt via pgcrypto) - so this backend
    # is the source of truth for issuing/verifying session tokens, not Supabase Auth.
    JWT_SECRET: str = ""
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24

    # AI
    AI_PROVIDER: str = "mock"  # mock | openai | groq
    AI_API_KEY: str = ""
    AI_MODEL: str = ""

    # CORS - comma separated origins
    FRONTEND_URL: str = "http://localhost:5173,http://localhost:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_URL.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
