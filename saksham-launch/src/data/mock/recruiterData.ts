import heroStudent from "@/assets/hero-student.jpg";
import workshop from "@/assets/workshop.jpg";
import mentorGuiding from "@/assets/mentor-guiding.jpg";
import industryImg from "@/assets/industry.jpg";
import story1 from "@/assets/story-1.jpg";
import story2 from "@/assets/story-2.jpg";

export interface RecruiterCompanyProfile {
  id: string;
  userId: string;
  companyName: string;
  tagline: string;
  description: string;
  industry: string;
  location: string;
  headquarters: string;
  website: string;
  verificationStatus: "VERIFIED" | "PENDING";
  verifiedAt: string;
  logo: string;
  hiringFocus: string[];
  stats: {
    activeOpportunities: number;
    totalApplicants: number;
    shortlistedCount: number;
    hiredCount: number;
  };
  contactPerson: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
}

export interface CandidateSkill {
  name: string;
  score: number; // 0-100
  isVerified: boolean;
}

export interface CandidateProject {
  title: string;
  description: string;
  technologies: string[];
  completionDate: string;
}

export interface CandidateCertification {
  title: string;
  issuer: string;
  issueDate: string;
  verified: boolean;
}

export interface CandidateLearningModule {
  moduleName: string;
  progress: number;
  status: "COMPLETED" | "IN_PROGRESS";
}

export interface Candidate {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  location: string;
  iti: string;
  trade: string;
  education: string;
  experience: string;
  careerGoal: string;
  preferredIndustry: string;
  preferredLocation: string;
  skillConfidence: number; // 1-5
  profileCompletion: number; // 0-100
  careerReadinessScore: number; // 0-100
  preferredLanguage: string;
  isVerified: boolean;
  matchScore: number; // calculated 0-100 for default view
  matchReasons: string[];
  skills: CandidateSkill[];
  interests: string[];
  certifications: CandidateCertification[];
  learningProgress: CandidateLearningModule[];
  projects: CandidateProject[];
  careerJourneyStep: number; // 1 to 6
  applicationStatus?: "APPLIED" | "SCREENED" | "SHORTLISTED" | "INTERVIEW_SCHEDULED" | "SELECTED" | "REJECTED";
  matchedOpportunityId?: string;
  matchedOpportunityTitle?: string;
  appliedDate?: string;
}

export interface OpportunitySkill {
  skillName: string;
  requiredLevel: "Basic" | "Intermediate" | "Advanced";
}

export interface Opportunity {
  id: string;
  recruiterId: string;
  type: "JOB" | "APPRENTICESHIP" | "RECRUITMENT_DRIVE" | "TRAINING_PROGRAM" | "GOVERNMENT_OPPORTUNITY" | "INDUSTRY_EXPOSURE";
  title: string;
  company: string;
  location: string;
  trade: string;
  description: string;
  positionsCount: number;
  salaryStipend: string;
  eligibility: string;
  experienceRequired: string;
  deadline: string;
  postedDate: string;
  status: "ACTIVE" | "DRAFT" | "CLOSED";
  applicantsCount: number;
  shortlistedCount: number;
  requiredSkills: OpportunitySkill[];
  benefits: string[];
}

export interface InterviewRecord {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  candidateTrade: string;
  opportunityId: string;
  opportunityTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  mode: "IN_PERSON" | "ONLINE";
  locationOrLink: string;
  notes?: string;
  status: "SCHEDULED" | "COMPLETED" | "CANCELLED";
}

export interface RecruiterNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "APPLICATION" | "INTERVIEW" | "MATCH" | "SYSTEM";
  linkTo?: string;
}

