"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { cartService } from "../../services/cart.service";

export function CartSync() {
  const { isAuthenticated, isAdmin } = useAuthStore();
  const setItems = useCartStore((s) => s.setItems);
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) {
      initial.current = false;
      return;
    }
    if (isAuthenticated && !isAdmin) {
      cartService
        .getCart()
        .then((res) => setItems(res.data.items || [], res.data.totalAmount || 0))
        .catch(() => setItems([], 0));
    } else {
      setItems([], 0);
    }
  }, [isAuthenticated]);

  return null;
}
