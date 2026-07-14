import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import api from "@/lib/api";

export default function Brands() {
  const [brands, setBrands] = useState([]);
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState("");

  useEffect(() => {
    api.get("/brands").then((r) => setBrands(r.data)).catch(() => {});
  }, []);

  const activeCat = params.get("category") || "All";
  const categories = useMemo(() => ["All", ...new Set(brands.map((b) => b.category))], [brands]);

  const filtered = brands.filter((b) => {
    const okCat = activeCat === "All" || b.category === activeCat;
    const okQ = !q || b.name.toLowerCase().includes(q.toLowerCase()) || b.tagline.toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16" data-testid="brands-page">
      <div className="grid lg:grid-cols-12 gap-8 items-end mb-12 border-b border-[color:var(--ne-border)] pb-8">
        <div className="lg:col-span-7">
          <div className="overline mb-3">// Distributorships</div>
          <h1 className="text-5xl md:text-6xl font-black uppercase text-white leading-none">
            The Brand <span className="text-[color:var(--ne-accent)]">Portfolio.</span>
          </h1>
          <p className="mt-4 text-white/60 max-w-xl">
            Explore every company under Nanda Enterprise distribution. Click any brand to see the full product catalogue.
          </p>
        </div>
        <div className="lg:col-span-5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search brand or tagline…"
              data-testid="brands-search-input"
              className="w-full bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-11 py-3 text-white placeholder-white/40 outline-none rounded-none"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setParams(c === "All" ? {} : { category: c })}
            data-testid={`filter-cat-${c.toLowerCase().replace(/\s/g,'-')}`}
            className={`px-4 py-2 mono text-xs uppercase tracking-widest border transition-colors ${
              activeCat === c
                ? "bg-[color:var(--ne-accent)] text-black border-[color:var(--ne-accent)]"
                : "text-white/60 border-[color:var(--ne-border)] hover:text-[color:var(--ne-accent)] hover:border-[color:var(--ne-accent)]"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <Link
            key={b.id}
            to={`/brands/${b.slug}`}
            data-testid={`brand-card-${b.slug}`}
            className="ne-card p-7 group flex flex-col"
          >
            <div className="flex items-start justify-between mb-6">
              <div
                className="w-16 h-16 flex items-center justify-center font-black text-black text-lg tracking-wider"
                style={{ background: b.accent_color }}
              >
                {b.logo_text}
              </div>
              <div className="mono text-[10px] text-white/40 tracking-widest">{b.category.toUpperCase()}</div>
            </div>
            <div className="font-black text-white text-2xl uppercase leading-tight">{b.name}</div>
            <div className="text-[color:var(--ne-accent)] text-xs mt-1 mono tracking-wider">{b.tagline}</div>
            <p className="text-sm text-white/60 leading-relaxed mt-4 line-clamp-3">{b.description}</p>
            <div className="mt-6 pt-4 border-t border-[color:var(--ne-border)] flex items-center justify-between text-xs uppercase tracking-widest text-white/60 group-hover:text-[color:var(--ne-accent)] transition-colors">
              View Products <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-white/40 mono tracking-widest">NO BRANDS FOUND</div>
      )}
    </div>
  );
}