// Initial Mock Company Profile (Tata Motors)
export const INITIAL_RECRUITER_PROFILE: RecruiterCompanyProfile = {
  id: "rec-001",
  userId: "usr_recruiter_tata",
  companyName: "Tata Motors",
  tagline: "Connecting Aspirations · Pioneer in Indian Commercial & Passenger Mobility",
  description:
    "Tata Motors Limited is a leading global automobile manufacturer with a portfolio that covers cars, sports utility vehicles, trucks, buses, and defense vehicles. As an active industry partner with Y4D Foundation and Saksham, we provide structured shop-floor apprenticeships and long-term career progression for ITI graduates.",
  industry: "Automotive & Manufacturing",
  location: "Pune, Maharashtra",
  headquarters: "Mumbai, Maharashtra",
  website: "https://www.tatamotors.com/careers",
  verificationStatus: "VERIFIED",
  verifiedAt: "2024-03-15",
  logo: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=200&auto=format&fit=crop&q=80",
  hiringFocus: ["Electrician", "Fitter", "Welder", "Machinist", "Mechanic Motor Vehicle (MMV)", "Solar Technician"],
  stats: {
    activeOpportunities: 12,
    totalApplicants: 248,
    shortlistedCount: 42,
    hiredCount: 18,
  },
  contactPerson: {
    name: "Rajesh Kulkarni",
    role: "Head of Technical Talent Acquisition & Apprenticeships",
    email: "rajesh.kulkarni@tatamotors.example.com",
    phone: "+91 98230 45678",
  },
};

