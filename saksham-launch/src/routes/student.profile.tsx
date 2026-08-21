import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Edit3,
  GraduationCap,
  MapPin,
  Save,
  ShieldCheck,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Footer } from "@/components/site/Footer";
import { StudentNavbar } from "@/components/student/StudentNavbar";
import {
  INITIAL_STUDENT_PROFILE,
  READINESS_BREAKDOWN,
  SKILL_GAPS,
  StudentProfile,
} from "@/components/student/student-data";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [{ title: "My Profile & Skills · Saksham" }],
  }),
  component: StudentProfilePage,
});

function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(INITIAL_STUDENT_PROFILE);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    trade: profile.trade,
    iti: profile.iti,
    location: profile.location,
    careerGoal: profile.careerGoal,
    experience: profile.experience,
    language: profile.language,
    preferredIndustry: "Automotive & Industrial Manufacturing",
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      name: formData.name,
      trade: formData.trade,
      iti: formData.iti,
      location: formData.location,
      careerGoal: formData.careerGoal,
      experience: formData.experience,
      language: formData.language,
      profileCompletion: 100,
      missingProfileFields: [],
    }));
    setIsEditing(false);
    toast.success("Profile details updated successfully!");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StudentNavbar profile={profile} />

      <main className="pt-28 pb-16 sm:pt-32">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>

          {/* Profile Header Card */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-border/80 bg-gradient-to-br from-card via-card to-secondary/30 p-6 sm:p-10 shadow-soft">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover border-2 border-primary/20 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                      {profile.name}
                    </h1>
                    <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-bold text-foreground">
                      Verified ITI
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary mt-1">
                    {profile.trade} · {profile.iti}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {profile.location}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-5 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground shadow-2xs"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>{isEditing ? "Cancel" : "Edit Profile"}</span>
              </button>
            </div>

            {/* Profile stats strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-2xl bg-secondary/50 p-4 border border-border/60 text-center">
              <div>
                <p className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
                  Target Goal
                </p>
                <p className="font-serif text-sm font-bold text-foreground mt-0.5">
                  {profile.careerGoal}
                </p>
              </div>
              <div>
                <p className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
                  Readiness Score
                </p>
                <p className="font-serif text-sm font-bold text-primary mt-0.5">
                  {profile.careerReadinessScore} / 100
                </p>
              </div>
              <div>
                <p className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
                  Profile Strength
                </p>
                <p className="font-serif text-sm font-bold text-gold mt-0.5">
                  {profile.profileCompletion}%
                </p>
              </div>
              <div>
                <p className="text-[0.68rem] tracking-wider uppercase font-semibold text-muted-foreground">
                  Language
                </p>
                <p className="font-serif text-sm font-bold text-foreground mt-0.5">
                  {profile.language} (English Basics)
                </p>
              </div>
            </div>
          </div>

          {/* Edit Form or Read View */}
          {isEditing ? (
            <form
              onSubmit={handleSave}
              className="mt-8 rounded-[2.2rem] border border-border/80 bg-card p-6 sm:p-8 shadow-soft space-y-5"
            >
              <h3 className="font-serif text-xl font-bold text-foreground">Edit Profile Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Trade</label>
                  <input
                    type="text"
                    value={formData.trade}
                    onChange={(e) => setFormData({ ...formData, trade: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">ITI Institute</label>
                  <input
                    type="text"
                    value={formData.iti}
                    onChange={(e) => setFormData({ ...formData, iti: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Career Goal</label>
                  <input
                    type="text"
                    value={formData.careerGoal}
                    onChange={(e) => setFormData({ ...formData, careerGoal: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase">Preferred Industry</label>
                  <input
                    type="text"
                    value={formData.preferredIndustry}
                    onChange={(e) => setFormData({ ...formData, preferredIndustry: e.target.value })}
                    className="mt-1.5 w-full rounded-2xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="rounded-full border border-border px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-beige"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary-deep shadow-2xs"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Verified Trade Skills */}
              <div className="rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft">
                <h3 className="font-serif text-lg font-bold text-foreground">Verified Trade Competencies</h3>
                <div className="mt-4 space-y-3">
                  {READINESS_BREAKDOWN.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-secondary/50">
                      <span className="font-medium text-foreground">{item.name}</span>
                      <span className="font-bold text-primary">{item.score}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Identified Gaps */}
              <div className="rounded-[2.2rem] border border-border/80 bg-card p-6 shadow-soft">
                <h3 className="font-serif text-lg font-bold text-foreground">Current Skill Gap Focus</h3>
                <div className="mt-4 space-y-3">
                  {SKILL_GAPS.map((gap) => (
                    <div key={gap.id} className="flex items-start justify-between text-xs p-3 rounded-xl bg-secondary/50 border border-border/60">
                      <div>
                        <p className="font-bold text-foreground">{gap.name}</p>
                        <p className="text-muted-foreground mt-0.5 text-[0.7rem]">{gap.recommendedAction}</p>
                      </div>
                      <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[0.65rem] font-bold text-foreground">
                        {gap.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
