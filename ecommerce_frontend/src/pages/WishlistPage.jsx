import { useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { useWishlist } from "../hooks/useWishlist";
import { removeFromWishlist } from "../api/wishlistApi";
import WishlistItem from "../components/wishlist/WishlistItem";
import FadeUp from "../components/animations/FadeUp";

export default function WishlistPage() {
  const { items, loading, refreshWishlist } = useWishlist();

  useEffect(() => {
    refreshWishlist();
  }, [refreshWishlist]);

  const handleRemove = async (id) => {
    await removeFromWishlist(id);
    await refreshWishlist();
  };

  if (loading)
    return <p className="text-center py-20 text-ink/50">Loading wishlist…</p>;

  if (!items.length) {
    return (
      <FadeUp>
        <div className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-brandDark">
            Your wishlist is empty
          </h1>
          <p className="text-ink/50 mt-2">Save items you love for later.</p>
          <Link
            to="/shop"
            className="inline-block mt-6 bg-brandDark text-paper px-6 py-2.5 rounded-lg hover:bg-brand transition-colors"
          >
            Browse products
          </Link>
        </div>
      </FadeUp>
    );
  }

  return (
    <FadeUp>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="font-display text-3xl text-brandDark mb-8">
          Your wishlist
        </h1>
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <WishlistItem key={item._id} item={item} onRemove={handleRemove} />
          ))}
        </AnimatePresence>
      </div>
    </FadeUp>
  );
}
