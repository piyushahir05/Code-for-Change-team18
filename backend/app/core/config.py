from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    ENVIRONMENT: str = "development"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""

    # Database (direct Postgres connection used by SQLAlchemy)
    DATABASE_URL: str = "postgresql+psycopg2://postgres:password@localhost:5432/postgres"

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
