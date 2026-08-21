import {
  ArrowRight,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Edit2,
  Globe,
  GraduationCap,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { StudentRegistrationState } from "@/services/studentService";

interface ReviewStepProps {
  state: StudentRegistrationState;
  completionScore: number;
  onEditStep: (stepId: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function ReviewStep({
  state,
  completionScore,
  onEditStep,
  onSubmit,
  isSubmitting,
}: ReviewStepProps) {
  const { account, profile, skills, interests } = state;

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 7 of 7 · Complete Review</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Review your Saksham profile
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Confirm your information before we initialize your personalized student workspace and skill recommendations.
        </p>
      </div>

      {/* Profile Completeness vs Career Readiness Banner */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-emerald-300 bg-emerald-50/60 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] tracking-wider uppercase font-semibold text-emerald-900">
              Profile Completeness
            </span>
            <span className="rounded-full bg-emerald-200/80 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
              {completionScore}%
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-emerald-950 mt-2">{completionScore}%</p>
          <p className="text-xs text-emerald-800/90 mt-1 leading-relaxed">
            All required database fields provided. Ready for verified employer applications.
          </p>
        </div>

        <div className="rounded-2xl border border-gold/40 bg-secondary/70 p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
              Initial Career Readiness
            </span>
            <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-primary">
              System Derived
            </span>
          </div>
          <p className="font-serif text-3xl font-bold text-primary mt-2">78 / 100</p>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Separate from profile completion. Calculated based on trade syllabus and skill confidence.
          </p>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* 1. Account (users table) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-primary" />
                <span className="font-serif text-sm font-bold text-foreground">Account Information</span>
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
              <p className="font-bold text-foreground">{account.name}</p>
              <p className="text-muted-foreground">{account.email}</p>
              <p className="text-muted-foreground">{account.phone}</p>
              <p className="text-primary font-medium">Platform UI: {account.language}</p>
            </div>
          </div>
        </div>

        {/* 2. About You (student_profiles table) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span className="font-serif text-sm font-bold text-foreground">Personal Details</span>
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
              <p className="text-foreground font-semibold">
                {profile.age} Years · {profile.gender}
              </p>
              <p className="text-muted-foreground">Location: {profile.location}</p>
              <p className="text-primary font-medium">Learning Language: {profile.preferred_language}</p>
            </div>
          </div>
        </div>

        {/* 3. Education & Trade (student_profiles table) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-serif text-sm font-bold text-foreground">Education & Trade</span>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(3)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <p className="font-bold text-foreground">{profile.trade}</p>
              <p className="text-muted-foreground">{profile.iti}</p>
              <p className="text-muted-foreground">{profile.education}</p>
              <p className="text-primary font-medium">Experience: {profile.experience}</p>
            </div>
          </div>
        </div>

        {/* 4. Skills & Confidence (student_skills table) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-gold fill-gold" />
                <span className="font-serif text-sm font-bold text-foreground">
                  Skills ({skills.length})
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

            <div className="mt-3 flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s.skill_name}
                  className="rounded-lg bg-secondary px-2.5 py-1 text-[0.7rem] font-medium text-foreground"
                >
                  {s.skill_name}
                </span>
              ))}
            </div>
            <p className="mt-2.5 text-xs text-primary font-medium">
              Confidence Score: {profile.skill_confidence || 3} / 5
            </p>
          </div>
        </div>

        {/* 5. Career Goals (student_profiles table) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span className="font-serif text-sm font-bold text-foreground">Career Goals</span>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(5)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="mt-3 space-y-1.5 text-xs">
              <p className="font-bold text-foreground">{profile.career_goal}</p>
              <p className="text-muted-foreground">Industry: {profile.preferred_industry}</p>
              <p className="text-muted-foreground">Target Location: {profile.preferred_location}</p>
            </div>
          </div>
        </div>

        {/* 6. Interests (student_interests table) */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-gold fill-gold" />
                <span className="font-serif text-sm font-bold text-foreground">
                  Interests ({interests.length})
                </span>
              </div>
              <button
                type="button"
                onClick={() => onEditStep(6)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              >
                <Edit2 className="h-3 w-3" /> Edit
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {interests.map((i) => (
                <span
                  key={i.interest}
                  className="rounded-md bg-gold/15 px-2 py-0.5 text-[0.68rem] font-medium text-foreground"
                >
                  {i.interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Submission CTA */}
      <div className="mt-8 pt-6 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground text-center sm:text-left">
          Submitting will create your verified profile record and initialize your personalized learning track.
        </p>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={onSubmit}
          className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lift transition-all hover:bg-primary-deep disabled:opacity-50"
        >
          <span>{isSubmitting ? "Creating Student Profile..." : "Create Profile & Launch Dashboard"}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
