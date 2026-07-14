import { Award, Plane, Gem, Tv, Refrigerator, Wind, Gift, Package, Fuel, Briefcase } from "lucide-react";

const SLABS = [
  { icon: Plane, min: "₹60,00,000+", primary: "3N/4D Trip to Thailand", secondary: "OR 24 Ct Gold Coin ₹1,50,000", tag: "TIER 1" },
  { icon: Plane, min: "₹50,00,000+", primary: "4N/5D Goa Trip", secondary: "OR 22 Ct Gold Ornament ₹1,00,000" },
  { icon: Plane, min: "₹40,00,000+", primary: "3N/4D Gangtok Trip", secondary: "OR 20 Ct Gold ₹64,000" },
  { icon: Wind, min: "₹30,00,000+", primary: "Godrej 1.5T 5★ Inverter AC", secondary: "OR 18 Ct Gold ₹39,000" },
  { icon: Tv, min: "₹20,00,000+", primary: "Samsung 43″ FHD Smart TV", secondary: "OR 999 Silver Bar ₹22,500" },
  { icon: Refrigerator, min: "₹15,00,000+", primary: "Haier 190L 5★ Refrigerator", secondary: "OR Amazon Voucher ₹15,000" },
  { icon: Wind, min: "₹12,00,000+", primary: "Bajaj DMH-90 Desert Cooler", secondary: "OR Amazon Voucher ₹10,800" },
  { icon: Briefcase, min: "₹10,00,000+", primary: "Aristocrat 80cm Trolley", secondary: "OR Amazon Voucher ₹8,000" },
  { icon: Fuel, min: "₹8,00,000+", primary: "Bharat LPG Double Cylinder Kit", secondary: "OR Amazon Voucher ₹5,600" },
  { icon: Fuel, min: "₹5,00,000+", primary: "HP LPG Single Cylinder Kit", secondary: "OR Amazon Voucher ₹3,000" },
];

export default function PowerWheels() {
  return (
    <div data-testid="power-wheels-page">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[color:var(--ne-border)]">
        <img
          src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=1920&q=85"
          alt="Power Wheels"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[color:var(--ne-bg)]/70 to-[color:var(--ne-bg)]" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-24">
          <div className="overline mb-6 flex items-center gap-3">
            <span className="w-8 h-px bg-[color:var(--ne-accent)]" /> YEARLY ROYALTY PROGRAM
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase text-white leading-none">
            Power <span className="text-[color:var(--ne-accent)]">Wheels</span>
          </h1>
          <p className="mt-6 text-white/70 text-lg max-w-2xl">
            The Nanda Enterprise loyalty scheme rewarding our channel partners for annual purchase performance
            between <span className="text-[color:var(--ne-accent)] mono">01 APR 2026 → 15 MAR 2027</span>.
          </p>
          <div className="mt-10 grid sm:grid-cols-3 gap-4 max-w-3xl">
            <Meta k="10" v="Reward Slabs" />
            <Meta k="₹5L" v="Entry Slab" />
            <Meta k="₹1.5L" v="Top Gold Value" />
          </div>
        </div>
      </section>

      {/* Slabs */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="mb-12">
          <div className="overline mb-3">// Reward Ladder</div>
          <h2 className="text-4xl md:text-5xl font-black uppercase text-white">Choose Your Prize</h2>
          <p className="text-white/60 mt-2 max-w-2xl">Every partner picks between the primary reward (travel / appliance) or its cash-equivalent gold / voucher alternative.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {SLABS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="ne-card p-6 flex gap-5 items-start" data-testid={`slab-${i}`}>
                <div className="w-14 h-14 bg-[color:var(--ne-accent)]/10 border border-[color:var(--ne-accent)]/40 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-[color:var(--ne-accent)]" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="mono text-xs text-[color:var(--ne-accent)] tracking-widest">{s.min}</div>
                    {s.tag && <div className="mono text-[10px] bg-[color:var(--ne-accent)] text-black px-2 py-0.5 font-black">{s.tag}</div>}
                  </div>
                  <div className="font-black text-white text-xl uppercase leading-tight mt-2">{s.primary}</div>
                  <div className="text-sm text-white/60 mt-1">{s.secondary}</div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Terms */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
        <div className="ne-card p-8 md:p-12">
          <div className="overline mb-4">// Program Terms</div>
          <h3 className="text-3xl font-black uppercase text-white mb-6">Eligibility & Conditions</h3>
          <ul className="grid md:grid-cols-2 gap-x-8 gap-y-3 text-white/70">
            {[
              "Signed agreement required for all secondary customers.",
              "Minimum annual purchase: ₹5,00,000 (before GST).",
              "Full dues to be cleared by 30 March 2027.",
              "Calculated on Net Billing Value (excl. GST, returns, schemes).",
              "Dealer account must remain active and in good standing.",
              "Trips: single group guided tours, 3/4-star hotel single occupancy.",
              "Reach nearest airport (Mumbai/Delhi/Kolkata/Chennai) at own cost.",
              "Overseas trips need valid passport.",
              "Eligible person: proprietor/partner or immediate family.",
              "Cash / voucher alternative available for all travel prizes.",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-[color:var(--ne-accent)] mt-2 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function Meta({ k, v }) {
  return (
    <div className="border-l-2 border-[color:var(--ne-accent)] pl-4">
      <div className="text-3xl font-black text-white">{k}</div>
      <div className="mono text-[10px] text-white/50 tracking-widest uppercase">{v}</div>
    </div>
  );
}
