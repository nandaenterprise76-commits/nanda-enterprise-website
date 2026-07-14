import { Building2, Handshake, Zap, ShieldCheck } from "lucide-react";

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16" data-testid="about-page">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6">
          <div className="overline mb-4">// Since 2005</div>
          <h1 className="text-5xl md:text-6xl font-black uppercase text-white leading-none">
            Two Decades. <br />One <span className="text-[color:var(--ne-accent)]">Standard.</span>
          </h1>
          <p className="mt-6 text-white/70 leading-relaxed">
            Nanda Enterprise was founded on a single conviction: mechanics, dealers and vehicle owners deserve
            authentic parts, fair credit, and a partner who picks up the phone. Twenty years later, that
            philosophy powers every carton we dispatch from our Balarampur warehouse.
          </p>
          <p className="mt-4 text-white/60 leading-relaxed">
            From MAK lubricants and HP engine oils to Gulf batteries, TVS tyres, Diamond chain kits, and
            Niterra spark plugs — we've become the single, dependable source-of-truth for automotive supply
            across Murshidabad and adjoining districts.
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="relative aspect-[4/3] overflow-hidden border border-[color:var(--ne-border)]">
            <img
              src="https://images.unsplash.com/photo-1689942010216-dc412bb1e7a9?w=1200&q=85"
              alt="Warehouse"
              className="w-full h-full object-cover"
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[color:var(--ne-accent)]" />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
        {[
          { i: Building2, t: "Modern Warehouse", d: "Climate-controlled, categorised storage across the NH-12 bypass facility." },
          { i: Handshake, t: "Dealer-Centric", d: "Transparent credit terms, structured cash discounts, and a loyalty program." },
          { i: Zap, t: "Fast Turnaround", d: "Same-day dispatch on lubricants, batteries and high-runner spares." },
          { i: ShieldCheck, t: "Sealed & Safe", d: "Zero tolerance on broken foil seals — authenticity guaranteed." },
        ].map((f) => {
          const Icon = f.i;
          return (
            <div key={f.t} className="ne-card p-6">
              <Icon className="w-6 h-6 text-[color:var(--ne-accent)] mb-4" strokeWidth={1.5} />
              <div className="font-black text-white uppercase">{f.t}</div>
              <div className="text-sm text-white/60 mt-2 leading-relaxed">{f.d}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-24 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5">
          <div className="overline mb-3">// Milestones</div>
          <h2 className="text-4xl font-black uppercase text-white leading-tight">Trust, In Numbers.</h2>
        </div>
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { k: "20+", v: "Years" },
            { k: "18", v: "Brands" },
            { k: "500+", v: "SKUs" },
            { k: "1000+", v: "Dealers" },
          ].map((s) => (
            <div key={s.v} className="border-l-2 border-[color:var(--ne-accent)] pl-4 py-2">
              <div className="text-4xl font-black text-white">{s.k}</div>
              <div className="mono text-[10px] text-white/50 tracking-widest uppercase">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
