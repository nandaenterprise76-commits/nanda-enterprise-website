import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Search, Filter } from "lucide-react";
import api from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";

export default function BrandDetail() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [sub, setSub] = useState("All");
  const [sort, setSort] = useState("default");
  const [priceMax, setPriceMax] = useState(0);

  useEffect(() => {
    api.get(`/brands/${slug}`).then((r) => setBrand(r.data)).catch(() => {});
    api.get(`/products?brand_slug=${slug}`).then((r) => setProducts(r.data)).catch(() => {});
  }, [slug]);

  const subs = useMemo(() => ["All", ...new Set(products.map((p) => p.sub_category).filter(Boolean))], [products]);
  const maxPrice = useMemo(() => Math.max(0, ...products.map((p) => p.price)), [products]);

  useEffect(() => { setPriceMax(maxPrice); }, [maxPrice]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const okSub = sub === "All" || p.sub_category === sub;
      const okQ = !q || p.name.toLowerCase().includes(q.toLowerCase());
      const okPrice = priceMax === 0 || p.price <= priceMax;
      return okSub && okQ && okPrice;
    });
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, q, sub, sort, priceMax]);

  if (!brand) return <div className="min-h-screen flex items-center justify-center text-white/50 mono">LOADING BRAND…</div>;

  return (
    <div data-testid="brand-detail-page">
      {/* Hero */}
      <div className="border-b border-[color:var(--ne-border)] bg-[color:var(--ne-surface)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
          <Link to="/brands" className="mono text-xs text-white/40 tracking-widest hover:text-[color:var(--ne-accent)] flex items-center gap-2 mb-6" data-testid="back-to-brands">
            <ArrowLeft className="w-3 h-3" /> ALL BRANDS
          </Link>
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-2">
              <BrandLogo brand={brand} className="w-32 h-32" textClass="text-3xl" />
            </div>
            <div className="lg:col-span-10">
              <div className="mono text-xs tracking-widest" style={{ color: brand.accent_color }}>{brand.category.toUpperCase()}</div>
              <h1 className="text-5xl md:text-6xl font-black uppercase text-white leading-none mt-2">{brand.name}</h1>
              <div className="text-[color:var(--ne-accent)] mt-3 tracking-wider">{brand.tagline}</div>
              <p className="mt-4 text-white/60 max-w-3xl">{brand.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid lg:grid-cols-12 gap-8">
        {/* Filters */}
        <aside className="lg:col-span-3 space-y-8">
          <div>
            <div className="overline mb-3 flex items-center gap-2"><Filter className="w-3.5 h-3.5" /> Filters</div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products…"
                data-testid="product-search-input"
                className="w-full bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-11 py-2.5 text-sm text-white placeholder-white/40 outline-none rounded-none"
              />
            </div>
          </div>

          <div>
            <div className="overline mb-3">Sub-Category</div>
            <div className="space-y-1">
              {subs.map((s) => (
                <button
                  key={s}
                  onClick={() => setSub(s)}
                  data-testid={`sub-${s.toLowerCase().replace(/\s/g,'-')}`}
                  className={`block w-full text-left px-3 py-2 text-sm border-l-2 transition-colors ${
                    sub === s
                      ? "border-[color:var(--ne-accent)] text-white bg-white/5"
                      : "border-transparent text-white/60 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="overline mb-3">Max Price</div>
            <input
              type="range"
              min="0"
              max={maxPrice || 100}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[color:var(--ne-accent)]"
              data-testid="price-range"
            />
            <div className="mono text-xs text-white/60 mt-1">₹0 – ₹{priceMax.toLocaleString()}</div>
          </div>

          <div>
            <div className="overline mb-3">Sort</div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              data-testid="sort-select"
              className="w-full bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-3 py-2 text-sm text-white outline-none rounded-none"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </aside>

        {/* Products */}
        <div className="lg:col-span-9">
          <div className="flex items-center justify-between mb-6">
            <div className="mono text-xs text-white/50 tracking-widest">{filtered.length} PRODUCT{filtered.length !== 1 ? "S" : ""}</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Link
                key={p.id}
                to={`/products/${p.id}`}
                data-testid={`product-card-${p.id}`}
                className="ne-card group flex flex-col overflow-hidden"
              >
                <div className="aspect-square bg-black overflow-hidden">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="mono text-[10px] tracking-widest" style={{ color: brand.accent_color }}>{p.sub_category?.toUpperCase()}</div>
                  <div className="font-bold text-white mt-1 line-clamp-2 leading-snug">{p.name}</div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-[color:var(--ne-accent)]">₹{p.price.toLocaleString()}</div>
                      <div className="mono text-[10px] text-white/40">PER {p.unit.toUpperCase()}</div>
                    </div>
                    <div className="mono text-xs text-white/50 group-hover:text-[color:var(--ne-accent)]">VIEW →</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-24 text-white/40 mono tracking-widest">NO PRODUCTS MATCH FILTERS</div>
          )}
        </div>
      </div>
    </div>
  );
}
