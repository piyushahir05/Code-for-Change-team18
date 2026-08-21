import heroStudent from "@/assets/hero-student.jpg";
import workshop from "@/assets/workshop.jpg";
import mentorGuiding from "@/assets/mentor-guiding.jpg";
import industryImg from "@/assets/industry.jpg";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";

export type AdminUserRole = "STUDENT" | "MENTOR" | "RECRUITER" | "ADMIN";
export type AdminVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type AdminOpportunityStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
export type AdminOpportunityType = "JOB" | "APPRENTICESHIP" | "RECRUITMENT_DRIVE";

export interface AdminAnalyticsData {
  totalStudents: number;
  verifiedStudents: number;
  totalMentors: number;
  totalRecruiters: number;
  verifiedRecruiters: number;
  activeOpportunities: number;
  totalApplications: number;
  placements: number;
}

export interface VerificationCandidate {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: AdminUserRole;
  avatar: string;
  location: string;
  submittedAt: string;
  status: AdminVerificationStatus;
  rejectionReason?: string;
  // Student Specific
  age?: number;
  gender?: string;
  iti?: string;
  trade?: string;
  education?: string;
  experience?: string;
  careerGoal?: string;
  preferredIndustry?: string;
  preferredLocation?: string;
  preferredLanguage?: string;
  skills?: string[];
  interests?: string[];
  // Mentor Specific
  organization?: string;
  expertise?: string;
  bio?: string;
  // Recruiter Specific
  companyName?: string;
  industry?: string;
  website?: string;
  hiringFocus?: string[];
}

export interface AdminOpportunity {
  id: string;
  recruiterId: string;
  company: string;
  title: string;
  type: AdminOpportunityType;
  trade: string;
  location: string;
  salaryStipend: string;
  eligibility: string;
  experience: string;
  deadline: string;
  submittedAt: string;
  description: string;
  status: AdminOpportunityStatus;
  rejectionReason?: string;
  requiredSkills: string[];
}

export interface AdminLearningResource {
  id: string;
  title: string;
  category: "Technical Skills" | "Digital Skills" | "Workplace Readiness" | "Financial Literacy" | "Safety & 5S" | "Communication" | "Labour Laws";
  trade?: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  resourceType: "Interactive Module" | "Video Lecture" | "Shop-floor Simulator" | "PDF Guide";
  url: string;
  completionsCount: number;
}

export interface AdminActivityLog {
  id: string;
  title: string;
  description: string;
  time: string;
  type: "VERIFICATION" | "OPPORTUNITY" | "USER" | "SYSTEM";
  actor: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "VERIFICATION" | "OPPORTUNITY" | "SYSTEM";
  linkTo?: string;
}

// Initial Analytics matching backend AnalyticsOut schema
export const INITIAL_ADMIN_ANALYTICS: AdminAnalyticsData = {
  totalStudents: 1248,
  verifiedStudents: 932,
  totalMentors: 86,
  totalRecruiters: 42,
  verifiedRecruiters: 38,
  activeOpportunities: 74,
  totalApplications: 536,
  placements: 128,
};

