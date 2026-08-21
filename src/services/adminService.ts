/**
 * Saksham Admin Service Abstraction
 * Aligns with backend /api/admin/* endpoints:
 *
 * GET  /api/admin/analytics -> getAnalytics()
 * GET  /api/admin/verifications -> getVerifications()
 * PUT  /api/admin/users/{user_id}/verify -> verifyUser()
 * GET  /api/admin/opportunities -> getOpportunities()
 * PUT  /api/admin/opportunities/{opportunity_id}/approve -> approveOpportunity()
 * PUT  /api/admin/opportunities/{opportunity_id}/reject -> rejectOpportunity()
 * GET  /api/resources -> getResources()
 *
 * Operates on centralized state with local storage persistence.
 */

import {
  AdminActivityLog,
  AdminAnalyticsData,
  AdminLearningResource,
  AdminNotification,
  AdminOpportunity,
  AdminOpportunityStatus,
  AdminUserRole,
  AdminVerificationStatus,
  INITIAL_ADMIN_ACTIVITY,
  INITIAL_ADMIN_ANALYTICS,
  INITIAL_ADMIN_NOTIFICATIONS,
  INITIAL_ADMIN_OPPORTUNITIES,
  INITIAL_ADMIN_RESOURCES,
  INITIAL_VERIFICATIONS,
  VerificationCandidate,
} from "@/data/mock/adminData";

const ADMIN_ANALYTICS_KEY = "saksham_admin_analytics_v1";
const ADMIN_VERIFICATIONS_KEY = "saksham_admin_verifications_v1";
const ADMIN_OPPORTUNITIES_KEY = "saksham_admin_opportunities_v1";
const ADMIN_RESOURCES_KEY = "saksham_admin_resources_v1";
const ADMIN_ACTIVITY_KEY = "saksham_admin_activity_v1";
const ADMIN_NOTIFICATIONS_KEY = "saksham_admin_notifications_v1";
const ADMIN_API_BASE = "/api/admin";

function getStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[adminService] Could not read ${key}`, e);
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[adminService] Could not write ${key}`, e);
  }
}

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(`${ADMIN_API_BASE}${path}`, {
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...init,
    });

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    if (payload && typeof payload === "object" && "data" in payload && payload.data !== undefined) {
      return payload.data as T;
    }
    return payload as T;
  } catch (error) {
    console.warn(`[adminService] Fetch failed for ${path}`, error);
    return null;
  }
}

