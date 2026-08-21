import { Link } from "@tanstack/react-router";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "About", hash: "about" },
      { label: "Learning", hash: "learning" },
      { label: "Opportunities", hash: "opportunities" },
      { label: "Mentorship", hash: "mentorship" },
      { label: "Industry Partners", hash: "partners" },
      { label: "Success Stories", hash: "stories" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", hash: "faqs" },
      { label: "Contact", hash: "faqs" },
      { label: "Help", hash: "faqs" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-cream px-5 py-16">
      <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary font-serif text-lg text-primary-foreground">
              S
            </span>
            <div>
              <p className="font-serif text-2xl text-primary">Saksham</p>
              <p className="eyebrow text-muted-foreground">Powered by Y4D Foundation</p>
            </div>
          </div>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Empowering ITI learners with skills, mentorship and opportunities for a stronger career
            journey.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <p className="eyebrow text-primary">{col.title}</p>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to="/"
                    hash={l.hash}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="eyebrow text-primary">Account</p>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link
                to="/login"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/join"
                className="text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                Join Saksham
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-7xl flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Saksham · A Y4D Foundation initiative.</p>
        <p>Built for Mastercard Code for Change.</p>
      </div>
    </footer>
  );
}