// Initial Verification Queue (Students, Mentors, Recruiters)
export const INITIAL_VERIFICATIONS: VerificationCandidate[] = [
  {
    id: "ver-001",
    userId: "usr_stu_amit",
    name: "Amit Verma",
    email: "amit.welder@example.com",
    phone: "+91 98450 12345",
    role: "STUDENT",
    avatar: story2,
    location: "Nashik, Maharashtra",
    submittedAt: "2024-08-18",
    status: "PENDING",
    age: 21,
    gender: "Male",
    iti: "Government ITI Nashik",
    trade: "Welder",
    education: "10th + ITI (NCVT)",
    experience: "6 months practical internship",
    careerGoal: "Certified Structural Welder",
    preferredIndustry: "Heavy Engineering & Automotive",
    preferredLocation: "Nashik / Pune",
    preferredLanguage: "Hindi & Marathi",
    skills: ["Arc Welding", "TIG/MIG Basics", "Blueprint Reading", "Workplace Safety"],
    interests: ["Fabrication", "Renewable Energy", "Building Things"],
  },
  {
    id: "ver-002",
    userId: "usr_rec_thermax",
    name: "Thermax Energy Solutions Ltd",
    email: "careers@thermaxenergy.example.com",
    phone: "+91 20 6605 1200",
    role: "RECRUITER",
    avatar: industryImg,
    location: "Pune, Maharashtra",
    submittedAt: "2024-08-19",
    status: "PENDING",
    companyName: "Thermax Limited",
    industry: "Energy & Boiler Systems",
    website: "https://www.thermaxglobal.com",
    hiringFocus: ["Electrician", "Fitter", "Welder", "Solar Technician"],
  },
  {
    id: "ver-003",
    userId: "usr_men_rajesh",
    name: "Dr. Rajesh Mishra",
    email: "rajesh.mishra@example.com",
    phone: "+91 94220 54321",
    role: "MENTOR",
    avatar: mentorGuiding,
    location: "Pune, Maharashtra",
    submittedAt: "2024-08-19",
    status: "PENDING",
    organization: "Automotive Research Association of India (ARAI)",
    expertise: "Electrician & EV Powertrain",
    bio: "22 years in automotive high-voltage electrical safety and power distribution. Passionate about training ITI youth.",
  },
  {
    id: "ver-004",
    userId: "usr_stu_kavita",
    name: "Kavita Rathod",
    email: "kavita.copa@example.com",
    phone: "+91 98210 99887",
    role: "STUDENT",
    avatar: story1,
    location: "Pune, Maharashtra",
    submittedAt: "2024-08-20",
    status: "PENDING",
    age: 20,
    gender: "Female",
    iti: "Government ITI Pune (Ghole Road)",
    trade: "COPA (Computer Operator & Programming Assistant)",
    education: "12th + ITI Pass",
    experience: "Fresher",
    careerGoal: "Junior Database & Shop-floor ERP Coordinator",
    preferredIndustry: "IT & Industrial Automation",
    preferredLocation: "Pune",
    preferredLanguage: "Marathi, English & Hindi",
    skills: ["Python Basics", "SQL & Excel", "Data Entry", "Digital Tools"],
    interests: ["Software", "Automation", "Problem Solving"],
  },
  {
    id: "ver-005",
    userId: "usr_rec_bajaj",
    name: "Bajaj Auto Limited",
    email: "apprenticeships@bajajauto.example.com",
    phone: "+91 20 2747 2851",
    role: "RECRUITER",
    avatar: workshop,
    location: "Akurdi, Pune",
    submittedAt: "2024-08-17",
    status: "VERIFIED",
    companyName: "Bajaj Auto Ltd",
    industry: "Automotive & Two-Wheelers",
    website: "https://www.bajajauto.com",
    hiringFocus: ["Fitter", "Machinist", "MMV", "Electrician"],
  },
  {
    id: "ver-006",
    userId: "usr_stu_priya",
    name: "Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "+91 98765 12340",
    role: "STUDENT",
    avatar: heroStudent,
    location: "Pune, Maharashtra",
    submittedAt: "2024-08-10",
    status: "VERIFIED",
    age: 21,
    gender: "Female",
    iti: "Government ITI Pune",
    trade: "Electrician",
    education: "10th + ITI Certified",
    experience: "1 year workshop practicals",
    careerGoal: "Industrial Electrician",
    preferredIndustry: "Automotive & Manufacturing",
    preferredLocation: "Pune / Chakan",
    preferredLanguage: "Hindi & Marathi",
    skills: ["Electrical Fundamentals", "Industrial Safety & LOTO", "PLC Basics", "Multimeter Diagnostics"],
    interests: ["Automation", "Electrical Systems", "Machines"],
  },
];

