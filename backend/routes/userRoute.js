import express from "express";
import { getAllUsers, authMe, updatePassword, updateProfile, getWishlist, addToWishlist, removeFromWishlist } from "../controllers/userController.js";
import { adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// protectedRoute đã được apply global tại server.js

// GET /api/users/me — Lấy thông tin user hiện tại
router.get("/me", authMe);

// PUT /api/users/me — Cập nhật thông tin profile
router.put("/me", updateProfile);

// PUT /api/users/me/password — Đổi mật khẩu
router.put("/me/password", updatePassword);

// GET /api/users/me/wishlist
router.get("/me/wishlist", getWishlist);
// POST /api/users/me/wishlist
router.post("/me/wishlist", addToWishlist);
// DELETE /api/users/me/wishlist/:productId
router.delete("/me/wishlist/:productId", removeFromWishlist);

// ====== ADMIN ROUTES ======
// GET /api/users — Lấy danh sách tất cả users
router.get("/", adminRoute, getAllUsers);

export default router;