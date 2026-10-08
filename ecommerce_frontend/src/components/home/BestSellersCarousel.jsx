import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { getBestSellers } from "../../api/productApi";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";
import QuickViewModal from "../product/QuickViewModal";
import ScrollReveal from "../animations/ScrollReveal";

export default function BestSellersCarousel() {
  const { token } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    getBestSellers()
      .then((res) => setProducts(res.data))
      .catch(() => {});
  }, []);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const handleWishlist = async (e, id) => {
    e.preventDefault();
    if (!token) return;
    try {
      await toggleWishlist(id);
    } catch {}
  };

  if (!products.length) return null;

  return (
    <ScrollReveal>
      <section className="max-w-7xl mx-auto px-5 sm:px-8 py-20">
        <div className="flex items-end justify-between mb-10 gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-accent mb-2">
              Most Desired
            </p>
            <h2 className="font-display text-3xl text-ink">Best Sellers</h2>
          </div>
          <div className="hidden sm:flex gap-2">
            <button
              onClick={() => scrollBy(-1)}
              className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scrollBy(1)}
              className="w-10 h-10 rounded-full border border-ink/15 flex items-center justify-center hover:bg-ink hover:text-white transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.map((p) => {
            const secondImg = p.images && p.images[1];
            const wished = isWishlisted(p._id);
            return (
              <div
                key={p._id}
                className="group snap-start flex-shrink-0 w-[70%] sm:w-[260px]"
              >
                <div className="relative aspect-[3/4] bg-cream overflow-hidden rounded-xl">
                  <Link
                    to={`/product/${p._id}`}
                    className="block w-full h-full"
                  >
                    <img
                      src={p.img}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                    />
                    {secondImg && (
                      <img
                        src={secondImg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      />
                    )}
                  </Link>

                  <motion.button
                    onClick={(e) => handleWishlist(e, p._id)}
                    whileTap={{ scale: 0.8 }}
                    whileHover={{ scale: 1.1 }}
                    className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
                  >
                    <Heart
                      size={16}
                      className={wished ? "text-red-500" : "text-ink"}
                      fill={wished ? "currentColor" : "none"}
                    />
                  </motion.button>

                  <button
                    onClick={() => setQuickView(p)}
                    className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur text-ink text-xs tracking-widest uppercase py-2.5 rounded-lg flex items-center justify-center gap-2 md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300"
                  >
                    <Eye size={14} /> Quick View
                  </button>
                </div>

                <p className="text-[10px] tracking-widest uppercase text-accent mt-3">
                  {p.category}
                </p>
                <Link to={`/product/${p._id}`}>
                  <p className="font-medium text-ink mt-1 truncate hover:text-brand transition-colors">
                    {p.name}
                  </p>
                </Link>
                <p className="text-sm text-ink mt-1">
                  ₹{p.price.toLocaleString("en-IN")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {quickView && (
        <QuickViewModal
          product={quickView}
          onClose={() => setQuickView(null)}
        />
      )}
    </ScrollReveal>
  );
}
