import { Calendar, CheckCircle2, Clock, Globe, MapPin, Sparkles, User, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Candidate, Opportunity } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate?: Candidate | null;
  opportunityId?: string;
  opportunities?: Opportunity[];
  onScheduledSuccess?: () => void;
}

export function ScheduleInterviewModal({
  isOpen,
  onClose,
  candidate,
  opportunityId,
  opportunities = [],
  onScheduledSuccess,
}: ScheduleInterviewModalProps) {
  const [selectedOppId, setSelectedOppId] = useState(
    opportunityId || candidate?.matchedOpportunityId || (opportunities[0]?.id ?? "opp-001")
  );
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("10:30 AM");
  const [mode, setMode] = useState<"IN_PERSON" | "ONLINE">("IN_PERSON");
  const [locationOrLink, setLocationOrLink] = useState(
    "Tata Motors Plant Gate 3, Chakan Industrial Area, Pune"
  );
  const [notes, setNotes] = useState(
    "Please bring original ITI National Trade Certificate (NTC) and safety shoes for shop-floor assessment."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !candidate) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time || !locationOrLink.trim()) {
      toast.error("Please fill in the interview date, time, and location/link.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      recruiterService.scheduleInterview({
        candidateId: candidate.id,
        opportunityId: selectedOppId,
        date,
        time,
        mode,
        locationOrLink,
        notes,
      });

      setIsSubmitting(false);
      toast.success("Interview invitation sent successfully ✓", {
        description: `Invitation sent to ${candidate.name} for ${date} at ${time}.`,
      });
      onScheduledSuccess?.();
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

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-border/80 bg-card p-6 sm:p-8 shadow-lift z-10 text-foreground"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="flex items-start gap-3.5 pr-8">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="eyebrow text-gold font-bold">Recruiter Action</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Schedule Candidate Interview
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Send a confirmed interview slot to candidate. Status will advance in hiring pipeline.
              </p>
            </div>
          </div>

          {/* Candidate Snapshot Card */}
          <div className="mt-5 rounded-2xl border border-gold/30 bg-gradient-to-r from-secondary/50 via-card to-gold/10 p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="h-11 w-11 rounded-full object-cover border border-primary/20"
              />
              <div>
                <p className="text-sm font-bold text-foreground">{candidate.name}</p>
                <p className="text-xs text-muted-foreground">
                  {candidate.trade} · {candidate.iti}
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-[0.7rem] font-bold text-emerald-800">
                {candidate.matchScore}% Match
              </span>
              <p className="text-[0.65rem] text-muted-foreground mt-1">
                Readiness: {candidate.careerReadinessScore}%
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
            {/* Position Select */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hiring Position / Opportunity
              </label>
              <select
                value={selectedOppId}
                onChange={(e) => setSelectedOppId(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
              >
                {opportunities.map((opp) => (
                  <option key={opp.id} value={opp.id}>
                    {opp.title} ({opp.location})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Time Grid */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Interview Date <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 pl-9 text-xs outline-none focus:border-primary"
                  />
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Interview Time <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 10:30 AM"
                    className="w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 pl-9 text-xs outline-none focus:border-primary"
                  />
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Interview Mode */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Interview Mode
              </label>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode("IN_PERSON");
                    setLocationOrLink("Tata Motors Plant Gate 3, Chakan Industrial Area, Pune");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-2xl p-2.5 font-semibold transition-all ${
                    mode === "IN_PERSON"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-secondary text-foreground border border-border hover:bg-beige"
                  }`}
                >
                  <MapPin className="h-3.5 w-3.5" />
                  <span>In-Person Shop Floor</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode("ONLINE");
                    setLocationOrLink("https://meet.google.com/tat-amtr-iti");
                  }}
                  className={`flex items-center justify-center gap-2 rounded-2xl p-2.5 font-semibold transition-all ${
                    mode === "ONLINE"
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-secondary text-foreground border border-border hover:bg-beige"
                  }`}
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span>Online Video Call</span>
                </button>
              </div>
            </div>

            {/* Location / Meeting Link */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {mode === "IN_PERSON" ? "Venue / Plant Location" : "Online Video Meeting URL"}{" "}
                <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={locationOrLink}
                onChange={(e) => setLocationOrLink(e.target.value)}
                placeholder={mode === "IN_PERSON" ? "Plant Address or Building Number" : "Google Meet / Zoom URL"}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            {/* Notes to Candidate */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Instructions / Practical Assessment Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What should the candidate prepare or bring along?"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-primary"
              />
            </div>

            {/* Footer buttons */}
            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:bg-beige"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                <span>{isSubmitting ? "Sending Invite..." : "Send Interview Invite"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
