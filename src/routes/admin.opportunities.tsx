import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { OpportunityReviewModal } from "@/components/admin/OpportunityReviewModal";
import { AdminOpportunity, AdminOpportunityStatus } from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/opportunities")({
  head: () => ({
    meta: [
      { title: "Opportunity Approvals · Admin Portal | Saksham" },
      {
        name: "description",
        content: "Review, approve, and verify industry apprenticeship and job postings before they go live on the student portal.",
      },
    ],
  }),
  component: AdminOpportunitiesPage,
});

export function AdminOpportunitiesPage() {
  const [selectedStatus, setSelectedStatus] = useState<AdminOpportunityStatus | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [opportunities, setOpportunities] = useState<AdminOpportunity[]>([]);

  // Modal state
  const [selectedOpportunity, setSelectedOpportunity] = useState<AdminOpportunity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    const list = await adminService.fetchOpportunities(selectedStatus === "ALL" ? undefined : selectedStatus);
    setOpportunities(list);
  };

  useEffect(() => {
    void loadData();
  }, [selectedStatus]);

  const filteredList = opportunities.filter((opp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.company.toLowerCase().includes(q) ||
      opp.trade.toLowerCase().includes(q) ||
      opp.location.toLowerCase().includes(q)
    );
  });

  const handleQuickApprove = (opp: AdminOpportunity) => {
    adminService.approveOpportunity(opp.id);
    toast.success(`'${opp.title}' approved successfully ✓`, {
      description: "Opportunity is now live and visible to verified ITI students.",
    });
    void loadData();
  };

  const handleQuickReject = (opp: AdminOpportunity) => {
    adminService.rejectOpportunity(opp.id, "Does not satisfy safety/stipend criteria.");
    toast.error(`'${opp.title}' rejected`);
    void loadData();
  };

  return (
    <AdminLayout
      pageTitle="Opportunity Approvals"
      breadcrumbs={[{ label: "Opportunities" }]}
      actionButton={
        <span className="text-xs font-bold text-primary bg-gold/25 px-3.5 py-1.5 rounded-full">
          {opportunities.filter((o) => o.status === "PENDING").length} Awaiting Approval
        </span>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Opportunity Approval Governance
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review recruiter postings to ensure NAPS compliance, fair stipends, and safe shop-floor conditions.
            </p>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft space-y-4 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-secondary p-1">
              {(
                [
                  { id: "PENDING", label: "Pending Approval" },
                  { id: "APPROVED", label: "Approved (Live)" },
                  { id: "REJECTED", label: "Rejected" },
                  { id: "ALL", label: "All Postings" },
                ] as { id: AdminOpportunityStatus | "ALL"; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedStatus === tab.id
                      ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by company, trade, title, location..."
                className="w-full rounded-2xl border border-border bg-background px-3.5 py-2 pl-9 text-xs outline-none focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Opportunities Grid */}
        {filteredList.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-lg font-bold text-foreground mt-3">
              No opportunities found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              There are no opportunity postings matching your current status filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((opp) => {
              const isApproved = opp.status === "APPROVED";
              const isRejected = opp.status === "REJECTED";

              return (
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
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                          isApproved
                            ? "bg-emerald-600/15 text-emerald-800"
                            : isRejected
                            ? "bg-destructive/15 text-destructive"
                            : "bg-amber-500/15 text-amber-900"
                        }`}
                      >
                        ● {opp.status}
                      </span>
                    </div>

                    {/* Title & Employer */}
                    <h3 className="font-serif text-base font-bold text-foreground mt-3 group-hover:text-primary transition-colors">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-primary font-semibold mt-0.5">
                      {opp.company} · {opp.location}
                    </p>

                    <div className="mt-3 rounded-2xl bg-secondary/50 p-3 text-xs space-y-1">
                      <p className="text-muted-foreground">
                        Target Trade: <strong className="text-foreground">{opp.trade}</strong>
                      </p>
                      <p className="text-muted-foreground">
                        Stipend: <strong className="text-primary">{opp.salaryStipend}</strong>
                      </p>
                      <p className="text-muted-foreground">
                        Deadline: <strong className="text-foreground">{opp.deadline}</strong>
                      </p>
                    </div>

                    {/* Required Skills Chips */}
                    {opp.requiredSkills && opp.requiredSkills.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {opp.requiredSkills.slice(0, 3).map((s) => (
                            <span
                              key={s}
                              className="rounded-lg bg-card px-2 py-0.5 text-[0.65rem] font-medium text-foreground border border-border"
                            >
                              {s}
                            </span>
                          ))}
                          {opp.requiredSkills.length > 3 && (
                            <span className="rounded-lg bg-secondary/60 px-1.5 py-0.5 text-[0.62rem] text-muted-foreground">
                              +{opp.requiredSkills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <p className="mt-2 text-[0.65rem] text-muted-foreground">
                      Submitted: {opp.submittedAt}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOpportunity(opp);
                        setModalOpen(true);
                      }}
                      className="flex-1 rounded-full border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-beige"
                    >
                      Review
                    </button>

                    {!isApproved && (
                      <button
                        type="button"
                        onClick={() => handleQuickApprove(opp)}
                        className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-2xs"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {!isRejected && !isApproved && (
                      <button
                        type="button"
                        title="Reject Opportunity"
                        onClick={() => handleQuickReject(opp)}
                        className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Opportunity Review Modal */}
      <OpportunityReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        opportunity={selectedOpportunity}
        onActionComplete={loadData}
      />
    </AdminLayout>
  );
}
