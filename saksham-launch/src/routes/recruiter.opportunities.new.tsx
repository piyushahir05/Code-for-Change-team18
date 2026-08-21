import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  GraduationCap,
  MapPin,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { Opportunity } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/opportunities/new")({
  head: () => ({
    meta: [
      { title: "Post New Opportunity · Recruiter Portal | Saksham" },
      {
        name: "description",
        content: "Create and publish a new ITI apprenticeship or hiring requirement.",
      },
    ],
  }),
  component: RecruiterNewOpportunityPage,
});

const OPPORTUNITY_TYPES = [
  { id: "APPRENTICESHIP", label: "Apprenticeship (NAPS / NATS)", desc: "Government recognized shop-floor practical training" },
  { id: "JOB", label: "Full-Time Job", desc: "Permanent / Contractual technician position" },
  { id: "RECRUITMENT_DRIVE", label: "Campus Recruitment Drive", desc: "Mega hiring drive across ITI colleges" },
  { id: "TRAINING_PROGRAM", label: "Specialized Training Program", desc: "Sponsored upskilling module" },
  { id: "INDUSTRY_EXPOSURE", label: "Industry Exposure / Internship", desc: "Short shop-floor visit & practical internship" },
];

const TRADE_LIST = [
  "Electrician",
  "Fitter",
  "Welder",
  "Machinist",
  "Turner",
  "Mechanic Motor Vehicle (MMV)",
  "Solar Technician",
  "Wireman",
  "Electronics Mechanic",
];

const POPULAR_SKILLS = [
  "Electrical Fundamentals",
  "Industrial Safety & LOTO",
  "PLC Basics & Wiring",
  "Digital Multimeter Diagnostics",
  "Blueprint Reading & GD&T",
  "Precision Bench Fitting",
  "TIG & MIG Welding",
  "CNC Milling & G-Code",
  "Sensor & Transducer Testing",
];

export function RecruiterNewOpportunityPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [type, setType] = useState<Opportunity["type"]>("APPRENTICESHIP");
  const [title, setTitle] = useState("Electrician Apprentice — Shop Floor Assembly");
  const [trade, setTrade] = useState("Electrician");
  const [location, setLocation] = useState("Pune (Chakan Plant)");
  const [positionsCount, setPositionsCount] = useState(20);
  const [salaryStipend, setSalaryStipend] = useState("₹14,500 / month + Canteen");
  const [deadline, setDeadline] = useState("2024-10-30");
  const [description, setDescription] = useState(
    "Tata Motors is hiring ITI apprentices for our Chakan Assembly Plant. Trainees will work on vehicle electrical harness integration, industrial panel maintenance, and diagnostic testing with senior shop-floor mentors."
  );
  const [eligibility, setEligibility] = useState(
    "ITI Pass (Electrician / Wireman) from recognized ITI institute (NCVT/SCVT). Passout batches 2023 or 2024."
  );
  const [experienceRequired, setExperienceRequired] = useState("Freshers / 0–1 Year");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Electrical Fundamentals",
    "Industrial Safety & LOTO",
    "Digital Multimeter Diagnostics",
  ]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [benefits, setBenefits] = useState<string[]>([
    "NAPS Government Certificate",
    "Subsidized Transport & Canteen",
    "Safety Gear provided",
  ]);

  const toggleSkill = (skillName: string) => {
    if (selectedSkills.includes(skillName)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skillName));
    } else {
      setSelectedSkills([...selectedSkills, skillName]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customSkillInput.trim()) return;
    if (!selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills([...selectedSkills, customSkillInput.trim()]);
    }
    setCustomSkillInput("");
  };

  const handlePublish = (status: "ACTIVE" | "DRAFT") => {
    if (!title.trim() || !location.trim() || selectedSkills.length === 0) {
      toast.error("Please complete the required fields and select at least one skill.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      recruiterService.createOpportunity({
        type,
        title,
        trade,
        location,
        description,
        positionsCount: Number(positionsCount) || 10,
        salaryStipend,
        eligibility,
        experienceRequired,
        deadline,
        requiredSkills: selectedSkills.map((s) => ({ skillName: s, requiredLevel: "Intermediate" })),
        benefits,
        status,
      });

      setIsSubmitting(false);
      if (status === "ACTIVE") {
        toast.success("Opportunity published successfully 🎉", {
          description: "Smart match engine is now identifying suitable ITI candidates.",
        });
      } else {
        toast.info("Draft saved successfully");
      }
      navigate({ to: "/recruiter/opportunities" });
    }, 500);
  };

  return (
    <RecruiterLayout
      pageTitle="Post New Opportunity"
      breadcrumbs={[{ label: "Opportunities", to: "/recruiter/opportunities" }, { label: "New Posting" }]}
    >
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Stepper Progress Header */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="eyebrow text-gold font-bold">Step {currentStep} of 3</span>
              <span className="text-xs text-muted-foreground">
                {currentStep === 1
                  ? "Basic Information"
                  : currentStep === 2
                  ? "Eligibility & Required Skills"
                  : "Review & Publish"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`h-2 rounded-full transition-all ${
                    step === currentStep
                      ? "w-8 bg-primary"
                      : step < currentStep
                      ? "w-4 bg-emerald-600"
                      : "w-4 bg-secondary"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft space-y-5"
          >
            <div>
              <span className="eyebrow text-gold font-bold">Requirement Details</span>
              <h2 className="font-serif text-2xl font-bold text-foreground mt-1">
                Tell us about this opportunity
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Specify the position type, job title, stipend, and plant location.
              </p>
            </div>

            {/* Opportunity Type Radio Cards */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Opportunity Type <span className="text-primary">*</span>
              </label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {OPPORTUNITY_TYPES.map((t) => {
                  const isSelected = type === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setType(t.id as Opportunity["type"])}
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
                        <p className="text-xs font-bold text-foreground">{t.label}</p>
                        <p className="text-[0.68rem] text-muted-foreground mt-0.5">{t.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Job Title */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Opportunity Title <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Electrician Apprentice — Shop Floor Assembly"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Grid: Positions & Stipend */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Number of Positions <span className="text-primary">*</span>
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={positionsCount}
                  onChange={(e) => setPositionsCount(Number(e.target.value) || 1)}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Monthly Stipend / Salary <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={salaryStipend}
                  onChange={(e) => setSalaryStipend(e.target.value)}
                  placeholder="e.g. ₹14,500 / month + Canteen"
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Grid: Location & Deadline */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Plant / Work Location <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Pune (Chakan Plant)"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none focus:border-primary"
                  />
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Application Deadline <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none focus:border-primary"
                  />
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role Description & Shop Floor Responsibilities
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Next Button */}
            <div className="pt-4 border-t border-border/60 flex justify-end">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep"
              >
                <span>Continue to Eligibility & Skills</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Eligibility & Skills */}
        {currentStep === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft space-y-5"
          >
            <div>
              <span className="eyebrow text-gold font-bold">Candidate Qualifications</span>
              <h2 className="font-serif text-2xl font-bold text-foreground mt-1">
                Specify Trade & Required Skills
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Our smart matching engine will score candidates based on these individual skills.
              </p>
            </div>

            {/* Trade Selection */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Primary ITI Trade <span className="text-primary">*</span>
              </label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
              >
                {TRADE_LIST.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            {/* Required Skills Selection (matching opportunity_skills schema) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Required Practical Skills ({selectedSkills.length} Selected){" "}
                  <span className="text-primary">*</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`inline-flex items-center gap-1.5 rounded-2xl px-3.5 py-2 text-xs font-semibold transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "bg-card text-foreground border border-border hover:bg-beige"
                      }`}
                    >
                      {isSelected ? (
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      ) : (
                        <Plus className="h-3.5 w-3.5 opacity-60" />
                      )}
                      <span>{skill}</span>
                    </button>
                  );
                })}
              </div>

              {/* Add custom skill */}
              <form onSubmit={handleAddCustomSkill} className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  placeholder="Add custom trade skill requirement..."
                  className="flex-1 rounded-2xl border border-border bg-background px-3.5 py-2 text-xs outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="rounded-2xl bg-secondary px-4 py-2 text-xs font-semibold text-primary hover:bg-beige"
                >
                  Add Skill
                </button>
              </form>
            </div>

            {/* Experience & Eligibility */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Experience Level
                </label>
                <input
                  type="text"
                  value={experienceRequired}
                  onChange={(e) => setExperienceRequired(e.target.value)}
                  placeholder="e.g. Fresh ITI Passout / 0–1 Year"
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Eligibility Criteria
                </label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. 10th + ITI (NCVT certified)"
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Stepper navigation buttons */}
            <div className="pt-4 border-t border-border/60 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-beige"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep"
              >
                <span>Review & Publish</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Review & Publish Preview */}
        {currentStep === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft space-y-6"
          >
            <div>
              <span className="eyebrow text-gold font-bold">Final Verification</span>
              <h2 className="font-serif text-2xl font-bold text-foreground mt-1">
                Preview Your Opportunity Posting
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Review before publishing to active ITI student feeds across Maharashtra.
              </p>
            </div>

            {/* Live Opportunity Preview Card */}
            <div className="rounded-3xl border border-gold/40 bg-gradient-to-br from-card via-secondary/40 to-gold/10 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                  {type.replace(/_/g, " ")}
                </span>
                <span className="text-xs font-bold text-emerald-700">● Ready to Publish</span>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-foreground">{title}</h3>
                <p className="text-sm font-bold text-primary mt-0.5">Tata Motors · {location}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs rounded-2xl bg-card p-3 border border-border/70">
                <div>
                  <span className="text-muted-foreground">Trade</span>
                  <p className="font-bold text-foreground mt-0.5">{trade}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Positions</span>
                  <p className="font-bold text-foreground mt-0.5">{positionsCount} Openings</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Stipend</span>
                  <p className="font-bold text-primary mt-0.5">{salaryStipend}</p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>

              <div>
                <span className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
                  Required Practical Skills
                </span>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {selectedSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-lg bg-primary text-primary-foreground px-2.5 py-1 text-[0.7rem] font-semibold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-beige"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Edit Details</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handlePublish("DRAFT")}
                  className="flex-1 sm:flex-none rounded-full border border-border px-5 py-3 text-xs font-semibold text-foreground hover:bg-beige"
                >
                  Save as Draft
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handlePublish("ACTIVE")}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-xs sm:text-sm font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-gold fill-gold" />
                  <span>{isSubmitting ? "Publishing..." : "Publish Opportunity Now"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </RecruiterLayout>
  );
}
