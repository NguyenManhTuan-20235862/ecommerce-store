import * as couponService from "../services/couponService.js";

export const validateCoupon = async (req, res) => {
  try {
    const { code, orderAmount } = req.body;
    if (!code) return res.status(400).json({ message: "Nhập mã giảm giá" });
    const { discountAmount } = await couponService.validateAndApplyCoupon(
      code,
      orderAmount || 0,
    );
    res.json({ message: "Mã hợp lệ", discountAmount });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json({ message: "Lấy danh sách mã giảm giá thành công", coupons });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxUses, expiresAt, isActive } =
      req.body;
    if (!code || !discountType || !discountValue) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc" });
    }
    if (!["percent", "fixed"].includes(discountType)) {
      return res.status(400).json({ message: "Loại giảm giá không hợp lệ" });
    }
    if (discountType === "percent" && Number(discountValue) > 100) {
      return res.status(400).json({ message: "Giảm theo % không được vượt quá 100%" });
    }
    const coupon = await couponService.createCoupon({
      code,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxUses: maxUses || null,
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? isActive : true,
    });
    res.status(201).json({ message: "Tạo mã giảm giá thành công", coupon });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });
    }
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const updateCoupon = async (req, res) => {
  try {
    const { discountType, discountValue, minOrderValue, maxUses } = req.body;
    if (discountType && !["percent", "fixed"].includes(discountType)) {
      return res.status(400).json({ message: "Loại giảm giá không hợp lệ" });
    }
    if (discountValue !== undefined && Number(discountValue) < 1) {
      return res.status(400).json({ message: "Giá trị giảm tối thiểu là 1" });
    }
    if (discountType === "percent" && discountValue !== undefined && Number(discountValue) > 100) {
      return res.status(400).json({ message: "Giảm theo % không được vượt quá 100%" });
    }
    if (minOrderValue !== undefined && Number(minOrderValue) < 0) {
      return res.status(400).json({ message: "Đơn hàng tối thiểu không được âm" });
    }
    if (maxUses !== undefined && maxUses !== null && Number(maxUses) < 1) {
      return res.status(400).json({ message: "Giới hạn số lần dùng tối thiểu là 1" });
    }
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    if (!coupon) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({ message: "Cập nhật thành công", coupon });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await couponService.deleteCoupon(req.params.id);
    if (!coupon) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({ message: "Đã xóa mã giảm giá" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
};
