import Order from "../models/Order.js";
import Product from "../models/Product.js";
import Review from "../models/Review.js";

export const getReviewsByProduct = async (productId) => {
  const reviews = await Review.find({ productId })
    .populate("userId", "displayName")
    .sort({ createdAt: -1 });

  if (reviews.length === 0) return [];

  // Bulk check delivered orders — 1 query thay vì N queries
  const userIds = [...new Set(reviews.map((r) => r.userId._id.toString()))];
  const deliveredOrders = await Order.find({
    userId: { $in: userIds },
    status: "delivered",
    "items.productId": productId,
  }).select("userId");

  const verifiedSet = new Set(deliveredOrders.map((o) => o.userId.toString()));

  return reviews.map((r) => ({
    ...r.toObject(),
    isVerified: verifiedSet.has(r.userId._id.toString()),
  }));
};

export const createReview = async (userId, productId, { rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error("Sản phẩm không tồn tại");

  const review = await Review.create({
    userId,
    productId,
    rating,
    comment: comment?.trim() || "",
  });

  await review.populate("userId", "displayName");

  const delivered = await Order.findOne({
    userId,
    status: "delivered",
    "items.productId": productId,
  });

  return { ...review.toObject(), isVerified: Boolean(delivered) };
};

export const deleteReview = async (reviewId, requester) => {
  const review = await Review.findById(reviewId);
  if (!review) throw new Error("Đánh giá không tồn tại");

  const isOwner = review.userId.toString() === requester._id.toString();
  const isAdmin = requester.role === "admin";

  if (!isOwner && !isAdmin) {
    throw new Error("Bạn không có quyền xóa đánh giá này");
  }

  await Review.findByIdAndDelete(reviewId);
};
