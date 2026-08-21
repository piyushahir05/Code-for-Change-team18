import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Check,
  Compass,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import heroStudent from "@/assets/hero-student.jpg";
import workshop from "@/assets/workshop.jpg";
import { authService } from "@/services/authService";
import { studentService } from "@/services/studentService";

export const Route = createFileRoute("/register/student")({
  head: () => ({
    meta: [
      { title: "Student Registration · Saksham | Y4D Foundation" },
      {
        name: "description",
        content: "Create your student account to access ITI career progression, skill gap guidance, and verified placements.",
      },
    ],
  }),
  component: StudentRegistrationPage,
});

const JOURNEY_STEPS = [
  { step: "01", label: "Profile", icon: User },
  { step: "02", label: "Skills", icon: Sparkles },
  { step: "03", label: "Learning", icon: BookOpen },
  { step: "04", label: "Opportunities", icon: Compass },
  { step: "05", label: "Employment", icon: Briefcase },
];

function StudentRegistrationPage() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
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

    // Validation
    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (!mobile.trim() || mobile.length < 10) {
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
      setErrorMessage("Please agree to the Terms of Use & Privacy Policy.");
      return;
    }

    try {
      setIsLoading(true);
      // Register through auth service abstraction
      await authService.registerStudent({
        fullName,
        email,
        mobile,
        password,
      });

      // Save initial account info to student registration draft
      studentService.saveDraft({
        account: {
          name: fullName,
          email,
          phone: mobile,
          password,
          language: "English",
        },
      });

      toast.success("Account created successfully!", {
        description: "Let's set up your personalized ITI profile.",
      });

      // Navigate to multi-step onboarding
      navigate({ to: "/student/onboarding" });
    } catch (err) {
      setErrorMessage("Unable to create account right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-3 sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[110rem] gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* Left Editorial Visual & Journey Column */}
        <div className="relative hidden overflow-hidden rounded-[2.5rem] shadow-lift lg:flex flex-col justify-between p-10 xl:p-12">
          {/* Background image & gradient overlay */}
          <img
            src={heroStudent}
            alt="ITI Student training on workshop equipment"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/95 via-primary/60 to-primary-deep/45" />

          {/* Top Branding & Back button */}
          <div className="relative z-10">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 bg-black/20 px-4 py-2 text-xs font-medium text-cream backdrop-blur-md transition-colors hover:bg-cream/15"
            >
              <ArrowLeft className="h-4 w-4" /> Change Role
            </Link>
          </div>

          {/* Center / Bottom Editorial Story */}
          <div className="relative z-10 mt-auto">
            <span className="eyebrow text-gold font-semibold">Saksham · Y4D Foundation</span>
            <h1 className="mt-4 font-serif text-[clamp(2.4rem,3.4vw,3.6rem)] font-bold leading-[1.08] text-cream">
              Build your future with Saksham.
            </h1>
            <p className="mt-3.5 max-w-lg text-sm sm:text-base text-cream/85 leading-relaxed">
              Create your profile once. Discover the trade skills, certified learning, and verified
              industrial apprenticeships that move your career forward.
            </p>

            {/* Journey Pipeline Stepper */}
            <div className="mt-8 rounded-3xl border border-cream/20 bg-cream/10 p-5 backdrop-blur-md">
              <p className="text-[0.7rem] uppercase tracking-wider font-semibold text-gold mb-3">
                Your Employability Roadmap
              </p>
              <div className="grid grid-cols-5 gap-2 text-center">
                {JOURNEY_STEPS.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex flex-col items-center">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-cream/20 text-gold border border-gold/40 text-xs">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-[0.68rem] font-bold text-cream">
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="flex items-center justify-center py-6 px-2 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-lg rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-10 shadow-lift"
          >
            {/* Top mobile header */}
            <div className="flex items-center justify-between lg:hidden mb-4">
              <Link to="/register" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Link>
              <span className="eyebrow text-primary text-[0.65rem]">Saksham Student</span>
            </div>

            <div>
              <span className="eyebrow text-gold font-semibold">Student Account</span>
              <h2 className="mt-1 font-serif text-3xl font-bold text-foreground">
                Create your account
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
                Start your personalized employability journey in just a few steps.
              </p>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-5 rounded-2xl bg-destructive/10 p-3.5 text-xs text-destructive font-medium border border-destructive/20">
                {errorMessage}
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Full Name */}
              <div>
                <label className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                  Full Name <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                  Email Address <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
                  />
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Mobile */}
              <div>
                <label className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                  Mobile Number <span className="text-primary">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3 pl-11 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
                  />
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Password */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                    Password <span className="text-primary">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-input bg-background px-4 py-3 pr-10 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
                    />
                    <button
                      type="button"
                      aria-label="Toggle password"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                    Confirm Password <span className="text-primary">*</span>
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full rounded-2xl border border-input bg-background px-4 py-3 pr-10 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
                    />
                    <button
                      type="button"
                      aria-label="Toggle confirm password"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 text-xs text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-input accent-[oklch(0.394_0.158_22.5)]"
                  />
                  <span>
                    I agree to the{" "}
                    <span className="font-medium text-primary hover:underline">Terms of Use</span>{" "}
                    and{" "}
                    <span className="font-medium text-primary hover:underline">Privacy Policy</span>.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="group mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-xs sm:text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-deep shadow-soft hover:shadow-lift disabled:opacity-50"
              >
                <span>{isLoading ? "Creating Student Account..." : "Create Student Account"}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </form>

            {/* Privacy reassurance & login footer */}
            <div className="mt-6 pt-4 border-t border-border/60 text-center space-y-2">
              <p className="text-xs text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-primary hover:underline">
                  Log in here
                </Link>
              </p>

              <p className="text-[0.68rem] text-muted-foreground/80 flex items-center justify-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Your information is securely encrypted and used for verified ITI employability.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
