import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Counter } from "@/components/site/motion-primitives";
import { AdminAnalyticsData } from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({
    meta: [
      { title: "Platform Analytics · Admin Portal | Saksham" },
      {
        name: "description",
        content: "Platform metrics, verification conversion, and ITI placement outcomes powered by Y4D Foundation.",
      },
    ],
  }),
  component: AdminAnalyticsPage,
});

const IMPACT_FUNNEL = [
  { stage: "Students Enrolled", count: 2840, rate: "100%", desc: "Total youth on Saksham ecosystem" },
  { stage: "Verified Profiles", count: 2145, rate: "75.5%", desc: "NCVT & ITI institute verified" },
  { stage: "Active in Learning", count: 2318, rate: "81.6%", desc: "Completed safety & trade modules" },
  { stage: "Applications Sent", count: 3568, rate: "125.6%", desc: "Total submissions across active openings" },
  { stage: "Placed in Apprenticeships", count: 612, rate: "21.5%", desc: "Inducted with NAPS certification" },
];

const TRADE_PLACEMENTS = [
  { trade: "Electrician", total: 720, placed: 156, rate: "21.7%", color: "bg-primary" },
  { trade: "Fitter", total: 540, placed: 118, rate: "21.9%", color: "bg-gold" },
  { trade: "Welder", total: 430, placed: 87, rate: "20.2%", color: "bg-amber-600" },
  { trade: "Electronics / COPA", total: 280, placed: 54, rate: "19.3%", color: "bg-stone-600" },
];

const MONTHLY_GROWTH = [42, 58, 67, 74, 68, 90, 102, 120, 110, 128, 141, 160];
const SKILL_DISTRIBUTION = [
  { label: "Electrical", value: 32, color: "bg-primary" },
  { label: "Mechanical", value: 24, color: "bg-gold" },
  { label: "Digital", value: 18, color: "bg-emerald-600" },
  { label: "Communication", value: 16, color: "bg-amber-600" },
  { label: "Safety", value: 10, color: "bg-slate-600" },
];

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsData>(() => adminService.getAnalytics());

  useEffect(() => {
    const loadAnalytics = async () => {
      const response = await adminService.fetchAnalytics();
      setAnalytics(response);
    };

    void loadAnalytics();
  }, []);

  const verificationRate = Math.round((analytics.verifiedStudents / analytics.totalStudents) * 100);
  const recruiterRate = Math.round((analytics.verifiedRecruiters / analytics.totalRecruiters) * 100);

  return (
    <AdminLayout
      pageTitle="Platform Analytics"
      breadcrumbs={[{ label: "Analytics" }]}
      actionButton={
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full">
          {analytics.placements} Placements Verified
        </span>
      }
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Platform Key Performance Indicators
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Real-world employability outcomes across students, mentors, recruiters, and placement performance.
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Total Students", value: analytics.totalStudents, sub: "Enrolled ITI youth", tone: "text-foreground" },
            { label: "Verified Students", value: analytics.verifiedStudents, sub: `${verificationRate}% verified rate`, tone: "text-emerald-700" },
            { label: "Total Mentors", value: analytics.totalMentors, sub: "Faculty & experts", tone: "text-foreground" },
            { label: "Recruiters", value: analytics.totalRecruiters, sub: "Verified employers", tone: "text-red-700" },
            { label: "Active Opps", value: analytics.activeOpportunities, sub: "Live student openings", tone: "text-foreground" },
            { label: "Applications", value: analytics.totalApplications, sub: "Submitted by ITI youth", tone: "text-foreground" },
            { label: "Placements", value: analytics.placements, sub: "Inducted hires", tone: "text-emerald-700" },
          ].map((item) => (
            <div key={item.label} className="rounded-[1.6rem] border border-[#e7dfd2] bg-[#f8f5f0] p-5 shadow-[0_12px_28px_rgba(66,49,26,0.08)]">
              <p className="text-[0.72rem] font-black uppercase tracking-[0.12em] text-[#4d382a]">{item.label}</p>
              <div className={`mt-4 font-serif text-5xl font-bold leading-none ${item.tone}`}>
                <Counter value={item.value} />
              </div>
              <p className="mt-3 text-sm text-[#6b5f58]">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <span className="eyebrow text-gold font-bold">Performance Trend</span>
                <h2 className="font-serif text-xl font-bold text-foreground">Monthly enrollments & job activity</h2>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                +18.2% vs last quarter
              </span>
            </div>

            <div className="flex h-52 items-end gap-3 overflow-hidden rounded-2xl bg-secondary/40 p-4">
              {MONTHLY_GROWTH.map((bar, index) => (
                <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <div className="w-full rounded-t-xl bg-gradient-to-t from-primary to-gold/90" style={{ height: `${Math.max(bar, 18)}%` }} />
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    {"Jan".slice(0, 3)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-card p-6 shadow-soft">
            <div className="mb-5">
              <span className="eyebrow text-gold font-bold">Opportunity Mix</span>
              <h2 className="font-serif text-xl font-bold text-foreground">Skill demand distribution</h2>
            </div>

            <div className="space-y-4">
              {SKILL_DISTRIBUTION.map((item) => (
                <div key={item.label}>
                  <div className="mb-1 flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <span>{item.label}</span>
                    <span className="text-foreground font-bold">{item.value}%</span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/80 bg-card p-6 shadow-soft space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="eyebrow text-gold font-bold">Employability Funnel</span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">Student progression pipeline</h2>
            </div>
            <span className="text-xs text-muted-foreground">From onboarding to certified placement</span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
            {IMPACT_FUNNEL.map((step, idx) => (
              <div
                key={step.stage}
                className="relative rounded-2xl border border-border bg-secondary/30 p-4 hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground font-bold">
                  <span>0{idx + 1}</span>
                  <span className="text-primary">{step.rate}</span>
                </div>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-foreground mt-2">
                  <Counter value={step.count} />
                </p>
                <p className="text-xs font-bold text-foreground mt-1">{step.stage}</p>
                <p className="text-[0.68rem] text-muted-foreground mt-0.5">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="eyebrow text-gold font-bold">Trust & Integrity</span>
                <h3 className="font-serif text-base font-bold text-foreground">Verification quality ratios</h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground">Student Profile Verification Rate</span>
                  <span className="font-bold text-emerald-800">
                    {verificationRate}% ({analytics.verifiedStudents} / {analytics.totalStudents})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-emerald-600" style={{ width: `${verificationRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground">Recruiter Organization Verification Rate</span>
                  <span className="font-bold text-primary">
                    {recruiterRate}% ({analytics.verifiedRecruiters} / {analytics.totalRecruiters})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${recruiterRate}%` }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground">Opportunity Approval Rate</span>
                  <span className="font-bold text-foreground">92% Compliance</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gold" style={{ width: "92%" }} />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="eyebrow text-gold font-bold">Hiring Outcomes</span>
                <h3 className="font-serif text-base font-bold text-foreground">Trade-wise apprenticeship absorption</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {TRADE_PLACEMENTS.map((t) => (
                <div key={t.trade} className="p-2.5 rounded-2xl bg-secondary/30">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-foreground">{t.trade}</span>
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{t.placed} Placed</strong> of {t.total} candidates
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${Math.min((t.placed / t.total) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
