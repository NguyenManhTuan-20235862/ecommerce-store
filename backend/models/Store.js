import mongoose from "mongoose";

const storeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên cửa hàng là bắt buộc"],
      trim: true,
      maxlength: [100, "Tên không quá 100 ký tự"],
    },
    cityKey: {
      type: String,
      enum: {
        values: ["SG", "HN", "ĐN", "HP"],
        message: "cityKey phải là SG, HN, ĐN hoặc HP",
      },
      required: [true, "cityKey là bắt buộc"],
    },
    tag: {
      type: String,
      trim: true,
      default: "",
    },
    address: {
      type: String,
      trim: true,
      default: "",
    },
    time: {
      type: String,
      trim: true,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
      default: "",
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    mapSrc: {
      type: String,
      default: "",
    },
    mapsUrl: {
      type: String,
      default: "",
    },
    imgUrl: {
      type: String,
      default: "",
    },
    imgId: {
      type: String,
      default: "",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

storeSchema.index({ order: 1 });

const Store = mongoose.model("Store", storeSchema);
export default Store;
