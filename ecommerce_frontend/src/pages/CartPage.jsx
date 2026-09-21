import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../hooks/useCart";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import FadeUp from "../components/animations/FadeUp";

const FREE_SHIP_THRESHOLD = 1000;
const RESERVE_SECONDS = 15 * 60;

export default function CartPage() {
  const {
    activeItems,
    savedItems,
    loading,
    refreshCart,
    updateItem,
    toggleSave,
    removeItem,
    totalPrice,
  } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [timeLeft, setTimeLeft] = useState(RESERVE_SECONDS);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  useEffect(() => {
    if (!activeItems.length) return;
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(id);
  }, [activeItems.length]);

  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_SHIP_THRESHOLD) * 100);

  if (loading) return <p className="text-center py-20 text-ink/50">Loading…</p>;

  if (!activeItems.length && !savedItems.length) {
    return (
      <FadeUp>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-ink">Your bag is empty</h1>
          <p className="text-ink/50 mt-2">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-ink text-white px-6 py-3 text-xs tracking-widest uppercase hover:bg-ink/80 transition-colors"
          >
            Continue shopping
          </Link>
        </div>
      </FadeUp>
    );
  }

  return (
    <FadeUp>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <p className="text-xs text-ink/40 mb-2">
          Bag / <span className="font-medium text-ink">Review Order</span>
        </p>
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <h1 className="font-display text-4xl text-ink">Your Shopping Bag</h1>
          {activeItems.length > 0 && (
            <p className="text-sm text-ink/60">
              {activeItems.length} items reserved for{" "}
              <strong>
                {mins}:{secs}
              </strong>
            </p>
          )}
        </div>

        {remaining > 0 && (
          <div className="bg-cream/60 p-5 mb-10">
            <div className="flex items-center justify-between text-sm mb-2">
              <span>
                🚚 You are <strong>${remaining.toFixed(0)}</strong> away from
                complimentary express shipping.
              </span>
              <span className="text-xs text-ink/40">
                {progress.toFixed(0)}% Unlocked
              </span>
            </div>
            <div className="h-1.5 bg-ink/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-accent"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {activeItems.map((item) => (
                <CartItem
                  key={item._id}
                  item={item}
                  onUpdate={updateItem}
                  onRemove={removeItem}
                  onToggleSave={toggleSave}
                />
              ))}
            </AnimatePresence>

            {savedItems.length > 0 && (
              <div className="pt-8">
                <h2 className="font-display text-2xl text-ink mb-4">
                  Saved for Later ({savedItems.length})
                </h2>
                <div className="space-y-3">
                  <AnimatePresence mode="popLayout">
                    {savedItems.map((item) => (
                      <motion.div
                        key={item._id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 60 }}
                        className="bg-cream/60 p-4 flex items-center gap-4"
                      >
                        <img
                          src={item.product?.img}
                          alt={item.product?.name}
                          className="w-16 h-16 object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-ink truncate">
                            {item.product?.name}
                          </p>
                          <p className="text-sm text-ink/50">
                            ${item.product?.price}
                          </p>
                        </div>
                        <button
                          onClick={() => toggleSave(item._id)}
                          className="bg-ink text-white text-xs px-4 py-2 uppercase tracking-wide hover:bg-ink/80 transition-colors flex-shrink-0"
                        >
                          Move to Bag
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {activeItems.length > 0 && (
            <CartSummary
              totalPrice={totalPrice}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={setAppliedCoupon}
            />
          )}
        </div>
      </div>
    </FadeUp>
  );
}