export const adminService = {
  // 1. Analytics
  async fetchAnalytics(): Promise<AdminAnalyticsData> {
    const apiAnalytics = await fetchJson<AdminAnalyticsData>("/analytics");
    if (apiAnalytics) {
      setStored(ADMIN_ANALYTICS_KEY, apiAnalytics);
      return apiAnalytics;
    }

    const analytics = this.getAnalytics();
    setStored(ADMIN_ANALYTICS_KEY, analytics);
    return analytics;
  },

  getAnalytics(): AdminAnalyticsData {
    const verifications = this.getVerifications();
    const opportunities = this.getOpportunities();

    const verifiedStudents = verifications.filter((v) => v.role === "STUDENT" && v.status === "VERIFIED").length;
    const verifiedRecruiters = verifications.filter((v) => v.role === "RECRUITER" && v.status === "VERIFIED").length;
    const activeOpps = opportunities.filter((o) => o.status === "APPROVED").length;

    const base = getStored<AdminAnalyticsData>(ADMIN_ANALYTICS_KEY, INITIAL_ADMIN_ANALYTICS);
    return {
      ...base,
      verifiedStudents: base.verifiedStudents + (verifiedStudents > 0 ? verifiedStudents - 1 : 0),
      verifiedRecruiters: base.verifiedRecruiters + (verifiedRecruiters > 0 ? verifiedRecruiters - 1 : 0),
      activeOpportunities: base.activeOpportunities + (activeOpps > 2 ? activeOpps - 2 : 0),
    };
  },

  // 2. Verifications Queue
  async fetchVerifications(role?: AdminUserRole, status?: AdminVerificationStatus): Promise<VerificationCandidate[]> {
    const query = new URLSearchParams();
    if (role) query.set("role", role);
    if (status) query.set("status", status);

    const apiVerifications = await fetchJson<VerificationCandidate[]>(`/verifications${query.toString() ? `?${query.toString()}` : ""}`);
    if (apiVerifications) {
      setStored(ADMIN_VERIFICATIONS_KEY, apiVerifications);
      return apiVerifications;
    }

    const verifications = this.getVerifications(role, status);
    setStored(ADMIN_VERIFICATIONS_KEY, verifications);
    return verifications;
  },

  getVerifications(role?: AdminUserRole, status?: AdminVerificationStatus): VerificationCandidate[] {
    let items = getStored<VerificationCandidate[]>(ADMIN_VERIFICATIONS_KEY, INITIAL_VERIFICATIONS);
    if (role) {
      items = items.filter((v) => v.role === role);
    }
    if (status) {
      items = items.filter((v) => v.status === status);
    }
    return items;
  },

  getVerificationDetail(id: string): VerificationCandidate | undefined {
    const list = this.getVerifications();
    return list.find((v) => v.id === id || v.userId === id);
  },

  verifyUser(id: string): VerificationCandidate {
    const list = this.getVerifications();
    let updatedCandidate: VerificationCandidate | undefined;

    const nextList = list.map((v) => {
      if (v.id === id || v.userId === id) {
        updatedCandidate = { ...v, status: "VERIFIED" as const };
        return updatedCandidate;
      }
      return v;
    });

    setStored(ADMIN_VERIFICATIONS_KEY, nextList);

    if (updatedCandidate) {
      this.addActivity({
        title: "User Verification Approved",
        description: `${updatedCandidate.name} (${updatedCandidate.role}) was verified by Admin.`,
        type: "VERIFICATION",
        actor: "Admin (Y4D Foundation)",
      });
    }

    void fetchJson<VerificationCandidate>(`/users/${id}/verify`, { method: "PUT" }).catch(() => undefined);

    return updatedCandidate || list[0];
  },

  rejectUser(id: string, reason?: string): VerificationCandidate {
    const list = this.getVerifications();
    let updatedCandidate: VerificationCandidate | undefined;

    const nextList = list.map((v) => {
      if (v.id === id || v.userId === id) {
        updatedCandidate = {
          ...v,
          status: "REJECTED" as const,
          rejectionReason: reason || "Incomplete documentation provided.",
        };
        return updatedCandidate;
      }
      return v;
    });

    setStored(ADMIN_VERIFICATIONS_KEY, nextList);

    if (updatedCandidate) {
      this.addActivity({
        title: "User Verification Rejected",
        description: `${updatedCandidate.name} verification request was rejected.`,
        type: "VERIFICATION",
        actor: "Admin (Y4D Foundation)",
      });
    }

    void fetchJson<VerificationCandidate>(`/users/${id}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason: reason || "Incomplete documentation provided." }),
    }).catch(() => undefined);

    return updatedCandidate || list[0];
  },

  // 3. Opportunity Approvals
  async fetchOpportunities(status?: AdminOpportunityStatus): Promise<AdminOpportunity[]> {
    const query = new URLSearchParams();
    if (status) query.set("status", status);

    const apiOpportunities = await fetchJson<AdminOpportunity[]>(`/opportunities${query.toString() ? `?${query.toString()}` : ""}`);
    if (apiOpportunities) {
      setStored(ADMIN_OPPORTUNITIES_KEY, apiOpportunities);
      return apiOpportunities;
    }

    const opportunities = this.getOpportunities(status);
    setStored(ADMIN_OPPORTUNITIES_KEY, opportunities);
    return opportunities;
  },

  getOpportunities(status?: AdminOpportunityStatus): AdminOpportunity[] {
    let items = getStored<AdminOpportunity[]>(ADMIN_OPPORTUNITIES_KEY, INITIAL_ADMIN_OPPORTUNITIES);
    if (status) {
      items = items.filter((o) => o.status === status);
    }
    return items;
  },

  getOpportunityDetail(id: string): AdminOpportunity | undefined {
    const list = this.getOpportunities();
    return list.find((o) => o.id === id);
  },

  approveOpportunity(id: string): AdminOpportunity {
    const list = this.getOpportunities();
    let approvedOpp: AdminOpportunity | undefined;

    const nextList = list.map((o) => {
      if (o.id === id) {
        approvedOpp = { ...o, status: "APPROVED" as const };
        return approvedOpp;
      }
      return o;
    });

    setStored(ADMIN_OPPORTUNITIES_KEY, nextList);

    if (approvedOpp) {
      this.addActivity({
        title: "Opportunity Approved",
        description: `'${approvedOpp.title}' by ${approvedOpp.company} approved for student portal.`,
        type: "OPPORTUNITY",
        actor: "Admin (Y4D Foundation)",
      });
    }

    void fetchJson<AdminOpportunity>(`/opportunities/${id}/approve`, { method: "PUT" }).catch(() => undefined);

    return approvedOpp || list[0];
  },

  rejectOpportunity(id: string, reason?: string): AdminOpportunity {
    const list = this.getOpportunities();
    let rejectedOpp: AdminOpportunity | undefined;

    const nextList = list.map((o) => {
      if (o.id === id) {
        rejectedOpp = {
          ...o,
          status: "REJECTED" as const,
          rejectionReason: reason || "Does not meet stipend or safety requirements.",
        };
        return rejectedOpp;
      }
      return o;
    });

    setStored(ADMIN_OPPORTUNITIES_KEY, nextList);

    if (rejectedOpp) {
      this.addActivity({
        title: "Opportunity Rejected",
        description: `'${rejectedOpp.title}' by ${rejectedOpp.company} rejected by Admin.`,
        type: "OPPORTUNITY",
        actor: "Admin (Y4D Foundation)",
      });
    }

    void fetchJson<AdminOpportunity>(`/opportunities/${id}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason: reason || "Does not meet stipend or safety requirements." }),
    }).catch(() => undefined);

    return rejectedOpp || list[0];
  },

  // 4. Platform Users View
  getUsers(role?: AdminUserRole | "ALL", searchQuery?: string): VerificationCandidate[] {
    const verifications = this.getVerifications();
    let list = [...verifications];

    if (role && role !== "ALL") {
      list = list.filter((u) => u.role === role);
    }

    if (searchQuery?.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.location.toLowerCase().includes(q) ||
          (u.trade && u.trade.toLowerCase().includes(q))
      );
    }

    return list;
  },

  // 5. Learning Resources
  async fetchResources(category?: string): Promise<AdminLearningResource[]> {
    const query = new URLSearchParams();
    if (category && category !== "ALL") query.set("category", category);

    const apiResources = await fetchJson<AdminLearningResource[]>(`/resources${query.toString() ? `?${query.toString()}` : ""}`);
    if (apiResources) {
      setStored(ADMIN_RESOURCES_KEY, apiResources);
      return apiResources;
    }

    const resources = this.getResources(category);
    setStored(ADMIN_RESOURCES_KEY, resources);
    return resources;
  },

  getResources(category?: string): AdminLearningResource[] {
    const resources = getStored<AdminLearningResource[]>(ADMIN_RESOURCES_KEY, INITIAL_ADMIN_RESOURCES);
    if (!category || category === "ALL") return resources;
    return resources.filter((r) => r.category === category);
  },

  // 6. Recent Activity Log
  getActivityLog(): AdminActivityLog[] {
    return getStored<AdminActivityLog[]>(ADMIN_ACTIVITY_KEY, INITIAL_ADMIN_ACTIVITY);
  },

  addActivity(item: Omit<AdminActivityLog, "id" | "time">): void {
    const current = this.getActivityLog();
    const newItem: AdminActivityLog = {
      ...item,
      id: `act-${Date.now()}`,
      time: "Just now",
    };
    setStored(ADMIN_ACTIVITY_KEY, [newItem, ...current]);
  },

  // 7. Notifications
  getNotifications(): AdminNotification[] {
    return getStored<AdminNotification[]>(ADMIN_NOTIFICATIONS_KEY, INITIAL_ADMIN_NOTIFICATIONS);
  },

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const next = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStored(ADMIN_NOTIFICATIONS_KEY, next);
  },

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications();
    const next = notifs.map((n) => ({ ...n, read: true }));
    setStored(ADMIN_NOTIFICATIONS_KEY, next);
  },
};
