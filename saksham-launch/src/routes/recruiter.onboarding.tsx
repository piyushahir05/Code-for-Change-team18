import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  HelpCircle,
  Save,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CompanyCultureStep } from "@/components/recruiter-onboarding/CompanyCultureStep";
import { HiringFocusStep } from "@/components/recruiter-onboarding/HiringFocusStep";
import { LocationStep } from "@/components/recruiter-onboarding/LocationStep";
import { OrgIdentityStep } from "@/components/recruiter-onboarding/OrgIdentityStep";
import { RecruiterCelebrationModal } from "@/components/recruiter-onboarding/RecruiterCelebrationModal";
import {
  RecruiterOnboardingProgress,
  RECRUITER_ONBOARDING_STEPS,
} from "@/components/recruiter-onboarding/RecruiterOnboardingProgress";
import { RecruiterReviewStep } from "@/components/recruiter-onboarding/RecruiterReviewStep";
import {
  calculateRecruiterProfileCompletion,
  INITIAL_RECRUITER_REGISTRATION_STATE,
  RecruiterRegistrationState,
  recruiterService,
} from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/onboarding")({
  head: () => ({
    meta: [
      { title: "Recruiter & Industry Onboarding · Saksham | Y4D Foundation" },
      {
        name: "description",
        content:
          "Complete your 5-step Saksham Industry Partner profile to recruit verified ITI trainees, apprentices, and shopfloor technicians.",
      },
    ],
  }),
  component: RecruiterOnboardingPage,
});

