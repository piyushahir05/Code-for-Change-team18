import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
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
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  User,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { VerificationDetailModal } from "@/components/admin/VerificationDetailModal";
import { AdminUserRole, VerificationCandidate } from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/users")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Users Directory · Admin Portal | Saksham" },
      {
        name: "description",
        content: "Platform user management across ITI students, faculty mentors, and industry recruiters.",
      },
    ],
  }),
  component: AdminUsersDirectoryPage,
});

export function AdminUsersDirectoryPage() {
  const searchParams = useSearch({ from: "/admin/users" });
  const [searchQuery, setSearchQuery] = useState(searchParams.q || "");
  const [selectedRole, setSelectedRole] = useState<AdminUserRole | "ALL">("ALL");
  const [users, setUsers] = useState<VerificationCandidate[]>([]);

  // Modal
  const [selectedUser, setSelectedUser] = useState<VerificationCandidate | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = () => {
    setUsers(adminService.getUsers(selectedRole, searchQuery));
  };

  useEffect(() => {
    loadData();
  }, [selectedRole, searchQuery]);

  const handleQuickVerify = (user: VerificationCandidate) => {
    adminService.verifyUser(user.id);
    toast.success(`${user.name} marked as VERIFIED ✓`);
    loadData();
  };

  return (
    <AdminLayout
      pageTitle="Users Directory"
      breadcrumbs={[{ label: "Users" }]}
      actionButton={
        <span className="text-xs font-bold text-muted-foreground bg-secondary px-3.5 py-1.5 rounded-full">
          {users.length} Platform Users
        </span>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Platform User Directory
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Monitor active accounts across ITI student cohorts, industry recruiters, and certified mentors.
            </p>
          </div>
        </div>

        {/* Filter Controls Card */}
        <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft space-y-4 text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Role Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-secondary p-1">
              {(
                [
                  { id: "ALL", label: "All Roles" },
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

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, ITI, or company..."
                className="w-full rounded-2xl border border-border bg-background px-3.5 py-2 pl-9 text-xs outline-none focus:border-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Users Table / Responsive Cards */}
        {users.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
            <h3 className="font-serif text-lg font-bold text-foreground mt-3">No users found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
              No account matched your search query or role filter.
            </p>
          </div>
        ) : (
          <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 bg-secondary/40 text-[0.68rem] uppercase tracking-wider text-muted-foreground font-bold">
                    <th className="p-4 pl-6">User / Entity</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Location</th>
                    <th className="p-4">Specialization</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {users.map((user) => {
                    const isVerified = user.status === "VERIFIED";

                    return (
                      <tr key={user.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="h-10 w-10 rounded-xl object-cover border border-primary/20 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-foreground">{user.name}</p>
                              <p className="text-[0.68rem] text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-primary">
                            {user.role}
                          </span>
                        </td>

                        <td className="p-4 text-muted-foreground">{user.location}</td>

                        <td className="p-4 font-medium text-foreground">
                          {user.role === "STUDENT"
                            ? `${user.trade} (${user.iti?.split("(")[0]})`
                            : user.role === "RECRUITER"
                            ? user.companyName
                            : user.expertise}
                        </td>

                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold ${
                              isVerified
                                ? "bg-emerald-600/15 text-emerald-800"
                                : user.status === "REJECTED"
                                ? "bg-destructive/15 text-destructive"
                                : "bg-amber-500/15 text-amber-900"
                            }`}
                          >
                            ● {user.status}
                          </span>
                        </td>

                        <td className="p-4 text-muted-foreground text-[0.68rem]">
                          {user.submittedAt}
                        </td>

                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(user);
                                setModalOpen(true);
                              }}
                              className="rounded-full border border-border px-3 py-1 text-[0.68rem] font-semibold text-foreground hover:bg-beige"
                            >
                              View Profile
                            </button>

                            {!isVerified && (
                              <button
                                type="button"
                                onClick={() => handleQuickVerify(user)}
                                className="rounded-full bg-emerald-700 px-3 py-1 text-[0.68rem] font-semibold text-white hover:bg-emerald-800"
                              >
                                Verify
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <VerificationDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        candidate={selectedUser}
        onActionComplete={loadData}
      />
    </AdminLayout>
  );
}
