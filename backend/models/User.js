import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  province: { type: String, required: true },
  district: { type: String, required: true },
  ward: { type: String, required: true },
  detail: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
}, { _id: true });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  hashedPassword: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: true,
    trim: true,
  },
  avatarUrl: {
    type: String, // link CDN để hiển thị hình
  },
  avatarId: {
    type: String, // Cloudinary public_id để xoá hình
  },
  bio: {
    type: String,
    maxlength: 500, // tuỳ
  },
  phone: {
    type: String,
    sparse: true, // cho phép null và không bắt buộc.
  },
  role: {
    type: String,
    enum: ["customer", "admin"],
    default: "customer",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  addresses: [addressSchema],
}, {
  timestamps: true // tự động thêm createdAt và updatedAt
});

const User = mongoose.model("User", userSchema);    
export default User;
