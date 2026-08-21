import heroStudent from "@/assets/hero-student.jpg";
import workshop from "@/assets/workshop.jpg";
import mentorGuiding from "@/assets/mentor-guiding.jpg";
import industryImg from "@/assets/industry.jpg";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";

export interface StudentProfile {
  name: string;
  avatar: string;
  trade: string;
  iti: string;
  location: string;
  careerGoal: string;
  experience: string;
  language: string;
  careerReadinessScore: number;
  readinessMonthlyGrowth: number;
  profileCompletion: number;
  missingProfileFields: string[];
}

export interface ReadinessCategory {
  name: string;
  score: number;
  status: "strong" | "needs-attention" | "moderate";
  colorClass: string;
}

export interface SkillGap {
  id: string;
  name: string;
  priority: "High" | "Medium" | "Low";
  description: string;
  progress: number;
  category: string;
  isGap: boolean;
  recommendedAction: string;
}

export interface Course {
  id: string;
  category: string;
  title: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  progress: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
  image: string;
  skillDeveloped: string;
  description: string;
  modulesCount: number;
}

export type OpportunityType = "JOB" | "APPRENTICESHIP" | "RECRUITMENT_DRIVE";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  type: OpportunityType;
  typeLabel: string;
  stipend: string;
  requiredSkills: string[];
  matchPercentage: number;
  deadline: string;
  openings?: number;
  isSaved?: boolean;
  description: string;
}

export type ApplicationStatus =
  | "APPLIED"
  | "UNDER_REVIEW"
  | "SHORTLISTED"
  | "INTERVIEW"
  | "SELECTED"
  | "REJECTED";

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  type: string;
  appliedDate: string;
  appliedDaysAgo: number;
  status: ApplicationStatus;
  timeline: {
    stage: ApplicationStatus;
    label: string;
    date?: string;
    completed: boolean;
    current: boolean;
  }[];
  interviewDate?: string;
  interviewMode?: "ONLINE" | "PHYSICAL";
  notes?: string;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  industry: string;
  experience: string;
  expertise: string[];
  availability: string;
  image: string;
  rating: number;
  sessionsCount: number;
}

export interface MentorshipSession {
  id: string;
  title: string;
  mentorName: string;
  mentorRole: string;
  dateTime: string;
  mode: "ONLINE" | "PHYSICAL";
  locationOrLink: string;
  status: "CONFIRMED" | "PENDING" | "COMPLETED";
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "application" | "mentorship" | "opportunity" | "profile" | "system";
  actionUrl?: string;
}

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: "Aarav Sharma",
  avatar: heroStudent,
  trade: "Electrician",
  iti: "ITI Pune",
  location: "Pune, Maharashtra",
  careerGoal: "Industrial Electrician",
  experience: "Beginner",
  language: "Hindi",
  careerReadinessScore: 78,
  readinessMonthlyGrowth: 8,
  profileCompletion: 90,
  missingProfileFields: ["Preferred industry", "Career interests"],
};

export const READINESS_BREAKDOWN: ReadinessCategory[] = [
  { name: "Technical Skills", score: 82, status: "strong", colorClass: "bg-primary" },
  { name: "Workplace Readiness", score: 64, status: "needs-attention", colorClass: "bg-gold" },
  { name: "Digital Skills", score: 71, status: "moderate", colorClass: "bg-primary/80" },
  { name: "Communication", score: 58, status: "needs-attention", colorClass: "bg-gold" },
  { name: "Interview Readiness", score: 62, status: "needs-attention", colorClass: "bg-gold" },
];

export const SKILL_GAPS: SkillGap[] = [
  {
    id: "gap-1",
    name: "Communication",
    priority: "High",
    description: "Improve workplace communication, verbal clarity and shop-floor confidence.",
    progress: 58,
    category: "Soft Skills",
    isGap: true,
    recommendedAction: "Complete Module: Active Listening & Verbal Reports",
  },
  {
    id: "gap-2",
    name: "Interview Readiness",
    priority: "Medium",
    description: "Practice answering technical scenarios, trade fundamentals and behavioural questions.",
    progress: 62,
    category: "Career Skills",
    isGap: true,
    recommendedAction: "Practice with AI Mock Interviewer",
  },
  {
    id: "gap-3",
    name: "Digital Documentation",
    priority: "Medium",
    description: "Build confidence with maintenance log tools, digital work orders and standard spreadsheets.",
    progress: 50,
    category: "Digital Skills",
    isGap: true,
    recommendedAction: "Start: Digital Work Orders 101",
  },
  {
    id: "gap-4",
    name: "Industrial Safety & Lockout/Tagout",
    priority: "High",
    description: "Master IS/OSHA electrical safety, lock-out tag-out protocols and emergency procedures.",
    progress: 68,
    category: "Technical & Safety",
    isGap: true,
    recommendedAction: "Safety Certification Exam Prep",
  },
];

