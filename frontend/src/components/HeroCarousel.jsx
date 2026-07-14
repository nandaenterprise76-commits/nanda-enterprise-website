import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const SLIDES = [
  {
    img: "https://images.unsplash.com/photo-1689942010216-dc412bb1e7a9?w=1920&q=85",
    kicker: "20 Years of Trust",
    title: "Powering West Bengal's Rides",
    sub: "Distributorship of 18+ premium automotive brands — from MAK & HP lubricants to Gulf batteries, TVS tyres and Niterra ignition.",
  },
  {
    img: "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=1920&q=85",
    kicker: "Lubricants Division",
    title: "Engine-Grade Precision",
    sub: "MAK · HP · Veedol · Petronas — the full spectrum of automotive & industrial oils, stocked and delivered fresh.",
  },
  {
    img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=1920&q=85",
    kicker: "Genuine Spares",
    title: "Every Part. Every Ride.",
    sub: "Chain kits, brake shoes, filters, bearings, electricals — OEM-grade parts from Diamond, MAHLE, SKF, Uno Minda and more.",
  },
  {
    img: "https://images.unsplash.com/photo-1571335746824-742511d49bce?w=1920&q=85",
    kicker: "Tyre & Battery",
    title: "Grip. Start. Repeat.",
    sub: "TVS & Metro tyres for two-wheelers and Totos. Gulf Pride batteries with maintenance-free performance.",
  },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % SLIDES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden" data-testid="hero-carousel">
      <div className="absolute inset-0 gridlines opacity-40" />
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`transition-opacity duration-1000 ${idx === i ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
        >
          <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-24 grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 relative z-10 fade-up" key={`text-${i}`}>
              <div className="overline mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-[color:var(--ne-accent)]" />
                {s.kicker}
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase leading-[0.95] text-white">
                {s.title.split(" ").map((w, wi) => (
                  <span key={wi} className={wi === 1 ? "text-[color:var(--ne-accent)]" : ""}>
                    {w}{" "}
                  </span>
                ))}
              </h1>
              <p className="mt-6 text-white/70 text-lg max-w-xl leading-relaxed">{s.sub}</p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link to="/brands" className="ne-btn-primary" data-testid="hero-cta-brands">
                  Explore Brands <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/power-wheels" className="ne-btn-ghost" data-testid="hero-cta-power-wheels">
                  Power Wheels Program
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
                <Stat k="18+" v="Brands" />
                <Stat k="500+" v="SKUs" />
                <Stat k="20yr" v="Legacy" />
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[4/5] lg:aspect-[3/4] overflow-hidden border border-[color:var(--ne-border)]">
                <img src={s.img} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-tr from-[color:var(--ne-bg)] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                  <div className="mono text-xs text-white/70 tracking-widest">
                    {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                  </div>
                  <div className="flex gap-1">
                    {SLIDES.map((_, j) => (
                      <button
                        key={j}
                        onClick={() => setI(j)}
                        aria-label={`slide-${j}`}
                        data-testid={`hero-dot-${j}`}
                        className={`h-1 transition-all ${j === i ? "w-8 bg-[color:var(--ne-accent)]" : "w-4 bg-white/30"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-[color:var(--ne-accent)] hidden lg:block" />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function Stat({ k, v }) {
  return (
    <div className="border-l-2 border-[color:var(--ne-accent)] pl-3">
      <div className="text-3xl font-black text-white">{k}</div>
      <div className="mono text-[10px] text-white/50 tracking-widest uppercase">{v}</div>
    </div>
  );
}
