import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Briefcase,
  Building2,
  CheckCircle2,
  Edit2,
  ExternalLink,
  Globe,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { EditCompanyModal } from "@/components/recruiter/EditCompanyModal";
import { RecruiterLayout } from "@/components/recruiter/RecruiterLayout";
import { RecruiterCompanyProfile } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

export const Route = createFileRoute("/recruiter/company")({
  head: () => ({
    meta: [
      { title: "Company Profile · Recruiter Portal | Saksham" },
      {
        name: "description",
        content: "Verified employer details, plant hiring locations, and trade specializations on Saksham.",
      },
    ],
  }),
  component: RecruiterCompanyProfilePage,
});

export function RecruiterCompanyProfilePage() {
  const [profile, setProfile] = useState<RecruiterCompanyProfile>(() =>
    recruiterService.getCompanyProfile()
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

  const loadProfile = () => {
    setProfile(recruiterService.getCompanyProfile());
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <RecruiterLayout
      pageTitle="Company Profile"
      breadcrumbs={[{ label: "Company Profile" }]}
      actionButton={
        <button
          type="button"
          onClick={() => setEditModalOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>Edit Profile</span>
        </button>
      }
    >
      <div className="space-y-6">
        {/* Top Employer Hero Header */}
        <div className="rounded-[2.5rem] border border-gold/40 bg-gradient-to-r from-card via-secondary/40 to-gold/10 p-6 sm:p-8 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4 sm:gap-6">
              <img
                src={profile.logo}
                alt={profile.companyName}
                className="h-20 w-20 sm:h-24 sm:w-24 rounded-3xl object-cover border-2 border-primary/20 shadow-lift shrink-0 bg-white"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                    {profile.companyName}
                  </h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    ● Verified Industry Partner
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-primary font-semibold mt-1">
                  {profile.tagline}
                </p>

                <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-primary" />
                    {profile.industry}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {profile.location}
                  </span>
                  {profile.website && (
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      <span>{profile.website.replace("https://", "")}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-beige transition-colors self-start md:self-center"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Employer Info</span>
            </button>
          </div>
        </div>

        {/* 3 Quick Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Active Opportunities</span>
            <p className="font-serif text-2xl font-bold text-foreground mt-1">
              {profile.stats.activeOpportunities} Openings
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Candidate Inflow</span>
            <p className="font-serif text-2xl font-bold text-foreground mt-1">
              {profile.stats.totalApplicants} Applicants
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Shortlisted Talent</span>
            <p className="font-serif text-2xl font-bold text-primary mt-1">
              {profile.stats.shortlistedCount} Shortlisted
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-xs">
            <span className="text-muted-foreground">Inducted Hires</span>
            <p className="font-serif text-2xl font-bold text-emerald-900 mt-1">
              {profile.stats.hiredCount} Placed
            </p>
          </div>
        </div>

        {/* Main Details Grid */}
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          {/* Left Column: About & Hiring Focus */}
          <div className="space-y-6">
            {/* About Organization */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-3">
              <span className="eyebrow text-gold font-bold">About Employer</span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Company Overview & ITI Apprenticeship Commitment
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {profile.description}
              </p>
            </div>

            {/* Hiring Focus Trades */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-3">
              <span className="eyebrow text-gold font-bold">Hiring Specialization</span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Primary ITI Trade Requirements
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {profile.hiringFocus.map((trade) => (
                  <span
                    key={trade}
                    className="inline-flex items-center gap-1.5 rounded-2xl bg-secondary px-4 py-2 text-xs font-bold text-foreground border border-border"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{trade}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Verification & Contact Person */}
          <div className="space-y-6">
            {/* Verification Credentials Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-4">
              <div>
                <span className="eyebrow text-gold font-bold">Verification Trust</span>
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Saksham Verified Employer Badges
                </h3>
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-border">
                  <span className="font-semibold text-foreground">Organization Verification</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-[0.7rem]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Verified
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-border">
                  <span className="font-semibold text-foreground">NAPS Apprenticeship Partner</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-[0.7rem]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Authorized
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl bg-secondary/40 border border-border">
                  <span className="font-semibold text-foreground">Shop-floor Safety Certified</span>
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-800 text-[0.7rem]">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Recruiter Contact Person */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-soft space-y-3">
              <span className="eyebrow text-gold font-bold">Contact Coordinator</span>
              <h3 className="font-serif text-lg font-bold text-foreground">
                Technical Hiring Lead
              </h3>

              <div className="rounded-2xl bg-secondary/50 p-4 border border-border/70 text-xs space-y-2">
                <p className="font-bold text-foreground text-sm">{profile.contactPerson.name}</p>
                <p className="text-primary font-semibold">{profile.contactPerson.role}</p>
                <div className="pt-2 border-t border-border/60 space-y-1 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                    <span>{profile.contactPerson.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                    <span>{profile.contactPerson.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Company Profile Modal */}
      <EditCompanyModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        profile={profile}
        onProfileUpdated={(updated) => setProfile(updated)}
      />
    </RecruiterLayout>
  );
}
