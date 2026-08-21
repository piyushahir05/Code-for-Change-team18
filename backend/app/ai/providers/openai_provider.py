import json
from typing import Optional

import httpx

from app.ai.providers.base import AIProvider

SYSTEM_PROMPT = (
    "You are a career guidance assistant for ITI (Industrial Training Institute) students in India. "
    "You help with career guidance, skill-gap explanation, learning guidance, interview preparation, "
    "and job preparation. Be concise, practical, and encouraging. Use the student's context when given."
)


class OpenAIProvider(AIProvider):
    def __init__(self, api_key: str, model: str = "gpt-4o-mini", base_url: str = "https://api.openai.com/v1"):
        self.api_key = api_key
        self.model = model
        self.base_url = base_url

    def _complete(self, messages: list, response_format_json: bool = False) -> str:
        payload = {"model": self.model, "messages": messages, "temperature": 0.4}
        if response_format_json:
            payload["response_format"] = {"type": "json_object"}

        response = httpx.post(
            f"{self.base_url}/chat/completions",
            headers={"Authorization": f"Bearer {self.api_key}"},
            json=payload,
            timeout=20.0,
        )
        response.raise_for_status()
        data = response.json()
        return data["choices"][0]["message"]["content"]

    def chat(self, message: str, student_context: Optional[dict] = None) -> str:
        context_str = json.dumps(student_context) if student_context else "No profile context available."
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "system", "content": f"Student context: {context_str}"},
            {"role": "user", "content": message},
        ]
        return self._complete(messages)

    def profile_analysis(self, student_context: dict) -> dict:
        messages = [
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    "Analyze this student's profile and return strict JSON with keys "
                    "'summary' (string), 'focus_areas' (list of strings), 'next_steps' (list of strings). "
                    f"Profile: {json.dumps(student_context)}"
                ),
            },
        ]
        content = self._complete(messages, response_format_json=True)
        return json.loads(content)
