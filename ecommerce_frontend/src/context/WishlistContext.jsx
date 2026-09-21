import { createContext, useState, useCallback } from "react";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from "../api/wishlistApi";
import { useAuth } from "../hooks/useAuth";

export const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = useCallback(async () => {
    if (!token || !user) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getWishlist(user._id);
      setItems(res.data);
    } finally {
      setLoading(false);
    }
  }, [token, user]);

  const isWishlisted = (productId) =>
    items.some((item) => (item.product?._id || item.product) === productId);

  const toggleWishlist = async (productId) => {
    const existing = items.find(
      (item) => (item.product?._id || item.product) === productId,
    );
    if (existing) {
      await removeFromWishlist(existing._id);
    } else {
      await addToWishlist(user._id, productId);
    }
    await refreshWishlist();
  };

  return (
    <WishlistContext.Provider
      value={{ items, loading, refreshWishlist, isWishlisted, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
