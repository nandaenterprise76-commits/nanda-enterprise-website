import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

const CATEGORIES = ["Lubricants", "Batteries", "Tyres", "Spare Parts", "Filters", "Bearings", "Car Care"];

export function ProductForm({ initial, brands, onClose, onSaved }) {
  const [f, setF] = useState(
    initial || {
      brand_slug: brands[0]?.slug || "",
      name: "",
      category: brands[0]?.category || "Spare Parts",
      sub_category: "",
      price: 0,
      unit: "pc",
      image: "",
      features: [],
      description: "",
      in_stock: true,
    }
  );
  const [featTxt, setFeatTxt] = useState((initial?.features || []).join("\n"));
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...f, price: Number(f.price), features: featTxt.split("\n").map((s) => s.trim()).filter(Boolean) };
      if (initial?.id) {
        await api.put(`/products/${initial.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={initial?.id ? "Edit Product" : "New Product"} onClose={onClose}>
      <form onSubmit={save} className="space-y-4" data-testid="product-form">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name *">
            <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })}
              className="admin-input" data-testid="pf-name" />
          </Field>
          <Field label="Brand *">
            <select required value={f.brand_slug} onChange={(e) => {
              const b = brands.find((x) => x.slug === e.target.value);
              setF({ ...f, brand_slug: e.target.value, category: b?.category || f.category });
            }} className="admin-input" data-testid="pf-brand">
              {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </select>
          </Field>
          <Field label="Category *">
            <select required value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}
              className="admin-input" data-testid="pf-category">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Sub-Category">
            <input value={f.sub_category} onChange={(e) => setF({ ...f, sub_category: e.target.value })}
              className="admin-input" data-testid="pf-subcat" />
          </Field>
          <Field label="Price (₹) *">
            <input type="number" required min="0" step="0.01" value={f.price}
              onChange={(e) => setF({ ...f, price: e.target.value })} className="admin-input" data-testid="pf-price" />
          </Field>
          <Field label="Unit">
            <input value={f.unit} onChange={(e) => setF({ ...f, unit: e.target.value })}
              className="admin-input" data-testid="pf-unit" />
          </Field>
        </div>
        <Field label="Image URL">
          <input value={f.image} onChange={(e) => setF({ ...f, image: e.target.value })}
            placeholder="https://…" className="admin-input" data-testid="pf-image" />
        </Field>
        <Field label="Description">
          <textarea rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })}
            className="admin-input" data-testid="pf-desc" />
        </Field>
        <Field label="Features (one per line)">
          <textarea rows={4} value={featTxt} onChange={(e) => setFeatTxt(e.target.value)}
            className="admin-input" data-testid="pf-features" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-white/80">
          <input type="checkbox" checked={f.in_stock} onChange={(e) => setF({ ...f, in_stock: e.target.checked })}
            className="accent-[color:var(--ne-accent)]" data-testid="pf-instock" />
          In Stock
        </label>
        <div className="flex gap-3 pt-2 border-t border-[color:var(--ne-border)]">
          <button type="submit" disabled={busy} className="ne-btn-primary" data-testid="pf-save">
            {busy ? "SAVING…" : "Save"}
          </button>
          <button type="button" onClick={onClose} className="ne-btn-ghost">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

export function BrandForm({ initial, onClose, onSaved }) {
  const [f, setF] = useState(
    initial || {
      slug: "",
      name: "",
      tagline: "",
      category: "Spare Parts",
      description: "",
      logo_text: "",
      hero_image: "",
      accent_color: "#FF9F1C",
    }
  );
  const [busy, setBusy] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (initial?.id) {
        await api.put(`/brands/${initial.id}`, f);
        toast.success("Brand updated");
      } else {
        await api.post("/brands", f);
        toast.success("Brand created");
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={initial?.id ? "Edit Brand" : "New Brand"} onClose={onClose}>
      <form onSubmit={save} className="space-y-4" data-testid="brand-form">
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Name *">
            <input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })}
              className="admin-input" data-testid="bf-name" />
          </Field>
          <Field label="Slug * (url-safe, lowercase)">
            <input required value={f.slug} disabled={!!initial?.id}
              onChange={(e) => setF({ ...f, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
              className="admin-input" data-testid="bf-slug" />
          </Field>
          <Field label="Category *">
            <select required value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })}
              className="admin-input" data-testid="bf-category">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Logo Text (3-4 chars)">
            <input value={f.logo_text} maxLength={4}
              onChange={(e) => setF({ ...f, logo_text: e.target.value.toUpperCase() })}
              className="admin-input" data-testid="bf-logotext" />
          </Field>
          <Field label="Accent Color">
            <div className="flex gap-2 items-center">
              <input type="color" value={f.accent_color}
                onChange={(e) => setF({ ...f, accent_color: e.target.value })}
                className="w-12 h-10 bg-transparent border border-[color:var(--ne-border)]"
                data-testid="bf-color" />
              <input value={f.accent_color} onChange={(e) => setF({ ...f, accent_color: e.target.value })}
                className="admin-input flex-1" />
            </div>
          </Field>
          <Field label="Hero Image URL">
            <input value={f.hero_image} onChange={(e) => setF({ ...f, hero_image: e.target.value })}
              className="admin-input" data-testid="bf-hero" />
          </Field>
        </div>
        <Field label="Tagline">
          <input value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })}
            className="admin-input" data-testid="bf-tagline" />
        </Field>
        <Field label="Description">
          <textarea rows={3} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })}
            className="admin-input" data-testid="bf-desc" />
        </Field>
        <div className="flex gap-3 pt-2 border-t border-[color:var(--ne-border)]">
          <button type="submit" disabled={busy} className="ne-btn-primary" data-testid="bf-save">
            {busy ? "SAVING…" : "Save"}
          </button>
          <button type="button" onClick={onClose} className="ne-btn-ghost">Cancel</button>
        </div>
      </form>
    </Modal>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 md:p-10 overflow-y-auto">
      <div className="w-full max-w-3xl bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] my-auto" data-testid="admin-modal">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--ne-border)]">
          <div>
            <div className="overline">// Console</div>
            <h3 className="text-xl font-black uppercase text-white">{title}</h3>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white p-2" data-testid="admin-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="mono text-[10px] tracking-widest text-white/50 uppercase block mb-1">{label}</label>
      {children}
    </div>
  );
}
