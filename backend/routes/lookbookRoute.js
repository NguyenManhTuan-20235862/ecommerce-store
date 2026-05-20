import express from "express";
import {
  createStory,
  deleteStory,
  getAllStories,
  getStories,
  updateStory,
} from "../controllers/lookbookController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public: lấy stories đang active (không cần đăng nhập)
router.get("/", getStories);

// Admin: quản lý stories (cần đăng nhập + role admin)
router.get("/admin", protectedRoute, adminRoute, getAllStories);
router.post("/", protectedRoute, adminRoute, createStory);
router.put("/:id", protectedRoute, adminRoute, updateStory);
router.delete("/:id", protectedRoute, adminRoute, deleteStory);

export default router;
