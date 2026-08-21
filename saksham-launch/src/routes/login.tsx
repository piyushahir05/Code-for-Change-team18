import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import heroStudent from "@/assets/hero-student.jpg";
import workshop from "@/assets/workshop.jpg";
import mentorGuiding from "@/assets/mentor-guiding.jpg";
import industryImg from "@/assets/industry.jpg";

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

function LoginPage() {
  const [slide, setSlide] = useState(0);
  const [role, setRole] = useState<Role>("Student");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setSlide((s) => (s + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast.success(`${role} sign-in submitted`, {
      description: "Demo mode — connect a backend to authenticate real accounts.",
    });
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
                        onClick={() => navigate({ to: "/join" })}
                        className="rounded-full border border-primary/25 px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-secondary"
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
