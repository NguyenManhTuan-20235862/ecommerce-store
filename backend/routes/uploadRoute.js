import express from "express";
import { upload, uploadImages } from "../controllers/uploadController.js";
import { protectedRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Upload tối đa 5 ảnh cùng lúc — chỉ Admin mới có quyền
router.post(
  "/",
  protectedRoute,
  adminRoute,
  upload.array("images", 5),
  uploadImages,
);

export default router;
