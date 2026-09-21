import { motion } from "motion/react";

export default function CartItem({ item, onUpdate, onRemove, onToggleSave }) {
  const product = item.product;
  if (!product || typeof product === "string") return null;

  const badge = product.stock > 0 && product.stock < 5 ? "Limited" : null;
  const isNew =
    Date.now() - new Date(product.createdAt).getTime() < 30 * 86400000;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.3 }}
      className="bg-white border border-ink/10 p-5 flex gap-5"
    >
      <div className="relative w-28 h-28 flex-shrink-0 bg-cream overflow-hidden">
        {(badge || isNew) && (
          <span className="absolute top-2 left-2 bg-ink text-white text-[9px] tracking-widest uppercase px-2 py-0.5">
            {badge || "New"}
          </span>
        )}
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] tracking-widest uppercase text-accent">
              {product.category}
            </p>
            <p className="font-display text-lg text-ink truncate">
              {product.name}
            </p>
          </div>
          <p className="font-medium text-ink whitespace-nowrap">
            ${(product.price * item.quantity).toFixed(2)}
          </p>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-ink/15">
            <button
              onClick={() => onUpdate(item._id, Math.max(1, item.quantity - 1))}
              className="w-8 h-8 hover:bg-cream text-sm"
            >
              -
            </button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() => onUpdate(item._id, item.quantity + 1)}
              className="w-8 h-8 hover:bg-cream text-sm"
            >
              +
            </button>
          </div>
          <div className="flex gap-4 text-xs">
            <button
              onClick={() => onToggleSave(item._id)}
              className="text-ink/50 hover:text-ink flex items-center gap-1"
            >
              🔖 Save for Later
            </button>
            <button
              onClick={() => onRemove(item._id)}
              className="text-red-500 hover:text-red-700 flex items-center gap-1"
            >
              🗑 Remove
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
