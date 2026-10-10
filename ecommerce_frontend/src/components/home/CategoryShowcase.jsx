import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { getCategories } from "../../api/categoryApi";

export default function CategoryShowcase() {
  const [state, setState] = useState({ status: "loading", items: [] });

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    getCategories()
      .then((res) =>
        setState({
          status: "ready",
          items: res.data.filter((c) => c.status !== "inactive"),
        }),
      )
      .catch(() => setState({ status: "error", items: [] }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "ready" && !state.items.length) return null;

  return (
    <section className="bg-ink py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-accent mb-2">
              Curated Categories
            </p>
            <h2 className="font-display text-3xl text-white">
              The Masterpieces
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs text-right hidden sm:block">
            Each category represents an intersection of heritage artistry and
            contemporary vision.
          </p>
        </div>

        {state.status === "loading" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        )}

        {state.status === "error" && (
          <div className="text-center py-12">
            <p className="text-white/60 text-sm mb-4">
              We couldn't load the categories.
            </p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 border border-white/30 text-white text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-white/10 transition-colors"
            >
              <RotateCcw size={14} /> Try again
            </button>
          </div>
        )}

        {state.status === "ready" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {state.items.map((cat, idx) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: (idx % 4) * 0.08 },
                }}
                viewport={{ once: true, amount: 0.1 }}
              >
                <Link
                  to={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-xl block bg-white/5"
                >
                  <img
                    src={cat.img}
                    alt={cat.name}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.visibility = "hidden";
                    }}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-2.5">
                      <p className="text-[10px] tracking-widest uppercase text-accent mb-0.5">
                        {String(idx + 1).padStart(2, "0")} / Collection
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-white font-medium capitalize truncate">
                          {cat.name}
                        </p>
                        <ArrowUpRight
                          size={16}
                          className="text-white/70 flex-shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                      {cat.tagline && (
                        <p className="text-[11px] text-white/60 mt-1 truncate">
                          {cat.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
