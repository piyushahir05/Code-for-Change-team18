import { Award, BookOpen, Building2, Check, GraduationCap } from "lucide-react";
import { StudentProfileData } from "@/services/studentService";

interface ItiEducationStepProps {
  data: StudentProfileData;
  onChange: (updated: Partial<StudentProfileData>) => void;
  errors: Record<string, string>;
}

const ITI_LIST = [
  "Government ITI Pune (Ghole Road)",
  "Government ITI Aundh, Pune",
  "Government ITI Nashik",
  "Government ITI Aurangabad",
  "Government ITI Mumbai (Govandi)",
  "Government ITI Nagpur",
  "Government ITI Kolhapur",
  "Government ITI Pimpri-Chinchwad",
  "Private / Recognized ITI Center",
];

const TRADE_LIST = [
  "Electrician",
  "Fitter",
  "Welder",
  "Turner",
  "Machinist",
  "Mechanic Motor Vehicle (MMV)",
  "Solar Technician",
  "Wireman",
  "Electronics Mechanic",
  "COPA (Computer Operator)",
];

const EDUCATION_OPTIONS = [
  { id: "10th + ITI", label: "10th Standard + ITI" },
  { id: "12th + ITI", label: "12th Standard + ITI" },
  { id: "ITI", label: "ITI Certificate / Diploma" },
  { id: "Polytechnic", label: "Polytechnic / Diploma" },
];

const EXPERIENCE_OPTIONS = [
  { id: "Beginner", label: "Beginner", desc: "Currently in 1st/2nd year of ITI" },
  { id: "No prior work experience", label: "No prior work experience", desc: "Fresh graduate looking for first job" },
  { id: "Less than 1 year", label: "Less than 1 year", desc: "Completed a short internship or lab work" },
  { id: "1–2 years", label: "1–2 years", desc: "Completed apprenticeship or working technician" },
  { id: "2+ years", label: "2+ years", desc: "Experienced technician looking for career upgrade" },
];

export function ItiEducationStep({ data, onChange, errors }: ItiEducationStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 3 of 7 · Education & Trade</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Tell us about your education
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          This helps us match you with trade-specific apprenticeships, campus drives, and verified recruiter pools.
        </p>
      </div>

      <div className="space-y-4">
        {/* ITI Institute -> student_profiles.iti */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            ITI Institute <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              value={data.iti}
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

        {/* Trade -> student_profiles.trade */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Trade Specialization <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              value={data.trade}
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

        {/* Education -> student_profiles.education */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Education Qualification <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <select
              value={data.education || "ITI"}
              onChange={(e) => onChange({ education: e.target.value })}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
            >
              {EDUCATION_OPTIONS.map((edu) => (
                <option key={edu.id} value={edu.id}>
                  {edu.label}
                </option>
              ))}
            </select>
            <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Experience -> student_profiles.experience */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Practical Experience Level <span className="text-primary">*</span>
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
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-xs font-bold ${
                      isSelected ? "bg-primary text-primary-foreground" : "border border-border text-transparent"
                    }`}
                  >
                    <Check className="h-3 w-3" />
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
