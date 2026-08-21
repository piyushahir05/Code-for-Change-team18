import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { Candidate, Opportunity } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/opportunities/$id")({
  head: () => ({
    meta: [
      { title: "Opportunity Management · Recruiter Portal | Saksham" },
      {
        name: "description",
        content: "Review applicants and smart-matched candidates for this ITI hiring requirement.",
      },
    ],
  }),
  component: RecruiterOpportunityDetailPage,
});

export function RecruiterOpportunityDetailPage() {
  const { id } = useParams({ from: "/recruiter/opportunities/$id" });
  const navigate = useNavigate();

  const [opp, setOpp] = useState<Opportunity | undefined>();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeTab, setActiveTab] = useState<"MATCHES" | "APPLICANTS" | "OVERVIEW">("MATCHES");

  // Interview modal state
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const loadData = () => {
    const found = recruiterService.getOpportunity(id);
    setOpp(found);
    setCandidates(recruiterService.getCandidates());
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (!opp) {
    return (
      <RecruiterLayout pageTitle="Opportunity Details">
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Opportunity not found.</p>
          <Link
            to="/recruiter/opportunities"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Opportunities
          </Link>
        </div>
      </RecruiterLayout>
    );
  }

  const matchingCandidates = candidates.filter(
    (c) => c.trade.toLowerCase() === opp.trade.toLowerCase() || c.matchedOpportunityId === opp.id
  );

  const handleShortlistToggle = (candidate: Candidate) => {
    if (candidate.applicationStatus === "SHORTLISTED" || candidate.applicationStatus === "INTERVIEW_SCHEDULED") {
      recruiterService.removeShortlist(candidate.id);
      toast.info(`${candidate.name} removed from shortlist`);
    } else {
      recruiterService.shortlistCandidate(candidate.id, opp.id);
      toast.success("Candidate shortlisted for this opportunity ✓");
    }
    loadData();
  };

  return (
    <RecruiterLayout
      pageTitle={opp.title}
      breadcrumbs={[{ label: "Opportunities", to: "/recruiter/opportunities" }, { label: opp.title }]}
    >
      <div className="space-y-6">
        {/* Top Banner Card */}
        <div className="rounded-[2.5rem] border border-gold/40 bg-gradient-to-r from-card via-secondary/40 to-gold/10 p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {opp.type.replace(/_/g, " ")}
                </span>
                <span className="text-xs font-bold text-emerald-700">● {opp.status}</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-2">
                {opp.title}
              </h1>

              <p className="text-sm font-bold text-primary mt-1">
                {opp.company} · {opp.location}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-card p-3 border border-border text-center shadow-2xs">
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold">Positions</span>
                <p className="font-serif text-xl font-bold text-foreground">{opp.positionsCount}</p>
              </div>
              <div className="rounded-2xl bg-card p-3 border border-border text-center shadow-2xs">
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold">Applicants</span>
                <p className="font-serif text-xl font-bold text-foreground">{opp.applicantsCount}</p>
              </div>
              <div className="rounded-2xl bg-card p-3 border border-border text-center shadow-2xs">
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold">Shortlisted</span>
                <p className="font-serif text-xl font-bold text-primary">{opp.shortlistedCount}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border/60 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Stipend: {opp.salaryStipend}</span>
            <span>Trade: <strong className="text-foreground">{opp.trade}</strong></span>
            <span>Deadline: <strong className="text-foreground">{opp.deadline}</strong></span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("MATCHES")}
            className={`inline-flex items-center gap-1.5 rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "MATCHES"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-secondary text-foreground hover:bg-beige"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Smart Matched Talent ({matchingCandidates.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("OVERVIEW")}
            className={`rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "OVERVIEW"
                ? "bg-primary text-primary-foreground shadow-2xs"
                : "bg-secondary text-foreground hover:bg-beige"
            }`}
          >
            Role Details & Requirements
          </button>
        </div>

        {/* Tab 1: Smart Matched Talent Grid */}
        {activeTab === "MATCHES" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Candidates ranked by trade certification, practical skill scores, and district eligibility.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchingCandidates.map((candidate) => {
                const isShortlisted =
                  candidate.applicationStatus === "SHORTLISTED" ||
                  candidate.applicationStatus === "INTERVIEW_SCHEDULED";

                return (
                  <div
                    key={candidate.id}
                    className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                          <Sparkles className="h-3 w-3 fill-current" />
                          {candidate.matchScore}% Match
                        </span>
                        {candidate.isVerified && (
                          <span className="text-[0.68rem] font-semibold text-muted-foreground flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified
                          </span>
                        )}
                      </div>

                      <div className="mt-3.5 flex items-center gap-3">
                        <img
                          src={candidate.avatar}
                          alt={candidate.name}
                          className="h-11 w-11 rounded-2xl object-cover border border-primary/20"
                        />
                        <div className="min-w-0">
                          <h4 className="font-serif text-sm font-bold text-foreground truncate">
                            {candidate.name}
                          </h4>
                          <p className="text-xs text-primary font-semibold truncate">{candidate.trade}</p>
                          <p className="text-[0.68rem] text-muted-foreground truncate">{candidate.iti}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((s) => (
                          <span
                            key={s.name}
                            className="rounded-lg bg-secondary px-2 py-0.5 text-[0.65rem] font-medium text-foreground"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center gap-2">
                      <Link
                        to="/recruiter/talent/$candidateId"
                        params={{ candidateId: candidate.id }}
                        className="flex-1 rounded-full border border-border py-1.5 text-center text-xs font-semibold text-foreground hover:bg-beige"
                      >
                        Profile
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleShortlistToggle(candidate)}
                        className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                          isShortlisted
                            ? "bg-emerald-700 text-white"
                            : "bg-primary text-primary-foreground hover:bg-primary-deep"
                        }`}
                      >
                        {isShortlisted ? "Shortlisted" : "Shortlist"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setInterviewModalOpen(true);
                        }}
                        className="rounded-full bg-gold/25 px-3 py-1.5 text-xs font-bold text-foreground hover:bg-gold/40"
                      >
                        Interview
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Overview & Requirements */}
        {activeTab === "OVERVIEW" && (
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-5 text-xs">
            <div>
              <span className="eyebrow text-gold font-bold">Role Description</span>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
                {opp.description}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-secondary/50 p-4 space-y-1">
                <span className="font-bold text-foreground">Eligibility Criteria</span>
                <p className="text-muted-foreground">{opp.eligibility}</p>
              </div>

              <div className="rounded-2xl bg-secondary/50 p-4 space-y-1">
                <span className="font-bold text-foreground">Experience Required</span>
                <p className="text-muted-foreground">{opp.experienceRequired}</p>
              </div>
            </div>

            <div>
              <span className="font-bold text-foreground mb-2 block">Required Practical Skills</span>
              <div className="flex flex-wrap gap-2">
                {opp.requiredSkills.map((s) => (
                  <span
                    key={s.skillName}
                    className="rounded-xl bg-primary text-primary-foreground px-3 py-1 font-semibold"
                  >
                    {s.skillName} ({s.requiredLevel})
                  </span>
                ))}
              </div>
            </div>

            {opp.benefits.length > 0 && (
              <div>
                <span className="font-bold text-foreground mb-2 block">Perks & Trainee Benefits</span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {opp.benefits.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidate={selectedCandidate}
        opportunityId={opp.id}
        opportunities={[opp]}
        onScheduledSuccess={loadData}
      />
    </RecruiterLayout>
  );
}
