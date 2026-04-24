import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./libs/db.js";
import { protectedRoute } from "./middlewares/authMiddleware.js";
import authRoute from "./routes/authRoute.js";
import cartRoute from "./routes/cartRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";
import uploadRoute from "./routes/uploadRoute.js";
import userRoute from "./routes/userRoute.js";

dotenv.config();

// Lấy __dirname cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

const envAllowedOrigins = [
  ...(process.env.CORS_ORIGINS || "").split(","),
  process.env.FRONTEND_URL || "",
]
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = new Set([
  ...defaultAllowedOrigins,
  ...envAllowedOrigins,
]);

const corsOrigin = (origin, callback) => {
  // Allow non-browser clients/tools that do not send Origin header.
  if (!origin || allowedOrigins.has(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS blocked for origin: ${origin}`));
};

// Middlewares
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  }),
);
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
app.use("/api/cart", cartRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
  });
});
