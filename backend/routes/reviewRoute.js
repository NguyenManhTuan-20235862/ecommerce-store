import express from "express";
import {
  createReview,
  deleteReview,
  getProductReviews,
} from "../controllers/reviewController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";

// mergeParams: true để nhận :productId từ productRoute cha
const router = express.Router({ mergeParams: true });

router.get("/", getProductReviews);
router.post("/", protectedRoute, createReview);
router.delete("/:reviewId", protectedRoute, deleteReview);

export default router;
