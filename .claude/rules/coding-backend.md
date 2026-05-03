---
description: Quy tắc coding Backend cho dự án — kiến trúc Routes/Controllers/Models, response format, error handling, validation, bảo mật. Áp dụng khi thêm route, controller hoặc model mới.
globs: ["backend/**/*.js"]
alwaysApply: false
---

# Nguyên Tắc Coding Backend

## Kiến trúc
- Pattern: **Routes → Controllers → Services → Models**, tách theo feature.
- **Controller phải mỏng:** chỉ làm 3 việc — validate input, gọi service, trả response. Business logic đặt trong `services/`.
- **Shared utilities** đặt tại `utils/` (vd: `slugUtils.js`). Không duplicate helper function giữa các file.
- Middleware xác thực (`protectedRoute`, `adminRoute`) áp dụng tại route level, không trong controller.
- File mới: đặt đúng folder (`routes/`, `controllers/`, `services/`, `models/`), đặt tên theo feature (vd: `orderRoute.js`, `orderController.js`, `orderService.js`).

## Response Format
```json
// Thành công
{ "message": "...", "data": { ... } }

// Thất bại
{ "message": "...", "error": "..." }
```
- Giữ format nhất quán, không trả về plain string hay array gốc ở top-level.

## Error Handling
- Mỗi controller tự xử lý try/catch — chưa có centralized error middleware, giữ pattern hiện tại.
- **Không** để lộ stack trace ra response (`error.stack` không đưa vào JSON trả về).
- Log lỗi ra console phía server là đủ.

## Validation
- Validate đầu vào tại controller **trước** khi query DB: kiểm tra field bắt buộc, kiểu dữ liệu.
- Trả về `400 Bad Request` khi thiếu/sai field.

## Bảo mật
- Mọi async function phải có `try/catch`.
- `protectedRoute` verify JWT từ `Authorization: Bearer <token>` header.
- `adminRoute` kiểm tra `req.user.role === "admin"`.
- Hash mật khẩu bằng Bcrypt (salt rounds = 10) — không lưu plain text.

## Database
- Index đã có trên các field query thường xuyên (category, price, text search) — không thêm index trùng.
- Seeder reset dữ liệu mẫu: `node backend/seeders/productSeeder.js`.
- Slug generation hỗ trợ tiếng Việt: NFD normalize + `ensureUniqueSlug` tránh duplicate.

## Upload ảnh
- Dùng Multer, lưu tại `backend/uploads/`.
- Giới hạn: tối đa 5 file, 5MB/file, chỉ chấp nhận JPEG/PNG/WebP/GIF.
