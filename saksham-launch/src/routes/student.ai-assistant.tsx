import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  Sparkles,
  TrendingUp,
  AlertCircle,
  BookOpen,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Loader2,
  Send,
  User,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Footer } from "@/components/site/Footer";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  INITIAL_STUDENT_PROFILE,
  StudentProfile,
} from "@/components/student/student-data";
import { studentService } from "@/services/studentService";

// ── Supabase public credentials (anon key — safe client-side) ─────────────────
const SUPABASE_URL = "https://espfnslpizfssuntxhah.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcGZuc2xwaXpmc3N1bnR4aGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgwNzMsImV4cCI6MjEwMjg2NDA3M30.lhWSQBlOa1mdL3mYRgTFZkBK5BKzveTsvrdzu0lsTgg";

// ── AI Bot endpoint ────────────────────────────────────────────────────────────
const AI_BOT_URL = "http://localhost:8000";

// ── Static offline fallback profiles ─────────────────────────────────────────
const FALLBACK_PROFILES: Record<number, any> = {
  1: {
    name: "Aarav Patil", trade: "Electrician",
    career_goal: "Become an industrial maintenance electrician and learn automation",
    career_readiness_score: 76,
    skill_gaps: ["PLC Basics", "Control Panels"],
    existing_skills: ["Electrical Wiring", "Motor Control", "Electrical Safety"],
    location: "Pune", iti: "Government ITI Pune",
  },
  2: {
    name: "Saanvi Jadhav", trade: "Fitter",
    career_goal: "Build a career in plant maintenance and production",
    career_readiness_score: 72,
    skill_gaps: ["Hydraulics", "Quality Inspection"],
    existing_skills: ["Mechanical Assembly", "Measurement & Gauges", "Preventive Maintenance"],
    location: "Nashik", iti: "Government ITI Nashik",
  },
  3: {
    name: "Rohan Shinde", trade: "Welder",
    career_goal: "Become a certified industrial welding technician",
    career_readiness_score: 68,
    skill_gaps: ["TIG Welding", "Weld Inspection"],
    existing_skills: ["MIG Welding", "Welding Safety", "Fabrication"],
    location: "Nagpur", iti: "Government ITI Nagpur",
  },
  4: {
    name: "Isha More", trade: "COPA",
    career_goal: "Start a career in IT support and digital operations",
    career_readiness_score: 80,
    skill_gaps: ["Basic Networking", "MS Excel"],
    existing_skills: ["Data Entry", "Digital Literacy", "Computer Hardware"],
    location: "Mumbai", iti: "Government ITI Mumbai",
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface AnalysisData {
  greeting: string;
  profile_summary: string;
  recommended_topics: { topic: string; reason: string }[];
  recommended_courses: { course: string; reason: string }[];
  roadmap: { step: number; title: string; description: string }[];
  next_action: { title: string; description: string };
  model_used?: string;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

export const Route = createFileRoute("/student/ai-assistant")({
  head: () => ({
    meta: [{ title: "Saksham AI Career Assistant · Saksham" }],
  }),
  component: StudentAIAssistantPage,
});

// ── Fetch live student profile from Supabase REST ─────────────────────────────
async function fetchSupabaseProfile(studentId: number): Promise<any | null> {
  try {
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    };
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/student_profiles?id=eq.${studentId}&select=id,trade,career_goal,career_readiness_score,location,iti,users(name)&limit=1`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    const rows = profileRes.ok ? await profileRes.json() : [];
    if (!rows || rows.length === 0) return null;
    const row = rows[0];

    const skillsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/student_skills?student_profile_id=eq.${studentId}&select=skill_name,is_gap`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    const skills = skillsRes.ok ? await skillsRes.json() : [];

    return {
      student_id: studentId,
      name: row.users?.name ?? `Student ${studentId}`,
      trade: row.trade ?? "",
      career_goal: row.career_goal ?? "",
      career_readiness_score: row.career_readiness_score ?? 0,
      skill_gaps: skills.filter((s: any) => s.is_gap).map((s: any) => s.skill_name),
      existing_skills: skills.filter((s: any) => !s.is_gap).map((s: any) => s.skill_name),
      location: row.location ?? "",
      iti: row.iti ?? "",
    };
  } catch {
    return null;
  }
}

// ── Local recommendation engine (offline fallback) ────────────────────────────
function buildLocalAnalysis(profile: any, message?: string): AnalysisData {
  const gaps = profile.skill_gaps ?? [];
  const firstGap = gaps[0] ?? "Advanced Topics";
  const base: AnalysisData = {
    greeting: `Welcome back, ${profile.name}! Here is your personalised career analysis.`,
    profile_summary: `You are enrolled in the ${profile.trade} trade at ${profile.iti ?? "your ITI"} in ${profile.location ?? "your city"}. Your goal is to ${profile.career_goal}.`,
    recommended_topics: gaps.map((g: string) => ({
      topic: g,
      reason: `Directly addresses your identified skill gap in the ${profile.trade} trade.`,
    })),
    recommended_courses: gaps.map((g: string) => ({
      course: `${g} Professional Certification`,
      reason: `Practical modules with simulation labs and hands-on assessments.`,
    })),
    roadmap: [
      { step: 1, title: `Foundation: ${firstGap} Theory`, description: `Learn terminology, diagrams, and standards for ${firstGap}.` },
      { step: 2, title: "Practical Labs & Simulation", description: "Work in virtual or hands-on workshop environments under supervision." },
      { step: 3, title: "Troubleshooting & Diagnostics", description: "Trace faults, safety overrides, and compliance documentation." },
      { step: 4, title: "Portfolio Project", description: `Build and document a real-world project integrating ${gaps.join(" and ")}.` },
    ],
    next_action: {
      title: `Start ${firstGap} basics today`,
      description: "Complete the 10-minute introductory module in the Saksham learning hub.",
    },
    model_used: "Saksham Local AI (Offline Fallback)",
  };
  if (message) {
    const l = message.toLowerCase();
    let reply = base.profile_summary;
    if (l.includes("interview") || l.includes("job") || l.includes("placement")) {
      reply = `For ${profile.trade} graduates in ${profile.location ?? "your region"}, here are key interview tips:\n• Demonstrate hands-on safety knowledge\n• Highlight your practical workshop experience\n• Mention your career goal: "${profile.career_goal}"\n• Prepare examples solving real ${profile.trade.toLowerCase()} problems.`;
    } else if (l.includes("score") || l.includes("readiness")) {
      reply = `Your current career readiness score is ${profile.career_readiness_score}/100.\nTo improve it:\n• Close your skill gaps in ${gaps.slice(0, 2).join(" and ")}\n• Complete mentorship sessions\n• Finish your Saksham profile (industry preferences, certificates)`;
    } else if (l.includes("gap") || l.includes("skill") || l.includes("learn")) {
      reply = `Your top priority skill gaps are: ${gaps.join(", ")}. I recommend starting with "${firstGap}" as it has the highest impact on your career goal.`;
    }
    base.profile_summary = reply;
    base.greeting = `Answer for ${profile.name}:`;
  }
  return base;
}

function StudentAIAssistantPage() {
  const [sakshamProfile] = useState<StudentProfile>(() => {
    try {
      const session = studentService.getActiveSession();
      if (session?.user && session?.profile) {
        return {
          ...INITIAL_STUDENT_PROFILE,
          name: session.user.name,
          trade: session.profile.trade || INITIAL_STUDENT_PROFILE.trade,
        };
      }
    } catch {}
    return INITIAL_STUDENT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<"analysis" | "chat">("analysis");
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [query, setQuery] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Use student ID 1 by default (Aarav — matches demo session)
  const studentId = 1;

  // Score from analysis or fallback profile
  const score = analysis ? (FALLBACK_PROFILES[studentId]?.career_readiness_score ?? 76) : 76;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  // Fetch initial analysis on mount
  useEffect(() => {
    fetchAnalysis();
    setMessages([{
      id: "m-0",
      sender: "ai",
      text: `Hello ${sakshamProfile.name}! I am your Saksham AI Career Coach. I've analysed your profile. Switch to the Analysis tab to see your full career readiness report, or ask me anything here!`,
    }]);
  }, []);

  async function fetchAnalysis(message?: string) {
    if (!message) setLoadingAnalysis(true);
    else setIsChatLoading(true);

    try {
      // Tier 1 — FastAPI AI bot
      const res = await fetch(`${AI_BOT_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, message: message ?? null }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`FastAPI error ${res.status}`);
      const data: AnalysisData = await res.json();
      setAnalysis(data);
      setIsOffline(false);
      if (message) {
        setMessages((p) => [...p, { id: `a-${Date.now()}`, sender: "ai", text: data.profile_summary || data.greeting }]);
      }
    } catch {
      setIsOffline(true);
      // Tier 2 — Supabase direct
      let profile = await fetchSupabaseProfile(studentId);
      // Tier 3 — Static mock
      if (!profile) profile = FALLBACK_PROFILES[studentId];
      const data = buildLocalAnalysis(profile, message);
      setAnalysis(data);
      if (message) {
        setMessages((p) => [...p, { id: `a-${Date.now()}`, sender: "ai", text: data.profile_summary }]);
      }
    } finally {
      setLoadingAnalysis(false);
      setIsChatLoading(false);
    }
  }

  function handleSend(text: string) {
    if (!text.trim() || isChatLoading) return;
    setMessages((p) => [...p, { id: `u-${Date.now()}`, sender: "user", text }]);
    setQuery("");
    fetchAnalysis(text);
  }

  const PROMPT_CHIPS = [
    "How do I improve my readiness score?",
    "What should I prepare for interviews?",
    "Explain my top skill gaps",
    "What salary can I expect?",
    "How does mentorship help me?",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudentNavbar profile={sakshamProfile} />

      <main className="pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card to-secondary/30 shadow-soft overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3.5 border-b border-border/60 p-6 sm:p-8 pb-0">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                <Sparkles className="h-6 w-6 text-gold fill-gold" />
              </div>
              <div className="flex-1">
                <h1 className="font-serif text-2xl font-bold text-foreground">
                  Saksham AI Career Assistant
                </h1>
                <p className="text-xs text-muted-foreground">
                  Analysing: <span className="font-semibold text-primary">{sakshamProfile.name}</span>
                  {isOffline && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-[10px] px-2 py-0.5 font-semibold">
                      <AlertCircle className="h-2.5 w-2.5" /> Demo Mode
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-6 px-6 sm:px-8 border-b border-border/60">
              {(["analysis", "chat"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === tab
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "analysis" ? <TrendingUp className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  {tab === "analysis" ? "Analysis & Roadmap" : "AI Career Coach"}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* ── ANALYSIS TAB ── */}
              {activeTab === "analysis" && (
                loadingAnalysis ? (
                  <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm">Saksham AI is analysing your career profile...</p>
                  </div>
                ) : analysis && (
                  <div className="space-y-8">
                    {/* Readiness Score */}
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft flex items-center gap-6">
                      <div className="relative shrink-0 flex items-center justify-center">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r={radius} className="stroke-secondary fill-none" strokeWidth="8" />
                          <circle
                            cx="48" cy="48" r={radius}
                            className="stroke-primary fill-none transition-all duration-1000 ease-out"
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="font-serif text-2xl font-bold text-primary-deep">{score}%</span>
                          <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Score</span>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-serif text-lg font-semibold text-primary-deep">Career Readiness</h3>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-xs">
                          {analysis.profile_summary}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-gold" />
                          <span className="text-[11px] font-semibold text-primary">
                            {score >= 75 ? "Highly Employable" : "Building Skills"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Skill Gaps */}
                    <div>
                      <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-3">
                        <AlertCircle className="h-3.5 w-3.5 text-rose-500" /> Identified Skill Gaps
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {analysis.recommended_topics.map((t, i) => (
                          <div key={i} className="rounded-xl border border-rose-100 bg-rose-50/30 p-4">
                            <span className="font-semibold text-sm text-primary-deep">{t.topic}</span>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{t.reason}</p>
                          </div>
                        ))}
                        {analysis.recommended_topics.length === 0 && (
                          <div className="col-span-2 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                            No critical skill gaps! You are in great shape.
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Courses */}
                    <div>
                      <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-3">
                        <BookOpen className="h-3.5 w-3.5 text-primary" /> Personalised Courses
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {analysis.recommended_courses.map((c, i) => (
                          <div key={i} className="rounded-xl border border-border bg-card p-4 hover:border-primary/30 hover:shadow-soft transition-all">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="p-1.5 rounded-lg bg-secondary/80 text-primary">
                                <BookOpen className="h-4 w-4" />
                              </span>
                              <span className="font-serif text-sm font-semibold text-primary-deep line-clamp-1">{c.course}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{c.reason}</p>
                            <button className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline">
                              Enrol Free <ArrowUpRight className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Roadmap */}
                    <div>
                      <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-4">
                        <Award className="h-3.5 w-3.5 text-gold" /> Your Learning Roadmap
                      </h4>
                      <div className="relative pl-6 border-l-2 border-primary/10 ml-3 space-y-6">
                        {analysis.roadmap.map((step, i) => (
                          <div key={i} className="relative">
                            <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card border-2 border-primary">
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            </span>
                            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Step {step.step}</span>
                            <h5 className="font-serif font-semibold text-primary-deep text-sm leading-snug mt-0.5">{step.title}</h5>
                            <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Action */}
                    {analysis.next_action && (
                      <div className="rounded-2xl border border-gold/40 bg-gold-soft/20 p-5 flex items-start gap-4">
                        <CheckCircle2 className="h-6 w-6 text-gold shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-primary-deep uppercase tracking-wider">Immediate Next Step</h4>
                          <h5 className="font-serif font-semibold text-primary-deep text-base mt-0.5">{analysis.next_action.title}</h5>
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{analysis.next_action.description}</p>
                          <button className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-xs font-semibold px-4 py-2 hover:bg-primary-deep transition-colors">
                            Start Now <ArrowRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    {analysis.model_used && (
                      <p className="text-[10px] text-center text-muted-foreground pt-2">
                        Analysis by: <span className="font-semibold">{analysis.model_used}</span>
                      </p>
                    )}
                  </div>
                )
              )}

              {/* ── CHAT TAB ── */}
              {activeTab === "chat" && (
                <div className="flex flex-col" style={{ minHeight: "480px" }}>
                  {/* Prompt chips */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {PROMPT_CHIPS.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => handleSend(p)}
                        disabled={isChatLoading}
                        className="rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground hover:bg-beige hover:border-gold/60 hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  {/* Messages */}
                  <div className="flex-1 rounded-3xl border border-border/80 bg-card/90 p-4 sm:p-5 shadow-soft overflow-y-auto min-h-64 max-h-96 space-y-4 mb-4">
                    {messages.map((m) => (
                      <div
                        key={m.id}
                        className={`flex items-start gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                          m.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-primary border border-border"
                        }`}>
                          {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                        </div>
                        <div className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                          m.sender === "user"
                            ? "bg-primary text-primary-foreground rounded-tr-none"
                            : "bg-secondary/70 text-foreground border border-border/60 rounded-tl-none"
                        }`}>
                          {m.text}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pl-11">
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                        <span>Saksham AI is thinking...</span>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Suggested questions label */}
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <HelpCircle className="h-3 w-3" /> Suggested questions
                  </p>

                  {/* Input */}
                  <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(query); }}
                    className="flex items-center gap-2 border-t border-border/60 pt-4"
                  >
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Ask a career question or interview practice query..."
                      disabled={isChatLoading}
                      className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
                    />
                    <button
                      type="submit"
                      disabled={!query.trim() || isChatLoading}
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary-deep disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