// Initial Shared Conceptual Candidates (matches Student Portal)
export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: "student-001",
    name: "Priya Sharma",
    avatar: heroStudent,
    age: 21,
    gender: "Female",
    location: "Pune, Maharashtra",
    iti: "Government ITI Pune (Ghole Road)",
    trade: "Electrician",
    education: "10th + ITI Certified",
    experience: "1 year workshop practicals",
    careerGoal: "Industrial Electrician",
    preferredIndustry: "Automotive & Manufacturing",
    preferredLocation: "Pune / Chakan Industrial Belt",
    skillConfidence: 5,
    profileCompletion: 96,
    careerReadinessScore: 91,
    preferredLanguage: "Hindi & Marathi",
    isVerified: true,
    matchScore: 96,
    matchReasons: ["Exact trade match (Electrician)", "95% in Electrical Fundamentals", "Chakan belt local"],
    skills: [
      { name: "Electrical Fundamentals", score: 95, isVerified: true },
      { name: "Industrial Safety & LOTO", score: 91, isVerified: true },
      { name: "PLC Basics & Relay Wiring", score: 84, isVerified: true },
      { name: "Digital Tools & Multimeter", score: 88, isVerified: true },
      { name: "Shop-floor Communication", score: 76, isVerified: false },
    ],
    interests: ["Automation", "Electrical Systems", "Machines", "Problem Solving"],
    certifications: [
      { title: "NCVT National Trade Certificate (Electrician)", issuer: "DGT / NCVT", issueDate: "2024", verified: true },
      { title: "Industrial Safety & Lockout/Tagout (LOTO)", issuer: "Y4D / Saksham", issueDate: "2024", verified: true },
      { title: "Digital Workplace Readiness", issuer: "Saksham Foundation", issueDate: "2024", verified: true },
    ],
    learningProgress: [
      { moduleName: "Industrial Motor Control & Starters", progress: 100, status: "COMPLETED" },
      { moduleName: "Workplace Communication & Safety", progress: 90, status: "COMPLETED" },
      { moduleName: "PLC Ladder Logic Introduction", progress: 75, status: "IN_PROGRESS" },
      { moduleName: "Shop-floor Preventive Maintenance", progress: 85, status: "IN_PROGRESS" },
    ],
    projects: [
      {
        title: "Industrial Motor Control Panel Assembly",
        description: "Assembled a 3-phase star-delta starter control panel with thermal overload relays and indicator lamps at ITI Pune workshop.",
        technologies: ["Panel Wiring", "Star-Delta", "MCB/RCCB", "Testing"],
        completionDate: "May 2024",
      },
      {
        title: "Factory Shop-floor Earthing & Multimeter Audit",
        description: "Conducted pit earth resistance tests and recorded multimeter load distributions across 12 lathe workstations.",
        technologies: ["Earth Testing", "Multimeter", "Safety Protocol"],
        completionDate: "July 2024",
      },
    ],
    careerJourneyStep: 5,
    applicationStatus: "SHORTLISTED",
    matchedOpportunityId: "opp-001",
    matchedOpportunityTitle: "Electrician Apprentice — Shop Floor Assembly",
    appliedDate: "2024-08-14",
  },
  {
    id: "student-002",
    name: "Rahul Patil",
    avatar: workshop,
    age: 20,
    gender: "Male",
    location: "Chakan, Pune",
    iti: "Government ITI Aundh, Pune",
    trade: "Fitter",
    education: "10th + ITI Certified",
    experience: "8 months CNC & benchwork",
    careerGoal: "Precision Assembly Specialist",
    preferredIndustry: "Automotive",
    preferredLocation: "Chakan, Pune",
    skillConfidence: 4,
    profileCompletion: 92,
    careerReadinessScore: 88,
    preferredLanguage: "Marathi & Hindi",
    isVerified: true,
    matchScore: 91,
    matchReasons: ["Strong bench fitting skills", "Near Chakan assembly plant", "88% Career Readiness"],
    skills: [
      { name: "Precision Bench Fitting", score: 92, isVerified: true },
      { name: "Lathe & Milling Machine", score: 86, isVerified: true },
      { name: "Blueprint Reading & GD&T", score: 85, isVerified: true },
      { name: "Shop-floor Safety Protocol", score: 90, isVerified: true },
      { name: "Pneumatic Assembly", score: 72, isVerified: false },
    ],
    interests: ["Machines", "Manufacturing", "Hands-on Work", "Building Things"],
    certifications: [
      { title: "NCVT Trade Certificate (Fitter)", issuer: "DGT / NCVT", issueDate: "2024", verified: true },
      { title: "5S & Quality Inspection Basics", issuer: "Saksham Foundation", issueDate: "2024", verified: true },
    ],
    learningProgress: [
      { moduleName: "CNC Turning & Precision Tolerance", progress: 95, status: "COMPLETED" },
      { moduleName: "Blueprint Reading Fundamentals", progress: 85, status: "COMPLETED" },
    ],
    projects: [
      {
        title: "Taper Turning & Gear Alignment Setup",
        description: "Machined mating spur gears on universal milling machines within 0.02mm tolerance limits.",
        technologies: ["Milling", "Vernier Caliper", "Micrometer"],
        completionDate: "April 2024",
      },
    ],
    careerJourneyStep: 5,
    applicationStatus: "INTERVIEW_SCHEDULED",
    matchedOpportunityId: "opp-002",
    matchedOpportunityTitle: "CNC Machinist & Precision Assembly Trainee",
    appliedDate: "2024-08-12",
  },
  {
    id: "student-003",
    name: "Sneha Jadhav",
    avatar: mentorGuiding,
    age: 21,
    gender: "Female",
    location: "Nashik / Pune",
    iti: "Government ITI Nashik",
    trade: "Electronics Mechanic",
    education: "12th + ITI Certified",
    experience: "1 year PCB soldering & sensor testing",
    careerGoal: "Automation Testing Technician",
    preferredIndustry: "Electronics & EV Systems",
    preferredLocation: "Pune",
    skillConfidence: 4,
    profileCompletion: 94,
    careerReadinessScore: 89,
    preferredLanguage: "Marathi & English",
    isVerified: true,
    matchScore: 88,
    matchReasons: ["EV harness diagnostics", "Top 5% in digital multimeter testing"],
    skills: [
      { name: "PCB Soldering & Desoldering", score: 94, isVerified: true },
      { name: "Sensor & Transducer Testing", score: 88, isVerified: true },
      { name: "EV Wiring Harness Assembly", score: 85, isVerified: true },
      { name: "Microcontroller Basics", score: 80, isVerified: true },
      { name: "Digital Tools & Diagnostics", score: 86, isVerified: true },
    ],
    interests: ["Electronics", "Automation", "Technology", "Problem Solving"],
    certifications: [
      { title: "NCVT Electronics Mechanic Certificate", issuer: "DGT / NCVT", issueDate: "2024", verified: true },
      { title: "EV Powertrain Diagnostics Certificate", issuer: "Saksham Foundation", issueDate: "2024", verified: true },
    ],
    learningProgress: [
      { moduleName: "EV Battery Management Sensor Testing", progress: 100, status: "COMPLETED" },
      { moduleName: "Oscilloscope Waveform Diagnostics", progress: 90, status: "COMPLETED" },
    ],
    projects: [
      {
        title: "Automated Conveyor Optical Sensor Circuit",
        description: "Built and calibrated infrared proximity detection module with audible alert buzzer for robotic arm simulation.",
        technologies: ["IR Sensors", "Relay Control", "Soldering"],
        completionDate: "June 2024",
      },
    ],
    careerJourneyStep: 5,
    applicationStatus: "SHORTLISTED",
    matchedOpportunityId: "opp-001",
    matchedOpportunityTitle: "Electrician Apprentice — Shop Floor Assembly",
    appliedDate: "2024-08-15",
  },
  {
    id: "student-004",
    name: "Aarav Sharma",
    avatar: story1,
    age: 20,
    gender: "Male",
    location: "Pune, Maharashtra",
    iti: "Government ITI Pune (Ghole Road)",
    trade: "Electrician",
    education: "10th + ITI Certified",
    experience: "Beginner · Active Trainee",
    careerGoal: "Industrial Electrician",
    preferredIndustry: "Manufacturing",
    preferredLocation: "Pune",
    skillConfidence: 4,
    profileCompletion: 90,
    careerReadinessScore: 78,
    preferredLanguage: "Hindi & English",
    isVerified: true,
    matchScore: 84,
    matchReasons: ["Strong safety scores", "Completed 3 verified Saksham course modules"],
    skills: [
      { name: "Basic Wiring & Schematics", score: 88, isVerified: true },
      { name: "Electrical Maintenance", score: 82, isVerified: true },
      { name: "Safety Procedures & PPE", score: 92, isVerified: true },
      { name: "Motor Starters & Testing", score: 74, isVerified: false },
    ],
    interests: ["Electrical Systems", "Machines", "Automation"],
    certifications: [
      { title: "Industrial Wiring Basics", issuer: "Y4D Foundation", issueDate: "2024", verified: true },
    ],
    learningProgress: [
      { moduleName: "Workplace Safety & 5S Implementation", progress: 100, status: "COMPLETED" },
      { moduleName: "Blueprint Reading & Circuit Design", progress: 65, status: "IN_PROGRESS" },
    ],
    projects: [
      {
        title: "Distribution Board Multi-load Wiring",
        description: "Connected 8-way MCB distribution board with residual current circuit breakers and neutral links.",
        technologies: ["MCB", "Distribution Board", "Wire Crimping"],
        completionDate: "June 2024",
      },
    ],
    careerJourneyStep: 4,
    applicationStatus: "SCREENED",
    matchedOpportunityId: "opp-001",
    matchedOpportunityTitle: "Electrician Apprentice — Shop Floor Assembly",
    appliedDate: "2024-08-16",
  },
  {
    id: "student-005",
    name: "Vikram Shinde",
    avatar: story2,
    age: 22,
    gender: "Male",
    location: "Aurangabad / Pune",
    iti: "Government ITI Aurangabad",
    trade: "Welder",
    education: "10th + ITI Certified",
    experience: "1.5 years TIG/MIG welding",
    careerGoal: "Certified Structural Welder",
    preferredIndustry: "Automotive & Heavy Engineering",
    preferredLocation: "Pune / Chakan",
    skillConfidence: 5,
    profileCompletion: 95,
    careerReadinessScore: 93,
    preferredLanguage: "Marathi & Hindi",
    isVerified: true,
    matchScore: 94,
    matchReasons: ["TIG/MIG Argon gas certification", "Prior fabrication experience"],
    skills: [
      { name: "TIG (GTAW) & MIG (GMAW) Welding", score: 96, isVerified: true },
      { name: "Arc Welding & Joint Prep", score: 94, isVerified: true },
      { name: "Weld Inspection & Dye Penetrant", score: 86, isVerified: true },
      { name: "Safety & Fume Extraction", score: 92, isVerified: true },
    ],
    interests: ["Manufacturing", "Hands-on Work", "Building Things"],
    certifications: [
      { title: "NCVT Welder National Certificate", issuer: "DGT / NCVT", issueDate: "2023", verified: true },
      { title: "ASME 3G/4G Plate Welding Qualifier", issuer: "Welding Research Institute", issueDate: "2024", verified: true },
    ],
    learningProgress: [
      { moduleName: "Non-Destructive Testing (NDT) Basics", progress: 90, status: "COMPLETED" },
    ],
    projects: [
      {
        title: "Automotive Tubular Chassis Welding Rig",
        description: "Welded high-tensile steel tube roll-cage assembly adhering to tight angular tolerance limits with zero slag defects.",
        technologies: ["MIG Welding", "Jig Setup", "Beveling"],
        completionDate: "March 2024",
      },
    ],
    careerJourneyStep: 5,
    applicationStatus: "SHORTLISTED",
    matchedOpportunityId: "opp-004",
    matchedOpportunityTitle: "Structural TIG/MIG Welder Apprentice",
    appliedDate: "2024-08-11",
  },
  {
    id: "student-006",
    name: "Pooja Mane",
    avatar: industryImg,
    age: 20,
    gender: "Female",
    location: "Kolhapur / Pune",
    iti: "Government ITI Kolhapur",
    trade: "Machinist",
    education: "12th + ITI Certified",
    experience: "1 year CNC milling & grinding",
    careerGoal: "CNC Operations Specialist",
    preferredIndustry: "Manufacturing",
    preferredLocation: "Pune",
    skillConfidence: 4,
    profileCompletion: 91,
    careerReadinessScore: 86,
    preferredLanguage: "Marathi",
    isVerified: true,
    matchScore: 89,
    matchReasons: ["CNC Fanuc controller certified", "High dimensional accuracy testing"],
    skills: [
      { name: "CNC Milling & G-Code Editing", score: 90, isVerified: true },
      { name: "Surface Grinding & Honing", score: 88, isVerified: true },
      { name: "Dial Indicator & Micrometer Metrology", score: 92, isVerified: true },
      { name: "Workshop Safety 5S", score: 88, isVerified: true },
    ],
    interests: ["Machines", "Manufacturing", "Problem Solving"],
    certifications: [
      { title: "NCVT Machinist National Certificate", issuer: "DGT / NCVT", issueDate: "2024", verified: true },
    ],
    learningProgress: [
      { moduleName: "Advanced CNC Tool Compensation", progress: 85, status: "IN_PROGRESS" },
    ],
    projects: [
      {
        title: "Hydraulic Manifold Block CNC Machining",
        description: "Programmed Fanuc 3-axis CNC vertical machining center for multi-port hydraulic valve block.",
        technologies: ["CNC VMC", "Fanuc", "Tooling"],
        completionDate: "May 2024",
      },
    ],
    careerJourneyStep: 4,
    applicationStatus: "SCREENED",
    matchedOpportunityId: "opp-002",
    matchedOpportunityTitle: "CNC Machinist & Precision Assembly Trainee",
    appliedDate: "2024-08-17",
  },
];

