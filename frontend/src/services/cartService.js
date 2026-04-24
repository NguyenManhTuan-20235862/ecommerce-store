import api from "./api";

const API_BASE_URL = "/cart";

// Lấy giỏ hàng
export const fetchCart = async () => {
  try {
    const response = await api.get(API_BASE_URL);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy giỏ hàng:", error);
    throw error;
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCartAPI = async (productData) => {
  try {
    const response = await api.post(`${API_BASE_URL}/add`, productData);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi thêm vào giỏ hàng:", error);
    throw error;
  }
};

// Cập nhật số lượng item
export const updateItemQuantityAPI = async (itemId, quantity) => {
  try {
    const response = await api.put(`${API_BASE_URL}/update-quantity`, {
      itemId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật số lượng:", error);
    throw error;
  }
};

// Xóa item từ giỏ hàng
export const removeItemAPI = async (itemId) => {
  try {
    const response = await api.delete(`${API_BASE_URL}/remove`, {
      data: { itemId },
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa item:", error);
    throw error;
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCartAPI = async () => {
  try {
    const response = await api.delete(`${API_BASE_URL}/clear`);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi xóa giỏ hàng:", error);
    throw error;
  }
};

// Áp dụng mã coupon
export const applyCouponAPI = async (couponCode) => {
  try {
    const response = await api.post(`${API_BASE_URL}/apply-coupon`, {
      couponCode,
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi áp dụng mã coupon:", error);
    throw error;
  }
};
