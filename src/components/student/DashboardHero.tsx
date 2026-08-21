import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  MapPin,
  Sparkles,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Counter } from "@/components/site/motion-primitives";
import { StudentProfile } from "./student-data";

interface DashboardHeroProps {
  profile: StudentProfile;
  onContinueJourney?: () => void;
  onOpenProfile?: () => void;
}

export function DashboardHero({
  profile,
  onContinueJourney,
  onOpenProfile,
}: DashboardHeroProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(profile.careerReadinessScore);
    }, 150);
    return () => clearTimeout(timer);
  }, [profile.careerReadinessScore]);

  // Circular calculations (radius = 70, circumference = 2 * PI * 70 = 439.82)
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  return (
    <section className="relative overflow-hidden pt-28 pb-10 sm:pt-32 sm:pb-14">
      {/* Background soft radial effects */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain" />
      <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-gold/15 blur-3xl -z-10" />
      <div className="pointer-events-none absolute top-12 right-10 h-80 w-80 rounded-full bg-primary/8 blur-3xl -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card via-card/95 to-beige/40 p-6 shadow-soft sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.25fr_1fr] lg:items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-primary">
                  <Sparkles className="h-3 w-3 text-gold" />
                  Your Employability Journey
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-xs font-medium text-foreground/80">
                  <UserCheck className="h-3.5 w-3.5 text-gold" />
                  Verified Student
                </span>
              </div>

              <h1 className="mt-4 font-serif text-[clamp(2.2rem,3.8vw,3.6rem)] font-bold tracking-tight text-foreground leading-[1.08]">
                Good morning,{" "}
                <span className="italic text-primary">{profile.name.split(" ")[0]}.</span>
              </h1>

              <p className="mt-3.5 max-w-xl text-base text-muted-foreground leading-relaxed sm:text-lg">
                You're making steady progress toward becoming an{" "}
                <span className="font-semibold text-foreground">{profile.careerGoal}</span>. Here's
                what you should focus on next to secure employment.
              </p>

              {/* Compact Trade & Institution details */}
              <div className="mt-6 flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-foreground/80">
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary/80 px-3 py-1.5 border border-border/60">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  <span>{profile.trade}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary/80 px-3 py-1.5 border border-border/60">
                  <Award className="h-4 w-4 text-gold" />
                  <span>{profile.iti}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-2xl bg-secondary/80 px-3 py-1.5 border border-border/60">
                  <MapPin className="h-4 w-4 text-primary/70" />
                  <span>{profile.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onContinueJourney}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-300 hover:bg-primary-deep hover:shadow-lift"
                >
                  <span>Continue Your Journey</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <Link
                  to="/student/profile"
                  onClick={onOpenProfile}
                  className="inline-flex items-center gap-2 rounded-full border border-border/90 bg-card px-5 py-3.5 text-sm font-semibold text-foreground/90 transition-all duration-200 hover:bg-beige hover:border-primary/30"
                >
                  <span>View Profile</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              </div>
            </motion.div>

            {/* Right Visual: Circular Readiness score */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center lg:justify-end"
            >
              <div className="relative flex w-full max-w-sm flex-col items-center justify-center rounded-3xl border border-gold/25 bg-gradient-to-b from-card via-secondary/40 to-card p-6 shadow-lift text-center">
                {/* Decorative background glow */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-radial-gold opacity-30" />

                {/* SVG Progress Ring */}
                <div className="relative h-44 w-44 sm:h-48 sm:w-48">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 160 160">
                    {/* Background Track */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      className="stroke-secondary"
                      strokeWidth="11"
                      fill="transparent"
                    />
                    {/* Secondary subtle progress track */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      className="stroke-gold/40"
                      strokeWidth="11"
                      strokeDasharray={circumference}
                      strokeDashoffset={circumference - (85 / 100) * circumference}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                    {/* Main Burgundy Progress Ring */}
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      className="stroke-primary transition-all duration-1000 ease-out"
                      strokeWidth="12"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>

                  {/* Centered Score */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
                      <Counter to={profile.careerReadinessScore} suffix="%" />
                    </span>
                    <span className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground mt-0.5">
                      Career Readiness
                    </span>
                  </div>
                </div>

                {/* Growth indicator badge */}
                <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200/80">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  <span>+{profile.readinessMonthlyGrowth}% this month</span>
                </div>

                {/* Benchmark microcopy */}
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed max-w-xs">
                  Target: <span className="font-semibold text-foreground">85%</span> for preferred
                  interview shortlisting at top manufacturing partners.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