// Initial Mock Opportunities (Tata Motors)
export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: "opp-001",
    recruiterId: "rec-001",
    type: "APPRENTICESHIP",
    title: "Electrician Apprentice — Shop Floor Assembly",
    company: "Tata Motors",
    location: "Pune (Chakan Plant)",
    trade: "Electrician",
    description:
      "Tata Motors is hiring 20 Electrician Apprentices under NAPS (National Apprenticeship Promotion Scheme) for our Chakan Assembly Plant. Selected trainees will work on vehicle electrical harness integration, industrial panel maintenance, and diagnostic testing.",
    positionsCount: 20,
    salaryStipend: "₹14,500 / month + Canteen & Transport",
    eligibility: "ITI Pass (Electrician / Wireman) from recognized ITI institute (NCVT/SCVT). Passout batches 2023 or 2024.",
    experienceRequired: "Freshers / Beginner to 1 Year",
    deadline: "2024-09-30",
    postedDate: "2024-08-10",
    status: "ACTIVE",
    applicantsCount: 124,
    shortlistedCount: 18,
    requiredSkills: [
      { skillName: "Electrical Fundamentals", requiredLevel: "Intermediate" },
      { skillName: "Industrial Safety & LOTO", requiredLevel: "Intermediate" },
      { skillName: "PLC Basics & Wiring", requiredLevel: "Basic" },
      { skillName: "Digital Multimeter Diagnostics", requiredLevel: "Intermediate" },
    ],
    benefits: ["NAPS Government Apprenticeship Certificate", "Subsidized Transport from Pune & Pimpri", "Shop-floor Safety Gear provided", "Career absorption opportunity upon completion"],
  },
  {
    id: "opp-002",
    recruiterId: "rec-001",
    type: "JOB",
    title: "CNC Machinist & Precision Assembly Trainee",
    company: "Tata Motors",
    location: "Pune (Pimpri Plant)",
    trade: "Machinist",
    description:
      "Immediate hiring for CNC Machinists and Fitters for transmission case manufacturing line. Responsibilities include tool setting, coordinate offsets, quality dimension inspection, and regular coolant maintenance.",
    positionsCount: 15,
    salaryStipend: "₹16,800 / month + Performance Bonus",
    eligibility: "ITI Machinist / Fitter / Turner with basic G-code or bench assembly knowledge.",
    experienceRequired: "0–2 Years",
    deadline: "2024-10-15",
    postedDate: "2024-08-12",
    status: "ACTIVE",
    applicantsCount: 78,
    shortlistedCount: 14,
    requiredSkills: [
      { skillName: "CNC Milling & G-Code", requiredLevel: "Intermediate" },
      { skillName: "Precision Metrology", requiredLevel: "Intermediate" },
      { skillName: "Blueprint Reading", requiredLevel: "Intermediate" },
    ],
    benefits: ["EPF & Medical Insurance", "Overtime Allowance", "Annual Safety Bonus"],
  },
  {
    id: "opp-003",
    recruiterId: "rec-001",
    type: "RECRUITMENT_DRIVE",
    title: "Mega Campus Hiring Drive — ITI Electrician & MMV",
    company: "Tata Motors",
    location: "Pune (Y4D Center & Chakan)",
    trade: "Electrician",
    description:
      "Join the 2024 Annual Saksham Mega Hiring Drive. On-the-spot technical aptitude assessments, practical trade tests, and direct interview shortlists for Tata Motors Commercial Vehicles division.",
    positionsCount: 50,
    salaryStipend: "₹15,000–₹18,500 / month",
    eligibility: "All 2023 & 2024 ITI Graduates from Maharashtra state institutions.",
    experienceRequired: "Fresh ITI Graduates",
    deadline: "2024-09-15",
    postedDate: "2024-08-05",
    status: "ACTIVE",
    applicantsCount: 210,
    shortlistedCount: 35,
    requiredSkills: [
      { skillName: "Electrical Fundamentals", requiredLevel: "Intermediate" },
      { skillName: "Shop-floor Safety Protocol", requiredLevel: "Basic" },
      { skillName: "Communication", requiredLevel: "Basic" },
    ],
    benefits: ["Spot Offer Letters for Verified Candidates", "Full Accommodation Support for first 3 months"],
  },
  {
    id: "opp-004",
    recruiterId: "rec-001",
    type: "APPRENTICESHIP",
    title: "Structural TIG/MIG Welder Apprentice",
    company: "Tata Motors",
    location: "Pune (Chakan Plant)",
    trade: "Welder",
    description:
      "Apprenticeship opportunity in chassis and cabin frame welding cell. High focus on argon shielding, weld penetration standards, and automated robotic welder assisting.",
    positionsCount: 12,
    salaryStipend: "₹15,200 / month",
    eligibility: "ITI Welder (NCVT) certified with health & eye fitness clearance.",
    experienceRequired: "Freshers / < 1 Year",
    deadline: "2024-09-25",
    postedDate: "2024-08-08",
    status: "ACTIVE",
    applicantsCount: 46,
    shortlistedCount: 9,
    requiredSkills: [
      { skillName: "TIG & MIG Welding", requiredLevel: "Advanced" },
      { skillName: "Weld Inspection Basics", requiredLevel: "Intermediate" },
      { skillName: "Safety & PPE", requiredLevel: "Advanced" },
    ],
    benefits: ["Certified Welder Logbook", "PPE Kit and Respirator Masks provided"],
  },
  {
    id: "opp-005",
    recruiterId: "rec-001",
    type: "TRAINING_PROGRAM",
    title: "EV Powertrain & Battery Harness Assembly Trainee",
    company: "Tata Motors",
    location: "Pune (EV Tech Hub)",
    trade: "Electronics Mechanic",
    description:
      "Specialized 6-month hands-on upskilling track for Electronics and Wireman ITI trades on High-Voltage Electric Vehicle assembly lines. Includes high-voltage safety certification.",
    positionsCount: 10,
    salaryStipend: "₹17,000 / month + Certification",
    eligibility: "ITI Electronics Mechanic or Wireman with minimum 70% in trade theory.",
    experienceRequired: "0–1 Year",
    deadline: "2024-10-01",
    postedDate: "2024-08-15",
    status: "DRAFT",
    applicantsCount: 0,
    shortlistedCount: 0,
    requiredSkills: [
      { skillName: "Sensor & Diagnostics", requiredLevel: "Intermediate" },
      { skillName: "EV High Voltage Safety", requiredLevel: "Basic" },
    ],
    benefits: ["EV Specialist Certificate", "High Absorption Ratio into Tata Passenger Electric Mobility"],
  },
];

