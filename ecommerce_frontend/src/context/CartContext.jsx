import { createContext, useState, useCallback } from "react";
import {
  getCart,
  addToCart,
  updateCartItem,
  toggleSaveItem,
  removeCartItem,
  clearCart,
} from "../api/cartApi";
import { useAuth } from "../hooks/useAuth";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await getCart();
      setItems(res.data.items);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addItem = async (productId, quantity = 1) => {
    await addToCart(productId, quantity);
    await refreshCart();
  };

  const updateItem = async (id, quantity) => {
    await updateCartItem(id, quantity);
    await refreshCart();
  };

  const toggleSave = async (id) => {
    await toggleSaveItem(id);
    await refreshCart();
  };

  const removeItem = async (id) => {
    await removeCartItem(id);
    await refreshCart();
  };

  const emptyCart = async () => {
    await clearCart();
    await refreshCart();
  };

  const activeItems = items.filter((i) => !i.saved);
  const savedItems = items.filter((i) => i.saved);

  const totalItems = activeItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = activeItems.reduce(
    (sum, i) => sum + (i.product?.price || 0) * i.quantity,
    0,
  );

  return (
    <CartContext.Provider
      value={{
        items,
        activeItems,
        savedItems,
        loading,
        refreshCart,
        addItem,
        updateItem,
        toggleSave,
        removeItem,
        emptyCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
