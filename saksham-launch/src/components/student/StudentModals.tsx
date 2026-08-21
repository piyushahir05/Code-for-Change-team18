import {
  ArrowRight,
  Bookmark,
  Briefcase,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  GraduationCap,
  Info,
  MapPin,
  Play,
  Sparkles,
  Star,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Application,
  Course,
  Mentor,
  MentorshipSession,
  Opportunity,
  SkillGap,
  StudentProfile,
} from "./student-data";

interface StudentModalsProps {
  activeModal: string | null;
  onClose: () => void;
  selectedCourse: Course | null;
  selectedSkillGap: SkillGap | null;
  selectedOpportunity: Opportunity | null;
  selectedApplication: Application | null;
  selectedMentor: Mentor | null;
  selectedSession: MentorshipSession | null;
  profile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
}

export function StudentModals({
  activeModal,
  onClose,
  selectedCourse,
  selectedSkillGap,
  selectedOpportunity,
  selectedApplication,
  selectedMentor,
  selectedSession,
  profile,
  onUpdateProfile,
}: StudentModalsProps) {
  // Course completion local state
  const [activeModule, setActiveModule] = useState(2);
  // Mentorship request state
  const [selectedSlot, setSelectedSlot] = useState("Friday, May 22 · 4:00 PM");
  const [sessionTopic, setSessionTopic] = useState("Shop-floor interview preparation");
  // Profile edit state
  const [preferredIndustry, setPreferredIndustry] = useState("Automotive & Heavy Manufacturing");
  const [careerInterests, setCareerInterests] = useState("Control Panels, PLC Basics, Renewable Energy");

  if (!activeModal) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] border border-border/80 bg-card p-6 sm:p-8 shadow-lift z-10"
        >
          {/* Close button */}
          <button
            type="button"
            aria-label="Close modal"
            onClick={onClose}
            className="absolute top-6 right-6 grid h-9 w-9 place-items-center rounded-full border border-border bg-secondary text-muted-foreground transition-all hover:bg-beige hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          {/* 1. COURSE LEARNING PLAYER MODAL */}
          {activeModal === "course" && selectedCourse && (
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  {selectedCourse.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {selectedCourse.duration} · {selectedCourse.level}
                </span>
              </div>

              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {selectedCourse.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {selectedCourse.description}
              </p>

              {/* Video Player Mockup */}
              <div className="mt-6 relative aspect-video overflow-hidden rounded-2xl bg-black/90 flex items-center justify-center border border-border">
                <img
                  src={selectedCourse.image}
                  alt={selectedCourse.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
                <div className="relative text-center z-10">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift cursor-pointer hover:scale-105 transition-transform">
                    <Play className="h-7 w-7 fill-current ml-1" />
                  </div>
                  <p className="mt-3 text-xs text-cream font-medium">
                    Module 3: Shop Floor Shift Handovers & Verbal Clarity
                  </p>
                </div>
              </div>

              {/* Modules list */}
              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Course Curriculum ({selectedCourse.modulesCount} Modules)
                </p>
                <div className="space-y-2">
                  {[
                    { id: 1, title: "Introduction & Listening on the Shop Floor", completed: true },
                    { id: 2, title: "Clear Reporting to Shift Supervisors", completed: true },
                    { id: 3, title: "Effective Shift Handover Protocols", completed: false, current: true },
                    { id: 4, title: "Handling Machine Breakdown Communication", completed: false },
                    { id: 5, title: "Final Practical Assessment", completed: false },
                  ].map((mod) => (
                    <div
                      key={mod.id}
                      onClick={() => setActiveModule(mod.id)}
                      className={`flex items-center justify-between rounded-xl p-3 text-xs transition-colors cursor-pointer ${
                        mod.current
                          ? "bg-primary/10 border border-primary/30 text-primary font-bold"
                          : mod.completed
                          ? "bg-secondary/70 text-foreground font-medium"
                          : "bg-muted/40 text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-full text-[0.65rem] ${
                            mod.completed
                              ? "bg-primary text-primary-foreground"
                              : mod.current
                              ? "bg-gold text-foreground font-bold"
                              : "bg-border text-muted-foreground"
                          }`}
                        >
                          {mod.completed ? <Check className="h-3 w-3" /> : mod.id}
                        </span>
                        <span>{mod.title}</span>
                      </div>
                      <span className="text-[0.68rem]">
                        {mod.completed ? "Completed" : mod.current ? "In Progress" : "15 mins"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Completing this module adds +4% to Career Readiness
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Module marked complete! Career Readiness updated.");
                    onClose();
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep"
                >
                  Mark Module as Completed
                </button>
              </div>
            </div>
          )}

          {/* 2. SKILL GAP DETAIL MODAL */}
          {activeModal === "skill-gap" && selectedSkillGap && (
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                  {selectedSkillGap.category}
                </span>
                <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-foreground">
                  {selectedSkillGap.priority} Priority Gap
                </span>
              </div>

              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Strengthen {selectedSkillGap.name}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {selectedSkillGap.description}
              </p>

              <div className="mt-6 rounded-2xl bg-secondary/70 p-5 border border-border/80">
                <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                  <span>Current Confidence Meter</span>
                  <span className="text-primary font-bold">{selectedSkillGap.progress}%</span>
                </div>
                <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-card">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold to-primary"
                    style={{ width: `${selectedSkillGap.progress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Employers in Pune manufacturing sector require minimum 75% confidence score in
                  this competency.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Recommended Action Plan
                </p>
                <div className="rounded-2xl border border-gold/40 bg-gold/10 p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">
                        {selectedSkillGap.recommendedAction}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Structured exercises designed with industrial safety faculty and ITI alumni.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-beige"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.success("Learning path added to your queue!");
                    onClose();
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep"
                >
                  Start Action Plan Now
                </button>
              </div>
            </div>
          )}

          {/* 3. OPPORTUNITY DETAILS & APPLY MODAL */}
          {activeModal === "opportunity" && selectedOpportunity && (
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-amber-50 px-3 py-0.5 text-xs font-semibold text-amber-900 border border-amber-200">
                  {selectedOpportunity.typeLabel}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-0.5 text-xs font-bold text-primary border border-gold/40">
                  <Sparkles className="h-3 w-3 text-gold fill-gold" />
                  {selectedOpportunity.matchPercentage}% match
                </span>
              </div>

              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {selectedOpportunity.title}
              </h3>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-foreground">
                  <Building2 className="h-4 w-4 text-primary" />
                  {selectedOpportunity.company}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {selectedOpportunity.location}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-secondary/70 p-4 border border-border/80">
                <div>
                  <p className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
                    Stipend / CTC
                  </p>
                  <p className="font-serif text-lg font-bold text-primary">
                    {selectedOpportunity.stipend}
                  </p>
                </div>
                <div>
                  <p className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
                    Application Deadline
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-foreground">
                    {selectedOpportunity.deadline}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Role Description
                </p>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed">
                  {selectedOpportunity.description}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Key Requirements
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedOpportunity.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded-lg bg-card border border-border px-3 py-1 text-xs font-medium text-foreground"
                    >
                      {sk}
                    </span>
                  ))}
                  <span className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800">
                    ITI Electrician Passing Certificate
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" /> NAPS Approved Apprenticeship
                </span>

                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Application submitted to ${selectedOpportunity.company}!`, {
                      description: "Your profile and ITI certification were shared with the recruiter.",
                    });
                    onClose();
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs sm:text-sm font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep"
                >
                  Submit 1-Click Application
                </button>
              </div>
            </div>
          )}

          {/* 4. APPLICATION DETAILS MODAL */}
          {activeModal === "application" && selectedApplication && (
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-gold/20 px-3 py-0.5 text-xs font-bold text-foreground">
                  Status: {selectedApplication.status}
                </span>
                <span className="text-xs text-muted-foreground">
                  Applied {selectedApplication.appliedDate}
                </span>
              </div>

              <h3 className="mt-3 font-serif text-2xl sm:text-3xl font-bold text-foreground">
                {selectedApplication.jobTitle}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary">
                {selectedApplication.company} · {selectedApplication.location}
              </p>

              {/* Timeline */}
              <div className="mt-6 space-y-3 rounded-2xl bg-secondary/50 p-5 border border-border/80">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Application Timeline
                </p>
                <div className="space-y-3 pt-2">
                  {selectedApplication.timeline.map((step) => (
                    <div key={step.stage} className="flex items-center gap-3">
                      <div
                        className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : step.current
                            ? "bg-gold text-foreground"
                            : "bg-border text-muted-foreground"
                        }`}
                      >
                        {step.completed ? <Check className="h-3.5 w-3.5" /> : "•"}
                      </div>
                      <div className="flex-1 flex items-center justify-between text-xs">
                        <span className={`font-semibold ${step.current ? "text-primary" : "text-foreground"}`}>
                          {step.label}
                        </span>
                        <span className="text-muted-foreground text-[0.7rem]">{step.date || "Pending"}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedApplication.interviewDate && (
                <div className="mt-4 rounded-2xl bg-amber-50 p-4 border border-amber-200 text-xs text-amber-950">
                  <p className="font-bold flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-amber-800" />
                    Interview Scheduled: {selectedApplication.interviewDate}
                  </p>
                  <p className="mt-1 text-amber-900 leading-relaxed">
                    Mode: {selectedApplication.interviewMode}. Please bring your ITI Trade certificate,
                    Aadhaar card, and 2 passport photos.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-border/60 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep"
                >
                  Done
                </button>
              </div>
            </div>
          )}

          {/* 5. REQUEST MENTORSHIP MODAL */}
          {activeModal === "mentorship-request" && selectedMentor && (
            <div>
              <div className="flex items-center gap-3">
                <img
                  src={selectedMentor.image}
                  alt={selectedMentor.name}
                  className="h-12 w-12 rounded-2xl object-cover border border-primary/20"
                />
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground">
                    Request 1-on-1 Session with {selectedMentor.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedMentor.role} · {selectedMentor.industry}
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Available Slot
                  </label>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {[
                      "Friday, May 22 · 4:00 PM",
                      "Saturday, May 23 · 11:00 AM",
                      "Tuesday, May 26 · 5:30 PM",
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`rounded-2xl p-3 text-left text-xs font-semibold transition-all border ${
                          selectedSlot === slot
                            ? "bg-primary text-primary-foreground border-primary shadow-2xs"
                            : "bg-secondary/60 text-foreground border-border hover:bg-beige"
                        }`}
                      >
                        <Calendar className="h-3.5 w-3.5 mb-1" />
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    What would you like guidance on?
                  </label>
                  <select
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  >
                    <option>Shop-floor interview preparation (Shakti Manufacturing)</option>
                    <option>Industrial panel wiring & blueprint reading questions</option>
                    <option>Career progression from Apprentice to Maintenance Lead</option>
                    <option>Resume & technical skill review</option>
                  </select>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Free 45-minute video consultation
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toast.success(`Mentorship request sent to ${selectedMentor.name}!`, {
                      description: "You'll receive meeting details via SMS and WhatsApp once confirmed.",
                    });
                    onClose();
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                >
                  Confirm Request
                </button>
              </div>
            </div>
          )}

          {/* 6. MEETING DETAILS MODAL */}
          {activeModal === "meeting-details" && selectedSession && (
            <div>
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                {selectedSession.status} MENTORSHIP SESSION
              </span>

              <h3 className="mt-3 font-serif text-2xl font-bold text-foreground">
                {selectedSession.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Mentor: <strong className="text-foreground">{selectedSession.mentorName}</strong> ({selectedSession.mentorRole})
              </p>

              <div className="mt-5 space-y-3 rounded-2xl bg-secondary/60 p-4 border border-border/80 text-xs">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <Calendar className="h-4 w-4 text-gold" />
                  <span>{selectedSession.dateTime}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-primary">
                  <Video className="h-4 w-4" />
                  <span>{selectedSession.mode} Video Meeting</span>
                </div>
                <div className="rounded-xl bg-card p-3 border border-border/60 font-mono text-[0.72rem] text-foreground break-all">
                  https://meet.saksham.y4dfoundation.org/aarav-sharma-sunita
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Session Preparation Checklist
                </p>
                <ul className="space-y-1.5 text-xs text-foreground/85">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Keep your ITI Electrician trade score sheet ready
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    List 2-3 technical questions regarding panel maintenance
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    Join from a quiet environment 5 minutes before scheduled time
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-beige"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    toast.info("Meeting link will activate 15 minutes before the session.");
                  }}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep"
                >
                  Join Meeting Room
                </button>
              </div>
            </div>
          )}

          {/* 7. PROFILE COMPLETION / EDIT MODAL */}
          {activeModal === "profile-edit" && (
            <div>
              <span className="rounded-full bg-gold/20 px-3 py-0.5 text-xs font-bold text-foreground">
                Profile Completion ({profile.profileCompletion}%)
              </span>

              <h3 className="mt-3 font-serif text-2xl font-bold text-foreground">
                Update Missing Profile Details
              </h3>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                Add your preferred industry and career focus to unlock 100% profile score and
                higher recruiter visibility.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onUpdateProfile({
                    profileCompletion: 100,
                    missingProfileFields: [],
                    careerReadinessScore: Math.min(100, profile.careerReadinessScore + 4),
                  });
                  toast.success("Profile updated to 100%!", {
                    description: "Your career readiness score increased by +4%.",
                  });
                  onClose();
                }}
                className="mt-6 space-y-4"
              >
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Preferred Industry
                  </label>
                  <input
                    type="text"
                    value={preferredIndustry}
                    onChange={(e) => setPreferredIndustry(e.target.value)}
                    required
                    placeholder="e.g. Automotive & Heavy Manufacturing"
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Specific Trade Interests
                  </label>
                  <input
                    type="text"
                    value={careerInterests}
                    onChange={(e) => setCareerInterests(e.target.value)}
                    required
                    placeholder="e.g. Control Panels, PLC Basics, Renewable Energy"
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>

                <div className="rounded-2xl bg-secondary/70 p-4 border border-border/80 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Current Registered ITI Trade:</p>
                  <p>{profile.trade} · {profile.iti} · {profile.location}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-beige"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                  >
                    Save & Complete Profile
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 8. SCORE IMPROVEMENT BREAKDOWN MODAL */}
          {activeModal === "score-improvement" && (
            <div>
              <span className="rounded-full bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary">
                Actionable Score Roadmap
              </span>

              <h3 className="mt-3 font-serif text-2xl font-bold text-foreground">
                How to reach 85+ Career Readiness
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Benchmark for premium placement drives in Maharashtra industrial zones.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  {
                    title: "Finish Workplace Communication course",
                    impact: "+6 pts",
                    status: "In progress (45%)",
                    action: "Resume Course",
                  },
                  {
                    title: "Complete 1 Mock Interview session with Sunita Deshmukh",
                    impact: "+5 pts",
                    status: "Scheduled for Friday",
                    action: "View Session",
                  },
                  {
                    title: "Take Digital Documentation practical test",
                    impact: "+4 pts",
                    status: "Not started",
                    action: "Start Test",
                  },
                  {
                    title: "Fill 100% Profile details",
                    impact: "+2 pts",
                    status: `${profile.profileCompletion}% complete`,
                    action: "Complete",
                  },
                ].map((item, i) => (
                  <div
                    key={item.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl bg-secondary/50 p-4 border border-border/80 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{item.title}</span>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[0.68rem] font-bold text-emerald-800 border border-emerald-200">
                          {item.impact}
                        </span>
                      </div>
                      <p className="mt-0.5 text-muted-foreground">{item.status}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        toast.info(`Navigating to ${item.title}`);
                        onClose();
                      }}
                      className="rounded-full bg-card border border-border px-3.5 py-1.5 font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors w-fit"
                    >
                      {item.action}
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep"
                >
                  Got It
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
