/**
 * Format số tiền theo định dạng VNĐ
 * @param {number} value - Số tiền cần format
 * @returns {string} Chuỗi đã format (VD: "1.250.000đ")
 */
export const formatVnd = (value) => {
  if (typeof value !== "number") return "0đ";
  return `${new Intl.NumberFormat("vi-VN").format(value)}đ`;
};

/**
 * Tính tổng tiền giỏ hàng
 * @param {Array} items - Danh sách items trong giỏ hàng
 * @returns {number} Tổng tiền subtotal
 */
export const calculateSubtotal = (items) => {
  if (!Array.isArray(items) || items.length === 0) return 0;
  
  return items.reduce((total, item) => {
    const price = item.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);
};

/**
 * Tính phí vận chuyển dựa trên subtotal
 * Logic: Freeship nếu >= 500k, ngược lại 30k
 * @param {number} subtotal - Tổng tiền hàng
 * @returns {number} Phí vận chuyển
 */
export const calculateShippingFee = (subtotal) => {
  const FREE_SHIP_THRESHOLD = 500000; // 500k
  const STANDARD_SHIPPING_FEE = 30000; // 30k
  
  return subtotal >= FREE_SHIP_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
};

/**
 * Tính tổng tiền cuối cùng
 * @param {number} subtotal - Tổng tiền hàng
 * @param {number} shippingFee - Phí vận chuyển
 * @param {number} discountAmount - Số tiền giảm giá (từ coupon)
 * @returns {number} Tổng tiền cuối cùng
 */
export const calculateFinalAmount = (subtotal, shippingFee, discountAmount = 0) => {
  return subtotal + shippingFee - discountAmount;
};

/**
 * Transform form data thành payload cho API
 * @param {Object} formData - Dữ liệu từ form
 * @returns {Object} Payload cho API createOrder
 */
export const transformToOrderPayload = (formData) => {
  return {
    shippingAddress: {
      receiverName: formData.receiverName,
      receiverPhone: formData.receiverPhone,
      receiverEmail: formData.receiverEmail,
      province: formData.province,
      district: formData.district,
      ward: formData.ward,
      detail: formData.detail,
    },
    paymentMethod: formData.paymentMethod,
    couponCode: formData.couponCode || null,
  };
};
