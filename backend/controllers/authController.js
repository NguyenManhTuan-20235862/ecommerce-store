import bcrypt from "bcryptjs";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import Session from "../models/Session.js";
import User from "../models/User.js";

const ACCESS_TOKEN_TTL = "30m"; // 30 phút
const REFRESH_TOKEN_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedFirstName = firstName?.trim();
    const normalizedLastName = lastName?.trim();

    if (
      !normalizedUsername ||
      !password ||
      !normalizedEmail ||
      !normalizedFirstName ||
      !normalizedLastName
    ) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName, và lastName",
      });
    }

    // Kiểm tra nếu username hoặc email đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username hoặc email đã tồn tại" });
    }
    // Hash password (mã hoá mật khẩu)
    const hashedPassword = await bcrypt.hash(password, 10);
    // Tạo user mới
    await User.create({
      username: normalizedUsername,
      hashedPassword,
      email: normalizedEmail,
      displayName: `${normalizedFirstName} ${normalizedLastName}`,
    });

    //return
    return res.sendStatus(204); // 204 No Content
  } catch (error) {
    console.error("Lỗi khi đăng ký", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    // lấy inputs
    const { username, email, identifier, password } = req.body;
    const loginIdentifier = (identifier || username || email || "")
      .toString()
      .trim()
      .toLowerCase();

    if (!loginIdentifier || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu email/username và password" });
    }

    // lấy hashedPassword trong db để so với password input
    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không chính xác" });
    }

    // Kiểm tra password
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Username hoặc password không chính xác" });
    }

    // nếu khớp, tạo accessToken với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL },
    );

    // tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex"); // 128 ký tự ngẫu nhiên

    // tạo session mới để lưu refresh token
    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
    });

    // trả refresh token về trong cookie
    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: REFRESH_TOKEN_TTL_MS,
    };

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
    });

    // trả access token và bộ info về trong res
    return res.status(200).json({
      message: `User ${user.username} logged in successfully`,
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signOut = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (token) {
      // xóa refresh token trong session
      await Session.deleteOne({ refreshToken: token });

      // xóa cookie
      const isProduction = process.env.NODE_ENV === "production";
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
      });
    }
    return res.sendStatus(204); // 204 No Content
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
