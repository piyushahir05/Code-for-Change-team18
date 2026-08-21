import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import {
  ArrowUpDown,
  Award,
  BookmarkCheck,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Filter,
  GraduationCap,
  MapPin,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { Candidate, Opportunity } from "@/data/mock/recruiterData";
import { CandidateFilters, recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/talent/")({
  validateSearch: (search: Record<string, unknown>) => ({
    search: typeof search.search === "string" ? search.search : undefined,
    trade: typeof search.trade === "string" ? search.trade : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Talent Pool · Find Skilled ITI Candidates | Saksham Recruiter" },
      {
        name: "description",
        content: "Discover job-ready ITI graduates ranked by trade skills, career readiness, and district location.",
      },
    ],
  }),
  component: RecruiterTalentPoolPage,
});

const TRADES = ["ALL", "Electrician", "Fitter", "Welder", "Machinist", "Electronics Mechanic"];
const LOCATIONS = ["ALL", "Pune", "Chakan", "Nashik", "Aurangabad", "Kolhapur"];
const EXPERIENCES = ["ALL", "Beginner", "1 year", "1.5 years", "CNC"];

export function RecruiterTalentPoolPage() {
  const searchParams = useSearch({ from: "/recruiter/talent/" });

  const [searchQuery, setSearchQuery] = useState(searchParams.search || "");
  const [selectedTrade, setSelectedTrade] = useState(searchParams.trade || "ALL");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedExperience, setSelectedExperience] = useState("ALL");
  const [minReadiness, setMinReadiness] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<CandidateFilters["sortBy"]>("BEST_MATCH");

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  // Interview modal state
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const loadData = () => {
    const filters: CandidateFilters = {
      searchQuery,
      trade: selectedTrade,
      location: selectedLocation,
      experience: selectedExperience,
      minReadiness,
      verifiedOnly,
      sortBy,
    };
    setCandidates(recruiterService.getCandidates(filters));
    setOpportunities(recruiterService.getOpportunities("ACTIVE"));
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedTrade, selectedLocation, selectedExperience, minReadiness, verifiedOnly, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedTrade("ALL");
    setSelectedLocation("ALL");
    setSelectedExperience("ALL");
    setMinReadiness(0);
    setVerifiedOnly(false);
    setSortBy("BEST_MATCH");
  };

  const handleShortlistToggle = (candidate: Candidate) => {
    if (candidate.applicationStatus === "SHORTLISTED" || candidate.applicationStatus === "INTERVIEW_SCHEDULED") {
      recruiterService.removeShortlist(candidate.id);
      toast.info(`${candidate.name} removed from shortlist`);
    } else {
      recruiterService.shortlistCandidate(candidate.id);
      toast.success("Candidate shortlisted successfully ✓", {
        description: `${candidate.name} added to your Shortlisted candidates list.`,
      });
    }
    loadData();
  };

  return (
    <RecruiterLayout
      pageTitle="Talent Pool"
      breadcrumbs={[{ label: "Talent Pool" }]}
      actionButton={
        <span className="text-xs font-bold text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          {candidates.length} Verified Candidates
        </span>
      }
    >
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Find Skilled ITI Talent
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Discover verified ITI candidates ranked by practical shop-floor tests, trade certifications, and career readiness.
            </p>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft space-y-4 text-xs">
          {/* Top Search & Sort Row */}
          <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by candidate name, trade, skills (e.g. PLC, Wiring, TIG)..."
                className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 pl-10 text-xs outline-none focus:border-primary"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground whitespace-nowrap">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as CandidateFilters["sortBy"])}
                aria-label="Sort candidates"
                className="rounded-2xl border border-border bg-background px-3 py-2 text-xs font-medium outline-none focus:border-primary"
              >
                <option value="BEST_MATCH">Best Match %</option>
                <option value="READINESS">Career Readiness</option>
                <option value="EXPERIENCE">Experience</option>
                <option value="NAME">Candidate Name</option>
              </select>
            </div>

            {/* Reset Filters */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-2xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-beige hover:text-foreground transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* Filter Pills Grid */}
          <div className="grid gap-3 sm:grid-cols-4 pt-3 border-t border-border/60">
            {/* Trade Select */}
            <div>
              <label className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Trade Specialization
              </label>
              <select
                value={selectedTrade}
                onChange={(e) => setSelectedTrade(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2 text-xs outline-none focus:border-primary"
              >
                {TRADES.map((t) => (
                  <option key={t} value={t}>
                    {t === "ALL" ? "All Trades" : t}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Select */}
            <div>
              <label className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                District / Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-xl border border-border bg-background p-2 text-xs outline-none focus:border-primary"
              >
                {LOCATIONS.map((l) => (
                  <option key={l} value={l}>
                    {l === "ALL" ? "All Districts" : l}
                  </option>
                ))}
              </select>
            </div>

            {/* Career Readiness Minimum */}
            <div>
              <label className="text-[0.68rem] font-bold uppercase tracking-wider text-muted-foreground mb-1 block">
                Min. Readiness: {minReadiness > 0 ? `${minReadiness}%` : "Any"}
              </label>
              <select
                value={minReadiness}
                onChange={(e) => setMinReadiness(Number(e.target.value))}
                className="w-full rounded-xl border border-border bg-background p-2 text-xs outline-none focus:border-primary"
              >
                <option value={0}>Any Readiness Score</option>
                <option value={80}>80%+ Job-Ready</option>
                <option value={85}>85%+ High Competency</option>
                <option value={90}>90%+ Top Tier</option>
              </select>
            </div>

            {/* Verified Only Toggle */}
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) => setVerifiedOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-border accent-primary"
                />
                <span className="font-semibold text-foreground text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Verified profiles only
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Candidates Grid */}
        {candidates.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-lg font-bold text-foreground mt-3">
              No matching candidates found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Try adjusting your trade, location, or readiness score filters.
            </p>
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {candidates.map((candidate) => {
              const isShortlisted =
                candidate.applicationStatus === "SHORTLISTED" ||
                candidate.applicationStatus === "INTERVIEW_SCHEDULED";

              return (
                <div
                  key={candidate.id}
                  className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group"
                >
                  <div>
                    {/* Top match score and verification */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                        <Sparkles className="h-3 w-3 fill-current" />
                        {candidate.matchScore}% Match
                      </span>

                      {candidate.isVerified && (
                        <span className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>

                    {/* Candidate Identity */}
                    <div className="mt-3.5 flex items-center gap-3">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-primary/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors truncate">
                          {candidate.name}
                        </h3>
                        <p className="text-xs text-primary font-semibold truncate">{candidate.trade}</p>
                        <p className="text-[0.68rem] text-muted-foreground truncate">{candidate.iti}</p>
                      </div>
                    </div>

                    {/* Location & Experience */}
                    <div className="mt-3 flex items-center justify-between text-[0.7rem] text-muted-foreground bg-secondary/40 p-2 rounded-xl">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                        <span className="truncate max-w-[120px]">{candidate.location}</span>
                      </span>
                      <span>Exp: <strong className="text-foreground">{candidate.experience}</strong></span>
                    </div>

                    {/* Career Readiness Meter */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[0.68rem] mb-1">
                        <span className="text-muted-foreground font-medium">Career Readiness</span>
                        <span className="font-bold text-primary">{candidate.careerReadinessScore}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-primary"
                          style={{ width: `${candidate.careerReadinessScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills Chips */}
                    <div className="mt-3.5">
                      <div className="flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((s) => (
                          <span
                            key={s.name}
                            className="rounded-lg bg-secondary px-2 py-0.5 text-[0.65rem] font-medium text-foreground"
                          >
                            {s.name}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="rounded-lg bg-secondary/60 px-1.5 py-0.5 text-[0.62rem] text-muted-foreground">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center gap-2">
                    <Link
                      to="/recruiter/talent/$candidateId"
                      params={{ candidateId: candidate.id }}
                      className="flex-1 rounded-full border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-beige transition-colors"
                    >
                      View Profile
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleShortlistToggle(candidate)}
                      className={`inline-flex items-center justify-center gap-1 rounded-full px-3.5 py-2 text-xs font-semibold transition-all ${
                        isShortlisted
                          ? "bg-emerald-700 text-white shadow-2xs"
                          : "bg-primary text-primary-foreground hover:bg-primary-deep shadow-2xs"
                      }`}
                    >
                      {isShortlisted ? (
                        <>
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                          <span>Shortlisted</span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          <span>Shortlist</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      title="Schedule Interview"
                      onClick={() => {
                        setSelectedCandidate(candidate);
                        setInterviewModalOpen(true);
                      }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-gold/25 text-foreground hover:bg-gold/40 transition-colors shrink-0"
                    >
                      <Calendar className="h-4 w-4" />
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
