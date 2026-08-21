import {
  Award,
  BookOpen,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { VerificationCandidate } from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

interface VerificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: VerificationCandidate | null;
  onActionComplete?: () => void;
}

export function VerificationDetailModal({
  isOpen,
  onClose,
  candidate,
  onActionComplete,
}: VerificationDetailModalProps) {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleVerify = () => {
    setIsProcessing(true);
    setTimeout(() => {
      adminService.verifyUser(candidate.id);
      setIsProcessing(false);
      toast.success(`Verification approved for ${candidate.name} ✓`, {
        description: `Account status updated to VERIFIED. Notification sent.`,
      });
      onActionComplete?.();
      onClose();
    }, 400);
  };

  const handleReject = () => {
    setIsProcessing(true);
    setTimeout(() => {
      adminService.rejectUser(candidate.id, rejectionReason);
      setIsProcessing(false);
      toast.error(`Verification rejected for ${candidate.name}`, {
        description: "Rejection status recorded and user notified.",
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

          {/* Header Card */}
          <div className="flex items-start gap-4">
            <img
              src={candidate.avatar}
              alt={candidate.name}
              className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/20 shrink-0"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                  {candidate.name}
                </h3>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {candidate.role}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[0.68rem] font-bold ${
                    candidate.status === "VERIFIED"
                      ? "bg-emerald-600/15 text-emerald-800"
                      : candidate.status === "REJECTED"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-amber-500/15 text-amber-900"
                  }`}
                >
                  ● {candidate.status}
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  {candidate.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {candidate.phone}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {candidate.location}
                </span>
              </div>
            </div>
          </div>

          {/* Body Information according to Role */}
          <div className="mt-6 space-y-4 text-xs">
            {/* STUDENT DETAILS */}
            {candidate.role === "STUDENT" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3 rounded-2xl bg-secondary/40 p-4 border border-border/70">
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">ITI Institute</span>
                    <strong className="text-foreground">{candidate.iti}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Trade & Degree</span>
                    <strong className="text-primary">{candidate.trade} ({candidate.education})</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Experience & Age</span>
                    <strong className="text-foreground">{candidate.experience} · {candidate.age} yrs</strong>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-secondary/40 p-4 border border-border/70">
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Career Ambition</span>
                    <strong className="text-foreground">{candidate.careerGoal}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Preferred Industry & City</span>
                    <strong className="text-foreground">{candidate.preferredIndustry} ({candidate.preferredLocation})</strong>
                  </div>
                </div>

                {candidate.skills && candidate.skills.length > 0 && (
                  <div>
                    <span className="font-bold text-foreground block mb-1.5 uppercase text-[0.68rem] tracking-wider text-muted-foreground">
                      Reported Trade Skills
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.skills.map((s) => (
                        <span
                          key={s}
                          className="rounded-lg bg-card px-2.5 py-1 font-semibold text-foreground border border-border"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MENTOR DETAILS */}
            {candidate.role === "MENTOR" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-secondary/40 p-4 border border-border/70">
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Affiliated Organization</span>
                    <strong className="text-foreground">{candidate.organization}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Trade / Expertise Domain</span>
                    <strong className="text-primary">{candidate.expertise}</strong>
                  </div>
                </div>

                <div className="rounded-2xl bg-secondary/40 p-4 border border-border/70">
                  <span className="text-muted-foreground block text-[0.68rem]">Professional Bio</span>
                  <p className="mt-1 leading-relaxed text-foreground">{candidate.bio}</p>
                </div>
              </div>
            )}

            {/* RECRUITER DETAILS */}
            {candidate.role === "RECRUITER" && (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2 rounded-2xl bg-secondary/40 p-4 border border-border/70">
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Company / Entity</span>
                    <strong className="text-foreground">{candidate.companyName}</strong>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[0.68rem]">Industry Vertical</span>
                    <strong className="text-primary">{candidate.industry}</strong>
                  </div>
                </div>

                {candidate.website && (
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-secondary/40 border border-border/70">
                    <Globe className="h-4 w-4 text-primary" />
                    <a
                      href={candidate.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {candidate.website}
                    </a>
                  </div>
                )}

                {candidate.hiringFocus && candidate.hiringFocus.length > 0 && (
                  <div>
                    <span className="font-bold text-foreground block mb-1.5 uppercase text-[0.68rem] tracking-wider text-muted-foreground">
                      Hiring Focus Trades
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.hiringFocus.map((h) => (
                        <span
                          key={h}
                          className="rounded-lg bg-primary text-primary-foreground px-2.5 py-1 font-semibold"
                        >
                          {h}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rejection Mode Input */}
            {rejectMode && (
              <div className="rounded-2xl bg-destructive/10 p-4 border border-destructive/30 space-y-2">
                <label className="font-bold text-destructive text-xs block">
                  Reason for Rejection
                </label>
                <textarea
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Trade certificate is blurry or institute verification failed..."
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
              {candidate.status !== "REJECTED" && (
                <>
                  {!rejectMode ? (
                    <button
                      type="button"
                      onClick={() => setRejectMode(true)}
                      className="rounded-full border border-destructive/40 px-5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10"
                    >
                      Reject Request
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

              {candidate.status !== "VERIFIED" && (
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleVerify}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-700 px-6 py-2 text-xs font-semibold text-white shadow-lift hover:bg-emerald-800 disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isProcessing ? "Verifying..." : "Verify & Approve"}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
