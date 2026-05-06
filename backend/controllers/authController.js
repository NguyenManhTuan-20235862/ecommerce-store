import bcrypt from "bcryptjs";
import User from "../models/User.js";
import {
  generateTokens,
  getCookieOptions,
  invalidateSession,
  rotateRefreshToken,
} from "../services/authService.js";

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;
    const normalizedUsername = username?.trim().toLowerCase();
    const normalizedEmail = email?.trim().toLowerCase();
    const normalizedFirstName = firstName?.trim();
    const normalizedLastName = lastName?.trim();

    if (!normalizedUsername || !password || !normalizedEmail || !normalizedFirstName || !normalizedLastName) {
      return res.status(400).json({
        message: "Không thể thiếu username, password, email, firstName, và lastName",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Mật khẩu phải có ít nhất 8 ký tự" });
    }

    const existingUser = await User.findOne({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });
    if (existingUser) {
      return res.status(409).json({ message: "Username hoặc email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username: normalizedUsername,
      hashedPassword,
      email: normalizedEmail,
      displayName: `${normalizedFirstName} ${normalizedLastName}`,
    });

    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi đăng ký", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const signIn = async (req, res) => {
  try {
    const { username, email, identifier, password } = req.body;
    const loginIdentifier = (identifier || username || email || "")
      .toString()
      .trim()
      .toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({ message: "Thiếu email/username và password" });
    }

    const user = await User.findOne({
      $or: [{ username: loginIdentifier }, { email: loginIdentifier }],
    });
    if (!user) {
      return res.status(401).json({ message: "Username hoặc password không chính xác" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Username hoặc password không chính xác" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);
    res.cookie("refreshToken", refreshToken, getCookieOptions());

    return res.status(200).json({
      message: `User ${user.username} logged in successfully`,
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi đăng nhập", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const refresh = async (req, res) => {
  try {
    const oldRefreshToken = req.cookies?.refreshToken;
    const { accessToken, refreshToken, user } = await rotateRefreshToken(oldRefreshToken);

    res.cookie("refreshToken", refreshToken, getCookieOptions());
    return res.status(200).json({
      accessToken,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Lỗi khi refresh token:", error);
    res.clearCookie("refreshToken", getCookieOptions());
    return res.status(401).json({ message: error.message || "Phiên đăng nhập hết hạn" });
  }
};

export const signOut = async (req, res) => {
  try {
    await invalidateSession(req.cookies?.refreshToken);
    res.clearCookie("refreshToken", getCookieOptions());
    return res.sendStatus(204);
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
