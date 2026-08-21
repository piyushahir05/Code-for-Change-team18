import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookmarkCheck,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { Candidate, Opportunity } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/shortlisted")({
  head: () => ({
    meta: [
      { title: "Shortlisted Candidates · Recruiter Portal | Saksham" },
      {
        name: "description",
        content: "Track shortlisted ITI candidates ready for interviews, practical assessments, and offers.",
      },
    ],
  }),
  component: RecruiterShortlistedPage,
});

type TabType = "ALL" | "INTERVIEW_PENDING" | "INTERVIEW_SCHEDULED" | "SELECTED";

export function RecruiterShortlistedPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Interview modal
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const loadData = () => {
    setCandidates(recruiterService.getShortlistedCandidates(activeTab));
    setOpportunities(recruiterService.getOpportunities("ACTIVE"));
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleRemoveShortlist = (candidate: Candidate) => {
    recruiterService.removeShortlist(candidate.id);
    toast.info(`${candidate.name} removed from shortlist`);
    loadData();
  };

  return (
    <RecruiterLayout
      pageTitle="Shortlisted Candidates"
      breadcrumbs={[{ label: "Shortlisted" }]}
      actionButton={
        <span className="text-xs font-bold text-primary bg-gold/20 px-3 py-1.5 rounded-full">
          {candidates.length} In Pipeline
        </span>
      }
    >
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Shortlisted Talent Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review candidates ready for practical trade tests, interview scheduling, or final induction offers.
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          {(
            [
              { id: "ALL", label: "All Shortlisted" },
              { id: "INTERVIEW_PENDING", label: "Interview Pending" },
              { id: "INTERVIEW_SCHEDULED", label: "Interview Scheduled" },
              { id: "SELECTED", label: "Selected / Offered" },
            ] as { id: TabType; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "bg-secondary text-foreground hover:bg-beige"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Candidates List */}
        {candidates.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <BookmarkCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-lg font-bold text-foreground mt-3">
              No candidates in this stage
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Explore your Smart Talent Matches or Talent Pool to shortlist job-ready ITI graduates.
            </p>
            <Link
              to="/recruiter/talent"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-lift"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Explore Talent Pool</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => {
              const isScheduled = candidate.applicationStatus === "INTERVIEW_SCHEDULED";
              const isSelected = candidate.applicationStatus === "SELECTED";

              return (
                <div
                  key={candidate.id}
                  className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all"
                >
                  <div>
                    {/* Top Status and Match Score */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <Sparkles className="h-3 w-3 fill-current" />
                        {candidate.matchScore}% Match
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                          isSelected
                            ? "bg-emerald-100 text-emerald-900"
                            : isScheduled
                            ? "bg-primary/10 text-primary"
                            : "bg-gold/20 text-foreground"
                        }`}
                      >
                        {candidate.applicationStatus?.replace(/_/g, " ")}
                      </span>
                    </div>

                    {/* Candidate identity */}
                    <div className="mt-3.5 flex items-center gap-3">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-primary/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif text-base font-bold text-foreground truncate">
                          {candidate.name}
                        </h3>
                        <p className="text-xs text-primary font-semibold truncate">{candidate.trade}</p>
                        <p className="text-[0.68rem] text-muted-foreground truncate">{candidate.iti}</p>
                      </div>
                    </div>

                    {/* Matched Requirement */}
                    <div className="mt-3 rounded-2xl bg-secondary/50 p-2.5 text-xs">
                      <span className="text-[0.62rem] uppercase font-bold text-muted-foreground">
                        Matched Requirement
                      </span>
                      <p className="font-bold text-foreground truncate mt-0.5">
                        {candidate.matchedOpportunityTitle || "Electrician Apprentice"}
                      </p>
                    </div>

                    {/* Readiness */}
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Career Readiness:</span>
                      <span className="font-bold text-primary">{candidate.careerReadinessScore}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center gap-2">
                    <Link
                      to="/recruiter/talent/$candidateId"
                      params={{ candidateId: candidate.id }}
                      className="flex-1 rounded-full border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-beige"
                    >
                      Profile
                    </Link>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setInterviewModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep"
                    >
                      <Calendar className="h-3.5 w-3.5 text-gold" />
                      <span>{isScheduled ? "Reschedule" : "Interview"}</span>
                    </button>

                    <button
                      type="button"
                      title="Remove from shortlist"
                      onClick={() => handleRemoveShortlist(candidate)}
                      className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidate={selectedCandidate}
        opportunities={opportunities}
        onScheduledSuccess={loadData}
      />
    </RecruiterLayout>
  );
}