// Initial Mock Interviews
export const INITIAL_INTERVIEWS: InterviewRecord[] = [
  {
    id: "int-001",
    candidateId: "student-001",
    candidateName: "Priya Sharma",
    candidateAvatar: heroStudent,
    candidateTrade: "Electrician",
    opportunityId: "opp-001",
    opportunityTitle: "Electrician Apprentice — Shop Floor Assembly",
    date: new Date().toISOString().split("T")[0], // Today
    time: "10:30 AM",
    mode: "IN_PERSON",
    locationOrLink: "Tata Motors Plant Gate 3, Chakan Industrial Area, Pune",
    notes: "Review practical panel wiring project photos and NCVT trade scores.",
    status: "SCHEDULED",
  },
  {
    id: "int-002",
    candidateId: "student-002",
    candidateName: "Rahul Patil",
    candidateAvatar: workshop,
    candidateTrade: "Fitter",
    opportunityId: "opp-002",
    opportunityTitle: "CNC Machinist & Precision Assembly Trainee",
    date: new Date().toISOString().split("T")[0], // Today
    time: "02:00 PM",
    mode: "ONLINE",
    locationOrLink: "https://meet.google.com/tat-amtr-iti",
    notes: "Technical interview with Production Shop Supervisor.",
    status: "SCHEDULED",
  },
  {
    id: "int-003",
    candidateId: "student-003",
    candidateName: "Sneha Jadhav",
    candidateAvatar: mentorGuiding,
    candidateTrade: "Electronics Mechanic",
    opportunityId: "opp-001",
    opportunityTitle: "Electrician Apprentice — Shop Floor Assembly",
    date: new Date(Date.now() + 2 * 86400000).toISOString().split("T")[0], // In 2 days
    time: "11:00 AM",
    mode: "IN_PERSON",
    locationOrLink: "Tata Motors Technical Training Center, Pimpri, Pune",
    notes: "Multimeter diagnostics and schematic comprehension test.",
    status: "SCHEDULED",
  },
  {
    id: "int-004",
    candidateId: "student-005",
    candidateName: "Vikram Shinde",
    candidateAvatar: story2,
    candidateTrade: "Welder",
    opportunityId: "opp-004",
    opportunityTitle: "Structural TIG/MIG Welder Apprentice",
    date: new Date(Date.now() + 4 * 86400000).toISOString().split("T")[0], // In 4 days
    time: "03:30 PM",
    mode: "IN_PERSON",
    locationOrLink: "Chassis Body Shop 2, Chakan Plant, Pune",
    notes: "Bring 3G plate welding coupon for inspection.",
    status: "SCHEDULED",
  },
];

