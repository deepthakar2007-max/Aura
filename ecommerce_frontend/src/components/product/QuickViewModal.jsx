import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, ArrowRight } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useCart } from "../../hooks/useCart";

export default function QuickViewModal({ product, onClose }) {
  const { token } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const handleAdd = async () => {
    if (!token) return navigate("/login");
    setBusy(true);
    try {
      await addItem(product._id, qty);
      setMessage("Added to your bag");
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-paper w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl grid md:grid-cols-2 relative"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-ink"
            >
              <X size={18} />
            </button>

            <div className="aspect-square md:aspect-auto bg-cream">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-8 flex flex-col">
              <p className="text-[10px] tracking-widest uppercase text-accent">
                {product.category}
              </p>
              <h3 className="font-display text-2xl text-ink mt-1">
                {product.name}
              </h3>
              <p className="font-display text-2xl text-ink mt-3">
                ₹{product.price.toLocaleString("en-IN")}
              </p>
              <p className="text-sm text-ink/60 mt-4 leading-relaxed line-clamp-5">
                {product.description}
              </p>
              <p
                className={`mt-3 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>

              {message && (
                <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-4">
                  {message}
                </p>
              )}

              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center border border-ink/15">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-9 h-10 hover:bg-cream"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-sm">{qty}</span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-9 h-10 hover:bg-cream"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={handleAdd}
                  disabled={busy || product.stock === 0}
                  className="flex-1 bg-ink text-white text-xs tracking-widest uppercase py-3 flex items-center justify-center gap-2 hover:bg-ink/80 transition-colors disabled:opacity-40"
                >
                  <ShoppingBag size={14} /> {busy ? "Adding…" : "Add to Bag"}
                </button>
              </div>

              <Link
                to={`/product/${product._id}`}
                onClick={onClose}
                className="mt-5 inline-flex items-center gap-2 text-sm text-ink group w-fit"
              >
                View full details
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
