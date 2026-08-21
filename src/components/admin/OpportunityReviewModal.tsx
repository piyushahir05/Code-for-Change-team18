import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { AdminOpportunity } from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

interface OpportunityReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity?: AdminOpportunity | null;
  onActionComplete?: () => void;
}

export function OpportunityReviewModal({
  isOpen,
  onClose,
  opportunity,
  onActionComplete,
}: OpportunityReviewModalProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !opportunity) return null;

  const handleApprove = () => {
    setIsProcessing(true);
    setTimeout(() => {
      adminService.approveOpportunity(opportunity.id);
      setIsProcessing(false);
      toast.success("Opportunity approved successfully ✓", {
        description: `'${opportunity.title}' is now live on the Student Portal.`,
      });
      onActionComplete?.();
      onClose();
    }, 400);
  };

  const handleReject = () => {
    setIsProcessing(true);
    setTimeout(() => {
      adminService.rejectOpportunity(opportunity.id, rejectionReason);
      setIsProcessing(false);
      toast.error("Opportunity rejected", {
        description: "Rejection status recorded and recruiter notified.",
      });
      onActionComplete?.();
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2rem] border border-border/80 bg-card p-6 sm:p-8 shadow-lift z-10 text-foreground"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Briefcase className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {opportunity.type.replace(/_/g, " ")}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold ${
                    opportunity.status === "APPROVED"
                      ? "bg-emerald-600/15 text-emerald-800"
                      : opportunity.status === "REJECTED"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-amber-500/15 text-amber-900"
                  }`}
                >
                  ● {opportunity.status}
                </span>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground mt-1.5">
                {opportunity.title}
              </h3>

              <p className="text-xs sm:text-sm font-semibold text-primary mt-0.5">
                {opportunity.company} · {opportunity.location}
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="mt-6 space-y-4 text-xs">
            <div className="grid gap-3 sm:grid-cols-3 rounded-2xl bg-secondary/40 p-4 border border-border/70">
              <div>
                <span className="text-muted-foreground block text-[0.68rem]">Target ITI Trade</span>
                <strong className="text-foreground">{opportunity.trade}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[0.68rem]">Stipend / Salary</span>
                <strong className="text-primary">{opportunity.salaryStipend}</strong>
              </div>
              <div>
                <span className="text-muted-foreground block text-[0.68rem]">Application Deadline</span>
                <strong className="text-foreground">{opportunity.deadline}</strong>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-secondary/40 p-4 border border-border/70">
              <div>
                <span className="text-muted-foreground block text-[0.68rem]">Eligibility Requirement</span>
                <p className="mt-0.5 text-foreground leading-relaxed">{opportunity.eligibility}</p>
              </div>
              <div>
                <span className="text-muted-foreground block text-[0.68rem]">Experience Level</span>
                <p className="mt-0.5 text-foreground leading-relaxed">{opportunity.experience}</p>
              </div>
            </div>

            <div className="rounded-2xl bg-secondary/40 p-4 border border-border/70">
              <span className="text-muted-foreground block text-[0.68rem]">Requirement Description</span>
              <p className="mt-1 leading-relaxed text-foreground">{opportunity.description}</p>
            </div>

            {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
              <div>
                <span className="font-bold text-foreground block mb-1.5 uppercase text-[0.68rem] tracking-wider text-muted-foreground">
                  Required Practical Trade Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {opportunity.requiredSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-primary text-primary-foreground px-2.5 py-1 font-semibold text-[0.7rem]"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rejection Form */}
            {rejectMode && (
              <div className="rounded-2xl bg-destructive/10 p-4 border border-destructive/30 space-y-2">
                <label className="font-bold text-destructive text-xs block">
                  Reason for Opportunity Rejection
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Stipend below government NAPS minimum, or unsafe working condition..."
                  className="w-full rounded-xl border border-destructive/30 bg-background p-2 text-xs outline-none focus:border-destructive"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:bg-beige"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {opportunity.status !== "REJECTED" && (
                <>
                  {!rejectMode ? (
                    <button
                      type="button"
                      onClick={() => setRejectMode(true)}
                      className="rounded-full border border-destructive/40 px-5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                    >
                      Reject Opportunity
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleReject}
                      className="rounded-full bg-destructive px-5 py-2 text-xs font-semibold text-white hover:bg-destructive/90 disabled:opacity-50"
                    >
                      Confirm Rejection
                    </button>
                  )}
                </>
              )}

              {opportunity.status !== "APPROVED" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleApprove}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-6 py-2 text-xs font-semibold text-white shadow-lift hover:bg-emerald-800 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{isProcessing ? "Approving..." : "Approve Opportunity"}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
