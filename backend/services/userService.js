import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const updateProfile = async (userId, { displayName, email, phone }) => {
  if (!displayName || !email) {
    throw new Error("Tên hiển thị và email không được để trống");
  }

  // Kiểm tra email đã tồn tại ở user khác chưa
  if (email) {
    const existing = await User.findOne({ email: email.toLowerCase().trim(), _id: { $ne: userId } });
    if (existing) throw new Error("Email này đã được sử dụng bởi tài khoản khác");
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    {
      displayName: displayName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone?.trim() || undefined,
    },
    { new: true, runValidators: true }
  ).select("-hashedPassword");

  if (!updated) throw new Error("Không tìm thấy tài khoản");
  return updated;
};

/**
 * Đổi mật khẩu cho user
 * @param {string} userId - ID của user
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu mới
 * @returns {Promise<void>}
 * @throws {Error} Nếu mật khẩu hiện tại sai hoặc user không tồn tại
 */
export const updatePassword = async (userId, currentPassword, newPassword) => {
  // 1. Tìm user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User không tồn tại");
  }

  // 2. Verify mật khẩu hiện tại
  const isPasswordValid = await bcrypt.compare(currentPassword, user.hashedPassword);
  if (!isPasswordValid) {
    throw new Error("Mật khẩu hiện tại không chính xác");
  }

  // 3. Hash mật khẩu mới
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 4. Cập nhật vào DB
  user.hashedPassword = hashedPassword;
  await user.save();
};
