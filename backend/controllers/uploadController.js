import multer from "multer";
import path from "path";
import crypto from "crypto";

// Cấu hình thư mục lưu & đặt tên file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Tạo tên file unique: timestamp + random hex + extension gốc
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, uniqueName);
  },
});

// Chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Chỉ cho phép upload file ảnh (JPEG, PNG, WebP, GIF)"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Tối đa 5MB mỗi ảnh
  },
});

// POST /api/upload — Upload 1 hoặc nhiều ảnh
export const uploadImages = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Không có file nào được upload" });
    }

    // Trả về mảng URL ảnh đã upload
    const urls = req.files.map(
      (file) => `/uploads/${file.filename}`,
    );

    return res.status(200).json({
      message: `Upload thành công ${urls.length} ảnh`,
      urls,
    });
  } catch (error) {
    console.error("Lỗi khi upload ảnh:", error);
    return res.status(500).json({ message: "Lỗi hệ thống khi upload" });
  }
};
