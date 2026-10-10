import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import ProductCard from "./ProductCard";
import ScrollReveal from "../animations/ScrollReveal";

export default function RelatedProducts({ category, excludeId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getProducts(`?category=${encodeURIComponent(category)}`)
      .then((res) =>
        setItems(res.data.filter((p) => p._id !== excludeId).slice(0, 3)),
      )
      .catch(() => {});
  }, [category, excludeId]);

  if (!items.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
      <ScrollReveal>
        <p className="text-xs tracking-widest uppercase text-accent mb-2">
          Curated Matches
        </p>
        <h2 className="font-display text-2xl text-ink mb-8">
          Complete the Collection
        </h2>
      </ScrollReveal>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {items.map((p, i) => (
          <ProductCard key={p._id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}
