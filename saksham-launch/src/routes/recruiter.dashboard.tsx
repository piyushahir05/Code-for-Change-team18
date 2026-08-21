import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  Video,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { Counter } from "@/components/site/motion-primitives";
import { Candidate, InterviewRecord, Opportunity } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/dashboard")({
  head: () => ({
    meta: [
      { title: "Recruiter Dashboard · Saksham | Y4D Foundation" },
      {
        name: "description",
        content: "Discover verified ITI candidates, manage apprenticeships, shortlist talent, and schedule interviews.",
      },
    ],
  }),
  component: RecruiterDashboardPage,
});

function RecruiterDashboardPage() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(() => recruiterService.getKPIs());
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>("all");
  const [smartMatches, setSmartMatches] = useState<Candidate[]>([]);
  const [upcomingInterviews, setUpcomingInterviews] = useState<InterviewRecord[]>([]);
  const [analytics] = useState(() => recruiterService.getAnalytics());
  const [companyProfile, setCompanyProfile] = useState(() => recruiterService.getCompanyProfile());

  // Interview modal state
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedCandidateForInterview, setSelectedCandidateForInterview] = useState<Candidate | null>(null);

  const loadData = () => {
    setKpis(recruiterService.getKPIs());
    const opps = recruiterService.getOpportunities("ACTIVE");
    setOpportunities(opps);
    setSmartMatches(recruiterService.getSmartMatches(selectedOpportunityId));
    setUpcomingInterviews(recruiterService.getInterviews("UPCOMING").slice(0, 3));
    setCompanyProfile(recruiterService.getCompanyProfile());
  };

  useEffect(() => {
    loadData();
  }, [selectedOpportunityId]);

  const handleShortlistToggle = (candidate: Candidate) => {
    if (candidate.applicationStatus === "SHORTLISTED" || candidate.applicationStatus === "INTERVIEW_SCHEDULED") {
      recruiterService.removeShortlist(candidate.id);
      toast.info(`${candidate.name} removed from shortlist`);
    } else {
      recruiterService.shortlistCandidate(candidate.id, selectedOpportunityId !== "all" ? selectedOpportunityId : undefined);
      toast.success("Candidate shortlisted successfully ✓", {
        description: `${candidate.name} moved to your Shortlisted talent pipeline.`,
      });
    }
    loadData();
  };

  const handleOpenScheduleModal = (candidate: Candidate) => {
    setSelectedCandidateForInterview(candidate);
    setInterviewModalOpen(true);
  };

  return (
    <RecruiterLayout pageTitle="Employer Dashboard">
      <div className="space-y-8">
        {/* 1. Header Greeting & Organization Status */}
        <div className="rounded-[2.5rem] border border-gold/40 bg-gradient-to-r from-card via-secondary/40 to-gold/10 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-gold font-bold">Employer Workspace</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-[0.68rem] font-bold text-emerald-800">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
                ● Verified Employer
              </span>
            </div>

            <h1 className="mt-1.5 font-serif text-2xl sm:text-4xl font-bold text-foreground">
              Good morning, <span className="text-primary italic">{companyProfile.companyName}</span> 👋
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl">
              Find verified, skilled ITI talent faster. Explore smart-matched candidates, manage active
              apprenticeships, and schedule shop-floor interviews.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/recruiter/talent"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-3 text-xs font-semibold text-foreground hover:bg-beige transition-colors shadow-2xs"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>Explore Talent Pool</span>
            </Link>

            <Link
              to="/recruiter/opportunities/new"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-xs font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep transition-all"
            >
              <Plus className="h-4 w-4 text-gold transition-transform group-hover:rotate-90" />
              <span>Post Opportunity</span>
            </Link>
          </div>
        </div>

        {/* 2. KPI Summary Cards (4 Cards) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Open Opportunities */}
          <div className="rounded-[2rem] border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Open Opportunities
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary group-hover:scale-110 transition-transform">
                <Briefcase className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                <Counter value={kpis.openOpportunities} />
              </span>
              <span className="text-xs text-emerald-700 font-semibold">+2 active this week</span>
            </div>
            <p className="text-[0.68rem] text-muted-foreground mt-1">Across Chakan & Pimpri plants</p>
          </div>

          {/* Total Applicants */}
          <div className="rounded-[2rem] border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Applicants
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-secondary text-primary group-hover:scale-110 transition-transform">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
                <Counter value={kpis.totalApplicants} />
              </span>
              <span className="text-xs text-emerald-700 font-semibold">+18% growth</span>
            </div>
            <p className="text-[0.68rem] text-muted-foreground mt-1">From 14 ITI colleges in Maharashtra</p>
          </div>

          {/* Shortlisted Candidates */}
          <div className="rounded-[2rem] border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Shortlisted
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold/20 text-foreground group-hover:scale-110 transition-transform">
                <BookmarkCheck className="h-4 w-4 text-primary" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-primary">
                <Counter value={kpis.shortlisted} />
              </span>
              <span className="text-xs text-muted-foreground font-semibold">Ready for interview</span>
            </div>
            <p className="text-[0.68rem] text-muted-foreground mt-1">32% trade aptitude pass rate</p>
          </div>

          {/* Hired / Placed */}
          <div className="rounded-[2rem] border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hired / Placed
              </span>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-100 text-emerald-800 group-hover:scale-110 transition-transform">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-emerald-950">
                <Counter value={kpis.hired} />
              </span>
              <span className="text-xs text-emerald-700 font-semibold">72% acceptance</span>
            </div>
            <p className="text-[0.68rem] text-muted-foreground mt-1">Apprentices inducted this batch</p>
          </div>
        </div>

        {/* 3. Hiring Pipeline Overview (Horizontal Pipeline) */}
        <div className="rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
            <div>
              <span className="eyebrow text-gold font-bold">Hiring Funnel</span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Recruitment & Apprenticeship Pipeline
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">
              Real-time progression from verification to shop-floor induction
            </p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {analytics.pipelineBreakdown.map((stage, idx) => (
              <div
                key={stage.stage}
                onClick={() => {
                  if (stage.stage === "Shortlisted") navigate({ to: "/recruiter/shortlisted" });
                  else if (stage.stage === "Interview") navigate({ to: "/recruiter/interviews" });
                  else navigate({ to: "/recruiter/talent" });
                }}
                className="relative rounded-2xl border border-border bg-secondary/30 p-4 transition-all hover:bg-secondary/70 hover:scale-102 cursor-pointer group"
              >
                <span className="text-[0.65rem] font-bold tracking-wider text-muted-foreground uppercase">
                  0{idx + 1} · {stage.stage}
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1 group-hover:text-primary transition-colors">
                  {stage.count}
                </p>
                <p className="text-[0.68rem] text-muted-foreground mt-0.5">{stage.label}</p>
                <span className="inline-block mt-2 text-[0.62rem] font-bold text-primary">
                  {stage.change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. SMART TALENT MATCH (Strongest Visual Section) */}
        <div className="rounded-[2.5rem] border border-primary/20 bg-gradient-to-b from-card via-secondary/20 to-card p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-lg bg-gold text-foreground">
                  <Sparkles className="h-4 w-4 fill-foreground" />
                </div>
                <span className="eyebrow text-gold font-bold">Smart Talent Match</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1">
                Candidates Ranked by Skills, Readiness & Opportunity Requirements
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Calculated based on trade syllabus alignment, certified practical tests, and district proximity.
              </p>
            </div>

            {/* Opportunity Selector Filter */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
              <select
                value={selectedOpportunityId}
                onChange={(e) => setSelectedOpportunityId(e.target.value)}
                aria-label="Filter candidates by opportunity"
                className="rounded-2xl border border-border bg-background px-3.5 py-2 text-xs font-medium outline-none focus:border-primary"
              >
                <option value="all">All Active Requirements (34 Matches)</option>
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title} ({opp.trade})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Matched Candidates Grid */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {smartMatches.slice(0, 3).map((candidate) => {
              const isShortlisted =
                candidate.applicationStatus === "SHORTLISTED" ||
                candidate.applicationStatus === "INTERVIEW_SCHEDULED";

              return (
                <motion.div
                  key={candidate.id}
                  whileHover={{ y: -4 }}
                  className="relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all"
                >
                  <div>
                    {/* Top match pill and verified badge */}
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

                    {/* Candidate header */}
                    <div className="mt-4 flex items-center gap-3">
                      <img
                        src={candidate.avatar}
                        alt={candidate.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-primary/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif text-base font-bold text-foreground truncate">
                          {candidate.name}
                        </h4>
                        <p className="text-xs text-primary font-semibold truncate">{candidate.trade}</p>
                        <p className="text-[0.68rem] text-muted-foreground truncate">{candidate.iti}</p>
                      </div>
                    </div>

                    {/* Readiness Bar */}
                    <div className="mt-4 rounded-2xl bg-secondary/50 p-2.5">
                      <div className="flex items-center justify-between text-[0.7rem]">
                        <span className="text-muted-foreground font-medium">Career Readiness</span>
                        <span className="font-bold text-foreground">
                          {candidate.careerReadinessScore}%
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold to-primary"
                          style={{ width: `${candidate.careerReadinessScore}%` }}
                        />
                      </div>
                    </div>

                    {/* Skills Chips */}
                    <div className="mt-3.5">
                      <p className="text-[0.65rem] font-bold tracking-wider text-muted-foreground uppercase">
                        Verified Practical Skills
                      </p>
                      <div className="mt-1.5 flex flex-wrap gap-1">
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

                  {/* Actions */}
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
                      className={`inline-flex items-center justify-center gap-1 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
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
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-5 text-center">
            <Link
              to="/recruiter/talent"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
            >
              <span>Explore all 34 smart-matched candidates in Talent Pool</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* 5. Analytics & Upcoming Interviews Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          {/* Left: Application Trends & Trade Distribution */}
          <div className="rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft space-y-6">
            <div>
              <span className="eyebrow text-gold font-bold">Talent Analytics</span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Application Growth & Trade Inflow
              </h3>
            </div>

            {/* Monthly Trend Bars */}
            <div>
              <p className="text-xs text-muted-foreground mb-3 font-semibold">
                Monthly Candidate Applications (2024)
              </p>
              <div className="grid grid-cols-4 gap-2 items-end h-28 pt-2">
                {analytics.monthlyApplications.map((m) => {
                  const heightPercent = Math.round((m.count / 260) * 100);
                  return (
                    <div key={m.month} className="flex flex-col items-center gap-1.5 h-full justify-end">
                      <span className="text-[0.65rem] font-bold text-foreground">{m.count}</span>
                      <div className="w-full rounded-xl bg-secondary/80 overflow-hidden h-20 flex items-end">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${heightPercent}%` }}
                          transition={{ duration: 0.6 }}
                          className="w-full bg-gradient-to-t from-primary to-gold rounded-t-xl"
                        />
                      </div>
                      <span className="text-[0.68rem] text-muted-foreground">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Trade Breakdown */}
            <div className="pt-4 border-t border-border/60">
              <p className="text-xs text-muted-foreground mb-3 font-semibold">
                Talent Pool Distribution by Trade Specialization
              </p>
              <div className="space-y-2.5">
                {analytics.talentByTrade.map((t) => (
                  <div key={t.trade} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">{t.trade}</span>
                      <span className="text-muted-foreground">{t.percentage}% ({t.count} candidates)</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className={`h-full rounded-full ${t.color}`}
                        style={{ width: `${t.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Upcoming Interviews Schedule */}
          <div className="rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4">
                <div>
                  <span className="eyebrow text-gold font-bold">Interviews</span>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Upcoming Scheduled Rounds
                  </h3>
                </div>
                <Link
                  to="/recruiter/interviews"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  View all →
                </Link>
              </div>

              <div className="space-y-3">
                {upcomingInterviews.map((intv) => (
                  <div
                    key={intv.id}
                    className="rounded-2xl border border-border/80 bg-secondary/30 p-3.5 text-xs hover:bg-secondary/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={intv.candidateAvatar}
                          alt={intv.candidateName}
                          className="h-9 w-9 rounded-xl object-cover border border-border"
                        />
                        <div>
                          <p className="font-bold text-foreground">{intv.candidateName}</p>
                          <p className="text-[0.68rem] text-muted-foreground">{intv.candidateTrade}</p>
                        </div>
                      </div>

                      <span className="rounded-lg bg-card px-2 py-0.5 text-[0.65rem] font-bold text-primary border border-border">
                        {intv.time}
                      </span>
                    </div>

                    <div className="mt-2.5 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
                      {intv.mode === "IN_PERSON" ? (
                        <MapPin className="h-3 w-3 text-primary shrink-0" />
                      ) : (
                        <Video className="h-3 w-3 text-primary shrink-0" />
                      )}
                      <span className="truncate">{intv.locationOrLink}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-border/60">
              <Link
                to="/recruiter/interviews"
                className="w-full flex items-center justify-center gap-1.5 rounded-full bg-secondary py-2.5 text-xs font-semibold text-foreground hover:bg-beige transition-colors"
              >
                <Calendar className="h-3.5 w-3.5 text-primary" />
                <span>Open Interview Scheduler</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidate={selectedCandidateForInterview}
        opportunities={opportunities}
        onScheduledSuccess={loadData}
      />
    </RecruiterLayout>
  );
}
