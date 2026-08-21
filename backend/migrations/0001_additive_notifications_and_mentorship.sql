-- ============================================================================
-- PROPOSED ADDITIVE MIGRATION - NOT executed automatically by this backend.
--
-- This script only ADDS things: a new table, new nullable columns, and a
-- widened CHECK constraint. It never drops or alters existing data, and it
-- is safe to run against the live Supabase project via
-- Dashboard -> SQL Editor -> New query.
--
-- Review each numbered block below and run the ones your team wants. Every
-- block is idempotent (safe to re-run) and independent of the others.
-- ============================================================================



-- ----------------------------------------------------------------------------
-- 1) notifications table
--    Required for: GET/PUT /api/notifications/*, and every internal
--    create_notification() call (opportunity approval, application status
--    changes, mentorship updates, user verification). Until this exists,
--    those calls fail soft and log a warning - they do NOT break the
--    action they're attached to (see app/notifications/service.py).
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id serial PRIMARY KEY,
  user_id int NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamp NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2) mentor_meetings: add mode, location, topic
--    Required for: POST /api/mentorships/{id}/schedule to record PHYSICAL vs
--    ONLINE and a location, and for a request to carry a topic. All three
--    are nullable additions - existing rows are unaffected.
-- ----------------------------------------------------------------------------
ALTER TABLE public.mentor_meetings ADD COLUMN IF NOT EXISTS mode text;
ALTER TABLE public.mentor_meetings ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.mentor_meetings ADD COLUMN IF NOT EXISTS topic text;

-- Optional but recommended: constrain `mode` the same way `status` is
-- constrained, once the column exists.
DO $$ BEGIN
  ALTER TABLE public.mentor_meetings
    ADD CONSTRAINT mentor_meetings_mode_check CHECK (mode IN ('physical', 'online'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ----------------------------------------------------------------------------
-- 3) mentor_meetings.status: widen the CHECK constraint to also allow
--    'requested' and 'accepted' (the app's request -> accept -> schedule
--    flow needs both; the live constraint only allows
--    scheduled/completed/cancelled/rescheduled today).
--
--    NOTE: this assumes the constraint's auto-generated name is
--    `mentor_meetings_status_check` (Postgres' default naming for an inline
--    CHECK on the `status` column). If this block errors with "constraint
--    does not exist", find the real name first with:
--      SELECT conname FROM pg_constraint WHERE conrelid = 'public.mentor_meetings'::regclass AND contype = 'c';
--    then substitute it below.
-- ----------------------------------------------------------------------------
ALTER TABLE public.mentor_meetings DROP CONSTRAINT IF EXISTS mentor_meetings_status_check;
ALTER TABLE public.mentor_meetings
  ADD CONSTRAINT mentor_meetings_status_check
  CHECK (status IN ('requested', 'accepted', 'scheduled', 'completed', 'cancelled', 'rescheduled'));

-- ----------------------------------------------------------------------------
-- 4) OPTIONAL: applications duplicate-application guard.
--    The Master Context requires UNIQUE(student_id, opportunity_id); the
--    live table has no such constraint today. The backend already prevents
--    duplicates at the application layer (a pre-check before insert), so
--    this is redundant defense-in-depth against race conditions, not a
--    functional requirement. Safe to skip if you'd rather not touch
--    `applications` right now.
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  ALTER TABLE public.applications
    ADD CONSTRAINT uq_student_opportunity_application UNIQUE (student_id, opportunity_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;



-- END OF MIGRATION
