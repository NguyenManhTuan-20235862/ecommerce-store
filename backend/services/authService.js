import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

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
