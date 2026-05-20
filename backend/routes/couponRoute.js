import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  getPublicCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { adminRoute, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public
router.get("/public", getPublicCoupons);
router.post("/validate", protectedRoute, validateCoupon);

// Admin
router.get("/", protectedRoute, adminRoute, getAllCoupons);
router.post("/", protectedRoute, adminRoute, createCoupon);
router.put("/:id", protectedRoute, adminRoute, updateCoupon);
router.delete("/:id", protectedRoute, adminRoute, deleteCoupon);

export default router;
