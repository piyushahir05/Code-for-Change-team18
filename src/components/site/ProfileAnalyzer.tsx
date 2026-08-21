import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Sparkles,
  Send,
  BookOpen,
  Award,
  AlertCircle,
  TrendingUp,
  Loader2,
  Bot,
  User,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  ArrowUpRight
} from "lucide-react";
import { useActiveStudent } from "@/hooks/useActiveStudent";

// ── Supabase public credentials ───────────────────────────────────────────────
const SUPABASE_URL = "https://espfnslpizfssuntxhah.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVzcGZuc2xwaXpmc3N1bnR4aGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyODgwNzMsImV4cCI6MjEwMjg2NDA3M30.lhWSQBlOa1mdL3mYRgTFZkBK5BKzveTsvrdzu0lsTgg";

// ── Static offline fallback (mirrors ai_bot/database.py MOCK_STUDENTS) ────────
const FALLBACK_PROFILES: Record<number, any> = {
  1: {
    name: "Aarav Patil",
    trade: "Electrician",
    career_goal: "Become an industrial maintenance electrician and learn automation",
    career_readiness_score: 76,
    skill_gaps: ["PLC Basics", "Control Panels"],
    existing_skills: ["Electrical Wiring", "Motor Control", "Electrical Safety", "Industrial Wiring"],
    interests: ["Electrical Maintenance", "PLC", "Renewable Energy"],
    location: "Pune",
    iti: "Government ITI Pune",
  },
  2: {
    name: "Saanvi Jadhav",
    trade: "Fitter",
    career_goal: "Build a career in plant maintenance and production",
    career_readiness_score: 72,
    skill_gaps: ["Hydraulics", "Quality Inspection"],
    existing_skills: ["Mechanical Assembly", "Measurement & Gauges", "Preventive Maintenance", "Technical Drawings"],
    interests: ["Quality Inspection", "CNC", "Plant Maintenance"],
    location: "Nashik",
    iti: "Government ITI Nashik",
  },
  3: {
    name: "Rohan Shinde",
    trade: "Welder",
    career_goal: "Become a certified industrial welding technician",
    career_readiness_score: 68,
    skill_gaps: ["TIG Welding", "Weld Inspection"],
    existing_skills: ["MIG Welding", "Welding Safety", "Fabrication", "Technical Drawings"],
    interests: ["Quality", "Fabrication", "Automotive Manufacturing"],
    location: "Nagpur",
    iti: "Government ITI Nagpur",
  },
  4: {
    name: "Isha More",
    trade: "COPA",
    career_goal: "Start a career in IT support and digital operations",
    career_readiness_score: 80,
    skill_gaps: ["Basic Networking", "MS Excel"],
    existing_skills: ["Data Entry", "Digital Literacy", "Computer Hardware", "Documentation"],
    interests: ["IT Support", "Data Operations", "Office Automation"],
    location: "Mumbai",
    iti: "Government ITI Mumbai",
  },
};

/**
 * Fetch full student profile from Supabase REST API directly.
 * Used when FastAPI backend is offline.
 */
async function fetchProfileFromSupabase(studentId: number): Promise<any | null> {
  try {
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    };

    // Fetch student_profiles row
    const profileRes = await fetch(
      `${SUPABASE_URL}/rest/v1/student_profiles?id=eq.${studentId}&select=id,age,gender,location,iti,trade,education,experience,career_goal,preferred_industry,preferred_location,skill_confidence,profile_completion,career_readiness_score,preferred_language,users(name)&limit=1`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    const profileRows = profileRes.ok ? await profileRes.json() : [];
    if (!profileRows || profileRows.length === 0) return null;
    const profile = profileRows[0];

    // Fetch student_skills
    const skillsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/student_skills?student_profile_id=eq.${studentId}&select=skill_name,is_gap`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    const skillRows = skillsRes.ok ? await skillsRes.json() : [];

    // Fetch student_interests
    const interestsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/student_interests?student_profile_id=eq.${studentId}&select=interest`,
      { headers, signal: AbortSignal.timeout(5000) }
    );
    const interestRows = interestsRes.ok ? await interestsRes.json() : [];

    return {
      student_id: studentId,
      name: profile.users?.name ?? `Student ${studentId}`,
      trade: profile.trade ?? "",
      career_goal: profile.career_goal ?? "",
      career_readiness_score: profile.career_readiness_score ?? 0,
      skill_gaps: skillRows.filter((s: any) => s.is_gap).map((s: any) => s.skill_name),
      existing_skills: skillRows.filter((s: any) => !s.is_gap).map((s: any) => s.skill_name),
      interests: interestRows.map((i: any) => i.interest),
      location: profile.location ?? "",
      iti: profile.iti ?? "",
    };
  } catch {
    return null;
  }
}

