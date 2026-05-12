import api from "./api";

export const reviewService = {
  getByProduct(productId) {
    return api.get(`/products/${productId}/reviews`);
  },

  create(productId, data) {
    return api.post(`/products/${productId}/reviews`, data);
  },

  remove(productId, reviewId) {
    return api.delete(`/products/${productId}/reviews/${reviewId}`);
  },
};
