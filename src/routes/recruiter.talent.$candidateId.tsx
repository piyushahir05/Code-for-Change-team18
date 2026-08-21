import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  GraduationCap,
  Heart,
  MapPin,
  Plus,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { ScheduleInterviewModal } from "@/components/recruiter/ScheduleInterviewModal";
import { Candidate, Opportunity } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/talent/$candidateId")({
  head: () => ({
    meta: [
      { title: "Candidate Profile · Recruiter Portal | Saksham" },
      {
        name: "description",
        content: "Verified ITI candidate profile, practical skill competencies, certifications, and career journey.",
      },
    ],
  }),
  component: RecruiterCandidateProfilePage,
});

const JOURNEY_STEPS = [
  { step: 1, title: "Registered on Saksham", desc: "Identity & ITI trade verified" },
  { step: 2, title: "ITI Practical Training", desc: "Workshop curriculum completed" },
  { step: 3, title: "Employability Modules", desc: "5S, Safety & Digital tools passed" },
  { step: 4, title: "1-on-1 Mentorship", desc: "Shop-floor readiness assessment" },
  { step: 5, title: "Applied / Shortlisted", desc: "Matched to Tata Motors requirement" },
  { step: 6, title: "Interview & Induction", desc: "Final practical & offer stage" },
];

