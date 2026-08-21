import { Check, Heart, Sparkles } from "lucide-react";
import { StudentInterestInput } from "@/services/studentService";

interface InterestsStepProps {
  interests: StudentInterestInput[];
  onInterestsChange: (interests: StudentInterestInput[]) => void;
}

const INTEREST_OPTIONS = [
  "Automation",
  "Machines",
  "Electrical Systems",
  "Technology",
  "Maintenance",
  "Problem Solving",
  "Hands-on Work",
  "Manufacturing",
  "Building Things",
  "Safety Standards",
  "Renewable Energy",
  "Electronics",
];

export function InterestsStep({ interests, onInterestsChange }: InterestsStepProps) {
  const selectedInterestNames = new Set(interests.map((i) => i.interest));

  const toggleInterest = (interestName: string) => {
    if (selectedInterestNames.has(interestName)) {
      onInterestsChange(interests.filter((i) => i.interest !== interestName));
    } else {
      onInterestsChange([...interests, { interest: interestName }]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 6 of 7 · Technical Interests</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          What interests you?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Select areas of engineering and practical curiosity. We'll use these to recommend peer
          circles and specialized electives.
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Select Your Interests (P1)
          </label>
          <span className="text-xs font-bold text-primary">{interests.length} Selected</span>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {INTEREST_OPTIONS.map((item) => {
            const isSelected = selectedInterestNames.has(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => toggleInterest(item)}
                className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-gold text-foreground border border-gold/60 shadow-2xs scale-102 font-bold ring-1 ring-gold/30"
                    : "bg-card text-foreground/80 border border-border hover:bg-beige hover:border-gold/40"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isSelected ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-muted-foreground bg-secondary/50 p-3.5 rounded-2xl border border-border/60">
          Tip: You can change or expand your interests anytime from your profile settings.
        </p>
      </div>
    </div>
  );
}
