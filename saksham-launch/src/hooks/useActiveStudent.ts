import { useState, useEffect } from "react";

export interface Student {
  id: number;
  name: string;
  trade: string;
  career_goal: string;
  career_readiness_score: number;
}

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

let globalActiveId = 1;
const listeners = new Set<(id: number) => void>();

export function useActiveStudent() {
  const [activeStudentId, setInnerId] = useState(globalActiveId);

  useEffect(() => {
    const handleUpdate = (id: number) => {
      setInnerId(id);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const setActiveStudentId = (id: number) => {
    globalActiveId = id;
    localStorage.setItem("saksham_active_student_id", String(id));
    listeners.forEach((listener) => listener(id));
  };

  // Sync with localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("saksham_active_student_id");
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed !== globalActiveId) {
        setActiveStudentId(parsed);
      }
    }
  }, []);

  const activeStudent = MOCK_STUDENTS.find((s) => s.id === activeStudentId) || MOCK_STUDENTS[0];

  return {
    activeStudentId,
    setActiveStudentId,
    activeStudent,
    mockStudents: MOCK_STUDENTS,
  };
}
