import express from "express";
import {
  createOrder,
  getAllOrders,
  getDashboardStats,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// protectedRoute đã được apply global tại server.js

// ====== CUSTOMER ROUTES ======
// Lấy danh sách đơn hàng của tôi
router.get("/me", getMyOrders);

// Tạo đơn hàng mới
router.post("/", createOrder);

// Khách hàng hủy đơn hàng (khi còn ở trạng thái pending)
router.put("/:id/cancel", cancelOrder);

// ====== ADMIN ROUTES ======
// Thống kê dashboard (phải đặt trước /:id)
router.get("/stats", adminRoute, getDashboardStats);

// Lấy danh sách toàn bộ đơn hàng
router.get("/", adminRoute, getAllOrders);

// Admin cập nhật trạng thái đơn hàng
router.put("/:id/status", adminRoute, updateOrderStatus);

// ====== CHUNG ======
// Xem chi tiết đơn hàng (controller tự kiểm tra quyền của user/admin)
router.get("/:id", getOrderById);

export default router;
