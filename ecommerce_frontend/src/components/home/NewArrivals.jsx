import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw } from "lucide-react";
import { getProducts } from "../../api/productApi";
import ProductCard from "../product/ProductCard";
import ScrollReveal from "../animations/ScrollReveal";

export default function NewArrivals() {
  const [state, setState] = useState({ status: "loading", items: [] });
  const [tab, setTab] = useState("All");

  const load = useCallback(() => {
    setState((s) => ({ ...s, status: "loading" }));
    getProducts()
      .then((res) => setState({ status: "ready", items: res.data }))
      .catch(() => setState({ status: "error", items: [] }));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const tabs = useMemo(
    () => ["All", ...new Set(state.items.map((p) => p.category))],
    [state.items],
  );

  const shown = useMemo(
    () =>
      [...state.items]
        .filter((p) => tab === "All" || p.category === tab)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4),
    [state.items, tab],
  );

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-accent mb-2">
              Handpicked Selection
            </p>
            <h2 className="font-display text-3xl text-ink">
              New Arrivals & Icons
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-ink group"
          >
            View all{" "}
            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {state.status === "ready" && tabs.length > 1 && (
          <div className="flex gap-1 bg-cream rounded-full p-1 mb-8 w-full sm:w-fit overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs capitalize whitespace-nowrap px-4 py-1.5 rounded-full transition-colors ${
                  tab === t ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </ScrollReveal>

      {state.status === "loading" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-square bg-ink/5 animate-pulse" />
              <div className="h-3 w-1/3 bg-ink/5 animate-pulse mt-4" />
              <div className="h-4 w-3/4 bg-ink/5 animate-pulse mt-2" />
            </div>
          ))}
        </div>
      )}

      {state.status === "error" && (
        <div className="text-center py-12">
          <p className="text-ink/60 text-sm mb-4">
            We couldn't load the products.
          </p>
          <button
            onClick={load}
            className="inline-flex items-center gap-2 border border-ink/20 text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-cream transition-colors"
          >
            <RotateCcw size={14} /> Try again
          </button>
        </div>
      )}

      {state.status === "ready" && (
        <div
          key={tab}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6"
        >
          {shown.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      )}
    </section>
  );
}
