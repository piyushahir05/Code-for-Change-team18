import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  IndianRupee,
  MapPin,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Reveal } from "@/components/site/motion-primitives";
import { Opportunity, RECOMMENDED_OPPORTUNITIES } from "./student-data";

interface OpportunitySectionProps {
  onSelectOpportunity: (opportunity: Opportunity) => void;
}

const FILTER_TYPES = ["All Matches", "Apprenticeships", "Jobs", "Recruitment Drives"];

export function OpportunitySection({ onSelectOpportunity }: OpportunitySectionProps) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>(RECOMMENDED_OPPORTUNITIES);
  const [activeFilter, setActiveFilter] = useState("All Matches");

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpportunities((prev) =>
      prev.map((opp) => {
        if (opp.id === id) {
          const nextSaved = !opp.isSaved;
          toast.success(nextSaved ? "Saved to your bookmarks" : "Removed from bookmarks");
          return { ...opp, isSaved: nextSaved };
        }
        return opp;
      })
    );
  };

  const filtered = opportunities.filter((opp) => {
    if (activeFilter === "Apprenticeships") return opp.type === "APPRENTICESHIP";
    if (activeFilter === "Jobs") return opp.type === "JOB";
    if (activeFilter === "Recruitment Drives") return opp.type === "RECRUITMENT_DRIVE";
    return true;
  });

  return (
    <section className="relative py-14 bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="eyebrow text-primary font-semibold">Matched Placements</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Opportunities that fit you
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Verified opportunities matched to your trade, skills, location and career goal.
                Only active, verified employers.
              </p>
            </div>

            <Link
              to="/student/opportunities"
              className="group inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>View all opportunities</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* Filter Pills */}
        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {FILTER_TYPES.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeFilter === f
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-card text-foreground/75 border border-border/80 hover:bg-beige hover:text-primary"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Opportunities Grid */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filtered.map((opp, idx) => (
            <Reveal key={opp.id} delay={idx * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                onClick={() => onSelectOpportunity(opp)}
                className="group relative flex h-full cursor-pointer flex-col justify-between rounded-[2.2rem] border border-border/80 bg-card p-6 sm:p-7 shadow-soft transition-all duration-300 hover:border-gold/50 hover:shadow-lift"
              >
                <div>
                  {/* Top Bar: Type Badge, Match %, and Bookmark */}
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        opp.type === "APPRENTICESHIP"
                          ? "bg-amber-50 text-amber-900 border border-amber-200"
                          : opp.type === "JOB"
                          ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                          : "bg-purple-50 text-purple-900 border border-purple-200"
                      }`}
                    >
                      {opp.typeLabel}
                    </span>

                    <div className="flex items-center gap-2">
                      {/* Match percentage pill */}
                      <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-gold/20 via-gold/10 to-primary/10 px-3 py-1 text-xs font-bold text-primary border border-gold/40 shadow-2xs">
                        <Sparkles className="h-3 w-3 text-gold fill-gold" />
                        {opp.matchPercentage}% match
                      </span>

                      {/* Bookmark icon */}
                      <button
                        type="button"
                        aria-label={opp.isSaved ? "Remove from bookmarks" : "Save opportunity"}
                        onClick={(e) => toggleSave(opp.id, e)}
                        className={`grid h-8 w-8 place-items-center rounded-full border transition-all ${
                          opp.isSaved
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-secondary/70 text-muted-foreground border-border hover:text-primary hover:bg-beige"
                        }`}
                      >
                        <Bookmark className="h-4 w-4" fill={opp.isSaved ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Title & Company */}
                  <div className="mt-4">
                    <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {opp.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground">
                        <Building2 className="h-4 w-4 text-primary" />
                        {opp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {opp.location}
                      </span>
                    </div>
                  </div>

                  {/* Stipend / Openings Banner */}
                  <div className="mt-4 flex flex-wrap items-center justify-between rounded-2xl bg-secondary/60 px-3.5 py-2.5 border border-border/60 text-xs">
                    <span className="font-bold text-primary text-sm">{opp.stipend}</span>
                    <span className="text-muted-foreground font-medium flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-gold" />
                      Deadline: {opp.deadline}
                    </span>
                  </div>

                  {/* Required Skills Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {opp.requiredSkills.map((sk) => (
                      <span
                        key={sk}
                        className="rounded-lg bg-card border border-border px-2.5 py-1 text-[0.72rem] font-medium text-foreground/80"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Partner
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectOpportunity(opp);
                    }}
                    className="group/btn inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs transition-all hover:bg-primary-deep"
                  >
                    <span>View Opportunity</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
