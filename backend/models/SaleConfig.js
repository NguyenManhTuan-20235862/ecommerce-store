import mongoose from "mongoose";

const tierSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    threshold: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, required: true, min: 0, max: 100 },
    perks: [{ type: String, trim: true }],
    order: { type: Number, default: 0 },
  },
  { _id: false },
);

const saleConfigSchema = new mongoose.Schema(
  {
    tiers: [tierSchema],
  },
  { timestamps: true },
);

export default mongoose.model("SaleConfig", saleConfigSchema);
