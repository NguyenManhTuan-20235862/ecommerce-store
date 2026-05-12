import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Lấy giỏ hàng, tự tạo mới nếu user chưa có
export const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    await cart.save();
  }
  return cart;
};

// Tìm sản phẩm bằng ObjectId hoặc slug
export const resolveProduct = async (productId) => {
  if (mongoose.Types.ObjectId.isValid(productId)) {
    return Product.findById(productId);
  }
  return Product.findOne({ slug: productId });
};

// Tìm variant khớp với size và color đã chọn
export const findMatchingVariant = (product, selectedSize, selectedColor) => {
  if (!product.variants || product.variants.length === 0) return null;
  return product.variants.find((v) => {
    const sizeMatch = !selectedSize || v.size === selectedSize.toUpperCase();
    const colorMatch = !selectedColor || v.color.toLowerCase() === selectedColor.toLowerCase();
    return sizeMatch && colorMatch;
  });
};