// Initial Opportunity Approval Queue (aligns with backend Opportunity model)
export const INITIAL_ADMIN_OPPORTUNITIES: AdminOpportunity[] = [
  {
    id: "opp-admin-001",
    recruiterId: "rec_thermax",
    company: "Thermax Limited",
    title: "Industrial Boiler Welder & Fitter Apprentice",
    type: "APPRENTICESHIP",
    trade: "Welder",
    location: "Pune (Chinchwad Plant)",
    salaryStipend: "₹15,000 / month + Canteen",
    eligibility: "ITI Welder / Fitter (NCVT/SCVT) Passout 2023 or 2024.",
    experience: "Freshers / < 1 Year",
    deadline: "2024-09-30",
    submittedAt: "2024-08-18",
    description: "Thermax Energy Solutions requires 15 Welder & Fitter apprentices for boiler tube welding and high-pressure steam vessel assembly under NAPS.",
    status: "PENDING",
    requiredSkills: ["Arc & TIG Welding", "Pressure Vessel Fitting", "Shop Safety & LOTO", "Blueprint Reading"],
  },
  {
    id: "opp-admin-002",
    recruiterId: "rec_bajaj",
    company: "Bajaj Auto Ltd",
    title: "Two-Wheeler Transmission Assembly Technician",
    type: "JOB",
    trade: "Fitter",
    location: "Pune (Chakan Plant 2)",
    salaryStipend: "₹17,500 / month + Subsidized Meal & Transport",
    eligibility: "ITI Fitter / Turner / MMV with min 60% aggregate.",
    experience: "0–2 Years",
    deadline: "2024-10-15",
    submittedAt: "2024-08-19",
    description: "Immediate requirement for transmission line fitters. Responsible for gear assembly, torque tightening, and end-of-line dyno inspection.",
    status: "PENDING",
    requiredSkills: ["Precision Bench Fitting", "Torque Tool Operation", "5S Workplace Standards"],
  },
  {
    id: "opp-admin-003",
    recruiterId: "rec_tata",
    company: "Tata Motors",
    title: "Electrician Apprentice — Shop Floor Assembly",
    type: "APPRENTICESHIP",
    trade: "Electrician",
    location: "Pune (Chakan Plant)",
    salaryStipend: "₹14,500 / month + Transport",
    eligibility: "ITI Electrician / Wireman (NCVT).",
    experience: "Freshers",
    deadline: "2024-09-30",
    submittedAt: "2024-08-10",
    description: "Vehicle electrical harness integration, industrial panel maintenance, and diagnostic testing at Tata Motors Chakan.",
    status: "APPROVED",
    requiredSkills: ["Electrical Fundamentals", "Industrial Safety & LOTO", "PLC Basics"],
  },
  {
    id: "opp-admin-004",
    recruiterId: "rec_tata",
    company: "Tata Motors",
    title: "Mega Campus Hiring Drive — ITI Electrician & MMV",
    type: "RECRUITMENT_DRIVE",
    trade: "Electrician",
    location: "Pune (Y4D Center & Chakan)",
    salaryStipend: "₹15,000–₹18,500 / month",
    eligibility: "All 2023 & 2024 ITI Graduates.",
    experience: "Fresh ITI Graduates",
    deadline: "2024-09-15",
    submittedAt: "2024-08-05",
    description: "Annual Saksham Mega Hiring Drive. On-the-spot technical aptitude assessments and practical trade tests.",
    status: "APPROVED",
    requiredSkills: ["Electrical Fundamentals", "Safety Protocol", "Communication"],
  },
];

