import mongoose from "mongoose";
import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { generateSlug, ensureUniqueSlug } from "../utils/slugUtils.js";

// Tìm sản phẩm bằng slug hoặc ObjectId (dùng cho public endpoints)
export const findByIdentifier = async (identifier) => {
  const filter = { isActive: true };
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    return Product.findOne({ _id: identifier, ...filter }).populate("category", "name slug");
  }
  return Product.findOne({ slug: identifier, ...filter }).populate("category", "name slug");
};

// Tạo slug duy nhất cho sản phẩm (excludeId dùng khi cập nhật)
export const generateProductSlug = async (name, excludeId = null) => {
  const base = generateSlug(name);
  return ensureUniqueSlug(Product, base, excludeId);
};

// Tìm sản phẩm bằng ID (dùng cho admin — bao gồm cả inactive)
export const findById = async (id) => {
  return Product.findById(id).populate("category", "name slug");
};

// Xây dựng filter query cho getProducts từ req.query
export const buildProductFilter = async (query) => {
  const { category, minPrice, maxPrice, size, color, brand, search, featured } = query;
  const filter = { isActive: true };

  if (category) {
    const cat = await Category.findOne({ slug: category });
    if (cat) filter.category = cat._id;
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (size) {
    filter["variants.size"] = { $in: size.split(",").map((s) => s.trim().toUpperCase()) };
  }

  if (color) {
    const safeColor = color.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter["variants.color"] = { $regex: safeColor, $options: "i" };
  }

  if (brand) {
    const safeBrand = brand.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.brand = { $regex: safeBrand, $options: "i" };
  }

  if (search) {
    filter.$text = { $search: search };
  }

  if (featured === "true") {
    filter.isFeatured = true;
  }

  return filter;
};
