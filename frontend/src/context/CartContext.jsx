import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { cartApi } from "../api/endpoints";
import { AuthContext } from "./AuthContext";

export const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setLoading(true);
      cartApi
        .list()
        .then(setItems)
        .catch(() => setItems([]))
        .finally(() => setLoading(false));
    } else {
      setItems([]);
    }
  }, [user]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    const item = await cartApi.add({ productId, quantity });
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.productId === productId);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + quantity };
        return updated;
      }
      return [...prev, item];
    });
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    await cartApi.update(itemId, { quantity });
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));
  }, []);

  const removeItem = useCallback(async (itemId) => {
    await cartApi.remove(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return (
    <CartContext.Provider value={{ items, loading, subtotal, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
