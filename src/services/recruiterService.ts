/**
 * Saksham Recruiter Service Abstraction
 * Ready for future FastAPI / REST API integration:
 * React -> recruiterService -> GET/POST /api/recruiter/* -> PostgreSQL
 *
 * Currently operates on centralized mock state with local storage persistence.
 */

import {
  Candidate,
  INITIAL_CANDIDATES,
  INITIAL_INTERVIEWS,
  INITIAL_NOTIFICATIONS,
  INITIAL_OPPORTUNITIES,
  INITIAL_RECRUITER_PROFILE,
  InterviewRecord,
  Opportunity,
  RECRUITER_ANALYTICS,
  RecruiterCompanyProfile,
  RecruiterNotification,
} from "@/data/mock/recruiterData";

const RECRUITER_PROFILE_KEY = "saksham_recruiter_profile_v1";
const RECRUITER_OPPORTUNITIES_KEY = "saksham_recruiter_opportunities_v1";
const RECRUITER_CANDIDATES_KEY = "saksham_recruiter_candidates_v1";
const RECRUITER_INTERVIEWS_KEY = "saksham_recruiter_interviews_v1";
const RECRUITER_NOTIFICATIONS_KEY = "saksham_recruiter_notifications_v1";

function getStoredItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`[recruiterService] Could not read ${key}`, e);
    return fallback;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[recruiterService] Could not write ${key}`, e);
  }
}

export interface CandidateFilters {
  searchQuery?: string;
  trade?: string;
  location?: string;
  minReadiness?: number;
  experience?: string;
  verifiedOnly?: boolean;
  sortBy?: "BEST_MATCH" | "READINESS" | "EXPERIENCE" | "NAME";
}

export interface CreateOpportunityInput {
  type: Opportunity["type"];
  title: string;
  trade: string;
  location: string;
  description: string;
  positionsCount: number;
  salaryStipend: string;
  eligibility: string;
  experienceRequired: string;
  deadline: string;
  requiredSkills: { skillName: string; requiredLevel: "Basic" | "Intermediate" | "Advanced" }[];
  benefits: string[];
  status?: "ACTIVE" | "DRAFT";
}

export interface ScheduleInterviewInput {
  candidateId: string;
  opportunityId?: string;
  date: string;
  time: string;
  mode: "IN_PERSON" | "ONLINE";
  locationOrLink: string;
  notes?: string;
}

export const recruiterService = {
  // 1. Company Profile
  // TODO: Replace with GET /api/recruiter/company
  getCompanyProfile(): RecruiterCompanyProfile {
    return getStoredItem<RecruiterCompanyProfile>(RECRUITER_PROFILE_KEY, INITIAL_RECRUITER_PROFILE);
  },

  // TODO: Replace with PUT /api/recruiter/company
  updateCompanyProfile(updated: Partial<RecruiterCompanyProfile>): RecruiterCompanyProfile {
    const current = this.getCompanyProfile();
    const next: RecruiterCompanyProfile = { ...current, ...updated };
    setStoredItem(RECRUITER_PROFILE_KEY, next);
    return next;
  },

  // 2. Recruiter KPI Summary
  // TODO: Replace with GET /api/recruiter/dashboard/kpis
  getKPIs() {
    const opportunities = this.getOpportunities();
    const candidates = this.getCandidates();
    const interviews = this.getInterviews();

    const activeOppCount = opportunities.filter((o) => o.status === "ACTIVE").length;
    const shortlistedCount = candidates.filter((c) => c.applicationStatus === "SHORTLISTED" || c.applicationStatus === "INTERVIEW_SCHEDULED").length;
    const hiredCount = candidates.filter((c) => c.applicationStatus === "SELECTED").length;

    return {
      openOpportunities: activeOppCount,
      totalApplicants: 248, // Aggregate from applicant pool
      shortlisted: shortlistedCount,
      hired: hiredCount,
      activeInterviews: interviews.filter((i) => i.status === "SCHEDULED").length,
    };
  },

  // 3. Analytics & Charts
  // TODO: Replace with GET /api/recruiter/analytics
  getAnalytics() {
    return RECRUITER_ANALYTICS;
  },

  // 4. Smart Talent Match
  // TODO: Replace with GET /api/recruiter/smart-match
  getSmartMatches(opportunityId?: string): Candidate[] {
    const allCandidates = this.getCandidates();
    if (!opportunityId || opportunityId === "all") {
      return [...allCandidates].sort((a, b) => b.matchScore - a.matchScore);
    }

    const opp = this.getOpportunity(opportunityId);
    if (!opp) return allCandidates;

    return allCandidates
      .filter((c) => c.trade.toLowerCase() === opp.trade.toLowerCase() || c.matchedOpportunityId === opp.id)
      .sort((a, b) => b.matchScore - a.matchScore);
  },

  // 5. Candidates / Talent Pool
  // TODO: Replace with GET /api/recruiter/candidates
  getCandidates(filters?: CandidateFilters): Candidate[] {
    const candidates = getStoredItem<Candidate[]>(RECRUITER_CANDIDATES_KEY, INITIAL_CANDIDATES);

    if (!filters) return candidates;

    let result = [...candidates];

    // Search query filter (name, skill, trade, location)
    if (filters.searchQuery?.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.trade.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.skills.some((s) => s.name.toLowerCase().includes(q))
      );
    }

    // Trade filter
    if (filters.trade && filters.trade !== "ALL") {
      result = result.filter((c) => c.trade.toLowerCase() === filters.trade?.toLowerCase());
    }

    // Location filter
    if (filters.location && filters.location !== "ALL") {
      result = result.filter((c) => c.location.toLowerCase().includes(filters.location?.toLowerCase() || ""));
    }

    // Readiness threshold
    if (filters.minReadiness && filters.minReadiness > 0) {
      result = result.filter((c) => c.careerReadinessScore >= filters.minReadiness!);
    }

    // Experience
    if (filters.experience && filters.experience !== "ALL") {
      result = result.filter((c) => c.experience.toLowerCase().includes(filters.experience?.toLowerCase() || ""));
    }

    // Verified only
    if (filters.verifiedOnly) {
      result = result.filter((c) => c.isVerified);
    }

    // Sorting
    if (filters.sortBy === "READINESS") {
      result.sort((a, b) => b.careerReadinessScore - a.careerReadinessScore);
    } else if (filters.sortBy === "EXPERIENCE") {
      result.sort((a, b) => b.age - a.age);
    } else if (filters.sortBy === "NAME") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default: BEST_MATCH
      result.sort((a, b) => b.matchScore - a.matchScore);
    }

    return result;
  },

  // TODO: Replace with GET /api/recruiter/candidates/:id
  getCandidateProfile(id: string): Candidate | undefined {
    const candidates = this.getCandidates();
    return candidates.find((c) => c.id === id);
  },

  // 6. Shortlist Operations
  // TODO: Replace with POST /api/recruiter/candidates/:id/shortlist
  shortlistCandidate(candidateId: string, opportunityId?: string): Candidate {
    const candidates = this.getCandidates();
    const updatedCandidates = candidates.map((c) => {
      if (c.id === candidateId) {
        return {
          ...c,
          applicationStatus: "SHORTLISTED" as const,
          matchedOpportunityId: opportunityId || c.matchedOpportunityId || "opp-001",
        };
      }
      return c;
    });

    setStoredItem(RECRUITER_CANDIDATES_KEY, updatedCandidates);

    // Update Company Profile shortlisted count
    const profile = this.getCompanyProfile();
    const newCount = updatedCandidates.filter((c) => c.applicationStatus === "SHORTLISTED" || c.applicationStatus === "INTERVIEW_SCHEDULED").length;
    this.updateCompanyProfile({
      stats: { ...profile.stats, shortlistedCount: newCount },
    });

    return updatedCandidates.find((c) => c.id === candidateId)!;
  },

  // TODO: Replace with DELETE /api/recruiter/candidates/:id/shortlist
  removeShortlist(candidateId: string): void {
    const candidates = this.getCandidates();
    const updatedCandidates = candidates.map((c) => {
      if (c.id === candidateId) {
        return {
          ...c,
          applicationStatus: "SCREENED" as const,
        };
      }
      return c;
    });

    setStoredItem(RECRUITER_CANDIDATES_KEY, updatedCandidates);
  },

  // TODO: Replace with GET /api/recruiter/shortlisted
  getShortlistedCandidates(tab: "ALL" | "INTERVIEW_PENDING" | "INTERVIEW_SCHEDULED" | "SELECTED" = "ALL"): Candidate[] {
    const all = this.getCandidates();
    const shortlistedPool = all.filter(
      (c) => c.applicationStatus === "SHORTLISTED" || c.applicationStatus === "INTERVIEW_SCHEDULED" || c.applicationStatus === "SELECTED"
    );

    if (tab === "INTERVIEW_PENDING") {
      return shortlistedPool.filter((c) => c.applicationStatus === "SHORTLISTED");
    }
    if (tab === "INTERVIEW_SCHEDULED") {
      return shortlistedPool.filter((c) => c.applicationStatus === "INTERVIEW_SCHEDULED");
    }
    if (tab === "SELECTED") {
      return shortlistedPool.filter((c) => c.applicationStatus === "SELECTED");
    }

    return shortlistedPool;
  },

  // 7. Opportunities Operations
  // TODO: Replace with GET /api/recruiter/opportunities
  getOpportunities(statusTab: "ALL" | "ACTIVE" | "DRAFT" | "CLOSED" = "ALL"): Opportunity[] {
    const opps = getStoredItem<Opportunity[]>(RECRUITER_OPPORTUNITIES_KEY, INITIAL_OPPORTUNITIES);
    if (statusTab === "ALL") return opps;
    return opps.filter((o) => o.status === statusTab);
  },

  // TODO: Replace with GET /api/recruiter/opportunities/:id
  getOpportunity(id: string): Opportunity | undefined {
    const opps = this.getOpportunities();
    return opps.find((o) => o.id === id);
  },

  // TODO: Replace with POST /api/recruiter/opportunities
  createOpportunity(input: CreateOpportunityInput): Opportunity {
    const current = this.getOpportunities();
    const newOpp: Opportunity = {
      id: `opp-00${current.length + 1}`,
      recruiterId: "rec-001",
      type: input.type,
      title: input.title,
      company: "Tata Motors",
      location: input.location,
      trade: input.trade,
      description: input.description,
      positionsCount: input.positionsCount || 10,
      salaryStipend: input.salaryStipend,
      eligibility: input.eligibility,
      experienceRequired: input.experienceRequired,
      deadline: input.deadline,
      postedDate: new Date().toISOString().split("T")[0],
      status: input.status || "ACTIVE",
      applicantsCount: 0,
      shortlistedCount: 0,
      requiredSkills: input.requiredSkills,
      benefits: input.benefits,
    };

    const next = [newOpp, ...current];
    setStoredItem(RECRUITER_OPPORTUNITIES_KEY, next);

    // Update Company Profile stats
    const profile = this.getCompanyProfile();
    this.updateCompanyProfile({
      stats: {
        ...profile.stats,
        activeOpportunities: next.filter((o) => o.status === "ACTIVE").length,
      },
    });

    return newOpp;
  },

  // 8. Interview Scheduling Operations
  // TODO: Replace with GET /api/recruiter/interviews
  getInterviews(tab: "ALL" | "TODAY" | "THIS_WEEK" | "UPCOMING" | "COMPLETED" = "ALL"): InterviewRecord[] {
    const interviews = getStoredItem<InterviewRecord[]>(RECRUITER_INTERVIEWS_KEY, INITIAL_INTERVIEWS);
    const todayStr = new Date().toISOString().split("T")[0];

    if (tab === "TODAY") {
      return interviews.filter((i) => i.date === todayStr && i.status === "SCHEDULED");
    }
    if (tab === "COMPLETED") {
      return interviews.filter((i) => i.status === "COMPLETED");
    }
    if (tab === "UPCOMING" || tab === "THIS_WEEK") {
      return interviews.filter((i) => i.status === "SCHEDULED");
    }
    return interviews;
  },

  // TODO: Replace with POST /api/recruiter/interviews
  scheduleInterview(input: ScheduleInterviewInput): InterviewRecord {
    const candidate = this.getCandidateProfile(input.candidateId);
    const opportunity = input.opportunityId ? this.getOpportunity(input.opportunityId) : undefined;
    const current = this.getInterviews();

    const newInterview: InterviewRecord = {
      id: `int-00${current.length + 1}`,
      candidateId: input.candidateId,
      candidateName: candidate?.name || "Verified Candidate",
      candidateAvatar: candidate?.avatar || "",
      candidateTrade: candidate?.trade || "Electrician",
      opportunityId: input.opportunityId || "opp-001",
      opportunityTitle: opportunity?.title || candidate?.matchedOpportunityTitle || "Electrician Apprentice",
      date: input.date,
      time: input.time,
      mode: input.mode,
      locationOrLink: input.locationOrLink,
      notes: input.notes,
      status: "SCHEDULED",
    };

    const nextInterviews = [newInterview, ...current];
    setStoredItem(RECRUITER_INTERVIEWS_KEY, nextInterviews);

    // Update candidate applicationStatus to INTERVIEW_SCHEDULED
    const candidates = this.getCandidates();
    const updatedCandidates = candidates.map((c) => {
      if (c.id === input.candidateId) {
        return {
          ...c,
          applicationStatus: "INTERVIEW_SCHEDULED" as const,
        };
      }
      return c;
    });
    setStoredItem(RECRUITER_CANDIDATES_KEY, updatedCandidates);

    // Add a recruiter notification
    this.addNotification({
      title: "Interview Scheduled",
      description: `Interview invite sent to ${newInterview.candidateName} for ${newInterview.date} at ${newInterview.time}.`,
      type: "INTERVIEW",
      linkTo: "/recruiter/interviews",
    });

    return newInterview;
  },

  // 9. Notifications
  // TODO: Replace with GET /api/recruiter/notifications
  getNotifications(): RecruiterNotification[] {
    return getStoredItem<RecruiterNotification[]>(RECRUITER_NOTIFICATIONS_KEY, INITIAL_NOTIFICATIONS);
  },

  markNotificationRead(id: string): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => (n.id === id ? { ...n, read: true } : n));
    setStoredItem(RECRUITER_NOTIFICATIONS_KEY, updated);
  },

  markAllNotificationsRead(): void {
    const notifs = this.getNotifications();
    const updated = notifs.map((n) => ({ ...n, read: true }));
    setStoredItem(RECRUITER_NOTIFICATIONS_KEY, updated);
  },

  addNotification(notif: Omit<RecruiterNotification, "id" | "time" | "read">): void {
    const current = this.getNotifications();
    const newNotif: RecruiterNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
    };
    setStoredItem(RECRUITER_NOTIFICATIONS_KEY, [newNotif, ...current]);
  },
};
