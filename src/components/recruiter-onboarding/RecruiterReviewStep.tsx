import {
  Building2,
  CheckCircle2,
  Factory,
  FileCheck,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { RecruiterRegistrationState } from "@/services/recruiterService";

interface RecruiterReviewStepProps {
  state: RecruiterRegistrationState;
  onUpdateOrg: (updated: Partial<RecruiterRegistrationState["organization"]>) => void;
  onUpdateCulture: (updated: Partial<RecruiterRegistrationState["cultureAndPerks"]>) => void;
  onNavigateStep: (stepId: number) => void;
  errors: Record<string, string>;
}

export function RecruiterReviewStep({
  state,
  onUpdateOrg,
  onUpdateCulture,
  onNavigateStep,
  errors,
}: RecruiterReviewStepProps) {
  const { account, organization, locations, hiringFocus, cultureAndPerks } = state;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
          <ShieldCheck className="h-5 w-5 text-gold" />
          <span>Review Organization Profile & Verification Pledge</span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Confirm your company credentials before activating your employer portal.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-xs">
        {/* Header summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground font-serif text-xl shadow-xs">
              {organization.companyName.charAt(0) || "C"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">{organization.companyName || "Organization Name"}</h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-500/20">
                  Ready to Verify
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {organization.industry} • {organization.orgType} • {organization.companySize}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateStep(1)}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            Edit Info
          </button>
        </div>

        {/* 4-Box Summary Grid */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Location Details */}
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-gold" />
                HQ & Manufacturing Clusters
              </span>
              <button
                type="button"
                onClick={() => onNavigateStep(2)}
                className="text-[10px] font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <p className="text-xs font-semibold text-foreground">
              {locations.headquartersCity}, {locations.headquartersState} ({locations.headquartersPincode || "400001"})
            </p>
            <p className="text-[11px] text-muted-foreground">
              Cluster: {locations.industrialCluster || "Not specified"}
            </p>
            <p className="text-[11px] text-muted-foreground">
              {locations.facilities.length} active plant(s) / shopfloor site(s)
            </p>
          </div>

          {/* ITI Hiring Focus */}
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5 text-gold" />
                Target ITI Trades ({hiringFocus.trades.length})
              </span>
              <button
                type="button"
                onClick={() => onNavigateStep(3)}
                className="text-[10px] font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="flex flex-wrap gap-1 pt-0.5">
              {hiringFocus.trades.slice(0, 4).map((t) => (
                <span key={t} className="rounded-md bg-card px-2 py-0.5 text-[10px] font-medium text-foreground border border-border">
                  {t}
                </span>
              ))}
              {hiringFocus.trades.length > 4 && (
                <span className="rounded-md bg-card px-2 py-0.5 text-[10px] text-muted-foreground border border-border">
                  +{hiringFocus.trades.length - 4} more
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground">
              Intake: {hiringFocus.annualCapacity}
            </p>
          </div>

          {/* Perks & Environment */}
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Workplace Perks & Stipend
              </span>
              <button
                type="button"
                onClick={() => onNavigateStep(4)}
                className="text-[10px] font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <p className="text-xs font-semibold text-foreground">{cultureAndPerks.apprenticeshipStipendRange}</p>
            <p className="text-[11px] text-muted-foreground">{cultureAndPerks.benefits.length} perks selected</p>
          </div>

          {/* Primary Contact Person */}
          <div className="rounded-xl border border-border/70 bg-secondary/30 p-3.5 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-primary flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-gold" />
                Authorized HR Contact
              </span>
              <button
                type="button"
                onClick={() => onNavigateStep(4)}
                className="text-[10px] font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            <p className="text-xs font-semibold text-foreground">{account.name || "Contact Person"}</p>
            <p className="text-[11px] text-muted-foreground">
              {account.email} • {account.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Corporate Verification Numbers (GSTIN / CIN) */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-3">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="h-4 w-4 text-primary" />
          Corporate Registration Identifiers (Optional for Instant Verification)
        </h4>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">GSTIN Identification Number</label>
            <input
              type="text"
              value={organization.gstin || ""}
              onChange={(e) => onUpdateOrg({ gstin: e.target.value })}
              placeholder="e.g. 27AAACT2727Q1ZW"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Corporate Identification Number (CIN)</label>
            <input
              type="text"
              value={organization.cin || ""}
              onChange={(e) => onUpdateOrg({ cin: e.target.value })}
              placeholder="e.g. L28920MH1945PLC004520"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Saksham Fair Hiring & Student Safety Pledge */}
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="fair-hiring-pledge"
            checked={cultureAndPerks.fairHiringPledge}
            onChange={(e) => onUpdateCulture({ fairHiringPledge: e.target.checked })}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-1 cursor-pointer"
          />
          <label htmlFor="fair-hiring-pledge" className="text-xs text-foreground cursor-pointer leading-relaxed">
            <span className="font-bold text-primary block">Saksham Industry Partner Fair Hiring & Safety Pledge:</span>
            We confirm that all apprenticeship and job opportunities posted will adhere to standard industrial safety norms, transparent stipend schedules, and the NAPS/NATS Apprenticeship Act. We pledge equal opportunity and fair evaluation for ITI trainees.
          </label>
        </div>
        {errors.pledge && <p className="text-xs text-destructive pl-7">{errors.pledge}</p>}
      </div>
    </div>
  );
}
