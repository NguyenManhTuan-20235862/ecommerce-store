import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./libs/db.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { protectedRoute } from "./middlewares/authMiddleware.js";

dotenv.config();

// Lấy __dirname cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Phục vụ ảnh tĩnh từ thư mục uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====== PUBLIC ROUTES (không cần đăng nhập) ======
app.use("/api/auth", authRoute);
// Products & Categories có cả public + admin endpoints
// (admin endpoints tự bảo vệ bằng middleware riêng trong từng route)
app.use("/api/products", productRoute);
app.use("/api/categories", categoryRoute);

// ====== PRIVATE ROUTES (cần đăng nhập) ======
app.use(protectedRoute);
app.use("/api/users", userRoute);
app.use("/api/upload", uploadRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
});
