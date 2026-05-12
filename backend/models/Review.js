import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      required: [true, "Rating là bắt buộc"],
      min: [1, "Rating tối thiểu là 1"],
      max: [5, "Rating tối đa là 5"],
      validate: {
        validator: Number.isInteger,
        message: "Rating phải là số nguyên",
      },
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, "Bình luận không quá 1000 ký tự"],
      default: "",
    },
  },
  { timestamps: true }
);

// Mỗi user chỉ được review 1 lần / 1 sản phẩm
reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

// Truy vấn nhanh theo sản phẩm, mới nhất trước
reviewSchema.index({ productId: 1, createdAt: -1 });

const Review = mongoose.model("Review", reviewSchema);
export default Review;
