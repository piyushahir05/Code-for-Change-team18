import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  MapPin,
  MessageSquare,
  Sparkles,
  Star,
  Users,
  Video,
} from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/site/motion-primitives";
import {
  Mentor,
  MENTORS,
  MentorshipSession,
  UPCOMING_MENTORSHIP,
} from "./student-data";

interface MentorshipSectionProps {
  onRequestSession: (mentor: Mentor) => void;
  onViewSessionDetails: (session: MentorshipSession) => void;
}

export function MentorshipSection({
  onRequestSession,
  onViewSessionDetails,
}: MentorshipSectionProps) {
  const matchedMentor = MENTORS[0]; // Sunita Deshmukh
  const upcomingSession = UPCOMING_MENTORSHIP;

  return (
    <section className="relative py-14 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="eyebrow text-primary font-semibold">1-on-1 Trade Guidance</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                You don't have to figure it out alone.
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Connect with mentors who understand your trade, industry and career goals.
                Real shop-floor veterans guiding ITI students.
              </p>
            </div>

            <Link
              to="/student/mentorship"
              className="group inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>Explore all mentors</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Matched Mentor Card: Sunita Deshmukh */}
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col justify-between rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-gold font-semibold">Matched Mentor for Your Trade</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 border border-emerald-200">
                    <Clock className="h-3 w-3 text-emerald-600" />
                    {matchedMentor.availability}
                  </span>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-start gap-5">
                  <img
                    src={matchedMentor.image}
                    alt={matchedMentor.name}
                    className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover border-2 border-primary/20 shadow-sm shrink-0"
                  />
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-foreground">
                      {matchedMentor.name}
                    </h3>
                    <p className="text-sm font-medium text-primary mt-0.5">
                      {matchedMentor.role}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {matchedMentor.industry} · {matchedMentor.experience}
                    </p>

                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                        <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                        <span>{matchedMentor.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        ({matchedMentor.sessionsCount} ITI students mentored)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expertise tags */}
                <div className="mt-6">
                  <p className="text-[0.72rem] tracking-wider uppercase font-semibold text-muted-foreground mb-2">
                    Areas of Guidance
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {matchedMentor.expertise.map((exp) => (
                      <span
                        key={exp}
                        className="rounded-xl bg-secondary px-3 py-1 text-xs font-medium text-foreground/85 border border-border/60"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action footer */}
              <div className="mt-8 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  Free 1-on-1 session powered by Y4D Foundation
                </p>
                <button
                  type="button"
                  onClick={() => onRequestSession(matchedMentor)}
                  className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-2xs transition-all hover:bg-primary-deep hover:shadow-lift"
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Request Session</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </Reveal>

          {/* Upcoming Confirmed Mentorship Card */}
          <Reveal delay={0.15}>
            <div className="flex h-full flex-col justify-between rounded-[2.5rem] border border-gold/40 bg-gradient-to-br from-card via-card to-gold/10 p-6 sm:p-8 shadow-soft">
              <div>
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-primary font-semibold">Upcoming Mentorship</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                    CONFIRMED
                  </span>
                </div>

                <div className="mt-5">
                  <h4 className="font-serif text-xl font-bold text-foreground">
                    {upcomingSession.title}
                  </h4>
                  <p className="mt-1 text-xs font-semibold text-muted-foreground">
                    With {upcomingSession.mentorName}
                  </p>
                </div>

                <div className="mt-5 space-y-2.5 rounded-2xl bg-card/80 p-4 border border-border/80">
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <Calendar className="h-4 w-4 text-gold" />
                    <span>{upcomingSession.dateTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <Video className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-primary">{upcomingSession.mode} Session</span>
                  </div>
                  <p className="text-[0.72rem] text-muted-foreground pl-6">
                    {upcomingSession.locationOrLink}
                  </p>
                </div>

                <div className="mt-4 rounded-xl bg-amber-50/80 p-3 text-[0.72rem] text-amber-900 border border-amber-200">
                  Tip: Have your resume and technical trade questions ready before joining.
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => onViewSessionDetails(upcomingSession)}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <span>View Meeting Details & Prep</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
