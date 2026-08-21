import logging
from typing import Optional

from app.ai.providers.base import AIProvider
from app.ai.providers.mock_provider import MockProvider
from app.core.config import settings

logger = logging.getLogger("app.ai")


def _build_provider() -> AIProvider:
    provider_name = (settings.AI_PROVIDER or "mock").lower()

    if provider_name == "mock" or not settings.AI_API_KEY:
        return MockProvider()

    try:
        if provider_name == "openai":
            from app.ai.providers.openai_provider import OpenAIProvider

            return OpenAIProvider(api_key=settings.AI_API_KEY, model=settings.AI_MODEL or "gpt-4o-mini")
        if provider_name == "groq":
            from app.ai.providers.groq_provider import GroqProvider

            return GroqProvider(api_key=settings.AI_API_KEY, model=settings.AI_MODEL or "llama-3.1-8b-instant")
    except Exception:
        logger.exception("Failed to construct AI provider '%s', falling back to mock", provider_name)

    return MockProvider()


class AIService:
    """
    RULE (Master Context section 18): AI is an assistant, never the source of
    truth for auth/status/permissions/verification/approval/DB integrity.
    RULE (section 16/43): AI failure must never break the student dashboard -
    every call here falls back to the deterministic mock provider on error.
    """

    def __init__(self):
        self._provider = _build_provider()
        self._fallback = MockProvider()

    def chat(self, message: str, student_context: Optional[dict] = None) -> str:
        try:
            return self._provider.chat(message, student_context)
        except Exception:
            logger.exception("AI chat call failed, using rule-based fallback")
            return self._fallback.chat(message, student_context)

    def profile_analysis(self, student_context: dict) -> dict:
        try:
            return self._provider.profile_analysis(student_context)
        except Exception:
            logger.exception("AI profile analysis failed, using rule-based fallback")
            return self._fallback.profile_analysis(student_context)


ai_service = AIService()
