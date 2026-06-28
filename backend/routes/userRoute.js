import express from "express";
import { getAllUsers, toggleUserStatus, authMe, updatePassword, updateProfile, uploadAvatar, getWishlist, addToWishlist, removeFromWishlist, getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from "../controllers/userController.js";
import { adminRoute } from "../middlewares/authMiddleware.js";
import { upload } from "../controllers/uploadController.js";

const router = express.Router();

// protectedRoute đã được apply global tại server.js

// GET /api/users/me — Lấy thông tin user hiện tại
router.get("/me", authMe);

// PUT /api/users/me — Cập nhật thông tin profile
router.put("/me", updateProfile);

// POST /api/users/me/avatar — Upload ảnh đại diện
router.post("/me/avatar", upload.single("avatar"), uploadAvatar);

// PUT /api/users/me/password — Đổi mật khẩu
router.put("/me/password", updatePassword);

// GET /api/users/me/wishlist
router.get("/me/wishlist", getWishlist);
// POST /api/users/me/wishlist
router.post("/me/wishlist", addToWishlist);
// DELETE /api/users/me/wishlist/:productId
router.delete("/me/wishlist/:productId", removeFromWishlist);

// GET /api/users/me/addresses
router.get("/me/addresses", getAddresses);
// POST /api/users/me/addresses
router.post("/me/addresses", addAddress);
// PUT /api/users/me/addresses/:addressId
router.put("/me/addresses/:addressId", updateAddress);
// DELETE /api/users/me/addresses/:addressId
router.delete("/me/addresses/:addressId", deleteAddress);
// PUT /api/users/me/addresses/:addressId/default
router.put("/me/addresses/:addressId/default", setDefaultAddress);

// ====== ADMIN ROUTES ======
// GET /api/users — Lấy danh sách tất cả users
router.get("/", adminRoute, getAllUsers);

// PATCH /api/users/:id/status — Khóa/mở tài khoản
router.patch("/:id/status", adminRoute, toggleUserStatus);

export default router;