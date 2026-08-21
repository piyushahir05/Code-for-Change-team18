/**
 * Saksham Auth Service Abstraction
 * Ready for Supabase Auth integration:
 * React -> Supabase Auth -> JWT -> FastAPI -> PostgreSQL
 */

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  mobile: string;
  role: "STUDENT" | "MENTOR" | "RECRUITER" | "ADMIN";
  createdAt: string;
}

export interface RegisterStudentInput {
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
}

const AUTH_USER_KEY = "saksham_auth_user";

export const authService = {
  /**
   * Register a new student account
   */
  async registerStudent(input: RegisterStudentInput): Promise<AuthUser> {
    // Simulate network latency for API readiness
    await new Promise((resolve) => setTimeout(resolve, 600));

    const newUser: AuthUser = {
      id: `usr_${Date.now()}`,
      email: input.email,
      fullName: input.fullName,
      mobile: input.mobile,
      role: "STUDENT",
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      } catch (e) {
        console.warn("Storage write failed", e);
      }
    }

    return newUser;
  },

  /**
   * Get currently authenticated user session
   */
  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn("Storage read failed", e);
    }
    return {
      id: "usr_demo_aarav",
      email: "aarav.sharma@example.com",
      fullName: "Aarav Sharma",
      mobile: "+91 98765 43210",
      role: "STUDENT",
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Clear session on logout
   */
  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(AUTH_USER_KEY);
      } catch (e) {
        console.warn("Storage clear failed", e);
      }
    }
  },
};
