# ITI Digital Employability & Career Progression Platform — Backend

Backend for the **ITI Digital Employability & Career Progression Platform**,
built for the Mastercard Code for Change hackathon (problem owner: Y4D
Foundation). This service implements the API described in the project's
Master Context document — student profiles, recruiter-posted opportunities
with admin approval, applications, learning, mentorship, AI career guidance,
recommendations, notifications, and admin management — **adapted to run on
the actual Supabase PostgreSQL database a teammate already built**
(`schema.sql` / `init_database_full.sql`), which is the source of truth for
every table, column, and enum in this codebase.

> If you're comparing this to an earlier version of this backend: it used to
> assume Supabase Auth + UUID primary keys. The team's real database uses
> neither (see "Database source of truth" below) — this version was
> rewritten to match what actually exists.

## 1. Project

An "Employability Journey Platform" for ITI students, connecting learning,
AI career guidance, skill development, opportunities, mentorship,
application tracking, recruiters, and NGO/institution support in one
ecosystem. See the end-to-end flow in section 12 below.

## 2. Database source of truth

The team's Supabase project's schema was authored independently
(`backend/schema.sql` / `backend/init_database_full.sql` in the teammate's
copy of this repo) and is **not** what the Master Context originally
specified. This backend's SQLAlchemy models were rewritten to match that
real schema exactly, not the other way around. The differences that matter
most:

| | Master Context assumed | Actual schema |
|---|---|---|
| Primary keys | UUID | `serial` integers |
| Auth | Supabase Auth (`auth.users`) | None — `public.users.password_hash` (bcrypt), no `auth.users` link at all |
| `users.verification_status`/roles | `is_verified` boolean | `user_verification_status` enum (`pending`/`verified`/`rejected`); `user_role` lowercase (`student`/`mentor`/`recruiter`/`admin`) |
| `opportunities.status` | `PENDING`/`APPROVED`/`REJECTED`/`CLOSED` | `draft`/`active`/`closed`/`filled` (no dedicated rejected state) |
| `opportunities.type` | `JOB`/`APPRENTICESHIP`/`RECRUITMENT_DRIVE` | `job`/`apprenticeship`/`internship`/`training` |
| `applications.status` | includes `UNDER_REVIEW` | `applied`/`shortlisted`/`interview`/`selected`/`rejected` (no under_review) |
| `applications` duplicate guard | `UNIQUE(student_id, opportunity_id)` | **no such constraint** — enforced at the app layer only |
| Mentorship | one `mentorship_sessions` table | `mentor_availability` (recurring weekly slots) + `mentor_meetings` (booked slot, `assignment_id` FK) |
| `notifications` table | present | **does not exist** |

Because this is a shared team database, this backend **never runs
destructive or schema-altering SQL**. Two genuine gaps (see below) are
proposed as an **additive, non-destructive** migration your team reviews
and runs itself — see `backend/migrations/0001_*.sql`.

## 3. Architecture

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
FastAPI (this repo)
      │  issues its own JWT after checking users.password_hash
      │  (no Supabase Auth link in this schema - see section 2)
      │
      ├─────────────┬──────────────┐
      ▼             ▼              ▼
Business Logic  Recommendation   AI Adapter
      │             │              │
      └─────────────┼──────────────┘
                     ▼
     Supabase PostgreSQL (direct connection via SQLAlchemy)
