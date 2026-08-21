import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Briefcase,
  Building2,
  ChevronLeft,
  ChevronRight,
  Compass,
  GraduationCap,
  HandHeart,
  Landmark,
  MapPin,
  Search,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Counter, Floating, Reveal } from "@/components/site/motion-primitives";
import heroStudent from "@/assets/hero-student.jpg";
import workshop from "@/assets/workshop.jpg";
import mentorGuiding from "@/assets/mentor-guiding.jpg";
import industryImg from "@/assets/industry.jpg";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Saksham — Skills That Make You Saksham | Y4D Foundation" },
      {
        name: "description",
        content:
          "Saksham is a digital employability ecosystem by Y4D Foundation helping ITI students learn skills, find mentors, discover apprenticeships and jobs, and build sustainable careers.",
      },
      { property: "og:title", content: "Saksham — Empowering ITI Students. Enabling Careers." },
      {
        property: "og:description",
        content:
          "Learn, connect with mentors, discover opportunities and grow — one ecosystem for ITI students, faculty, institutions and industry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

/* ---------------------------------- data --------------------------------- */

const impact = [
  { value: 10, suffix: "K+", label: "Students Reached" },
  { value: 500, suffix: "+", label: "Mentors & Faculty" },
  { value: 250, suffix: "+", label: "Opportunities" },
  { value: 50, suffix: "+", label: "Industry Partners" },
  { value: 85, suffix: "%", label: "Career Readiness" },
];

const journey = [
  {
    n: "01",
    title: "Learn",
    icon: BookOpen,
    text: "Build technical, digital and workplace-ready skills.",
  },
  {
    n: "02",
    title: "Connect",
    icon: Users,
    text: "Find mentors, faculty and peers who can guide you.",
  },
  {
    n: "03",
    title: "Prepare",
    icon: Sparkles,
    text: "Develop communication, interview and workplace skills.",
  },
  {
    n: "04",
    title: "Discover",
    icon: Compass,
    text: "Explore apprenticeships, jobs, drives and government schemes.",
  },
  {
    n: "05",
    title: "Grow",
    icon: Award,
    text: "Track progress and move toward placement and career growth.",
  },
];

const audiences = [
  {
    icon: GraduationCap,
    title: "Students & Graduates",
    text: "Learn, build your profile, find mentors and discover career opportunities.",
    cta: "Join as Student",
    to: "/join" as const,
  },
  {
    icon: HandHeart,
    title: "Faculty & Mentors",
    text: "Guide learners, share knowledge and support students through their career journey.",
    cta: "Become a Mentor",
    to: "/join" as const,
  },
  {
    icon: Building2,
    title: "Industry Partners",
    text: "Discover emerging ITI talent and create meaningful employment opportunities.",
    cta: "Partner With Us",
    to: "/join" as const,
  },
  {
    icon: Landmark,
    title: "Institutions",
    text: "Track engagement, learning progress, mentorship and placement outcomes.",
    cta: "Institution Login",
    to: "/login" as const,
  },
];

const courses = [
  {
    category: "Communication",
    title: "Workplace Communication",
    duration: "6 hrs",
    level: "Beginner",
    image: mentorGuiding,
  },
  {
    category: "Workplace Readiness",
    title: "Interview Readiness",
    duration: "4 hrs",
    level: "Beginner",
    image: industryImg,
  },
  {
    category: "Digital Skills",
    title: "Digital Skills for the Modern Workplace",
    duration: "8 hrs",
    level: "Intermediate",
    image: workshop,
  },
  {
    category: "Financial Literacy",
    title: "Financial Literacy & Smart Saving",
    duration: "3 hrs",
    level: "Beginner",
    image: story1,
  },
  {
    category: "Workplace Readiness",
    title: "Professional Behaviour at Work",
    duration: "2.5 hrs",
    level: "Beginner",
    image: story2,
  },
  {
    category: "Labour Laws",
    title: "Understanding Labour Laws & Your Rights",
    duration: "5 hrs",
    level: "Intermediate",
    image: heroStudent,
  },
];

const learningCategories = [
  "Technical Skills",
  "Digital Skills",
  "Communication",
  "Workplace Readiness",
  "Financial Literacy",
  "Labour Laws",
  "Interview Preparation",
  "Career Planning",
];

type Opportunity = {
  title: string;
  org: string;
  location: string;
  type: string;
  skills: string[];
  stipend: string;
};

const opportunities: Opportunity[] = [
  {
    title: "Electrical Technician Apprentice",
    org: "Shakti Manufacturing Pvt. Ltd.",
    location: "Pune, Maharashtra",
    type: "Apprenticeship",
    skills: ["Electrical", "Maintenance", "Safety"],
    stipend: "₹12,000 / month",
  },
  {
    title: "Junior Fitter — Assembly Line",
    org: "Vardhman Auto Components",
    location: "Nashik, Maharashtra",
    type: "Job",
    skills: ["Fitter", "Assembly", "Quality Check"],
    stipend: "₹18,500 / month",
  },
  {
    title: "ITI Campus Recruitment Drive",
    org: "Sunrise Renewables",
    location: "Aurangabad · On-campus",
    type: "Recruitment Drive",
    skills: ["Electrician", "Welder", "Turner"],
    stipend: "24 openings",
  },
  {
    title: "PMKVY Skill Certification Support",
    org: "Ministry of Skill Development",
    location: "Pan-India",
    type: "Government Scheme",
    skills: ["Certification", "Stipend", "Placement"],
    stipend: "Fully funded",
  },
  {
    title: "CNC Operator Internship",
    org: "Precision Tools India",
    location: "Chakan, Pune",
    type: "Internship",
    skills: ["CNC", "Machining", "Blueprint Reading"],
    stipend: "₹9,000 / month",
  },
  {
    title: "Solar Rooftop Installation Project",
    org: "Y4D Green Skills Lab",
    location: "Pimpri-Chinchwad",
    type: "Project",
    skills: ["Solar", "Wiring", "Site Safety"],
    stipend: "Certificate + stipend",
  },
];

const oppTypes = [
  "All Types",
  "Apprenticeship",
  "Job",
  "Recruitment Drive",
  "Government Scheme",
  "Internship",
  "Project",
];

const mentors = [
  {
    name: "Sunita Deshmukh",
    role: "Senior Electrical Engineer",
    industry: "Manufacturing",
    exp: "14 years",
    expertise: ["Panel Design", "Site Safety", "Interviews"],
    availability: "2 slots this week",
    image: story1,
    goal: "Get placed",
  },
  {
    name: "Ramesh Patil",
    role: "Workshop Superintendent",
    industry: "Automotive",
    exp: "22 years",
    expertise: ["Fitter Trade", "Apprenticeships", "Shop-floor readiness"],
    availability: "Weekends",
    image: mentorGuiding,
    goal: "Apprenticeship",
  },
  {
    name: "Ayaan Sheikh",
    role: "Plant Maintenance Lead",
    industry: "Renewable Energy",
    exp: "9 years",
    expertise: ["Solar", "Preventive Maintenance", "Certifications"],
    availability: "3 slots this week",
    image: story2,
    goal: "Switch industry",
  },
];

const communities = [
  {
    name: "Electrical Engineering — Pune Community",
    members: 124,
    discussions: 18,
    tag: "ITI Community",
  },
  { name: "Interview Prep Circle", members: 89, discussions: 24, tag: "Skill Circle" },
  { name: "Welding & Fabrication Study Group", members: 67, discussions: 11, tag: "Study Group" },
  { name: "Solar Installers Peer Project", members: 42, discussions: 9, tag: "Peer Project" },
];

const partnerCategories = [
  "Manufacturing",
  "Automotive",
  "Electrical",
  "Technology",
  "Construction",
  "Healthcare",
  "Logistics",
  "Renewable Energy",
];

const partnerLogos = [
  "Shakti Manufacturing",
  "Vardhman Auto",
  "Precision Tools India",
  "Sunrise Renewables",
  "BuildWell Infra",
  "MedCare Systems",
  "TransLog Express",
  "Nova Electricals",
];

const progress = [
  { label: "Profile Completion", value: 90 },
  { label: "Learning Progress", value: 72 },
  { label: "Career Readiness Score", value: 78 },
];

const progressStats = [
  { label: "Skills Developed", value: "8" },
  { label: "Mentorship Sessions", value: "5" },
  { label: "Applications", value: "12" },
  { label: "Interviews", value: "3" },
  { label: "Placement", value: "In Progress" },
];

const stories = [
  {
    quote: "From ITI classroom to her first industry opportunity.",
    name: "Priya Kadam",
    trade: "Electrician Trade, ITI Pune",
    skills: "Panel wiring, workplace communication, interview readiness",
    mentor: "Mentored by Sunita Deshmukh",
    opportunity: "Apprenticeship at Shakti Manufacturing",
    now: "Now: Junior Maintenance Technician",
    image: story1,
    text: "“I knew the technical work, but I froze in interviews. My mentor practised with me every week until I could explain my own skills with confidence.”",
  },
  {
    quote: "A fitter who turned a campus drive into a full-time career.",
    name: "Akash Jadhav",
    trade: "Fitter Trade, ITI Nashik",
    skills: "Assembly, quality inspection, professional behaviour",
    mentor: "Mentored by Ramesh Patil",
    opportunity: "Selected in an on-campus recruitment drive",
    now: "Now: Service Technician, Automotive",
    image: story2,
    text: "“Saksham showed me the drives I never knew existed. I prepared for two weeks on the platform and got selected on the first attempt.”",
  },
  {
    quote: "Learning green skills opened a completely new trade.",
    name: "Imran Shaikh",
    trade: "Wireman Trade, ITI Aurangabad",
    skills: "Solar installation, site safety, digital documentation",
    mentor: "Mentored by Ayaan Sheikh",
    opportunity: "Solar rooftop project with Y4D Green Skills Lab",
    now: "Now: Solar Installation Assistant",
    image: workshop,
    text: "“The project on Saksham gave me real site experience. That certificate is what got me my first paid job.”",
  },
];

const faqs = [
  {
    q: "Who can join Saksham?",
    a: "Any ITI student or graduate can join for free. Faculty, mentors and industry partners can also register to support and hire learners.",
  },
  {
    q: "Does Saksham cost anything?",
    a: "No. Saksham is a Y4D Foundation social-impact initiative and is free for students and graduates.",
  },
  {
    q: "What kind of opportunities are listed?",
    a: "Apprenticeships, entry-level jobs, campus recruitment drives, internships, live projects and government employment schemes.",
  },
  {
    q: "How does mentorship work?",
    a: "Share your career goal, industry and skills. Saksham recommends mentors and you can request a session directly from their profile.",
  },
  {
    q: "Can institutions track their students?",
    a: "Yes. Institutions get a dashboard for engagement, learning progress, mentorship and placement outcomes. Institution access is issued by Y4D — there is no public admin signup.",
  },
];

const ecosystemNodes = [
  "Learning",
  "Mentorship",
  "Peers",
  "Faculty",
  "Industry",
  "Opportunities",
  "Career",
];

const heroLabels = ["LEARN", "CONNECT", "DISCOVER", "GROW"];

/* ---------------------------------- page ---------------------------------- */

function Home() {
  return (
    <div id="top" className="min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main>
        <Hero />
        <ImpactStrip />
        <About />
        <HowItWorks />
        <WhoFor />
        <Learning />
        <Opportunities />
        <Mentorship />
        <PeerLearning />
        <Partners />
        <CareerProgress />
        <Stories />
        <Faqs />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}

/* ----------------------------------- hero --------------------------------- */

function Hero() {
  const [labelIndex, setLabelIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLabelIndex((i) => (i + 1) % heroLabels.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-grain relative px-5 pt-32 pb-16 sm:pt-40 lg:pb-24">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-gold-soft/50 px-4 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span className="eyebrow text-primary-deep">Saksham · Y4D Foundation</span>
          </span>

          <h1 className="mt-7 font-serif text-[clamp(2.6rem,6.2vw,4.6rem)] leading-[1.03] tracking-tight text-primary-deep text-balance-editorial">
            Skills That Make You <span className="italic text-primary">Saksham.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            A digital ecosystem helping ITI students learn, connect with mentors, discover
            opportunities and build sustainable careers.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#opportunities"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-deep hover:shadow-lift"
            >
              Explore Opportunities
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#learning"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/25 bg-card px-7 py-4 text-sm font-semibold text-primary transition-all hover:bg-beige"
            >
              Start Learning
            </a>
          </div>

          <p className="mt-8 text-xs tracking-[0.28em] text-muted-foreground uppercase">
            Learn • Connect • Prepare • Grow
          </p>
        </motion.div>

        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid grid-cols-5 grid-rows-6 gap-3 sm:gap-4">
            <div className="relative col-span-3 row-span-6 overflow-hidden rounded-[2rem] shadow-lift">
              <img
                src={heroStudent}
                alt="ITI student working on an electrical panel"
                width={1008}
                height={1312}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/70 via-primary/10 to-transparent" />
              <div className="absolute bottom-5 left-5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroLabels[labelIndex]}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2 rounded-full bg-cream/90 px-4 py-2 backdrop-blur"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    <span className="eyebrow text-primary-deep">{heroLabels[labelIndex]}</span>
                  </motion.div>
                </AnimatePresence>
                <div className="mt-3 flex gap-1.5">
                  {heroLabels.map((l, i) => (
                    <span
                      key={l}
                      className={`h-1 rounded-full transition-all ${
                        i === labelIndex ? "w-6 bg-gold" : "w-2.5 bg-cream/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[1.75rem] shadow-soft">
              <img
                src={workshop}
                alt="ITI students learning welding in a workshop"
                loading="lazy"
                width={1200}
                height={1408}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-primary-deep/25" />
            </div>

            <div className="relative col-span-2 row-span-3 overflow-hidden rounded-[1.75rem] shadow-soft">
              <img
                src={industryImg}
                alt="ITI graduates at an industry recruitment drive"
                loading="lazy"
                width={1200}
                height={1408}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-primary-deep/25" />
            </div>
          </div>

          <Floating
            className="absolute -top-4 -left-4 hidden sm:block"
            delay={0.2}
          >
            <StatChip value="10K+" label="Students" />
          </Floating>
          <Floating className="absolute top-1/3 -left-6 hidden lg:block" delay={1.1}>
            <StatChip value="500+" label="Mentors" />
          </Floating>
          <Floating className="absolute -right-3 bottom-24 hidden sm:block" delay={0.6}>
            <StatChip value="250+" label="Opportunities" />
          </Floating>
          <Floating className="absolute -bottom-5 left-8 hidden sm:block" delay={1.6}>
            <StatChip value="50+" label="Industry Partners" />
          </Floating>
        </motion.div>
      </div>
    </section>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/95 px-4 py-3 shadow-lift backdrop-blur">
      <p className="font-serif text-xl text-primary">{value}</p>
      <p className="text-[0.68rem] tracking-wide text-muted-foreground uppercase">{label}</p>
    </div>
  );
}

/* --------------------------------- impact --------------------------------- */

function ImpactStrip() {
  return (
    <section className="px-5 pb-20">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card px-6 py-10 shadow-soft sm:px-10">
        <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {impact.map((item, i) => (
            <Reveal key={item.label} delay={i * 0.08} className="text-center sm:text-left">
              <p className="font-serif text-4xl text-primary">
                <Counter to={item.value} suffix={item.suffix} />
              </p>
              <div className="mt-2 h-0.5 w-10 rounded-full bg-gold sm:mx-0 mx-auto" />
              <p className="mt-3 text-sm text-muted-foreground">{item.label}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------- about --------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
}: {
  eyebrow: string;
  title: React.ReactNode;
  text?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow text-primary/70">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-[clamp(2rem,4vw,3.1rem)] leading-[1.08] tracking-tight text-primary-deep text-balance-editorial">
        {title}
      </h2>
      {text ? <p className="mt-5 leading-relaxed text-foreground/70">{text}</p> : null}
    </div>
  );
}

function About() {
  const gaps = [
    "Communication",
    "Digital skills",
    "Financial literacy",
    "Workplace readiness",
    "Labour-law awareness",
    "Mentorship",
    "Apprenticeships",
    "Industry exposure",
    "Career planning",
  ];

  return (
    <section id="about" className="border-y border-border bg-secondary/40 px-5 py-24">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="About Saksham"
            title={
              <>
                One Platform. Every Step <span className="italic">Toward Your Career.</span>
              </>
            }
            text="ITI students already hold real technical ability. What is often missing is everything that surrounds it — the guidance, the confidence and the access to opportunity. Saksham brings those fragmented pieces into one ecosystem."
          />
          <div className="mt-8 flex flex-wrap gap-2">
            {gaps.map((g) => (
              <span
                key={g}
                className="rounded-full border border-primary/15 bg-card px-4 py-2 text-sm text-primary-deep"
              >
                {g}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <EcosystemDiagram />
        </Reveal>
      </div>
    </section>
  );
}

function EcosystemDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
      <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
        {ecosystemNodes.map((_, i) => {
          const angle = (i / ecosystemNodes.length) * Math.PI * 2 - Math.PI / 2;
          const x = 200 + Math.cos(angle) * 150;
          const y = 200 + Math.sin(angle) * 150;
          return (
            <motion.line
              key={i}
              x1={200}
              y1={200}
              x2={x}
              y2={y}
              stroke="currentColor"
              className="text-primary/25"
              strokeWidth={1.2}
              strokeDasharray="4 6"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1 * i }}
            />
          );
        })}
        <circle cx={200} cy={200} r={150} className="fill-none stroke-primary/12" />
        <circle cx={200} cy={200} r={104} className="fill-none stroke-gold/40" />
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="grid h-28 w-28 place-items-center rounded-full bg-primary text-center shadow-lift">
          <div>
            <Wrench className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-1 text-[0.62rem] leading-tight tracking-[0.14em] text-primary-foreground uppercase">
              ITI
              <br />
              Student
            </p>
          </div>
        </div>
      </div>

      {ecosystemNodes.map((node, i) => {
        const angle = (i / ecosystemNodes.length) * 360 - 90;
        return (
          <motion.div
            key={node}
            className="absolute top-1/2 left-1/2"
            style={{
              transform: `rotate(${angle}deg) translate(37.5%) rotate(${-angle}deg)`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i, duration: 0.5 }}
          >
            <span className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium whitespace-nowrap text-primary-deep shadow-soft block">
              {node}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------- how it works ------------------------------ */

function HowItWorks() {
  return (
    <section id="how-it-works" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="How Saksham Works"
            title="Five steps from classroom to career."
            align="center"
          />
        </Reveal>

        <div className="relative mt-16">
          <div className="absolute top-[3.25rem] right-0 left-0 hidden h-px bg-border lg:block" />
          <motion.div
            className="absolute top-[3.25rem] left-0 hidden h-px origin-left bg-gold lg:block"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{ right: 0 }}
          />

          <div className="grid gap-8 lg:grid-cols-5">
            {journey.map((step, i) => (
              <Reveal key={step.n} delay={i * 0.1}>
                <div className="relative flex gap-5 lg:block">
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-card shadow-soft">
                      <step.icon className="h-5 w-5 text-primary" />
                    </div>
                    {i < journey.length - 1 && (
                      <div className="mt-2 w-px flex-1 bg-border lg:hidden" />
                    )}
                  </div>
                  <div className="pb-8 lg:pt-6 lg:pb-0">
                    <p className="eyebrow text-gold">{step.n}</p>
                    <h3 className="mt-2 font-serif text-2xl text-primary-deep">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------- who for -------------------------------- */

function WhoFor() {
  return (
    <section className="border-y border-border bg-secondary/40 px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="Who is Saksham for?" title="Built for the whole ecosystem." />
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {audiences.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-7 shadow-soft"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary">
                  <a.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-snug text-primary-deep">
                  {a.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
                <Link
                  to={a.to}
                  className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  {a.cta}
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          Institution and admin access is issued directly by Y4D Foundation — there is no public
          admin registration.
        </p>
      </div>
    </section>
  );
}

/* -------------------------------- learning -------------------------------- */

function Learning() {
  const [active, setActive] = useState("All");
  const filtered = useMemo(
    () => (active === "All" ? courses : courses.filter((c) => c.category === active)),
    [active],
  );

  return (
    <section id="learning" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <Reveal>
            <SectionHeading eyebrow="Learning" title="Learn Beyond The Classroom." />
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/join"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
            >
              Explore Learning <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {["All", ...learningCategories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                active === c
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-primary-deep hover:bg-secondary"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <motion.article
                whileHover={{ y: -6 }}
                className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-soft"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 rounded-full bg-cream/90 px-3 py-1 text-[0.68rem] font-semibold tracking-wide text-primary uppercase backdrop-blur">
                    {c.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl leading-snug text-primary-deep">{c.title}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">
                    {c.duration} · {c.level}
                  </p>
                  <Link
                    to="/login"
                    className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    Start Course
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </Link>
                </div>
              </motion.article>
            </Reveal>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              New courses in this category are being added soon.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ opportunities ------------------------------ */

function Opportunities() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All Types");
  const [location, setLocation] = useState("All Locations");
  const [featured, setFeatured] = useState(0);

  const locations = useMemo(
    () => ["All Locations", ...new Set(opportunities.map((o) => o.location.split(",")[0].trim()))],
    [],
  );

  const filtered = opportunities.filter((o) => {
    const q = query.trim().toLowerCase();
    const matchQ =
      !q ||
      o.title.toLowerCase().includes(q) ||
      o.org.toLowerCase().includes(q) ||
      o.skills.some((s) => s.toLowerCase().includes(q));
    const matchT = type === "All Types" || o.type === type;
    const matchL = location === "All Locations" || o.location.startsWith(location);
    return matchQ && matchT && matchL;
  });

  const featuredItem = opportunities[featured];

  return (
    <section id="opportunities" className="border-y border-border bg-secondary/40 px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Opportunities"
            title="Your Next Opportunity Is Waiting."
            text="Apprenticeships, jobs, recruitment drives, internships, live projects and government schemes — curated for ITI trades."
          />
        </Reveal>

        {/* featured carousel */}
        <Reveal delay={0.1}>
          <div className="mt-12 overflow-hidden rounded-[2rem] bg-primary-deep p-8 text-primary-foreground shadow-lift sm:p-12">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="eyebrow text-gold">Featured Opportunity</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  aria-label="Previous featured opportunity"
                  onClick={() =>
                    setFeatured((f) => (f - 1 + opportunities.length) % opportunities.length)
                  }
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 transition-colors hover:bg-cream/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next featured opportunity"
                  onClick={() => setFeatured((f) => (f + 1) % opportunities.length)}
                  className="grid h-10 w-10 place-items-center rounded-full border border-cream/25 transition-colors hover:bg-cream/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={featuredItem.title}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4 }}
                className="mt-6"
              >
                <h3 className="font-serif text-3xl sm:text-4xl">{featuredItem.title}</h3>
                <p className="mt-3 text-cream/80">
                  {featuredItem.org} · {featuredItem.location}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {featuredItem.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-cream/25 px-3 py-1 text-xs text-cream/90"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    to="/login"
                    className="rounded-full bg-gold px-6 py-3.5 text-sm font-semibold text-primary-deep transition-transform hover:scale-[1.03]"
                  >
                    Apply Now
                  </Link>
                  <span className="text-sm text-cream/70">{featuredItem.stipend}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* filters */}
        <div className="mt-12 grid gap-3 rounded-[1.5rem] border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="flex items-center gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-primary" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search role, company or skill"
              aria-label="Search opportunities"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            aria-label="Opportunity type"
            className="rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-primary-deep outline-none"
          >
            {oppTypes.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            aria-label="Location"
            className="rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-primary-deep outline-none"
          >
            {locations.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
          <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3 text-sm text-muted-foreground">
            <span>Eligibility: ITI pass / appearing</span>
            <span className="font-semibold text-primary">{filtered.length}</span>
          </div>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.05}>
              <motion.article
                whileHover={{ y: -6 }}
                className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-7 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-secondary px-3 py-1 text-[0.68rem] font-semibold tracking-wide text-primary uppercase">
                    {o.type}
                  </span>
                  <Briefcase className="h-4 w-4 text-gold" />
                </div>
                <h3 className="mt-5 font-serif text-xl leading-snug text-primary-deep">
                  {o.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">{o.org}</p>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {o.location}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {o.skills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-border px-2.5 py-1 text-xs text-foreground/70"
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-1 items-end justify-between gap-3">
                  <span className="text-sm font-medium text-primary-deep">{o.stipend}</span>
                  <Link
                    to="/login"
                    className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
                  >
                    Apply Now
                  </Link>
                </div>
              </motion.article>
            </Reveal>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No opportunities match these filters yet. Try widening your search.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- mentorship -------------------------------- */

function Mentorship() {
  const [goal, setGoal] = useState("Get placed");
  const [industry, setIndustry] = useState("Manufacturing");
  const [skill, setSkill] = useState("Electrical");

  const recommended = useMemo(() => {
    const scored = mentors.map((m) => {
      let score = 0;
      if (m.goal === goal) score += 2;
      if (m.industry === industry) score += 2;
      if (m.expertise.join(" ").toLowerCase().includes(skill.toLowerCase())) score += 1;
      return { m, score };
    });
    return scored.sort((a, b) => b.score - a.score).map((s) => s.m);
  }, [goal, industry, skill]);

  return (
    <section id="mentorship" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Mentorship"
            title="Guidance From People Who've Been There."
            text="Connect with experienced professionals who can help you navigate your next step."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-12 grid gap-3 rounded-[1.5rem] border border-border bg-card p-4 sm:grid-cols-3">
            <Field label="Career Goal">
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-primary-deep outline-none"
              >
                <option>Get placed</option>
                <option>Apprenticeship</option>
                <option>Switch industry</option>
              </select>
            </Field>
            <Field label="Industry">
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-primary-deep outline-none"
              >
                <option>Manufacturing</option>
                <option>Automotive</option>
                <option>Renewable Energy</option>
              </select>
            </Field>
            <Field label="Skill">
              <input
                value={skill}
                onChange={(e) => setSkill(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-primary-deep outline-none"
                placeholder="e.g. Electrical"
              />
            </Field>
          </div>
        </Reveal>

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {recommended.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08}>
              <motion.div
                layout
                whileHover={{ y: -6 }}
                className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-7 shadow-soft"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={m.image}
                    alt={m.name}
                    loading="lazy"
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                  <div>
                    <h3 className="font-serif text-xl text-primary-deep">{m.name}</h3>
                    <p className="text-sm text-muted-foreground">{m.role}</p>
                  </div>
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase">Industry</dt>
                    <dd className="mt-0.5 text-primary-deep">{m.industry}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground uppercase">Experience</dt>
                    <dd className="mt-0.5 text-primary-deep">{m.exp}</dd>
                  </div>
                </dl>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {m.expertise.map((e) => (
                    <span
                      key={e}
                      className="rounded-full bg-secondary px-2.5 py-1 text-xs text-primary-deep"
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {m.availability}
                </p>
                <div className="mt-6 flex flex-1 items-end gap-3">
                  <Link
                    to="/login"
                    className="flex-1 rounded-full border border-primary/25 px-4 py-2.5 text-center text-sm font-semibold text-primary transition-colors hover:bg-secondary"
                  >
                    View Profile
                  </Link>
                  <Link
                    to="/login"
                    className="flex-1 rounded-full bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
                  >
                    Request
                  </Link>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="rounded-2xl bg-secondary/60 px-4 py-3">
      <span className="block text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">
        {label}
      </span>
      <span className="mt-1 block">{children}</span>
    </label>
  );
}

/* ------------------------------ peer learning ------------------------------ */

function PeerLearning() {
  return (
    <section className="border-y border-border bg-secondary/40 px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Peer Learning"
            title="Learn Together. Grow Together."
            text="Study groups, trade communities and skill circles where ITI learners help each other prepare."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {communities.map((c, i) => (
            <Reveal key={c.name} delay={i * 0.07}>
              <motion.div
                whileHover={{ y: -6 }}
                className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card p-7 shadow-soft"
              >
                <span className="eyebrow text-gold">{c.tag}</span>
                <h3 className="mt-4 font-serif text-xl leading-snug text-primary-deep">{c.name}</h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  {c.members} Members · {c.discussions} Active Discussions
                </p>
                <Link
                  to="/login"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary"
                >
                  Join Community <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- partners --------------------------------- */

function Partners() {
  return (
    <section id="partners" className="overflow-hidden px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Industry Partners"
            title="Connecting ITI Talent With Industry."
            align="center"
          />
        </Reveal>

        <div className="mt-12 flex flex-wrap justify-center gap-2">
          {partnerCategories.map((c) => (
            <span
              key={c}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm text-primary-deep"
            >
              {c}
            </span>
          ))}
        </div>

        <div className="relative mt-14 overflow-hidden py-2">
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          >
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <div
                key={`${logo}-${i}`}
                className="flex h-24 w-60 shrink-0 items-center justify-center rounded-2xl border border-border bg-card px-6 text-center shadow-soft"
              >
                <span className="font-serif text-lg text-primary/70">{logo}</span>
              </div>
            ))}
          </motion.div>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/join"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
          >
            Become an Industry Partner <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ----------------------------- career progress ----------------------------- */

function CareerProgress() {
  return (
    <section className="border-y border-border bg-secondary/40 px-5 py-24">
      <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <SectionHeading
            eyebrow="Career Progress"
            title="See How Far You've Come."
            text="Every course, mentor session and application adds up. Saksham turns your effort into a visible career trajectory — for you, your faculty and your institution."
          />
        </Reveal>

        <Reveal delay={0.12}>
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-lift">
            <div className="flex items-center gap-4">
              <img
                src={story1}
                alt="Student profile"
                loading="lazy"
                className="h-14 w-14 rounded-2xl object-cover"
              />
              <div>
                <p className="font-serif text-xl text-primary-deep">Priya Kadam</p>
                <p className="text-sm text-muted-foreground">Electrician Trade · ITI Pune</p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              {progress.map((p, i) => (
                <div key={p.label}>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/75">{p.label}</span>
                    <span className="font-semibold text-primary">{p.value}%</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${p.value}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: i * 0.15, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {progressStats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-secondary/70 px-4 py-3">
                  <p className="font-serif text-lg text-primary">{s.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------- stories --------------------------------- */

function Stories() {
  const [index, setIndex] = useState(0);
  const story = stories[index];

  return (
    <section id="stories" className="px-5 py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading
            eyebrow="Success Stories"
            title="From Potential to Possibility."
            text="Real journeys from ITI workshops to first jobs, built with mentorship and access."
          />
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-[2rem] border border-border bg-card shadow-lift">
          <AnimatePresence mode="wait">
            <motion.div
              key={story.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45 }}
              className="grid lg:grid-cols-[0.85fr_1fr]"
            >
              <div className="relative min-h-[18rem]">
                <img
                  src={story.image}
                  alt={story.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/70 to-transparent" />
              </div>
              <div className="p-8 sm:p-12">
                <h3 className="font-serif text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight text-primary-deep">
                  “{story.quote}”
                </h3>
                <p className="mt-6 leading-relaxed text-foreground/75">{story.text}</p>
                <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                  <Detail label="Student" value={`${story.name} · ${story.trade}`} />
                  <Detail label="Skills Developed" value={story.skills} />
                  <Detail label="Mentor Support" value={story.mentor} />
                  <Detail label="Opportunity" value={story.opportunity} />
                </dl>
                <p className="mt-8 inline-flex rounded-full bg-secondary px-4 py-2 text-sm font-semibold text-primary">
                  {story.now}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between border-t border-border px-8 py-5">
            <div className="flex gap-1.5">
              {stories.map((s, i) => (
                <button
                  key={s.name}
                  type="button"
                  aria-label={`Show story of ${s.name}`}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? "w-8 bg-primary" : "w-3 bg-border"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => setIndex((i) => (i - 1 + stories.length) % stories.length)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-secondary"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Next story"
                onClick={() => setIndex((i) => (i + 1) % stories.length)}
                className="grid h-10 w-10 place-items-center rounded-full border border-border text-primary transition-colors hover:bg-secondary"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[0.65rem] tracking-[0.16em] text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-primary-deep">{value}</dd>
    </div>
  );
}

/* ----------------------------------- faqs ---------------------------------- */

function Faqs() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faqs" className="border-t border-border bg-secondary/40 px-5 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <SectionHeading eyebrow="FAQs" title="Questions, answered." />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="divide-y divide-border overflow-hidden rounded-[1.75rem] border border-border bg-card">
            {faqs.map((f, i) => (
              <div key={f.q}>
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-6 px-7 py-5 text-left"
                >
                  <span className="font-medium text-primary-deep">{f.q}</span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border transition-transform ${
                      open === i ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-7 pb-6 text-sm leading-relaxed text-muted-foreground">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------- final cta -------------------------------- */

function FinalCta() {
  return (
    <section className="px-5 pb-20">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-primary-deep px-6 py-20 text-center sm:px-16">
        <div className="pointer-events-none absolute -top-20 -left-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-10 -bottom-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <svg
          className="pointer-events-none absolute top-8 right-10 h-16 w-16 text-gold/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M12 2v20M2 12h20M4.9 4.9l14.2 14.2M19.1 4.9L4.9 19.1" />
        </svg>

        <div className="relative">
          <p className="eyebrow text-gold">Become Saksham</p>
          <h2 className="mt-5 font-serif text-[clamp(2.2rem,5vw,3.8rem)] leading-[1.05] text-cream text-balance-editorial">
            Become Saksham. Build Your Future.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-cream/75">
            Learn the skills. Find the guidance. Discover the opportunity.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/join"
              className="rounded-full bg-gold px-7 py-4 text-sm font-semibold text-primary-deep transition-transform hover:scale-[1.03]"
            >
              Join as Student
            </Link>
            <Link
              to="/join"
              className="rounded-full border border-cream/30 px-7 py-4 text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Become a Mentor
            </Link>
            <Link
              to="/join"
              className="rounded-full border border-cream/30 px-7 py-4 text-sm font-semibold text-cream transition-colors hover:bg-cream/10"
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
