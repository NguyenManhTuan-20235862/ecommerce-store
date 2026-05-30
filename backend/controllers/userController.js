import fs from "fs";
import path from "path";
import User from "../models/User.js";
import * as userService from "../services/userService.js";

// GET /api/users — Lấy danh sách tất cả users (Admin) — có phân trang server-side
export const getAllUsers = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const safeSearch = search
      ? search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      : null;
    const query = safeSearch
      ? {
          $or: [
            { displayName: { $regex: safeSearch, $options: "i" } },
            { email: { $regex: safeSearch, $options: "i" } },
            { username: { $regex: safeSearch, $options: "i" } },
          ],
        }
      : {};

    const pageNum  = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(query)
        .select("-hashedPassword")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    return res.status(200).json({
      users,
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách users:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// GET /api/users/me — Lấy thông tin user hiện tại
export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// PUT /api/users/me — Cập nhật thông tin profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { displayName, email, phone } = req.body;

    const updated = await userService.updateProfile(userId, { displayName, email, phone });

    return res.status(200).json({
      success: true,
      message: "Cập nhật thông tin thành công",
      data: { user: updated },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    const status = error.message.includes("Email") ? 409 : 400;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// GET /api/users/me/wishlist — Lấy danh sách wishlist
export const getWishlist = async (req, res) => {
  try {
    const wishlist = await userService.getWishlist(req.user._id);
    return res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    console.error("Lỗi khi lấy wishlist:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

// POST /api/users/me/wishlist — Thêm sản phẩm vào wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: "Thiếu productId" });
    }
    await userService.addToWishlist(req.user._id, productId);
    return res.status(200).json({ success: true, message: "Đã thêm vào Wishlist" });
  } catch (error) {
    console.error("Lỗi khi thêm wishlist:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/me/wishlist/:productId — Xóa sản phẩm khỏi wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    await userService.removeFromWishlist(req.user._id, req.params.productId);
    return res.status(200).json({ success: true, message: "Đã xóa khỏi Wishlist" });
  } catch (error) {
    console.error("Lỗi khi xóa wishlist:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/users/me/addresses — Lấy danh sách địa chỉ
export const getAddresses = async (req, res) => {
  try {
    const addresses = await userService.getAddresses(req.user._id);
    return res.status(200).json({ success: true, data: addresses });
  } catch (error) {
    console.error("Lỗi khi lấy địa chỉ:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống" });
  }
};

// POST /api/users/me/addresses — Thêm địa chỉ mới
export const addAddress = async (req, res) => {
  try {
    const { province, district, ward, detail } = req.body;
    if (!province || !district || !ward || !detail) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin địa chỉ bắt buộc" });
    }
    const addresses = await userService.addAddress(req.user._id, { province, district, ward, detail });
    return res.status(201).json({ success: true, message: "Thêm địa chỉ thành công", data: addresses });
  } catch (error) {
    console.error("Lỗi khi thêm địa chỉ:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/users/me/addresses/:addressId — Cập nhật địa chỉ
export const updateAddress = async (req, res) => {
  try {
    const addresses = await userService.updateAddress(req.user._id, req.params.addressId, req.body);
    return res.status(200).json({ success: true, message: "Cập nhật địa chỉ thành công", data: addresses });
  } catch (error) {
    console.error("Lỗi khi cập nhật địa chỉ:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// DELETE /api/users/me/addresses/:addressId — Xóa địa chỉ
export const deleteAddress = async (req, res) => {
  try {
    const addresses = await userService.deleteAddress(req.user._id, req.params.addressId);
    return res.status(200).json({ success: true, message: "Xóa địa chỉ thành công", data: addresses });
  } catch (error) {
    console.error("Lỗi khi xóa địa chỉ:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// PUT /api/users/me/addresses/:addressId/default — Đặt địa chỉ mặc định
export const setDefaultAddress = async (req, res) => {
  try {
    const addresses = await userService.setDefaultAddress(req.user._id, req.params.addressId);
    return res.status(200).json({ success: true, message: "Đặt địa chỉ mặc định thành công", data: addresses });
  } catch (error) {
    console.error("Lỗi khi đặt địa chỉ mặc định:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// POST /api/users/me/avatar — Upload ảnh đại diện
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Không có file nào được upload" });
    }

    const user = await User.findById(req.user._id);

    // Xóa file avatar cũ nếu có
    if (user.avatarId) {
      const oldPath = path.join(process.cwd(), "uploads", user.avatarId);
      fs.unlink(oldPath, (err) => {
        if (err) console.error("Không thể xóa avatar cũ:", err.message);
      });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const avatarUrl = `${baseUrl}/uploads/${req.file.filename}`;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl, avatarId: req.file.filename },
      { new: true, select: "-hashedPassword" }
    );

    return res.status(200).json({
      message: "Cập nhật ảnh đại diện thành công",
      avatarUrl: updated.avatarUrl,
    });
  } catch (error) {
    console.error("Lỗi khi upload avatar:", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// PUT /api/users/me/password — Đổi mật khẩu
export const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Thiếu mật khẩu hiện tại hoặc mật khẩu mới",
      });
    }

    // Validate mật khẩu mới (tối thiểu 8 ký tự)
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Mật khẩu mới phải có ít nhất 8 ký tự",
      });
    }

    // Gọi service để đổi mật khẩu
    await userService.updatePassword(userId, currentPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Lỗi khi đổi mật khẩu", error);

    // Xử lý lỗi cụ thể
    if (error.message === "Mật khẩu hiện tại không chính xác") {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};