// Initial Mock Notifications
export const INITIAL_NOTIFICATIONS: RecruiterNotification[] = [
  {
    id: "notif-001",
    title: "Interview Accepted",
    description: "Priya Sharma confirmed her in-person interview for Today at 10:30 AM.",
    time: "15 mins ago",
    read: false,
    type: "INTERVIEW",
    linkTo: "/recruiter/interviews",
  },
  {
    id: "notif-002",
    title: "New High Match Candidates",
    description: "8 new verified ITI candidates match your Electrician Apprentice opportunity (90%+ match).",
    time: "1 hour ago",
    read: false,
    type: "MATCH",
    linkTo: "/recruiter/talent",
  },
  {
    id: "notif-003",
    title: "New Applications Received",
    description: "Your Mega Campus Hiring Drive received 14 new candidate applications from ITI Pune & Aundh.",
    time: "3 hours ago",
    read: false,
    type: "APPLICATION",
    linkTo: "/recruiter/opportunities",
  },
  {
    id: "notif-004",
    title: "Profile Verification Complete",
    description: "Tata Motors enterprise recruiter profile was re-verified for 2024–25 by Y4D Saksham team.",
    time: "1 day ago",
    read: true,
    type: "SYSTEM",
    linkTo: "/recruiter/company",
  },
];

// Analytics Mock Data
export const RECRUITER_ANALYTICS = {
  monthlyApplications: [
    { month: "May", count: 85 },
    { month: "June", count: 120 },
    { month: "July", count: 178 },
    { month: "August", count: 248 },
  ],
  talentByTrade: [
    { trade: "Electrician", percentage: 42, count: 104, color: "bg-primary" },
    { trade: "Fitter", percentage: 28, count: 69, color: "bg-gold" },
    { trade: "Welder", percentage: 18, count: 45, color: "bg-amber-600" },
    { trade: "Electronics / COPA", percentage: 12, count: 30, color: "bg-stone-600" },
  ],
  pipelineBreakdown: [
    { stage: "Applications", count: 248, label: "Total Applications", change: "+18% this month" },
    { stage: "Screened", count: 128, label: "Profile Verified", change: "51% conversion" },
    { stage: "Shortlisted", count: 42, label: "Ready for Test", change: "32% pass rate" },
    { stage: "Interview", count: 26, label: "In Rounds", change: "12 scheduled" },
    { stage: "Selected", count: 18, label: "Offers Released", change: "72% acceptance" },
  ],
};
