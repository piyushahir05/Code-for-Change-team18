import { useState, useEffect } from "react";
import { studentService, ActiveStudentSession } from "@/services/studentService";

// ── Supabase public credentials ───────────────────────────────────────────────
const SUPABASE_URL = "https://espfnslpizfssuntxhah.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcGZuc2xwaXpmc3N1bnR4aGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgwNzMsImV4cCI6MjEwMjg2NDA3M30.lhWSQBlOa1mdL3mYRgTFZkBK5BKzveTsvrdzu0lsTgg";

export interface Student {
  id: number;
  name: string;
  trade: string;
  career_goal: string;
  career_readiness_score: number;
  location?: string;
  iti?: string;
  skill_gaps?: string[];
  existing_skills?: string[];
  interests?: string[];
}

// ── Static fallback students ──────────────────────────────────────────────────
export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Aarav Patil",
    trade: "Electrician",
    career_goal: "Become an industrial maintenance electrician and learn automation",
    career_readiness_score: 76,
    location: "Pune",
    iti: "Government ITI Pune",
    skill_gaps: ["PLC Basics", "Control Panels"],
    existing_skills: ["Electrical Wiring", "Motor Control", "Electrical Safety"],
  },
  {
    id: 2,
    name: "Saanvi Jadhav",
    trade: "Fitter",
    career_goal: "Build a career in plant maintenance and production",
    career_readiness_score: 72,
    location: "Nashik",
    iti: "Government ITI Nashik",
    skill_gaps: ["Hydraulics", "Quality Inspection"],
    existing_skills: ["Mechanical Assembly", "Measurement & Gauges"],
  },
  {
    id: 3,
    name: "Rohan Shinde",
    trade: "Welder",
    career_goal: "Become a certified industrial welding technician",
    career_readiness_score: 68,
    location: "Nagpur",
    iti: "Government ITI Nagpur",
    skill_gaps: ["TIG Welding", "Weld Inspection"],
    existing_skills: ["MIG Welding", "Welding Safety"],
  },
  {
    id: 4,
    name: "Isha More",
    trade: "COPA",
    career_goal: "Start a career in IT support and digital operations",
    career_readiness_score: 80,
    location: "Mumbai",
    iti: "Government ITI Mumbai",
    skill_gaps: ["Basic Networking", "MS Excel"],
    existing_skills: ["Data Entry", "Digital Literacy"],
  },
];

// ── Helper to convert ActiveStudentSession to Student interface ─────────────
function sessionToStudent(session: ActiveStudentSession): Student {
  const gaps = session.skills?.filter((s) => s.is_gap).map((s) => s.skill_name) ?? [];
  const existing = session.skills?.filter((s) => !s.is_gap).map((s) => s.skill_name) ?? [];
  const interests = session.interests?.map((i) => i.interest) ?? [];

  return {
    id: session.profile?.id || session.user?.id || 99,
    name: session.user?.name || "Student User",
    trade: session.profile?.trade || "Electrician",
    career_goal: session.profile?.career_goal || "Build a successful career",
    career_readiness_score: session.profile?.career_readiness_score || 78,
    location: session.profile?.location || "Maharashtra",
    iti: session.profile?.iti || "Government ITI",
    skill_gaps: gaps.length > 0 ? gaps : ["Workplace Communication", "Interview Preparation"],
    existing_skills: existing.length > 0 ? existing : ["Basic Technical Workshop"],
    interests: interests,
  };
}

let globalActiveId = 1;
let globalStudents: Student[] = MOCK_STUDENTS;
const listeners = new Set<() => void>();

function notifyAll() {
  listeners.forEach((fn) => fn());
}

async function fetchStudentsFromSupabase(): Promise<Student[]> {
  try {
    const fastApiRes = await fetch("http://localhost:8000/api/students", {
      signal: AbortSignal.timeout(3000),
    });
    if (fastApiRes.ok) {
      const data: Student[] = await fastApiRes.json();
      if (data && data.length > 0) return data;
    }
  } catch {
    // FastAPI server down — try direct Supabase
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/student_profiles?select=id,trade,career_goal,career_readiness_score,location,iti,users(name)&order=id`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(4000),
      }
    );

    if (!res.ok) throw new Error(`Supabase REST error: ${res.status}`);
    const rows = await res.json();

    if (!rows || rows.length === 0) return MOCK_STUDENTS;

    return rows.map((row: any) => ({
      id: row.id,
      name: row.users?.name ?? `Student ${row.id}`,
      trade: row.trade ?? "",
      career_goal: row.career_goal ?? "",
      career_readiness_score: row.career_readiness_score ?? 70,
      location: row.location ?? "",
      iti: row.iti ?? "",
    }));
  } catch {
    return MOCK_STUDENTS;
  }
}

let initialized = false;

async function initStudents() {
  if (initialized) return;
  initialized = true;

  const storedId = localStorage.getItem("saksham_active_student_id");
  if (storedId) {
    const parsed = parseInt(storedId, 10);
    if (!isNaN(parsed)) globalActiveId = parsed;
  }

  const fetched = await fetchStudentsFromSupabase();
  globalStudents = fetched;
  notifyAll();
}

initStudents();

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

  // 1. Check for logged-in active session in localStorage first!
  const activeSession = studentService.getActiveSession();

  let activeStudent: Student;

  if (activeSession && activeSession.user && activeSession.profile) {
    // Dynamically build the logged-in student profile (e.g. Sahil Khaire)
    activeStudent = sessionToStudent(activeSession);
  } else {
    // Fall back to selector or fetched list
    activeStudent =
      globalStudents.find((s) => s.id === globalActiveId) ?? globalStudents[0] ?? MOCK_STUDENTS[0];
  }

  return {
    activeStudentId: activeStudent.id,
    setActiveStudentId,
    activeStudent,
    mockStudents: globalStudents,
  };
}
