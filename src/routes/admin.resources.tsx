import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  ExternalLink,
  GraduationCap,
  Info,
  Layers,
  Sparkles,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminLearningResource } from "@/data/mock/adminData";
import { adminService } from "@/services/adminService";

export const Route = createFileRoute("/admin/resources")({
  head: () => ({
    meta: [
      { title: "Learning Resources · Admin Portal | Saksham" },
      {
        name: "description",
        content: "Curated employability, safety, and trade practical learning modules for ITI students.",
      },
    ],
  }),
  component: AdminResourcesPage,
});

const CATEGORIES = [
  "ALL",
  "Safety & 5S",
  "Technical Skills",
  "Digital Skills",
  "Workplace Readiness",
  "Communication",
  "Labour Laws",
];

export function AdminResourcesPage() {
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [resources, setResources] = useState<AdminLearningResource[]>([]);

  useEffect(() => {
    setResources(adminService.getResources(selectedCategory));
  }, [selectedCategory]);

  return (
    <AdminLayout
      pageTitle="Learning Resources"
      breadcrumbs={[{ label: "Learning Resources" }]}
      actionButton={
        <span className="text-xs font-bold text-muted-foreground bg-secondary px-3.5 py-1.5 rounded-full">
          {resources.length} Modules Active
        </span>
      }
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
              Learning Modules & Curriculum
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Review certified trade and employability modules published to the Student LMS.
            </p>
          </div>
        </div>

        {/* Backend Governance Notice (per Section 22 / 43) */}
        <div className="rounded-2xl border border-primary/20 bg-secondary/50 p-4 text-xs flex items-start gap-3">
          <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-bold text-foreground">Curriculum Governance Policy</p>
            <p className="text-muted-foreground mt-0.5 leading-relaxed">
              Learning modules and simulators are synced with the NCVT curriculum and Y4D Foundation training standards.
              Course updates are published through the backend learning service (<code className="text-primary font-mono text-[0.7rem]">GET /api/resources</code>).
            </p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-secondary p-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>

        {/* Resource Cards Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card p-5 shadow-2xs hover:shadow-soft transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[0.68rem] font-bold text-primary">
                    {res.category}
                  </span>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[0.65rem] font-bold text-muted-foreground">
                    {res.difficulty}
                  </span>
                </div>

                <h3 className="font-serif text-base font-bold text-foreground mt-3 group-hover:text-primary transition-colors">
                  {res.title}
                </h3>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Duration: {res.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>Type: {res.resourceType}</span>
                  </div>
                  {res.trade && (
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span>Target Trade: {res.trade}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
                <span className="text-[0.68rem] text-muted-foreground">
                  <strong className="text-foreground">{res.completionsCount}</strong> student completions
                </span>

                <Link
                  to="/student/learning"
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Student View</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
