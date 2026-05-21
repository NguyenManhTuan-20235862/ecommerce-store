import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema(
  {
    hotline: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      default: "",
    },
    zalo: {
      type: String,
      trim: true,
      default: "",
    },
    press: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);
export default SiteConfig;
