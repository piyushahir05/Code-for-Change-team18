import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Compass,
  GraduationCap,
  Sparkles,
  User,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

interface QuickActionsProps {
  onUpdateProfile: () => void;
}

const ACTIONS = [
  {
    title: "Update Profile",
    description: "Keep your skills, ITI trade, and career goals current.",
    icon: User,
    to: "/student/profile",
    isAction: true,
  },
  {
    title: "Find Opportunities",
    description: "Explore verified jobs, apprenticeships & campus drives.",
    icon: Compass,
    to: "/student/opportunities",
  },
  {
    title: "Continue Learning",
    description: "Pick up your coursework and skill assessments.",
    icon: GraduationCap,
    to: "/student/learning",
  },
  {
    title: "Find a Mentor",
    description: "Get guidance from industrial engineers and trade experts.",
    icon: Users,
    to: "/student/mentorship",
  },
];

export function QuickActions({ onUpdateProfile }: QuickActionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ACTIONS.map((act) => {
        const Icon = act.icon;
        return (
          <Link
            key={act.title}
            to={act.to}
            className="group relative flex items-start gap-4 rounded-3xl border border-border/80 bg-card p-5 shadow-2xs transition-all duration-300 hover:border-gold/50 hover:bg-beige/40 hover:shadow-soft"
          >
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-primary transition-all duration-300 group-hover:scale-105 group-hover:bg-primary group-hover:text-primary-foreground shadow-2xs">
              <Icon className="h-5 w-5" />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold text-foreground group-hover:text-primary transition-colors">
                  {act.title}
                </h4>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                {act.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
