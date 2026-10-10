import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Menu, X, Heart, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";
import { useWishlist } from "../../hooks/useWishlist";
import SearchBox from "./SearchBox";

export default function Navbar() {
  const { user, logout, token } = useAuth();
  const { totalItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/login");
  };

  if (!token) return null;

  const navLinks = [
    { to: "/shop", label: "Shop" },
    { to: "/categories", label: "Categories" },
    {
      to: "/wishlist",
      label: "Wishlist",
      count: wishlistItems.length,
      icon: Heart,
    },
    { to: "/cart", label: "Cart", count: totalItems, icon: ShoppingBag },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <motion.header
      animate={{
        boxShadow: scrolled
          ? "0 1px 12px rgba(0,0,0,0.06)"
          : "0 0 0 rgba(0,0,0,0)",
      }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-ink/10"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-20 flex items-center gap-4 sm:gap-10">
        <button
          onClick={() => setMobileMenu((o) => !o)}
          aria-label="Menu"
          className="md:hidden text-ink flex-shrink-0"
        >
          {mobileMenu ? <X size={22} /> : <Menu size={22} />}
        </button>

        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <span className="w-6 h-6 border border-accent rotate-45 flex-shrink-0" />
          <span className="font-display text-lg sm:text-xl tracking-[0.2em] text-ink">
            AURA
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs tracking-wide uppercase text-ink/70">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative py-2 group flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              {link.icon && <link.icon size={15} />}
              {link.label}
              <AnimatePresence mode="popLayout">
                {link.count > 0 && (
                  <motion.span
                    key={link.count}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 15 }}
                    className="bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center normal-case"
                  >
                    {link.count}
                  </motion.span>
                )}
              </AnimatePresence>
              <span className="absolute left-0 -bottom-0.5 h-px bg-ink w-0 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block flex-1 max-w-xs ml-auto">
          <SearchBox />
        </div>

        <div className="relative ml-auto md:ml-0 flex-shrink-0" ref={menuRef}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen((o) => !o)}
            aria-label="Account menu"
            className="w-9 h-9 rounded-full overflow-hidden bg-ink text-paper flex items-center justify-center text-sm font-medium"
          >
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={16} />
            )}
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-2 w-56 bg-white border border-ink/10 rounded-xl shadow-lg py-2 z-50"
              >
                <div className="flex items-center gap-3 px-4 py-3 border-b border-ink/10">
                  <div className="w-9 h-9 rounded-full overflow-hidden bg-ink text-paper flex items-center justify-center flex-shrink-0">
                    {user?.photo ? (
                      <img
                        src={user.photo}
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={14} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate">
                      {user?.username}
                    </p>
                    <p className="text-xs text-ink/50 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-ink/70 hover:bg-paper transition-colors"
                >
                  My profile
                </Link>
                <Link
                  to="/addresses"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-ink/70 hover:bg-paper transition-colors"
                >
                  My addresses
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors border-t border-ink/10 mt-1"
                >
                  Log out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden border-t border-ink/10 bg-paper"
          >
            <div className="px-5 py-4 space-y-1">
              <div className="mb-3">
                <SearchBox
                  suggestions={false}
                  onNavigate={() => setMobileMenu(false)}
                />
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between py-2.5 text-sm text-ink/70 border-b border-ink/5"
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon size={16} />} {link.label}
                  </span>
                  {link.count > 0 && (
                    <span className="bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                      {link.count}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
