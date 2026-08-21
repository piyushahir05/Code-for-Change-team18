"""
Development/demo seed data.

NOTE: these users are inserted directly into the application `users` table
with freshly generated UUIDs. They do NOT have matching Supabase Auth
accounts, so they cannot be used to log in through /api/auth/login.
This script exists to demonstrate the full data model and let you exercise
every non-auth-gated read path quickly (e.g. GET /api/opportunities,
GET /api/admin/analytics). For a login-capable demo account, register
through POST /api/auth/register instead.

Run with: python seed.py
"""
import uuid
from datetime import date, datetime, timedelta, timezone

from app.db.base import Base
from app.db.models.application import Application, ApplicationStatus
from app.db.models.learning import LearningProgress, LearningResource, LearningStatus
from app.db.models.mentor import MentorAssignment, MentorProfile
from app.db.models.mentorship import MentorshipMode, MentorshipSession, MentorshipStatus
from app.db.models.notification import Notification
from app.db.models.opportunity import Opportunity, OpportunitySkill, OpportunityStatus, OpportunityType
from app.db.models.recruiter import RecruiterProfile
from app.db.models.student import StudentInterest, StudentProfile, StudentSkill
from app.db.models.user import User, UserRole
from app.db.session import SessionLocal, engine


def uid() -> uuid.UUID:
    return uuid.uuid4()


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Seed data already present - skipping. Delete rows first to reseed.")
            return

        # --- Admin -----------------------------------------------------
        admin = User(id=uid(), email="admin@y4d.org", full_name="Y4D Admin", role=UserRole.ADMIN, is_verified=True)
        db.add(admin)

        # --- Students ----------------------------------------------------
        s1_user = User(id=uid(), email="ravi.electrician@example.com", full_name="Ravi Kumar", role=UserRole.STUDENT, is_verified=True)
        s2_user = User(id=uid(), email="priya.fitter@example.com", full_name="Priya Sharma", role=UserRole.STUDENT, is_verified=True)
        s3_user = User(id=uid(), email="amit.welder@example.com", full_name="Amit Verma", role=UserRole.STUDENT, is_verified=False)
        db.add_all([s1_user, s2_user, s3_user])
        db.flush()

        s1 = StudentProfile(
            user_id=s1_user.id, age=19, gender="Male", location="Pune", iti="Government ITI Pune",
            trade="Electrician", education="ITI Diploma", experience="Beginner",
            career_goal="Industrial Electrician", preferred_industry="Manufacturing",
            preferred_location="Pune", skill_confidence="Medium", preferred_language="Hindi",
        )
        s2 = StudentProfile(
            user_id=s2_user.id, age=20, gender="Female", location="Mumbai", iti="Government ITI Mumbai",
            trade="Fitter", education="ITI Diploma", experience="Beginner",
            career_goal="Precision Fitter", preferred_industry="Automotive",
            preferred_location="Mumbai", skill_confidence="High", preferred_language="Marathi",
        )
        s3 = StudentProfile(
            user_id=s3_user.id, age=21, gender="Male", location="Nashik", iti="Government ITI Nashik",
            trade="Welder", education="ITI Diploma", experience="6 months internship",
            career_goal="Structural Welder", preferred_industry="Construction",
            preferred_location="Nashik", skill_confidence="Medium", preferred_language="Hindi",
        )
        db.add_all([s1, s2, s3])
        db.flush()

        db.add_all([
            StudentSkill(student_profile_id=s1.id, skill_name="Basic Wiring", is_gap=False),
            StudentSkill(student_profile_id=s1.id, skill_name="Industrial Control Panels", is_gap=True),
            StudentSkill(student_profile_id=s1.id, skill_name="Workplace Safety", is_gap=True),
            StudentSkill(student_profile_id=s2.id, skill_name="Precision Measurement", is_gap=False),
            StudentSkill(student_profile_id=s2.id, skill_name="CNC Basics", is_gap=True),
            StudentSkill(student_profile_id=s3.id, skill_name="Arc Welding", is_gap=False),
            StudentSkill(student_profile_id=s3.id, skill_name="Blueprint Reading", is_gap=True),
        ])
        db.add_all([
            StudentInterest(student_profile_id=s1.id, interest="Renewable Energy"),
            StudentInterest(student_profile_id=s2.id, interest="Automotive Manufacturing"),
            StudentInterest(student_profile_id=s3.id, interest="Construction"),
        ])
        s1.profile_completion = 70
        s2.profile_completion = 65
        s3.profile_completion = 55

        # --- Mentors -------------------------------------------------------
        m1_user = User(id=uid(), email="mentor.electrical@example.com", full_name="Suresh Patil", role=UserRole.MENTOR, is_verified=True)
        m2_user = User(id=uid(), email="mentor.mechanical@example.com", full_name="Anjali Deshmukh", role=UserRole.MENTOR, is_verified=True)
        db.add_all([m1_user, m2_user])
        db.flush()

        m1 = MentorProfile(user_id=m1_user.id, bio="15 years in industrial electrical systems.", expertise="Electrician", organization="Y4D Foundation")
        m2 = MentorProfile(user_id=m2_user.id, bio="Mechanical trades mentor and former ITI faculty.", expertise="Fitter", organization="Y4D Foundation")
        db.add_all([m1, m2])
        db.flush()

        db.add_all([
            MentorAssignment(mentor_id=m1.id, student_id=s1.id),
            MentorAssignment(mentor_id=m2.id, student_id=s2.id),
        ])

        # --- Recruiters ------------------------------------------------
        r1_user = User(id=uid(), email="hr@voltagetech.example.com", full_name="Voltage Tech HR", role=UserRole.RECRUITER, is_verified=True)
        r2_user = User(id=uid(), email="hr@precisionauto.example.com", full_name="Precision Auto HR", role=UserRole.RECRUITER, is_verified=True)
        db.add_all([r1_user, r2_user])
        db.flush()

        r1 = RecruiterProfile(user_id=r1_user.id, company_name="Voltage Tech Industries", company_description="Industrial electrical equipment manufacturer.", industry="Manufacturing", website="https://voltagetech.example.com")
        r2 = RecruiterProfile(user_id=r2_user.id, company_name="Precision Auto Components", company_description="Automotive component supplier.", industry="Automotive", website="https://precisionauto.example.com")
        db.add_all([r1, r2])
        db.flush()

        # --- Opportunities -----------------------------------------------
        opp1 = Opportunity(
            recruiter_id=r1.id, type=OpportunityType.APPRENTICESHIP, title="Industrial Electrician Apprentice",
            description="Hands-on apprenticeship maintaining industrial control panels and wiring systems.",
            company="Voltage Tech Industries", location="Pune", stipend=12000, eligibility="ITI Electrician trade",
            experience="Fresher", deadline=date.today() + timedelta(days=30), status=OpportunityStatus.APPROVED,
        )
        opp2 = Opportunity(
            recruiter_id=r1.id, type=OpportunityType.JOB, title="Junior Electrician",
            description="Full-time role for panel wiring and maintenance.",
            company="Voltage Tech Industries", location="Pune", salary=180000, eligibility="ITI Electrician trade, 1+ yr",
            experience="1+ years", deadline=date.today() + timedelta(days=45), status=OpportunityStatus.PENDING,
        )
        opp3 = Opportunity(
            recruiter_id=r2.id, type=OpportunityType.RECRUITMENT_DRIVE, title="Fitter Recruitment Drive",
            description="Walk-in recruitment drive for precision fitters.",
            company="Precision Auto Components", location="Mumbai", stipend=15000, eligibility="ITI Fitter trade",
            experience="Fresher", deadline=date.today() + timedelta(days=20), status=OpportunityStatus.APPROVED,
        )
        db.add_all([opp1, opp2, opp3])
        db.flush()

        db.add_all([
            OpportunitySkill(opportunity_id=opp1.id, skill_or_trade="Electrician"),
            OpportunitySkill(opportunity_id=opp1.id, skill_or_trade="Industrial Control Panels"),
            OpportunitySkill(opportunity_id=opp2.id, skill_or_trade="Electrician"),
            OpportunitySkill(opportunity_id=opp3.id, skill_or_trade="Fitter"),
            OpportunitySkill(opportunity_id=opp3.id, skill_or_trade="Precision Measurement"),
        ])

        # --- Applications --------------------------------------------------
        db.add_all([
            Application(student_id=s1.id, opportunity_id=opp1.id, status=ApplicationStatus.SHORTLISTED),
            Application(student_id=s2.id, opportunity_id=opp3.id, status=ApplicationStatus.APPLIED),
        ])

        # --- Learning resources ---------------------------------------
        resources = [
            LearningResource(title="Workplace Communication Basics", category="Communication", skill="Workplace Safety", trade=None, language="Hindi", difficulty="Beginner", duration="2 hours", source="NGO", external_url="https://example.org/comm-basics"),
            LearningResource(title="Digital Literacy for Job Seekers", category="Digital Literacy", skill=None, trade=None, language="Hindi", difficulty="Beginner", duration="3 hours", source="NGO", external_url="https://example.org/digital-literacy"),
            LearningResource(title="Financial Literacy 101", category="Financial Literacy", skill=None, trade=None, language="Hindi", difficulty="Beginner", duration="1.5 hours", source="Government", external_url="https://example.org/financial-literacy"),
            LearningResource(title="Labour Law Awareness for Apprentices", category="Labour Law", skill=None, trade=None, language="English", difficulty="Beginner", duration="1 hour", source="Government", external_url="https://example.org/labour-law"),
            LearningResource(title="Industrial Control Panels Fundamentals", category="Trade Skills", skill="Industrial Control Panels", trade="Electrician", language="English", difficulty="Intermediate", duration="6 hours", source="Open Course", external_url="https://example.org/control-panels"),
            LearningResource(title="CNC Machine Basics", category="Trade Skills", skill="CNC Basics", trade="Fitter", language="English", difficulty="Intermediate", duration="5 hours", source="Open Course", external_url="https://example.org/cnc-basics"),
            LearningResource(title="Blueprint Reading for Welders", category="Trade Skills", skill="Blueprint Reading", trade="Welder", language="Hindi", difficulty="Beginner", duration="4 hours", source="Open Course", external_url="https://example.org/blueprint-reading"),
            LearningResource(title="Interview Preparation for ITI Graduates", category="Interview Preparation", skill=None, trade=None, language="Hindi", difficulty="Beginner", duration="2 hours", source="NGO", external_url="https://example.org/interview-prep"),
        ]
        db.add_all(resources)
        db.flush()

        db.add_all([
            LearningProgress(student_id=s1.id, resource_id=resources[4].id, status=LearningStatus.IN_PROGRESS, progress_percentage=40, started_at=datetime.now(timezone.utc)),
            LearningProgress(student_id=s1.id, resource_id=resources[0].id, status=LearningStatus.COMPLETED, progress_percentage=100, started_at=datetime.now(timezone.utc), completed_at=datetime.now(timezone.utc)),
            LearningProgress(student_id=s2.id, resource_id=resources[5].id, status=LearningStatus.NOT_STARTED, progress_percentage=0),
        ])

        # --- Mentorship sessions -----------------------------------------
        db.add_all([
            MentorshipSession(
                mentor_id=m1.id, student_id=s1.id, mode=MentorshipMode.ONLINE, topic="Career roadmap discussion",
                scheduled_at=datetime.now(timezone.utc) + timedelta(days=3),
                meeting_link="https://meet.example.com/mentor-ravi", status=MentorshipStatus.SCHEDULED,
            ),
            MentorshipSession(
                mentor_id=m2.id, student_id=s2.id, mode=None, topic="Introduction and goal setting",
                status=MentorshipStatus.REQUESTED,
            ),
        ])

        # --- Notifications -------------------------------------------------
        db.add_all([
            Notification(user_id=s1_user.id, title="Application status updated", message="Your application for 'Industrial Electrician Apprentice' is now SHORTLISTED.", type="APPLICATION_STATUS", read=False),
            Notification(user_id=r1_user.id, title="Opportunity approved", message="Your opportunity 'Industrial Electrician Apprentice' was approved.", type="OPPORTUNITY_APPROVED", read=True),
        ])

        db.commit()
        print("Seed data created successfully.")
    finally:
        db.close()


if __name__ == "__main__":
    run()
