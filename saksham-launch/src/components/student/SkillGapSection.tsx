import {
  ArrowRight,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  MessageSquare,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/site/motion-primitives";
import { SKILL_GAPS, SkillGap } from "./student-data";

interface SkillGapSectionProps {
  onSelectGap: (gap: SkillGap) => void;
}

export function SkillGapSection({ onSelectGap }: SkillGapSectionProps) {
  const getIcon = (category: string) => {
    switch (category) {
      case "Soft Skills":
        return MessageSquare;
      case "Career Skills":
        return Sparkles;
      case "Digital Skills":
        return FileCheck2;
      default:
        return ShieldAlert;
    }
  };

  return (
    <section className="relative py-12 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="eyebrow text-primary font-semibold">Targeted Skill Development</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Skills to strengthen
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Prioritized areas identified from your trade profile that will directly lift your
                placement readiness and interview confidence.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">
                4 Identified Gaps · High Priority in ITI Electrician
              </span>
            </div>
          </div>
        </Reveal>

        {/* Skill Gap Cards Grid */}
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SKILL_GAPS.map((gap, idx) => {
            const Icon = getIcon(gap.category);
            const isHighPriority = gap.priority === "High";

            return (
              <Reveal key={gap.id} delay={idx * 0.08}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="group relative flex h-full flex-col justify-between rounded-[2rem] border border-border/80 bg-card p-6 shadow-soft transition-all duration-300 hover:border-gold/50 hover:shadow-lift"
                >
                  <div>
                    {/* Header: Priority & Category */}
                    <div className="flex items-center justify-between">
                      <span className="text-[0.7rem] font-semibold tracking-wider text-muted-foreground uppercase">
                        {gap.category}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          isHighPriority
                            ? "bg-primary/10 text-primary border border-primary/25"
                            : "bg-gold/20 text-foreground/80 border border-gold/40"
                        }`}
                      >
                        {gap.priority} Priority
                      </span>
                    </div>

                    {/* Skill Title & Icon */}
                    <div className="mt-4 flex items-start gap-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {gap.name}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                      {gap.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground font-medium">Confidence:</span>
                      <span className="font-bold text-primary">{gap.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold to-primary"
                        style={{ width: `${gap.progress}%` }}
                      />
                    </div>

                    {/* Interactive Action Button */}
                    <button
                      type="button"
                      onClick={() => onSelectGap(gap)}
                      className="mt-4 group/btn flex w-full items-center justify-between rounded-xl border border-border/80 bg-secondary/60 px-3.5 py-2 text-xs font-semibold text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:border-primary"
                    >
                      <span>
                        {gap.name.includes("Interview")
                          ? "Prepare"
                          : gap.name.includes("Communication")
                          ? "Improve"
                          : "Learn"}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
