import mongoose from "mongoose";
import * as reviewService from "../services/reviewService.js";

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "productId không hợp lệ" });
    }
    const reviews = await reviewService.getReviewsByProduct(productId);
    return res.status(200).json({ message: "Lấy đánh giá thành công", reviews });
  } catch (error) {
    console.error("Lỗi khi lấy đánh giá:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "productId không hợp lệ" });
    }

    const { rating, comment } = req.body;
    const ratingNum = Number(rating);

    if (!rating || !Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: "Rating phải là số nguyên từ 1 đến 5" });
    }

    if (comment && String(comment).trim().length > 1000) {
      return res.status(400).json({ message: "Bình luận không quá 1000 ký tự" });
    }

    const review = await reviewService.createReview(req.user._id, productId, {
      rating: ratingNum,
      comment,
    });

    return res.status(201).json({ message: "Đánh giá thành công", review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Bạn đã đánh giá sản phẩm này rồi" });
    }
    console.error("Lỗi khi tạo đánh giá:", error);
    const status = error.message === "Sản phẩm không tồn tại" ? 404 : 500;
    return res.status(status).json({ message: error.message || "Lỗi hệ thống" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
      return res.status(400).json({ message: "reviewId không hợp lệ" });
    }

    await reviewService.deleteReview(reviewId, {
      _id: req.user._id,
      role: req.user.role,
    });

    return res.status(200).json({ message: "Đã xóa đánh giá" });
  } catch (error) {
    const status = error.message.includes("quyền")
      ? 403
      : error.message.includes("không tồn tại")
      ? 404
      : 500;
    if (status === 500) console.error("Lỗi khi xóa đánh giá:", error);
    return res.status(status).json({ message: error.message || "Lỗi hệ thống" });
  }
};
