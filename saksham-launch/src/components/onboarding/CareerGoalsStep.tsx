import { Briefcase, Building2, Check, MapPin, Zap } from "lucide-react";
import { StudentProfileData } from "@/services/studentService";

interface CareerGoalsStepProps {
  data: StudentProfileData;
  onChange: (updated: Partial<StudentProfileData>) => void;
  errors: Record<string, string>;
}

const CAREER_GOALS = [
  {
    id: "Industrial Electrician",
    title: "Industrial Electrician",
    desc: "Shop-floor panel wiring, motor starters & high-voltage factory systems.",
  },
  {
    id: "Electrical Technician",
    title: "Electrical Technician",
    desc: "Maintenance, circuit testing & electrical equipment assembly.",
  },
  {
    id: "Maintenance Technician",
    title: "Maintenance Technician",
    desc: "Preventive plant maintenance, troubleshooting & breakdown response.",
  },
  {
    id: "Automation Technician",
    title: "Automation Technician",
    desc: "Sensors, PLC monitoring, actuators & automated assembly line upkeep.",
  },
  {
    id: "Field Technician",
    title: "Field Technician",
    desc: "On-site customer visits, machine installation & testing.",
  },
];

const INDUSTRIES = [
  "Manufacturing",
  "Automotive",
  "Energy",
  "Construction",
  "Electronics",
  "Infrastructure",
];

const POPULAR_WORK_LOCATIONS = ["Pune", "Chakan", "Nashik", "Aurangabad", "Mumbai", "Open to any city"];

export function CareerGoalsStep({ data, onChange, errors }: CareerGoalsStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 5 of 7 · Career Aspirations</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Where do you want your career to go?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Tell us about your target trade role, preferred industry, and job location preferences.
        </p>
      </div>

      <div className="space-y-5">
        {/* Career Goal -> student_profiles.career_goal */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Target Career Goal <span className="text-primary">*</span>
          </label>
          {errors.career_goal && <p className="mt-1 text-xs text-destructive">{errors.career_goal}</p>}

          <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
            {CAREER_GOALS.map((goal) => {
              const isSelected = data.career_goal === goal.id;
              return (
                <div
                  key={goal.id}
                  onClick={() => onChange({ career_goal: goal.id })}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-secondary border-primary ring-2 ring-primary/20 shadow-soft"
                      : "bg-card border-border hover:border-gold/50 hover:bg-beige"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`grid h-7 w-7 place-items-center rounded-lg text-xs ${
                          isSelected ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"
                        }`}
                      >
                        <Zap className="h-4 w-4" />
                      </div>
                      <h4 className="font-serif text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                        {goal.title}
                      </h4>
                    </div>
                    <div
                      className={`grid h-5 w-5 place-items-center rounded-full text-[0.65rem] ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-transparent"
                      }`}
                    >
                      <Check className="h-3 w-3" />
                    </div>
                  </div>
                  <p className="mt-2 text-[0.72rem] text-muted-foreground leading-relaxed">
                    {goal.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Preferred Industry -> student_profiles.preferred_industry */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Which industry would you like to work in? (Preferred Industry) <span className="text-primary">*</span>
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {INDUSTRIES.map((ind) => {
              const isSelected = data.preferred_industry === ind;
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => onChange({ preferred_industry: ind })}
                  className={`rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "bg-card text-foreground border border-border hover:bg-beige"
                  }`}
                >
                  {ind}
                </button>
              );
            })}
          </div>
        </div>

        {/* Preferred Location -> student_profiles.preferred_location */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Where would you prefer to work? (Preferred Work Location) <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              type="text"
              required
              value={data.preferred_location}
              onChange={(e) => onChange({ preferred_location: e.target.value })}
              placeholder="e.g. Pune, Chakan Industrial Area"
              className={`w-full rounded-2xl border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                errors.preferred_location ? "border-destructive" : "border-border"
              }`}
            />
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.preferred_location && (
            <p className="mt-1 text-xs text-destructive">{errors.preferred_location}</p>
          )}

          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            <span className="text-[0.68rem] text-muted-foreground">Quick pick:</span>
            {POPULAR_WORK_LOCATIONS.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => onChange({ preferred_location: loc })}
                className="rounded-lg bg-secondary/80 px-2.5 py-0.5 text-[0.68rem] font-medium text-foreground hover:bg-beige transition-colors"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
