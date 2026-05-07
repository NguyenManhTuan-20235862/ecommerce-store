import { toast } from "sonner";
import { create } from "zustand";
import { wishlistService } from "../services/wishlist.service";

export const useWishlistStore = create((set, get) => ({
  items: [],
  isLoading: false,

  isWishlisted: (productId) =>
    get().items.some((item) => String(item._id) === String(productId)),

  fetchWishlist: async () => {
    set({ isLoading: true });
    try {
      const res = await wishlistService.getWishlist();
      set({ items: res.data.data || [] });
    } catch (err) {
      console.error("Lỗi khi tải wishlist:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  toggle: async (productId, productData) => {
    if (!productId) return;
    const isIn = get().isWishlisted(productId);
    if (isIn) {
      set((state) => ({
        items: state.items.filter((i) => String(i._id) !== String(productId)),
      }));
      try {
        await wishlistService.removeFromWishlist(productId);
        toast.success("Đã xóa khỏi Wishlist");
      } catch {
        await get().fetchWishlist();
        toast.error("Có lỗi xảy ra");
      }
    } else {
      set((state) => ({ items: [...state.items, { _id: productId, ...productData }] }));
      try {
        await wishlistService.addToWishlist(productId);
        toast.success("Đã thêm vào Wishlist");
      } catch {
        await get().fetchWishlist();
        toast.error("Có lỗi xảy ra");
      }
    }
  },

  reset: () => set({ items: [], isLoading: false }),
}));