interface RecommendedTopic {
  topic: string;
  reason: string;
}

interface RecommendedCourse {
  course: string;
  reason: string;
}

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
}

interface NextAction {
  title: string;
  description: string;
}

interface AnalysisData {
  greeting: string;
  profile_summary: string;
  recommended_topics: RecommendedTopic[];
  recommended_courses: RecommendedCourse[];
  roadmap: RoadmapStep[];
  next_action: NextAction;
  model_used?: string;
}

interface Message {
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface ProfileAnalyzerProps {
  triggerOpen?: boolean;
  onCloseTrigger?: () => void;
}

export function ProfileAnalyzer({ triggerOpen = false, onCloseTrigger }: ProfileAnalyzerProps) {
  const [isOpen, setIsOpen] = useState(triggerOpen);
  const [activeTab, setActiveTab] = useState<"analysis" | "chat">("analysis");
  const { activeStudent } = useActiveStudent();
  
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Sync open state with props if controlled
  useEffect(() => {
    setIsOpen(triggerOpen);
  }, [triggerOpen]);

  // Handle open state change: fetch initial dashboard
  useEffect(() => {
    if (isOpen && activeStudent) {
      fetchAnalysis(activeStudent.id);
      
      // Initialize chat with default welcome
      setMessages([
        {
          sender: "bot",
          text: `Hello ${activeStudent.name}! I am your Saksham AI Career Coach. I've analyzed your profile in the ${activeStudent.trade} trade. How can I help guide your learning journey today?`,
          timestamp: new Date()
        }
      ]);
    }
  }, [isOpen, activeStudent]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCloseTrigger) {
      onCloseTrigger();
    }
  };

