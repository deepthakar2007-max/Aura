import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
  const target = useState(() => Date.now() + 3 * 86400000 + 14 * 3600000)[0];
  const { d, h, m, s } = useCountdown(target);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <section className="bg-cream/60">
      <div className="max-w-7xl mx-auto px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block bg-accent/20 text-accent text-[10px] tracking-widest uppercase px-3 py-1 rounded-full mb-4">
            Limited Edition Release
          </span>
          <h2 className="font-display text-3xl text-ink leading-tight">
            The Sovereign Gold Chronograph
          </h2>
          <p className="text-ink/60 text-sm mt-4 max-w-md leading-relaxed">
            An exclusive allocation of 50 pieces worldwide, featuring an 18k
            solid yellow gold case and handcrafted alligator leather strap.
          </p>

          <div className="flex gap-4 mt-8">
            {[
              ["Days", d],
              ["Hours", h],
              ["Mins", m],
              ["Secs", s],
            ].map(([label, val]) => (
              <div key={label} className="text-center">
                <div className="w-16 h-16 bg-ink text-white flex items-center justify-center font-display text-2xl">
                  {pad(val)}
                </div>
                <p className="text-[10px] tracking-widest uppercase text-ink/50 mt-2">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <Link
            to="/shop"
            className="inline-block mt-8 bg-ink text-white text-xs tracking-widest uppercase px-6 py-3.5 hover:bg-ink/80 transition-colors"
          >
            Secure Allocation ($24,500)
          </Link>
        </div>

        <div className="bg-white p-3">
          <img
            src="https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800&q=80"
            alt="AURA Chronos Gold"
            className="w-full aspect-[4/3] object-cover"
          />
          <div className="flex justify-between items-center px-2 py-3">
            <p className="text-sm font-medium text-ink">AURA Chronos — Gold</p>
            <p className="text-sm text-accent">$24,500</p>
          </div>
        </div>
      </div>
    </section>
  );
}
