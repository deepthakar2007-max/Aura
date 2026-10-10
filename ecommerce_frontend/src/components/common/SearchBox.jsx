import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowRight } from "lucide-react";
import { getProducts } from "../../api/productApi";
import { searchProducts } from "../../utils/search";

export default function SearchBox({
  suggestions = true,
  onNavigate,
  className = "",
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);

  const trimmed = query.trim();
  const showPanel = suggestions && open && trimmed.length >= 2;

  const results = useMemo(
    () => (showPanel ? searchProducts(products, trimmed).slice(0, 5) : []),
    [showPanel, products, trimmed],
  );

  useEffect(() => {
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const ensureProducts = () => {
    if (!products.length)
      getProducts()
        .then((res) => setProducts(res.data))
        .catch(() => {});
  };

  const finish = () => {
    setOpen(false);
    setActive(-1);
    if (onNavigate) onNavigate();
  };

  const goSearch = () => {
    if (!trimmed) return;
    navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
    finish();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (active >= 0 && results[active]) {
      navigate(`/product/${results[active]._id}`);
      finish();
      return;
    }
    goSearch();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={wrapRef} className={`relative w-full ${className}`}>
      <form onSubmit={handleSubmit} role="search">
        <input
          type="text"
          value={query}
          placeholder="Search men, women, watches…"
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => {
            ensureProducts();
            setOpen(true);
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-cream/60 border border-ink/10 rounded-full pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
        >
          <Search size={15} />
        </button>
      </form>

      {showPanel && (
        <div className="absolute right-0 top-full mt-2 w-[22rem] max-w-[90vw] bg-white border border-ink/10 rounded-xl shadow-lg overflow-hidden z-50">
          {results.length > 0 ? (
            <>
              {results.map((p, i) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  onClick={finish}
                  onMouseEnter={() => setActive(i)}
                  className={`flex items-center gap-3 px-3 py-2.5 transition-colors ${active === i ? "bg-cream/70" : ""}`}
                >
                  <img
                    src={p.img}
                    alt=""
                    className="w-10 h-10 object-cover rounded-md flex-shrink-0 bg-cream"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink truncate">{p.name}</p>
                    <p className="text-xs text-ink/50 capitalize">
                      {p.category}
                    </p>
                  </div>
                  <p className="text-sm text-ink flex-shrink-0">
                    ₹{p.price.toLocaleString("en-IN")}
                  </p>
                </Link>
              ))}
              <button
                type="button"
                onClick={goSearch}
                className="w-full flex items-center justify-between px-4 py-3 border-t border-ink/10 text-xs tracking-widest uppercase text-ink hover:bg-cream/60 transition-colors"
              >
                See all results for “{trimmed}” <ArrowRight size={14} />
              </button>
            </>
          ) : (
            <div className="px-4 py-5 text-sm text-ink/60">
              No matches for “{trimmed}”. Try{" "}
              {["men", "women", "kids"].map((c, i) => (
                <span key={c}>
                  <Link
                    to={`/shop?category=${c}`}
                    onClick={finish}
                    className="text-brandDark underline"
                  >
                    {c}
                  </Link>
                  {i < 2 ? ", " : ""}
                </span>
              ))}
              .
            </div>
          )}
        </div>
      )}
    </div>
  );
}
