import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV = [
  { label: "Home", hash: "top" },
  { label: "About", hash: "about" },
  { label: "How It Works", hash: "how-it-works" },
  { label: "Learning", hash: "learning" },
  { label: "Opportunities", hash: "opportunities" },
  { label: "Mentorship", hash: "mentorship" },
  { label: "Industry Partners", hash: "partners" },
  { label: "Success Stories", hash: "stories" },
  { label: "FAQs", hash: "faqs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        className={`mx-auto flex max-w-7xl items-center gap-4 rounded-3xl border border-border/70 bg-cream/80 px-4 py-3 backdrop-blur-xl transition-shadow duration-300 sm:px-6 ${
          scrolled ? "shadow-lift" : "shadow-soft"
        }`}
      >
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary font-serif text-lg text-primary-foreground">
            S
          </span>
          <span className="leading-none">
            <span className="block font-serif text-xl tracking-tight text-primary">Saksham</span>
            <span className="mt-1 block text-[0.6rem] tracking-[0.18em] text-muted-foreground uppercase">
              Powered by Y4D Foundation
            </span>
          </span>
        </Link>

        <ul className="ml-auto hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <li key={item.label}>
              <Link
                to="/"
                hash={item.hash}
                className="rounded-full px-3 py-2 text-[0.82rem] font-medium text-foreground/75 transition-colors hover:bg-beige hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-2 xl:ml-4">
          <Link
            to="/login"
            className="hidden rounded-full border border-primary/25 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-beige sm:inline-flex"
          >
            Login
          </Link>
          <Link
            to="/join"
            className="hidden rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-deep hover:shadow-lift sm:inline-flex"
          >
            Join Saksham
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-primary/20 text-primary xl:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-7xl overflow-hidden rounded-3xl border border-border bg-cream/95 p-4 shadow-lift backdrop-blur-xl xl:hidden"
          >
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to="/"
                    hash={item.hash}
                    onClick={() => setOpen(false)}
                    className="block rounded-2xl px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-beige hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 grid gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl border border-primary/25 px-4 py-3 text-center text-sm font-semibold text-primary"
              >
                Login
              </Link>
              <Link
                to="/join"
                onClick={() => setOpen(false)}
                className="rounded-2xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground"
              >
                Join Saksham
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
