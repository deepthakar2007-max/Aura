import { useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "react-inner-image-zoom/lib/styles.min.css";

export default function ProductGallery({ images, img, badge }) {
  const thumbs = images && images.length ? images : [img, img, img, img];
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="relative aspect-square bg-cream overflow-hidden mb-3">
        {badge && (
          <span className="absolute top-4 left-4 bg-accent text-ink text-[10px] tracking-widest uppercase px-3 py-1 z-10">
            {badge}
          </span>
        )}

        <InnerImageZoom
          src={thumbs[active]}
          zoomSrc={thumbs[active]}
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
