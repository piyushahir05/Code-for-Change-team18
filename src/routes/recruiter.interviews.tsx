import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  MapPin,
  Plus,
  Sparkles,
  User,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { InterviewRecord } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/interviews")({
  head: () => ({
    meta: [
      { title: "Scheduled Interviews · Recruiter Portal | Saksham" },
      {
        name: "description",
        content: "Coordinate candidate practical trade interviews, assessments, and shop-floor test slots.",
      },
    ],
  }),
  component: RecruiterInterviewsPage,
});

type TabType = "ALL" | "TODAY" | "THIS_WEEK" | "COMPLETED";

export function RecruiterInterviewsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);

  const loadData = () => {
    setInterviews(recruiterService.getInterviews(activeTab));
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  return (
    <RecruiterLayout
      pageTitle="Scheduled Interviews"
      breadcrumbs={[{ label: "Interviews" }]}
      actionButton={
        <Link
          to="/recruiter/talent"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep transition-all"
        >
          <Plus className="h-3.5 w-3.5 text-gold" />
          <span>Schedule New</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Candidate Interview Schedule
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Manage in-person shop-floor assessments, practical testing slots, and online technical interviews.
            </p>
          </div>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3">
          {(
            [
              { id: "ALL", label: "All Scheduled" },
              { id: "TODAY", label: "Today's Rounds" },
              { id: "THIS_WEEK", label: "This Week" },
              { id: "COMPLETED", label: "Completed" },
            ] as { id: TabType; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "bg-secondary text-foreground hover:bg-beige"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Interviews List */}
        {interviews.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-lg font-bold text-foreground mt-3">
              No interviews in this tab
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              Select a shortlisted candidate to schedule practical shop-floor assessments.
            </p>
            <Link
              to="/recruiter/shortlisted"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground shadow-lift"
            >
              <Users className="h-3.5 w-3.5" />
              <span>View Shortlisted Candidates</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {interviews.map((intv) => (
              <div
                key={intv.id}
                className="rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={intv.candidateAvatar}
                      alt={intv.candidateName}
                      className="h-12 w-12 rounded-2xl object-cover border border-primary/20 shrink-0"
                    />
                    <div>
                      <h3 className="font-serif text-base font-bold text-foreground">
                        {intv.candidateName}
                      </h3>
                      <p className="text-xs text-primary font-semibold">{intv.candidateTrade}</p>
                      <p className="text-[0.68rem] text-muted-foreground">{intv.opportunityTitle}</p>
                    </div>
                  </div>

                  <span className="rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-[0.65rem] font-bold text-emerald-800 shrink-0">
                    ● {intv.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs rounded-2xl bg-secondary/50 p-3 border border-border/70">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="text-[0.62rem] text-muted-foreground block">Date</span>
                      <span className="font-bold text-foreground">{intv.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <span className="text-[0.62rem] text-muted-foreground block">Time Slot</span>
                      <span className="font-bold text-foreground">{intv.time}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    {intv.mode === "IN_PERSON" ? (
                      <MapPin className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <Video className="h-4 w-4 text-primary shrink-0" />
                    )}
                    <span className="font-semibold text-foreground">
                      {intv.mode === "IN_PERSON" ? "In-Person Shop Floor" : "Online Video Call"}
                    </span>
                  </div>

                  <p className="pl-6 text-[0.72rem] leading-relaxed truncate">{intv.locationOrLink}</p>
                </div>

                {intv.notes && (
                  <div className="rounded-xl bg-card p-2.5 border border-border/60 text-[0.68rem] text-muted-foreground">
                    <strong className="text-foreground">Instructions: </strong>
                    {intv.notes}
                  </div>
                )}

                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <Link
                    to="/recruiter/talent/$candidateId"
                    params={{ candidateId: intv.candidateId }}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    View Candidate Profile →
                  </Link>

                  {intv.mode === "ONLINE" ? (
                    <a
                      href={intv.locationOrLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                    >
                      <Video className="h-3.5 w-3.5" />
                      <span>Join Meeting</span>
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toast.info("Venue details sent to candidate via SMS & Email.")}
                      className="inline-flex items-center gap-1 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-beige"
                    >
                      <MapPin className="h-3.5 w-3.5" />
                      <span>View Venue</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
}
