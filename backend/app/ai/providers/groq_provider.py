from app.ai.providers.openai_provider import OpenAIProvider


class GroqProvider(OpenAIProvider):
    """Groq exposes an OpenAI-compatible chat completions API."""

    def __init__(self, api_key: str, model: str = "llama-3.1-8b-instant"):
        super().__init__(api_key=api_key, model=model, base_url="https://api.groq.com/openai/v1")
