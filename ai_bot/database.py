import os
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional
import logging

load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL: str = os.environ.get("SUPABASE_URL", "")
# Accept both SUPABASE_ANON_KEY (standard) and SUPABASE_KEY (legacy alias)
SUPABASE_ANON_KEY: str = (
    os.environ.get("SUPABASE_ANON_KEY")
    or os.environ.get("SUPABASE_KEY")
    or ""
)

# ── Dynamic Demo Mock Data ───────────────────────────────────────────────────
# If the user's database is empty or queries return no rows, we use these.
MOCK_STUDENTS = {
    1: {
        "student_id": 1,
        "name": "Aarav Patil",
        "age": 20,
        "gender": "Male",
        "location": "Pune",
        "iti": "Government ITI Pune",
        "trade": "Electrician",
        "education": "ITI Electrician",
        "experience": "Industrial electrical maintenance",
        "career_goal": "Become an industrial maintenance electrician and learn automation",
        "preferred_industry": "Manufacturing",
        "preferred_location": "Pune",
        "skill_confidence": 78,
        "profile_completion": 84,
        "career_readiness_score": 76,
        "preferred_language": "Marathi",
        "existing_skills": ["Electrical Wiring", "Motor Control", "Electrical Safety", "Industrial Wiring"],
        "skill_gaps": ["PLC Basics", "Control Panels"],
        "interests": ["Electrical Maintenance", "PLC", "Renewable Energy"]
    },
    2: {
        "student_id": 2,
        "name": "Saanvi Jadhav",
        "age": 19,
        "gender": "Female",
        "location": "Nashik",
        "iti": "Government ITI Nashik",
        "trade": "Fitter",
        "education": "ITI Fitter",
        "experience": "Mechanical assembly",
        "career_goal": "Build a career in plant maintenance and production",
        "preferred_industry": "Automotive",
        "preferred_location": "Nashik",
        "skill_confidence": 72,
        "profile_completion": 79,
        "career_readiness_score": 72,
        "preferred_language": "Marathi",
        "existing_skills": ["Mechanical Assembly", "Measurement & Gauges", "Preventive Maintenance", "Technical Drawings"],
        "skill_gaps": ["Hydraulics", "Quality Inspection"],
        "interests": ["Quality Inspection", "CNC", "Plant Maintenance"]
    },
    3: {
        "student_id": 3,
        "name": "Rohan Shinde",
        "age": 22,
        "gender": "Male",
        "location": "Nagpur",
        "iti": "Government ITI Nagpur",
        "trade": "Welder",
        "education": "ITI Welder",
        "experience": "Fabrication and welding",
        "career_goal": "Become a certified industrial welding technician",
        "preferred_industry": "Automotive",
        "preferred_location": "Nagpur",
        "skill_confidence": 68,
        "profile_completion": 74,
        "career_readiness_score": 68,
        "preferred_language": "Hindi",
        "existing_skills": ["MIG Welding", "Welding Safety", "Fabrication", "Technical Drawings"],
        "skill_gaps": ["TIG Welding", "Weld Inspection"],
        "interests": ["Quality", "Fabrication", "Automotive Manufacturing"]
    },
    4: {
        "student_id": 4,
        "name": "Isha More",
        "age": 21,
        "gender": "Female",
        "location": "Mumbai",
        "iti": "Government ITI Mumbai",
        "trade": "COPA",
        "education": "ITI COPA",
        "experience": "IT support and office automation",
        "career_goal": "Start a career in IT support and digital operations",
        "preferred_industry": "IT Services",
        "preferred_location": "Mumbai",
        "skill_confidence": 88,
        "profile_completion": 91,
        "career_readiness_score": 80,
        "preferred_language": "English",
        "existing_skills": ["Data Entry", "Digital Literacy", "Computer Hardware", "Documentation"],
        "skill_gaps": ["Basic Networking", "MS Excel"],
        "interests": ["IT Support", "Data Operations", "Office Automation"]
    }
}

_client: Optional[Client] = None
use_mock = False

if not SUPABASE_URL or not SUPABASE_ANON_KEY or "your-project" in SUPABASE_URL:
    print("⚠️ Supabase credentials missing. Running database in mock fallback mode.")
    use_mock = True
