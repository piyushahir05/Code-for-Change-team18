import { Award, BookOpen, Building2, Check, GraduationCap } from "lucide-react";
import { StudentProfilePayload } from "@/services/studentService";

interface ItiTradeStepProps {
  data: StudentProfilePayload;
  onChange: (updated: Partial<StudentProfilePayload>) => void;
  errors: Record<string, string>;
}

const ITI_LIST = [
  "ITI Pune (Ghole Road)",
  "ITI Aundh, Pune",
  "ITI Nashik",
  "ITI Aurangabad",
  "ITI Mumbai (Govandi)",
  "ITI Nagpur",
  "ITI Kolhapur",
  "ITI Pimpri-Chinchwad",
  "Other Recognized ITI",
];

const TRADE_LIST = [
  "Electrician",
  "Fitter",
  "Turner",
  "Welder",
  "Machinist",
  "Solar Technician",
  "Mechanic Motor Vehicle (MMV)",
  "Wireman",
  "Electronics Mechanic",
];

const EDUCATION_OPTIONS = [
  "10th Pass + ITI Ongoing",
  "10th Pass + ITI Certified",
  "12th Pass + ITI Certified",
  "Polytechnic Diploma Trainee",
];

const EXPERIENCE_OPTIONS = [
  { id: "Beginner", label: "Beginner", desc: "Currently in 1st/2nd year of ITI" },
  { id: "Less than 1 year", label: "< 1 Year", desc: "Recent graduate looking for apprentice role" },
  { id: "1–2 years", label: "1–2 Years", desc: "Prior apprenticeship or workshop experience" },
  { id: "2+ years", label: "2+ Years", desc: "Working technician looking for career upgrade" },
];

export function ItiTradeStep({ data, onChange, errors }: ItiTradeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 2 of 5</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Tell us about your ITI journey
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Your trade and institute help Saksham match you to employer hiring drives and trade-specific
          skill modules.
        </p>
      </div>

      <div className="space-y-4">
        {/* ITI Institute Select */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ITI Institute <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              value={data.iti || ""}
              onChange={(e) => onChange({ iti: e.target.value })}
              className={`w-full rounded-2xl border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                errors.iti ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Select your ITI Institute...</option>
              {ITI_LIST.map((iti) => (
                <option key={iti} value={iti}>
                  {iti}
                </option>
              ))}
            </select>
            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.iti && <p className="mt-1 text-xs text-destructive">{errors.iti}</p>}
        </div>

        {/* Trade Select */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Specialized ITI Trade <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              value={data.trade || ""}
              onChange={(e) => onChange({ trade: e.target.value })}
              className={`w-full rounded-2xl border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                errors.trade ? "border-destructive" : "border-border"
              }`}
            >
              <option value="">Select your trade...</option>
              {TRADE_LIST.map((trade) => (
                <option key={trade} value={trade}>
                  {trade}
                </option>
              ))}
            </select>
            <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.trade && <p className="mt-1 text-xs text-destructive">{errors.trade}</p>}
        </div>

        {/* Education background */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Current Education Status
          </label>
          <div className="relative mt-1.5">
            <select
              value={data.education || EDUCATION_OPTIONS[0]}
              onChange={(e) => onChange({ education: e.target.value })}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
            >
              {EDUCATION_OPTIONS.map((edu) => (
                <option key={edu} value={edu}>
                  {edu}
                </option>
              ))}
            </select>
            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Experience Level Cards */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Workshop & Practical Experience
          </label>
          <div className="mt-2 grid gap-2.5 sm:grid-cols-2">
            {EXPERIENCE_OPTIONS.map((exp) => {
              const isSelected = data.experience === exp.id;
              return (
                <div
                  key={exp.id}
                  onClick={() => onChange({ experience: exp.id })}
                  className={`flex items-start gap-3 rounded-2xl border p-3.5 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-secondary border-primary ring-1 ring-primary/30 shadow-2xs"
                      : "bg-card border-border hover:bg-beige"
                  }`}
                >
                  <div
                    className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      isSelected ? "bg-primary text-primary-foreground" : "border border-border bg-card text-transparent"
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-foreground">{exp.label}</p>
                    <p className="text-[0.68rem] text-muted-foreground mt-0.5">{exp.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
