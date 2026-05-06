import * as orderService from "../services/orderService.js";

// POST /api/orders — Tạo đơn hàng
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod, couponCode } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin nhận hàng hoặc phương thức thanh toán" });
    }

    const order = await orderService.createOrder(userId, shippingAddress, paymentMethod, couponCode);
    res.status(201).json({ success: true, message: "Đặt hàng thành công", data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/orders/me — Lấy danh sách đơn hàng của user đang đăng nhập
export const getMyOrders = async (req, res) => {
  try {
    const orders = await orderService.getUserOrders(req.user.id);
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id — Xem chi tiết 1 đơn hàng
export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await orderService.getOrderById(orderId);

    // Kiểm tra quyền truy cập: chỉ user tạo đơn hoặc admin mới được xem
    if (order.userId._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Từ chối truy cập" });
    }

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// GET /api/orders — Lấy toàn bộ đơn hàng (Dành cho Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/status — Admin cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: "Trạng thái không được để trống" });
    }

    const validStatuses = ["pending", "confirmed", "shipping", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Trạng thái không hợp lệ" });
    }

    const updatedOrder = await orderService.updateOrderStatus(orderId, status);
    res.status(200).json({ success: true, message: "Cập nhật trạng thái thành công", data: updatedOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/orders/stats — Thống kê tổng quan cho Admin Dashboard
export const getDashboardStats = async (_req, res) => {
  try {
    const stats = await orderService.getDashboardStats();
    res.status(200).json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/orders/:id/cancel — User tự hủy đơn hàng
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    const cancelledOrder = await orderService.cancelOrder(orderId, userId);
    res.status(200).json({ success: true, message: "Hủy đơn hàng thành công", data: cancelledOrder });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
