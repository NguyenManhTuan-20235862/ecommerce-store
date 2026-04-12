import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import { connectDB } from "../libs/db.js";

// Khởi tạo biến môi trường để đọc MONGODB_CONNECTIONSTRING
dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    console.log("Kết nối DB thành công. Đang rà soát Admin...");

    const checkAdmin = await User.findOne({ username: "admin" });
    if (checkAdmin) {
      console.log("Admin đã tồn tại trong hệ thống. Hủy seed.");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("123456", 10);
    
    await User.create({
      username: "admin",
      email: "admin@menswear.com",
      hashedPassword: hashedPassword,
      displayName: "Super Admin",
      role: "admin",
    });

    console.log("✅ Seed Admin thành công! Login với: admin / 123456");
    process.exit();
  } catch (error) {
    console.error("Lỗi khi seed Admin:", error);
    process.exit(1);
  }
};

seedAdmin();
