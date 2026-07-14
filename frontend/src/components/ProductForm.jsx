import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

const EMPTY_PRODUCT = {
  brand_slug: "",
  name: "",
  category: "",
  sub_category: "",
  price: 0,
  unit: "pc",
  image: "",
  features: [],
  description: "",
  in_stock: true,
};

export default function ProductForm({ product, brands, onClose, onSaved }) {
  const isEdit = !!product?.id;
  const [form, setForm] = useState(product || EMPTY_PRODUCT);
  const [featuresText, setFeaturesText] = useState((product?.features || []).join("\n"));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setForm(product || EMPTY_PRODUCT);
    setFeaturesText((product?.features || []).join("\n"));
  }, [product]);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        features: featuresText.split("\n").map((s) => s.trim()).filter(Boolean),
      };
      if (isEdit) {
        await api.put(`/products/${product.id}`, payload);
        toast.success("Product updated");
      } else {
        await api.post("/products", payload);
        toast.success("Product created");
      }
      onSaved();
      onClose();
    } catch (err) {
      const msg = err?.response?.data?.detail;
      toast.error(typeof msg === "string" ? msg : "Save failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" data-testid="product-form-modal">
      <div className="bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[color:var(--ne-surface)] flex items-center justify-between px-6 py-4 border-b border-[color:var(--ne-border)]">
          <div>
            <div className="overline">// {isEdit ? "Edit" : "Create"} Product</div>
            <h3 className="text-xl font-black uppercase text-white mt-1">{isEdit ? form.name : "New Product"}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:text-[color:var(--ne-accent)]" data-testid="pform-close"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Product Name *" value={form.name} onChange={(v) => upd("name", v)} required testid="pf-name" />
            <Select label="Brand *" value={form.brand_slug} onChange={(v) => upd("brand_slug", v)} required testid="pf-brand">
              <option value="">Select brand…</option>
              {brands.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
            </Select>
            <Field label="Category *" value={form.category} onChange={(v) => upd("category", v)} required testid="pf-category" />
            <Field label="Sub-Category" value={form.sub_category} onChange={(v) => upd("sub_category", v)} testid="pf-sub" />
            <Field label="Price (₹) *" type="number" value={form.price} onChange={(v) => upd("price", v)} required testid="pf-price" />
            <Field label="Unit" value={form.unit} onChange={(v) => upd("unit", v)} testid="pf-unit" />
          </div>
          <Field label="Image URL" value={form.image} onChange={(v) => upd("image", v)} testid="pf-image" />
          <div>
            <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Features (one per line)</label>
            <textarea
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              rows={4}
              data-testid="pf-features"
              className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
            />
          </div>
          <div>
            <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => upd("description", e.target.value)}
              rows={3}
              data-testid="pf-desc"
              className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
            />
          </div>
          <label className="flex items-center gap-3 text-white/80 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.in_stock}
              onChange={(e) => upd("in_stock", e.target.checked)}
              className="w-4 h-4 accent-[color:var(--ne-accent)]"
              data-testid="pf-instock"
            />
            In Stock
          </label>
          <div className="flex gap-3 pt-4 border-t border-[color:var(--ne-border)]">
            <button type="submit" disabled={busy} className="ne-btn-primary disabled:opacity-60" data-testid="pf-save">
              {busy ? "SAVING…" : isEdit ? "Update Product" : "Create Product"}
            </button>
            <button type="button" onClick={onClose} className="ne-btn-ghost" data-testid="pf-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required, testid }) {
  return (
    <div>
      <label className="mono text-[10px] tracking-widest text-white/50 uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        data-testid={testid}
        className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
      />
    </div>
  );
}

function Select({ label, value, onChange, required, testid, children }) {
  return (
    <div>
      <label className="mono text-[10px] tracking-widest text-white/50 uppercase">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        data-testid={testid}
        className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
      >
        {children}
      </select>
    </div>
  );
}
