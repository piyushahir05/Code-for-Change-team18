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
  { stage: "Students Enrolled", count: 1248, rate: "100%", desc: "Total youth on Saksham ecosystem" },
  { stage: "Verified Profiles", count: 932, rate: "74.7%", desc: "NCVT & ITI institute verified" },
  { stage: "Active in Learning", count: 1040, rate: "83.3%", desc: "Completed safety & trade modules" },
  { stage: "Applications Sent", count: 536, rate: "42.9%", desc: "Submitted to active opportunities" },
  { stage: "Placed in Apprenticeships", count: 128, rate: "23.8%", desc: "Inducted with NAPS certification" },
];

const TRADE_PLACEMENTS = [
  { trade: "Electrician", total: 420, placed: 58, rate: "13.8%", color: "bg-primary" },
  { trade: "Fitter", total: 310, placed: 36, rate: "11.6%", color: "bg-gold" },
  { trade: "Welder", total: 240, placed: 22, rate: "9.2%", color: "bg-amber-600" },
  { trade: "Electronics / COPA", total: 160, placed: 12, rate: "7.5%", color: "bg-stone-600" },
];

export function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<AdminAnalyticsData>(() => adminService.getAnalytics());

  useEffect(() => {
    setAnalytics(adminService.getAnalytics());
  }, []);

  return (
    <AdminLayout
      pageTitle="Platform Analytics"
      breadcrumbs={[{ label: "Analytics" }]}
      actionButton={
        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full">
          128 Placements Verified
        </span>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Y4D Foundation Platform Impact
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Empowering ITI students through structured training, certified verification, and direct industry hiring.
            </p>
          </div>
        </div>

        {/* 1. Core Impact Funnel */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <span className="eyebrow text-gold font-bold">Employability Funnel</span>
              <h2 className="font-serif text-lg sm:text-xl font-bold text-foreground">
                Student Progression Pipeline
              </h2>
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

        {/* 2. Grid: Verification Trust & Trade Placement Ratios */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Verification Conversion Card */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="eyebrow text-gold font-bold">Trust & Integrity</span>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Verification Quality Ratios
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground">Student Profile Verification Rate</span>
                  <span className="font-bold text-emerald-800">
                    {Math.round((analytics.verifiedStudents / analytics.totalStudents) * 100)}% (
                    {analytics.verifiedStudents} / {analytics.totalStudents})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-emerald-600"
                    style={{
                      width: `${(analytics.verifiedStudents / analytics.totalStudents) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-foreground">Recruiter Organization Verification Rate</span>
                  <span className="font-bold text-primary">
                    {Math.round((analytics.verifiedRecruiters / analytics.totalRecruiters) * 100)}% (
                    {analytics.verifiedRecruiters} / {analytics.totalRecruiters})
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{
                      width: `${(analytics.verifiedRecruiters / analytics.totalRecruiters) * 100}%`,
                    }}
                  />
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

          {/* Trade Placement Distribution */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <span className="eyebrow text-gold font-bold">Hiring Outcomes</span>
                <h3 className="font-serif text-base font-bold text-foreground">
                  Trade-wise Apprenticeship Absorption
                </h3>
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
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${(t.placed / t.total) * 100 * 3}%` }} />
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
