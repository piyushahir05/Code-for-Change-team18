import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/site/Footer";
import { AIAssistantCard } from "@/components/student/AIAssistantCard";
import { ApplicationTracker } from "@/components/student/ApplicationTracker";
import { CareerReadinessSection } from "@/components/student/CareerReadinessSection";
import { DashboardHero } from "@/components/student/DashboardHero";
import { LearningSection } from "@/components/student/LearningSection";
import { MentorshipSection } from "@/components/student/MentorshipSection";
import { NextStepCard } from "@/components/student/NextStepCard";
import { OpportunitySection } from "@/components/student/OpportunitySection";
import { ProfileCompletionCard } from "@/components/student/ProfileCompletionCard";
import { QuickActions } from "@/components/student/QuickActions";
import { SkillGapSection } from "@/components/student/SkillGapSection";
import { StudentModals } from "@/components/student/StudentModals";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import { ProfileAnalyzer } from "@/components/site/ProfileAnalyzer";
import {
  Application,
  Course,
  INITIAL_STUDENT_PROFILE,
  Mentor,
  MentorshipSession,
  Opportunity,
  RECOMMENDED_COURSES,
  SkillGap,
  StudentProfile,
} from "@/components/student/student-data";
// TODO: Replace mock authentication with backend authentication.
import { studentService } from "@/services/studentService";

export const Route = createFileRoute("/student/dashboard")({
  head: () => ({
    meta: [
      { title: "Student Dashboard · Saksham | Y4D Foundation" },
      {
        name: "description",
        content:
          "Personalized employability workspace for ITI students. Track career readiness, skill gaps, recommended courses, apprenticeships, and mentorship.",
      },
      { property: "og:title", content: "Student Dashboard · Saksham" },
      {
        property: "og:description",
        content:
          "Empowering ITI students from trade training to certified placement and career progression.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudentDashboardPage,
});

function StudentDashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<StudentProfile>(() => {
    // TODO: Replace mock authentication with backend authentication.
    // Try to load a real session created during onboarding (studentService.createProfile).
    // Falls back to hardcoded INITIAL_STUDENT_PROFILE when no session exists (e.g. direct URL access).
    try {
      const session = studentService.getActiveSession();
      if (session && session.user && session.profile) {
        return {
          ...INITIAL_STUDENT_PROFILE,
          name: session.user.name,
          trade: session.profile.trade || INITIAL_STUDENT_PROFILE.trade,
          iti: session.profile.iti || INITIAL_STUDENT_PROFILE.iti,
          location: session.profile.location || INITIAL_STUDENT_PROFILE.location,
          careerGoal: session.profile.career_goal || INITIAL_STUDENT_PROFILE.careerGoal,
          experience: session.profile.experience || INITIAL_STUDENT_PROFILE.experience,
          language:
            session.profile.preferred_language ||
            session.user.language ||
            INITIAL_STUDENT_PROFILE.language,
          profileCompletion: session.profile.profile_completion || 100,
          careerReadinessScore: session.profile.career_readiness_score || 78,
        };
      }
    } catch (e) {
      console.warn("[Saksham] Could not load active session, using mock student data.", e);
    }
    // Fallback: show demo student so the dashboard always renders during prototyping
    return INITIAL_STUDENT_PROFILE;
  });

  // Modal active states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedSkillGap, setSelectedSkillGap] = useState<SkillGap | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedSession, setSelectedSession] = useState<MentorshipSession | null>(null);

  const handleUpdateProfile = (updated: Partial<StudentProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
  };

  const handleContinueJourney = () => {
    const nextStepElem = document.getElementById("next-step-section");
    if (nextStepElem) {
      nextStepElem.scrollIntoView({ behavior: "smooth" });
    } else {
      setSelectedCourse(RECOMMENDED_COURSES[0]);
      setActiveModal("course");
    }
  };

  const handleStartNextCourse = () => {
    setSelectedCourse(RECOMMENDED_COURSES[0]);
    setActiveModal("course");
  };

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveModal("course");
  };

  const handleOpenSkillGap = (gap: SkillGap) => {
    setSelectedSkillGap(gap);
    setActiveModal("skill-gap");
  };

  const handleOpenOpportunity = (opp: Opportunity) => {
    setSelectedOpportunity(opp);
    setActiveModal("opportunity");
  };

  const handleOpenApplication = (app: Application) => {
    setSelectedApplication(app);
    setActiveModal("application");
  };

  const handleRequestMentorship = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setActiveModal("mentorship-request");
  };

  const handleViewSessionDetails = (session: MentorshipSession) => {
    setSelectedSession(session);
    setActiveModal("meeting-details");
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-gold/30 selection:text-foreground">
      {/* 1. Authenticated Student Navigation */}
      <StudentNavbar profile={profile} />

      <main>
        {/* 2. Welcome / Hero Section */}
        <DashboardHero
          profile={profile}
          onContinueJourney={handleContinueJourney}
          onOpenProfile={() => setActiveModal("profile-edit")}
        />

        {/* 3. "What should I do next?" Highlighted Card */}
        <div id="next-step-section">
          <NextStepCard
            onStartLearning={handleStartNextCourse}
            onSeeRecommendations={() => {
              const elem = document.getElementById("learning-section");
              if (elem) elem.scrollIntoView({ behavior: "smooth" });
            }}
          />
        </div>

        {/* 4. Career Readiness Overview Section */}
        <CareerReadinessSection
          profile={profile}
          onImproveScore={() => setActiveModal("score-improvement")}
        />

        {/* 5. Skill Gap Section */}
        <SkillGapSection onSelectGap={handleOpenSkillGap} />

        {/* 6. Recommended Learning Section */}
        <div id="learning-section">
          <LearningSection onSelectCourse={handleOpenCourse} />
        </div>

        {/* 7. Recommended Opportunities Section */}
        <OpportunitySection onSelectOpportunity={handleOpenOpportunity} />

        {/* 8. Application Tracker Section */}
        <ApplicationTracker onSelectApplication={handleOpenApplication} />

        {/* 9. Mentorship Section */}
        <MentorshipSection
          onRequestSession={handleRequestMentorship}
          onViewSessionDetails={handleViewSessionDetails}
        />

        {/* 10. AI Career Assistant */}
        <AIAssistantCard
          profile={profile}
          onOpenFullAssistant={() => {
            navigate({ to: "/student/ai-assistant" });
          }}
        />

        {/* 11 & 12. Profile Completion & Quick Actions */}
        <section className="relative py-12 bg-secondary/20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
              <ProfileCompletionCard
                profile={profile}
                onCompleteProfile={() => setActiveModal("profile-edit")}
              />
              <div className="flex flex-col justify-center">
                <div className="mb-4">
                  <span className="eyebrow text-gold font-semibold">Shortcuts</span>
                  <h3 className="font-serif text-2xl font-bold text-foreground">
                    Quick Actions
                  </h3>
                </div>
                <QuickActions onUpdateProfile={() => setActiveModal("profile-edit")} />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Interactive Unified Modals */}
      <StudentModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        selectedCourse={selectedCourse}
        selectedSkillGap={selectedSkillGap}
        selectedOpportunity={selectedOpportunity}
        selectedApplication={selectedApplication}
        selectedMentor={selectedMentor}
        selectedSession={selectedSession}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
      />

      {/* Global Footer */}
      <Footer />

      {/* AI Career Profile Analyzer floating trigger for Student section */}
      <ProfileAnalyzer />
    </div>
  );
}
