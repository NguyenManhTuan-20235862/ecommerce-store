import Cart from "../models/Cart.js";
import { findMatchingVariant, getOrCreateCart, resolveProduct } from "../services/cartService.js";

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
    const {
      productId, quantity = 1, selectedSize, selectedColor,
      comboGroupId, comboName, originalPrice, price: priceOverride,
    } = req.body;

    const product = await resolveProduct(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Sản phẩm không tìm thấy" });
    }

    const cart = await getOrCreateCart(req.user.id);
    const realProductId = product._id.toString();

    // Combo items luôn tạo entry mới (không merge), item thường mới merge nếu trùng
    const isComboItem = !!comboGroupId;
    const existingItem = isComboItem
      ? null
      : cart.items.find(
          (item) =>
            item.productId.toString() === realProductId &&
            item.selectedSize  === selectedSize &&
            item.selectedColor === selectedColor &&
            !item.comboGroupId,
        );

    if (product.variants && product.variants.length > 0) {
      const variant = findMatchingVariant(product, selectedSize, selectedColor);
      if (!variant) {
        return res.status(400).json({ success: false, message: "Biến thể sản phẩm không tồn tại" });
      }
      const currentQty = existingItem ? existingItem.quantity : 0;
      if (currentQty + quantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: variant.stock === 0 ? "Sản phẩm đã hết hàng" : `Chỉ còn ${variant.stock} sản phẩm trong kho`,
        });
      }
    }

    // Giá lưu: dùng priceOverride nếu là combo item (đã tính prorated), ngược lại dùng giá sản phẩm
    const storedPrice =
      isComboItem && typeof priceOverride === "number" && priceOverride >= 0
        ? priceOverride
        : product.price;

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: realProductId,
        productName:  product.name,
        productImage: product.images?.[0] || "",
        quantity,
        price:        storedPrice,
        selectedSize,
        selectedColor,
        comboGroupId:  comboGroupId  || null,
        comboName:     comboName     || null,
        originalPrice: typeof originalPrice === "number" ? originalPrice : null,
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

    const product = await resolveProduct(item.productId.toString());
    if (product && product.variants && product.variants.length > 0) {
      const variant = findMatchingVariant(product, item.selectedSize, item.selectedColor);
      if (variant && quantity > variant.stock) {
        return res.status(400).json({
          success: false,
          message: variant.stock === 0 ? "Sản phẩm đã hết hàng" : `Chỉ còn ${variant.stock} sản phẩm trong kho`,
        });
      }
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
