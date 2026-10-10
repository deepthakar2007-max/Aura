import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Heart } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";

export default function ProductCard({ product, index = 0 }) {
  const { token } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [busy, setBusy] = useState(false);

  const badge =
    product.stock === 0
      ? null
      : product.stock < 5
        ? { text: "Limited", color: "bg-red-600" }
        : Date.now() - new Date(product.createdAt).getTime() < 30 * 86400000
          ? { text: "New", color: "bg-ink" }
          : null;

  const wished = isWishlisted(product._id);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!token || busy) return;
    setBusy(true);
    try {
      await toggleWishlist(product._id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: {
          duration: 0.5,
          delay: (index % 4) * 0.08,
          ease: "easeOut",
        },
      }}
      whileHover={{
        y: -6,
        transition: { type: "spring", stiffness: 300, damping: 22 },
      }}
      viewport={{ once: true, amount: 0.1 }}
      className="group"
    >
      <div className="relative aspect-square bg-cream overflow-hidden mb-4">
        {badge && (
          <span
            className={`absolute top-3 left-3 ${badge.color} text-white text-[10px] tracking-widest uppercase px-2 py-1 z-10`}
          >
            {badge.text}
          </span>
        )}
        <motion.button
          onClick={handleWishlist}
          disabled={busy}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center z-10"
        >
          <Heart
            size={15}
            className={wished ? "text-red-500" : "text-ink"}
            fill={wished ? "currentColor" : "none"}
          />
        </motion.button>
        <Link
          to={`/product/${product._id}`}
          className="block w-full h-full overflow-hidden"
        >
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      </div>
      <p className="text-[10px] tracking-widest uppercase text-accent">
        {product.category}
      </p>
      <Link to={`/product/${product._id}`}>
        <p className="font-medium text-ink mt-1 truncate hover:text-brand transition-colors">
          {product.name}
        </p>
      </Link>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-ink">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        {product.stock === 0 && (
          <span className="text-[10px] text-red-500 uppercase">
            Out of stock
          </span>
        )}
      </div>
    </motion.div>
  );
}
