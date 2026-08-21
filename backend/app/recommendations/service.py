"""
Clean interface for student-facing recommendations.

RULE (Master Context section 17): the real recommendation algorithm is owned
by a separate team member/module. The rest of the backend must depend only
on this interface (RecommendationService), never on algorithm internals, so
swapping the implementation later requires no changes anywhere else.

IMPLEMENTATION ASSUMPTION: since no concrete algorithm was handed off yet,
this class contains a deterministic, rule-based placeholder so the student
dashboard, AI module, and tests all work end-to-end today. It should be the
only file that needs to change when the real algorithm lands.
"""
from typing import List

from sqlalchemy.orm import Session

from app.db.models.learning import LearningResource
from app.db.models.opportunity import Opportunity, OpportunityStatus
from app.db.models.student import StudentProfile


class RecommendationService:
    def get_career_readiness_score(self, student: StudentProfile) -> float:
        score = 0.0
        score += min(student.profile_completion, 100) * 0.4

        total_skills = len(student.skills)
        if total_skills:
            non_gap_ratio = sum(1 for s in student.skills if not s.is_gap) / total_skills
            score += non_gap_ratio * 30
        if student.career_goal:
            score += 10
        if student.interests:
            score += 10
        if student.experience:
            score += 10
        return round(min(score, 100.0), 1)

    def get_skill_gaps(self, student: StudentProfile) -> List[str]:
        return [s.skill_name for s in student.skills if s.is_gap]

    def get_recommended_career_paths(self, student: StudentProfile) -> List[str]:
        paths = []
        if student.career_goal:
            paths.append(student.career_goal)
        if student.trade:
            paths.append(f"Senior {student.trade}")
            paths.append(f"{student.trade} Supervisor")
        if not paths:
            paths = ["Explore trades and set a career goal to get tailored paths"]
        return paths[:5]

    def get_recommended_resources(self, db: Session, student: StudentProfile, limit: int = 5) -> List[LearningResource]:
        gap_skills = {s.skill_name.lower() for s in student.skills if s.is_gap}
        query = db.query(LearningResource)

        candidates = query.all()
        if gap_skills or student.trade:
            scored = []
            for resource in candidates:
                score = 0
                if resource.skill and resource.skill.lower() in gap_skills:
                    score += 2
                if student.trade and resource.trade and resource.trade.lower() == student.trade.lower():
                    score += 1
                if student.preferred_language and resource.language and resource.language.lower() == student.preferred_language.lower():
                    score += 1
                scored.append((score, resource))
            scored.sort(key=lambda pair: pair[0], reverse=True)
            ranked = [resource for score, resource in scored if score > 0]
            if ranked:
                return ranked[:limit]
        return candidates[:limit]

    def get_recommended_opportunities(self, db: Session, student: StudentProfile, limit: int = 5) -> List[Opportunity]:
        query = db.query(Opportunity).filter(Opportunity.status == OpportunityStatus.APPROVED)
        matched = query.all()

        def relevance(opportunity: Opportunity) -> int:
            score = 0
            trade_or_skill_targets = {s.skill_or_trade.lower() for s in opportunity.skills}
            if student.trade and student.trade.lower() in trade_or_skill_targets:
                score += 2
            if student.preferred_industry and opportunity.company and student.preferred_industry.lower() in opportunity.company.lower():
                score += 1
            if student.preferred_location and opportunity.location and student.preferred_location.lower() in opportunity.location.lower():
                score += 1
            return score

        matched.sort(key=relevance, reverse=True)
        return matched[:limit]

    def get_student_recommendations(self, db: Session, student: StudentProfile) -> dict:
        return {
            "career_readiness_score": self.get_career_readiness_score(student),
            "skill_gaps": self.get_skill_gaps(student),
            "recommended_learning": [
                {
                    "id": str(r.id),
                    "title": r.title,
                    "skill": r.skill,
                    "reason": "Matches a skill gap or your trade" if (r.skill and r.skill.lower() in {s.skill_name.lower() for s in student.skills if s.is_gap}) else "Popular resource for your trade",
                }
                for r in self.get_recommended_resources(db, student)
            ],
            "recommended_career_paths": self.get_recommended_career_paths(student),
            "recommended_opportunities": self.get_recommended_opportunities(db, student),
        }


recommendation_service = RecommendationService()
