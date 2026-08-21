# ITI Digital Employability & Career Progression Platform — Backend

Backend for the **ITI Digital Employability & Career Progression Platform**,
built for the Mastercard Code for Change hackathon (problem owner: Y4D
Foundation). This service implements the complete API described in the
project's Master Context document: student profiles, recruiter-posted
opportunities with admin approval, applications, learning, mentorship,
AI career guidance, recommendations, notifications, and admin management.

## 1. Project

An "Employability Journey Platform" for ITI students, connecting learning,
AI career guidance, skill development, opportunities, mentorship,
application tracking, recruiters, and NGO/institution support in one
ecosystem. See the end-to-end flow in section 11 below.

## 2. Architecture

Simple **modular monolith** — one FastAPI application, internally split into
feature modules (`auth`, `students`, `mentors`, `recruiters`,
`opportunities`, `applications`, `learning`, `mentorship`,
`recommendations`, `ai`, `notifications`, `admin`), each generally
containing `router.py` (HTTP layer), `schemas.py` (Pydantic request/response
models), and `service.py` (business logic + DB queries).

```
React (frontend)
      │
      ▼
Supabase Auth  ──issues──▶  JWT
      │                       │
      ▼                       ▼
                          FastAPI (this repo)
                               │
                 ┌─────────────┼──────────────┐
                 ▼             ▼              ▼
          Business Logic  Recommendation   AI Adapter
                 │             │              │
                 └─────────────┼──────────────┘
                                ▼
                     Supabase PostgreSQL
```

Supabase owns authentication and the Postgres database. FastAPI owns all
business logic, REST API, validation, authorization, workflows, and the
AI/recommendation integration. No custom password storage exists anywhere
in this codebase — Supabase Auth is the sole source of truth for credentials.

## 3. Folder structure

```
backend/
├── app/
│   ├── main.py                FastAPI app, routers, CORS, error handlers
│   ├── core/                  config, JWT/security, shared dependencies, error types
│   ├── db/                    SQLAlchemy session/engine, declarative Base, models/
│   ├── auth/                  register/login/me (Supabase Auth bridge)
│   ├── users/                 shared user lookup/verification helpers
│   ├── students/               student profile + skills/interests + progress + recommendations
│   ├── mentors/                mentor profile, discovery, assigned students
│   ├── recruiters/             recruiter profile
│   ├── opportunities/          opportunity CRUD + visibility rules
│   ├── applications/           apply, track, recruiter review, status updates
│   ├── learning/               resources + progress tracking
│   ├── mentorship/              requests, accept/reject, scheduling (physical/online)
│   ├── recommendations/        RecommendationService (pluggable interface)
│   ├── ai/                     AIService + provider adapters (mock/openai/groq)
│   ├── notifications/          in-app notifications
│   └── admin/                  verification, opportunity approval, analytics
├── tests/                      pytest suite (SQLite in-memory, JWTs signed like Supabase)
├── alembic/                    migrations (autogenerate against app.db.base.Base)
├── seed.py                     demo/dev seed data
├── requirements.txt
├── .env.example
└── README.md
```

## 4. Technology stack

FastAPI · Python · PostgreSQL via Supabase · SQLAlchemy · Alembic ·
Supabase Auth · REST · Pydantic · Modular Monolith.

## 5. Supabase setup

1. Create a project at https://supabase.com.
2. In **Project Settings → API**, copy the Project URL, `anon` key, and
   `service_role` key into `.env` (`SUPABASE_URL`, `SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY`).
3. In **Project Settings → API → JWT Settings**, copy the JWT Secret into
   `SUPABASE_JWT_SECRET` — this is what FastAPI uses to verify tokens
   Supabase issues to the frontend.
4. In **Project Settings → Database**, copy the connection string into
   `DATABASE_URL` (use the `postgresql+psycopg2://` scheme for SQLAlchemy).
5. The `service_role` key must **never** be sent to the frontend — it is
   used only server-side (`app/core/security.py`) to create users during
   `/api/auth/register`.

## 6. Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Used to proxy sign-in on behalf of the frontend |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-side only — creates Auth users on register |
| `SUPABASE_JWT_SECRET` | Verifies JWTs issued by Supabase Auth |
| `DATABASE_URL` | Direct Postgres connection for SQLAlchemy/Alembic |
| `AI_PROVIDER` | `mock` \| `openai` \| `groq` |
| `AI_API_KEY` | API key for the chosen AI provider (unused for `mock`) |
| `AI_MODEL` | Optional model override |
| `FRONTEND_URL` | Comma-separated list of allowed CORS origins |

## 7. Database setup

```bash
pip install -r requirements.txt
alembic revision --autogenerate -m "init schema"
alembic upgrade head
```

