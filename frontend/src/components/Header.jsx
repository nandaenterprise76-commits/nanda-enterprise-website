import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/brands", label: "Brands" },
  { to: "/power-wheels", label: "Power Wheels" },
  { to: "/about", label: "About" },
  { to: "/policies", label: "Policies" },
  { to: "/contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-[color:var(--ne-bg)]/85 backdrop-blur-xl border-b border-[color:var(--ne-border)]">
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
        <Link to="/" data-testid="header-logo" className="flex items-center gap-3 group">
          <img src="/neshma-logo.png" alt="Nanda Enterprise" className="w-12 h-12 object-contain" />
          <div className="leading-tight">
            <div className="font-black text-white text-lg tracking-tight uppercase">Nanda Enterprise</div>
            <div className="mono text-[10px] text-[color:var(--ne-accent)] tracking-[0.25em]">20 YEARS · OF TRUST</div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              data-testid={`nav-${n.label.toLowerCase().replace(/\s/g,'-')}`}
              className={({ isActive }) =>
                `px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  isActive ? "text-[color:var(--ne-accent)]" : "text-white/70 hover:text-white"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <a
            href="tel:+918373052508"
            data-testid="header-call-btn"
            className="ne-btn-ghost !py-2 !px-4 text-xs"
          >
            <Phone className="w-4 h-4" />
            +91 83730 52508
          </a>
          <button
            onClick={() => nav("/contact")}
            data-testid="header-enquire-btn"
            className="ne-btn-primary !py-2 !px-4 text-xs"
          >
            Enquire
          </button>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          data-testid="mobile-menu-toggle"
          aria-label="menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[color:var(--ne-border)] bg-[color:var(--ne-surface)]">
          <div className="px-6 py-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-${n.label.toLowerCase().replace(/\s/g,'-')}`}
                className={({ isActive }) =>
                  `px-4 py-3 text-sm font-semibold uppercase tracking-wider border-l-2 ${
                    isActive
                      ? "text-[color:var(--ne-accent)] border-[color:var(--ne-accent)] bg-white/5"
                      : "text-white/80 border-transparent"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
            <a href="tel:+918373052508" className="ne-btn-primary mt-3 justify-center" data-testid="mobile-call-btn">
              <Phone className="w-4 h-4" /> Call Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
