import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { getProducts } from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import ProductCard from "../components/product/ProductCard";
import ProductFilterSidebar from "../components/product/ProductFilterSidebar";
import StaggerContainer, {
  staggerContainerVariants,
} from "../components/animations/StaggerContainer";
import FadeUp from "../components/animations/FadeUp";

const PER_PAGE = 8;

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedCategories, setSelectedCategories] = useState(
    searchParams.get("category") ? [searchParams.get("category")] : [],
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(10000);
  const [page, setPage] = useState(1);
  const search = searchParams.get("search") || "";

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then((res) => setAllProducts(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleCategory = (name) => {
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setInStockOnly(false);
    setPriceRange(10000);
    setPage(1);
  };

  const filtered = allProducts.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (selectedCategories.length && !selectedCategories.includes(p.category))
      return false;
    if (inStockOnly && p.stock === 0) return false;
    if (p.price > priceRange) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const filterKey = `${selectedCategories.join(",")}-${inStockOnly}-${priceRange}-${page}-${search}`;

  return (
    <FadeUp>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <p className="text-xs text-ink/40 mb-2">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>{" "}
          › Collections ›{" "}
          <span className="font-medium text-ink">All Goods</span>
        </p>
        <div className="flex items-end justify-between flex-wrap gap-3 mb-10">
          <h1 className="font-display text-4xl text-ink">Curated Inventory</h1>
          <p className="text-sm text-ink/50">
            Showing {paginated.length ? (page - 1) * PER_PAGE + 1 : 0}–
            {(page - 1) * PER_PAGE + paginated.length} of {filtered.length}{" "}
            items
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <ProductFilterSidebar
            categories={categories}
            selectedCategories={selectedCategories}
            onToggleCategory={toggleCategory}
            inStockOnly={inStockOnly}
            onToggleInStock={() => {
              setInStockOnly((v) => !v);
              setPage(1);
            }}
            priceRange={priceRange}
            onPriceChange={(v) => {
              setPriceRange(v);
              setPage(1);
            }}
            onReset={resetFilters}
          />

          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="aspect-square bg-ink/5 rounded-xl"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-500 text-center py-16">{error}</p>
            ) : !filtered.length ? (
              <p className="text-ink/50 text-center py-16">
                No products match your filters.
              </p>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={filterKey}
                    variants={staggerContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6"
                  >
                    {paginated.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </motion.div>
                </AnimatePresence>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-12">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="text-sm text-ink/60 hover:text-ink disabled:opacity-30"
                    >
                      ← Previous
                    </button>
                    <div className="flex gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (n) => (
                          <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={`w-8 h-8 rounded-full text-sm ${
                              page === n
                                ? "bg-ink text-white"
                                : "text-ink/60 hover:bg-cream"
                            }`}
                          >
                            {n}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                      className="text-sm text-ink/60 hover:text-ink disabled:opacity-30"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
