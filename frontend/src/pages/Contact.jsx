import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

const DEPARTMENTS = [
  { label: "Overall Enquiry", num: "+91 83730 52508" },
  { label: "Lubricants Desk", num: "+91 83730 52502" },
  { label: "Spare Parts Desk", num: "+91 83730 52504" },
  { label: "Battery Desk", num: "+91 83730 52507" },
  { label: "Customer Care (Neshma)", num: "+91 83730 52505" },
  { label: "Accounts", num: "+91 83730 52509" },
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", message: "" });
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await api.post("/enquiries", form);
      toast.success("Thanks! We'll get back within one business day.");
      setForm({ name: "", phone: "", email: "", city: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try phone or WhatsApp.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16" data-testid="contact-page">
      <div className="grid lg:grid-cols-2 gap-16 items-start">
        <div>
          <div className="overline mb-4">// Reach Us</div>
          <h1 className="text-5xl md:text-6xl font-black uppercase text-white leading-none">
            Let's <span className="text-[color:var(--ne-accent)]">Talk.</span>
          </h1>
          <p className="mt-6 text-white/60 leading-relaxed max-w-lg">
            Whether you're a dealer, mechanic or a fleet owner — our team is available across dedicated desks
            for lubricants, spares, batteries and accounts.
          </p>

          <div className="mt-10 space-y-6">
            <div>
              <div className="overline mb-3">Head Office</div>
              <div className="flex items-start gap-3 text-white/80">
                <MapPin className="w-5 h-5 text-[color:var(--ne-accent)] mt-1 shrink-0" />
                <div>
                  NANDA ENTERPRISE<br />
                  NH 12 Bypass, Balarampur Colony<br />
                  (Near New Balarampur Halt Railway Station)<br />
                  Murshidabad, West Bengal — 742165
                </div>
              </div>
            </div>

            <div>
              <div className="overline mb-3">Department Lines</div>
              <div className="grid sm:grid-cols-2 gap-2">
                {DEPARTMENTS.map((d) => (
                  <a
                    key={d.num}
                    href={`tel:${d.num.replace(/\s/g,'')}`}
                    className="flex items-center justify-between border border-[color:var(--ne-border)] hover:border-[color:var(--ne-accent)] px-4 py-3 group transition-colors"
                    data-testid={`dept-${d.label.toLowerCase().replace(/\s/g,'-')}`}
                  >
                    <div>
                      <div className="mono text-[10px] text-white/40 uppercase tracking-widest">{d.label}</div>
                      <div className="text-white font-bold text-sm mt-0.5">{d.num}</div>
                    </div>
                    <Phone className="w-4 h-4 text-white/40 group-hover:text-[color:var(--ne-accent)]" />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="mailto:service.nemwh@gmail.com" className="ne-btn-ghost" data-testid="contact-email">
                <Mail className="w-4 h-4" /> service.nemwh@gmail.com
              </a>
              <a
                href="https://wa.me/918373052508"
                target="_blank"
                rel="noreferrer"
                className="ne-btn-primary"
                data-testid="contact-whatsapp"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="ne-card p-8" data-testid="contact-form">
          <div className="overline mb-3">// Send a Message</div>
          <h3 className="text-2xl font-black uppercase text-white mb-6">Drop your details</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Name *" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required testid="c-name" />
            <Field label="Phone *" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required testid="c-phone" />
            <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testid="c-email" />
            <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} testid="c-city" />
          </div>
          <div className="mt-4">
            <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Message *</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              rows={5}
              data-testid="c-message"
              className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
            />
          </div>
          <button type="submit" disabled={sending} className="ne-btn-primary mt-6 disabled:opacity-60" data-testid="c-submit">
            <Send className="w-4 h-4" /> {sending ? "SENDING…" : "Send Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, testid }) {
  return (
    <div>
      <label className="mono text-[10px] tracking-widest text-white/50 uppercase">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        data-testid={testid}
        className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
      />
    </div>
  );
}
