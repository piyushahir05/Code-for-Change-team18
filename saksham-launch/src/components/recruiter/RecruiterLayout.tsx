import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  BookmarkCheck,
  Briefcase,
  Building2,
  Calendar,
  Check,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { RecruiterNotification } from "@/data/mock/recruiterData";
import { recruiterService } from "@/services/recruiterService";

interface RecruiterLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  breadcrumbs?: { label: string; to?: string }[];
  actionButton?: React.ReactNode;
}

const RECRUITER_NAV = [
  { label: "Dashboard", to: "/recruiter/dashboard", icon: LayoutDashboard },
  { label: "Opportunities", to: "/recruiter/opportunities", icon: Briefcase },
  { label: "Talent Pool", to: "/recruiter/talent", icon: Users, badge: "Smart Match" },
  { label: "Shortlisted", to: "/recruiter/shortlisted", icon: BookmarkCheck, countKey: "shortlisted" },
  { label: "Interviews", to: "/recruiter/interviews", icon: Calendar, countKey: "interviews" },
];

export function RecruiterLayout({
  children,
  pageTitle,
  breadcrumbs = [],
  actionButton,
}: RecruiterLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState<RecruiterNotification[]>([]);
  const [kpiCounts, setKpiCounts] = useState({ shortlisted: 42, interviews: 4 });
  const [companyProfile, setCompanyProfile] = useState(() => recruiterService.getCompanyProfile());

  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);

  // Sync notifications and KPI counts
  useEffect(() => {
    setNotifications(recruiterService.getNotifications());
    const kpis = recruiterService.getKPIs();
    setKpiCounts({
      shortlisted: kpis.shortlisted,
      interviews: kpis.activeInterviews,
    });
    setCompanyProfile(recruiterService.getCompanyProfile());
  }, [location.pathname]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate({
      to: "/recruiter/talent",
      search: () => ({ search: searchQuery }),
    });
  };

  const handleLogout = () => {
    toast.success("Signed out of Recruiter Portal");
    navigate({ to: "/login" });
  };

  const handleMarkAllRead = () => {
    recruiterService.markAllNotificationsRead();
    setNotifications(recruiterService.getNotifications());
    toast.success("All notifications marked as read");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* 1. Desktop Persistent Left Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col justify-between border-r border-border/80 bg-card p-6 fixed inset-y-0 left-0 z-40">
        <div>
          {/* Brand Header */}
          <Link to="/recruiter/dashboard" className="flex items-center gap-3 group">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary font-serif text-xl text-primary-foreground shadow-lift group-hover:scale-105 transition-transform">
              S
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-xl font-bold tracking-tight text-primary">
                  Saksham
                </span>
                <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[0.62rem] font-bold text-foreground">
                  Recruiter
                </span>
              </div>
              <p className="text-[0.68rem] font-medium text-muted-foreground truncate max-w-[140px]">
                {companyProfile.companyName}
              </p>
            </div>
          </Link>

          {/* Employer Verification Banner */}
          <div className="mt-5 rounded-2xl border border-emerald-300/60 bg-emerald-50/50 p-2.5 text-xs flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-700 shrink-0" />
            <div className="min-w-0">
              <p className="font-bold text-emerald-950 text-[0.72rem] leading-tight">
                Verified Industry Partner
              </p>
              <p className="text-[0.65rem] text-emerald-800 leading-tight">Y4D Digital Ecosystem</p>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="mt-6 space-y-1">
            <p className="px-3 text-[0.65rem] font-bold tracking-wider text-muted-foreground uppercase">
              Recruitment Center
            </p>

            <div className="mt-2 space-y-1">
              {RECRUITER_NAV.map((item) => {
                const isActive = location.pathname === item.to || location.pathname.startsWith(`${item.to}/`);
                const count = item.countKey === "shortlisted" ? kpiCounts.shortlisted : item.countKey === "interviews" ? kpiCounts.interviews : null;

                return (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                        : "text-foreground/80 hover:bg-secondary hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className={`h-4 w-4 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`rounded-full px-2 py-0.5 text-[0.62rem] font-bold ${
                        isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-gold/25 text-foreground"
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {count !== null && count > 0 && (
                      <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold ${
                        isActive ? "bg-primary-foreground/20 text-primary-foreground" : "bg-secondary text-primary"
                      }`}>
                        {count}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-border/60">
              <p className="px-3 text-[0.65rem] font-bold tracking-wider text-muted-foreground uppercase">
                Organization
              </p>
              <div className="mt-2 space-y-1">
                <Link
                  to="/recruiter/company"
                  className={`flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                    location.pathname === "/recruiter/company"
                      ? "bg-primary text-primary-foreground shadow-2xs font-bold"
                      : "text-foreground/80 hover:bg-secondary hover:text-primary"
                  }`}
                >
                  <Building2 className="h-4 w-4 opacity-75" />
                  <span>Company Profile</span>
                </Link>

                <Link
                  to="/student/dashboard"
                  className="flex items-center justify-between rounded-2xl px-3.5 py-2 text-xs font-medium text-muted-foreground hover:bg-beige hover:text-primary transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <User className="h-3.5 w-3.5" />
                    <span>View Student Portal</span>
                  </div>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </Link>
              </div>
            </div>
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-border/60">
          <div className="flex items-center justify-between gap-2 p-2 rounded-2xl bg-secondary/60 border border-border/70">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={companyProfile.logo}
                alt={companyProfile.companyName}
                className="h-9 w-9 rounded-xl object-cover border border-border shrink-0 bg-white"
              />
              <div className="min-w-0">
                <p className="text-xs font-bold text-foreground truncate">
                  {companyProfile.contactPerson.name}
                </p>
                <p className="text-[0.65rem] text-muted-foreground truncate">
                  {companyProfile.companyName}
                </p>
              </div>
            </div>

            <button
              type="button"
              title="Sign Out"
              onClick={handleLogout}
              className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area & Header */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/90 backdrop-blur-xl px-4 py-3 sm:px-6 sm:py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Mobile Toggle & Breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                aria-label="Open navigation menu"
                onClick={() => setMobileOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border text-foreground lg:hidden"
              >
                <Menu className="h-4 w-4" />
              </button>

              <div className="min-w-0">
                {breadcrumbs.length > 0 ? (
                  <nav className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Link to="/recruiter/dashboard" className="hover:text-primary transition-colors">
                      Recruiter
                    </Link>
                    {breadcrumbs.map((b, idx) => (
                      <div key={b.label} className="flex items-center gap-1.5">
                        <ChevronRight className="h-3 w-3 opacity-60" />
                        {b.to ? (
                          <Link to={b.to} className="hover:text-primary transition-colors truncate">
                            {b.label}
                          </Link>
                        ) : (
                          <span className="font-semibold text-foreground truncate">{b.label}</span>
                        )}
                      </div>
                    ))}
                  </nav>
                ) : (
                  <h1 className="font-serif text-lg sm:text-xl font-bold text-foreground truncate">
                    {pageTitle || "Recruiter Portal"}
                  </h1>
                )}
              </div>
            </div>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2.5">
              {/* Search Bar (Desktop) */}
              <form onSubmit={handleGlobalSearch} className="relative hidden md:block w-64">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search candidate or trade..."
                  className="w-full rounded-2xl border border-border bg-background px-3.5 py-1.5 pl-9 text-xs outline-none focus:border-primary transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              </form>

              {/* Notification Popover */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative grid h-9 w-9 place-items-center rounded-2xl border border-border bg-card text-foreground hover:bg-beige transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 sm:w-96 rounded-3xl border border-border/80 bg-card p-4 shadow-lift z-50 text-xs"
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                        <div>
                          <p className="font-bold text-foreground text-sm">Notifications</p>
                          <p className="text-[0.68rem] text-muted-foreground">
                            {unreadNotifCount} unread candidate updates
                          </p>
                        </div>
                        {unreadNotifCount > 0 && (
                          <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="text-[0.68rem] font-semibold text-primary hover:underline"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="mt-2.5 max-h-64 overflow-y-auto space-y-2">
                        {notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              recruiterService.markNotificationRead(n.id);
                              setNotifications(recruiterService.getNotifications());
                              if (n.linkTo) {
                                navigate({ to: n.linkTo });
                                setNotifOpen(false);
                              }
                            }}
                            className={`p-2.5 rounded-2xl transition-colors cursor-pointer ${
                              n.read ? "bg-secondary/40 hover:bg-secondary" : "bg-gold/15 hover:bg-gold/25"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-foreground">{n.title}</p>
                              <span className="text-[0.62rem] text-muted-foreground">{n.time}</span>
                            </div>
                            <p className="mt-1 text-[0.68rem] text-muted-foreground leading-relaxed">
                              {n.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Primary Action Button or Quick Post */}
              {actionButton ? (
                actionButton
              ) : (
                <Link
                  to="/recruiter/opportunities/new"
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-2xs hover:bg-primary-deep transition-all"
                >
                  <Plus className="h-3.5 w-3.5 text-gold" />
                  <span className="hidden sm:inline">Post Opportunity</span>
                  <span className="sm:hidden">Post</span>
                </Link>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                className="relative w-72 bg-card p-6 shadow-lift z-10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-border/70 pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-serif text-base text-primary-foreground">
                        S
                      </span>
                      <span className="font-serif text-lg font-bold text-primary">Saksham</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMobileOpen(false)}
                      className="grid h-8 w-8 place-items-center rounded-full bg-secondary text-muted-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <nav className="mt-5 space-y-1 text-xs">
                    {RECRUITER_NAV.map((item) => {
                      const isActive = location.pathname === item.to;
                      return (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setMobileOpen(false)}
                          className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 font-semibold transition-all ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground hover:bg-beige"
                          }`}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}

                    <div className="pt-3 mt-3 border-t border-border/60">
                      <Link
                        to="/recruiter/company"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-2xl px-4 py-3 font-semibold text-foreground hover:bg-beige"
                      >
                        <Building2 className="h-4 w-4 text-primary" />
                        <span>Company Profile</span>
                      </Link>
                      <Link
                        to="/student/dashboard"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center gap-2.5 rounded-2xl px-4 py-3 font-medium text-muted-foreground hover:bg-beige"
                      >
                        <User className="h-4 w-4" />
                        <span>Student Portal</span>
                      </Link>
                    </div>
                  </nav>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-destructive/10 p-3 text-xs font-semibold text-destructive hover:bg-destructive hover:text-white transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Page Children Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
