import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  items: [],
  couponCode: null,
  shippingFee: 0,

  addItem: (product, quantity = 1) => {
    const items = get().items;
    const existing = items.find((item) => item.productId === product.productId);

    if (!existing) {
      set({ items: [...items, { ...product, quantity }] });
      return;
    }

    set({
      items: items.map((item) =>
        item.productId === product.productId
          ? { ...item, quantity: item.quantity + quantity }
          : item,
      ),
    });
  },

  updateItemQuantity: (productId, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, quantity) }
          : item,
      ),
    })),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  clearCart: () => set({ items: [], couponCode: null }),

  setCouponCode: (couponCode) => set({ couponCode }),

  setShippingFee: (shippingFee) => set({ shippingFee }),
}));
