import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../../hooks/useAuth";
import { useWishlist } from "../../hooks/useWishlist";
import { staggerItemVariants } from "../animations/StaggerContainer";

export default function ProductCard({ product }) {
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

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!token) return;
    setBusy(true);
    try {
      await toggleWishlist(product._id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <motion.div
      variants={staggerItemVariants}
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.8 }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-sm z-10"
        >
          {isWishlisted(product._id) ? "♥" : "♡"}
        </motion.button>
        <Link
          to={`/product/${product._id}`}
          className="block w-full h-full overflow-hidden"
        >
          <motion.img
            src={product.img}
            alt={product.name}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full object-cover"
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
        <p className="text-sm text-ink">${product.price}</p>
        {product.stock === 0 && (
          <span className="text-[10px] text-red-500 uppercase">
            Out of stock
          </span>
        )}
      </div>
    </motion.div>
  );
}
