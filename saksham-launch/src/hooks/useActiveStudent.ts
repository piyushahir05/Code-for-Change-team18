import { useState, useEffect } from "react";

// ── Supabase public credentials (anon key — safe to use client-side) ─────────
const SUPABASE_URL = "https://espfnslpizfssuntxhah.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcGZuc2xwaXpmc3N1bnR4aGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgwNzMsImV4cCI6MjEwMjg2NDA3M30.lhWSQBlOa1mdL3mYRgTFZkBK5BKzveTsvrdzu0lsTgg";

export interface Student {
  id: number;
  name: string;
  trade: string;
  career_goal: string;
  career_readiness_score: number;
}

// ── Static fallback (used when Supabase table is empty or unreachable) ────────
export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Aarav Patil",
    trade: "Electrician",
    career_goal: "Become an industrial maintenance electrician and learn automation",
    career_readiness_score: 76,
  },
  {
    id: 2,
    name: "Saanvi Jadhav",
    trade: "Fitter",
    career_goal: "Build a career in plant maintenance and production",
    career_readiness_score: 72,
  },
  {
    id: 3,
    name: "Rohan Shinde",
    trade: "Welder",
    career_goal: "Become a certified industrial welding technician",
    career_readiness_score: 68,
  },
  {
    id: 4,
    name: "Isha More",
    trade: "COPA",
    career_goal: "Start a career in IT support and digital operations",
    career_readiness_score: 80,
  },
];

// ── Global singleton state shared across all hook consumers ───────────────────
let globalActiveId = 1;
let globalStudents: Student[] = MOCK_STUDENTS;
const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach((fn) => fn());
}

// ── Fetch student list from Supabase REST (student_profiles + users join) ─────
async function fetchStudentsFromSupabase(): Promise<Student[]> {
  try {
    // First try the local FastAPI /api/students (which does the full join server-side)
    const fastApiRes = await fetch("http://localhost:8000/api/students", {
      signal: AbortSignal.timeout(3000),
    });
    if (fastApiRes.ok) {
      const data: Student[] = await fastApiRes.json();
      if (data && data.length > 0) return data;
    }
  } catch {
    // FastAPI backend is down — fall through to direct Supabase REST
  }

  try {
    // Direct Supabase REST call — student_profiles joined with users
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/student_profiles?select=id,trade,career_goal,career_readiness_score,users(name)&order=id`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) throw new Error(`Supabase REST error: ${res.status}`);
    const rows = await res.json();

    if (!rows || rows.length === 0) {
      console.warn("Supabase student_profiles table is empty — using mock fallback.");
      return MOCK_STUDENTS;
    }

    return rows.map((row: any) => ({
      id: row.id,
      name: row.users?.name ?? `Student ${row.id}`,
      trade: row.trade ?? "",
      career_goal: row.career_goal ?? "",
      career_readiness_score: row.career_readiness_score ?? 0,
    }));
  } catch (err) {
    console.warn("Could not reach Supabase — using mock student list.", err);
    return MOCK_STUDENTS;
  }
}

// ── Initialize on first import ────────────────────────────────────────────────
let initialized = false;

async function initStudents() {
  if (initialized) return;
  initialized = true;

  // Restore last active student from localStorage
  const stored = localStorage.getItem("saksham_active_student_id");
  if (stored) {
    const parsed = parseInt(stored, 10);
    if (!isNaN(parsed)) globalActiveId = parsed;
  }

  const fetched = await fetchStudentsFromSupabase();
  globalStudents = fetched;

  // If stored ID doesn't exist in fetched list, reset to first student
  if (!globalStudents.find((s) => s.id === globalActiveId)) {
    globalActiveId = globalStudents[0]?.id ?? 1;
  }

  notifyAll();
}

// Kick off the async init immediately when this module is first imported
initStudents();

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useActiveStudent() {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((n) => n + 1);
    listeners.add(rerender);
    return () => {
      listeners.delete(rerender);
    };
  }, []);

  const setActiveStudentId = (id: number) => {
    globalActiveId = id;
    localStorage.setItem("saksham_active_student_id", String(id));
    notifyAll();
  };

  const activeStudent =
    globalStudents.find((s) => s.id === globalActiveId) ?? globalStudents[0] ?? MOCK_STUDENTS[0];

  return {
    activeStudentId: globalActiveId,
    setActiveStudentId,
    activeStudent,
    mockStudents: globalStudents, // renamed but contains live OR mock data
  };
}
