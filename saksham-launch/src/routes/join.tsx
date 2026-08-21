import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Building2, GraduationCap, HandHeart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Saksham · Student, Mentor or Industry | Y4D Foundation" },
      {
        name: "description",
        content:
          "Choose how you join Saksham — as an ITI student, as a mentor guiding learners, or as an industry partner discovering ITI talent.",
      },
      { property: "og:title", content: "How Would You Like To Join Saksham?" },
      {
        property: "og:description",
        content: "Join the Saksham employability ecosystem as a student, mentor or industry partner.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: JoinPage,
});

const options = [
  {
    icon: GraduationCap,
    emoji: "🎓",
    title: "Student",
    text: "Learn, connect and discover opportunities.",
    cta: "Join as Student",
    detail: "For ITI students and graduates across all trades.",
  },
  {
    icon: HandHeart,
    emoji: "👨‍🏫",
    title: "Mentor",
    text: "Guide and empower the next generation.",
    cta: "Join as Mentor",
    detail: "For faculty, trainers and working professionals.",
  },
  {
    icon: Building2,
    emoji: "🏢",
    title: "Industry",
    text: "Discover talent and create opportunities.",
    cta: "Join as Industry",
    detail: "For employers hiring apprentices and technicians.",
  },
];

function JoinPage() {
  return (
    <div className="bg-grain min-h-screen px-5 py-10">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-2 text-sm text-primary transition-colors hover:bg-secondary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Saksham
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="eyebrow text-primary/70">Saksham · Y4D Foundation</p>
          <h1 className="mx-auto mt-5 max-w-3xl font-serif text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.06] text-primary-deep text-balance-editorial">
            How Would You Like To Join Saksham?
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-foreground/70">
            Pick the role that fits you. You can always add more to your profile later.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {options.map((o, i) => (
            <motion.div
              key={o.title}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="flex flex-col rounded-[2rem] border border-border bg-card p-8 shadow-soft"
            >
              <span className="text-3xl" aria-hidden>
                {o.emoji}
              </span>
              <h2 className="mt-5 font-serif text-3xl text-primary-deep">{o.title}</h2>
              <p className="mt-3 text-foreground/70">{o.text}</p>
              <p className="mt-2 text-sm text-muted-foreground">{o.detail}</p>
              <button
                type="button"
                onClick={() =>
                  toast.success(`${o.title} registration`, {
                    description: "Demo mode — connect a backend to create real accounts.",
                  })
                }
                className="group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                {o.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Login here
          </Link>
          <p className="mt-3 text-xs">
            Institution and admin access is provisioned by Y4D Foundation — admin accounts cannot be
            self-registered.
          </p>
        </div>
      </div>
    </div>
  );
}
