"""
Database connectivity / sanity check - READ ONLY.

This used to be an INSERT-based demo seed script. It no longer is one: the
team's actual Supabase database already has demo data seeded by the
teammate's backend/init_database_full.sql (36 students, 9 mentors,
8 recruiters, opportunities, applications, learning resources/progress,
mentor availability, and mentor meetings - password for every seeded
account is `Password123!`).

Running the old version of this script against that database would either
fail outright (the schema doesn't match what it assumed - integer PKs,
different enum values, no `notifications` table) or insert duplicate/
conflicting demo data on top of a shared team database. Neither is
acceptable, so this script now only reads and reports - it makes no writes.

Run with: python seed.py
"""
from app.db.models.application import Application
from app.db.models.learning import LearningProgress, LearningResource
from app.db.models.mentor import MentorAssignment, MentorAvailability, MentorProfile
from app.db.models.mentorship import MentorMeeting
from app.db.models.opportunity import Opportunity, OpportunitySkill
from app.db.models.recruiter import RecruiterProfile
from app.db.models.student import StudentInterest, StudentProfile, StudentSkill
from app.db.models.user import User
from app.db.session import SessionLocal

TABLES = [
    ("users", User),
    ("student_profiles", StudentProfile),
    ("student_skills", StudentSkill),
    ("student_interests", StudentInterest),
    ("mentor_profiles", MentorProfile),
    ("mentor_assignments", MentorAssignment),
    ("mentor_availability", MentorAvailability),
    ("recruiter_profiles", RecruiterProfile),
    ("opportunities", Opportunity),
    ("opportunity_skills", OpportunitySkill),
    ("applications", Application),
    ("learning_resources", LearningResource),
    ("learning_progress", LearningProgress),
    ("mentor_meetings (mentorship)", MentorMeeting),
]


def run():
    db = SessionLocal()
    try:
        print(f"Connected OK. Row counts (via SQLAlchemy models -> {db.bind.url.database}):\n")
        for label, model in TABLES:
            try:
                count = db.query(model).count()
                print(f"  {label:<28} {count}")
            except Exception as exc:
                print(f"  {label:<28} ERROR: {exc}")
        print(
            "\nIf `mentor_meetings` or `notifications`-related counts errored above, "
            "the proposed migration in backend/migrations/0001_*.sql has not been applied yet."
        )
    finally:
        db.close()


if __name__ == "__main__":
    run()
