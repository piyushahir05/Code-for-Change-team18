import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Clock,
  Flame,
  GraduationCap,
  PlayCircle,
  Sparkles,
  Target,
} from "lucide-react";
import { motion } from "motion/react";

interface NextStepCardProps {
  onStartLearning: () => void;
  onSeeRecommendations?: () => void;
}

export function NextStepCard({
  onStartLearning,
  onSeeRecommendations,
}: NextStepCardProps) {
  return (
    <section className="relative -mt-2 pb-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
          className="group relative overflow-hidden rounded-[2.2rem] border border-gold/35 bg-gradient-to-r from-card via-secondary/35 to-card p-6 shadow-soft transition-all duration-300 hover:border-gold/60 hover:shadow-lift sm:p-8 lg:p-10"
        >
          {/* Subtle gold ambient glow behind the card */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/20 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-60" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl transition-opacity duration-500 group-hover:opacity-100 opacity-50" />

          <div className="relative grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
            {/* Left side info */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 font-semibold text-primary">
                  <motion.span
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="inline-block"
                  >
                    <Sparkles className="h-3.5 w-3.5 text-gold fill-gold" />
                  </motion.span>
                  Your Next Best Step
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-800 border border-rose-200/80">
                  <Flame className="h-3.5 w-3.5 text-rose-600" />
                  High Impact on Readiness (+6%)
                </span>
              </div>

              <h2 className="mt-4 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Complete Workplace Communication
              </h2>

              <p className="mt-2.5 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
                <strong className="text-foreground font-medium">Why this now:</strong> Communication
                is one of the skills currently holding back your career-readiness score. Completing
                module 3 will unlock priority shortlisting for Apprenticeship roles.
              </p>

              {/* Meta tags */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-foreground/80">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-card px-3 py-1.5 border border-border/80 shadow-2xs">
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  Communication
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-card px-3 py-1.5 border border-border/80 shadow-2xs">
                  <Clock className="h-3.5 w-3.5 text-gold" />
                  6 hrs (2.5 hrs remaining)
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-card px-3 py-1.5 border border-border/80 shadow-2xs">
                  <Target className="h-3.5 w-3.5 text-emerald-600" />
                  Beginner Friendly
                </span>
              </div>
            </div>

            {/* Right side: Progress Bar & Direct CTAs */}
            <div className="flex flex-col justify-center rounded-2xl border border-border/70 bg-card/90 p-5 shadow-2xs sm:p-6">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-semibold text-foreground">Course Progress</span>
                <span className="font-bold text-primary">45% complete</span>
              </div>

              {/* Segmented Progress Track */}
              <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "45%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-deep shadow-sm"
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-[0.72rem] text-muted-foreground">
                <span>Module 2 of 5 completed</span>
                <span>Next: Shift Handover & Active Listening</span>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={onStartLearning}
                  className="group/btn flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-xs sm:text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary-deep hover:shadow-lift"
                >
                  <PlayCircle className="h-4 w-4" />
                  <span>Continue Learning</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={onSeeRecommendations}
                  className="rounded-full border border-border px-4 py-3 text-xs sm:text-sm font-semibold text-muted-foreground transition-colors hover:bg-beige hover:text-foreground"
                >
                  See all recommendations
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
