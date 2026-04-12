# Kỹ Năng Sinh Code (Generate Code Skill)

### Step 1: Phân Tích Yêu Cầu & Specs
- Đọc kỹ tài liệu Technical Specification từ @pm.
- Tham chiếu đến `CLAUDE.md` để đảm bảo nắm rõ kiến trúc và định hướng UI/UX (sang trọng, tối giản).
- Tham chiếu đến `docs/topic/TOPIC GR1.md` để kiểm tra các logic bắt buộc của đồ án.
- Hỏi người dùng: "Bạn có muốn tôi tiến hành code dựa trên spec này không?" trước khi thực sự sinh code.

### Step 2: Xử Lý Thông Tin Thiếu (Handle Missing Details)
Nếu Specification thiếu thông tin quan trọng (API endpoints, database schema, cấu trúc thư mục):
- **DỪNG LẠI** và hỏi người dùng để làm rõ. Bắt buộc giao tiếp bằng **Tiếng Việt**.
- KHÔNG TỰ BỊA ra các chi tiết quan trọng bị thiếu.

### Step 3: Scaffold & Viết Code
- Lưu code vào đúng cấu trúc thư mục của dự án (ví dụ: `frontend/`, `backend/`, hoặc thư mục module tương ứng). KHÔNG tự ý lưu vào thư mục `app_build/`.
- Viết code HOÀN THIỆN (không dùng placeholder hay comment kiểu "...", "điền code ở đây").
- Cập nhật đủ file cấu hình liên quan (ví dụ: package.json, vite.config.js, v.v.).
- Bám sát chính xác Tech Stack quy định (ReactJS, Tailwind CSS, Node.js, v.v.).

### Step 4: Tự Kiểm Tra (Self-Verification - AUTOMATIC)
Sau khi viết toàn bộ code, AI tự động rà soát nhanh:
- [ ] Mọi file liệt kê trong spec đều đã được tạo ra.
- [ ] Không có lỗi cú pháp (syntax errors) cơ bản.
- [ ] Dependencies (ngoại vi) được liệt kê đủ trong package.json.
- [ ] Có Entry point rõ ràng.
- [ ] Đã thêm file `.env.example` nếu hệ thống cần biến môi trường.

Nếu phát hiện bất kỳ lỗi nào → **FIX NGAY LẬP TỨC** trước khi kết thúc bước sinh code.

### Step 5: Báo Cáo Hoàn Thành (Signal Completion)
Cấu trúc đầu ra (Output):
✅ Quá trình sinh code hoàn tất!
📂 Vị trí lưu mã nguồn: [liệt kê đường dẫn]
🚀 Hướng dẫn khởi chạy: [cung cấp lệnh chạy chính xác, ví dụ "cd frontend && npm install && npm run dev"]

## Tiêu Chuẩn Chất Lượng Code (Code Quality Standards)
- **Tên file Component**: PascalCase.
- **Tên thư mục/file hệ thống**: kebab-case hoặc camelCase.
- **Thụt lề (Format)**: 2 spaces.
- **Comment**: Thêm document giải thích bằng Tiếng Việt cho các public API và logic phức tạp.
- **Clean Code**: Loại bỏ hoàn toàn các import và biến khai báo nhưng không sử dụng.
