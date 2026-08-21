import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  Filter,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { VerificationDetailModal } from "@/components/admin/VerificationDetailModal";
import { AdminUserRole, AdminVerificationStatus, VerificationCandidate } from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/verifications")({
  head: () => ({
    meta: [
      { title: "User Verifications · Admin Portal | Saksham" },
      {
        name: "description",
        content: "Review and approve ITI student trade certificates, faculty credentials, and employer registration details.",
      },
    ],
  }),
  component: AdminVerificationsPage,
});

export function AdminVerificationsPage() {
  const [selectedRole, setSelectedRole] = useState<AdminUserRole | "ALL">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<AdminVerificationStatus | "ALL">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifications, setVerifications] = useState<VerificationCandidate[]>([]);

  // Modal
  const [selectedCandidate, setSelectedCandidate] = useState<VerificationCandidate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    const list = await adminService.fetchVerifications(
      selectedRole === "ALL" ? undefined : selectedRole,
      selectedStatus === "ALL" ? undefined : selectedStatus
    );
    setVerifications(list);
  };

  useEffect(() => {
    void loadData();
  }, [selectedRole, selectedStatus]);

  const filteredList = verifications.filter((v) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.email.toLowerCase().includes(q) ||
      v.location.toLowerCase().includes(q) ||
      (v.trade && v.trade.toLowerCase().includes(q)) ||
      (v.iti && v.iti.toLowerCase().includes(q)) ||
      (v.companyName && v.companyName.toLowerCase().includes(q)) ||
      (v.organization && v.organization.toLowerCase().includes(q))
    );
  });

  const handleQuickVerify = (candidate: VerificationCandidate) => {
    adminService.verifyUser(candidate.id);
    toast.success(`Verification approved for ${candidate.name} ✓`);
    void loadData();
  };

  const handleQuickReject = (candidate: VerificationCandidate) => {
    adminService.rejectUser(candidate.id, "Documents failed validation.");
    toast.error(`Verification rejected for ${candidate.name}`);
    void loadData();
  };

  return (
    <AdminLayout
      pageTitle="User Verifications"
      breadcrumbs={[{ label: "Verifications" }]}
      actionButton={
        <span className="text-xs font-bold text-primary bg-gold/25 px-3.5 py-1.5 rounded-full">
          {verifications.filter((v) => v.status === "PENDING").length} Pending Requests
        </span>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Verification Authority Queue
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Verify ITI student certificates, mentor domain expertise, and employer business credentials.
            </p>
          </div>
        </div>

        {/* Filters Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft space-y-4 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-secondary p-1">
              {(
                [
                  { id: "ALL", label: "All Users" },
                  { id: "STUDENT", label: "Students" },
                  { id: "MENTOR", label: "Mentors" },
                  { id: "RECRUITER", label: "Recruiters" },
                ] as { id: AdminUserRole | "ALL"; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedRole(tab.id)}
                  className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                    selectedRole === tab.id
                      ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-2xl bg-secondary p-1">
              {(
                [
                  { id: "PENDING", label: "Pending" },
                  { id: "VERIFIED", label: "Verified" },
                  { id: "REJECTED", label: "Rejected" },
                  { id: "ALL", label: "All Statuses" },
                ] as { id: AdminVerificationStatus | "ALL"; label: string }[]
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedStatus === tab.id
                      ? "bg-card text-foreground shadow-2xs font-bold border border-border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative pt-2 border-t border-border/60">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by candidate name, trade, ITI, company, email, location..."
              className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 pl-10 text-xs outline-none focus:border-primary"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 mt-1 h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        {/* Verification Cards Grid */}
        {filteredList.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <ShieldCheck className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-lg font-bold text-foreground mt-3">
              No verification requests found
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              There are no user profiles matching your selected role and status filters.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredList.map((v) => {
              const isVerified = v.status === "VERIFIED";
              const isRejected = v.status === "REJECTED";

              return (
                <div
                  key={v.id}
                  className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group"
                >
                  <div>
                    {/* Top Role and Status Badges */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.68rem] font-bold text-primary">
                        {v.role}
                      </span>

                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                          isVerified
                            ? "bg-emerald-600/15 text-emerald-800"
                            : isRejected
                            ? "bg-destructive/15 text-destructive"
                            : "bg-amber-500/15 text-amber-900"
                        }`}
                      >
                        ● {v.status}
                      </span>
                    </div>

                    {/* User Header */}
                    <div className="mt-3.5 flex items-center gap-3">
                      <img
                        src={v.avatar}
                        alt={v.name}
                        className="h-12 w-12 rounded-2xl object-cover border border-primary/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <h3 className="font-serif text-base font-bold text-foreground truncate">
                          {v.name}
                        </h3>
                        <p className="text-xs text-primary font-semibold truncate">
                          {v.role === "STUDENT"
                            ? v.trade
                            : v.role === "RECRUITER"
                            ? v.industry
                            : v.expertise}
                        </p>
                        <p className="text-[0.68rem] text-muted-foreground truncate">{v.location}</p>
                      </div>
                    </div>

                    {/* Detail Snapshot */}
                    <div className="mt-3.5 rounded-2xl bg-secondary/50 p-3 text-xs space-y-1">
                      {v.role === "STUDENT" && (
                        <>
                          <p className="text-muted-foreground truncate">
                            ITI: <strong className="text-foreground">{v.iti}</strong>
                          </p>
                          <p className="text-muted-foreground truncate">
                            Goal: <strong className="text-foreground">{v.careerGoal}</strong>
                          </p>
                        </>
                      )}
                      {v.role === "MENTOR" && (
                        <>
                          <p className="text-muted-foreground truncate">
                            Org: <strong className="text-foreground">{v.organization}</strong>
                          </p>
                          <p className="text-muted-foreground truncate">
                            Expertise: <strong className="text-foreground">{v.expertise}</strong>
                          </p>
                        </>
                      )}
                      {v.role === "RECRUITER" && (
                        <>
                          <p className="text-muted-foreground truncate">
                            Company: <strong className="text-foreground">{v.companyName}</strong>
                          </p>
                          <p className="text-muted-foreground truncate">
                            Website: <strong className="text-primary">{v.website || "N/A"}</strong>
                          </p>
                        </>
                      )}
                    </div>

                    <p className="mt-2 text-[0.65rem] text-muted-foreground">
                      Submitted: {v.submittedAt}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCandidate(v);
                        setModalOpen(true);
                      }}
                      className="flex-1 rounded-full border border-border py-2 text-center text-xs font-semibold text-foreground hover:bg-beige"
                    >
                      View Details
                    </button>

                    {!isVerified && (
                      <button
                        type="button"
                        onClick={() => handleQuickVerify(v)}
                        className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 shadow-2xs"
                      >
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>Verify</span>
                      </button>
                    )}

                    {!isRejected && !isVerified && (
                      <button
                        type="button"
                        title="Reject Verification"
                        onClick={() => handleQuickReject(v)}
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

      {/* Verification Modal */}
      <VerificationDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        candidate={selectedCandidate}
        onActionComplete={loadData}
      />
    </AdminLayout>
  );
}
