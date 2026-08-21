import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Layers,
  Play,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/site/Footer";
import { StudentModals } from "@/components/student/StudentModals";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  Course,
  INITIAL_STUDENT_PROFILE,
  RECOMMENDED_COURSES,
  StudentProfile,
} from "@/components/student/student-data";

export const Route = createFileRoute("/student/learning")({
  head: () => ({
    meta: [{ title: "My Learning Track · Saksham" }],
  }),
  component: StudentLearningPage,
});

function StudentLearningPage() {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveModal("course");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudentNavbar profile={profile} />

      <main className="pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          <div className="rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-10 shadow-soft">
            <span className="eyebrow text-gold font-semibold">ITI Employability Curriculum</span>
            <h1 className="mt-2 font-serif text-3xl sm:text-4xl font-bold text-foreground">
              My Learning Track
            </h1>
            <p className="mt-2 max-w-2xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Curated modules aligned with Directorate General of Training (DGT) and employer hiring
              benchmarks for ITI Electrician candidates.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold">
              <span className="rounded-full bg-primary/10 px-3.5 py-1.5 text-primary border border-primary/20">
                1 Module In Progress
              </span>
              <span className="rounded-full bg-secondary px-3.5 py-1.5 text-foreground/80 border border-border">
                3 Modules Queued
              </span>
              <span className="rounded-full bg-emerald-50 px-3.5 py-1.5 text-emerald-800 border border-emerald-200">
                2 Certificates Earned
              </span>
            </div>
          </div>

          {/* Courses List */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {RECOMMENDED_COURSES.map((course) => (
              <div
                key={course.id}
                className="group flex flex-col justify-between overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-soft transition-all duration-300 hover:border-gold/40 hover:shadow-lift"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-card/90 px-2.5 py-1 text-[0.68rem] font-semibold text-primary">
                      {course.category}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <span className="rounded-md bg-black/60 px-2 py-0.5 text-[0.65rem] font-medium text-white backdrop-blur-xs">
                      {course.duration}
                    </span>
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/60">
                    {course.progress > 0 && (
                      <div className="space-y-1.5 mb-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-bold text-primary">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${course.progress}%` }} />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenCourse(course)}
                      className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary-deep shadow-2xs"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{course.progress > 0 ? "Resume Course" : "Start Course"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <StudentModals
        activeModal={activeModal}
        onClose={() => setActiveModal(null)}
        selectedCourse={selectedCourse}
        selectedSkillGap={null}
        selectedOpportunity={null}
        selectedApplication={null}
        selectedMentor={null}
        selectedSession={null}
        profile={profile}
        onUpdateProfile={(u) => setProfile((p) => ({ ...p, ...u }))}
      />

      <Footer />
    </div>
  );
}
