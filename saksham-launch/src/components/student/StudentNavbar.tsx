import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Bell,
  Check,
  ChevronDown,
  Compass,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Sparkles,
  User,
  Users,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { NOTIFICATIONS, NotificationItem, StudentProfile } from "./student-data";
// TODO: Replace mock authentication with backend authentication.
import { authService } from "@/services/authService";

interface StudentNavbarProps {
  profile: StudentProfile;
}

const STUDENT_NAV = [
  { label: "Dashboard", to: "/student/dashboard", icon: LayoutDashboard },
  { label: "My Profile", to: "/student/profile", icon: User },
  { label: "Learning", to: "/student/learning", icon: GraduationCap },
  { label: "Opportunities", to: "/student/opportunities", icon: Compass },
  { label: "Applications", to: "/student/applications", icon: Sparkles },
  { label: "Mentorship", to: "/student/mentorship", icon: Users },
  { label: "AI Assistant", to: "/student/ai-assistant", icon: MessageSquare },
];

export function StudentNavbar({ profile }: StudentNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(NOTIFICATIONS);
  const location = useLocation();
  const navigate = useNavigate();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // TODO: Replace mock authentication with backend authentication.
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Clear the student session from localStorage
      localStorage.removeItem("saksham_active_student_session_v2");
    } catch (e) {
      console.warn("[Saksham] Logout error", e);
    }
    setProfileMenuOpen(false);
    setMobileOpen(false);
    toast.success("Signed out successfully");
    navigate({ to: "/login" });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const markSingleAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-7xl items-center gap-3 rounded-3xl border border-border/80 bg-cream/90 px-4 py-2.5 backdrop-blur-xl transition-all duration-300 sm:px-6 sm:py-3 ${
          scrolled ? "shadow-lift border-primary/15" : "shadow-soft"
        }`}
      >
        {/* Brand */}
        <Link to="/student/dashboard" className="flex shrink-0 items-center gap-3 group">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary font-serif text-lg text-primary-foreground transition-transform group-hover:scale-105 shadow-sm">
            S
          </span>
          <span className="leading-none">
            <span className="flex items-center gap-2">
              <span className="block font-serif text-xl tracking-tight text-primary font-semibold">
                Saksham
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[0.65rem] font-semibold text-primary">
                Student
              </span>
            </span>
            <span className="mt-1 block text-[0.58rem] tracking-[0.18em] text-muted-foreground uppercase font-medium">
              Powered by Y4D Foundation
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <ul className="ml-6 hidden items-center gap-1 xl:flex">
          {STUDENT_NAV.map((item) => {
            const isActive = location.pathname === item.to || (item.to === "/student/dashboard" && location.pathname === "/student");
            return (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className={`relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[0.82rem] font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-foreground/75 hover:bg-beige hover:text-primary"
                  }`}
                >
                  <item.icon className={`h-3.5 w-3.5 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Notification Popover Button */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="View notifications"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileMenuOpen(false);
              }}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card/80 text-foreground/80 transition-all hover:bg-beige hover:text-primary hover:border-primary/30"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-primary-foreground shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Popover Window */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-80 sm:w-96 rounded-3xl border border-border/80 bg-card p-4 shadow-lift backdrop-blur-2xl z-50"
                >
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div>
                      <h4 className="font-serif text-base font-semibold text-primary">Notifications</h4>
                      <p className="text-xs text-muted-foreground">
                        {unreadCount > 0 ? `${unreadCount} unread updates` : "All caught up"}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllAsRead}
                        className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" /> Mark all read
                      </button>
                    )}
                  </div>

                  <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => markSingleAsRead(n.id)}
                        className={`group relative rounded-2xl p-3 text-left transition-all cursor-pointer ${
                          n.read
                            ? "bg-muted/40 hover:bg-muted/70 opacity-80"
                            : "bg-secondary/60 hover:bg-secondary border border-gold/25"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {!n.read && (
                              <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                            )}
                            <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                              {n.title}
                            </p>
                          </div>
                          <span className="text-[0.65rem] text-muted-foreground whitespace-nowrap">
                            {n.time}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed pl-4">
                          {n.description}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-2 border-t border-border/60 text-center">
                    <Link
                      to="/student/applications"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      View all activity history →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Student Profile dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <button
              type="button"
              onClick={() => {
                setProfileMenuOpen(!profileMenuOpen);
                setNotifOpen(false);
              }}
              className="flex items-center gap-2.5 rounded-full border border-border/80 bg-card/80 py-1.5 pl-1.5 pr-3 transition-all hover:bg-beige hover:border-primary/30"
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-8 w-8 rounded-full object-cover border border-primary/20"
              />
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold text-foreground leading-tight">{profile.name}</p>
                <p className="text-[0.65rem] text-muted-foreground leading-tight">
                  {profile.trade} · {profile.iti}
                </p>
              </div>
              <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {profileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-64 rounded-3xl border border-border/80 bg-card p-2 shadow-lift backdrop-blur-2xl z-50"
                >
                  <div className="p-3 border-b border-border/60">
                    <p className="font-serif text-sm font-semibold text-primary">{profile.name}</p>
                    <p className="text-xs text-muted-foreground">{profile.careerGoal}</p>
                    <div className="mt-2 flex items-center justify-between rounded-xl bg-secondary/80 px-2.5 py-1 text-[0.7rem]">
                      <span className="text-muted-foreground">Readiness:</span>
                      <span className="font-semibold text-primary">{profile.careerReadinessScore}%</span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <Link
                      to="/student/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium text-foreground hover:bg-beige hover:text-primary transition-colors"
                    >
                      <User className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>My Profile & Skills</span>
                    </Link>
                    <Link
                      to="/student/learning"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium text-foreground hover:bg-beige hover:text-primary transition-colors"
                    >
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>My Learning Track</span>
                    </Link>
                    <Link
                      to="/student/applications"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium text-foreground hover:bg-beige hover:text-primary transition-colors"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>My Applications</span>
                    </Link>
                    <Link
                      to="/"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium text-foreground hover:bg-beige hover:text-primary transition-colors"
                    >
                      <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Saksham Home</span>
                    </Link>
                  </div>

                  <div className="mt-1 pt-1 border-t border-border/60">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 text-primary xl:hidden bg-card/80"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-border bg-cream/95 p-4 shadow-lift backdrop-blur-xl xl:hidden"
          >
            <div className="flex items-center gap-3 border-b border-border/70 pb-3 mb-3">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-10 w-10 rounded-full object-cover border border-primary/20"
              />
              <div>
                <p className="font-serif font-semibold text-primary">{profile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.trade} · {profile.iti}
                </p>
              </div>
            </div>

            <ul className="grid gap-1">
              {STUDENT_NAV.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/80 hover:bg-beige hover:text-primary"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 pt-3 border-t border-border/70 flex gap-2">
              <Link
                to="/"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-2xl border border-primary/25 px-4 py-2.5 text-center text-xs font-semibold text-primary"
              >
                Home Portal
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 rounded-2xl bg-primary/10 px-4 py-2.5 text-center text-xs font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
