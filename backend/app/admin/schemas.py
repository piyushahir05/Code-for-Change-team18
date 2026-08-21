from pydantic import BaseModel


class AnalyticsOut(BaseModel):
    total_students: int
    verified_students: int
    total_mentors: int
    total_recruiters: int
    verified_recruiters: int
    active_opportunities: int
    total_applications: int
    placements: int
