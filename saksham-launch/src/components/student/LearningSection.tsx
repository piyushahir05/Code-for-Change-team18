import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  Play,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Reveal } from "@/components/site/motion-primitives";
import { Course, RECOMMENDED_COURSES } from "./student-data";

interface LearningSectionProps {
  onSelectCourse: (course: Course) => void;
}

const CATEGORIES = ["All Modules", "Priority Gaps", "Workplace Skills", "Technical & Safety"];

export function LearningSection({ onSelectCourse }: LearningSectionProps) {
  const [activeTab, setActiveTab] = useState("All Modules");

  const filteredCourses = RECOMMENDED_COURSES.filter((course) => {
    if (activeTab === "Priority Gaps") {
      return course.category === "Communication" || course.category === "Technical Safety";
    }
    if (activeTab === "Workplace Skills") {
      return course.category === "Communication" || course.category === "Workplace Readiness";
    }
    if (activeTab === "Technical & Safety") {
      return course.category === "Technical Safety" || course.category === "Digital Skills";
    }
    return true;
  });

  return (
    <section className="relative py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <span className="eyebrow text-gold font-semibold">Curated Skill Paths</span>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                Learn what moves you forward
              </h2>
              <p className="mt-2 max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                Curated resources based on your trade, career goal and skill gaps. Short, practical,
                and focused on shop-floor execution.
              </p>
            </div>

            <Link
              to="/student/learning"
              className="group inline-flex w-fit items-center gap-1.5 text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              <span>Explore all courses</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        {/* Category Pills */}
        <Reveal delay={0.1}>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            {CATEGORIES.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-foreground/75 hover:bg-beige hover:text-primary"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Courses Grid */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCourses.map((course, idx) => (
            <Reveal key={course.id} delay={idx * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/80 bg-card shadow-soft transition-all duration-300 hover:border-gold/40 hover:shadow-lift"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative aspect-[16/10] overflow-hidden bg-secondary">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Badges on Image */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-card/90 px-2.5 py-1 text-[0.68rem] font-semibold text-primary backdrop-blur-md">
                      {course.category}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-medium text-[0.7rem]">
                      <Clock className="h-3 w-3 text-gold" />
                      {course.duration}
                    </span>
                    <span className="rounded-md bg-black/40 px-2 py-0.5 text-[0.65rem] font-medium backdrop-blur-xs">
                      {course.level}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {course.skillDeveloped}
                    </p>
                  </div>

                  {/* Progress & CTA Footer */}
                  <div className="mt-5 pt-3 border-t border-border/60">
                    {course.progress > 0 ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[0.72rem]">
                          <span className="text-muted-foreground font-medium">Progress</span>
                          <span className="font-bold text-primary">{course.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[0.72rem] text-muted-foreground font-medium flex items-center gap-1">
                        <Layers className="h-3 w-3" />
                        {course.modulesCount} practical modules
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectCourse(course)}
                      className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary py-2.5 text-xs font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:shadow-2xs"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>{course.progress > 0 ? "Continue" : "Start Learning"}</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
