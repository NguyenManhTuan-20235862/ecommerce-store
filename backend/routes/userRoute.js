import express from "express";
import { getAllUsers, authMe, updatePassword, updateProfile } from "../controllers/userController.js";
import { adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// protectedRoute đã được apply global tại server.js

// GET /api/users/me — Lấy thông tin user hiện tại
router.get("/me", authMe);

// PUT /api/users/me — Cập nhật thông tin profile
router.put("/me", updateProfile);

// PUT /api/users/me/password — Đổi mật khẩu
router.put("/me/password", updatePassword);

// ====== ADMIN ROUTES ======
// GET /api/users — Lấy danh sách tất cả users
router.get("/", adminRoute, getAllUsers);

export default router;