import { Building2, Check, MapPin, Sparkles, Target, Users, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

export const RECRUITER_ONBOARDING_STEPS = [
  { id: 1, label: "Identity & Sector", shortDesc: "Brand, Type & Sector", table: "recruiter_profiles", icon: Building2 },
  { id: 2, label: "Plants & Hubs", shortDesc: "HQ & Industrial Clusters", table: "locations", icon: MapPin },
  { id: 3, label: "Hiring Focus", shortDesc: "Trades & Annual Intake", table: "recruiter_profiles.expertise", icon: Target },
  { id: 4, label: "Workplace & Perks", shortDesc: "Facilities & HR Contact", table: "users & company", icon: Users },
  { id: 5, label: "Review & Launch", shortDesc: "Fair Hiring & Verification", table: "Verification", icon: ShieldCheck },
];

interface RecruiterOnboardingProgressProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  maxStepReached: number;
  completionScore: number;
}

export function RecruiterOnboardingProgress({
  currentStep,
  onStepClick,
  maxStepReached,
  completionScore,
}: RecruiterOnboardingProgressProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="eyebrow text-gold font-semibold">Industry Onboarding</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            Employer Partner
          </span>
        </div>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
          {completionScore}% Profile
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-secondary/80 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-primary via-emerald-600 to-gold"
          initial={{ width: 0 }}
          animate={{ width: `${completionScore}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Step list */}
      <div className="space-y-2 pt-1">
        {RECRUITER_ONBOARDING_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id <= maxStepReached;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`group flex items-center gap-3 rounded-2xl p-2.5 transition-all ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              } ${
                isCurrent
                  ? "bg-secondary/95 border border-primary/20 shadow-2xs"
                  : "hover:bg-secondary/40"
              }`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold transition-all ${
                  isCompleted
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : isCurrent
                    ? "bg-gold text-foreground ring-2 ring-gold/40 shadow-2xs font-bold"
                    : "bg-card text-muted-foreground border border-border"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : <Icon className="h-4 w-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p
                    className={`text-xs font-bold truncate ${
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                <p className="text-[0.68rem] text-muted-foreground truncate">
                  {step.shortDesc}
                </p>
              </div>

              {isCurrent && (
                <motion.div
                  layoutId="active-recruiter-step-dot"
                  className="h-2 w-2 rounded-full bg-primary animate-pulse"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
