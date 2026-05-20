import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percent", "fixed"], required: true },
    discountValue: { type: Number, required: true, min: 1 },
    minOrderValue: { type: Number, default: 0 },
    maxUses: { type: Number, default: null },
    usedCount: { type: Number, default: 0 },
    expiresAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true },
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Coupon", couponSchema);
