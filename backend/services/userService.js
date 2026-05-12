import bcrypt from "bcryptjs";
import mongoose from "mongoose";
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

export const getWishlist = async (userId) => {
  const user = await User.findById(userId).populate({
    path: "wishlist",
    match: { isActive: true },
    select: "name slug price images",
  });
  if (!user) throw new Error("Không tìm thấy tài khoản");
  return user.wishlist;
};

export const addToWishlist = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("productId không hợp lệ");
  }
  await User.findByIdAndUpdate(userId, { $addToSet: { wishlist: productId } });
};

export const removeFromWishlist = async (userId, productId) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new Error("productId không hợp lệ");
  }
  await User.findByIdAndUpdate(userId, { $pull: { wishlist: productId } });
};

export const getAddresses = async (userId) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) throw new Error("Không tìm thấy tài khoản");
  return user.addresses;
};

export const addAddress = async (userId, { province, district, ward, detail }) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) throw new Error("Không tìm thấy tài khoản");
  if (user.addresses.length >= 10) throw new Error("Tối đa 10 địa chỉ");

  const isDefault = user.addresses.length === 0;
  user.addresses.push({ province, district, ward, detail, isDefault });
  await user.save();
  return user.addresses;
};

export const updateAddress = async (userId, addressId, addressData) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) throw new Error("Không tìm thấy tài khoản");
  const address = user.addresses.id(addressId);
  if (!address) throw new Error("Không tìm thấy địa chỉ");

  if (addressData.isDefault) {
    user.addresses.forEach((a) => { a.isDefault = false; });
  }
  Object.assign(address, addressData);
  await user.save();
  return user.addresses;
};

export const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) throw new Error("Không tìm thấy tài khoản");
  const address = user.addresses.id(addressId);
  if (!address) throw new Error("Không tìm thấy địa chỉ");

  const wasDefault = address.isDefault;
  address.deleteOne();
  if (wasDefault && user.addresses.length > 0) {
    user.addresses[0].isDefault = true;
  }
  await user.save();
  return user.addresses;
};

export const setDefaultAddress = async (userId, addressId) => {
  const user = await User.findById(userId).select("addresses");
  if (!user) throw new Error("Không tìm thấy tài khoản");
  const address = user.addresses.id(addressId);
  if (!address) throw new Error("Không tìm thấy địa chỉ");

  user.addresses.forEach((a) => { a.isDefault = false; });
  address.isDefault = true;
  await user.save();
  return user.addresses;
};