  // Generate dynamic recommendations from a profile object (live or mock)
  const getClientFallback = (profile: any, message?: string): AnalysisData => {
    const trade = profile.trade;
    const name = profile.name;
    const gaps = profile.skill_gaps;
    const firstGap = gaps[0] || "Advanced Systems";
    
    // Core analysis payload structure
    const baseAnalysis: AnalysisData = {
      greeting: `Welcome back, ${name}! Here is your personalized learning plan.`,
      profile_summary: `Currently enrolled in the ${trade} trade at ${profile.iti || "ITI"}. You have a strong confidence score in ${(profile.existing_skills || []).slice(0, 2).join(" & ") || "practical workshops"}, but your career goal of '${profile.career_goal}' requires targeting a few specific skill gaps.`,
      recommended_topics: gaps.map((gap: string) => ({
        topic: gap,
        reason: `Required to transition from basic ITI trade curriculum to specialized roles in ${profile.preferred_industry || "industry"}.`
      })),
      recommended_courses: gaps.map((gap: string) => ({
        course: `${gap} Professional Certification`,
        reason: `Covers step-by-step practical applications, simulation labs, and standard operating procedures.`
      })),
      roadmap: [
        {
          step: 1,
          title: `Foundation: ${firstGap} Theory`,
          description: `Learn the fundamentals, blueprints, and standard industry terminology for ${firstGap}.`
        },
        {
          step: 2,
          title: "Practical Work & Simulation",
          description: `Engage with interactive virtual labs or hands-on practice in the workshop under supervision.`
        },
        {
          step: 3,
          title: "Troubleshooting & Diagnostics",
          description: "Learn to trace faults, handle emergency safety overrides, and maintain compliance sheets."
        },
        {
          step: 4,
          title: "Real-world Project Implementation",
          description: `Construct a fully functional demo project showing integration of ${gaps.join(" and ")}.`
        }
      ],
      next_action: {
        title: `Start learning ${firstGap} basics`,
        description: "Watch the introductory 10-minute digital module in the Saksham learning hub."
      },
      model_used: "Saksham Local AI Fallback Engine (Offline)"
    };

    if (message) {
      const msgLower = message.toLowerCase();
      let customAnswer = "";

      if (msgLower.includes("plc") || msgLower.includes("automation")) {
        customAnswer = `To learn PLC (Programmable Logic Controllers), you should start with PLC ladder logic. For an Electrician student like you, understanding motor control coils will make learning ladder logic very intuitive. I recommend starting with the 'PLC Basics Simulation' course which doesn't require physical hardware.`;
      } else if (msgLower.includes("job") || msgLower.includes("salary") || msgLower.includes("stipend") || msgLower.includes("apprenticeship")) {
        customAnswer = `For ${trade} graduates in ${profile.location || "your region"}, apprenticeships typically offer stipends ranging from ₹9,000 to ₹14,000 per month. Major hiring partners like Shakti Manufacturing and Vardhman Auto actively recruit through the Saksham portal. Focus on clearing your ${gaps[0]} gap to stand out.`;
      } else if (msgLower.includes("roadmap") || msgLower.includes("learn")) {
        customAnswer = `Your customized roadmap consists of 4 main phases starting with theoretical fundamentals, moving to virtual simulation, diagnostics, and ending with a portfolio project. Since your goal is to '${profile.career_goal}', completing this roadmap within 3 months is highly recommended.`;
      } else {
        customAnswer = `Based on your profile, addressing '${gaps[0]}' is the most critical step to achieve your goal. I recommend studying the basic wiring layouts and practicing standard diagnostics. Let me know if you want resources on a specific topic!`;
      }

      baseAnalysis.profile_summary = customAnswer;
      baseAnalysis.greeting = `Answer for ${name}:`;
    }

    return baseAnalysis;
  };

