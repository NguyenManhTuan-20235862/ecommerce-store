import Cart from "../models/Cart.js";
import { getOrCreateCart, resolveProduct } from "../services/cartService.js";

// GET /api/cart — Lấy giỏ hàng của user
export const getCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.populate("items.productId");

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/cart/add — Thêm sản phẩm vào giỏ
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, selectedSize, selectedColor } = req.body;

    const product = await resolveProduct(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tìm thấy" });
    }

    const cart = await getOrCreateCart(req.user.id);
    const realProductId = product._id.toString();

    const existingItem = cart.items.find(
      (item) =>
        item.productId.toString() === realProductId &&
        item.selectedSize  === selectedSize &&
        item.selectedColor === selectedColor,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: realProductId,
        productName:  product.name,
        productImage: product.images?.[0] || "",
        quantity,
        price:         product.price,
        selectedSize,
        selectedColor,
      });
    }

    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ success: true, message: "Thêm vào giỏ hàng thành công", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/cart/update-quantity — Cập nhật số lượng item
export const updateItemQuantity = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ success: false, message: "Số lượng phải ≥ 1" });
    }

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tìm thấy" });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item không tìm thấy trong giỏ hàng" });
    }

    item.quantity = quantity;
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ success: true, message: "Cập nhật số lượng thành công", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/remove — Xóa một item khỏi giỏ
export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tìm thấy" });
    }

    cart.items.id(itemId).deleteOne();
    await cart.save();
    await cart.populate("items.productId");

    res.status(200).json({ success: true, message: "Xóa item thành công", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/cart/clear — Xóa toàn bộ giỏ
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tìm thấy" });
    }

    cart.items      = [];
    cart.couponCode = null;
    await cart.save();

    res.status(200).json({ success: true, message: "Xóa giỏ hàng thành công", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/cart/apply-coupon — Áp dụng mã coupon (placeholder)
export const applyCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;

    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Giỏ hàng không tìm thấy" });
    }

    // TODO: validate coupon qua CouponService khi có Coupon model
    cart.couponCode = couponCode;
    await cart.save();

    res.status(200).json({ success: true, message: "Áp dụng mã coupon thành công", data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
