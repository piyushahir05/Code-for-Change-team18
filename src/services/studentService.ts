/**
 * Saksham Student Profile Service Abstraction
 * Source of Truth: Database Schema
 *
 * users: id, name, email, password_hash, role, phone, language, verification_status, created_at
 * student_profiles: id, user_id, age, gender, location, iti, trade, education, experience,
 *                   career_goal, preferred_industry, preferred_location, skill_confidence,
 *                   profile_completion, career_readiness_score, preferred_language
 * student_skills: id, student_profile_id, skill_name, is_gap
 * student_interests: id, student_profile_id, interest
 */

export interface UserAccountData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  language: string; // users.language (Platform UI language)
  role?: "STUDENT";
}

export interface StudentProfileData {
  age: number | null;
  gender: string;
  location: string;
  iti: string;
  trade: string;
  education: string;
  experience: string;
  career_goal: string;
  preferred_industry: string;
  preferred_location: string;
  skill_confidence: number | null; // 1-5 integer
  preferred_language: string; // student_profiles.preferred_language (Career/learning language)
}

export interface StudentSkillInput {
  skill_name: string;
  is_gap?: boolean;
}

export interface StudentInterestInput {
  interest: string;
}

export interface StudentRegistrationState {
  account: UserAccountData;
  profile: StudentProfileData;
  skills: StudentSkillInput[];
  interests: StudentInterestInput[];
}

export interface FinalStudentSubmissionPayload {
  user: {
    name: string;
    email: string;
    phone: string;
    language: string;
    role: "STUDENT";
  };
  profile: {
    age: number;
    gender: string;
    location: string;
    iti: string;
    trade: string;
    education: string;
    experience: string;
    career_goal: string;
    preferred_industry: string;
    preferred_location: string;
    skill_confidence: number;
    preferred_language: string;
  };
  skills: {
    skill_name: string;
  }[];
  interests: {
    interest: string;
  }[];
}

export interface ActiveStudentSession {
  user: {
    id: number;
    name: string;
    email: string;
    phone: string;
    language: string;
    role: "STUDENT";
    verification_status: "PENDING" | "VERIFIED";
    created_at: string;
  };
  profile: {
    id: number;
    user_id: number;
    age: number;
    gender: string;
    location: string;
    iti: string;
    trade: string;
    education: string;
    experience: string;
    career_goal: string;
    preferred_industry: string;
    preferred_location: string;
    skill_confidence: number;
    profile_completion: number;
    career_readiness_score: number;
    preferred_language: string;
  };
  skills: {
    id: number;
    student_profile_id: number;
    skill_name: string;
    is_gap: boolean;
  }[];
  interests: {
    id: number;
    student_profile_id: number;
    interest: string;
  }[];
}

export const INITIAL_REGISTRATION_STATE: StudentRegistrationState = {
  account: {
    name: "Aarav Sharma",
    email: "aarav.sharma@iti.ac.in",
    phone: "+91 98765 43210",
    password: "",
    language: "English",
  },
  profile: {
    age: 20,
    gender: "Male",
    location: "Pune, Maharashtra",
    iti: "Government ITI Pune",
    trade: "Electrician",
    education: "ITI",
    experience: "Beginner",
    career_goal: "Industrial Electrician",
    preferred_industry: "Manufacturing",
    preferred_location: "Pune",
    skill_confidence: 4,
    preferred_language: "Hindi",
  },
  skills: [
    { skill_name: "Basic Wiring", is_gap: false },
    { skill_name: "Electrical Maintenance", is_gap: false },
    { skill_name: "Safety Procedures", is_gap: false },
  ],
  interests: [
    { interest: "Electrical Systems" },
    { interest: "Automation" },
    { interest: "Machines" },
  ],
};

/**
 * Calculates real profile completion percentage based on actual required database fields
 */
