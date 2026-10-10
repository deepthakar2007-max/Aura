import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { getProducts } from "../api/productApi";
import { getCategories } from "../api/categoryApi";
import { searchProducts } from "../utils/search";
import ProductCard from "../components/product/ProductCard";
import ProductFilterSidebar from "../components/product/ProductFilterSidebar";
import FadeUp from "../components/animations/FadeUp";

const PER_PAGE = 8;

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = (searchParams.get("category") || "").toLowerCase();

  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("loading");
  const [selectedCategories, setSelectedCategories] = useState(
    urlCategory ? [urlCategory] : [],
  );
  const [inStockOnly, setInStockOnly] = useState(false);
  const [priceLimit, setPriceLimit] = useState(null);
  const [sort, setSort] = useState("relevance");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState(urlSearch);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const load = useCallback(() => {
    setStatus("loading");
    Promise.all([getProducts(), getCategories().catch(() => ({ data: [] }))])
      .then(([productsRes, categoriesRes]) => {
        setAllProducts(productsRes.data);
        setCategories(categoriesRes.data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    setSelectedCategories(urlCategory ? [urlCategory] : []);
  }, [urlCategory]);
  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  useEffect(() => {
    if (searchInput.trim() === urlSearch) return;
    const timer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          if (searchInput.trim()) next.set("search", searchInput.trim());
          else next.delete("search");
          return next;
        },
        { replace: true },
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, urlSearch, setSearchParams]);

  const maxPrice = useMemo(() => {
    const highest = allProducts.reduce((m, p) => Math.max(m, p.price), 0);
    return highest ? Math.ceil(highest / 500) * 500 : 10000;
  }, [allProducts]);

  const effectivePrice =
    priceLimit === null ? maxPrice : Math.min(priceLimit, maxPrice);

  const results = useMemo(() => {
    let list = urlSearch
      ? searchProducts(allProducts, urlSearch)
      : [...allProducts];

    list = list.filter(
      (p) =>
        (!selectedCategories.length ||
          selectedCategories.includes(String(p.category).toLowerCase())) &&
        (!inStockOnly || p.stock > 0) &&
        p.price <= effectivePrice,
    );

    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "newest")
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return list;
  }, [
    allProducts,
    urlSearch,
    selectedCategories,
    inStockOnly,
    effectivePrice,
    sort,
  ]);

  useEffect(() => {
    setPage(1);
  }, [urlSearch, selectedCategories, inStockOnly, effectivePrice, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const paginated = results.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const goToPage = (n) => {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleCategory = (name) =>
    setSelectedCategories((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name],
    );

  const resetFilters = () => {
    setSelectedCategories([]);
    setInStockOnly(false);
    setPriceLimit(null);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        next.delete("search");
        return next;
      },
      { replace: true },
    );
  };

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
        <div className="flex items-end justify-between flex-wrap gap-2 mb-6">
          <h1 className="font-display text-3xl sm:text-4xl text-ink">
            {urlSearch ? `Results for “${urlSearch}”` : "Curated Inventory"}
          </h1>
          {status === "ready" && (
            <p className="text-sm text-ink/50">
              {results.length
                ? `Showing ${(page - 1) * PER_PAGE + 1}–${(page - 1) * PER_PAGE + paginated.length} of ${results.length} items`
                : "No items"}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search within collection…"
              className="w-full bg-white border border-ink/15 rounded-full pl-11 pr-10 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
            />
            {searchInput && (
              <button
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex-1 sm:flex-none bg-white border border-ink/15 rounded-full px-4 py-2.5 text-sm outline-none"
            >
              <option value="relevance">Sort: Featured</option>
              <option value="newest">Sort: Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <button
              onClick={() => setFiltersOpen((o) => !o)}
              className="md:hidden flex items-center gap-2 border border-ink/15 bg-white rounded-full px-4 py-2.5 text-sm"
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          <div className={`${filtersOpen ? "block" : "hidden"} md:block`}>
            <ProductFilterSidebar
              categories={categories}
              selectedCategories={selectedCategories}
              onToggleCategory={toggleCategory}
              inStockOnly={inStockOnly}
              onToggleInStock={() => setInStockOnly((v) => !v)}
              priceRange={effectivePrice}
              maxPrice={maxPrice}
              onPriceChange={setPriceLimit}
              onReset={resetFilters}
            />
          </div>

          <div className="flex-1 min-w-0">
            {status === "loading" && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i}>
                    <div className="aspect-square bg-ink/5 animate-pulse" />
                    <div className="h-3 w-1/3 bg-ink/5 animate-pulse mt-4" />
                    <div className="h-4 w-3/4 bg-ink/5 animate-pulse mt-2" />
                  </div>
                ))}
              </div>
            )}

            {status === "error" && (
              <div className="text-center py-16">
                <p className="text-ink/60 mb-4">
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

            {status === "ready" && !results.length && (
              <div className="text-center py-16">
                <p className="font-display text-2xl text-ink mb-2">
                  {urlSearch
                    ? `No results for “${urlSearch}”`
                    : "No products match your filters"}
                </p>
                <p className="text-ink/50 text-sm mb-6">
                  Try a different keyword or browse a category.
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {categories.map((c) => (
                    <Link
                      key={c._id}
                      to={`/shop?category=${encodeURIComponent(c.name)}`}
                      className="px-4 py-2 rounded-full border border-ink/15 text-xs capitalize hover:bg-ink hover:text-white transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
                <button
                  onClick={() => {
                    clearSearch();
                    resetFilters();
                  }}
                  className="text-sm text-brandDark underline"
                >
                  Clear search and filters
                </button>
              </div>
            )}

            {status === "ready" && results.length > 0 && (
              <>
                <div
                  key={`${urlSearch}-${selectedCategories.join(",")}-${inStockOnly}-${effectivePrice}-${sort}-${page}`}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
                >
                  {paginated.map((p, i) => (
                    <ProductCard key={p._id} product={p} index={i} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between gap-2 mt-12">
                    <button
                      onClick={() => goToPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="text-sm text-ink/60 hover:text-ink disabled:opacity-30"
                    >
                      ← Prev
                    </button>
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (n) => (
                          <button
                            key={n}
                            onClick={() => goToPage(n)}
                            className={`w-8 h-8 rounded-full text-sm ${page === n ? "bg-ink text-white" : "text-ink/60 hover:bg-cream"}`}
                          >
                            {n}
                          </button>
                        ),
                      )}
                    </div>
                    <button
                      onClick={() => goToPage(Math.min(totalPages, page + 1))}
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
