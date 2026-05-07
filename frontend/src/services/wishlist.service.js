import api from "./api";

export const wishlistService = {
  getWishlist: () => api.get("/users/me/wishlist"),
  addToWishlist: (productId) => api.post("/users/me/wishlist", { productId }),
  removeFromWishlist: (productId) => api.delete(`/users/me/wishlist/${productId}`),
};