export function RecruiterCandidateProfilePage() {
  const { candidateId } = useParams({ from: "/recruiter/talent/$candidateId" });
  const [candidate, setCandidate] = useState<Candidate | undefined>();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);

  const loadData = () => {
    const found = recruiterService.getCandidateProfile(candidateId);
    setCandidate(found);
    setOpportunities(recruiterService.getOpportunities("ACTIVE"));
  };

  useEffect(() => {
    loadData();
  }, [candidateId]);

  if (!candidate) {
    return (
      <RecruiterLayout pageTitle="Candidate Not Found">
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Candidate not found in talent pool.</p>
          <Link
            to="/recruiter/talent"
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Talent Pool
          </Link>
        </div>
      </RecruiterLayout>
    );
  }

  const isShortlisted =
    candidate.applicationStatus === "SHORTLISTED" ||
    candidate.applicationStatus === "INTERVIEW_SCHEDULED";

  const handleShortlistToggle = () => {
    if (isShortlisted) {
      recruiterService.removeShortlist(candidate.id);
      toast.info(`${candidate.name} removed from shortlist`);
    } else {
      recruiterService.shortlistCandidate(candidate.id);
      toast.success("Candidate shortlisted successfully ✓", {
        description: `${candidate.name} is now available in your Shortlisted pipeline.`,
      });
    }
    loadData();
  };

  return (
    <RecruiterLayout
      pageTitle={candidate.name}
      breadcrumbs={[{ label: "Talent Pool", to: "/recruiter/talent" }, { label: candidate.name }]}
      actionButton={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShortlistToggle}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              isShortlisted
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-secondary text-foreground hover:bg-beige border border-border"
            }`}
          >
            {isShortlisted ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[3]" />
                <span>Shortlisted</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                <span>Shortlist</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => setInterviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep"
          >
            <Calendar className="h-3.5 w-3.5 text-gold" />
            <span>Schedule Interview</span>
          </button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 1. Hero Candidate Header Card */}
        <div className="rounded-[2.5rem] border border-gold/40 bg-gradient-to-r from-card via-secondary/40 to-gold/10 p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <img
                src={candidate.avatar}
                alt={candidate.name}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover border-2 border-primary/20 shadow-lift shrink-0"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    {candidate.name}
                  </h1>
                  {candidate.isVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      ● Verified Candidate
                    </span>
                  )}
                </div>

                <p className="font-semibold text-primary text-sm sm:text-base mt-0.5">
                  {candidate.trade} · {candidate.careerGoal}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    {candidate.iti}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {candidate.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Match score & Career readiness ring preview */}
            <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
              <div className="rounded-2xl bg-card p-4 border border-border text-center shadow-2xs">
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold tracking-wider">
                  Smart Match
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-emerald-700">
                  {candidate.matchScore}%
                </p>
                <span className="text-[0.62rem] text-emerald-800 font-semibold">Requirement Fit</span>
              </div>

              <div className="rounded-2xl bg-card p-4 border border-border text-center shadow-2xs">
                <span className="text-[0.65rem] text-muted-foreground uppercase font-bold tracking-wider">
                  Readiness
                </span>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-primary">
                  {candidate.careerReadinessScore}%
                </p>
                <span className="text-[0.62rem] text-muted-foreground font-semibold">Certified Aptitude</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Key Metrics Bar */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Profile Completeness</span>
            <p className="font-serif text-lg font-bold text-foreground mt-1">
              {candidate.profileCompletion}% Complete
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Experience</span>
            <p className="font-serif text-lg font-bold text-foreground mt-1">{candidate.experience}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Education</span>
            <p className="font-serif text-lg font-bold text-foreground mt-1">{candidate.education}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Language Support</span>
            <p className="font-serif text-lg font-bold text-foreground mt-1">{candidate.preferredLanguage}</p>
          </div>
        </div>

        {/* 3. Main Content Columns */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Left Column: Skills Competency, Projects, Certifications */}
          <div className="space-y-6">
            {/* Practical Skill Competency Breakdown */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="eyebrow text-gold font-bold">Practical Competencies</span>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Verified Trade Skills
                  </h3>
                </div>
                <span className="text-xs text-muted-foreground">Based on ITI workshop logbook</span>
              </div>

              <div className="space-y-3">
                {candidate.skills.map((skill) => (
                  <div key={skill.name} className="text-xs">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-foreground flex items-center gap-1.5">
                        {skill.name}
                        {skill.isVerified && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                      </span>
                      <span className="font-serif font-bold text-primary">{skill.score}%</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-gold to-primary"
                        style={{ width: `${skill.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practical Workshop Projects */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="eyebrow text-gold font-bold">Shop-floor Projects</span>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Hands-on Practical Assignments
                  </h3>
                </div>
              </div>

              <div className="space-y-3.5">
                {candidate.projects.map((p) => (
                  <div
                    key={p.title}
                    className="rounded-2xl bg-secondary/40 p-4 border border-border text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-foreground text-sm">{p.title}</h4>
                      <span className="text-[0.68rem] text-muted-foreground">{p.completionDate}</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{p.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.technologies.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-card px-2 py-0.5 text-[0.68rem] font-medium text-foreground border border-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="eyebrow text-gold font-bold">Credentials</span>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Verified Certifications & Licenses
                  </h3>
                </div>
              </div>

              <div className="space-y-2.5">
                {candidate.certifications.map((c) => (
                  <div
                    key={c.title}
                    className="flex items-center justify-between p-3 rounded-2xl bg-secondary/30 border border-border text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <Award className="h-5 w-5 text-gold shrink-0" />
                      <div>
                        <p className="font-bold text-foreground">{c.title}</p>
                        <p className="text-[0.68rem] text-muted-foreground">
                          {c.issuer} · Issued {c.issueDate}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: 6-Stage Career Progression Roadmap & Learning Progress */}
          <div className="space-y-6">
            {/* 6-Stage Career Roadmap */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="eyebrow text-gold font-bold">Progression Track</span>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Candidate Career Journey
                  </h3>
                </div>
              </div>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {JOURNEY_STEPS.map((step) => {
                  const isDone = candidate.careerJourneyStep >= step.step;
                  const isCurrent = candidate.careerJourneyStep === step.step;

                  return (
                    <div key={step.step} className="relative text-xs">
                      <div
                        className={`absolute -left-6 top-0 grid h-5 w-5 place-items-center rounded-full text-[0.62rem] font-bold ${
                          isDone
                            ? "bg-primary text-primary-foreground"
                            : "border border-border bg-card text-muted-foreground"
                        }`}
                      >
                        {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : step.step}
                      </div>

                      <div>
                        <p
                          className={`font-bold ${
                            isCurrent ? "text-primary" : isDone ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className="text-[0.68rem] text-muted-foreground">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Learning Progress Modules */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div>
                  <span className="eyebrow text-gold font-bold">Saksham LMS</span>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    Employability Learning Modules
                  </h3>
                </div>
              </div>

              <div className="space-y-3">
                {candidate.learningProgress.map((m) => (
                  <div key={m.moduleName} className="text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-foreground">{m.moduleName}</span>
                      <span className="text-muted-foreground">{m.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recruiter Action Card */}
            <div className="rounded-3xl border border-gold/40 bg-gradient-to-b from-card via-secondary/30 to-card p-5 shadow-2xs text-xs space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold">
                <Sparkles className="h-4 w-4 text-gold fill-gold" />
                <span>Next Hiring Step</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Candidate is verified and ready for shop-floor technical assessment. Schedule an interview slot to meet at Tata Motors plant.
              </p>
              <button
                type="button"
                onClick={() => setInterviewModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-primary py-3 font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep transition-all"
              >
                <Calendar className="h-4 w-4 text-gold" />
                <span>Schedule Interview Round</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <ScheduleInterviewModal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        candidate={candidate}
        opportunities={opportunities}
        onScheduledSuccess={loadData}
      />
    </RecruiterLayout>
  );
}