else:
    try:
        _client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
    except Exception as e:
        print(f"⚠️ Failed to initialize Supabase client: {e}. Falling back to mock data.")
        use_mock = True


def _get_all_mock_students() -> list:
    return [
        {
            "id": s["student_id"],
            "name": s["name"],
            "trade": s["trade"],
            "career_goal": s["career_goal"],
            "career_readiness_score": s["career_readiness_score"]
        }
        for s in MOCK_STUDENTS.values()
    ]


def fetch_student_profile(student_id: int) -> dict:
    """
    Fetch and assemble the full student profile from the live Supabase database.
    """
    if use_mock:
        return MOCK_STUDENTS.get(student_id, MOCK_STUDENTS[1])

    try:
        sb = _client
        profile_res = (
            sb.table("student_profiles")
            .select(
                "id, age, gender, location, iti, trade, education, experience, "
                "career_goal, preferred_industry, preferred_location, "
                "skill_confidence, profile_completion, career_readiness_score, "
                "preferred_language, "
                "users(name, email)"
            )
            .eq("id", student_id)
            .single()
            .execute()
        )

        if not profile_res.data:
            logger.warning(f"Student ID {student_id} not found in live DB. Using mock data.")
            return MOCK_STUDENTS.get(student_id, MOCK_STUDENTS[1])

        profile = profile_res.data

        # Fetch skills
        skills_res = (
            sb.table("student_skills")
            .select("skill_name, is_gap")
            .eq("student_profile_id", student_id)
            .execute()
        )

        existing_skills = [
            s["skill_name"] for s in skills_res.data if not s["is_gap"]
        ]
        skill_gaps = [
            s["skill_name"] for s in skills_res.data if s["is_gap"]
        ]

        # Fetch interests
        interests_res = (
            sb.table("student_interests")
            .select("interest")
            .eq("student_profile_id", student_id)
            .execute()
        )
        interests = [i["interest"] for i in interests_res.data]

        user_data = profile.get("users") or {}
        return {
            "student_id": student_id,
            "name": user_data.get("name", "Student"),
            "age": profile.get("age"),
            "gender": profile.get("gender"),
            "location": profile.get("location"),
            "iti": profile.get("iti"),
            "trade": profile.get("trade"),
            "education": profile.get("education"),
            "experience": profile.get("experience"),
            "career_goal": profile.get("career_goal"),
            "preferred_industry": profile.get("preferred_industry"),
            "preferred_location": profile.get("preferred_location"),
            "skill_confidence": profile.get("skill_confidence"),
            "profile_completion": profile.get("profile_completion"),
            "career_readiness_score": profile.get("career_readiness_score"),
            "preferred_language": profile.get("preferred_language"),
            "existing_skills": existing_skills,
            "skill_gaps": skill_gaps,
            "interests": interests,
        }
    except Exception as e:
        print(f"⚠️ Database query failed: {e}. Falling back to local profile mockup.")
        return MOCK_STUDENTS.get(student_id, MOCK_STUDENTS[1])


def fetch_all_students() -> list:
    """
    Return all students for the dropdown.
    Falls back to mock list if live database is empty or query fails.
    """
    if use_mock:
        return _get_all_mock_students()

    try:
        sb = _client
        res = (
            sb.table("student_profiles")
            .select(
                "id, trade, career_goal, career_readiness_score, "
                "users(name)"
            )
            .order("id")
            .execute()
        )

        if not res.data or len(res.data) == 0:
            print("⚠️ Supabase student_profiles table is empty. Using mock demo students.")
            return _get_all_mock_students()

        students = []
        for row in res.data:
            user = row.get("users") or {}
            students.append(
                {
                    "id": row["id"],
                    "name": user.get("name", f"Student {row['id']}"),
                    "trade": row.get("trade", ""),
                    "career_goal": row.get("career_goal", ""),
                    "career_readiness_score": row.get("career_readiness_score", 0),
                }
            )
        return students
    except Exception as e:
        print(f"⚠️ Database query failed: {e}. Returning offline fallback student list.")
        return _get_all_mock_students()
