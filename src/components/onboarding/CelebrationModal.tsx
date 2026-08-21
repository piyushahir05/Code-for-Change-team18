import { ArrowRight, CheckCircle2, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { StudentProfilePayload } from "@/services/studentService";

interface CelebrationModalProps {
  isOpen: boolean;
  profile: StudentProfilePayload;
  onProceed: () => void;
}

export function CelebrationModal({ isOpen, profile, onProceed }: CelebrationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop with blur & soft burgundy tint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-lg w-full overflow-hidden rounded-[2.5rem] border border-gold/50 bg-gradient-to-b from-card via-secondary/40 to-card p-8 sm:p-10 shadow-lift text-center z-10"
        >
          {/* Subtle gold ambient glow */}
          <div className="pointer-events-none absolute inset-0 bg-radial-gold opacity-30" />

          {/* Celebratory floating particles */}
          <div className="absolute top-6 left-8 text-gold animate-bounce">
            <Sparkles className="h-5 w-5 fill-current" />
          </div>
          <div className="absolute top-10 right-10 text-primary animate-pulse">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="absolute bottom-8 left-10 text-gold/70">
            <Sparkles className="h-4 w-4 fill-current" />
          </div>

          {/* Animated checkmark icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
            className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift ring-8 ring-gold/25"
          >
            <CheckCircle2 className="h-10 w-10 text-gold stroke-[2.5]" />
          </motion.div>

          <span className="eyebrow mt-6 inline-block text-gold font-bold">
            Profile Created Successfully
          </span>

          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Welcome, <span className="text-primary italic">{profile.full_name?.split(" ")[0] || "Aarav"}.</span>
          </h2>

          <p className="mt-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Your personalized Saksham workspace is ready. We've matched your{" "}
            <strong className="text-foreground">{profile.trade}</strong> profile with active apprenticeship
            drives and prioritized skill gaps.
          </p>

          <div className="mt-6 rounded-2xl bg-secondary/80 p-4 border border-border/80 text-xs flex items-center justify-around">
            <div>
              <span className="text-muted-foreground">Trade Profile</span>
              <p className="font-bold text-foreground mt-0.5">{profile.trade}</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="text-muted-foreground">Initial Readiness</span>
              <p className="font-bold text-primary mt-0.5">78 / 100</p>
            </div>
            <div className="h-8 w-px bg-border" />
            <div>
              <span className="text-muted-foreground">Priority Matches</span>
              <p className="font-bold text-emerald-700 mt-0.5">4 Verified</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onProceed}
            className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lift transition-all hover:bg-primary-deep"
          >
            <span>Launch My Student Dashboard</span>
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
