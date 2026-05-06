import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import User from "../models/User.js";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 ngày

// Tạo accessToken + refreshToken, lưu session vào DB
export const generateTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL },
  );

  const refreshToken = crypto.randomBytes(64).toString("hex");

  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return { accessToken, refreshToken };
};

// Rotate refresh token — xóa session cũ, tạo session mới
export const rotateRefreshToken = async (oldRefreshToken) => {
  if (!oldRefreshToken) throw new Error("Không có refresh token");

  const session = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!session) throw new Error("Phiên đăng nhập không hợp lệ hoặc đã hết hạn");

  if (new Date() > session.expiresAt) {
    await Session.deleteOne({ _id: session._id });
    throw new Error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại");
  }

  const user = await User.findById(session.userId).select("-hashedPassword");
  if (!user) throw new Error("Không tìm thấy tài khoản");

  // Xóa session cũ trước (token rotation — ngăn tái sử dụng)
  await Session.deleteOne({ _id: session._id });

  // Tạo cặp token mới
  const { accessToken, refreshToken: newRefreshToken } = await generateTokens(user);
  return { accessToken, refreshToken: newRefreshToken, user };
};

// Xóa session (dùng khi signOut)
export const invalidateSession = async (refreshToken) => {
  if (refreshToken) {
    await Session.deleteOne({ refreshToken });
  }
};

// Tùy chọn cookie nhất quán giữa signIn và signOut
export const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: REFRESH_TOKEN_TTL_MS,
  };
};
