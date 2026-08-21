import { Eye, EyeOff, Globe, Lock, Mail, Phone, ShieldCheck, User } from "lucide-react";
import { useState } from "react";
import { UserAccountData } from "@/services/studentService";

interface CreateAccountStepProps {
  data: UserAccountData;
  onChange: (updated: Partial<UserAccountData>) => void;
  confirmPassword: string;
  onConfirmPasswordChange: (val: string) => void;
  errors: Record<string, string>;
}

const PLATFORM_LANGUAGES = [
  { id: "English", label: "English", desc: "Interface in English" },
  { id: "Hindi", label: "हिंदी (Hindi)", desc: "हिंदी इंटरफ़ेस" },
  { id: "Marathi", label: "मराठी (Marathi)", desc: "मराठी इंटरफेस" },
];

export function CreateAccountStep({
  data,
  onChange,
  confirmPassword,
  onConfirmPasswordChange,
  errors,
}: CreateAccountStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow text-gold font-semibold">Step 1 of 7 · Account Creation</span>
        <h2 className="mt-1 font-serif text-2xl sm:text-3xl font-bold text-foreground">
          Let's get you started
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
          Create your Saksham account and begin your employability journey.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name -> users.name */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Full Name <span className="text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              type="text"
              required
              value={data.name}
              onChange={(e) => onChange({ name: e.target.value })}
              placeholder="Enter your full name"
              className={`w-full rounded-2xl border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                errors.name ? "border-destructive" : "border-border"
              }`}
            />
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
        </div>

        {/* Email & Phone -> users.email, users.phone */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email Address <span className="text-primary">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type="email"
                required
                value={data.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="you@example.com"
                className={`w-full rounded-2xl border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                  errors.email ? "border-destructive" : "border-border"
                }`}
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Mobile Number <span className="text-primary">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type="tel"
                required
                value={data.phone}
                onChange={(e) => onChange({ phone: e.target.value })}
                placeholder="+91 98765 43210"
                className={`w-full rounded-2xl border bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                  errors.phone ? "border-destructive" : "border-border"
                }`}
              />
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
          </div>
        </div>

        {/* Password & Confirm Password */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password <span className="text-primary">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={data.password || ""}
                onChange={(e) => onChange({ password: e.target.value })}
                placeholder="••••••••"
                className={`w-full rounded-2xl border bg-background px-4 py-3 pr-10 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                  errors.password ? "border-destructive" : "border-border"
                }`}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-destructive">{errors.password}</p>}
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Confirm Password <span className="text-primary">*</span>
            </label>
            <div className="relative mt-1.5">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-2xl border bg-background px-4 py-3 pr-10 text-xs sm:text-sm outline-none transition-colors focus:border-primary ${
                  errors.confirmPassword ? "border-destructive" : "border-border"
                }`}
              />
              <button
                type="button"
                aria-label="Toggle confirm password visibility"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-destructive">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Platform Language -> users.language */}
        <div className="pt-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Which language would you like to use Saksham in? (Platform Language) <span className="text-primary">*</span>
          </label>
          <div className="mt-2 grid grid-cols-3 gap-2.5">
            {PLATFORM_LANGUAGES.map((lang) => {
              const isSelected = data.language === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => onChange({ language: lang.id })}
                  className={`rounded-2xl border p-3 text-left transition-all ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                      : "bg-card text-foreground border-border hover:bg-beige"
                  }`}
                >
                  <Globe className="h-4 w-4 mb-1 opacity-75" />
                  <p className="font-bold text-xs">{lang.label}</p>
                  <p className="text-[0.65rem] opacity-80 mt-0.5">{lang.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-secondary/50 p-3.5 border border-border/70 text-xs text-muted-foreground flex items-center gap-2.5">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
          <span>Role is automatically configured as <strong>Student</strong> for this registration workspace.</span>
        </div>
      </div>
    </div>
  );
}
