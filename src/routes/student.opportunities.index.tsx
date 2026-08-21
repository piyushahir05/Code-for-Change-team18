import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/site/Footer";
import { StudentModals } from "@/components/student/StudentModals";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  INITIAL_STUDENT_PROFILE,
  Opportunity,
  RECOMMENDED_OPPORTUNITIES,
  StudentProfile,
} from "@/components/student/student-data";

export const Route = createFileRoute("/student/opportunities/")({
  head: () => ({
    meta: [{ title: "Verified Opportunities · Saksham" }],
  }),
  component: StudentOpportunitiesPage,
});

function StudentOpportunitiesPage() {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(RECOMMENDED_OPPORTUNITIES);

  const filtered = opportunities.filter(
    (opp) =>
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <span className="eyebrow text-gold font-semibold">Verified Hiring Drives</span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground">
              Opportunities Matched to You
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Every role is verified with partner industries in Maharashtra. Applications are
              streamlined directly to company recruitment officers.
            </p>

            {/* Search bar */}
            <div className="mt-6 flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-2xs max-w-xl">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by trade role, company, or city..."
                className="w-full bg-transparent text-xs sm:text-sm outline-none"
              />
            </div>
          </div>

          {/* Opportunities list */}
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {filtered.map((opp) => (
              <div
                key={opp.id}
                onClick={() => {
                  setSelectedOpportunity(opp);
                  setActiveModal("opportunity");
                }}
                className="group flex flex-col justify-between rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:border-gold/50 hover:shadow-lift cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                      {opp.typeLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-xs font-bold text-primary border border-gold/40">
                      <Sparkles className="h-3 w-3 text-gold fill-gold" />
                      {opp.matchPercentage}% match
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors mt-3">
                    {opp.title}
                  </h3>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Building2 className="h-3.5 w-3.5 text-primary" />
                      {opp.company}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {opp.location}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between rounded-xl bg-secondary/60 p-3 text-xs">
                    <span className="font-bold text-primary">{opp.stipend}</span>
                    <span className="text-muted-foreground">Deadline: {opp.deadline}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified
                  </span>
                  <button
                    type="button"
                    className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                  >
                    View & Apply
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
        selectedOpportunity={selectedOpportunity}
        selectedApplication={null}
        selectedMentor={null}
        selectedSession={null}
        profile={profile}
        onUpdateProfile={(u) => setProfile((p) => ({ ...p, ...u }))}
      />

      <Footer />
    </div>
  );
}
