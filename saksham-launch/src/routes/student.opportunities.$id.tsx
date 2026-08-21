import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Share2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/site/Footer";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  INITIAL_STUDENT_PROFILE,
  RECOMMENDED_OPPORTUNITIES,
  StudentProfile,
} from "@/components/student/student-data";

export const Route = createFileRoute("/student/opportunities/$id")({
  head: () => ({
    meta: [{ title: "Opportunity Details · Saksham" }],
  }),
  component: OpportunityDetailPage,
});

function OpportunityDetailPage() {
  const { id } = useParams({ from: "/student/opportunities/$id" });
  const [profile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const opp = RECOMMENDED_OPPORTUNITIES.find((o) => o.id === id) || RECOMMENDED_OPPORTUNITIES[0];

  const handleApply = () => {
    toast.success(`Application submitted to ${opp.company}!`, {
      description: "You can track the progress in your Applications tab.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudentNavbar profile={profile} />

      <main className="pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            to="/student/opportunities"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to All Opportunities
          </Link>

          <div className="rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-10 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 border border-amber-200">
                  {opp.typeLabel}
                </span>
                <h1 className="mt-3 font-serif text-2xl sm:text-4xl font-bold text-foreground">
                  {opp.title}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    {opp.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {opp.location}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-gold/15 p-4 text-center border border-gold/30">
                <span className="text-[0.65rem] tracking-wider uppercase font-semibold text-muted-foreground">
                  Match Score
                </span>
                <p className="font-serif text-2xl font-bold text-primary">{opp.matchPercentage}%</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-secondary/60 p-4 sm:p-6 border border-border/60">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Monthly Stipend / Salary
                </p>
                <p className="font-serif text-xl font-bold text-primary mt-1">{opp.stipend}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Application Deadline
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">{opp.deadline}</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">About the Role</h3>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {opp.description}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-foreground">Required Trade Skills</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {opp.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-xl bg-secondary px-3.5 py-1.5 text-xs font-semibold text-foreground border border-border"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> 100% Verified Y4D Partner Opportunity
              </span>

              <button
                type="button"
                onClick={handleApply}
                className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-deep shadow-lift"
              >
                Apply Now with Saksham Profile
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