This creates every table defined in `app/db/models/`: `users`,
`student_profiles`, `student_skills`, `student_interests`,
`mentor_profiles`, `mentor_assignments`, `recruiter_profiles`,
`opportunities`, `opportunity_skills`, `applications`,
`learning_resources`, `learning_progress`, `mentorship_sessions`,
`notifications` — with foreign keys, the `UNIQUE(student_id, opportunity_id)`
duplicate-application guard, and enum/status constraints as specified in the
Master Context.

## 8. Authentication

Registration and login are proxied through FastAPI so the frontend only
ever talks to one API:

```
POST /api/auth/register  { email, password, full_name, role } → creates the
                            Supabase Auth user + the local `users` row, then
                            signs in and returns an access_token.
POST /api/auth/login      { email, password } → signs in via Supabase and
                            returns an access_token.
GET  /api/auth/me         Authorization: Bearer <token> → the current
                            application user.
```

Every other protected route expects `Authorization: Bearer <supabase JWT>`.
`app/core/dependencies.py` validates the token, loads the matching `users`
row, and exposes `require_student` / `require_mentor` / `require_recruiter`
/ `require_admin` dependencies — the frontend-claimed role is never trusted,
only the database row is.

## 9. Running FastAPI

```bash
cp .env.example .env   # then fill in real values
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000`.

## 10. Running tests

```bash
pytest
```

Tests run against an in-memory SQLite database (via a `get_db` dependency
override) and sign their own JWTs with a test secret, so they need no live
Supabase project. Coverage follows the priority order from the project
brief: auth, authorization, student profile, recruiter profile, opportunity
creation, admin approval, opportunity visibility, application creation +
duplicate prevention + status updates, learning progress, mentorship
(physical & online), the AI endpoint, and the recommendation interface.

## 11. API documentation

Interactive docs are auto-generated by FastAPI:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Core end-to-end flow (the P0 vertical slice)

```
Student registers → completes profile
Recruiter registers → creates an opportunity (status = PENDING)
Admin approves the opportunity (status = APPROVED)
Student sees it in GET /api/opportunities → applies (POST /api/applications)
Recruiter reviews it → updates status (PUT /api/applications/{id}/status)
Student sees the updated status (GET /api/applications/student)
```

### Route summary

See `app/main.py` for the full router list, or `/docs` for the live
contract. Route prefixes: `/api/auth`, `/api/students`, `/api/mentors`,
`/api/recruiters`, `/api/opportunities`, `/api/applications`,
`/api/resources` (learning), `/api/mentorships`, `/api/ai`,
`/api/notifications`, `/api/admin`.

A few routes exist beyond the Master Context's section 32 contract to
support capabilities that section explicitly requires but doesn't route
(e.g. `PUT /api/mentors/profile`, `PUT /api/recruiters/profile`,
`GET /api/mentors/students`, `GET /api/admin/opportunities`,
`GET/PUT /api/notifications`). Each is marked `IMPLEMENTATION ASSUMPTION`
in its source file.

## 12. AI configuration

`app/ai/` is an isolated adapter: `AIService` (in `service.py`) is the only
thing the rest of the app depends on. It selects a concrete `AIProvider`
(`providers/mock_provider.py`, `openai_provider.py`, `groq_provider.py`)
based on `AI_PROVIDER`, and **always** falls back to the deterministic
mock/rule-based provider if the real provider errors — so an AI outage
never breaks the student dashboard. Swapping providers requires no changes
outside `app/ai/`.

## 13. Recommendation integration

`app/recommendations/service.py` exposes `RecommendationService` with
`get_student_recommendations`, `get_recommended_resources`, and
`get_recommended_opportunities`. The rest of the backend (student
dashboard, AI context-building) only calls this interface. **The scoring
logic inside it today is a deterministic placeholder** (profile
completeness + skill-gap/trade matching) — per the Master Context, the real
algorithm is owned by a separate recommendation developer/module and should
replace only the internals of this file.

## 14. Seed data

```bash
python seed.py
```

Creates a fictional demo dataset: an admin, 3 students (with skills,
interests, and varying profile completeness), 2 mentors (with assignments),
2 recruiters, 3 opportunities (approved/pending), 2 applications, 8 learning
resources across the categories from the Master Context, learning progress
records, and 2 mentorship sessions (one scheduled online, one still
requested). These demo users have no matching Supabase Auth account (see
the docstring in `seed.py`) — register through `/api/auth/register` for a
login-capable account.

## Implementation assumptions

Called out inline in code with `IMPLEMENTATION ASSUMPTION` wherever the
Master Context didn't fully specify a mechanism (mentor/recruiter own-profile
routes, skills/interests entry via the profile PUT payload,
`profile_completion`/`career_readiness_score` calculation, the admin
opportunity-review listing route, and the notifications listing routes).
None of these change the defined database schema, relationships, or roles —
they only fill gaps in *how* an already-specified capability is exposed.
