import api from "./api";

/**
 * User Service - Xử lý các HTTP calls liên quan đến user profile
 */
export const userService = {
  /**
   * Lấy thông tin profile của user hiện tại
   * @returns {Promise<Object>} Response data với thông tin user
   */
  getUserProfile() {
    return api.get("/users/me");
  },

  /**
   * Đổi mật khẩu cho user hiện tại
   * @param {Object} passwordData - Dữ liệu mật khẩu
   * @param {string} passwordData.currentPassword - Mật khẩu hiện tại
   * @param {string} passwordData.newPassword - Mật khẩu mới (tối thiểu 8 ký tự)
   * @returns {Promise<Object>} Response data với kết quả đổi mật khẩu
   */
  updateProfile(profileData) {
    return api.put("/users/me", profileData);
  },

  updatePassword(passwordData) {
    return api.put("/users/me/password", passwordData);
  },

  uploadAvatar(formData) {
    return api.post("/users/me/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // ====== ADDRESSES ======
  getAddresses() {
    return api.get("/users/me/addresses");
  },
  addAddress(addressData) {
    return api.post("/users/me/addresses", addressData);
  },
  updateAddress(addressId, addressData) {
    return api.put(`/users/me/addresses/${addressId}`, addressData);
  },
  deleteAddress(addressId) {
    return api.delete(`/users/me/addresses/${addressId}`);
  },
  setDefaultAddress(addressId) {
    return api.put(`/users/me/addresses/${addressId}/default`);
  },

  // ====== ADMIN ======
  getAllUsers(params = {}) {
    return api.get("/users", { params });
  },
};
