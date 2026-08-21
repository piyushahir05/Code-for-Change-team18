import { Building2, Globe, Hash, Sparkles, Tag, Users } from "lucide-react";
import { RecruiterRegistrationState } from "@/services/recruiterService";

interface OrgIdentityStepProps {
  state: RecruiterRegistrationState;
  onUpdate: (updated: Partial<RecruiterRegistrationState["organization"]>) => void;
  errors: Record<string, string>;
}

const INDUSTRY_OPTIONS = [
  "Automotive & Auto Components",
  "Electrical & Power Electronics",
  "Heavy Engineering & Fabrication",
  "Solar, Wind & Green Energy",
  "Precision Manufacturing & CNC Machining",
  "Information Technology & Hardware Support",
  "Logistics, Supply Chain & Warehousing",
  "Construction, Infrastructure & HVAC",
  "Chemicals & Industrial Processing",
  "Aerospace & Defense Components",
  "Textiles & Garment Manufacturing",
  "Other Industrial Sector",
];

const ORG_TYPES = [
  { id: "Enterprise / MNC", label: "Enterprise / MNC", desc: "Global or large corporate with multi-plant presence" },
  { id: "Large Manufacturing", label: "Large Manufacturing", desc: "Tier-1 auto/engineering manufacturing firm" },
  { id: "MSME / Small Industry", label: "MSME / Small Industry", desc: "Specialized precision workshop or SME supplier" },
  { id: "PSU / Government", label: "PSU / Public Sector", desc: "State or Central public enterprise" },
  { id: "Staffing / Skilling Partner", label: "Skilling / Staffing Partner", desc: "Workforce & apprenticeship aggregator" },
];

const COMPANY_SIZES = [
  "1 - 50 Employees",
  "51 - 200 Employees",
  "201 - 1,000 Employees",
  "1,000 - 5,000 Employees",
  "5,000+ Employees",
];

export function OrgIdentityStep({ state, onUpdate, errors }: OrgIdentityStepProps) {
  const org = state.organization;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
          <Building2 className="h-5 w-5 text-gold" />
          <span>Organization Identity & Industry Profile</span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Tell us about your organization to personalize your Saksham ITI talent recommendations.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {/* Company Legal / Brand Name */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>Company / Brand Name <span className="text-destructive">*</span></span>
            <span className="text-[10px] text-muted-foreground font-normal">Maps to organization name</span>
          </label>
          <div className="relative">
            <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={org.companyName}
              onChange={(e) => onUpdate({ companyName: e.target.value })}
              placeholder="e.g. Tata Motors Passenger Vehicles Ltd"
              className={`w-full rounded-xl border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.companyName ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
              }`}
            />
          </div>
          {errors.companyName && <p className="text-xs text-destructive">{errors.companyName}</p>}
        </div>

        {/* Industry Sector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Industry Sector <span className="text-destructive">*</span>
          </label>
          <select
            value={org.industry}
            onChange={(e) => onUpdate({ industry: e.target.value })}
            className={`w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.industry ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          >
            <option value="">Select Primary Sector</option>
            {INDUSTRY_OPTIONS.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
          {errors.industry && <p className="text-xs text-destructive">{errors.industry}</p>}
        </div>

        {/* Company Size */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Company / Workforce Size <span className="text-destructive">*</span>
          </label>
          <select
            value={org.companySize}
            onChange={(e) => onUpdate({ companySize: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {COMPANY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        {/* Organization Type Pills */}
        <div className="sm:col-span-2 space-y-2">
          <label className="text-xs font-bold text-foreground">
            Organization Classification <span className="text-destructive">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ORG_TYPES.map((type) => {
              const isSelected = org.orgType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => onUpdate({ orgType: type.id })}
                  className={`flex flex-col text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-primary bg-secondary/80 text-primary shadow-xs ring-1 ring-primary/30"
                      : "border-border bg-card hover:bg-secondary/40 text-foreground"
                  }`}
                >
                  <span className="text-xs font-bold">{type.label}</span>
                  <span className="text-[11px] text-muted-foreground mt-0.5">{type.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Website */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Official Website <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              value={org.website}
              onChange={(e) => onUpdate({ website: e.target.value })}
              placeholder="https://www.company.com"
              className={`w-full rounded-xl border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.website ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
              }`}
            />
          </div>
          {errors.website && <p className="text-xs text-destructive">{errors.website}</p>}
        </div>

        {/* Year Established */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Year Established</label>
          <input
            type="text"
            value={org.yearEstablished}
            onChange={(e) => onUpdate({ yearEstablished: e.target.value })}
            placeholder="e.g. 1995"
            maxLength={4}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Tagline */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-foreground flex items-center justify-between">
            <span>Company Tagline / One-liner</span>
            <span className="text-[10px] text-muted-foreground">Appears on your employer card</span>
          </label>
          <div className="relative">
            <Tag className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={org.tagline}
              onChange={(e) => onUpdate({ tagline: e.target.value })}
              placeholder="e.g. Pioneering Automotive Excellence & Sustainable EV Mobility"
              className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* About / Description */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Organization Brief & Shopfloor Overview
          </label>
          <textarea
            rows={3}
            value={org.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Briefly describe your manufacturing scale, key products, and work culture..."
            className="w-full rounded-xl border border-border bg-card p-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>
    </div>
  );
}
