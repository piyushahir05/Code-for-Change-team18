from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.admin.router import router as admin_router
from app.ai.router import router as ai_router
from app.applications.router import router as applications_router
from app.auth.router import router as auth_router
from app.core.config import settings
from app.core.errors import register_error_handlers
from app.learning.router import router as learning_router
from app.mentors.router import router as mentors_router
from app.mentorship.router import router as mentorship_router
from app.notifications.router import router as notifications_router
from app.opportunities.router import router as opportunities_router
from app.recruiters.router import router as recruiters_router
from app.students.router import router as students_router

app = FastAPI(
    title="ITI Digital Employability & Career Progression Platform API",
    description="Backend for the ITI Digital Employability & Career Progression Platform (Mastercard Code for Change hackathon).",
    version="1.0.0",
)

register_error_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(students_router)
app.include_router(mentors_router)
app.include_router(recruiters_router)
app.include_router(opportunities_router)
app.include_router(applications_router)
app.include_router(learning_router)
app.include_router(mentorship_router)
app.include_router(ai_router)
app.include_router(notifications_router)
app.include_router(admin_router)


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
