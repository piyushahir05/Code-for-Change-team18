import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  MapPin,
  Plus,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OpportunityReviewModal } from "@/components/admin/OpportunityReviewModal";
import { VerificationDetailModal } from "@/components/admin/VerificationDetailModal";
import { Counter } from "@/components/site/motion-primitives";
import {
  AdminActivityLog,
  AdminAnalyticsData,
  AdminOpportunity,
  VerificationCandidate,
} from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard · Saksham | Y4D Foundation" },
      {
        name: "description",
        content: "Platform mission control for ITI verification, opportunity approvals, and student employability metrics.",
      },
    ],
  }),
  component: AdminDashboardPage,
});

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState<AdminAnalyticsData>(() => adminService.getAnalytics());
  const [pendingVerifications, setPendingVerifications] = useState<VerificationCandidate[]>([]);
  const [pendingOpportunities, setPendingOpportunities] = useState<AdminOpportunity[]>([]);
  const [recentActivity, setRecentActivity] = useState<AdminActivityLog[]>([]);

  // Modals
  const [selectedVerification, setSelectedVerification] = useState<VerificationCandidate | null>(null);
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<AdminOpportunity | null>(null);
  const [opportunityModalOpen, setOpportunityModalOpen] = useState(false);

  const loadData = async () => {
    const [nextAnalytics, nextVerifications, nextOpportunities, nextActivity] = await Promise.all([
      adminService.fetchAnalytics(),
      adminService.fetchVerifications(undefined, "PENDING"),
      adminService.fetchOpportunities("PENDING"),
      Promise.resolve(adminService.getActivityLog().slice(0, 5)),
    ]);

    setAnalytics(nextAnalytics);
    setPendingVerifications(nextVerifications);
    setPendingOpportunities(nextOpportunities);
    setRecentActivity(nextActivity);
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleQuickVerify = (candidate: VerificationCandidate) => {
    adminService.verifyUser(candidate.id);
    toast.success(`${candidate.name} verified successfully ✓`);
    void loadData();
  };

  const handleQuickApprove = (opp: AdminOpportunity) => {
    adminService.approveOpportunity(opp.id);
    toast.success(`'${opp.title}' approved successfully ✓`);
    void loadData();
  };

  const pendingStudentsCount = pendingVerifications.filter((v) => v.role === "STUDENT").length;
  const pendingMentorsCount = pendingVerifications.filter((v) => v.role === "MENTOR").length;
  const pendingRecruitersCount = pendingVerifications.filter((v) => v.role === "RECRUITER").length;

  return (
    <AdminLayout pageTitle="Platform Overview">
      <div className="space-y-8">
        {/* 1. Header Banner */}
        <div className="rounded-[2.5rem] border border-gold/40 bg-gradient-to-r from-card via-secondary/40 to-gold/10 p-6 sm:p-8 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow text-gold font-bold">Mission Control</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.68rem] font-bold text-primary">
                Y4D Foundation Authority
              </span>
            </div>

            <h1 className="mt-1.5 font-serif text-2xl sm:text-4xl font-bold text-foreground">
              Saksham Admin <span className="text-primary italic">Overview</span>
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-xl">
              Real-time platform governance: verify students, approve industry opportunities, and monitor
              employability outcomes across Maharashtra ITI institutions.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin/verifications"
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep transition-all"
            >
              <ShieldCheck className="h-4 w-4 text-gold" />
              <span>Review Verifications ({pendingVerifications.length})</span>
            </Link>
          </div>
        </div>

        {/* 2. "WHAT NEEDS MY ATTENTION TODAY?" — Action Queue (P0 Priority) */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Pending Verifications Attention Card */}
          <div className="rounded-[2rem] border border-primary/20 bg-card p-6 shadow-2xs hover:shadow-soft transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <span className="eyebrow text-gold font-bold">Action Queue</span>
                  <h3 className="font-serif text-base font-bold text-foreground">
                    Pending User Verifications
                  </h3>
                </div>
              </div>

              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-900">
                {pendingVerifications.length} Awaiting Review
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center rounded-2xl bg-secondary/50 p-3">
              <div>
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold">Students</span>
                <p className="font-serif text-xl font-bold text-foreground mt-0.5">{pendingStudentsCount}</p>
              </div>
              <div>
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold">Mentors</span>
                <p className="font-serif text-xl font-bold text-foreground mt-0.5">{pendingMentorsCount}</p>
              </div>
              <div>
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold">Recruiters</span>
                <p className="font-serif text-xl font-bold text-primary mt-0.5">{pendingRecruitersCount}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">
                Verify student NCVT certificates & employer credentials.
              </p>
              <Link
                to="/admin/verifications"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
              >
                <span>View Queue</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Pending Opportunities Attention Card */}
          <div className="rounded-[2rem] border border-primary/20 bg-card p-6 shadow-2xs hover:shadow-soft transition-all space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div>
                  <span className="eyebrow text-gold font-bold">Action Queue</span>
                  <h3 className="font-serif text-base font-bold text-foreground">
                    Opportunities Awaiting Approval
                  </h3>
                </div>
              </div>

              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-900">
                {pendingOpportunities.length} In Review
              </span>
            </div>

            <div className="rounded-2xl bg-secondary/50 p-3 text-xs flex items-center justify-between">
              <div>
                <p className="font-bold text-foreground">Employer Postings Gate</p>
                <p className="text-[0.68rem] text-muted-foreground">
                  Postings remain hidden from students until approved by Y4D.
                </p>
              </div>
              <span className="font-serif text-2xl font-bold text-primary shrink-0 pl-3">
                {pendingOpportunities.length}
              </span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-muted-foreground">
                Enforce government NAPS stipend & safety guidelines.
              </p>
              <Link
                to="/admin/opportunities"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
              >
                <span>Review Postings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* 3. Core Platform Metrics (7 Key Indicators) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="eyebrow text-gold font-bold">Platform Pulse</span>
              <h2 className="font-serif text-xl font-bold text-foreground">
                Platform Key Performance Indicators
              </h2>
            </div>
            <Link
              to="/admin/analytics"
              className="text-xs font-semibold text-primary hover:underline"
            >
              Detailed Analytics →
            </Link>
          </div>

          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-7">
            {/* Total Students */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
              <span className="text-[0.65rem] font-bold text-muted-foreground uppercase">
                Total Students
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
                <Counter value={analytics.totalStudents} />
              </p>
              <span className="text-[0.62rem] text-muted-foreground">Enrolled ITI youth</span>
            </div>

            {/* Verified Students */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
              <span className="text-[0.65rem] font-bold text-emerald-800 uppercase">
                Verified Students
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-900 mt-1">
                <Counter value={analytics.verifiedStudents} />
              </p>
              <span className="text-[0.62rem] text-emerald-700">75% verified rate</span>
            </div>

            {/* Mentors */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
              <span className="text-[0.65rem] font-bold text-muted-foreground uppercase">
                Total Mentors
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
                <Counter value={analytics.totalMentors} />
              </p>
              <span className="text-[0.62rem] text-muted-foreground">Faculty & experts</span>
            </div>

            {/* Verified Recruiters */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
              <span className="text-[0.65rem] font-bold text-muted-foreground uppercase">
                Recruiters
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-primary mt-1">
                <Counter value={analytics.verifiedRecruiters} />
              </p>
              <span className="text-[0.62rem] text-muted-foreground">Verified employers</span>
            </div>

            {/* Active Opportunities */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
              <span className="text-[0.65rem] font-bold text-muted-foreground uppercase">
                Active Opps
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
                <Counter value={analytics.activeOpportunities} />
              </p>
              <span className="text-[0.62rem] text-muted-foreground">Live student openings</span>
            </div>

            {/* Applications */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs">
              <span className="text-[0.65rem] font-bold text-muted-foreground uppercase">
                Applications
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-1">
                <Counter value={analytics.totalApplications} />
              </p>
              <span className="text-[0.62rem] text-muted-foreground">Submitted by ITI</span>
            </div>

            {/* Placements */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-2xs bg-emerald-50/50">
              <span className="text-[0.65rem] font-bold text-emerald-900 uppercase">
                Placements
              </span>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-950 mt-1">
                <Counter value={analytics.placements} />
              </p>
              <span className="text-[0.62rem] text-emerald-800 font-semibold">Inducted hires</span>
            </div>
          </div>
        </div>

        {/* 4. Quick Actions */}
        <div className="rounded-3xl border border-border bg-card p-5 shadow-2xs">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-3">
            Quick Navigation Actions
          </span>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Link
              to="/admin/verifications"
              className="flex items-center gap-2.5 rounded-2xl bg-secondary/70 p-3 text-xs font-semibold text-foreground hover:bg-beige hover:text-primary transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Review Verifications</span>
            </Link>

            <Link
              to="/admin/opportunities"
              className="flex items-center gap-2.5 rounded-2xl bg-secondary/70 p-3 text-xs font-semibold text-foreground hover:bg-beige hover:text-primary transition-colors"
            >
              <Briefcase className="h-4 w-4 text-primary" />
              <span>Review Opportunities</span>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-2.5 rounded-2xl bg-secondary/70 p-3 text-xs font-semibold text-foreground hover:bg-beige hover:text-primary transition-colors"
            >
              <Users className="h-4 w-4 text-primary" />
              <span>Manage User Directory</span>
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center gap-2.5 rounded-2xl bg-secondary/70 p-3 text-xs font-semibold text-foreground hover:bg-beige hover:text-primary transition-colors"
            >
              <BarChart3 className="h-4 w-4 text-primary" />
              <span>View Impact Analytics</span>
            </Link>
          </div>
        </div>

        {/* 5. Compact Recent Tables Grid: Verifications & Opportunities */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Verifications Queue */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="eyebrow text-gold font-bold">Pending Approval</span>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Recent Verification Submissions
                </h3>
              </div>
              <Link
                to="/admin/verifications"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all ({pendingVerifications.length}) →
              </Link>
            </div>

            {pendingVerifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 opacity-60 mb-2" />
                <p className="font-bold text-foreground">No pending verifications</p>
                <p className="mt-0.5">You're all caught up with user onboarding.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingVerifications.slice(0, 3).map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/30 p-3 text-xs hover:bg-secondary/60 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={v.avatar}
                        alt={v.name}
                        className="h-10 w-10 rounded-xl object-cover border border-primary/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-foreground truncate">{v.name}</p>
                        <p className="text-[0.68rem] text-primary font-semibold truncate">
                          {v.role === "STUDENT"
                            ? `${v.trade} · ${v.iti}`
                            : v.role === "RECRUITER"
                            ? `${v.companyName} (${v.industry})`
                            : `${v.expertise} · ${v.organization}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedVerification(v);
                          setVerificationModalOpen(true);
                        }}
                        className="rounded-full border border-border px-3 py-1 text-[0.68rem] font-semibold text-foreground hover:bg-beige"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickVerify(v)}
                        className="rounded-full bg-emerald-700 px-3 py-1 text-[0.68rem] font-semibold text-white hover:bg-emerald-800"
                      >
                        Verify
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Opportunities Queue */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="eyebrow text-gold font-bold">Pending Review</span>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Recent Opportunity Postings
                </h3>
              </div>
              <Link
                to="/admin/opportunities"
                className="text-xs font-semibold text-primary hover:underline"
              >
                View all ({pendingOpportunities.length}) →
              </Link>
            </div>

            {pendingOpportunities.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 opacity-60 mb-2" />
                <p className="font-bold text-foreground">No opportunities awaiting approval</p>
                <p className="mt-0.5">All recruiter requirements have been processed.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingOpportunities.slice(0, 3).map((opp) => (
                  <div
                    key={opp.id}
                    className="flex items-center justify-between gap-3 rounded-2xl bg-secondary/30 p-3 text-xs hover:bg-secondary/60 transition-colors"
                  >
                    <div className="min-w-0">
                      <span className="rounded-md bg-card px-1.5 py-0.5 text-[0.62rem] font-bold text-primary border border-border">
                        {opp.type.replace(/_/g, " ")}
                      </span>
                      <p className="font-bold text-foreground truncate mt-1">{opp.title}</p>
                      <p className="text-[0.68rem] text-muted-foreground truncate">
                        {opp.company} · {opp.salaryStipend}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOpportunity(opp);
                          setOpportunityModalOpen(true);
                        }}
                        className="rounded-full border border-border px-3 py-1 text-[0.68rem] font-semibold text-foreground hover:bg-beige"
                      >
                        Review
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickApprove(opp)}
                        className="rounded-full bg-emerald-700 px-3 py-1 text-[0.68rem] font-semibold text-white hover:bg-emerald-800"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 6. Recent Platform Activity Timeline */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="eyebrow text-gold font-bold">Activity Audit</span>
              <h3 className="font-serif text-base font-bold text-foreground">
                Recent Governance & Platform Activity
              </h3>
            </div>
            <span className="text-xs text-muted-foreground">Real-time log</span>
          </div>

          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-start justify-between gap-3 text-xs p-2.5 rounded-2xl bg-secondary/20 hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5 grid h-6 w-6 place-items-center rounded-lg bg-card border border-border text-primary shrink-0">
                    <Activity className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{act.title}</p>
                    <p className="text-[0.68rem] text-muted-foreground mt-0.5">{act.description}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[0.62rem] text-muted-foreground block">{act.time}</span>
                  <span className="text-[0.62rem] font-semibold text-primary">{act.actor}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Detail Modal */}
      <VerificationDetailModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        candidate={selectedVerification}
        onActionComplete={loadData}
      />

      {/* Opportunity Review Modal */}
      <OpportunityReviewModal
        isOpen={opportunityModalOpen}
        onClose={() => setOpportunityModalOpen(false)}
        opportunity={selectedOpportunity}
        onActionComplete={loadData}
      />
    </AdminLayout>
  );
}
