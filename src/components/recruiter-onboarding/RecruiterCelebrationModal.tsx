import { ArrowRight, Briefcase, CheckCircle2, Search, Sparkles, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "@tanstack/react-router";
import { RecruiterRegistrationState } from "@/services/recruiterService";

interface RecruiterCelebrationModalProps {
  state: RecruiterRegistrationState;
  isOpen: boolean;
  onClose: () => void;
}

export function RecruiterCelebrationModal({
  state,
  isOpen,
  onClose,
}: RecruiterCelebrationModalProps) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAction = (path: string) => {
    onClose();
    navigate({ to: path });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-xs animate-fade-in">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-lift space-y-6 text-center"
      >
        {/* Animated Celebration Icon */}
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-linear-to-br from-primary to-emerald-600 text-white shadow-lift">
          <Sparkles className="h-8 w-8 animate-spin-slow" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-500/20 mb-2">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Employer Profile Activated</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif text-primary">
            Welcome to Saksham, {state.organization.companyName || "Partner"}!
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Your recruiter workspace is ready. You can now discover verified ITI candidates, post apprenticeships, and schedule direct interviews.
          </p>
        </div>

        {/* Action Options */}
        <div className="grid gap-3 text-left">
          <button
            type="button"
            onClick={() => handleAction("/recruiter/dashboard")}
            className="flex items-center justify-between p-4 rounded-2xl border border-primary/20 bg-secondary/80 hover:bg-secondary text-primary font-bold text-xs sm:text-sm transition-all cursor-pointer group shadow-2xs"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-bold">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-foreground font-bold">Open Recruiter Dashboard</p>
                <p className="text-[11px] text-muted-foreground font-normal">
                  View applicant pipeline, metrics & smart matches
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleAction("/recruiter/talent")}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 text-foreground font-bold text-xs sm:text-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gold-soft text-primary font-bold">
                <Search className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-foreground font-bold">Search Verified ITI Talent Pool</p>
                <p className="text-[11px] text-muted-foreground font-normal">
                  Filter Electricians, Fitters & Welders by readiness score
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => handleAction("/recruiter/opportunities/new")}
            className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card hover:bg-secondary/40 text-foreground font-bold text-xs sm:text-sm transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-700 font-bold">
                <Briefcase className="h-4 w-4 text-emerald-700" />
              </div>
              <div>
                <p className="text-foreground font-bold">Post New ITI Opportunity</p>
                <p className="text-[11px] text-muted-foreground font-normal">
                  Create an apprenticeship or job posting in 2 minutes
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}