export const RECOMMENDED_COURSES: Course[] = [
  {
    id: "course-1",
    category: "Communication",
    title: "Workplace Communication",
    duration: "6 hrs",
    level: "Beginner",
    progress: 45,
    status: "IN_PROGRESS",
    image: mentorGuiding,
    skillDeveloped: "Verbal clarity, shift handovers & team coordination",
    description: "Learn how to communicate clearly with supervisors, report machine faults, and participate in shift handovers.",
    modulesCount: 5,
  },
  {
    id: "course-2",
    category: "Workplace Readiness",
    title: "Interview Readiness",
    duration: "4 hrs",
    level: "Beginner",
    progress: 0,
    status: "NOT_STARTED",
    image: industryImg,
    skillDeveloped: "Trade interview questions, salary basics & body language",
    description: "Step-by-step preparation for technical rounds, HR questions, and industrial apprentice interviews.",
    modulesCount: 4,
  },
  {
    id: "course-3",
    category: "Digital Skills",
    title: "Digital Skills for the Modern Workplace",
    duration: "8 hrs",
    level: "Intermediate",
    progress: 0,
    status: "NOT_STARTED",
    image: workshop,
    skillDeveloped: "Digital schematics, maintenance apps & smart factory tools",
    description: "Understand digital multimeter diagnostics, smart sensor readings, and digital maintenance logging systems.",
    modulesCount: 6,
  },
  {
    id: "course-4",
    category: "Technical Safety",
    title: "Industrial Electrical Safety & Standards",
    duration: "5 hrs",
    level: "Intermediate",
    progress: 20,
    status: "IN_PROGRESS",
    image: story2,
    skillDeveloped: "LOTO procedures, arc flash protection & BIS compliance",
    description: "Critical safety modules designed in collaboration with certified industrial safety engineers.",
    modulesCount: 5,
  },
];

export const RECOMMENDED_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-1",
    title: "Electrical Technician Apprentice",
    company: "Shakti Manufacturing Pvt. Ltd.",
    location: "Pune, Maharashtra",
    type: "APPRENTICESHIP",
    typeLabel: "Apprenticeship",
    stipend: "₹12,000 / month",
    requiredSkills: ["Electrical", "Maintenance", "Safety"],
    matchPercentage: 92,
    deadline: "In 6 days",
    openings: 8,
    isSaved: true,
    description:
      "Hands-on apprenticeship working with high-voltage panel maintenance, relay testing, and preventive industrial equipment maintenance.",
  },
  {
    id: "opp-2",
    title: "Junior Maintenance Technician",
    company: "Vardhman Auto Components",
    location: "Chakan, Pune",
    type: "JOB",
    typeLabel: "Full-Time Job",
    stipend: "₹18,500 / month",
    requiredSkills: ["Electrician", "PLC Basics", "Panel Wiring"],
    matchPercentage: 88,
    deadline: "In 12 days",
    openings: 4,
    isSaved: false,
    description:
      "Full-time role for certified ITI Electricians. Responsible for automated assembly line monitoring, basic troubleshooting, and shift maintenance.",
  },
  {
    id: "opp-3",
    title: "Mega ITI Campus Placement Drive",
    company: "Sunrise Renewables & Power",
    location: "Pune · On-campus Drive",
    type: "RECRUITMENT_DRIVE",
    typeLabel: "Recruitment Drive",
    stipend: "24 Openings (₹15,000 - ₹22,000)",
    requiredSkills: ["Solar Installation", "Wiring", "Testing"],
    matchPercentage: 85,
    deadline: "Friday, 10:00 AM",
    openings: 24,
    isSaved: false,
    description:
      "Exclusive hiring drive for ITI Electricians and Fitters for solar rooftop and utility-scale renewable power projects.",
  },
  {
    id: "opp-4",
    title: "Control Panel Wireman Trainee",
    company: "Precision Power Controls",
    location: "Bhosari, Pune",
    type: "APPRENTICESHIP",
    typeLabel: "Apprenticeship",
    stipend: "₹13,500 / month",
    requiredSkills: ["Wiring", "Blueprint Reading", "Soldering"],
    matchPercentage: 81,
    deadline: "In 2 weeks",
    openings: 6,
    isSaved: false,
    description:
      "NAPS certified apprenticeship with stipend and absorption opportunity upon successful completion of 12 months.",
  },
];

