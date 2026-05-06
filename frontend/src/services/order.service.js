import api from "./api";

/**
 * Order Service - Xử lý các HTTP calls liên quan đến orders
 */
export const orderService = {
  /**
   * Tạo đơn hàng mới từ giỏ hàng hiện tại
   * @param {Object} orderData - Thông tin đơn hàng
   * @param {Object} orderData.shippingAddress - Địa chỉ giao hàng
   * @param {string} orderData.shippingAddress.receiverName - Tên người nhận
   * @param {string} orderData.shippingAddress.receiverPhone - SĐT người nhận
   * @param {string} orderData.shippingAddress.receiverEmail - Email người nhận
   * @param {string} orderData.shippingAddress.province - Tỉnh/Thành phố
   * @param {string} orderData.shippingAddress.district - Quận/Huyện
   * @param {string} orderData.shippingAddress.ward - Phường/Xã
   * @param {string} orderData.shippingAddress.detail - Địa chỉ chi tiết
   * @param {string} orderData.paymentMethod - Phương thức thanh toán (COD, VNPAY, MOMO)
   * @param {string} [orderData.couponCode] - Mã giảm giá (optional)
   * @returns {Promise<Object>} Response data với order đã tạo
   */
  createOrder(orderData) {
    return api.post("/orders", orderData);
  },

  /**
   * Lấy danh sách đơn hàng của user hiện tại
   * @returns {Promise<Object>} Response data với danh sách orders
   */
  getUserOrders() {
    return api.get("/orders/me");
  },

  /**
   * Lấy chi tiết một đơn hàng
   * @param {string} orderId - ID của đơn hàng
   * @returns {Promise<Object>} Response data với chi tiết order
   */
  getOrderById(orderId) {
    return api.get(`/orders/${orderId}`);
  },

  /**
   * Hủy đơn hàng (chỉ khi status = "pending")
   * @param {string} orderId - ID của đơn hàng cần hủy
   * @returns {Promise<Object>} Response data với order đã hủy
   */
  cancelOrder(orderId) {
    return api.put(`/orders/${orderId}/cancel`);
  },

  // ====== ADMIN ======
  getStats() {
    return api.get("/orders/stats");
  },

  getAllOrders() {
    return api.get("/orders");
  },

  updateOrderStatus(orderId, status) {
    return api.put(`/orders/${orderId}/status`, { status });
  },
};
