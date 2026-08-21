import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  Eye,
  EyeOff,
  Factory,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import industryImg from "@/assets/industry.jpg";
import { authService } from "@/services/authService";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/register/recruiter")({
  head: () => ({
    meta: [
      { title: "Employer & Recruiter Registration · Saksham | Y4D Foundation" },
      {
        name: "description",
        content:
          "Register your organization as an Industry Partner on Saksham to recruit certified ITI technicians, apprentices, and vocational talent.",
      },
    ],
  }),
  component: RecruiterRegistrationPage,
});

const VALUE_PROPS = [
  {
    title: "Direct ITI Student Pipeline",
    desc: "Access verified profiles across 15+ ITI trades including Electrician, Fitter, Welder, and CNC Operators.",
  },
  {
    title: "Skill Readiness Scores",
    desc: "Pre-assessed shopfloor competencies, practical test scores, and trade verification badges.",
  },
  {
    title: "NAPS & Apprenticeship Ready",
    desc: "Built-in apprenticeship compliance support and streamlined hiring drive coordination.",
  },
  {
    title: "1-Click Interview Scheduling",
    desc: "Direct calendar invitations and interview tracking across multiple plant locations.",
  },
];

function RecruiterRegistrationPage() {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("Automotive & Auto Components");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form Validations
    if (!companyName.trim()) {
      setErrorMessage("Please enter your company / organization name.");
      return;
    }
    if (!contactName.trim()) {
      setErrorMessage("Please enter the contact person's full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid official email address.");
      return;
    }
    if (!phone.trim() || phone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please check again.");
      return;
    }
    if (!agreeTerms) {
      setErrorMessage("Please accept the Terms of Use and Fair Hiring Policy.");
      return;
    }

    try {
      setIsLoading(true);

      // Save initial account and organization into recruiter draft state
      const currentDraft = recruiterService.getDraft();
      const updatedDraft = {
        ...currentDraft,
        account: {
          ...currentDraft.account,
          name: contactName,
          email: email,
          phone: phone,
          password: password,
        },
        organization: {
          ...currentDraft.organization,
          companyName: companyName,
          industry: industry,
        },
      };
      recruiterService.saveDraft(updatedDraft);

      await new Promise((resolve) => setTimeout(resolve, 500));
      setIsLoading(false);

      toast.success("Account Created Successfully!", {
        description: "Let's complete your organization profile to start recruiting.",
      });

      // Navigate to the 5-step guided onboarding flow
      navigate({ to: "/recruiter/onboarding" });
    } catch (err) {
      setIsLoading(false);
      setErrorMessage("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-grain px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Top Back Link */}
        <Link
          to="/register"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 text-xs sm:text-sm font-medium text-primary transition-colors hover:bg-secondary shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Role Selection</span>
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-12">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-lift"
            >
              {/* Header */}
              <div className="border-b border-border pb-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                  <Building2 className="h-4 w-4 text-gold" />
                  <span>Industry & Recruiter Registration</span>
                </div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-serif text-primary">
                  Partner with Saksham to Hire Verified ITI Talent
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Create your employer portal to post apprenticeships, search candidates, and connect with top ITI institutes across India.
                </p>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                  {errorMessage}
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Company Name */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Company / Organization Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="e.g. Tata Motors / Larsen & Toubro"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Industry Sector */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Industry Sector <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="Automotive & Auto Components">Automotive & Auto Components</option>
                      <option value="Electrical & Power Electronics">Electrical & Power Electronics</option>
                      <option value="Heavy Engineering & Fabrication">Heavy Engineering & Fabrication</option>
                      <option value="Solar, Wind & Green Energy">Solar, Wind & Green Energy</option>
                      <option value="Precision Manufacturing & CNC">Precision Manufacturing & CNC</option>
                      <option value="Information Technology & Hardware">Information Technology & Hardware</option>
                      <option value="Logistics & Warehousing">Logistics & Warehousing</option>
                      <option value="Construction & Infrastructure">Construction & Infrastructure</option>
                    </select>
                  </div>

                  {/* Contact Person Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Contact Person Name <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g. Vikram Malhotra"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Official Work Email */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Official Work Email <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vikram@company.com"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Mobile Number */}
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Mobile Number <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98201 54321"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">
                      Confirm Password <span className="text-destructive">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-border bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3.5 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2.5 pt-2">
                  <input
                    type="checkbox"
                    id="recruiter-terms"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary mt-0.5 cursor-pointer"
                  />
                  <label htmlFor="recruiter-terms" className="text-xs text-muted-foreground cursor-pointer">
                    I agree to the Saksham <span className="text-primary font-semibold">Terms of Service</span>, <span className="text-primary font-semibold">Privacy Policy</span>, and <span className="text-primary font-semibold">Fair ITI Apprentice Hiring Guidelines</span>.
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-deep transition-all shadow-lift mt-4 cursor-pointer disabled:opacity-50"
                >
                  <span>Create Account & Continue Onboarding</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="pt-2 text-center text-xs text-muted-foreground">
                  Already registered as an Employer?{" "}
                  <Link to="/login" className="font-bold text-primary hover:underline">
                    Sign in to Employer Portal
                  </Link>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Right Column: Visual & Value Props */}
          <div className="lg:col-span-5 space-y-6">
            {/* Visual Card */}
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-soft">
              <div className="relative h-48 sm:h-56">
                <img
                  src={industryImg}
                  alt="Industrial Workshop and Apprentices"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="inline-block rounded-full bg-gold/90 px-2.5 py-0.5 text-[10px] font-bold text-primary-deep uppercase tracking-wider mb-1">
                    Industry Partnership
                  </span>
                  <h3 className="text-base sm:text-lg font-serif">
                    Closing the ITI Skill Gap for Modern Industry
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="space-y-3">
                  {VALUE_PROPS.map((vp, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">{vp.title}</h4>
                        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{vp.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Direct Onboarding Link */}
                <div className="pt-3 border-t border-border/80">
                  <Link
                    to="/recruiter/onboarding"
                    className="flex items-center justify-between p-3 rounded-2xl border border-gold/30 bg-gold-soft/30 hover:bg-gold-soft/50 text-primary transition-all group text-xs font-bold"
                  >
                    <span>Jump directly to 5-Step Guided Onboarding Wizard</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
