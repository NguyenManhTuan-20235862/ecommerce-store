import express from "express";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getCart,
  removeItem,
  updateItemQuantity,
} from "../controllers/cartController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Tất cả các route cart đều cần xác thực
router.use(protectedRoute);

// Lấy giỏ hàng
router.get("/", getCart);

// Thêm sản phẩm vào giỏ hàng
router.post("/add", addToCart);

// Cập nhật số lượng item
router.put("/update-quantity", updateItemQuantity);

// Xóa item
router.delete("/remove", removeItem);

// Xóa toàn bộ giỏ hàng
router.delete("/clear", clearCart);

// Áp dụng mã coupon
router.post("/apply-coupon", applyCoupon);

export default router;