  const fetchAnalysis = async (studentId: number, messageText?: string) => {
    setLoading(true);
    try {
      // ── Tier 1: FastAPI backend (uses Groq/Bedrock AI + Supabase DB) ─────
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          message: messageText || null,
          name: activeStudent?.name,
          trade: activeStudent?.trade,
          career_goal: activeStudent?.career_goal,
        }),
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) throw new Error(`FastAPI error: ${response.status}`);

      const data: AnalysisData = await response.json();
      setAnalysis(data);
      setIsOfflineMode(false);

      if (messageText) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: data.profile_summary || data.greeting, timestamp: new Date() },
        ]);
      }
    } catch (err) {
      console.warn("FastAPI backend unreachable, trying Supabase direct:", err);
      setIsOfflineMode(true);

      // ── Tier 2: Supabase REST directly from browser (real data, local AI) ─
      let liveProfile = await fetchProfileFromSupabase(studentId);

      // ── Tier 3: Active student session / Static offline mock data ────────
      if (!liveProfile) {
        if (activeStudent) {
          liveProfile = {
            student_id: activeStudent.id,
            name: activeStudent.name,
            trade: activeStudent.trade,
            career_goal: activeStudent.career_goal,
            career_readiness_score: activeStudent.career_readiness_score,
            skill_gaps: activeStudent.skill_gaps || ["Workplace Communication", "Interview Preparation"],
            existing_skills: activeStudent.existing_skills || ["Workshop Basics"],
            interests: activeStudent.interests || ["Technical Work"],
            location: activeStudent.location || "Maharashtra",
            iti: activeStudent.iti || "Government ITI",
          };
        } else {
          liveProfile = FALLBACK_PROFILES[studentId] || FALLBACK_PROFILES[1];
        }
      }

      // Simulate a brief processing delay
      await new Promise((resolve) => setTimeout(resolve, 600));

      const fallbackData = getClientFallback(liveProfile, messageText);
      setAnalysis(fallbackData);

      if (messageText) {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: fallbackData.profile_summary, timestamp: new Date() },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || loading || !activeStudent) return;

    const userMsg = inputText.trim();
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userMsg, timestamp: new Date() }
    ]);
    setInputText("");
    fetchAnalysis(activeStudent.id, userMsg);
  };

  const handleChipClick = (question: string) => {
    if (loading || !activeStudent) return;
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: question, timestamp: new Date() }
    ]);
    fetchAnalysis(activeStudent.id, question);
  };

  // UI state derived values
  const score = activeStudent ? activeStudent.career_readiness_score : 70;
  
  // Custom circular ring layout properties
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Prompt chips based on trade
  const getPromptChips = () => {
    if (!activeStudent) return [];
    switch (activeStudent.trade.toLowerCase()) {
      case "electrician":
        return [
          "How can I learn PLC ladder logic?",
          "What starting salary can an electrician expect in Pune?",
          "Tell me about electrical safety certifications."
        ];
      case "fitter":
        return [
          "How can I master CNC programming?",
          "What are assembly line job requirements?",
          "Fitter apprenticeships in Nashik."
        ];
      case "welder":
        return [
          "Difference between MIG and TIG welding?",
          "How do I get weld inspection certification?",
          "High paying welding jobs in Nagpur."
        ];
      case "copa":
        return [
          "Best networking courses for COPA?",
          "Excel dashboard tips for IT support.",
          "Digital operations career paths."
        ];
      default:
        return [
          "How do I clear my skill gaps?",
          "Where can I find apprenticeships?",
          "How does mentorship help me?"
        ];
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-primary-deep text-white px-6 py-4 shadow-lift hover:shadow-gold transition-all duration-300 group cursor-pointer border border-gold/20"
      >
        <Sparkles className="h-5 w-5 text-gold animate-pulse group-hover:scale-110 transition-transform" />
        <span className="text-sm font-semibold tracking-wide">Analyze Profile</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
        </span>
      </button>

      {/* Slide-out Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm transition-opacity"
            />

            {/* Slide Sheet Container */}
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="w-screen max-w-xl sm:max-w-2xl bg-card shadow-lift flex flex-col h-full border-l border-border relative"
              >
                {/* Header */}
                <div className="px-6 py-5 border-b border-border bg-grain flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Bot className="h-6 w-6 text-primary" />
                      <h2 className="font-serif text-2xl text-primary-deep leading-tight">Saksham AI Career Coach</h2>
                    </div>
                    {activeStudent && (
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        Analyzing: <span className="font-semibold text-primary">{activeStudent.name}</span> · {activeStudent.trade} Trade · {activeStudent.career_readiness_score}% Readiness
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1 rounded-full hover:bg-beige transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Tabs bar */}
                <div className="px-6 border-b border-border flex gap-6 bg-card">
                  <button
                    onClick={() => setActiveTab("analysis")}
                    className={`py-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "analysis"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    Analysis & Roadmap
                  </button>
                  <button
                    onClick={() => setActiveTab("chat")}
                    className={`py-4 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTab === "chat"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Bot className="h-4 w-4" />
                    AI Career Coach
                  </button>

                  {/* Offline Warning Banner */}
                  {isOfflineMode && (
                    <div className="ml-auto flex items-center gap-1.5 text-[11px] text-amber-600 bg-amber-50 rounded-full px-3 py-1 self-center border border-amber-200">
                      <AlertCircle className="h-3 w-3" />
                      Demo Mode (Offline)
                    </div>
                  )}
                </div>

                {/* Content Panel */}
                <div className="flex-1 overflow-y-auto p-6 bg-cream/35">
                  {loading && !analysis ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                      <p className="text-sm">Saksham AI is analyzing your career profile...</p>
                    </div>
                  ) : (
                    <>
                      {/* ── ANALYSIS & ROADMAP VIEW ───────────────────────────────── */}
                      {activeTab === "analysis" && analysis && (
                        <div className="space-y-7">
                          {/* Readiness Score Card */}
                          <div className="rounded-2xl border border-border bg-card p-5 shadow-soft flex items-center gap-6">
                            {/* Circular progress chart */}
                            <div className="relative shrink-0 flex items-center justify-center">
                              <svg className="w-24 h-24 transform -rotate-90">
                                <circle
                                  cx="48"
                                  cy="48"
                                  r={radius}
                                  className="stroke-secondary fill-none"
                                  strokeWidth="8"
                                />
                                <circle
                                  cx="48"
                                  cy="48"
                                  r={radius}
                                  className="stroke-primary fill-none transition-all duration-1000 ease-out"
                                  strokeWidth="8"
                                  strokeDasharray={circumference}
                                  strokeDashoffset={strokeDashoffset}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute flex flex-col items-center justify-center">
                                <span className="font-serif text-2xl font-bold text-primary-deep">{score}%</span>
                                <span className="text-[9px] text-muted-foreground uppercase tracking-wider font-semibold">Score</span>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="font-serif text-lg text-primary-deep font-semibold">Career Readiness</h3>
                              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                Your profile is {score}% optimized for entry-level hiring. Complete recommended actions to boost your score to 90%+.
                              </p>
                              <div className="mt-3 flex items-center gap-1.5">
                                <span className="h-2 w-2 rounded-full bg-gold" />
                                <span className="text-[11px] font-semibold text-primary">
                                  {score >= 75 ? "Highly Employable" : "Building Skills"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Skill Gaps Card */}
                          <div>
                            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-3">
                              <AlertCircle className="h-3.5 w-3.5 text-rose-500" />
                              Identified Skill Gaps
                            </h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {analysis.recommended_topics.map((t, idx) => (
                                <div key={idx} className="rounded-xl border border-rose-100 bg-rose-50/20 p-4.5 flex flex-col">
                                  <span className="font-semibold text-sm text-primary-deep">{t.topic}</span>
                                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed flex-1">
                                    {t.reason}
                                  </p>
                                </div>
                              ))}
                              {analysis.recommended_topics.length === 0 && (
                                <div className="col-span-2 rounded-xl border border-border bg-card p-4 text-center text-sm text-muted-foreground">
                                  No critical skill gaps found! You are in great shape.
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Recommended Courses Card */}
                          <div>
                            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-3">
                              <BookOpen className="h-3.5 w-3.5 text-primary" />
                              Personalized Courses
                            </h4>
                            <div className="grid gap-3 sm:grid-cols-2">
                              {analysis.recommended_courses.map((c, idx) => (
                                <div key={idx} className="rounded-xl border border-border bg-card p-4.5 flex flex-col hover:border-primary/20 hover:shadow-soft transition-all duration-300">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="p-1.5 rounded-lg bg-secondary/80 text-primary">
                                      <BookOpen className="h-4 w-4" />
                                    </span>
                                    <span className="font-serif text-sm font-semibold text-primary-deep leading-snug line-clamp-1">{c.course}</span>
                                  </div>
                                  <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                                    {c.reason}
                                  </p>
                                  <button className="group mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline self-start cursor-pointer">
                                    Enrol Free
                                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Stepper Learning Roadmap */}
                          <div>
                            <h4 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase flex items-center gap-1.5 mb-4">
                              <Award className="h-3.5 w-3.5 text-gold" />
                              Your Learning Roadmap
                            </h4>
                            <div className="relative pl-6 border-l-2 border-primary/10 ml-3 space-y-6">
                              {analysis.roadmap.map((step, idx) => (
                                <div key={idx} className="relative">
                                  {/* Milestone Stepper Node */}
                                  <span className="absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-card border-2 border-primary">
                                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                  </span>
                                  <div>
                                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Step {step.step}</span>
                                    <h5 className="font-serif font-semibold text-primary-deep text-sm.5 leading-snug mt-0.5">{step.title}</h5>
                                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                      {step.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Next Action Call-to-Action */}
                          {analysis.next_action && (
                            <div className="rounded-2xl border border-gold/40 bg-gold-soft/20 p-5 flex items-start gap-4">
                              <CheckCircle2 className="h-6 w-6 text-gold shrink-0 mt-0.5" />
                              <div>
                                <h4 className="text-xs font-bold text-primary-deep uppercase tracking-wider">Immediate Next Step</h4>
                                <h5 className="font-serif font-semibold text-primary-deep text-base mt-0.5">{analysis.next_action.title}</h5>
                                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                                  {analysis.next_action.description}
                                </p>
                                <button className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-white text-xs font-semibold px-4.5 py-2 hover:bg-primary-deep transition-colors cursor-pointer">
                                  Complete Action
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          )}

                          {analysis.model_used && (
                            <p className="text-[10px] text-muted-foreground text-center pt-2">
                              Analysis generated by: <span className="font-semibold">{analysis.model_used}</span>
                            </p>
                          )}
                        </div>
                      )}

                      {/* ── INTERACTIVE CAREER COACH CHAT VIEW ───────────────────────── */}
                      {activeTab === "chat" && (
                        <div className="flex flex-col h-[calc(100vh-270px)]">
                          {/* Chat Thread */}
                          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
                            {messages.map((m, idx) => (
                              <div
                                key={idx}
                                className={`flex items-start gap-2.5 max-w-[85%] ${
                                  m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                }`}
                              >
                                {/* Avatar */}
                                <div
                                  className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm border ${
                                    m.sender === "user"
                                      ? "bg-primary text-white border-primary-deep"
                                      : "bg-card text-primary border-border"
                                  }`}
                                >
                                  {m.sender === "user" ? <User className="h-4.5 w-4.5" /> : <Bot className="h-4.5 w-4.5" />}
                                </div>

                                {/* Text Bubble */}
                                <div>
                                  <div
                                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                                      m.sender === "user"
                                        ? "bg-primary text-white rounded-tr-none shadow-soft"
                                        : "bg-card text-foreground rounded-tl-none border border-border shadow-soft"
                                    }`}
                                  >
                                    <p className="whitespace-pre-line">{m.text}</p>
                                  </div>
                                  <span className="text-[9px] text-muted-foreground mt-1 block px-1">
                                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                              </div>
                            ))}

                            {loading && (
                              <div className="flex items-start gap-2.5 max-w-[85%]">
                                <div className="h-8 w-8 rounded-xl bg-card text-primary border border-border flex items-center justify-center shrink-0 shadow-sm">
                                  <Bot className="h-4.5 w-4.5" />
                                </div>
                                <div className="bg-card text-foreground border border-border rounded-2xl rounded-tl-none px-4 py-3 shadow-soft flex items-center gap-2">
                                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                  <span className="text-xs text-muted-foreground">Thinking...</span>
                                </div>
                              </div>
                            )}
                            <div ref={chatEndRef} />
                          </div>

                          {/* Quick Suggestion Prompt Chips */}
                          <div className="py-3 border-t border-border/40">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <HelpCircle className="h-3 w-3" /> Recommended Questions
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {getPromptChips().map((chip, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleChipClick(chip)}
                                  className="text-xs rounded-full border border-border bg-card px-3 py-1.5 text-left text-primary hover:border-primary hover:bg-beige/20 transition-all cursor-pointer"
                                >
                                  {chip}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Text input area */}
                          <form onSubmit={handleSendMessage} className="pt-3 border-t border-border flex gap-2">
                            <input
                              type="text"
                              value={inputText}
                              onChange={(e) => setInputText(e.target.value)}
                              placeholder="Ask a question about your trade or career goal..."
                              disabled={loading}
                              className="flex-1 rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/60"
                            />
                            <button
                              type="submit"
                              disabled={loading || !inputText.trim()}
                              className="h-11 w-11 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary-deep transition-colors disabled:bg-muted disabled:text-muted-foreground cursor-pointer shadow-soft shrink-0 border border-primary-deep"
                            >
                              <Send className="h-4.5 w-4.5" />
                            </button>
                          </form>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
