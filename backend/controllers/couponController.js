import * as couponService from "../services/couponService.js";

const handleError = (res, err) => {
  if (err.name === "CastError") return res.status(400).json({ message: "ID không hợp lệ" });
  if (err.name === "ValidationError") {
    const msg = Object.values(err.errors)[0]?.message || err.message;
    return res.status(400).json({ message: msg });
  }
  console.error(err);
  return res.status(500).json({ message: "Lỗi server" });
};

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

export const getPublicCoupons = async (_req, res) => {
  try {
    const data = await couponService.getPublicCoupons();
    res.json({ message: "OK", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const getAllCoupons = async (_req, res) => {
  try {
    const data = await couponService.getAllCoupons();
    res.json({ message: "Lấy danh sách mã giảm giá thành công", data });
  } catch (err) {
    handleError(res, err);
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxUses, expiresAt, isActive, isPublic } =
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
    const data = await couponService.createCoupon({
      code,
      discountType,
      discountValue,
      minOrderValue: minOrderValue || 0,
      maxUses: maxUses || null,
      expiresAt: expiresAt || null,
      isActive: isActive !== undefined ? isActive : true,
      isPublic: isPublic === true,
    });
    res.status(201).json({ message: "Tạo mã giảm giá thành công", data });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });
    }
    handleError(res, err);
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
    const { code: _code, ...updatePayload } = req.body;
    const data = await couponService.updateCoupon(req.params.id, updatePayload);
    if (!data) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({ message: "Cập nhật thành công", data });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });
    }
    handleError(res, err);
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const data = await couponService.deleteCoupon(req.params.id);
    if (!data) return res.status(404).json({ message: "Không tìm thấy mã giảm giá" });
    res.json({ message: "Đã xóa mã giảm giá" });
  } catch (err) {
    handleError(res, err);
  }
};
