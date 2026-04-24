import mongoose from "mongoose";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// Lấy giỏ hàng của user hiện tại
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    let cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

    // Xác định sản phẩm bằng ObjectId thật hoặc slug
    let product;
    if (mongoose.Types.ObjectId.isValid(productId)) {
      product = await Product.findById(productId);
    } else {
      product = await Product.findOne({ slug: productId });
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Sản phẩm không tìm thấy",
      });
    }

    // Lưu lại ObjectId chuẩn sau khi tra xét
    const realProductId = product._id.toString();

    // Lấy hoặc tạo giỏ hàng
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Kiểm tra xem sản phẩm đã có trong giỏ chưa
    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === realProductId &&
        item.selectedSize === selectedSize &&
        item.selectedColor === selectedColor,
    );

    if (existingItem) {
      // Cập nhật số lượng
      existingItem.quantity += quantity;
    } else {
      // Thêm item mới
      cart.items.push({
        productId: realProductId,
        productName: product.name,
        productImage: product.images?.[0] || "",
        quantity,
        price: product.price,
        selectedSize,
        selectedColor,
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Thêm vào giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Cập nhật số lượng item
export const updateItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Số lượng phải ≥ 1",
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng không tìm thấy",
      });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item không tìm thấy trong giỏ hàng",
      });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Cập nhật số lượng thành công",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa item từ giỏ hàng
export const removeItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng không tìm thấy",
      });
    }

    cart.items.id(itemId).deleteOne();
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({
      success: true,
      message: "Xóa item thành công",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Xóa toàn bộ giỏ hàng
export const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng không tìm thấy",
      });
    }

    cart.items = [];
    cart.couponCode = null;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Xóa giỏ hàng thành công",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Áp dụng mã coupon
export const applyCoupon = async (req, res) => {
  try {
    const userId = req.user.id;
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Giỏ hàng không tìm thấy",
      });
    }

    // TODO: Thêm logic kiểm tra coupon từ database
    cart.couponCode = couponCode;
    await cart.save();

    res.status(200).json({
      success: true,
      message: "Áp dụng mã coupon thành công",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
