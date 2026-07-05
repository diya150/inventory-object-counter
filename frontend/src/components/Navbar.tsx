import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/detect", label: "Scan" },
  { to: "/history", label: "Log" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <header className="border-b border-line">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-sm tracking-wide text-ink2">
          SHELF<span className="text-safety">/</span>COUNT
        </Link>
        <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={
                location.pathname === link.to
                  ? "text-safety"
                  : "text-dim hover:text-ink2 transition-colors"
              }
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
