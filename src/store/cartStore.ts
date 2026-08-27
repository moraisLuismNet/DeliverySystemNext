import { create } from "zustand";
import { ICartItem } from "../interfaces/cart.interface";

interface CartState {
  items: ICartItem[];
  totalAmount: number;
  itemCount: number;
  setItems: (items: ICartItem[], totalAmount: number) => void;
  clearCart: () => void;
  addItem: (item: ICartItem) => void;
  removeItem: (cartItemId: number) => void;
  updateItemQuantity: (cartItemId: number, quantity: number) => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalAmount: 0,
  itemCount: 0,
  setItems: (items, totalAmount) =>
    set({
      items,
      totalAmount,
      itemCount: items.reduce((acc, i) => acc + i.quantity, 0),
    }),
  clearCart: () =>
    set({ items: [], totalAmount: 0, itemCount: 0 }),
  addItem: (item) =>
    set((state) => {
      const updated = [...state.items, item];
      return {
        items: updated,
        totalAmount: updated.reduce((acc, i) => acc + i.subtotal, 0),
        itemCount: updated.reduce((acc, i) => acc + i.quantity, 0),
      };
    }),
  removeItem: (cartItemId) =>
    set((state) => {
      const updated = state.items.filter((i) => i.id !== cartItemId);
      return {
        items: updated,
        totalAmount: updated.reduce((acc, i) => acc + i.subtotal, 0),
        itemCount: updated.reduce((acc, i) => acc + i.quantity, 0),
      };
    }),
  updateItemQuantity: (cartItemId, quantity) =>
    set((state) => {
      const updated = state.items.map((i) =>
        i.id === cartItemId
          ? { ...i, quantity, subtotal: i.unitPrice * quantity }
          : i
      );
      return {
        items: updated,
        totalAmount: updated.reduce((acc, i) => acc + i.subtotal, 0),
        itemCount: updated.reduce((acc, i) => acc + i.quantity, 0),
      };
    }),
}));