export function calculateProfileCompletion(state: StudentRegistrationState): number {
  let score = 0;
  const totalWeight = 10;

  // 1. Account name & email
  if (state.account.name.trim() && state.account.email.trim()) score += 1;
  // 2. Account phone & platform language
  if (state.account.phone.trim() && state.account.language.trim()) score += 1;
  // 3. Age & Gender
  if (state.profile.age && state.profile.gender) score += 1;
  // 4. Location
  if (state.profile.location.trim()) score += 1;
  // 5. ITI & Trade
  if (state.profile.iti.trim() && state.profile.trade.trim()) score += 1;
  // 6. Education & Experience
  if (state.profile.education && state.profile.experience) score += 1;
  // 7. Skills (at least one)
  if (state.skills.length > 0) score += 1;
  // 8. Skill Confidence
  if (state.profile.skill_confidence && state.profile.skill_confidence >= 1) score += 1;
  // 9. Career Goal & Industry
  if (state.profile.career_goal.trim() && state.profile.preferred_industry.trim()) score += 1;
  // 10. Preferred Location & Preferred Learning Language
  if (state.profile.preferred_location.trim() && state.profile.preferred_language.trim()) score += 1;

  return Math.round((score / totalWeight) * 100);
}

const ONBOARDING_STATE_KEY = "saksham_student_registration_v2";
const ACTIVE_STUDENT_SESSION_KEY = "saksham_active_student_session_v2";

