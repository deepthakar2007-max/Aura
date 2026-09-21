import { useEffect, useState } from "react";
import { getProducts } from "../../api/productApi";
import ProductCard from "../product/ProductCard";
import StaggerContainer from "../animations/StaggerContainer";
import ScrollReveal from "../animations/ScrollReveal";

const TABS = ["All", "men", "women", "electronics", "accessories"];

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    const query = tab === "All" ? "" : `?category=${tab}`;
    getProducts(query)
      .then((res) => setProducts(res.data.slice(0, 4)))
      .catch(() => {});
  }, [tab]);

  return (
    <section className="max-w-7xl mx-auto px-8 py-20">
      <ScrollReveal>
        <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-accent mb-2">
              Handpicked Selection
            </p>
            <h2 className="font-display text-3xl text-ink">
              New Arrivals & Icons
            </h2>
          </div>
          <div className="flex gap-1 bg-cream rounded-full p-1">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-xs capitalize px-4 py-1.5 rounded-full transition-colors ${
                  tab === t ? "bg-ink text-white" : "text-ink/60 hover:text-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </StaggerContainer>
    </section>
  );
}
