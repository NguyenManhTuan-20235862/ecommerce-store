import User from "../models/User.js";
import * as userService from "../services/userService.js";

// GET /api/users — Lấy danh sách tất cả users (Admin)
export const getAllUsers = async (req, res) => {
  try {
    const { search } = req.query;
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

    const users = await User.find(query)
      .select("-hashedPassword")
      .sort({ createdAt: -1 });

    return res.status(200).json({ users });
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
