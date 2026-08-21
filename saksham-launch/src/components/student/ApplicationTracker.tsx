import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/site/motion-primitives";
import { APPLICATION_STATS, Application, APPLICATIONS } from "./student-data";

interface ApplicationTrackerProps {
  onSelectApplication: (app: Application) => void;
}

export function ApplicationTracker({ onSelectApplication }: ApplicationTrackerProps) {
  const featured = APPLICATIONS[0];

  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="eyebrow text-gold font-semibold">Application Journey</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Your applications
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Stay on top of every opportunity you've applied to. Real-time hiring pipeline
                updates from verified partner HR teams.
              </p>
            </div>

            <Link
              to="/student/applications"
              className="group inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>View all ({APPLICATION_STATS.applied}) applications</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* Summary Stats Row */}
        <Reveal delay={0.1}>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {[
              { label: "Applied", value: APPLICATION_STATS.applied, color: "text-foreground" },
              { label: "Under Review", value: APPLICATION_STATS.underReview, color: "text-primary" },
              { label: "Shortlisted", value: APPLICATION_STATS.shortlisted, color: "text-gold font-bold" },
              { label: "Interview", value: APPLICATION_STATS.interview, color: "text-emerald-700" },
              { label: "Selected", value: APPLICATION_STATS.selected, color: "text-muted-foreground" },
            ].map((st) => (
              <div
                key={st.label}
                className="rounded-2xl border border-border/80 bg-card p-4 text-center shadow-2xs transition-all hover:border-gold/30 hover:shadow-soft"
              >
                <p className={`font-serif text-2xl sm:text-3xl font-bold ${st.color}`}>
                  {st.value}
                </p>
                <p className="mt-1 text-[0.72rem] tracking-wider uppercase font-semibold text-muted-foreground">
                  {st.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Featured Active Application Card with 5-Step Visual Timeline */}
        <Reveal delay={0.15}>
          <div className="mt-8 rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-9 shadow-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-gold/20 px-3 py-0.5 text-xs font-semibold text-foreground/90 border border-gold/40">
                    Active Application
                  </span>
                  <span className="text-xs text-muted-foreground font-medium">
                    Applied {featured.appliedDate}
                  </span>
                </div>

                <h3 className="mt-2.5 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                  {featured.jobTitle}
                </h3>

                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5 font-semibold text-foreground">
                    <Building2 className="h-4 w-4 text-primary" />
                    {featured.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {featured.location}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-amber-50 px-4 py-2 text-center border border-amber-200">
                  <p className="text-[0.65rem] tracking-wider uppercase font-semibold text-amber-900">
                    Current Status
                  </p>
                  <p className="font-serif text-sm sm:text-base font-bold text-amber-950">
                    SHORTLISTED
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectApplication(featured)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-2xs transition-all hover:bg-primary-deep hover:shadow-lift"
                >
                  <span>View Application</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Visual 5-Stage Journey Timeline */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
                Stage Progression
              </p>

              {/* Desktop Horizontal Stepper */}
              <div className="relative hidden md:block">
                {/* Connecting Background Line */}
                <div className="absolute top-5 left-8 right-8 h-1 bg-secondary -z-0" />
                {/* Animated active progress fill line */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "50%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="absolute top-5 left-8 h-1 bg-gradient-to-r from-primary via-gold to-gold -z-0"
                />

                <div className="relative z-10 grid grid-cols-5 text-center">
                  {featured.timeline.map((step, idx) => {
                    const isCompleted = step.completed && !step.current;
                    const isCurrent = step.current;
                    const isFuture = !step.completed && !step.current;

                    return (
                      <div key={step.stage} className="flex flex-col items-center">
                        <div
                          className={`grid h-10 w-10 place-items-center rounded-full border-2 transition-all shadow-sm ${
                            isCompleted
                              ? "border-primary bg-primary text-primary-foreground"
                              : isCurrent
                              ? "border-gold bg-gold text-foreground ring-4 ring-gold/20 scale-110"
                              : "border-border bg-card text-muted-foreground"
                          }`}
                        >
                          {isCompleted ? (
                            <Check className="h-5 w-5 stroke-[2.5]" />
                          ) : isCurrent ? (
                            <Sparkles className="h-5 w-5 text-primary" />
                          ) : (
                            <span className="text-xs font-semibold">{idx + 1}</span>
                          )}
                        </div>

                        <p
                          className={`mt-3 text-xs font-bold ${
                            isCurrent
                              ? "text-primary"
                              : isCompleted
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </p>

                        <p className="mt-0.5 text-[0.68rem] text-muted-foreground">
                          {step.date || "Pending"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Vertical Stepper */}
              <div className="space-y-4 md:hidden">
                {featured.timeline.map((step, idx) => {
                  const isCompleted = step.completed && !step.current;
                  const isCurrent = step.current;

                  return (
                    <div key={step.stage} className="flex items-start gap-3">
                      <div
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border ${
                          isCompleted
                            ? "bg-primary text-primary-foreground border-primary"
                            : isCurrent
                            ? "bg-gold text-foreground border-gold ring-2 ring-gold/30"
                            : "bg-card text-muted-foreground border-border"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : isCurrent ? (
                          <Sparkles className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p
                            className={`text-xs font-bold ${
                              isCurrent ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {step.label}
                          </p>
                          <span className="text-[0.68rem] text-muted-foreground">
                            {step.date || "Pending"}
                          </span>
                        </div>
                        {isCurrent && (
                          <p className="mt-1 text-[0.72rem] text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200">
                            Practical workshop round scheduled for next week.
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Note box */}
            {featured.notes && (
              <div className="mt-6 rounded-2xl bg-secondary/70 p-4 border border-border/80 flex items-start gap-3">
                <Sparkles className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <p className="text-xs text-foreground/80 leading-relaxed">
                  <strong className="text-foreground font-semibold">HR Update:</strong> {featured.notes}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
