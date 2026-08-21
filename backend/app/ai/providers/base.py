from abc import ABC, abstractmethod
from typing import List, Optional


class AIProvider(ABC):
    """
    Every AI provider (OpenAI, Groq, mock/rule-based, ...) implements this
    interface. The rest of the application only ever talks to AIProvider,
    never to a concrete provider, so the provider is swappable via the
    AI_PROVIDER environment variable (Master Context RULE 4).
    """

    @abstractmethod
    def chat(self, message: str, student_context: Optional[dict] = None) -> str:
        ...

    @abstractmethod
    def profile_analysis(self, student_context: dict) -> dict:
        ...
