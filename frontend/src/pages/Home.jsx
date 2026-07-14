import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, Award, Sparkles, Wrench, Fuel, Battery, Disc } from "lucide-react";
import api from "@/lib/api";
import HeroCarousel from "@/components/HeroCarousel";
import BrandMarquee from "@/components/BrandMarquee";
import BrandLogo from "@/components/BrandLogo";

const CATEGORY_ICONS = {
  Lubricants: Fuel,
  Batteries: Battery,
  Tyres: Disc,
  "Spare Parts": Wrench,
  Filters: Sparkles,
  Bearings: Shield,
  "Car Care": Sparkles,
};

export default function Home() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    api.get("/brands").then((r) => setBrands(r.data)).catch(() => {});
  }, []);

  const categories = [...new Set(brands.map((b) => b.category))];

  return (
    <div data-testid="home-page">
      <HeroCarousel />
      <BrandMarquee brands={brands} />

      {/* WHY US */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <div className="overline mb-4">// About Nanda</div>
            <h2 className="text-4xl md:text-5xl font-black uppercase leading-tight text-white">
              A Distribution House Built On <span className="text-[color:var(--ne-accent)]">Ownership.</span>
            </h2>
            <p className="mt-6 text-white/60 leading-relaxed">
              Since 2005, Nanda Enterprise has been the trusted last-mile link between global automotive
              brands and the mechanics, dealers and drivers of West Bengal. Zero-tolerance on adulteration.
              Full transparency on credit. Rewards for loyalty.
            </p>
            <Link to="/about" className="ne-btn-ghost mt-8" data-testid="home-about-cta">
              Our Story <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            <Feature icon={Award} title="20 Years of Trust" desc="Two decades of unbroken distribution across Murshidabad and beyond." />
            <Feature icon={Truck} title="Fresh Stock, Fast" desc="Same-day dispatch on lubricants, batteries and high-runner spares." />
            <Feature icon={Shield} title="Zero-Tolerance QC" desc="Sealed foils only. If the seal breaks, the product doesn't leave." />
            <Feature icon={Sparkles} title="Power Wheels Rewards" desc="Loyalty program with Thailand trips, gold and premium electronics." />
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex items-end justify-between mb-10 border-b border-[color:var(--ne-border)] pb-6">
          <div>
            <div className="overline mb-3">// Shop by Category</div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white">Product Universe</h2>
          </div>
          <Link to="/brands" className="mono text-xs text-[color:var(--ne-accent)] tracking-widest hover:underline" data-testid="home-view-all-brands">
            VIEW ALL BRANDS →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((c) => {
            const Icon = CATEGORY_ICONS[c] || Wrench;
            const count = brands.filter((b) => b.category === c).length;
            return (
              <Link
                key={c}
                to={`/brands?category=${encodeURIComponent(c)}`}
                data-testid={`category-card-${c.toLowerCase().replace(/\s/g,'-')}`}
                className="ne-card p-6 group"
              >
                <Icon className="w-8 h-8 text-[color:var(--ne-accent)] mb-6" strokeWidth={1.5} />
                <div className="font-black text-white text-xl uppercase leading-tight">{c}</div>
                <div className="mono text-xs text-white/40 tracking-widest mt-1">{count} BRAND{count !== 1 ? "S" : ""}</div>
                <div className="mt-6 pt-4 border-t border-[color:var(--ne-border)] flex items-center justify-between text-xs uppercase tracking-widest text-white/60 group-hover:text-[color:var(--ne-accent)] transition-colors">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED BRANDS */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="flex items-end justify-between mb-10 border-b border-[color:var(--ne-border)] pb-6">
          <div>
            <div className="overline mb-3">// Featured Distributorships</div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white">Marquee Brands</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {brands.slice(0, 12).map((b) => (
            <Link
              key={b.id}
              to={`/brands/${b.slug}`}
              data-testid={`featured-brand-${b.slug}`}
              className="ne-card p-5 flex flex-col items-center text-center group"
            >
              <BrandLogo brand={b} className="w-16 h-16 mb-3 group-hover:scale-110 transition-transform" textClass="text-sm" />
              <div className="font-bold text-white text-sm uppercase leading-tight">{b.name}</div>
              <div className="mono text-[10px] text-white/40 tracking-widest mt-1">{b.category}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* POWER WHEELS BANNER */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 pb-24">
        <div className="relative overflow-hidden border border-[color:var(--ne-accent)]/30">
          <img
            src="https://images.unsplash.com/photo-1528181304800-259b08848526?w=1600&q=85"
            alt="Power Wheels"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
          <div className="relative bg-gradient-to-r from-[color:var(--ne-bg)] via-[color:var(--ne-bg)]/80 to-transparent p-10 md:p-16">
            <div className="overline mb-4 text-[color:var(--ne-accent)]">// Yearly Royalty Program</div>
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-none max-w-2xl">
              Win With <span className="text-[color:var(--ne-accent)]">Nanda Enterprise</span>
            </h2>
            <p className="mt-6 text-white/70 text-lg max-w-xl">
              Thailand trips, 24-carat gold, LED TVs, premium ACs and refrigerators — all on the table for
              our top-performing dealers, April 2026 → March 2027.
            </p>
            <Link to="/power-wheels" className="ne-btn-primary mt-8" data-testid="home-power-wheels-cta">
              See Reward Slabs <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="ne-card p-6">
      <Icon className="w-6 h-6 text-[color:var(--ne-accent)] mb-4" strokeWidth={1.5} />
      <div className="font-black text-white uppercase mb-2">{title}</div>
      <div className="text-sm text-white/60 leading-relaxed">{desc}</div>
    </div>
  );
}