```

FastAPI owns all business logic, REST API, validation, authorization,
workflows, auth (see section 8), and the AI/recommendation integration.
Data access is direct SQLAlchemy → Postgres (`DATABASE_URL`), the same
architecture as before — the Supabase Python client is not used for the
data path.

## 4. Folder structure

```
backend/
├── app/
│   ├── main.py                FastAPI app, routers, CORS, error handlers
│   ├── core/                  config, JWT issuing/verification, password hashing, dependencies, error types
│   ├── db/                    SQLAlchemy session/engine, declarative Base, models/ (mirrors schema.sql exactly)
│   ├── auth/                  register/login/me (local password_hash-based auth)
│   ├── users/                 shared user lookup/verification helpers
│   ├── students/               student profile + skills/interests + progress + recommendations
│   ├── mentors/                mentor profile, discovery, assigned students, availability slots
│   ├── recruiters/             recruiter profile
│   ├── opportunities/          opportunity CRUD + visibility rules
│   ├── applications/           apply, track, recruiter review, status updates
│   ├── learning/               resources + progress tracking
│   ├── mentorship/              requests, accept/reject, scheduling (physical/online) via mentor_meetings
│   ├── recommendations/        RecommendationService (pluggable interface)
│   ├── ai/                     AIService + provider adapters (mock/openai/groq)
│   ├── notifications/          in-app notifications (needs migrations/0001_*.sql)
│   └── admin/                  verification, opportunity approval, analytics
├── tests/                      pytest suite - runs against real PostgreSQL, not SQLite (see section 11)
├── migrations/                 proposed ADDITIVE, non-destructive SQL - not auto-applied (see section 7)
├── alembic/                    scaffold only - this project's actual migration convention is raw .sql files (see section 7)
├── seed.py                     READ-ONLY connectivity/row-count check (the real seed data is the teammate's init_database_full.sql)
├── requirements.txt
├── .env.example
└── README.md
```

## 5. Technology stack

FastAPI · Python · PostgreSQL via Supabase · SQLAlchemy · REST · Pydantic ·
Modular Monolith. (Alembic is present but not the primary migration path
for this database — see section 7.)

## 6. Environment variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | **Required.** Direct Postgres connection string to the team's Supabase project (SQLAlchemy). Must point at the *same* project the teammate ran `schema.sql`/`init_database_full.sql` against. |
| `SUPABASE_URL` / `SUPABASE_KEY` | Optional — matches the teammate's existing `.env.example` naming for parity. Not used by the data path. |
| `JWT_SECRET` | **Required.** This backend issues and verifies its own tokens (see section 8) — generate a long random value. |
| `JWT_ALGORITHM` | Default `HS256`. |
| `JWT_EXPIRE_MINUTES` | Default `1440` (24h). |
| `AI_PROVIDER` | `mock` \| `openai` \| `groq` |
| `AI_API_KEY` | API key for the chosen AI provider (unused for `mock`) |
| `AI_MODEL` | Optional model override |
| `FRONTEND_URL` | Comma-separated list of allowed CORS origins |

Never hardcode any of these; never commit a real `.env` (it's already
git-ignored at the repo root).

## 7. Database setup

**Do not run `alembic upgrade` or any `CREATE TABLE`/`DROP` command against
the team's database from this repo.** The schema already exists — it was
created by your teammate's `schema.sql` and populated by
`init_database_full.sql` (36 students, 9 mentors, 8 recruiters,
opportunities, applications, learning data, mentor availability, and
mentor meetings — every seeded account's password is `Password123!`).

1. Get the Postgres connection string from **Supabase Dashboard → Project
   Settings → Database → Connection string** (URI format), and put it in
   `DATABASE_URL` in your `.env` (swap `postgresql://` for
   `postgresql+psycopg2://`).
2. Run `python seed.py` — this only reads and prints row counts per table,
   confirming connectivity and that the SQLAlchemy models line up with the
   real tables. It makes no writes.
