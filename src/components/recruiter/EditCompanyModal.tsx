import { Building2, CheckCircle2, Globe, MapPin, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { RecruiterCompanyProfile } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

interface EditCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: RecruiterCompanyProfile;
  onProfileUpdated?: (updated: RecruiterCompanyProfile) => void;
}

export function EditCompanyModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: EditCompanyModalProps) {
  const [formData, setFormData] = useState({
    companyName: profile.companyName,
    tagline: profile.tagline,
    description: profile.description,
    industry: profile.industry,
    location: profile.location,
    headquarters: profile.headquarters,
    website: profile.website,
    hiringFocus: profile.hiringFocus.join(", "),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const updated = recruiterService.updateCompanyProfile({
        companyName: formData.companyName,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        location: formData.location,
        headquarters: formData.headquarters,
        website: formData.website,
        hiringFocus: formData.hiringFocus.split(",").map((s) => s.trim()).filter(Boolean),
      });

      setIsSubmitting(false);
      toast.success("Company profile updated successfully ✓");
      onProfileUpdated?.(updated);
      onClose();
    }, 400);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-border/80 bg-card p-6 sm:p-8 shadow-lift z-10 text-foreground"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-5 top-5 grid h-8 w-8 place-items-center rounded-full bg-secondary/80 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3.5 pr-8">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="eyebrow text-gold font-bold">Organization Settings</span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-foreground">
                Edit Employer Profile
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update your organization details and primary ITI trade hiring specializations.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4 text-xs">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company Name <span className="text-primary">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tagline / Industry Mission
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Industry Vertical
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Primary Plant / Office Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Careers Website URL
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company Description
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Hiring Focus Trades (comma separated)
              </label>
              <input
                type="text"
                value={formData.hiringFocus}
                onChange={(e) => setFormData({ ...formData, hiringFocus: e.target.value })}
                placeholder="Electrician, Fitter, Welder, Machinist"
                className="mt-1.5 w-full rounded-2xl border border-border bg-background px-3.5 py-2.5 text-xs outline-none focus:border-primary"
              />
            </div>

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-border px-5 py-2 text-xs font-semibold text-foreground hover:bg-beige"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow-lift hover:bg-primary-deep transition-all disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                <span>{isSubmitting ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
