import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AboutYouStep } from "@/components/onboarding/AboutYouStep";
import { CareerGoalsStep } from "@/components/onboarding/CareerGoalsStep";
import { CelebrationModal } from "@/components/onboarding/CelebrationModal";
import { CreateAccountStep } from "@/components/onboarding/CreateAccountStep";
import { InterestsStep } from "@/components/onboarding/InterestsStep";
import { ItiEducationStep } from "@/components/onboarding/ItiEducationStep";
import { OnboardingProgress, ONBOARDING_STEPS } from "@/components/onboarding/OnboardingProgress";
import { ReviewStep } from "@/components/onboarding/ReviewStep";
import { SkillsStep } from "@/components/onboarding/SkillsStep";
import {
  calculateProfileCompletion,
  INITIAL_REGISTRATION_STATE,
  StudentRegistrationState,
  studentService,
} from "@/services/studentService";

export const Route = createFileRoute("/student/onboarding")({
  head: () => ({
    meta: [
      { title: "Student Onboarding · Saksham | Y4D Foundation" },
      {
        name: "description",
        content: "Complete your 7-step Saksham profile to personalize ITI trade learning, skill gaps, and verified placements.",
      },
    ],
  }),
  component: StudentOnboardingPage,
});

function StudentOnboardingPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [state, setState] = useState<StudentRegistrationState>(() => studentService.getDraft());
  const [confirmPassword, setConfirmPassword] = useState(state.account.password || "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const completionScore = calculateProfileCompletion(state);

  const handleUpdateAccount = (updated: Partial<StudentRegistrationState["account"]>) => {
    setState((prev) => {
      const next = { ...prev, account: { ...prev.account, ...updated } };
      studentService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const handleUpdateProfile = (updated: Partial<StudentRegistrationState["profile"]>) => {
    setState((prev) => {
      const next = { ...prev, profile: { ...prev.profile, ...updated } };
      studentService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const handleUpdateSkills = (skills: StudentRegistrationState["skills"]) => {
    setState((prev) => {
      const next = { ...prev, skills };
      studentService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const handleUpdateInterests = (interests: StudentRegistrationState["interests"]) => {
    setState((prev) => {
      const next = { ...prev, interests };
      studentService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!state.account.name.trim()) errs.name = "Full name is required.";
      if (!state.account.email.trim() || !state.account.email.includes("@")) {
        errs.email = "A valid email address is required.";
      }
      if (!state.account.phone.trim() || state.account.phone.length < 10) {
        errs.phone = "A valid mobile number is required.";
      }
      if (state.account.password && state.account.password.length < 6) {
        errs.password = "Password must be at least 6 characters.";
      }
      if (state.account.password && state.account.password !== confirmPassword) {
        errs.confirmPassword = "Passwords do not match.";
      }
    } else if (step === 2) {
      if (!state.profile.age || Number(state.profile.age) < 14) {
        errs.age = "Please enter a valid age (15+).";
      }
      if (!state.profile.location.trim()) {
        errs.location = "Current location is required.";
      }
    } else if (step === 3) {
      if (!state.profile.iti.trim()) errs.iti = "Please select your ITI Institute.";
      if (!state.profile.trade.trim()) errs.trade = "Please select your trade.";
    } else if (step === 4) {
      if (state.skills.length === 0) {
        errs.skills = "Please select at least one skill you're comfortable with.";
      }
    } else if (step === 5) {
      if (!state.profile.career_goal.trim()) {
        errs.career_goal = "Target career goal is required.";
      }
      if (!state.profile.preferred_location.trim()) {
        errs.preferred_location = "Preferred work location is required.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill in the required fields to continue.");
      return;
    }

    if (currentStep < 7) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setIsSubmitting(true);
      await studentService.createProfile(state);
      setShowCelebration(true);
    } catch (e) {
      toast.error("We couldn't save your profile right now.", {
        description: "Your information is preserved. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = Math.round(((currentStep - 1) / (ONBOARDING_STEPS.length - 1)) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-xl px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-serif text-base text-primary-foreground shadow-2xs">
              S
            </span>
            <span className="font-serif text-xl font-bold tracking-tight text-primary">
              Saksham
            </span>
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="text-muted-foreground">
              Step {currentStep} of {ONBOARDING_STEPS.length}
            </span>
            <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[0.68rem] font-bold text-foreground">
              {progressPercentage}%
            </span>
          </div>

          <Link
            to="/login"
            className="text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
          >
            Save & Exit
          </Link>
        </div>

        {/* Top Animated Progress Bar */}
        <div className="absolute inset-x-0 bottom-0 h-1 bg-secondary">
          <motion.div
            className="h-full bg-gradient-to-r from-gold to-primary"
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 py-6 px-4 sm:px-6 lg:py-10">
        <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Left Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft">
                <OnboardingProgress
                  currentStep={currentStep}
                  maxStepReached={maxStepReached}
                  completionScore={completionScore}
                  onStepClick={(s) => setCurrentStep(s)}
                />
              </div>

              {/* Dynamic Live Profile Preview Card */}
              <div className="rounded-[2.2rem] border border-gold/30 bg-gradient-to-b from-card via-secondary/30 to-card p-5 shadow-2xs text-xs space-y-3">
                <div className="flex items-center gap-2 text-primary font-bold">
                  <UserCheck className="h-4 w-4 text-gold" />
                  <span>Live Schema Preview</span>
                </div>
                <div className="space-y-1 text-muted-foreground">
                  <p className="font-semibold text-foreground">{state.account.name || "Aarav Sharma"}</p>
                  <p>{state.profile.trade || "Electrician"} · {state.profile.iti || "Government ITI Pune"}</p>
                  <p>{state.profile.location || "Pune, Maharashtra"}</p>
                </div>
                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-[0.68rem]">
                  <span>Target Goal:</span>
                  <span className="font-bold text-foreground truncate max-w-[120px]">
                    {state.profile.career_goal || "Industrial Electrician"}
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Right Form Card */}
          <div className="flex flex-col justify-between">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-10 shadow-soft"
            >
              {currentStep === 1 && (
                <CreateAccountStep
                  data={state.account}
                  onChange={handleUpdateAccount}
                  confirmPassword={confirmPassword}
                  onConfirmPasswordChange={setConfirmPassword}
                  errors={errors}
                />
              )}
              {currentStep === 2 && (
                <AboutYouStep
                  data={state.profile}
                  onChange={handleUpdateProfile}
                  errors={errors}
                />
              )}
              {currentStep === 3 && (
                <ItiEducationStep
                  data={state.profile}
                  onChange={handleUpdateProfile}
                  errors={errors}
                />
              )}
              {currentStep === 4 && (
                <SkillsStep
                  skills={state.skills}
                  onSkillsChange={handleUpdateSkills}
                  skillConfidence={state.profile.skill_confidence}
                  onSkillConfidenceChange={(c) => handleUpdateProfile({ skill_confidence: c })}
                  error={errors.skills}
                />
              )}
              {currentStep === 5 && (
                <CareerGoalsStep
                  data={state.profile}
                  onChange={handleUpdateProfile}
                  errors={errors}
                />
              )}
              {currentStep === 6 && (
                <InterestsStep
                  interests={state.interests}
                  onInterestsChange={handleUpdateInterests}
                />
              )}
              {currentStep === 7 && (
                <ReviewStep
                  state={state}
                  completionScore={completionScore}
                  onEditStep={(stepId) => setCurrentStep(stepId)}
                  onSubmit={handleFinalSubmit}
                  isSubmitting={isSubmitting}
                />
              )}

              {/* Step Navigation Buttons for Steps 1 - 6 */}
              {currentStep < 7 && (
                <div className="mt-10 pt-6 border-t border-border/60 flex items-center justify-between gap-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-beige transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      <span>Back</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    type="button"
                    onClick={handleNext}
                    className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-soft hover:bg-primary-deep hover:shadow-lift transition-all"
                  >
                    <span>Continue</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Celebration Modal on Final Profile Creation */}
      <CelebrationModal
        isOpen={showCelebration}
        profile={{
          full_name: state.account.name,
          trade: state.profile.trade,
          age: state.profile.age || 20,
          gender: state.profile.gender,
          location: state.profile.location,
          iti: state.profile.iti,
          education: state.profile.education,
          experience: state.profile.experience,
          career_goal: state.profile.career_goal,
          preferred_industry: state.profile.preferred_industry,
          preferred_location: state.profile.preferred_location,
          skill_confidence: state.profile.skill_confidence || 3,
          preferred_language: state.profile.preferred_language,
          skills: state.skills,
          interests: state.interests,
        }}
        onProceed={() => {
          setShowCelebration(false);
          toast.success("Profile created! Welcome to your Saksham workspace.");
          navigate({ to: "/student/dashboard" });
        }}
      />

      <footer className="py-4 text-center text-xs text-muted-foreground">
        Powered by Y4D Foundation · Database-Aligned ITI Employability Ecosystem
      </footer>
    </div>
  );
}
