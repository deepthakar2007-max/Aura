import { useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";
import { getProducts } from "../api/productApi";
import CategoryGrid from "../components/category/CategoryGrid";
import ProductCard from "../components/product/ProductCard";
import FadeUp from "../components/animations/FadeUp";
import ScrollReveal from "../components/animations/ScrollReveal";
import StaggerContainer from "../components/animations/StaggerContainer";

export default function CategoryPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError("");
    const query = selected ? `?category=${selected}` : "";
    getProducts(query)
      .then((res) => setProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selected]);

  const activeCategory = categories.find((c) => c.name === selected);

  return (
    <FadeUp>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-brandDark mb-6">
          Browse by category
        </h1>
        <CategoryGrid
          categories={categories}
          selected={selected}
          onSelect={setSelected}
        />

        {activeCategory && (
          <ScrollReveal>
            <div className="mb-8">
              <h2 className="font-display text-2xl text-brandDark capitalize">
                {activeCategory.name}
              </h2>
              <p className="text-ink/60 mt-1">{activeCategory.description}</p>
            </div>
          </ScrollReveal>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-ink/5 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-16">{error}</p>
        ) : !products.length ? (
          <p className="text-ink/50 text-center py-16">No products found.</p>
        ) : (
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </StaggerContainer>
        )}
      </div>
    </FadeUp>
  );
}
