import { Check, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export const ONBOARDING_STEPS = [
  { id: 1, label: "Account", shortDesc: "Name, Email & Phone", table: "users" },
  { id: 2, label: "About You", shortDesc: "Demographics & Location", table: "student_profiles" },
  { id: 3, label: "ITI & Education", shortDesc: "Trade & Experience", table: "student_profiles" },
  { id: 4, label: "Skills", shortDesc: "Trade Skills & Confidence", table: "student_skills" },
  { id: 5, label: "Career Goals", shortDesc: "Aspirations & Industry", table: "student_profiles" },
  { id: 6, label: "Interests", shortDesc: "Engineering Focus", table: "student_interests" },
  { id: 7, label: "Review", shortDesc: "Verification & Launch", table: "Complete" },
];

interface OnboardingProgressProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  maxStepReached: number;
  completionScore: number;
}

export function OnboardingProgress({
  currentStep,
  onStepClick,
  maxStepReached,
  completionScore,
}: OnboardingProgressProps) {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="eyebrow text-gold font-semibold">Your Registration</span>
        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
          {completionScore}% Profile
        </span>
      </div>

      {/* Step list */}
      <div className="space-y-2 pt-1">
        {ONBOARDING_STEPS.map((step) => {
          const isCompleted = step.id < currentStep;
          const isCurrent = step.id === currentStep;
          const isClickable = step.id <= maxStepReached;

          return (
            <div
              key={step.id}
              onClick={() => isClickable && onStepClick(step.id)}
              className={`group flex items-center gap-3 rounded-2xl p-2 transition-all ${
                isClickable ? "cursor-pointer" : "cursor-not-allowed opacity-50"
              } ${
                isCurrent
                  ? "bg-secondary/90 border border-primary/20 shadow-2xs"
                  : "hover:bg-secondary/40"
              }`}
            >
              <div
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl text-[0.72rem] font-bold transition-all ${
                  isCompleted
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : isCurrent
                    ? "bg-gold text-foreground ring-2 ring-gold/40 shadow-2xs font-bold"
                    : "bg-card text-muted-foreground border border-border"
                }`}
              >
                {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : `0${step.id}`}
              </div>

              <div className="flex-1 min-w-0">
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
                <p className="text-[0.65rem] text-muted-foreground truncate">
                  {step.shortDesc}
                </p>
              </div>

              {isCurrent && (
                <motion.div
                  layoutId="active-step-indicator-dot"
                  className="h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
