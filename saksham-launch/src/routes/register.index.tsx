import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  GraduationCap,
  HandHeart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

export const Route = createFileRoute("/register/")({
  head: () => ({
    meta: [
      { title: "Register · Join the Saksham Ecosystem | Y4D Foundation" },
      {
        name: "description",
        content:
          "Choose your path on Saksham — as an ITI student building employability, a mentor guiding learners, an industry recruiter, or an institution administrator.",
      },
    ],
  }),
  component: RegisterRoleSelectionPage,
});

const ROLES = [
  {
    id: "student",
    title: "Student",
    eyebrow: "ITI Trainees & Graduates",
    description: "Build your skills. Discover verified opportunities. Grow your career.",
    cta: "I'm a Student",
    icon: GraduationCap,
    to: "/register/student",
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "mentor",
    title: "Mentor",
    eyebrow: "Faculty & Industry Experts",
    description: "Guide ITI students toward better career opportunities and shop-floor confidence.",
    cta: "I'm a Mentor",
    icon: HandHeart,
    featured: false,
  },
  {
    id: "recruiter",
    title: "Recruiter",
    eyebrow: "Employers & HR Teams",
    description: "Find verified, skilled ITI talent and recruit apprentices for your organization.",
    cta: "I'm an Employer",
    icon: Building2,
    featured: false,
  },
  {
    id: "admin",
    title: "NGO / Admin",
    eyebrow: "Y4D & ITI Institutions",
    description: "Support and manage the digital employability ecosystem and monitor batch outcomes.",
    cta: "Institution Access",
    icon: ShieldCheck,
    featured: false,
  },
];

function RegisterRoleSelectionPage() {
  const navigate = useNavigate();

  const handleRoleSelect = (role: (typeof ROLES)[number]) => {
    if (role.to) {
      navigate({ to: role.to });
    } else if (role.id === "recruiter") {
      toast.success("Welcome, Tata Motors!", {
        description: "Redirecting to your Recruiter & Industry Partner Portal.",
      });
      navigate({ to: "/recruiter/dashboard" });
    } else if (role.id === "admin") {
      toast.info("Admin Access Notice", {
        description: "Admin & Institution accounts are provisioned directly by Y4D Foundation.",
      });
      navigate({ to: "/login" });
    } else {
      toast.info(`${role.title} Onboarding`, {
        description: "Demo mode — redirecting to student registration flow for full preview.",
      });
      navigate({ to: "/register/student" });
    }
  };

  return (
    <div className="bg-grain min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">
        {/* Top Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 text-xs sm:text-sm font-medium text-primary transition-colors hover:bg-secondary shadow-2xs"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 text-center"
        >
          <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1 text-primary">
            <Sparkles className="h-3 w-3 text-gold fill-gold" />
            Saksham · Y4D Foundation
          </span>

          <h1 className="mx-auto mt-4 max-w-3xl font-serif text-[clamp(2.3rem,4.5vw,3.6rem)] font-bold leading-[1.08] text-foreground">
            How will you use <span className="italic text-primary">Saksham?</span>
          </h1>

          <p className="mx-auto mt-3.5 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Choose the path that best describes you to personalize your experience.
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                onClick={() => handleRoleSelect(r)}
                className={`group relative flex flex-col justify-between rounded-[2.2rem] border p-6 sm:p-7 shadow-soft transition-all duration-300 cursor-pointer ${
                  r.featured
                    ? "border-primary bg-gradient-to-b from-card via-secondary/40 to-card shadow-lift ring-2 ring-primary/20"
                    : "border-border/80 bg-card hover:border-gold/50 hover:shadow-lift"
                }`}
              >
                {r.badge && (
                  <div className="absolute -top-3 right-6">
                    <span className="rounded-full bg-primary px-3 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-primary-foreground shadow-sm">
                      {r.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div
                    className={`grid h-12 w-12 place-items-center rounded-2xl transition-all duration-300 group-hover:scale-105 ${
                      r.featured
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-primary group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <span className="mt-5 block text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                    {r.eyebrow}
                  </span>

                  <h3 className="mt-1 font-serif text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {r.title}
                  </h3>

                  <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-border/60">
                  <div
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                      r.featured
                        ? "bg-primary text-primary-foreground group-hover:bg-primary-deep shadow-2xs"
                        : "bg-secondary text-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                    }`}
                  >
                    <span>{r.cta}</span>
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-12 text-center text-xs sm:text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in here
          </Link>
          <p className="mt-2 text-xs text-muted-foreground/80">
            Saksham is a Y4D Foundation social-impact initiative and is free for all ITI trainees.
          </p>
        </div>
      </div>
    </div>
  );
}
