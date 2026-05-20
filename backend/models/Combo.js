import mongoose from "mongoose";

const comboSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    subtitle: { type: String, trim: true, default: "" },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        label: { type: String, trim: true, default: "" },
      },
    ],
    comboPrice: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

comboSchema.index({ order: 1 });

export default mongoose.model("Combo", comboSchema);
