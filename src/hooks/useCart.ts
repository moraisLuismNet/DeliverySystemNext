import { useState, useEffect } from "react";
import { cartService } from "../services/cart.service";
import { useCartStore } from "../store/cartStore";
import { useAuthStore } from "../store/authStore";
import { IAddToCart } from "../interfaces/cart.interface";
import { getErrorMessage } from "../utils/errorHandling";

export function useCart() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const { items, totalAmount, itemCount, setItems, clearCart: storeClear } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    if (!isAuthenticated || isAdmin) {
      storeClear();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.getCart();
      setItems(response.data.items || [], response.data.totalAmount || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (data: IAddToCart) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.addToCart(data);
      setItems(response.data.items || [], response.data.totalAmount || 0);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cartService.updateItem({ cartItemId, quantity });
      setItems(response.data.items || [], response.data.totalAmount || 0);
    } catch (err) {
      setError(getErrorMessage(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (cartItemId: number) => {
    setLoading(true);
    setError(null);
    try {
      await cartService.removeItem(cartItemId);
      const response = await cartService.getCart();
      setItems(response.data.items || [], response.data.totalAmount || 0);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      await cartService.clearCart(true);
      storeClear();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated]);

  return { items, totalAmount, itemCount, loading, error, fetchCart, addToCart, updateQuantity, removeItem, clearCart };
}
