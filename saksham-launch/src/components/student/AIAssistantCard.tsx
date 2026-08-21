import {
  ArrowRight,
  Bot,
  CornerDownLeft,
  Loader2,
  MessageSquare,
  RefreshCw,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { AI_SUGGESTED_PROMPTS, StudentProfile } from "./student-data";

interface AIAssistantCardProps {
  profile: StudentProfile;
  onOpenFullAssistant?: () => void;
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
}

export function AIAssistantCard({ profile, onOpenFullAssistant }: AIAssistantCardProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender: "ai",
      text: `Namaste Aarav! I'm your Saksham AI Career Guide. Based on your Electrician trade at ITI Pune, your strongest asset is core wiring (82%), but strengthening Workplace Communication (58%) and Interview Readiness will give you the fastest boost for your Shakti Manufacturing apprenticeship application. How can I help you today?`,
      timestamp: "Just now",
    },
  ]);

  const handleAsk = (questionText: string) => {
    if (!questionText.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: questionText,
      timestamp: "Just now",
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    // Realistic trade-specific AI responses tailored for Aarav Sharma
    setTimeout(() => {
      let aiReply = "";
      const lower = questionText.toLowerCase();

      if (lower.includes("job-ready") || lower.includes("learn")) {
        aiReply = `For an Industrial Electrician role in Pune manufacturing hubs, employers look for: 
1. Three-phase motor control and Star-Delta starter wiring.
2. PLC basic ladder diagram reading.
3. Lockout/Tagout (LOTO) safety protocol adherence.
I recommend finishing the "Workplace Communication" course first, then taking the "Industrial Electrical Safety" module next!`;
      } else if (lower.includes("interview")) {
        aiReply = `Top 3 questions asked for ITI Electrician Apprenticeships at companies like Shakti Manufacturing:
1. "How do you test insulation resistance using a Megger?"
2. "Explain the difference between MCB, MCCB, and ELCB."
3. "Describe a scenario where you noticed an unsafe condition on the workshop floor."
Would you like to practice answering these one by one?`;
      } else if (lower.includes("skills") || lower.includes("industrial")) {
        aiReply = `Industrial electrical work focuses heavily on automated panels and relay logic compared to domestic wiring. Focus on:
• Relay logic & Contactor wiring
• Digital Multimeter precision measurements
• Control panel schematics and blueprint reading
Your next best step card is already set up to guide you through this path.`;
      } else {
        aiReply = `That's a great question, Aarav. Based on your current career readiness score (78%), continuing your daily 20-minute learning streak and booking a mock interview session with your mentor Sunita Deshmukh will maximize your placement chances.`;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          text: aiReply,
          timestamp: "Just now",
        },
      ]);
      setIsLoading(false);
    }, 900);
  };

  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-card via-secondary/40 to-card p-6 shadow-soft sm:p-9 lg:p-10">
          {/* Subtle decorative ambient lights */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/60 pb-6">
            <div className="flex items-center gap-3.5">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
                <Sparkles className="h-6 w-6 text-gold fill-gold" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    Your Saksham AI Career Assistant
                  </h3>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.65rem] font-bold text-primary">
                    AI POWERED
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Personalized career guidance based on your Electrician trade, skill gaps, and
                  applications.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenFullAssistant}
              className="inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>Open full screen assistant</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Prompt Suggestion Chips */}
          <div className="mt-6">
            <p className="text-[0.72rem] tracking-wider uppercase font-semibold text-muted-foreground mb-2.5">
              Popular Guidance Prompts for Electrician Trainees
            </p>
            <div className="flex flex-wrap gap-2">
              {AI_SUGGESTED_PROMPTS.slice(0, 4).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleAsk(prompt)}
                  className="rounded-full border border-border/80 bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/85 transition-all hover:bg-beige hover:border-gold/60 hover:text-primary"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chat Window */}
          <div className="mt-6 rounded-3xl border border-border/80 bg-card/90 p-4 sm:p-6 shadow-2xs">
            <div className="max-h-72 overflow-y-auto space-y-4 pr-1">
              <AnimatePresence>
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
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
                      className={`max-w-xl rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                        m.sender === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-secondary/70 text-foreground border border-border/60 rounded-tl-none whitespace-pre-line"
                      }`}
                    >
                      {m.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground pl-11">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  <span>Saksham AI is analyzing trade data...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk(query);
              }}
              className="mt-4 flex items-center gap-2 border-t border-border/60 pt-3"
            >
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about trade skills, interview questions, or next steps..."
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-xs sm:text-sm outline-none transition-colors focus:border-primary"
              />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:bg-primary-deep disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
