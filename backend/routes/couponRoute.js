import express from "express";
import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
  validateCoupon,
} from "../controllers/couponController.js";
import { adminRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// protectedRoute đã apply globally tại server.js
router.post("/validate", validateCoupon);
router.get("/", adminRoute, getAllCoupons);
router.post("/", adminRoute, createCoupon);
router.put("/:id", adminRoute, updateCoupon);
router.delete("/:id", adminRoute, deleteCoupon);

export default router;
