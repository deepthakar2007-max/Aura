import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBanners } from "../../api/bannerApi";

const FALLBACK = {
  title: "The Sovereign Gold Chronograph",
  storyText:
    "An exclusive allocation of 50 pieces worldwide, featuring an 18k solid yellow gold case and handcrafted alligator leather strap.",
  image:
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80",
  objectPosition: "center",
  link: "/shop",
};

function useCountdown(target) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  return time;
}

export default function LimitedPromo() {
  const [promo, setPromo] = useState(FALLBACK);
  const target = useState(() => Date.now() + 3 * 86400000 + 14 * 3600000)[0];
  const { d, h, m, s } = useCountdown(target);

  useEffect(() => {
    getBanners("promo")
      .then((res) => {
        if (res.data[0]) setPromo({ ...FALLBACK, ...res.data[0] });
      })
      .catch(() => {});
  }, []);

  const pad = (n) => String(n).padStart(2, "0");
  const isExternal = /^https?:\/\//i.test(promo.link || "");

  const buttonClass =
    "inline-block mt-8 bg-ink text-white text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-ink/80 transition-colors";

  return (
    <section className="bg-cream/60">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-accent/20 text-accent text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Limited Edition Release
          </span>
          <h2 className="font-display text-3xl text-ink leading-tight">
            {promo.title}
          </h2>
          <p className="text-ink/60 text-sm mt-4 max-w-md leading-relaxed">
            {promo.storyText}
          </p>

          <div className="flex gap-3 sm:gap-4 mt-8">
            {[
              ["Days", d],
              ["Hours", h],
              ["Mins", m],
              ["Secs", s],
            ].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-ink text-white flex items-center justify-center font-display text-xl sm:text-2xl">
                  {pad(val)}
                </div>
                <p className="text-[10px] tracking-widest uppercase text-ink/50 mt-2">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {isExternal ? (
            <a href={promo.link} className={buttonClass}>
              Explore the Release
            </a>
          ) : (
            <Link to={promo.link || "/shop"} className={buttonClass}>
              Explore the Release
            </Link>
          )}
        </div>

        <div className="bg-white p-3">
          <div className="aspect-[4/3] overflow-hidden">
            <img
              src={promo.image}
              alt={promo.title}
              style={{ objectPosition: promo.objectPosition || "center" }}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex justify-between items-center px-2 py-3">
            <p className="text-sm font-medium text-ink truncate">
              {promo.title}
            </p>
            <p className="text-xs tracking-widest uppercase text-accent flex-shrink-0 ml-3">
              Limited
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