export const APPLICATIONS: Application[] = [
  {
    id: "app-1",
    jobTitle: "Electrical Technician Apprentice",
    company: "Shakti Manufacturing Pvt. Ltd.",
    location: "Pune, Maharashtra",
    type: "Apprenticeship",
    appliedDate: "4 days ago",
    appliedDaysAgo: 4,
    status: "SHORTLISTED",
    timeline: [
      { stage: "APPLIED", label: "Applied", date: "May 12, 2026", completed: true, current: false },
      { stage: "UNDER_REVIEW", label: "Under Review", date: "May 14, 2026", completed: true, current: false },
      { stage: "SHORTLISTED", label: "Shortlisted", date: "May 16, 2026", completed: true, current: true },
      { stage: "INTERVIEW", label: "Interview", date: "Pending slot", completed: false, current: false },
      { stage: "SELECTED", label: "Selected", date: "--", completed: false, current: false },
    ],
    interviewDate: "May 24, 2026 (Tentative)",
    interviewMode: "PHYSICAL",
    notes: "HR noted: High score in technical assessment. Next step is practical round at factory workshop.",
  },
  {
    id: "app-2",
    jobTitle: "Junior Fitter & Assembler",
    company: "Bharat Gears Ltd.",
    location: "Hadapsar, Pune",
    type: "Full-Time Job",
    appliedDate: "1 week ago",
    appliedDaysAgo: 7,
    status: "UNDER_REVIEW",
    timeline: [
      { stage: "APPLIED", label: "Applied", date: "May 9, 2026", completed: true, current: false },
      { stage: "UNDER_REVIEW", label: "Under Review", date: "May 11, 2026", completed: true, current: true },
      { stage: "SHORTLISTED", label: "Shortlisted", completed: false, current: false },
      { stage: "INTERVIEW", label: "Interview", completed: false, current: false },
      { stage: "SELECTED", label: "Selected", completed: false, current: false },
    ],
  },
  {
    id: "app-3",
    jobTitle: "Solar Panel Installation Trainee",
    company: "EcoEnergy Systems",
    location: "Pune",
    type: "Apprenticeship",
    appliedDate: "2 weeks ago",
    appliedDaysAgo: 14,
    status: "INTERVIEW",
    timeline: [
      { stage: "APPLIED", label: "Applied", date: "May 2, 2026", completed: true, current: false },
      { stage: "UNDER_REVIEW", label: "Under Review", date: "May 4, 2026", completed: true, current: false },
      { stage: "SHORTLISTED", label: "Shortlisted", date: "May 7, 2026", completed: true, current: false },
      { stage: "INTERVIEW", label: "Interview Scheduled", date: "May 22, 2026", completed: true, current: true },
      { stage: "SELECTED", label: "Selected", completed: false, current: false },
    ],
    interviewDate: "May 22, 2026 at 11:30 AM",
    interviewMode: "ONLINE",
    notes: "Online video interview link will be active 15 minutes before the session.",
  },
];

export const APPLICATION_STATS = {
  applied: 12,
  underReview: 5,
  shortlisted: 3,
  interview: 1,
  selected: 0,
};

export const MENTORS: Mentor[] = [
  {
    id: "mentor-1",
    name: "Sunita Deshmukh",
    role: "Senior Electrical Engineer",
    industry: "Manufacturing",
    experience: "14 years",
    expertise: ["Panel Design", "Site Safety", "Interviews"],
    availability: "2 slots this week",
    image: story1,
    rating: 4.9,
    sessionsCount: 48,
  },
  {
    id: "mentor-2",
    name: "Ramesh Patil",
    role: "Workshop Superintendent",
    industry: "Automotive",
    experience: "22 years",
    expertise: ["Fitter Trade", "Apprenticeships", "Shop-floor readiness"],
    availability: "Weekends only",
    image: mentorGuiding,
    rating: 4.8,
    sessionsCount: 65,
  },
  {
    id: "mentor-3",
    name: "Ayaan Sheikh",
    role: "Plant Maintenance Lead",
    industry: "Renewable Energy",
    experience: "9 years",
    expertise: ["Solar", "Preventive Maintenance", "Certifications"],
    availability: "3 slots this week",
    image: story2,
    rating: 4.9,
    sessionsCount: 31,
  },
];

export const UPCOMING_MENTORSHIP: MentorshipSession = {
  id: "session-1",
  title: "Interview preparation & Technical Q&A",
  mentorName: "Sunita Deshmukh",
  mentorRole: "Senior Electrical Engineer · Manufacturing",
  dateTime: "Friday, May 22 · 4:00 PM - 4:45 PM",
  mode: "ONLINE",
  locationOrLink: "Google Meet (Link will be sent to WhatsApp & SMS)",
  status: "CONFIRMED",
};

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Application shortlisted",
    description: "Your application at Shakti Manufacturing moved to SHORTLISTED.",
    time: "2 hours ago",
    read: false,
    type: "application",
    actionUrl: "/student/applications",
  },
  {
    id: "notif-2",
    title: "Mentorship accepted",
    description: "Sunita Deshmukh accepted your mentorship request for Friday 4:00 PM.",
    time: "Yesterday",
    read: false,
    type: "mentorship",
    actionUrl: "/student/mentorship",
  },
  {
    id: "notif-3",
    title: "New opportunity match",
    description: "A new Electrical Technician opportunity matches 92% of your profile.",
    time: "1 day ago",
    read: false,
    type: "opportunity",
    actionUrl: "/student/opportunities",
  },
  {
    id: "notif-4",
    title: "Profile improvement tip",
    description: "Adding your preferred industry can improve your recommendation score.",
    time: "3 days ago",
    read: true,
    type: "profile",
    actionUrl: "/student/profile",
  },
];

export const AI_SUGGESTED_PROMPTS = [
  "What should I learn to become job-ready?",
  "How can I improve my interview skills?",
  "Which skills should I learn for industrial electrical work?",
  "Help me prepare for an interview at Shakti Manufacturing.",
  "Explain what a high-voltage panel lockout/tagout procedure is in simple words.",
  "What are the best government apprenticeships for ITI Electricians in Maharashtra?",
];
