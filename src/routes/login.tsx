import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import heroStudent from "@/assets/hero-student.jpg";
import workshop from "@/assets/workshop.jpg";
import mentorGuiding from "@/assets/mentor-guiding.jpg";
import industryImg from "@/assets/industry.jpg";
// TODO: Replace mock authentication with backend authentication.
import { authService } from "@/services/authService";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login · Saksham | Y4D Foundation" },
      {
        name: "description",
        content:
          "Sign in to Saksham as a student, mentor, industry partner or institution to access learning, mentorship and opportunities.",
      },
      { property: "og:title", content: "Login · Saksham" },
      {
        property: "og:description",
        content: "Break barriers. Build careers. Sign in to the Saksham employability ecosystem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

const slides = [
  { image: heroStudent, word: "Learn.", caption: "Skills that hold up on the shop floor." },
  { image: mentorGuiding, word: "Connect.", caption: "Mentors who have walked the same path." },
  { image: industryImg, word: "Grow.", caption: "Opportunities that turn into careers." },
  { image: workshop, word: "Become Saksham.", caption: "Capable. Confident. Career-ready." },
];

const roles = ["Student", "Mentor", "Industry", "Admin"] as const;
type Role = (typeof roles)[number];

// TODO: Replace mock authentication with backend authentication.
// Mock credentials accepted for Student prototype (any non-empty email + password).
const MOCK_STUDENT_USER = {
  id: "usr_demo_aarav",
  name: "Aarav Sharma",
  email: "aarav@example.com",
  phone: "+91 98765 43210",
  language: "English",
  role: "STUDENT" as const,
  verification_status: "VERIFIED" as const,
  created_at: new Date().toISOString(),
};

function LoginPage() {
  const [slide, setSlide] = useState(0);
  const [role, setRole] = useState<Role>("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (role === "Student") {
      // TODO: Replace with: const result = await authService.login(email, password)
      // Validate mock credentials — any non-empty email + password works in prototype
      if (!email.trim() || !password.trim()) {
        setLoginError("Invalid email or password.");
        return;
      }

      // Store mock session so the dashboard can load it
      try {
        const mockSession = {
          user: MOCK_STUDENT_USER,
          profile: {
            id: 1,
            user_id: 1,
            age: 20,
            gender: "Male",
            location: "Pune, Maharashtra",
            iti: "Government ITI Pune",
            trade: "Electrician",
            education: "ITI",
            experience: "Beginner",
            career_goal: "Industrial Electrician",
            preferred_industry: "Manufacturing",
            preferred_location: "Pune",
            skill_confidence: 4,
            profile_completion: 90,
            career_readiness_score: 78,
            preferred_language: "Hindi",
          },
          skills: [
            { id: 1, student_profile_id: 1, skill_name: "Basic Wiring", is_gap: false },
            { id: 2, student_profile_id: 1, skill_name: "Electrical Maintenance", is_gap: false },
            { id: 3, student_profile_id: 1, skill_name: "Safety Procedures", is_gap: false },
          ],
          interests: [
            { id: 1, student_profile_id: 1, interest: "Electrical Systems" },
            { id: 2, student_profile_id: 1, interest: "Automation" },
          ],
        };
        localStorage.setItem("saksham_active_student_session_v2", JSON.stringify(mockSession));
      } catch (err) {
        console.warn("[Saksham] Could not persist mock session", err);
      }

      toast.success("Signed in as Aarav Sharma", {
        description: "Welcome to your personalized Saksham workspace.",
      });
      navigate({ to: "/student/dashboard" });
    } else if (role === "Industry") {
      // Validate mock credentials
      if (!email.trim() || !password.trim()) {
        setLoginError("Invalid email or password.");
        return;
      }

      toast.success("Signed in as Tata Motors", {
        description: "Welcome to your Recruiter & Industry Partner Portal.",
      });
      navigate({ to: "/recruiter/dashboard" });
    } else if (role === "Admin") {
      // Validate admin credentials
      if (!email.trim() || !password.trim()) {
        setLoginError("Invalid email or password.");
        return;
      }

      toast.success("Signed in as Y4D Foundation Admin", {
        description: "Welcome to Saksham Platform Mission Control.",
      });
      navigate({ to: "/admin/dashboard" });
    } else {
      toast.success(`${role} sign-in submitted`, {
        description: "Demo mode — connect a backend to authenticate real accounts.",
      });
    }
  };

  const current = slides[slide];

  return (
    <div className="min-h-screen bg-background p-3 sm:p-5">
      <div className="mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[110rem] gap-5 lg:grid-cols-[1.15fr_1fr]">
        {/* left visual */}
        <div className="relative hidden overflow-hidden rounded-[2.5rem] shadow-lift lg:block">
          <AnimatePresence mode="wait">
            <motion.img
              key={current.image}
              src={current.image}
              alt={current.caption}
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/90 via-primary/45 to-primary-deep/35" />

          <div className="relative flex h-full flex-col justify-between p-12">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-cream/30 px-4 py-2 text-sm text-cream transition-colors hover:bg-cream/10"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Saksham
            </Link>

            <div>
              <span className="eyebrow text-gold">Saksham · Y4D Foundation</span>
              <h1 className="mt-5 max-w-lg font-serif text-[clamp(2.4rem,3.6vw,3.6rem)] leading-[1.05] text-cream">
                Break Barriers. Build Careers.
              </h1>
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.word}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.5 }}
                  className="mt-6"
                >
                  <p className="font-serif text-3xl text-gold italic">{current.word}</p>
                  <p className="mt-2 text-cream/75">{current.caption}</p>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.word}
                    type="button"
                    aria-label={`Show slide ${i + 1}`}
                    onClick={() => setSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? "w-10 bg-gold" : "w-4 bg-cream/40"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* right card */}
        <div className="flex items-center justify-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md rounded-[2rem] border border-border bg-card p-8 shadow-lift sm:p-10"
          >
            <Link to="/" className="inline-flex items-center gap-3 lg:hidden">
              <ArrowLeft className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Back to Saksham</span>
            </Link>

            <div className="mt-6 lg:mt-0">
              <p className="font-serif text-3xl text-primary">Saksham</p>
              <p className="eyebrow mt-1.5 text-muted-foreground">Powered by Y4D Foundation</p>
            </div>

            <div className="mt-8 grid grid-cols-4 gap-1.5 rounded-2xl bg-secondary p-1.5">
              {roles.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`relative rounded-xl px-2 py-2.5 text-xs font-semibold transition-colors sm:text-sm ${
                    role === r ? "text-primary-foreground" : "text-primary"
                  }`}
                >
                  {role === r && (
                    <motion.span
                      layoutId="role-pill"
                      className="absolute inset-0 rounded-xl bg-primary"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className="relative">{r}</span>
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase"
                >
                  {role === "Admin" ? "Admin Email" : "Email"}
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setLoginError(null); }}
                  placeholder={
                    role === "Admin" ? "admin@y4dfoundation.org" : "you@example.com"
                  }
                  className="mt-2 w-full rounded-2xl border border-input bg-background px-4 py-3.5 text-sm outline-none transition-colors focus:border-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="text-[0.7rem] tracking-[0.16em] text-muted-foreground uppercase"
                >
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setLoginError(null); }}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-input bg-background px-4 py-3.5 pr-12 text-sm outline-none transition-colors focus:border-primary"
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-muted-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input accent-[oklch(0.394_0.158_22.5)]"
                  />
                  Remember me
                </label>
                <button
                  type="button"
                  onClick={() => toast("Password reset link sent to your registered email.")}
                  className="font-medium text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full rounded-2xl bg-primary py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                {role === "Admin" ? "Admin Login" : "Sign In"}
              </motion.button>

              {/* Error message shown when login fails */}
              {loginError && (
                <p className="rounded-2xl bg-destructive/10 px-4 py-2.5 text-center text-sm font-medium text-destructive">
                  {loginError}
                </p>
              )}
            </form>

            <AnimatePresence mode="wait">
              {role === "Admin" ? (
                <motion.div
                  key="admin-note"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-8 flex items-start gap-3 rounded-2xl bg-secondary/70 px-5 py-4"
                >
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Admin and institution accounts are issued directly by Y4D Foundation. There is
                    no admin registration.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-8 text-center"
                >
                  <p className="text-sm text-muted-foreground">Don't have an account?</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-2">
                    {["Student", "Mentor", "Industry"].map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => {
                          if (r === "Student") navigate({ to: "/register/student" });
                          else if (r === "Industry") navigate({ to: "/register/recruiter" });
                          else navigate({ to: "/join" });
                        }}
                        className="rounded-full border border-primary/25 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-secondary cursor-pointer"
                      >
                        Register as {r}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