3. **Optional, additive-only:** two features (notifications, and the full
   mentorship request → accept → schedule flow with physical/online mode)
   need database changes that don't exist in the live schema yet. These are
   proposed — not applied — in `backend/migrations/0001_additive_notifications_and_mentorship.sql`.
   Review it, then run it yourself via **Supabase Dashboard → SQL Editor**
   when your team is ready. It only adds a new table and new nullable
   columns/constraints — it never drops or alters existing data. Until it's
   run: notification endpoints return a clean error (the action they're
   attached to, e.g. an application status update, still succeeds — see
   `app/notifications/service.py`), and the mentorship request/accept/
   schedule endpoints will fail (the CHECK constraint on `mentor_meetings.status`
   doesn't yet allow `requested`/`accepted`, and `mode`/`location`/`topic`
   columns don't exist yet).

Alembic is scaffolded (`alembic/`) in case you want it for *future*
schema changes your team decides to adopt going forward, but it was not
used to create the current schema and should not be pointed at this
database without your team's agreement — the convention already in use is
plain, reviewed `.sql` files.

## 8. Authentication

**This schema has no Supabase Auth integration** — `public.users` has its
own `password_hash` column (seeded via Postgres `pgcrypto`:
`crypt(password, gen_salt('bf'))`, i.e. standard bcrypt) and no foreign key
to `auth.users`. `backend/database.py` in the teammate's copy only ever uses
the Supabase client for plain table CRUD (PostgREST), never
`supabase.auth.*` — confirming Supabase Auth is not actually wired up
anywhere in this project.

This backend is therefore the source of truth for authentication:

```
POST /api/auth/register  { email, password, name, role } → hashes the
                            password with bcrypt (same format pgcrypto
                            produces - seeded demo accounts and accounts
                            created here are interchangeable) and issues
                            an app-signed JWT.
POST /api/auth/login      { email, password } → verifies against
                            users.password_hash, issues an app-signed JWT.
GET  /api/auth/me         Authorization: Bearer <token> → the current
                            application user.
```

Every other protected route expects `Authorization: Bearer <token>` issued
by this backend. `app/core/dependencies.py` validates it, loads the
matching `users` row, and exposes `require_student` / `require_mentor` /
`require_recruiter` / `require_admin` — the frontend-claimed role is never
trusted, only the database row is. You can log in immediately with any
seeded demo account (e.g. `aarav.patil01@example.com` / `Password123!`).

## 9. Running FastAPI

```bash
cp .env.example .env   # then fill in DATABASE_URL and JWT_SECRET
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The API is served at `http://localhost:8000`.

## 10. API documentation

Interactive docs are auto-generated by FastAPI:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Core end-to-end flow (the P0 vertical slice)

```
Student registers (or logs in with a seeded demo account) → completes profile
Recruiter registers → profile → admin verifies the recruiter (required before posting)
Recruiter creates an opportunity (status = draft)
Admin approves it (status = active) [or rejects -> status = closed]
Student sees it in GET /api/opportunities → applies (POST /api/applications)
Recruiter reviews it → updates status (PUT /api/applications/{id}/status)
Student sees the updated status (GET /api/applications/student)
```

### Route summary

See `app/main.py` for the full router list, or `/docs` for the live
contract. Route prefixes: `/api/auth`, `/api/students`, `/api/mentors`
(including `/api/mentors/availability`), `/api/recruiters`,
`/api/opportunities`, `/api/applications`, `/api/resources` (learning),
`/api/mentorships`, `/api/ai`, `/api/notifications`, `/api/admin`.

A few routes exist beyond the Master Context's section 32 contract to
support capabilities that section explicitly requires but doesn't route
(e.g. `PUT /api/mentors/profile`, `PUT /api/recruiters/profile`,
`GET /api/mentors/students`, `GET/POST/DELETE /api/mentors/availability`,
`GET /api/admin/opportunities`, `GET/PUT /api/notifications`). Each is
marked `IMPLEMENTATION ASSUMPTION` in its source file.

## 11. Running tests

```bash
pytest
```

**Tests run against real PostgreSQL, not SQLite** — this schema uses
Postgres-only features (native `ENUM` types, `text[]` array columns) a
SQLite fallback can't represent faithfully, and the entire point of this
adaptation was to stop diverging from the real database. Point
`DATABASE_URL` at a **throwaway/dev Postgres database, not the shared team
Supabase project** — every test commits inside a transaction that's rolled
back afterward, but application code does call `db.commit()`, so isolation
matters. If `DATABASE_URL` isn't reachable, the whole suite skips cleanly
with an explanatory message instead of silently falling back to SQLite.

Mentorship-flow tests (`tests/test_mentorship.py`) additionally skip until
`backend/migrations/0001_*.sql` has been applied to that database, since
the request/accept/schedule flow depends on the columns/constraint it adds.

Coverage follows the priority order from the project brief: auth
(register/login/me against real password hashes), authorization, student
profile, recruiter profile + verification gate, opportunity creation,
admin approval/rejection, opportunity visibility, application creation +
duplicate prevention + status updates, learning progress, mentorship
(physical & online, migration-gated), the AI endpoint, and the
recommendation interface.

> **Note on this pass:** these tests were written and statically verified
> (every service-layer query was checked to construct correctly against the
> real Postgres dialect — see the DDL-compile and query-construction checks
> described in the accompanying report) but **could not be executed against
> a live Postgres from this environment** (no local Postgres/Docker
> available, and the shared Supabase project should not be used as a test
> target). Run `pytest` yourself against a dev database before trusting
> this suite fully.

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
completeness + skill-gap/trade matching; `career_readiness_score` is an
**integer**, matching the real column type) — per the Master Context, the
real algorithm is owned by a separate recommendation developer/module and
should replace only the internals of this file.

## 14. Seed / demo data

**Do not run the old insert-based seed script against this database** — the
real demo dataset already exists (`init_database_full.sql`, applied by your
teammate). `python seed.py` is now read-only: it connects and prints a row
count per table so you can confirm the backend sees the same data your
teammate seeded, and surfaces which migration-gated tables
(`mentor_meetings` extra columns, `notifications`) aren't ready yet.

## Implementation assumptions & unresolved mismatches

Called out inline in code with `IMPLEMENTATION ASSUMPTION` wherever the
Master Context didn't fully specify a mechanism, and in each affected
model's docstring wherever the real schema forced a compromise:

- **`opportunity_status` has no dedicated "rejected" state** — `closed` is
  used for both admin-rejection and any other closure. If your team wants
  these distinguishable, that requires a real schema decision (new enum
  value or a separate boolean), not something this pass should invent
  unilaterally.
- **Duplicate-application prevention is app-layer only** (pre-check before
  insert) since the live `applications` table has no
  `UNIQUE(student_id, opportunity_id)` constraint. The optional migration
  block adds it as defense-in-depth.
- **Mentorship request/accept/schedule and notifications require the
  proposed migration** (`backend/migrations/0001_*.sql`) to function at
  all — see section 7.
- **`mentor_meetings` requires a proposed time window up front** (`scheduled_start`/
  `scheduled_end` are `NOT NULL` in the live schema), so
  `POST /api/mentorships` asks the student to propose a time when
  requesting, rather than requesting first and scheduling later as
  originally designed.