// Initial Learning Resources (matching backend LearningResource model)
export const INITIAL_ADMIN_RESOURCES: AdminLearningResource[] = [
  {
    id: "res-001",
    title: "Industrial Safety, PPE & Lockout/Tagout (LOTO) Protocol",
    category: "Safety & 5S",
    trade: "Electrician",
    duration: "45 mins",
    difficulty: "Beginner",
    resourceType: "Interactive Module",
    url: "/student/learning",
    completionsCount: 842,
  },
  {
    id: "res-002",
    title: "Industrial Motor Control Circuits & Star-Delta Starters",
    category: "Technical Skills",
    trade: "Electrician",
    duration: "1.5 hours",
    difficulty: "Intermediate",
    resourceType: "Shop-floor Simulator",
    url: "/student/learning",
    completionsCount: 620,
  },
  {
    id: "res-003",
    title: "Precision Metrology: Vernier Caliper & Micrometer Calibration",
    category: "Technical Skills",
    trade: "Fitter",
    duration: "1 hour",
    difficulty: "Beginner",
    resourceType: "Video Lecture",
    url: "/student/learning",
    completionsCount: 512,
  },
  {
    id: "res-004",
    title: "Shop-Floor Communication & Handling Hierarchy in Plant Environments",
    category: "Communication",
    duration: "30 mins",
    difficulty: "Beginner",
    resourceType: "Interactive Module",
    url: "/student/learning",
    completionsCount: 789,
  },
  {
    id: "res-005",
    title: "Understanding ITI Apprentice Labour Laws, NAPS Stipends & EPF Rights",
    category: "Labour Laws",
    duration: "40 mins",
    difficulty: "Beginner",
    resourceType: "PDF Guide",
    url: "/student/learning",
    completionsCount: 430,
  },
  {
    id: "res-006",
    title: "Digital Workplace Literacy: Digital Multimeters & Basic PLC HMI Interfaces",
    category: "Digital Skills",
    trade: "Electronics Mechanic",
    duration: "1.2 hours",
    difficulty: "Intermediate",
    resourceType: "Shop-floor Simulator",
    url: "/student/learning",
    completionsCount: 395,
  },
];

// Initial Activity Log
export const INITIAL_ADMIN_ACTIVITY: AdminActivityLog[] = [
  {
    id: "act-001",
    title: "Opportunity Approved",
    description: "Electrician Apprentice posting by Tata Motors approved for student feed.",
    time: "25 mins ago",
    type: "OPPORTUNITY",
    actor: "Admin (Y4D Foundation)",
  },
  {
    id: "act-002",
    title: "Recruiter Registration Submitted",
    description: "Thermax Limited submitted organization documents for verification.",
    time: "1 hour ago",
    type: "VERIFICATION",
    actor: "Thermax Energy Solutions",
  },
  {
    id: "act-003",
    title: "Student Verification Approved",
    description: "Priya Sharma (Electrician, ITI Pune) profile verified by admin.",
    time: "3 hours ago",
    type: "VERIFICATION",
    actor: "Admin (Y4D Foundation)",
  },
  {
    id: "act-004",
    title: "New Opportunity Submitted",
    description: "Industrial Boiler Welder posting submitted by Thermax Limited for approval.",
    time: "5 hours ago",
    type: "OPPORTUNITY",
    actor: "Thermax Limited",
  },
  {
    id: "act-005",
    title: "Placement Recorded",
    description: "Ravi Kumar accepted apprenticeship offer at Tata Motors Pune plant.",
    time: "1 day ago",
    type: "USER",
    actor: "System Engine",
  },
];

// Initial Admin Notifications
export const INITIAL_ADMIN_NOTIFICATIONS: AdminNotification[] = [
  {
    id: "notif-adm-001",
    title: "2 Opportunities Awaiting Approval",
    description: "Thermax Limited and Bajaj Auto submitted apprenticeship requirements.",
    time: "30 mins ago",
    read: false,
    type: "OPPORTUNITY",
    linkTo: "/admin/opportunities",
  },
  {
    id: "notif-adm-002",
    title: "4 New Verification Requests",
    description: "Students from ITI Nashik and ITI Pune uploaded trade certificates.",
    time: "2 hours ago",
    read: false,
    type: "VERIFICATION",
    linkTo: "/admin/verifications",
  },
  {
    id: "notif-adm-003",
    title: "Placement Target Milestone Reached",
    description: "128 ITI graduates have been placed in certified apprenticeships this batch.",
    time: "1 day ago",
    read: true,
    type: "SYSTEM",
    linkTo: "/admin/analytics",
  },
];
