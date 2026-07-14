import { useState } from "react";

/**
 * Renders a brand logo image with graceful fallback to a coloured
 * initials-tile. Size is controlled via className (must set width/height).
 */
export default function BrandLogo({ brand, className = "w-12 h-12", textClass = "text-sm" }) {
  const [err, setErr] = useState(false);
  const showImg = brand?.logo_image && !err;

  if (showImg) {
    return (
      <div className={`${className} bg-white flex items-center justify-center overflow-hidden shrink-0 border border-white/10`}>
        <img
          src={brand.logo_image}
          alt={brand.name}
          onError={() => setErr(true)}
          className="w-[70%] h-[70%] object-contain"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center font-black text-black tracking-wider shrink-0 ${textClass}`}
      style={{ background: brand?.accent_color || "#FF9F1C" }}
    >
      {brand?.logo_text || "NE"}
    </div>
  );
}
