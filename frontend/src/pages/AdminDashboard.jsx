import { useEffect, useMemo, useState } from "react";
import { LogOut, Package, MessageSquare, Building2, Trash2, Search, Plus, Pencil } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { toast } from "sonner";
import { ProductForm, BrandForm } from "@/components/AdminForms";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState("enquiries");
  const [stats, setStats] = useState({ brands: 0, products: 0, enquiries: 0, new_enquiries: 0 });
  const [enquiries, setEnquiries] = useState([]);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [q, setQ] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [editProduct, setEditProduct] = useState(null);
  const [editBrand, setEditBrand] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBrandForm, setShowBrandForm] = useState(false);

  const load = async () => {
    try {
      const [s, e, b, p] = await Promise.all([
        api.get("/stats"),
        api.get("/enquiries"),
        api.get("/brands"),
        api.get("/products"),
      ]);
      setStats(s.data);
      setEnquiries(e.data);
      setBrands(b.data);
      setProducts(p.data);
    } catch {
      toast.error("Failed to load data");
    }
  };
  useEffect(() => { load(); }, []);

  const updateEnq = async (id, status) => {
    await api.patch(`/enquiries/${id}?status=${status}`);
    toast.success(`Marked as ${status}`);
    load();
  };
  const deleteEnq = async (id) => {
    if (!window.confirm("Delete this enquiry?")) return;
    await api.delete(`/enquiries/${id}`);
    toast.success("Enquiry deleted");
    load();
  };
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    toast.success("Product deleted");
    load();
  };
  const deleteBrand = async (id) => {
    if (!window.confirm("Delete this brand? Its products will remain — delete them separately.")) return;
    await api.delete(`/brands/${id}`);
    toast.success("Brand deleted");
    load();
  };

  const filteredProducts = useMemo(
    () => products.filter((p) => {
      const okQ = !q || p.name.toLowerCase().includes(q.toLowerCase());
      const okB = !brandFilter || p.brand_slug === brandFilter;
      return okQ && okB;
    }),
    [products, q, brandFilter]
  );

  const closeProductForm = () => { setShowProductForm(false); setEditProduct(null); };
  const closeBrandForm = () => { setShowBrandForm(false); setEditBrand(null); };

  return (
    <div className="min-h-screen" data-testid="admin-dashboard">
      <div className="border-b border-[color:var(--ne-border)] bg-[color:var(--ne-surface)]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="overline">// Console</div>
            <h1 className="text-2xl font-black uppercase text-white">Admin Dashboard</h1>
            <div className="text-xs text-white/50 mono mt-1">SIGNED IN AS {user?.email?.toUpperCase()}</div>
          </div>
          <div className="flex gap-2">
            <a href="/" className="ne-btn-ghost" data-testid="admin-view-site">View Site</a>
            <button onClick={logout} className="ne-btn-ghost" data-testid="admin-logout">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <StatCard icon={Building2} label="Brands" val={stats.brands} testid="stat-brands" />
          <StatCard icon={Package} label="Products" val={stats.products} testid="stat-products" />
          <StatCard icon={MessageSquare} label="Enquiries" val={stats.enquiries} testid="stat-enquiries" />
          <StatCard icon={MessageSquare} label="New" val={stats.new_enquiries} accent testid="stat-new" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[color:var(--ne-border)] mb-6 overflow-x-auto">
          {["enquiries", "products", "brands"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              data-testid={`admin-tab-${t}`}
              className={`px-6 py-3 mono text-xs uppercase tracking-widest transition-colors whitespace-nowrap ${
                tab === t ? "text-[color:var(--ne-accent)] border-b-2 border-[color:var(--ne-accent)]" : "text-white/50 hover:text-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "enquiries" && (
          <div className="space-y-3">
            {enquiries.length === 0 && <div className="text-white/40 mono py-16 text-center">NO ENQUIRIES YET</div>}
            {enquiries.map((e) => (
              <div key={e.id} className="ne-card p-5 flex flex-col md:flex-row gap-4 md:items-center" data-testid={`enq-row-${e.id}`}>
                <div className="flex-1 grid md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <div className="mono text-[10px] text-white/40 tracking-widest">CONTACT</div>
                    <div className="text-white font-bold">{e.name}</div>
                    <div className="text-white/60">{e.phone}</div>
                    {e.email && <div className="text-white/60">{e.email}</div>}
                  </div>
                  <div>
                    <div className="mono text-[10px] text-white/40 tracking-widest">CITY</div>
                    <div className="text-white/80">{e.city || "—"}</div>
                  </div>
                  <div>
                    <div className="mono text-[10px] text-white/40 tracking-widest">PRODUCT</div>
                    <div className="text-white/80">{e.product_name || "General"}</div>
                  </div>
                  <div>
                    <div className="mono text-[10px] text-white/40 tracking-widest">MESSAGE</div>
                    <div className="text-white/70 line-clamp-2">{e.message}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <select
                    value={e.status}
                    onChange={(ev) => updateEnq(e.id, ev.target.value)}
                    className="bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] px-3 py-2 text-xs text-white outline-none rounded-none mono uppercase"
                    data-testid={`enq-status-${e.id}`}
                  >
                    <option value="new">NEW</option>
                    <option value="in_progress">IN PROGRESS</option>
                    <option value="closed">CLOSED</option>
                  </select>
                  <button onClick={() => deleteEnq(e.id)} className="p-2 border border-[color:var(--ne-border)] hover:border-red-500 hover:text-red-500 text-white/50" data-testid={`enq-delete-${e.id}`}>
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "products" && (
          <>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search product name…"
                  className="w-full bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-11 py-2.5 text-sm text-white placeholder-white/40 outline-none rounded-none"
                  data-testid="admin-product-search"
                />
              </div>
              <select value={brandFilter} onChange={(e) => setBrandFilter(e.target.value)}
                className="bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-3 py-2 text-sm text-white outline-none rounded-none min-w-[180px]"
                data-testid="admin-product-brand-filter">
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
              </select>
              <button onClick={() => { setEditProduct(null); setShowProductForm(true); }} className="ne-btn-primary" data-testid="admin-add-product">
                <Plus className="w-4 h-4" /> New Product
              </button>
            </div>
            <div className="overflow-x-auto border border-[color:var(--ne-border)]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[color:var(--ne-surface-2)] mono text-[10px] tracking-widest uppercase text-white/50">
                    <th className="text-left px-4 py-3">Image</th>
                    <th className="text-left px-4 py-3">Product</th>
                    <th className="text-left px-4 py-3">Brand</th>
                    <th className="text-left px-4 py-3">Category</th>
                    <th className="text-right px-4 py-3">Price</th>
                    <th className="text-center px-4 py-3">Stock</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="border-t border-[color:var(--ne-border)] hover:bg-white/5" data-testid={`admin-product-row-${p.id}`}>
                      <td className="px-4 py-2">
                        {p.image ? <img src={p.image} alt="" className="w-12 h-12 object-cover" /> : <div className="w-12 h-12 bg-[color:var(--ne-surface-2)]" />}
                      </td>
                      <td className="px-4 py-3 text-white">{p.name}</td>
                      <td className="px-4 py-3 text-white/70 mono text-xs uppercase">{p.brand_slug}</td>
                      <td className="px-4 py-3 text-white/70">{p.category}</td>
                      <td className="px-4 py-3 text-right text-[color:var(--ne-accent)] font-bold">₹{p.price.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`mono text-[10px] tracking-widest ${p.in_stock ? "text-green-400" : "text-red-400"}`}>
                          {p.in_stock ? "● IN" : "○ OUT"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setEditProduct(p); setShowProductForm(true); }}
                            className="p-1.5 border border-[color:var(--ne-border)] hover:border-[color:var(--ne-accent)] text-white/70 hover:text-[color:var(--ne-accent)]"
                            data-testid={`admin-product-edit-${p.id}`}>
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => deleteProduct(p.id)}
                            className="p-1.5 border border-[color:var(--ne-border)] hover:border-red-500 text-white/70 hover:text-red-400"
                            data-testid={`admin-product-delete-${p.id}`}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProducts.length === 0 && (
                    <tr><td colSpan={7} className="text-center py-12 mono text-white/40">NO PRODUCTS</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {tab === "brands" && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => { setEditBrand(null); setShowBrandForm(true); }} className="ne-btn-primary" data-testid="admin-add-brand">
                <Plus className="w-4 h-4" /> New Brand
              </button>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {brands.map((b) => (
                <div key={b.id} className="ne-card p-5 flex gap-4" data-testid={`admin-brand-${b.slug}`}>
                  <div className="w-14 h-14 flex items-center justify-center font-black text-black text-sm shrink-0"
                    style={{ background: b.accent_color }}>
                    {b.logo_text}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-white uppercase truncate">{b.name}</div>
                    <div className="mono text-[10px] text-white/40 tracking-widest">{b.category.toUpperCase()} · /{b.slug}</div>
                    <div className="text-xs text-white/60 mt-1 line-clamp-2">{b.tagline}</div>
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => { setEditBrand(b); setShowBrandForm(true); }}
                        className="mono text-[10px] tracking-widest uppercase text-white/60 hover:text-[color:var(--ne-accent)] flex items-center gap-1"
                        data-testid={`admin-brand-edit-${b.slug}`}>
                        <Pencil className="w-3 h-3" /> Edit
                      </button>
                      <button onClick={() => deleteBrand(b.id)}
                        className="mono text-[10px] tracking-widest uppercase text-white/60 hover:text-red-400 flex items-center gap-1"
                        data-testid={`admin-brand-delete-${b.slug}`}>
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showProductForm && (
        <ProductForm initial={editProduct} brands={brands} onClose={closeProductForm} onSaved={load} />
      )}
      {showBrandForm && (
        <BrandForm initial={editBrand} onClose={closeBrandForm} onSaved={load} />
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, val, accent, testid }) {
  return (
    <div className={`ne-card p-5 ${accent ? "border-[color:var(--ne-accent)]/40" : ""}`} data-testid={testid}>
      <Icon className={`w-5 h-5 mb-3 ${accent ? "text-[color:var(--ne-accent)]" : "text-white/50"}`} strokeWidth={1.5} />
      <div className="text-3xl font-black text-white">{val}</div>
      <div className="mono text-[10px] text-white/50 tracking-widest uppercase">{label}</div>
    </div>
  );
}
