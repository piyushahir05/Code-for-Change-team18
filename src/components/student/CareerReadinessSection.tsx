import {
  ArrowRight,
  CheckCircle,
  HelpCircle,
  Info,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Counter, Reveal } from "@/components/site/motion-primitives";
import { READINESS_BREAKDOWN, ReadinessCategory, StudentProfile } from "./student-data";

interface CareerReadinessSectionProps {
  profile: StudentProfile;
  onImproveScore: () => void;
}

export function CareerReadinessSection({
  profile,
  onImproveScore,
}: CareerReadinessSectionProps) {
  return (
    <section className="relative py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="eyebrow text-gold font-semibold">Career Readiness</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Know where you stand.
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Your profile, assessments, and completed learning modules help Saksham calculate
                real shop-floor employability.
              </p>
            </div>
            <button
              type="button"
              onClick={onImproveScore}
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-soft"
            >
              <Zap className="h-3.5 w-3.5 text-gold" />
              <span>Improve My Score</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </Reveal>

        {/* Readiness Dashboard Grid */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Main Score Overview Card */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-[2.2rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-muted-foreground">Overall Index</span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    Good progress
                  </span>
                </div>

                <div className="mt-6 flex items-baseline gap-3">
                  <span className="font-serif text-5xl sm:text-6xl font-bold tracking-tight text-foreground">
                    <Counter to={profile.careerReadinessScore} />
                  </span>
                  <span className="font-serif text-2xl text-muted-foreground">/ 100</span>
                </div>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  Based on ITI Electrician syllabus, employer requirements in Pune industrial belt,
                  and your current course completions.
                </p>

                {/* Score Milestone Tracker */}
                <div className="mt-6 space-y-3 rounded-2xl bg-secondary/50 p-4 border border-border/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Next Tier: Placement Ready (85)</span>
                    <span className="font-semibold text-primary">7 pts needed</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-border/80">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "78%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                  <div className="flex justify-between text-[0.68rem] text-muted-foreground">
                    <span>Baseline: 50</span>
                    <span>Target: 85 (Top 10% Batch)</span>
                  </div>
                </div>
              </div>

              {/* Editorial takeaway microcopy */}
              <div className="mt-6 rounded-2xl bg-primary/5 p-4 border border-primary/15">
                <p className="text-xs text-foreground/80 leading-relaxed">
                  <strong className="text-primary font-semibold">Key Insight:</strong> You're
                  strongest in technical skills. Focus next on communication and interview readiness
                  to boost employer interview conversion.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Segmented Category Breakdown */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col justify-between rounded-[2.2rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft">
              <div>
                <div className="flex items-center justify-between border-b border-border/60 pb-3">
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Competency Breakdown
                  </h3>
                  <span className="text-xs text-muted-foreground">5 Core Pillars</span>
                </div>

                <div className="mt-6 space-y-5">
                  {READINESS_BREAKDOWN.map((item, idx) => {
                    const isGap = item.score < 70;
                    return (
                      <div key={item.name} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{item.name}</span>
                            {isGap && (
                              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[0.65rem] font-semibold text-amber-800 border border-amber-200">
                                Priority Gap
                              </span>
                            )}
                          </div>
                          <span
                            className={`font-bold ${
                              isGap ? "text-amber-800 font-semibold" : "text-primary"
                            }`}
                          >
                            {item.score}%
                          </span>
                        </div>

                        {/* Animated Horizontal Progress Bar */}
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.score}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              isGap ? "bg-gradient-to-r from-gold to-amber-500" : "bg-primary"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action trigger footer */}
              <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3.5 w-3.5 text-primary" />
                  <span>Scores refresh automatically with every module assessment</span>
                </div>
                <button
                  type="button"
                  onClick={onImproveScore}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  View detailed skill map →
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
