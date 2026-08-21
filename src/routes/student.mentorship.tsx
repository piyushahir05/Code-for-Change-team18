import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Clock,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/site/Footer";
import { StudentModals } from "@/components/student/StudentModals";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  INITIAL_STUDENT_PROFILE,
  Mentor,
  MENTORS,
  MentorshipSession,
  StudentProfile,
  UPCOMING_MENTORSHIP,
} from "@/components/student/student-data";

export const Route = createFileRoute("/student/mentorship")({
  head: () => ({
    meta: [{ title: "Trade Mentorship · Saksham" }],
  }),
  component: StudentMentorshipPage,
});

function StudentMentorshipPage() {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleRequest = (m: Mentor) => {
    setSelectedMentor(m);
    setActiveModal("mentorship-request");
  };

  const handleViewSession = (s: MentorshipSession) => {
    setSelectedSession(s);
    setActiveModal("meeting-details");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudentNavbar profile={profile} />

      <main className="pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-10 shadow-soft">
            <span className="eyebrow text-gold font-semibold">1-on-1 Guidance</span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Connect with Trade Mentors
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Industrial engineers, workshop superintendents, and certified faculty volunteering to
              prepare ITI trainees for industrial careers.
            </p>
          </div>

          {/* Upcoming Session Highlight */}
          <div className="mt-8 rounded-[2.2rem] border border-gold/40 bg-gradient-to-br from-card to-gold/10 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary">
                  CONFIRMED UPCOMING SESSION
                </span>
                <span className="text-xs text-muted-foreground">{UPCOMING_MENTORSHIP.dateTime}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mt-2">
                {UPCOMING_MENTORSHIP.title}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                With {UPCOMING_MENTORSHIP.mentorName} ({UPCOMING_MENTORSHIP.mentorRole})
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleViewSession(UPCOMING_MENTORSHIP)}
              className="rounded-full bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
            >
              View Meeting Room & Prep
            </button>
          </div>

          {/* Mentors list */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {MENTORS.map((m) => (
              <div
                key={m.id}
                className="group flex flex-col justify-between rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:border-gold/40 hover:shadow-lift"
              >
                <div>
                  <div className="flex items-start gap-4">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="h-16 w-16 rounded-2xl object-cover border border-primary/20 shadow-sm shrink-0"
                    />
                    <div>
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {m.name}
                      </h3>
                      <p className="text-xs font-medium text-primary mt-0.5">{m.role}</p>
                      <p className="text-[0.68rem] text-muted-foreground">
                        {m.industry} · {m.experience}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {m.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="rounded-lg bg-secondary px-2.5 py-1 text-[0.7rem] font-medium text-foreground"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" /> {m.rating} ({m.sessionsCount})
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRequest(m)}
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                  >
                    Request Session
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <StudentModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        selectedCourse={null}
        selectedSkillGap={null}
        selectedOpportunity={null}
        selectedApplication={null}
        selectedMentor={selectedMentor}
        selectedSession={selectedSession}
        profile={profile}
        onUpdateProfile={(u) => setProfile((p) => ({ ...p, ...u }))}
      />

      <Footer />
    </div>
  );
}
