import Coupon from "../models/Coupon.js";

export const validateAndApplyCoupon = async (code, orderAmount) => {
  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new Error("Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa");

  if (coupon.expiresAt && new Date() > coupon.expiresAt)
    throw new Error("Mã giảm giá đã hết hạn");

  if (coupon.maxUses !== null && coupon.usedCount >= coupon.maxUses)
    throw new Error("Mã giảm giá đã đạt giới hạn sử dụng");

  if (orderAmount < coupon.minOrderValue)
    throw new Error(
      `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString("vi-VN")}₫ để dùng mã này`,
    );

  const discountAmount =
    coupon.discountType === "percent"
      ? Math.round((orderAmount * coupon.discountValue) / 100)
      : Math.min(coupon.discountValue, orderAmount);

  return { discountAmount, coupon };
};

export const getAllCoupons = async () => Coupon.find().sort({ createdAt: -1 });

export const createCoupon = async (data) => {
  const coupon = new Coupon(data);
  return coupon.save();
};

export const updateCoupon = async (id, data) =>
  Coupon.findByIdAndUpdate(id, data, { new: true, runValidators: true });

export const deleteCoupon = async (id) => Coupon.findByIdAndDelete(id);
