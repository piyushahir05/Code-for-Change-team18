import { Bus, Factory, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { RecruiterRegistrationState } from "@/services/recruiterService";

interface LocationStepProps {
  state: RecruiterRegistrationState;
  onUpdate: (updated: Partial<RecruiterRegistrationState["locations"]>) => void;
  errors: Record<string, string>;
}

const INDIAN_STATES = [
  "Maharashtra",
  "Gujarat",
  "Tamil Nadu",
  "Haryana",
  "Karnataka",
  "Uttar Pradesh",
  "Telangana",
  "Rajasthan",
  "Madhya Pradesh",
  "Andhra Pradesh",
  "Punjab",
  "West Bengal",
  "Delhi NCR",
  "Other State",
];

const INDUSTRIAL_HUBS = [
  "Chakan & Bhosari MIDC (Pune)",
  "Pimpri-Chinchwad Industrial Belt (Pune)",
  "Sanand & Changodar GIDC (Ahmedabad)",
  "Sriperumbudur & Oragadam (Chennai)",
  "Manesar & IMT Gurugram (Haryana)",
  "Peenya & Whitefield Industrial Area (Bengaluru)",
  "Noida & Greater Noida Industrial Zone (UP)",
  "Waluj & Shendra MIDC (Chhatrapati Sambhajinagar)",
  "Jamshedpur Industrial Area (Jharkhand)",
  "Pithampur Industrial Hub (Indore)",
  "Other Industrial Cluster",
];

export function LocationStep({ state, onUpdate, errors }: LocationStepProps) {
  const loc = state.locations;

  const [newPlantName, setNewPlantName] = useState("");
  const [newPlantCity, setNewPlantCity] = useState("");
  const [newPlantState, setNewPlantState] = useState("Maharashtra");
  const [newPlantType, setNewPlantType] = useState("Manufacturing & Assembly");

  const handleAddFacility = () => {
    if (!newPlantName.trim() || !newPlantCity.trim()) return;
    const nextFacilities = [
      ...loc.facilities,
      {
        name: newPlantName.trim(),
        city: newPlantCity.trim(),
        state: newPlantState,
        plantType: newPlantType,
      },
    ];
    onUpdate({ facilities: nextFacilities });
    setNewPlantName("");
    setNewPlantCity("");
  };

  const handleRemoveFacility = (index: number) => {
    const nextFacilities = loc.facilities.filter((_, i) => i !== index);
    onUpdate({ facilities: nextFacilities });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="border-b border-border pb-4">
        <div className="flex items-center gap-2 text-primary font-bold text-lg sm:text-xl">
          <MapPin className="h-5 w-5 text-gold" />
          <span>Headquarters & Manufacturing Plant Locations</span>
        </div>
        <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
          Identify your primary office and factory locations to match with nearby ITI colleges and talent clusters.
        </p>
      </div>

      {/* Primary HQ Information */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Headquarters City <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={loc.headquartersCity}
            onChange={(e) => onUpdate({ headquartersCity: e.target.value })}
            placeholder="e.g. Pune / Mumbai"
            className={`w-full rounded-xl border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
              errors.headquartersCity ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
            }`}
          />
          {errors.headquartersCity && <p className="text-xs text-destructive">{errors.headquartersCity}</p>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">State <span className="text-destructive">*</span></label>
          <select
            value={loc.headquartersState}
            onChange={(e) => onUpdate({ headquartersState: e.target.value })}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          >
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">PIN Code</label>
          <input
            type="text"
            value={loc.headquartersPincode}
            onChange={(e) => onUpdate({ headquartersPincode: e.target.value })}
            placeholder="e.g. 411018"
            maxLength={6}
            className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        {/* Industrial Cluster / Hub */}
        <div className="sm:col-span-3 space-y-1.5">
          <label className="text-xs font-bold text-foreground">
            Primary Industrial Cluster / MIDC / GIDC Zone <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Factory className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              list="industrial-clusters"
              value={loc.industrialCluster}
              onChange={(e) => onUpdate({ industrialCluster: e.target.value })}
              placeholder="Select or enter industrial belt (e.g. Chakan MIDC, Bhosari, Sanand GIDC)"
              className={`w-full rounded-xl border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                errors.industrialCluster ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
              }`}
            />
            <datalist id="industrial-clusters">
              {INDUSTRIAL_HUBS.map((hub) => (
                <option key={hub} value={hub} />
              ))}
            </datalist>
          </div>
          {errors.industrialCluster && <p className="text-xs text-destructive">{errors.industrialCluster}</p>}
        </div>
      </div>

      {/* Plant & Workshop Facilities List */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Factory className="h-4 w-4 text-primary" />
              Active Manufacturing Plants & Shopfloor Facilities ({loc.facilities.length})
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Specify where ITI apprentices and technicians will be placed.
            </p>
          </div>
        </div>

        {/* List of current facilities */}
        <div className="grid gap-2.5 sm:grid-cols-2">
          {loc.facilities.map((fac, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between rounded-xl border border-border bg-secondary/50 p-3 text-xs"
            >
              <div>
                <span className="font-bold text-foreground block">{fac.name}</span>
                <span className="text-muted-foreground block mt-0.5">
                  {fac.city}, {fac.state} • <span className="text-primary font-medium">{fac.plantType}</span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFacility(idx)}
                className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                title="Remove facility"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Add Facility Form Row */}
        <div className="pt-2 border-t border-border/60">
          <p className="text-xs font-semibold text-foreground mb-2">+ Add another manufacturing plant / site:</p>
          <div className="grid gap-2 sm:grid-cols-4">
            <input
              type="text"
              value={newPlantName}
              onChange={(e) => setNewPlantName(e.target.value)}
              placeholder="Facility / Plant Name"
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
            />
            <input
              type="text"
              value={newPlantCity}
              onChange={(e) => setNewPlantCity(e.target.value)}
              placeholder="City (e.g. Pune)"
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary"
            />
            <select
              value={newPlantType}
              onChange={(e) => setNewPlantType(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary"
            >
              <option value="Manufacturing & Assembly">Manufacturing & Assembly</option>
              <option value="Press Shop & Tool Room">Press Shop & Tool Room</option>
              <option value="Electronics & Wiring Hub">Electronics & Wiring Hub</option>
              <option value="Foundry & Forging">Foundry & Forging</option>
              <option value="Solar Installation & Field">Solar & Field Services</option>
            </select>
            <button
              type="button"
              onClick={handleAddFacility}
              disabled={!newPlantName.trim() || !newPlantCity.trim()}
              className="inline-flex items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-deep transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" /> Add Plant
            </button>
          </div>
        </div>
      </div>

      {/* Transit & Commute Toggle */}
      <div className="flex items-center justify-between rounded-xl border border-border/80 bg-secondary/30 p-3.5">
        <div className="flex items-center gap-3">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gold-soft text-primary font-bold">
            <Bus className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Company Bus / Daily Commute Route Available?</p>
            <p className="text-[11px] text-muted-foreground">
              Helps candidates from nearby ITI hostels and rural talukas evaluate shifts.
            </p>
          </div>
        </div>
        <input
          type="checkbox"
          checked={loc.transportProvided}
          onChange={(e) => onUpdate({ transportProvided: e.target.checked })}
          className="h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
        />
      </div>
    </div>
  );
}
