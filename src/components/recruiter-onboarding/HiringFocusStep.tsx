import { Check, Plus, Sparkles, Target, Wrench, X } from "lucide-react";
import { useState } from "react";
import { RecruiterRegistrationState } from "@/services/recruiterService";

interface HiringFocusStepProps {
  state: RecruiterRegistrationState;
  onUpdate: (updated: Partial<RecruiterRegistrationState["hiringFocus"]>) => void;
  errors: Record<string, string>;
}

const AVAILABLE_TRADES = [
  "Electrician",
  "Fitter",
  "Welder (Gas & Electric)",
  "Machinist",
  "Turner",
  "COPA (Computer Operator)",
  "Mechanic Motor Vehicle (MMV)",
  "Wireman",
  "Tool & Die Maker",
  "Solar Technician (Electrical)",
  "Refrigeration & Air Conditioning (RAC)",
  "CNC Programmer & Operator",
  "Instrument Mechanic",
  "Electronics Mechanic",
  "Draughtsman Mechanical",
];

const HIRING_TYPES = [
  { id: "NAPS Apprenticeship", label: "NAPS Government Apprenticeship", desc: "1-Year stipend-backed national apprenticeship scheme" },
  { id: "Full-Time Technician", label: "Full-Time Shopfloor Technician", desc: "Permanent / direct payroll entry-level role" },
  { id: "Diploma/ITI Trainee", label: "Technical Trainee (GET/DET)", desc: "Structured 2-year industrial rotation and absorption" },
  { id: "Campus Recruitment Drive", label: "Institutional Campus Hiring Drive", desc: "Batch recruitment directly from partner ITIs" },
];

const ANNUAL_CAPACITY_OPTIONS = [
  "5 - 20 ITI Trainees / Year",
  "20 - 50 ITI Trainees / Year",
  "50 - 150 ITI Trainees / Year",
  "150 - 300 ITI Trainees / Year",
  "300+ ITI Trainees / Year (Enterprise Drive)",
];

const SUGGESTED_SKILLS = [
  "Shopfloor Safety & 5S",
  "Wiring & Panel Assembly",
  "TIG/MIG Arc Welding",
  "CNC Operation & G-Code",
  "Preventive Maintenance",
  "Engineering Blueprint Reading",
  "PLC & Sensor Automation",
  "Precision Vernier & Micrometer",
  "Quality Inspection & GD&T",
  "Motor Diagnostics & Overhauling",
  "Soldering & PCB Assembly",
];

