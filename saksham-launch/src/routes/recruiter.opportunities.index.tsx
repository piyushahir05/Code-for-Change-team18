import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  BookmarkCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { Opportunity } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/opportunities/")({
  head: () => ({
    meta: [
      { title: "My Opportunities · Recruiter Portal | Saksham" },
      {
        name: "description",
        content: "Manage your active ITI job postings, apprenticeships, and hiring drives.",
      },
    ],
  }),
  component: RecruiterOpportunitiesPage,
});

type TabType = "ALL" | "ACTIVE" | "DRAFT" | "CLOSED";

export function RecruiterOpportunitiesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>("ACTIVE");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);

  useEffect(() => {
    setOpportunities(recruiterService.getOpportunities(activeTab === "ALL" ? "ALL" : activeTab));
  }, [activeTab]);

  const filteredOpps = opportunities.filter((opp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.trade.toLowerCase().includes(q) ||
      opp.location.toLowerCase().includes(q)
    );
  });

  return (
    <RecruiterLayout
      pageTitle="My Opportunities"
      breadcrumbs={[{ label: "Opportunities" }]}
      actionButton={
        <Link
          to="/recruiter/opportunities/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep transition-all"
        >
          <Plus className="h-3.5 w-3.5 text-gold" />
          <span>Post Opportunity</span>
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Header Title & Subtitle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              My Hiring Requirements
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Manage your ITI apprenticeships, campus drives, and discover matching student talent.
            </p>
          </div>
        </div>

        {/* Search & Tabs Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/60 pb-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 rounded-2xl bg-secondary p-1">
            {(["ACTIVE", "DRAFT", "CLOSED", "ALL"] as TabType[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, trade, or city..."
              className="w-full rounded-2xl border border-border bg-background px-3.5 py-2 pl-9 text-xs outline-none focus:border-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>

        {/* Opportunity Cards List */}
        {filteredOpps.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-lg font-bold text-foreground mt-3">
              No opportunities found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              You don't have any opportunities in this tab. Click below to create a new requirement.
            </p>
            <Link
              to="/recruiter/opportunities/new"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-lift"
            >
              <Plus className="h-3.5 w-3.5 text-gold" />
              <span>Post New Opportunity</span>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredOpps.map((opp) => (
              <div
                key={opp.id}
                className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.68rem] font-bold text-primary">
                      {opp.type.replace(/_/g, " ")}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 text-[0.68rem] font-bold ${
                        opp.status === "ACTIVE"
                          ? "text-emerald-700"
                          : opp.status === "DRAFT"
                          ? "text-amber-700"
                          : "text-muted-foreground"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          opp.status === "ACTIVE" ? "bg-emerald-600" : "bg-muted-foreground"
                        }`}
                      />
                      ● {opp.status}
                    </span>
                  </div>

                  {/* Title & Trade */}
                  <h3 className="font-serif text-base font-bold text-foreground mt-3 group-hover:text-primary transition-colors">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-primary font-semibold mt-0.5">{opp.trade}</p>

                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span>{opp.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-semibold text-foreground">{opp.salaryStipend}</span>
                    </div>
                  </div>

                  {/* Required Skills Chips */}
                  <div className="mt-3.5 pt-3 border-t border-border/60">
                    <span className="text-[0.62rem] uppercase font-bold tracking-wider text-muted-foreground">
                      Required Skills
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {opp.requiredSkills.map((s) => (
                        <span
                          key={s.skillName}
                          className="rounded-lg bg-secondary px-2 py-0.5 text-[0.65rem] font-medium text-foreground"
                        >
                          {s.skillName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Stats & Actions */}
                <div className="mt-5 pt-3.5 border-t border-border/60">
                  <div className="grid grid-cols-2 gap-2 text-center rounded-2xl bg-secondary/60 p-2 mb-3.5">
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground">Applicants</span>
                      <p className="font-serif text-base font-bold text-foreground">
                        {opp.applicantsCount}
                      </p>
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground">Shortlisted</span>
                      <p className="font-serif text-base font-bold text-primary">
                        {opp.shortlistedCount}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/recruiter/opportunities/$id"
                      params={{ id: opp.id }}
                      className="flex-1 rounded-full border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-beige transition-colors"
                    >
                      Manage
                    </Link>

                    <Link
                      to="/recruiter/talent"
                      search={{ trade: opp.trade }}
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Candidates</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
}
