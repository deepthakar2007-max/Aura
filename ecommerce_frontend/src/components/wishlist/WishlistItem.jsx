import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function WishlistItem({ item, onRemove }) {
  const product = item.product;

  if (!product || typeof product === "string") {
    return (
      <motion.div
        layout
        exit={{ opacity: 0, x: 60 }}
        className="flex items-center justify-between py-4 border-b border-ink/10 text-sm text-ink/50"
      >
        Product unavailable
        <button
          onClick={() => onRemove(item._id)}
          className="text-red-500 hover:underline"
        >
          Remove
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.3 }}
      className="flex gap-4 py-5 border-b border-ink/10"
    >
      <Link to={`/product/${product._id}`}>
        <img
          src={product.img}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-xl bg-paper"
        />
      </Link>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/product/${product._id}`}>
            <h3 className="font-display text-lg text-ink hover:text-brandDark transition-colors">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-ink/50 mt-1">₹{product.price}</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onRemove(item._id)}
          className="self-start text-sm text-ink/40 hover:text-red-500 transition-colors"
        >
          Remove from wishlist
        </motion.button>
      </div>
    </motion.div>
  );
}
