import express from "express";
import {
  getAllCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protectedRoute, adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ====== PUBLIC ROUTES ======
router.get("/", getAllCategories);
router.get("/:slug", getCategoryBySlug);

// ====== ADMIN ROUTES ======
router.post("/", protectedRoute, adminRoute, createCategory);
router.put("/:id", protectedRoute, adminRoute, updateCategory);
router.delete("/:id", protectedRoute, adminRoute, deleteCategory);

export default router;
