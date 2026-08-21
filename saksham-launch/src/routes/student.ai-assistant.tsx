import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  Loader2,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { useState } from "react";
import { Footer } from "@/components/site/Footer";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  AI_SUGGESTED_PROMPTS,
  INITIAL_STUDENT_PROFILE,
  StudentProfile,
} from "@/components/student/student-data";

export const Route = createFileRoute("/student/ai-assistant")({
  head: () => ({
    meta: [{ title: "Saksham AI Career Assistant · Saksham" }],
  }),
  component: StudentAIAssistantPage,
});

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
}

function StudentAIAssistantPage() {
  const [profile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Hello Aarav! I'm your Saksham AI Career Guide. I'm connected to your ITI Electrician profile, skill scores, and active application at Shakti Manufacturing. Ask me anything about trade concepts, interview questions, or next steps to improve your readiness score!`,
    },
  ]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: `u-${Date.now()}`, sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    setTimeout(() => {
      let reply = "";
      const l = text.toLowerCase();
      if (l.includes("interview") || l.includes("shakti")) {
        reply = `For your shortlisted role at Shakti Manufacturing (Electrical Technician Apprentice), here are key focus areas:
1. Explain how to troubleshoot a tripped 3-phase thermal overload relay.
2. Safety precaution steps before opening an active distribution board.
3. Why did you choose the Electrician trade at ITI Pune?
Practice speaking clearly and mention your 82% technical score on Saksham!`;
      } else if (l.includes("score") || l.includes("readiness")) {
        reply = `Your readiness score is 78/100 (+8% this month).
To cross 85% for top-tier hiring drives:
• Complete Module 3 of "Workplace Communication" (+6 pts)
• Attend your Friday mentorship session with Sunita Deshmukh (+5 pts)
• Finish your profile industry preferences (+2 pts)`;
      } else {
        reply = `Great question! In industrial electrical operations, strict adherence to BIS 732 (code of practice for electrical wiring installations) and personal protective equipment (PPE) like insulated gloves and safety boots is mandatory. Always demonstrate safety consciousness in interviews!`;
      }

      setMessages((prev) => [...prev, { id: `a-${Date.now()}`, sender: "ai", text: reply }]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudentNavbar profile={profile} />

      <main className="pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-8 shadow-soft">
            <div className="flex items-center gap-3.5 border-b border-border/60 pb-5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                <Sparkles className="h-6 w-6 text-gold fill-gold" />
              </div>
              <div>
                <h1 className="font-serif text-2xl font-bold text-foreground">
                  Saksham AI Career Assistant
                </h1>
                <p className="text-xs text-muted-foreground">
                  Multilingual AI tuned specifically for ITI trades, skill gap coaching, and placement prep.
                </p>
              </div>
            </div>

            {/* Prompt suggestions */}
            <div className="mt-5 flex flex-wrap gap-2">
              {AI_SUGGESTED_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handleSend(p)}
                  className="rounded-full border border-border/80 bg-card px-3 py-1 text-xs font-medium text-foreground hover:bg-beige hover:border-gold/60 hover:text-primary transition-colors"
                >
                  "{p}"
                </button>
              ))}
            </div>

            {/* Messages box */}
            <div className="mt-6 rounded-3xl border border-border/80 bg-card/90 p-4 sm:p-6 shadow-2xs">
              <div className="min-h-80 max-h-96 overflow-y-auto space-y-4 pr-1">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${
                      m.sender === "user" ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-primary border border-border"
                      }`}
                    >
                      {m.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary" />}
                    </div>
                    <div
                      className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-secondary/70 text-foreground border border-border/60 rounded-tl-none whitespace-pre-line"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pl-11">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                    <span>Analyzing trade knowledge base...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(query);
                }}
                className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Ask a career question or interview practice query..."
                  className="flex-1 rounded-full border border-border bg-background px-4 py-3 text-xs sm:text-sm outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || isLoading}
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary-deep disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
