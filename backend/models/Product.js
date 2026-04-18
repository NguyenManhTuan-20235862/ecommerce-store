import mongoose from "mongoose";

// Schema cho từng biến thể (size + màu + tồn kho)
const variantSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: [true, "Size là bắt buộc"],
      trim: true,
      uppercase: true, // S, M, L, XL, XXL...
    },
    color: {
      type: String,
      required: [true, "Màu sắc là bắt buộc"],
      trim: true,
    },
    stock: {
      type: Number,
      required: true,
      min: [0, "Tồn kho không thể âm"],
      default: 0,
    },
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      trim: true,
      maxlength: [200, "Tên sản phẩm không quá 200 ký tự"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [5000, "Mô tả không quá 5000 ký tự"],
    },
    // Giá bán thực tế (VNĐ)
    price: {
      type: Number,
      required: [true, "Giá sản phẩm là bắt buộc"],
      min: [0, "Giá không thể âm"],
    },
    // Giá gốc (trước khuyến mãi) để hiển thị "gạch ngang"
    compareAtPrice: {
      type: Number,
      default: 0,
      min: [0, "Giá gốc không thể âm"],
    },
    // Liên kết đến danh mục
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Danh mục là bắt buộc"],
    },
    brand: {
      type: String,
      trim: true,
      default: "",
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
    },
    // Mảng ảnh sản phẩm (gallery nhiều ảnh)
    images: [
      {
        type: String, // URL ảnh (local: "/uploads/xxx.jpg")
      },
    ],
    // Mảng biến thể (size + color + stock)
    variants: [variantSchema],
    // Chất liệu, hướng dẫn bảo quản
    material: {
      type: String,
      trim: true,
      default: "",
    },
    careInstructions: {
      type: String,
      trim: true,
      default: "",
    },
    // Flags điều khiển hiển thị
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual field: tổng tồn kho tính từ tất cả variants
productSchema.virtual("totalStock").get(function () {
  if (!this.variants || this.variants.length === 0) return 0;
  return this.variants.reduce((sum, variant) => sum + variant.stock, 0);
});

// Indexes tối ưu cho filter, sort và search
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text", sku: "text" });

const Product = mongoose.model("Product", productSchema);
export default Product;
