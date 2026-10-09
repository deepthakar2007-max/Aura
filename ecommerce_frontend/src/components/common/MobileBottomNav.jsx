import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Home,
  Search,
  Heart,
  ShoppingBag,
  User,
  X,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import { getCategories } from "../../api/categoryApi";

function Tab({ to, onClick, active, icon: Icon, label, count }) {
  const inner = (
    <>
      {active && (
        <motion.span
          layoutId="bottom-nav-indicator"
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-8 bg-accent rounded-full"
          transition={{ type: "spring", stiffness: 500, damping: 35 }}
        />
      )}
      <motion.span whileTap={{ scale: 0.85 }} className="relative">
        <Icon size={22} strokeWidth={active ? 2.2 : 1.7} />
        <AnimatePresence mode="popLayout">
          {count > 0 && (
            <motion.span
              key={count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
              className="absolute -top-1.5 -right-2.5 min-w-4 h-4 px-1 rounded-full bg-accent text-ink text-[10px] font-semibold flex items-center justify-center"
            >
              {count > 9 ? "9+" : count}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
      <span className="text-[10px] tracking-wide">{label}</span>
    </>
  );

  const className = `relative flex flex-col items-center justify-center gap-1 h-full w-full transition-colors ${
    active ? "text-accent" : "text-white/55 active:text-white"
  }`;

  if (to) {
    return (
      <Link to={to} className={className} aria-label={label}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      aria-label={label}
    >
      {inner}
    </button>
  );
}

export default function MobileBottomNav() {
  const { token } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!searchOpen || categories.length) return;
    getCategories()
      .then((res) =>
        setCategories(res.data.filter((c) => c.status !== "inactive")),
      )
      .catch(() => {});
  }, [searchOpen, categories.length]);

  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e) => e.key === "Escape" && setSearchOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  if (!token) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    setSearchOpen(false);
    setQuery("");
    navigate(`/shop?search=${encodeURIComponent(q)}`);
  };

  const accountPaths = ["/profile", "/orders", "/addresses"];
  const accountActive = accountPaths.some((p) => pathname.startsWith(p));

  return (
    <>
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div
              key="search-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="md:hidden fixed inset-0 z-[39] bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              key="search-panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="md:hidden fixed inset-x-0 bottom-0 z-[39] bg-ink border-t border-white/10 rounded-t-2xl px-5 pt-5 max-h-[80vh] overflow-y-auto"
              style={{
                paddingBottom:
                  "calc(4rem + env(safe-area-inset-bottom) + 1rem)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="font-display text-lg text-white">Search AURA</p>
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Close search"
                  className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleSearch} className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search luxury goods…"
                  className="w-full bg-white/10 border border-white/15 rounded-full pl-11 pr-14 py-3 text-sm text-white placeholder:text-white/40 outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  aria-label="Search"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-accent text-ink flex items-center justify-center"
                >
                  <ArrowRight size={16} />
                </button>
              </form>

              {categories.length > 0 && (
                <div className="mt-6">
                  <p className="text-[10px] tracking-widest uppercase text-white/40 mb-3">
                    Browse categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((c) => (
                      <Link
                        key={c._id}
                        to={`/shop?category=${c.name}`}
                        className="px-4 py-2 rounded-full border border-white/15 text-xs text-white/80 capitalize active:bg-white/10"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-ink/90 backdrop-blur-xl border-t border-white/10"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Mobile navigation"
      >
        <div className="grid grid-cols-5 h-16">
          <Tab
            to="/"
            icon={Home}
            label="Home"
            active={!searchOpen && pathname === "/"}
          />
          <Tab
            onClick={() => setSearchOpen((o) => !o)}
            icon={Search}
            label="Search"
            active={searchOpen}
          />
          <Tab
            to="/wishlist"
            icon={Heart}
            label="Wishlist"
            count={wishlistItems.length}
            active={!searchOpen && pathname.startsWith("/wishlist")}
          />
          <Tab
            to="/cart"
            icon={ShoppingBag}
            label="Cart"
            count={totalItems}
            active={!searchOpen && pathname.startsWith("/cart")}
          />
          <Tab
            to="/profile"
            icon={User}
            label="Account"
            active={!searchOpen && accountActive}
          />
        </div>
      </nav>
    </>
  );
}
