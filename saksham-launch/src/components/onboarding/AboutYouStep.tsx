import { BookOpen, Globe, MapPin, User } from "lucide-react";
import { StudentProfileData } from "@/services/studentService";

interface AboutYouStepProps {
  data: StudentProfileData;
  onChange: (updated: Partial<StudentProfileData>) => void;
  errors: Record<string, string>;
}

const GENDER_OPTIONS = ["Male", "Female", "Other / Prefer not to say"];

const LEARNING_LANGUAGES = [
  { id: "Hindi", label: "हिंदी (Hindi)", desc: "Trade videos & guidance in Hindi" },
  { id: "Marathi", label: "मराठी (Marathi)", desc: "Trade videos & guidance in Marathi" },
  { id: "English", label: "English", desc: "Trade videos & guidance in English" },
];

const POPULAR_LOCATIONS = ["Pune", "Nashik", "Aurangabad", "Chakan", "Pimpri-Chinchwad", "Mumbai"];

export function AboutYouStep({ data, onChange, errors }: AboutYouStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 2 of 7 · Personal Details</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Tell us a little about yourself
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          These details populate your student profile and help us identify relevant apprenticeship
          zones in your district.
        </p>
      </div>

      <div className="space-y-4">
        {/* Age and Gender */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* student_profiles.age */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Age (Years) <span className="text-primary">*</span>
            </label>
            <input
              type="number"
              min={14}
              max={50}
              required
              value={data.age || ""}
              onChange={(e) => onChange({ age: Number(e.target.value) || null })}
              placeholder="e.g. 20"
              className={`mt-1.5 w-full rounded-2xl border bg-background px-4 py-3 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                errors.age ? "border-destructive" : "border-border"
              }`}
            />
            {errors.age && <p className="mt-1 text-xs text-destructive">{errors.age}</p>}
          </div>

          {/* student_profiles.gender */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Gender <span className="text-primary">*</span>
            </label>
            <select
              value={data.gender || "Male"}
              onChange={(e) => onChange({ gender: e.target.value })}
              className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Current Location -> student_profiles.location */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Where are you currently located? (Current City / District) <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              type="text"
              required
              value={data.location || ""}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="e.g. Pune, Maharashtra"
              className={`w-full rounded-2xl border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                errors.location ? "border-destructive" : "border-border"
              }`}
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.location && <p className="mt-1 text-xs text-destructive">{errors.location}</p>}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[0.68rem] text-muted-foreground">Quick pick:</span>
            {POPULAR_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onChange({ location: `${loc}, Maharashtra` })}
                className="rounded-lg bg-secondary/80 px-2.5 py-0.5 text-[0.68rem] font-medium text-foreground hover:bg-beige transition-colors"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Learning Language -> student_profiles.preferred_language */}
        <div className="pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Which language would you prefer for learning and career guidance? <span className="text-primary">*</span>
          </label>
          <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
            This determines the language of instructional video lessons, practice quizzes, and mentor sessions.
          </p>

          <div className="mt-2.5 grid grid-cols-3 gap-2.5">
            {LEARNING_LANGUAGES.map((lang) => {
              const isSelected = data.preferred_language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onChange({ preferred_language: lang.id })}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                      : "bg-card text-foreground border-border hover:bg-beige"
                  }`}
                >
                  <BookOpen className="h-4 w-4 mb-1 opacity-75" />
                  <p className="font-bold text-xs">{lang.label}</p>
                  <p className="text-[0.65rem] opacity-80 mt-0.5">{lang.desc}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
