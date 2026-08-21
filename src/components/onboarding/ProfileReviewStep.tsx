import {
  ArrowRight,
  Award,
  Check,
  CheckCircle2,
  Clock,
  Edit2,
  GraduationCap,
  Heart,
  MapPin,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Counter } from "@/components/site/motion-primitives";
import { StudentProfilePayload } from "@/services/studentService";

interface ProfileReviewStepProps {
  data: StudentProfilePayload;
  onEditStep: (stepId: number) => void;
  onSubmitProfile: () => void;
  isSubmitting: boolean;
}

export function ProfileReviewStep({
  data,
  onEditStep,
  onSubmitProfile,
  isSubmitting,
}: ProfileReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 5 of 5 · Final Verification</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Your Saksham profile is ready.
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Review your trade details before we calculate your initial career-readiness and personalize
          your dashboard.
        </p>
      </div>

      {/* 100% Completeness Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="rounded-[2.2rem] border border-gold/40 bg-gradient-to-br from-card via-secondary/40 to-gold/10 p-6 sm:p-7 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left"
      >
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground shadow-lift shrink-0">
            <CheckCircle2 className="h-8 w-8 text-gold" />
          </div>
          <div>
            <span className="eyebrow text-primary font-bold">Ready for Opportunities</span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-0.5">
              100% Profile Completeness
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Eligible for priority employer shortlisting and verified 1-on-1 mentorship.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-card/90 px-5 py-3 border border-border text-center shadow-2xs">
          <span className="text-[0.65rem] tracking-wider uppercase font-semibold text-muted-foreground">
            Estimated Readiness
          </span>
          <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">78%</p>
        </div>
      </motion.div>

      {/* Summary Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 1. About You */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-serif text-sm font-bold text-foreground">About You</span>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(1)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <p className="font-bold text-foreground">{data.full_name || "Aarav Sharma"}</p>
              <p className="text-muted-foreground">
                {data.age} Years · {data.gender}
              </p>
              <p className="text-muted-foreground">{data.location}</p>
              <p className="text-muted-foreground font-medium">Language: {data.preferred_language}</p>
            </div>
          </div>
        </div>

        {/* 2. ITI & Trade */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-serif text-sm font-bold text-foreground">ITI & Trade</span>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(2)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <p className="font-bold text-foreground">{data.trade}</p>
              <p className="text-muted-foreground">{data.iti}</p>
              <p className="text-muted-foreground">{data.education}</p>
              <p className="text-primary font-semibold">Experience: {data.experience}</p>
            </div>
          </div>
        </div>

        {/* 3. Skills */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold fill-gold" />
                <span className="font-serif text-sm font-bold text-foreground">
                  Skills ({data.skills.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {data.skills.map((s) => (
                <span
                  key={s.skill_name}
                  className="rounded-lg bg-secondary px-2.5 py-1 text-[0.7rem] font-medium text-foreground"
                >
                  {s.skill_name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Career Goal & Interests */}
        <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-serif text-sm font-bold text-foreground">
                  Career Aspirations
                </span>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(4)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <p className="font-bold text-foreground">Target: {data.career_goal}</p>
              <p className="text-muted-foreground">Industry: {data.preferred_industry}</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {data.interests.map((i) => (
                  <span
                    key={i.interest}
                    className="rounded-md bg-gold/15 px-2 py-0.5 text-[0.65rem] font-medium text-foreground"
                  >
                    {i.interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation & Final CTA */}
      <div className="mt-6 pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Clicking finish will initialize your personal Saksham dashboard with tailored skill gap modules.
        </p>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmitProfile}
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lift transition-all hover:bg-primary-deep disabled:opacity-50"
        >
          <span>{isSubmitting ? "Building Your Dashboard..." : "Go to My Dashboard"}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
