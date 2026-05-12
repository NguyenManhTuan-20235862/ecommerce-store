import express from "express";
import {
  getProducts,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from "../controllers/productController.js";
import { protectedRoute, adminRoute } from "../middlewares/authMiddleware.js";
import reviewRoute from "./reviewRoute.js";

const router = express.Router();

// ====== PUBLIC ROUTES ======
// Danh sách sản phẩm (phân trang, lọc, sắp xếp)
router.get("/", getProducts);

// Chi tiết sản phẩm theo slug
router.get("/:slug", getProductBySlug);

// Sản phẩm liên quan (cùng danh mục)
router.get("/:slug/related", getRelatedProducts);

// ====== ADMIN ROUTES (cần đăng nhập + role admin) ======
// Lấy tất cả sản phẩm cho Admin (kể cả inactive)
router.get("/admin/all", protectedRoute, adminRoute, getAdminProducts);

// Lấy chi tiết sản phẩm theo ID cho Admin
router.get("/admin/:id", protectedRoute, adminRoute, getProductById);

// Tạo sản phẩm mới
router.post("/", protectedRoute, adminRoute, createProduct);

// Cập nhật sản phẩm
router.put("/:id", protectedRoute, adminRoute, updateProduct);

// Xóa sản phẩm
router.delete("/:id", protectedRoute, adminRoute, deleteProduct);

// Reviews theo sản phẩm — GET public, POST/DELETE tự bảo vệ
router.use("/:productId/reviews", reviewRoute);

export default router;