function RecruiterOnboardingPage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxStepReached, setMaxStepReached] = useState(1);
  const [state, setState] = useState<RecruiterRegistrationState>(() => recruiterService.getDraft());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const completionScore = calculateRecruiterProfileCompletion(state);

  const handleUpdateOrg = (updated: Partial<RecruiterRegistrationState["organization"]>) => {
    setState((prev) => {
      const next = { ...prev, organization: { ...prev.organization, ...updated } };
      recruiterService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const handleUpdateLocations = (updated: Partial<RecruiterRegistrationState["locations"]>) => {
    setState((prev) => {
      const next = { ...prev, locations: { ...prev.locations, ...updated } };
      recruiterService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const handleUpdateHiringFocus = (updated: Partial<RecruiterRegistrationState["hiringFocus"]>) => {
    setState((prev) => {
      const next = { ...prev, hiringFocus: { ...prev.hiringFocus, ...updated } };
      recruiterService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const handleUpdateAccount = (updated: Partial<RecruiterRegistrationState["account"]>) => {
    setState((prev) => {
      const next = { ...prev, account: { ...prev.account, ...updated } };
      recruiterService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const handleUpdateCulture = (updated: Partial<RecruiterRegistrationState["cultureAndPerks"]>) => {
    setState((prev) => {
      const next = { ...prev, cultureAndPerks: { ...prev.cultureAndPerks, ...updated } };
      recruiterService.saveDraft(next);
      return next;
    });
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!state.organization.companyName.trim()) errs.companyName = "Company name is required.";
      if (!state.organization.industry.trim()) errs.industry = "Please select your primary industry sector.";
      if (!state.organization.website.trim()) errs.website = "Official company website is required.";
    }

    if (step === 2) {
      if (!state.locations.headquartersCity.trim()) errs.headquartersCity = "Headquarters city is required.";
      if (!state.locations.industrialCluster.trim()) errs.industrialCluster = "Please specify an industrial zone/cluster.";
    }

    if (step === 3) {
      if (state.hiringFocus.trades.length === 0) errs.trades = "Please select at least 1 preferred ITI trade.";
      if (state.hiringFocus.hiringTypes.length === 0) errs.hiringTypes = "Please select at least 1 hiring engagement model.";
    }

    if (step === 4) {
      if (state.cultureAndPerks.benefits.length === 0) errs.benefits = "Please select at least 1 benefit offered to trainees.";
      if (!state.account.name.trim()) errs.name = "Authorized contact person name is required.";
      if (!state.account.email.trim() || !state.account.email.includes("@")) errs.email = "Valid official email is required.";
      if (!state.account.phone.trim() || state.account.phone.length < 10) errs.phone = "Valid 10-digit phone is required.";
    }

    if (step === 5) {
      if (!state.cultureAndPerks.fairHiringPledge) {
        errs.pledge = "Please accept the Saksham Fair Hiring & Apprentice Safety Pledge.";
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      toast.error("Please fill required fields to continue.");
      return;
    }

    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      setMaxStepReached((prev) => Math.max(prev, nextStep));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleStepClick = (stepId: number) => {
    if (stepId <= maxStepReached) {
      setCurrentStep(stepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSaveDraft = () => {
    recruiterService.saveDraft(state);
    toast.success("Registration Draft Saved", {
      description: "You can resume your onboarding anytime from this browser.",
    });
  };

  const handleComplete = async () => {
    try {
      setIsSubmitting(true);
      // Synchronize into recruiter company profile & mock auth session
      recruiterService.completeOnboarding(state);
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsSubmitting(false);
      setShowCelebration(true);
      toast.success("Organization Profile Activated!", {
        description: `Welcome ${state.organization.companyName} to Saksham.`,
      });
    } catch (e) {
      setIsSubmitting(false);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-grain pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-cream/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Role Selection</span>
            </Link>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <span className="grid h-7 w-7 place-items-center rounded-xl bg-primary font-serif text-sm font-bold text-primary-foreground">
                S
              </span>
              <span className="text-xs sm:text-sm font-bold text-foreground">
                Saksham <span className="font-normal text-muted-foreground">Employer Onboarding</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all cursor-pointer"
            >
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Save Draft</span>
            </button>
            <Link
              to="/recruiter/dashboard"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/20 bg-secondary/80 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <span>Skip to Demo Dashboard</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8">
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Sidebar: Step Indicator */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-20 space-y-4 rounded-3xl border border-border bg-card p-5 shadow-xs">
              <RecruiterOnboardingProgress
                currentStep={currentStep}
                onStepClick={handleStepClick}
                maxStepReached={maxStepReached}
                completionScore={completionScore}
              />

              {/* Employer Value Callout */}
              <div className="rounded-2xl border border-gold/30 bg-gold-soft/30 p-3.5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-deep">
                  <Sparkles className="h-4 w-4 text-gold" />
                  <span>Why Saksham for Industry?</span>
                </div>
                <ul className="text-[11px] text-muted-foreground space-y-1 pl-4 list-disc">
                  <li>Direct pipeline to verified ITI students</li>
                  <li>Skill-readiness scores & trade testing</li>
                  <li>Zero placement fees for social impact</li>
                  <li>NAPS/NATS compliance assistance</li>
                </ul>
              </div>
            </div>
          </aside>

          {/* Right Main Content: Active Step Form */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
              {currentStep === 1 && (
                <OrgIdentityStep state={state} onUpdate={handleUpdateOrg} errors={errors} />
              )}
              {currentStep === 2 && (
                <LocationStep state={state} onUpdate={handleUpdateLocations} errors={errors} />
              )}
              {currentStep === 3 && (
                <HiringFocusStep state={state} onUpdate={handleUpdateHiringFocus} errors={errors} />
              )}
              {currentStep === 4 && (
                <CompanyCultureStep
                  state={state}
                  onUpdateAccount={handleUpdateAccount}
                  onUpdateCulture={handleUpdateCulture}
                  errors={errors}
                />
              )}
              {currentStep === 5 && (
                <RecruiterReviewStep
                  state={state}
                  onUpdateOrg={handleUpdateOrg}
                  onUpdateCulture={handleUpdateCulture}
                  onNavigateStep={handleStepClick}
                  errors={errors}
                />
              )}

              {/* Navigation Footer Controls */}
              <div className="mt-8 flex items-center justify-between border-t border-border pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card px-5 py-2.5 text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    Step {currentStep} of 5
                  </span>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground hover:bg-primary-deep transition-all shadow-lift cursor-pointer disabled:opacity-50"
                  >
                    {currentStep === 5 ? (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Activate Employer Profile</span>
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Completion Modal */}
      <RecruiterCelebrationModal
        state={state}
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
      />
    </div>
  );
}
