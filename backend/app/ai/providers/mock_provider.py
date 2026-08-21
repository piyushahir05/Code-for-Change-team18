from typing import Optional

from app.ai.providers.base import AIProvider


class MockProvider(AIProvider):
    """
    Deterministic, rule-based fallback. Always available - no network call,
    no API key. Used when AI_PROVIDER=mock, and as the automatic fallback
    when a real provider fails, so the AI failing never breaks the student
    dashboard (Master Context section 16 / 43).
    """

    def chat(self, message: str, student_context: Optional[dict] = None) -> str:
        trade = (student_context or {}).get("trade")
        goal = (student_context or {}).get("career_goal")
        gaps = (student_context or {}).get("skill_gaps") or []

        lines = []
        if goal:
            lines.append(f"To move toward becoming a {goal}, focus on closing your top skill gaps first.")
        elif trade:
            lines.append(f"As a {trade} student, focus on the fundamentals of your trade and build hands-on experience.")
        else:
            lines.append("Set a career goal and trade on your profile so I can give more specific guidance.")

        if gaps:
            lines.append("Priority skills to work on: " + ", ".join(gaps[:3]) + ".")
        lines.append("Check the Learning section for resources matched to your gaps, and browse approved opportunities that fit your trade.")
        lines.append(f"(You asked: \"{message.strip()}\")")
        return " ".join(lines)

    def profile_analysis(self, student_context: dict) -> dict:
        gaps = student_context.get("skill_gaps") or []
        trade = student_context.get("trade")
        goal = student_context.get("career_goal")

        summary = "Complete your profile (trade, career goal, skills) to get a tailored analysis."
        if trade or goal:
            summary = (
                f"You're on the path toward {goal or trade}. "
                + (f"You have {len(gaps)} skill gap(s) to close." if gaps else "You have no flagged skill gaps yet - keep building experience.")
            )

        return {
            "summary": summary,
            "focus_areas": gaps[:3] if gaps else ["Complete your skills and interests"],
            "next_steps": [
                "Review your recommended learning resources",
                "Apply to at least one approved opportunity matching your trade",
                "Request mentorship for personalized guidance",
            ],
        }
