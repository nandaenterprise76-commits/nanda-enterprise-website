import { useEffect, useState } from "react";
import { X } from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";

const EMPTY = {
  slug: "",
  name: "",
  tagline: "",
  category: "Spare Parts",
  description: "",
  logo_text: "",
  logo_image: "",
  accent_color: "#FF9F1C",
};

const CATEGORIES = ["Lubricants", "Batteries", "Tyres", "Spare Parts", "Filters", "Bearings", "Car Care"];

export default function BrandForm({ brand, onClose, onSaved }) {
  const isEdit = !!brand?.id;
  const [form, setForm] = useState(brand || EMPTY);
  const [busy, setBusy] = useState(false);

  useEffect(() => setForm(brand || EMPTY), [brand]);

  const upd = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form };
      if (isEdit) {
        await api.put(`/brands/${brand.id}`, payload);
        toast.success("Brand updated");
      } else {
        await api.post("/brands", payload);
        toast.success("Brand created");
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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4" data-testid="brand-form-modal">
      <div className="bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[color:var(--ne-surface)] flex items-center justify-between px-6 py-4 border-b border-[color:var(--ne-border)]">
          <div>
            <div className="overline">// {isEdit ? "Edit" : "Create"} Brand</div>
            <h3 className="text-xl font-black uppercase text-white mt-1">{isEdit ? form.name : "New Brand"}</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:text-[color:var(--ne-accent)]" data-testid="bform-close"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Brand Name *" value={form.name} onChange={(v) => upd("name", v)} required testid="bf-name" />
            <Field label="Slug (url) *" value={form.slug} onChange={(v) => upd("slug", v.toLowerCase().replace(/\s+/g,'-'))} required disabled={isEdit} testid="bf-slug" />
            <Field label="Tagline" value={form.tagline} onChange={(v) => upd("tagline", v)} testid="bf-tagline" />
            <div>
              <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Category *</label>
              <select
                value={form.category}
                onChange={(e) => upd("category", e.target.value)}
                required
                data-testid="bf-category"
                className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Field label="Logo Initials (2-4 chars)" value={form.logo_text} onChange={(v) => upd("logo_text", v.toUpperCase().slice(0, 4))} testid="bf-logotext" />
            <div>
              <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Accent Color</label>
              <input
                type="color"
                value={form.accent_color}
                onChange={(e) => upd("accent_color", e.target.value)}
                data-testid="bf-color"
                className="mt-1 w-full h-[46px] bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] cursor-pointer rounded-none"
              />
            </div>
          </div>
          <Field label="Logo Image URL" value={form.logo_image} onChange={(v) => upd("logo_image", v)} testid="bf-logo-image" />
          <div>
            <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => upd("description", e.target.value)}
              rows={4}
              data-testid="bf-desc"
              className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
            />
          </div>
          <div className="flex gap-3 pt-4 border-t border-[color:var(--ne-border)]">
            <button type="submit" disabled={busy} className="ne-btn-primary disabled:opacity-60" data-testid="bf-save">
              {busy ? "SAVING…" : isEdit ? "Update Brand" : "Create Brand"}
            </button>
            <button type="button" onClick={onClose} className="ne-btn-ghost" data-testid="bf-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, required, testid, disabled }) {
  return (
    <div>
      <label className="mono text-[10px] tracking-widest text-white/50 uppercase">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
        data-testid={testid}
        className="mt-1 w-full bg-[color:var(--ne-surface-2)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none disabled:opacity-50"
      />
    </div>
  );
}
