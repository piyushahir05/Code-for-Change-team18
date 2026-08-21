import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/site/Footer";
import { StudentModals } from "@/components/student/StudentModals";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  APPLICATION_STATS,
  Application,
  APPLICATIONS,
  INITIAL_STUDENT_PROFILE,
  StudentProfile,
} from "@/components/student/student-data";

export const Route = createFileRoute("/student/applications")({
  head: () => ({
    meta: [{ title: "My Applications · Saksham" }],
  }),
  component: StudentApplicationsPage,
});

function StudentApplicationsPage() {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenApp = (app: Application) => {
    setSelectedApplication(app);
    setActiveModal("application");
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
            <span className="eyebrow text-gold font-semibold">Real-Time Application Pipeline</span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground">
              My Job & Apprenticeship Applications
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Track the exact stage of all your submitted applications across partner employers in Pune and Maharashtra.
            </p>

            {/* Metrics stats */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Applied", val: APPLICATION_STATS.applied, color: "text-foreground" },
                { label: "Under Review", val: APPLICATION_STATS.underReview, color: "text-primary" },
                { label: "Shortlisted", val: APPLICATION_STATS.shortlisted, color: "text-gold font-bold" },
                { label: "Interview", val: APPLICATION_STATS.interview, color: "text-emerald-700" },
                { label: "Selected", val: APPLICATION_STATS.selected, color: "text-muted-foreground" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4 text-center">
                  <p className={`font-serif text-2xl font-bold ${s.color}`}>{s.val}</p>
                  <p className="mt-1 text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Applications list */}
          <div className="mt-8 space-y-4">
            {APPLICATIONS.map((app) => (
              <div
                key={app.id}
                onClick={() => handleOpenApp(app)}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-5 rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft transition-all hover:border-gold/40 hover:shadow-lift cursor-pointer"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-gold/20 px-3 py-0.5 text-xs font-bold text-foreground">
                      {app.status}
                    </span>
                    <span className="text-xs text-muted-foreground">Applied {app.appliedDate}</span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors mt-2">
                    {app.jobTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {app.company} · {app.location} · {app.type}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {app.interviewDate && (
                    <div className="rounded-xl bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 border border-amber-200">
                      Interview: {app.interviewDate}
                    </div>
                  )}
                  <button
                    type="button"
                    className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                  >
                    View Timeline
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
        selectedApplication={selectedApplication}
        selectedMentor={null}
        selectedSession={null}
        profile={profile}
        onUpdateProfile={(u) => setProfile((p) => ({ ...p, ...u }))}
      />

      <Footer />
    </div>
  );
}