export const studentService = {
  /**
   * Save onboarding progress to localStorage
   */
  saveDraft(state: Partial<StudentRegistrationState>): void {
    if (typeof window === "undefined") return;
    try {
      const current = this.getDraft();
      const updated: StudentRegistrationState = {
        account: { ...current.account, ...(state.account || {}) },
        profile: { ...current.profile, ...(state.profile || {}) },
        skills: state.skills !== undefined ? state.skills : current.skills,
        interests: state.interests !== undefined ? state.interests : current.interests,
      };
      localStorage.setItem(ONBOARDING_STATE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Draft save failed", e);
    }
  },

  /**
   * Retrieve current registration draft
   */
  getDraft(): StudentRegistrationState {
    if (typeof window === "undefined") return INITIAL_REGISTRATION_STATE;
    try {
      const stored = localStorage.getItem(ONBOARDING_STATE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Draft read failed", e);
    }
    return INITIAL_REGISTRATION_STATE;
  },

  /**
   * Clear registration draft
   */
  clearDraft(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(ONBOARDING_STATE_KEY);
    } catch (e) {
      console.warn("Draft clear failed", e);
    }
  },

  /**
   * Submit registration to backend (Ready for FastAPI transaction: POST /api/students/register)
   */
  async createProfile(state: StudentRegistrationState): Promise<ActiveStudentSession> {
    // Simulate backend network latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Construct pure payload without system-generated fields
    const payload: FinalStudentSubmissionPayload = {
      user: {
        name: state.account.name,
        email: state.account.email,
        phone: state.account.phone,
        language: state.account.language,
        role: "STUDENT",
      },
      profile: {
        age: Number(state.profile.age) || 20,
        gender: state.profile.gender || "Male",
        location: state.profile.location,
        iti: state.profile.iti,
        trade: state.profile.trade,
        education: state.profile.education || "ITI",
        experience: state.profile.experience || "Beginner",
        career_goal: state.profile.career_goal,
        preferred_industry: state.profile.preferred_industry,
        preferred_location: state.profile.preferred_location,
        skill_confidence: state.profile.skill_confidence || 3,
        preferred_language: state.profile.preferred_language,
      },
      skills: state.skills.map((s) => ({ skill_name: s.skill_name })),
      interests: state.interests.map((i) => ({ interest: i.interest })),
    };

    console.log("Submitting database-aligned registration payload to API:", payload);

    // ── Supabase REST credentials ─────────────────────────────────────────────
    const SUPABASE_URL = "https://espfnslpizfssuntxhah.supabase.co";
    const SUPABASE_ANON_KEY =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcGZuc2xwaXpmc3N1bnR4aGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgwNzMsImV4cCI6MjEwMjg2NDA3M30.lhWSQBlOa1mdL3mYRgTFZkBK5BKzveTsvrdzu0lsTgg";

    const completionScore = calculateProfileCompletion(state);
    let userId = Math.floor(Math.random() * 9000) + 1000;
    let profileId = Math.floor(Math.random() * 9000) + 1000;

    // Attempt direct insert into Supabase DB
    try {
      const headers = {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      };

      // 1. Insert into users table
      const userRes = await fetch(`${SUPABASE_URL}/rest/v1/users`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          name: payload.user.name,
          email: payload.user.email,
          phone: payload.user.phone,
          language: payload.user.language,
          role: "STUDENT",
        }),
        signal: AbortSignal.timeout(4000),
      });

      if (userRes.ok) {
        const createdUsers = await userRes.json();
        if (createdUsers && createdUsers.length > 0) {
          userId = createdUsers[0].id;
        }

        // 2. Insert into student_profiles table
        const profileRes = await fetch(`${SUPABASE_URL}/rest/v1/student_profiles`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            user_id: userId,
            age: payload.profile.age,
            gender: payload.profile.gender,
            location: payload.profile.location,
            iti: payload.profile.iti,
            trade: payload.profile.trade,
            education: payload.profile.education,
            experience: payload.profile.experience,
            career_goal: payload.profile.career_goal,
            preferred_industry: payload.profile.preferred_industry,
            preferred_location: payload.profile.preferred_location,
            skill_confidence: payload.profile.skill_confidence,
            profile_completion: completionScore,
            career_readiness_score: 78,
            preferred_language: payload.profile.preferred_language,
          }),
          signal: AbortSignal.timeout(4000),
        });

        if (profileRes.ok) {
          const createdProfiles = await profileRes.json();
          if (createdProfiles && createdProfiles.length > 0) {
            profileId = createdProfiles[0].id;
          }
        }
      }
    } catch (e) {
      console.warn("Supabase direct insert notice:", e);
    }

    const session: ActiveStudentSession = {
      user: {
        id: userId,
        name: payload.user.name,
        email: payload.user.email,
        phone: payload.user.phone,
        language: payload.user.language,
        role: "STUDENT",
        verification_status: "PENDING",
        created_at: new Date().toISOString(),
      },
      profile: {
        id: profileId,
        user_id: userId,
        age: payload.profile.age,
        gender: payload.profile.gender,
        location: payload.profile.location,
        iti: payload.profile.iti,
        trade: payload.profile.trade,
        education: payload.profile.education,
        experience: payload.profile.experience,
        career_goal: payload.profile.career_goal,
        preferred_industry: payload.profile.preferred_industry,
        preferred_location: payload.profile.preferred_location,
        skill_confidence: payload.profile.skill_confidence,
        profile_completion: completionScore,
        career_readiness_score: 78,
        preferred_language: payload.profile.preferred_language,
      },
      skills: payload.skills.map((s, idx) => ({
        id: idx + 1,
        student_profile_id: profileId,
        skill_name: s.skill_name,
        is_gap: false,
      })),
      interests: payload.interests.map((i, idx) => ({
        id: idx + 1,
        student_profile_id: profileId,
        interest: i.interest,
      })),
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(ACTIVE_STUDENT_SESSION_KEY, JSON.stringify(session));
        localStorage.removeItem(ONBOARDING_STATE_KEY);
      } catch (e) {
        console.warn("Storage write failed", e);
      }
    }

    return session;
  },

  /**
   * Get active authenticated student session for Dashboard
   */
  getActiveSession(): ActiveStudentSession | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(ACTIVE_STUDENT_SESSION_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Storage read failed", e);
    }
    return null;
  },
};
