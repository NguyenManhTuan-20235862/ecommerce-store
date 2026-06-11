import mongoose from "mongoose";

const lookbookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Tiêu đề là bắt buộc"],
      trim: true,
      maxlength: [100, "Tiêu đề không quá 100 ký tự"],
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    imageId: {
      type: String,
      default: "",
    },
    aspectRatio: {
      type: String,
      enum: ["16:9", "4:5", "3:4", "8:4"],
      default: "4:5",
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true },
);

lookbookSchema.index({ order: 1 });

const Lookbook = mongoose.model("Lookbook", lookbookSchema);
export default Lookbook;