export function HiringFocusStep({ state, onUpdate, errors }: HiringFocusStepProps) {
  const hiring = state.hiringFocus;
  const [customSkill, setCustomSkill] = useState("");

  const toggleTrade = (trade: string) => {
    const exists = hiring.trades.includes(trade);
    const nextTrades = exists ? hiring.trades.filter((t) => t !== trade) : [...hiring.trades, trade];
    onUpdate({ trades: nextTrades });
  };

  const toggleHiringType = (typeId: string) => {
    const exists = hiring.hiringTypes.includes(typeId);
    const nextTypes = exists
      ? hiring.hiringTypes.filter((t) => t !== typeId)
      : [...hiring.hiringTypes, typeId];
    onUpdate({ hiringTypes: nextTypes });
  };

  const toggleSkill = (skill: string) => {
    const exists = hiring.requiredSkills.includes(skill);
    const nextSkills = exists
      ? hiring.requiredSkills.filter((s) => s !== skill)
      : [...hiring.requiredSkills, skill];
    onUpdate({ requiredSkills: nextSkills });
  };

  const handleAddCustomSkill = () => {
    if (!customSkill.trim() || hiring.requiredSkills.includes(customSkill.trim())) return;
    onUpdate({ requiredSkills: [...hiring.requiredSkills, customSkill.trim()] });
    setCustomSkill("");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
          <Target className="h-5 w-5 text-gold" />
          <span>ITI Hiring Focus, Trades & Intake Volume</span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Define your trade requirements so Saksham Smart-Matching connects you with top-ranked candidates.
        </p>
      </div>

      {/* Primary Trades Multi-Select */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground">
            Target ITI Trades <span className="text-destructive">*</span>
          </label>
          <span className="text-[11px] font-semibold text-primary">
            {hiring.trades.length} selected
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          Select all ITI branches your plants regularly recruit or host apprentices for (maps to recruiter expertise).
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABLE_TRADES.map((trade) => {
            const isSelected = hiring.trades.includes(trade);
            return (
              <button
                type="button"
                key={trade}
                onClick={() => toggleTrade(trade)}
                className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary/10 text-primary font-bold shadow-xs ring-1 ring-primary/25"
                    : "border-border bg-card hover:bg-secondary/40 text-foreground"
                }`}
              >
                <span className="truncate pr-1">{trade}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
        {errors.trades && <p className="text-xs text-destructive">{errors.trades}</p>}
      </div>

      {/* Hiring Models / Programs */}
      <div className="space-y-2.5 pt-2">
        <label className="text-xs font-bold text-foreground">
          Preferred Engagement & Hiring Models <span className="text-destructive">*</span>
        </label>
        <div className="grid gap-2 sm:grid-cols-2">
          {HIRING_TYPES.map((model) => {
            const isSelected = hiring.hiringTypes.includes(model.id);
            return (
              <button
                type="button"
                key={model.id}
                onClick={() => toggleHiringType(model.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-secondary/90 text-primary shadow-xs ring-1 ring-primary/30"
                    : "border-border bg-card hover:bg-secondary/40 text-foreground"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">{model.label}</span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </div>
                <span className="text-[11px] text-muted-foreground mt-0.5">{model.desc}</span>
              </button>
            );
          })}
        </div>
        {errors.hiringTypes && <p className="text-xs text-destructive">{errors.hiringTypes}</p>}
      </div>

      {/* Target Volume & Experience Level */}
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Target Annual Intake Capacity</label>
          <select
            value={hiring.annualCapacity}
            onChange={(e) => onUpdate({ annualCapacity: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {ANNUAL_CAPACITY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Candidate Readiness Level</label>
          <select
            value={hiring.experienceLevel}
            onChange={(e) => onUpdate({ experienceLevel: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            <option value="Fresher ITI Passouts & 1-Year Apprentices">Fresher ITI Passouts & 1-Year Apprentices</option>
            <option value="Final Year ITI Trainees (Pre-placement)">Final Year ITI Trainees (Pre-placement)</option>
            <option value="Experienced Technicians (1-3 years)">Experienced Technicians (1-3 years)</option>
            <option value="All ITI Qualification Levels">All ITI Qualification Levels</option>
          </select>
        </div>
      </div>

      {/* Key Shopfloor Skills Required */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-foreground flex items-center justify-between">
          <span>Priority Shopfloor & Technical Competencies</span>
          <span className="text-[10px] text-muted-foreground">{hiring.requiredSkills.length} selected</span>
        </label>
        <p className="text-xs text-muted-foreground">
          Click to toggle in-demand skills for candidate filtering:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTED_SKILLS.map((skill) => {
            const isSelected = hiring.requiredSkills.includes(skill);
            return (
              <button
                type="button"
                key={skill}
                onClick={() => toggleSkill(skill)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground font-semibold shadow-xs"
                    : "border-border bg-card hover:bg-secondary text-muted-foreground"
                }`}
              >
                {skill}
              </button>
            );
          })}
        </div>

        {/* Custom skill add */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCustomSkill())}
            placeholder="Add other specific machine / process skill (e.g. Fanuc CNC, Hydraulic Press)..."
            className="flex-1 rounded-xl border border-border bg-card px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
          />
          <button
            type="button"
            onClick={handleAddCustomSkill}
            disabled={!customSkill.trim()}
            className="rounded-xl bg-secondary px-3 py-2 text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            + Add Skill
          </button>
        </div>
      </div>
    </div>
  );
}
