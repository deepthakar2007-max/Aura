import { useState } from "react";

export default function ProductGallery({ img, badge }) {
  const [active, setActive] = useState(0);
  const thumbs = [img, img, img, img];

  return (
    <div>
      <div className="relative aspect-square bg-cream overflow-hidden mb-3">
        {badge && (
          <span className="absolute top-4 left-4 bg-accent text-ink text-[10px] tracking-widest uppercase px-3 py-1 z-10">
            {badge}
          </span>
        )}
        <img
          src={thumbs[active]}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {thumbs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`aspect-square overflow-hidden border-2 transition-colors ${
              active === i ? "border-ink" : "border-transparent"
            }`}
          >
            <img src={t} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
