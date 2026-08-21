import os
import json
import logging
import requests
from groq import Groq
from dotenv import load_dotenv
from prompt_builder import SYSTEM_PROMPT, build_user_message

load_dotenv()

logger = logging.getLogger(__name__)

# ── AWS Bedrock config ────────────────────────────────────────────────────────
BEDROCK_API_KEY = os.environ.get("BEDROCK_API_KEY", "")
AWS_REGION = os.environ.get("AWS_REGION", "us-east-1")
BEDROCK_MODEL_ID = os.environ.get(
    "BEDROCK_MODEL_ID", "mistral.mistral-large-2402-v1:0"
)

# ── Groq config ───────────────────────────────────────────────────────────────
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = "llama-3.3-70b-versatile"


def _parse_json_response(raw: str) -> dict:
    raw = raw.strip()
    if raw.startswith("```"):
        lines = raw.split("\n")
        raw = "\n".join(
            line for line in lines
            if not line.strip().startswith("```")
        )
    start = raw.find("{")
    end = raw.rfind("}") + 1
    if start == -1 or end == 0:
        raise ValueError("No JSON object found in model response")
    return json.loads(raw[start:end])


def _call_bedrock_mistral(profile: dict, message: str | None) -> dict:
    if not BEDROCK_API_KEY or "your-bedrock" in BEDROCK_API_KEY:
        raise RuntimeError("BEDROCK_API_KEY not configured")

    user_content = build_user_message(profile, message)
    url = f"https://bedrock-runtime.{AWS_REGION}.amazonaws.com/model/{BEDROCK_MODEL_ID}/converse"

    payload = {
        "system": [{"text": SYSTEM_PROMPT}],
        "messages": [{"role": "user", "content": [{"text": user_content}]}],
        "inferenceConfig": {"maxTokens": 2048, "temperature": 0.1}
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {BEDROCK_API_KEY}"
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    raw_text = data["output"]["message"]["content"][0]["text"]
    result = _parse_json_response(raw_text)
    result["model_used"] = f"AWS Bedrock / {BEDROCK_MODEL_ID}"
    return result


def _call_groq_llama(profile: dict, message: str | None) -> dict:
    if not GROQ_API_KEY or "your-groq" in GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY not configured")

    client = Groq(api_key=GROQ_API_KEY)
    user_content = build_user_message(profile, message)

    candidate_models = [
        "llama-3.1-8b-instant",
        "llama3-8b-8192",
        "llama-3.3-70b-versatile",
        "gemma2-9b-it",
        "mixtral-8x7b-32768",
    ]

    last_error = None
    for model_name in candidate_models:
        try:
            completion = client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": user_content}
                ],
                temperature=0.1,
                max_tokens=2048,
                response_format={"type": "json_object"}
            )

            raw_text = completion.choices[0].message.content
            result = _parse_json_response(raw_text)
            result["model_used"] = f"Groq / {model_name}"
            return result
        except Exception as e:
            last_error = e
            logger.info(f"Groq model {model_name} failed: {e}. Trying next model...")

    raise last_error or RuntimeError("All Groq models failed")


def _get_static_fallback_recommendation(profile: dict, message: str | None) -> dict:
    """
    Robust fallback mock recommendation tailored dynamically to the student profile 
    in case both AI endpoints fail.
    """
    name = profile.get("name", "Student")
    trade = profile.get("trade", "Electrician")
    goal = profile.get("career_goal", "build a career")
    readiness = profile.get("career_readiness_score", 70)
    
    # Extract gaps and existing skills
    gaps = profile.get("skill_gaps", [])
    skills = profile.get("existing_skills", [])
    
    gap_topic = gaps[0] if gaps else "Advanced Industry Applications"
    gap_reason = f"Directly targets your top identified skill gap of '{gap_topic}' for your {trade} path."
    
    rec = {
        "greeting": f"Hello {name}! Ready to take your next career step?",
        "profile_summary": f"You are a student of {trade} with {readiness}% career readiness. Your goal is to {goal}.",
        "recommended_topics": [
            {
                "topic": f"Mastering {gap_topic}",
                "reason": gap_reason
            },
            {
                "topic": f"Advanced {trade} Technologies",
                "reason": f"Builds on your existing strength in {skills[0] if skills else 'core practical skills'}."
            }
        ],
        "recommended_courses": [
            {
                "course": f"Specialized {gap_topic} Masterclass",
                "reason": "Structured online modules with step-by-step practical walk-throughs."
            },
            {
                "course": f"Industrial {trade} Internship Prep",
                "reason": "Mock assessments, standard operating procedures, and job application guide."
            }
        ],
        "roadmap": [
            {
                "step": 1,
                "title": f"Foundation of {gap_topic}",
                "description": "Learn the theory, key terminology, and read diagram symbols."
            },
            {
                "step": 2,
                "title": "Practical Lab Setup",
                "description": "Work with simulation software or physical workshop kits safely."
            },
            {
                "step": 3,
                "title": "Advanced Integration",
                "description": "Connect different components together, diagnose faults, and write test reports."
            },
            {
                "step": 4,
                "title": "Real-world Project",
                "description": "Create a fully documented assembly project from start to finish."
            }
        ],
        "next_action": {
            "title": f"Start {gap_topic} basics today",
            "description": "Review the first introductory video training module for 10 minutes."
        },
        "model_used": "Dynamic Mock Fallback Engine (Offline Backup)"
    }
    
    if message:
        rec["greeting"] = f"Answering your question, {name}!"
        rec["profile_summary"] = f"You asked: \"{message}\". Here is the best action plan based on your {trade} profile:"
        rec["next_action"] = {
            "title": f"Read the documentation for: {message[:30]}...",
            "description": "Follow the customized steps on your learning roadmap to build this capability."
        }
        
    return rec


def get_recommendation(profile: dict, message: str | None) -> dict:
    """
    Main entry point with 3-level fallback:
    1. AWS Bedrock Mistral
          ↓ Fail
    2. Groq Llama 3.3 70B
          ↓ Fail
    3. Dynamic Mock Recommendation Dashboard (Ensures zero runtime crashes)
    """
    # ── Attempt 1: AWS Bedrock Mistral ─────────────────────────────────────
    try:
        return _call_bedrock_mistral(profile, message)
    except Exception as e:
        logger.warning(f"Bedrock Mistral failed: {e}. Falling back to Groq...")

    # ── Attempt 2: Groq Llama 3.3 70B ──────────────────────────────────────
    try:
        return _call_groq_llama(profile, message)
    except Exception as e:
        logger.warning(f"Groq Llama 3.3 70B also failed: {e}. Using dynamic mock fallback...")

    # ── Attempt 3: Dynamic Mock Recommendation (Never crashes!) ────────────
    try:
        return _get_static_fallback_recommendation(profile, message)
    except Exception as e:
        logger.error(f"Mock recommendation builder failed: {e}")
        raise RuntimeError("AI Service error: Unable to generate recommendations.")
