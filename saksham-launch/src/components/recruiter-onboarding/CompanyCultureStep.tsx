import { Check, Clock, DollarSign, Mail, Phone, Shield, Sparkles, User, Users } from "lucide-react";
import { RecruiterRegistrationState } from "@/services/recruiterService";

interface CompanyCultureStepProps {
  state: RecruiterRegistrationState;
  onUpdateAccount: (updated: Partial<RecruiterRegistrationState["account"]>) => void;
  onUpdateCulture: (updated: Partial<RecruiterRegistrationState["cultureAndPerks"]>) => void;
  errors: Record<string, string>;
}

const AVAILABLE_PERKS = [
  { id: "Subsidized Canteen (Breakfast & Lunch)", label: "Subsidized Canteen Facility", desc: "Nutritious shopfloor meals provided" },
  { id: "Free Bus Route Pickup across Pune & PCMC", label: "Company Bus / Transport Route", desc: "Pick-up and drop across key taluka stops" },
  { id: "Comprehensive Medical & ESI Coverage", label: "ESI & Accidental Insurance", desc: "Full workplace medical and hospitalization cover" },
  { id: "Full PPE & Safety Uniforms Provided", label: "Safety Shoes, Helmets & PPE Kits", desc: "Zero-cost safety gear supplied on day 1" },
  { id: "Overtime & Production Incentives", label: "Overtime (OT) Allowance & Bonus", desc: "Clear incentive structure for extra shifts" },
  { id: "NAPS Government Certification Support", label: "NAPS Govt Portal Portal Certification", desc: "Assistance with official NCVT / NAPS portal" },
  { id: "Fast-track Permanent Technician Absorption Path", label: "Permanent Technician Absorption", desc: "Top 30% apprentices converted to payroll" },
  { id: "Hostel / Accommodation Assistance", label: "Accommodation / Hostel Assistance", desc: "Assistance for outstation ITI candidates" },
];

const STIPEND_RANGES = [
  "₹10,000 - ₹12,500 / month (Standard NAPS)",
  "₹12,500 - ₹15,000 / month (Manufacturing)",
  "₹14,500 - ₹18,000 / month (Auto & Heavy Engg)",
  "₹18,000 - ₹22,000 / month (Specialized / CNC)",
  "Competitive / Performance Linked",
];

export function CompanyCultureStep({
  state,
  onUpdateAccount,
  onUpdateCulture,
  errors,
}: CompanyCultureStepProps) {
  const account = state.account;
  const culture = state.cultureAndPerks;

  const togglePerk = (perkId: string) => {
    const exists = culture.benefits.includes(perkId);
    const nextPerks = exists
      ? culture.benefits.filter((b) => b !== perkId)
      : [...culture.benefits, perkId];
    onUpdateCulture({ benefits: nextPerks });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
          <Users className="h-5 w-5 text-gold" />
          <span>Workplace Culture, Facilities & HR Point of Contact</span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Showcase the shopfloor environment and provide your official recruiter profile credentials.
        </p>
      </div>

      {/* Facilities & Perks */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-foreground">
            Apprentice & Technician Benefits Offered <span className="text-destructive">*</span>
          </label>
          <span className="text-[11px] font-semibold text-primary">
            {culture.benefits.length} selected
          </span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {AVAILABLE_PERKS.map((perk) => {
            const isSelected = culture.benefits.includes(perk.id);
            return (
              <button
                type="button"
                key={perk.id}
                onClick={() => togglePerk(perk.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-secondary/90 shadow-xs ring-1 ring-primary/30"
                    : "border-border bg-card hover:bg-secondary/40 text-foreground"
                }`}
              >
                <div
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md text-xs mt-0.5 border ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border bg-card"
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{perk.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{perk.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
        {errors.benefits && <p className="text-xs text-destructive">{errors.benefits}</p>}
      </div>

      {/* Stipend Range & Shift Timings */}
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <DollarSign className="h-3.5 w-3.5 text-gold" />
            Typical Apprentice Stipend Range
          </label>
          <select
            value={culture.apprenticeshipStipendRange}
            onChange={(e) => onUpdateCulture({ apprenticeshipStipendRange: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {STIPEND_RANGES.map((rng) => (
              <option key={rng} value={rng}>
                {rng}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-primary" />
            Shopfloor Shift Structure
          </label>
          <input
            type="text"
            value={culture.shiftTimings}
            onChange={(e) => onUpdateCulture({ shiftTimings: e.target.value })}
            placeholder="e.g. General Shift (8 AM - 4:30 PM) / Rotational"
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      {/* Primary Recruiter Contact Box (maps directly to users table) */}
      <div className="rounded-2xl border border-primary/20 bg-secondary/40 p-4 sm:p-5 space-y-4">
        <div>
          <h4 className="text-sm font-bold text-primary flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            Primary Recruiter / HR Account Details (System User)
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            This contact receives candidate applications, shortlist digests, and interview confirmations.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Contact Person Name -> users.name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Contact Person Full Name <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={account.name}
                onChange={(e) => onUpdateAccount({ name: e.target.value })}
                placeholder="e.g. Vikram Malhotra"
                className={`w-full rounded-xl border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.name ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                }`}
              />
            </div>
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Official Email -> users.email */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Official Work Email <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={account.email}
                onChange={(e) => onUpdateAccount({ email: e.target.value })}
                placeholder="vikram@company.com"
                className={`w-full rounded-xl border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Phone / Mobile -> users.phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">
              Direct Contact Mobile <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
              <input
                type="tel"
                value={account.phone}
                onChange={(e) => onUpdateAccount({ phone: e.target.value })}
                placeholder="+91 98201 54321"
                className={`w-full rounded-xl border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                  errors.phone ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* Designation */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Job Title / Designation</label>
            <input
              type="text"
              value={account.designation}
              onChange={(e) => onUpdateAccount({ designation: e.target.value })}
              placeholder="e.g. Lead Talent Acquisition Partner"
              className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
