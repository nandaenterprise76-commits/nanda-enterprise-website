import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const DEPARTMENTS = [
  { label: "Overall Enquiry", num: "+91 83730 52508" },
  { label: "Lubricants Desk", num: "+91 83730 52502" },
  { label: "Spare Parts Desk", num: "+91 83730 52504" },
  { label: "Battery Desk", num: "+91 83730 52507" },
  { label: "Accounts", num: "+91 83730 52509" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[color:var(--ne-border)] bg-[color:var(--ne-surface)] mt-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/neshma-logo.png" alt="Nanda Enterprise" className="w-14 h-14 object-contain" />
            <div>
              <div className="font-black text-white text-xl uppercase">Nanda Enterprise</div>
              <div className="mono text-[10px] text-[color:var(--ne-accent)] tracking-[0.25em]">HOUSE OF TRUSTED DISTRIBUTION</div>
            </div>
          </div>
          <p className="text-white/60 leading-relaxed max-w-md">
            Two decades of powering West Bengal's automotive backbone. Multi-brand distributor of
            lubricants, batteries, tyres, spare parts, filters and car care.
          </p>
          <div className="mt-6 flex gap-3">
            <a href="https://wa.me/918373052508" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-[color:var(--ne-border)] px-4 h-10 hover:border-[color:var(--ne-accent)] hover:text-[color:var(--ne-accent)] transition-colors text-sm mono tracking-wider" data-testid="footer-whatsapp">
              <MessageCircle className="w-4 h-4" /> CHAT ON WHATSAPP
            </a>
          </div>
        </div>

        <div>
          <div className="overline mb-4">Reach Out</div>
          <ul className="space-y-3 text-sm text-white/70">
            {DEPARTMENTS.map((d) => (
              <li key={d.num} className="flex flex-col">
                <span className="text-white/50 text-xs uppercase tracking-wider">{d.label}</span>
                <a href={`tel:${d.num.replace(/\s/g,'')}`} className="hover:text-[color:var(--ne-accent)]">{d.num}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="overline mb-4">Head Office</div>
          <div className="flex items-start gap-3 text-sm text-white/70 mb-4">
            <MapPin className="w-4 h-4 mt-1 text-[color:var(--ne-accent)]" />
            <div>
              NH 12 Bypass, Balarampur Colony,<br />
              Near New Balarampur Halt Railway Station,<br />
              Murshidabad, West Bengal — 742165
            </div>
          </div>
          <a href="mailto:service.nemwh@gmail.com" className="text-sm text-white/70 hover:text-[color:var(--ne-accent)] flex items-center gap-2">
            <Mail className="w-4 h-4" /> service.nemwh@gmail.com
          </a>
          <div className="mt-6">
            <Link to="/admin/login" className="mono text-xs text-white/40 hover:text-[color:var(--ne-accent)] tracking-widest" data-testid="footer-admin-link">
              [ADMIN LOGIN]
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-[color:var(--ne-border)] py-4 text-center text-xs text-white/40 mono tracking-widest">
        © {new Date().getFullYear()} NANDA ENTERPRISE · ALL RIGHTS RESERVED
      </div>
    </footer>
  );
}
