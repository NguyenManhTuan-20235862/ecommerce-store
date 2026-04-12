import jwt from "jsonwebtoken";
import User from "../models/User.js";

// authorization - xác minh user là ai
export const protectedRoute = async (req, res, next) => {
  try {
    // lấy token từ header
    const authHeader = req.headers["authorization"];
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null; // Bearer <token>

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // xác nhận token hợp lệ
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // tìm user
    const user = await User.findById(decodedUser.userId).select(
      "-hashedPassword",
    );

    if (!user) {
      return res.status(404).json({ message: "người dùng không tồn tại." });
    }

    // trả user về trong req
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ message: "Access token hết hạn hoặc không đúng" });
    }

    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

// middleware quản trị viên
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Từ chối truy cập! Đặc quyền Admin." });
  }
};
