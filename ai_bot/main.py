import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from models import ChatRequest, ChatResponse, StudentListItem
from database import fetch_student_profile, fetch_all_students
from ai_service import get_recommendation

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)


# ── App factory ───────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("ITI Career Chatbot API starting up")
    yield
    logger.info("ITI Career Chatbot API shutting down")


app = FastAPI(
    title="ITI Career Chatbot API",
    description="AI-powered career & learning recommendation chatbot for ITI students.",
    version="1.0.0",
    lifespan=lifespan,
)

# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8081",
        "http://localhost:8080",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:8081",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Routes ────────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": "ITI Career Chatbot API"}


@app.get("/api/students", response_model=list[StudentListItem])
async def list_students():
    """Return all students for the demo selector dropdown."""
    try:
        students = fetch_all_students()
        return students
    except Exception as e:
        logger.error(f"Failed to fetch students: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """
    Core endpoint.
    - Fetches verified student profile from Supabase.
    - Builds master prompt.
    - Calls AI layer with fallback chain.
    - Returns structured JSON recommendation.
    """
    logger.info(
        f"Chat request: student_id={req.student_id}, "
        f"message={'<question>' if req.message else '<dashboard open>'}"
    )

    # 1. Fetch profile
    try:
        profile = fetch_student_profile(req.student_id)
        if req.name:
            profile["name"] = req.name
        if req.trade:
            profile["trade"] = req.trade
        if req.career_goal:
            profile["career_goal"] = req.career_goal
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"DB error: {e}")
        raise HTTPException(status_code=500, detail="Database error: " + str(e))

    # 2. Get AI recommendation
    try:
        result = get_recommendation(profile, req.message)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.error(f"Unexpected AI error: {e}")
        raise HTTPException(status_code=500, detail="AI service error: " + str(e))

    return result
