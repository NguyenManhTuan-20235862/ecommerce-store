import express from "express";
import {
  createCombo,
  deleteCombo,
  getAllCombos,
  getCombos,
  updateCombo,
} from "../controllers/comboController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", getCombos);

// Admin
router.get("/admin", protectedRoute, adminRoute, getAllCombos);
router.post("/", protectedRoute, adminRoute, createCombo);
router.put("/:id", protectedRoute, adminRoute, updateCombo);
router.delete("/:id", protectedRoute, adminRoute, deleteCombo);

export default router;
