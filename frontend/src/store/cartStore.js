import { create } from "zustand";
import * as cartService from "../services/cartService.js";

export const useCartStore = create((set, get) => ({
  items: [],
  couponCode: null,
  shippingFee: 0,
  isLoading: false,
  error: null,

  // Fetch cart từ API
  fetchCart: async () => {
    try {
      set({ isLoading: true, error: null });
      const result = await cartService.fetchCart();
      if (result.success && result.data) {
        set({
          items: result.data.items || [],
          couponCode: result.data.couponCode || null,
          shippingFee: result.data.shippingFee || 0,
          isLoading: false,
        });
      }
    } catch (error) {
      set({
        error: error.message || "Lỗi khi tải giỏ hàng",
        isLoading: false,
      });
    }
  },

  addItem: async (productData, quantity = 1) => {
    set({ isLoading: true, error: null });
    try {
      const result = await cartService.addToCartAPI({
        productId: productData.productId,
        quantity,
        selectedSize: productData.selectedSize || productData.size || "M",
        selectedColor: productData.selectedColor || productData.color || "URBAN CORE",
      });
      if (result.success) {
        get().fetchCart();
      } else {
        set({ error: result.message, isLoading: false });
      }
      return result;
    } catch (error) {
      const msg = error.response?.data?.message || "Lỗi hệ thống";
      set({ error: msg, isLoading: false });
      return { success: false, message: msg };
    }
  },

  updateItemQuantity: async (itemId, quantity) => {
    set({ isLoading: true, error: null });
    try {
      const result = await cartService.updateItemQuantityAPI(itemId, quantity);
      if (result.success) {
        get().fetchCart();
      } else {
        set({ error: result.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Lỗi hệ thống", isLoading: false });
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const result = await cartService.removeItemAPI(itemId);
      if (result.success) {
        get().fetchCart();
      } else {
        set({ error: result.message, isLoading: false });
      }
    } catch (error) {
      set({ error: error.response?.data?.message || "Lỗi hệ thống", isLoading: false });
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await cartService.clearCartAPI();
      if (result.success) {
        set({ items: [], couponCode: null, shippingFee: 0, isLoading: false });
      }
    } catch (error) {
      set({ error: "Lỗi hệ thống", isLoading: false });
    }
  },

  setCouponCode: (couponCode) => set({ couponCode }),

  setShippingFee: (shippingFee) => set({ shippingFee }),
}));
