import { ArrowRight, CheckCircle2, UserCheck } from "lucide-react";
import { motion } from "motion/react";
import { StudentProfile } from "./student-data";

interface ProfileCompletionCardProps {
  profile: StudentProfile;
  onCompleteProfile: () => void;
}

export function ProfileCompletionCard({
  profile,
  onCompleteProfile,
}: ProfileCompletionCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-[2.2rem] border border-gold/35 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-7 shadow-soft">
      <div>
        <div className="flex items-center justify-between">
          <span className="eyebrow text-gold font-semibold">Profile Strength</span>
          <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-foreground">
            {profile.profileCompletion}% Complete
          </span>
        </div>

        <h3 className="mt-4 font-serif text-xl sm:text-2xl font-bold text-foreground">
          Complete your profile
        </h3>

        {/* Progress Bar */}
        <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${profile.profileCompletion}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-gold to-primary"
          />
        </div>

        {/* Missing fields info */}
        <div className="mt-4 space-y-2">
          <p className="text-xs font-semibold text-foreground/80">Pending details:</p>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {profile.missingProfileFields.map((field) => (
              <li key={field} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                <span>{field}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/60">
        <p className="text-[0.72rem] text-muted-foreground mb-3 leading-relaxed">
          A complete profile helps Saksham match you with verified employer drives in Pune.
        </p>
        <button
          type="button"
          onClick={onCompleteProfile}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-deep shadow-2xs"
        >
          <span>Complete Profile</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}
