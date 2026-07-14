import Marquee from "react-fast-marquee";
import BrandLogo from "@/components/BrandLogo";

export default function BrandMarquee({ brands }) {
  if (!brands?.length) return null;
  return (
    <section className="border-y border-[color:var(--ne-border)] bg-[color:var(--ne-surface)] py-6 marquee-fade" data-testid="brand-marquee">
      <Marquee gradient={false} speed={40} pauseOnHover>
        {brands.map((b) => (
          <div key={b.id} className="mx-8 flex items-center gap-3 opacity-75 hover:opacity-100 transition-opacity">
            <BrandLogo brand={b} className="w-11 h-11" textClass="text-xs" />
            <div className="font-bold uppercase tracking-wider text-white/90 text-sm whitespace-nowrap">
              {b.name}
            </div>
          </div>
        ))}
      </Marquee>
    </section>
  );
}
