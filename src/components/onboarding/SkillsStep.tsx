import { Check, Plus, Search, Sparkles } from "lucide-react";
import { useState } from "react";
import { StudentSkillInput } from "@/services/studentService";

interface SkillsStepProps {
  skills: StudentSkillInput[];
  onSkillsChange: (skills: StudentSkillInput[]) => void;
  skillConfidence: number | null;
  onSkillConfidenceChange: (confidence: number) => void;
  error?: string;
}

const POPULAR_SKILLS = [
  "Basic Wiring",
  "Electrical Maintenance",
  "Circuit Testing",
  "Motor Maintenance",
  "Panel Wiring",
  "Safety Procedures",
  "Machine Operation",
  "Computer Basics",
  "Communication",
  "Problem Solving",
  "Lockout/Tagout (LOTO)",
  "Multimeter Diagnostics",
  "Blueprint Reading",
  "Soldering & Crimping",
];

const CONFIDENCE_LEVELS = [
  { level: 1, label: "Just starting", desc: "Learning core theory and basic lab tasks" },
  { level: 2, label: "Learning", desc: "Practicing workshop tasks with instructor guidance" },
  { level: 3, label: "Comfortable", desc: "Can perform routine trade tasks independently" },
  { level: 4, label: "Confident", desc: "Good problem solving, ready for shop-floor tests" },
  { level: 5, label: "Job-ready", desc: "Full confidence in practical industrial assignments" },
];

export function SkillsStep({
  skills,
  onSkillsChange,
  skillConfidence,
  onSkillConfidenceChange,
  error,
}: SkillsStepProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [showAddCustom, setShowAddCustom] = useState(false);

  const selectedSkillNames = new Set(skills.map((s) => s.skill_name));

  const toggleSkill = (name: string) => {
    if (selectedSkillNames.has(name)) {
      onSkillsChange(skills.filter((s) => s.skill_name !== name));
    } else {
      onSkillsChange([...skills, { skill_name: name, is_gap: false }]);
    }
  };

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    if (!selectedSkillNames.has(customInput.trim())) {
      onSkillsChange([...skills, { skill_name: customInput.trim(), is_gap: false }]);
    }
    setCustomInput("");
    setShowAddCustom(false);
  };

  const filteredSkills = POPULAR_SKILLS.filter((s) =>
    s.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 4 of 7 · Skills & Confidence</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          What skills do you already have?
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Select the skills you're comfortable with. You can add more later as you complete learning modules.
        </p>
      </div>

      {/* Search Input for Skills */}
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search skills (e.g. Wiring, Maintenance, Multimeter)..."
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 pl-10 text-xs sm:text-sm outline-none focus:border-primary"
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* Skills Chips */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Popular Trade & Workplace Skills <span className="text-primary">*</span>
          </label>
          <span className="text-xs font-bold text-primary">{skills.length} Selected</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {filteredSkills.map((skill) => {
            const isSelected = selectedSkillNames.has(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleSkill(skill)}
                className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border border-primary shadow-2xs scale-102"
                    : "bg-card text-foreground border border-border hover:bg-beige hover:border-gold/50"
                }`}
              >
                {isSelected ? (
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                )}
                <span>{skill}</span>
              </button>
            );
          })}

          {/* Any custom skills */}
          {skills
            .filter((s) => !POPULAR_SKILLS.includes(s.skill_name))
            .map((s) => (
              <button
                key={s.skill_name}
                type="button"
                onClick={() => toggleSkill(s.skill_name)}
                className="inline-flex items-center gap-1.5 rounded-2xl bg-primary text-primary-foreground px-3.5 py-2 text-xs font-semibold shadow-2xs"
              >
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>{s.skill_name}</span>
              </button>
            ))}

          {/* Custom skill input */}
          {showAddCustom ? (
            <form onSubmit={handleAddCustom} className="inline-flex items-center gap-1">
              <input
                type="text"
                autoFocus
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Skill name..."
                className="rounded-2xl border border-primary bg-background px-3 py-1.5 text-xs outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
              >
                Add
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setShowAddCustom(true)}
              className="inline-flex items-center gap-1 rounded-2xl border border-dashed border-primary/40 bg-secondary/60 px-3.5 py-2 text-xs font-semibold text-primary hover:bg-beige"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add another skill</span>
            </button>
          )}
        </div>
      </div>

      {/* Skill Confidence -> student_profiles.skill_confidence (1-5 int) */}
      <div className="pt-4 border-t border-border/60">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            How confident are you in your current skills? <span className="text-primary">*</span>
          </label>
          <span className="text-xs font-bold text-primary">
            {CONFIDENCE_LEVELS.find((c) => c.level === skillConfidence)?.label || "Comfortable"}
          </span>
        </div>
        <p className="mt-0.5 text-[0.72rem] text-muted-foreground">
          This helps us identify where you may need additional learning resources.
        </p>

        {/* 1-5 Visual Scale */}
        <div className="mt-3.5 grid grid-cols-5 gap-2">
          {CONFIDENCE_LEVELS.map((conf) => {
            const isCurrent = skillConfidence === conf.level;
            const isPast = (skillConfidence || 3) >= conf.level;
            return (
              <button
                key={conf.level}
                type="button"
                onClick={() => onSkillConfidenceChange(conf.level)}
                className={`flex flex-col items-center justify-center rounded-2xl p-2.5 text-center transition-all border ${
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : isPast
                    ? "bg-secondary text-primary border-primary/30"
                    : "bg-card text-muted-foreground border-border hover:bg-beige"
                }`}
              >
                <span className="font-serif text-sm font-bold">{conf.level}</span>
                <span className="mt-1 text-[0.65rem] font-semibold line-clamp-1">{conf.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 rounded-xl bg-secondary/60 p-3 text-xs text-foreground/80">
          <span className="font-semibold text-primary">Assessment Level: </span>
          {CONFIDENCE_LEVELS.find((c) => c.level === skillConfidence)?.desc}
        </div>
      </div>
    </div>
  );
}
