import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import BrandLogo from "@/components/BrandLogo";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", city: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(async (r) => {
      setProduct(r.data);
      const b = await api.get(`/brands/${r.data.brand_slug}`);
      setBrand(b.data);
    }).catch(() => {});
  }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/enquiries", {
        ...form,
        product_id: product.id,
        product_name: product.name,
        brand_slug: product.brand_slug,
      });
      toast.success("Enquiry sent! Our team will call you shortly.");
      setForm({ name: "", phone: "", email: "", city: "", message: "" });
    } catch (e) {
      toast.error("Could not send enquiry. Please try calling us.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return <div className="min-h-screen flex items-center justify-center text-white/50 mono">LOADING…</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12" data-testid="product-detail-page">
      <Link to={`/brands/${product.brand_slug}`} className="mono text-xs text-white/40 tracking-widest hover:text-[color:var(--ne-accent)] flex items-center gap-2 mb-8">
        <ArrowLeft className="w-3 h-3" /> BACK TO {brand?.name?.toUpperCase()}
      </Link>

      <div className="grid lg:grid-cols-12 gap-10">
        <div className="lg:col-span-6">
          <div className="aspect-square border border-[color:var(--ne-border)] overflow-hidden bg-black">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-6">
          {brand && (
            <div className="flex items-center gap-3 mb-4">
              <BrandLogo brand={brand} className="w-10 h-10" textClass="text-xs" />
              <div>
                <div className="text-white font-bold text-sm">{brand.name}</div>
                <div className="mono text-[10px] text-white/40 tracking-widest">{product.category.toUpperCase()} · {product.sub_category?.toUpperCase()}</div>
              </div>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight">{product.name}</h1>

          <div className="mt-6 flex items-baseline gap-3 pb-6 border-b border-[color:var(--ne-border)]">
            <div className="text-4xl font-black text-[color:var(--ne-accent)]">₹{product.price.toLocaleString()}</div>
            <div className="mono text-xs text-white/40">/ {product.unit.toUpperCase()}</div>
            {product.in_stock && (
              <div className="ml-auto mono text-[10px] text-green-400 tracking-widest border border-green-400/40 px-2 py-1">
                ● IN STOCK
              </div>
            )}
          </div>

          <p className="mt-6 text-white/70 leading-relaxed">{product.description}</p>

          <div className="mt-8">
            <div className="overline mb-4">// Key Features</div>
            <ul className="space-y-2">
              {product.features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-white/80">
                  <Check className="w-4 h-4 text-[color:var(--ne-accent)] mt-1 shrink-0" strokeWidth={3} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href="tel:+918373052508" className="ne-btn-primary" data-testid="product-call-btn">
              <Phone className="w-4 h-4" /> Call to Order
            </a>
            <a
              href={`https://wa.me/918373052508?text=${encodeURIComponent(`Hi, I'm interested in ${product.name} (${brand?.name}). Please share availability.`)}`}
              target="_blank"
              rel="noreferrer"
              className="ne-btn-ghost"
              data-testid="product-whatsapp-btn"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Enquiry Form */}
      <div className="mt-20 border-t border-[color:var(--ne-border)] pt-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="overline mb-3">// Get a Quote</div>
            <h2 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight">
              Request a <span className="text-[color:var(--ne-accent)]">Callback</span>
            </h2>
            <p className="mt-4 text-white/60">
              Share your details — we'll confirm pricing, availability and delivery options within one business day.
            </p>
          </div>
          <form onSubmit={submit} className="lg:col-span-7 space-y-4" data-testid="product-enquiry-form">
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required testid="enq-name" />
              <Input label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required testid="enq-phone" />
              <Input label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} testid="enq-email" />
              <Input label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} testid="enq-city" />
            </div>
            <div>
              <label className="mono text-[10px] tracking-widest text-white/50 uppercase">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                data-testid="enq-message"
                className="mt-1 w-full bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
              />
            </div>
            <button type="submit" disabled={submitting} className="ne-btn-primary disabled:opacity-60" data-testid="enq-submit">
              {submitting ? "SENDING…" : "Submit Enquiry"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, required, testid }) {
  return (
    <div>
      <label className="mono text-[10px] tracking-widest text-white/50 uppercase">{label}{required && " *"}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        data-testid={testid}
        className="mt-1 w-full bg-[color:var(--ne-surface)] border border-[color:var(--ne-border)] focus:border-[color:var(--ne-accent)] px-4 py-3 text-white outline-none rounded-none"
      />
    </div>
  );
}
