# Đặc Tả Kỹ Thuật (Technical Specification): Chức năng Đăng nhập & Đăng ký

## 1. Tổng Quan
Xây dựng giao diện và luồng xử lý Đăng nhập (Sign In) & Đăng ký (Sign Up) cho phía Khách hàng (Customer-facing site). Giao diện này sẽ kết nối trực tiếp với backend (hiện đã hoàn thiện một phần) để xử lý xác thực thông qua JWT và bảo mật theo mục tiêu đề ra trong `TOPIC GR1.md`.

## 2. Functional Requirements (Yêu Cầu Chức Năng)

### 2.1 Đăng ký (Sign Up)
- **Luồng hoạt động**: Người dùng điền thông tin vào Form đăng ký -> Nhấn gửi -> Gọi API Backend -> Nếu thành công, hiển thị toast báo hiệu và chuyển form đăng nhập -> Nếu lỗi (trùng email, thiếu thông tin...), hiển thị cảnh báo đỏ thân thiện.
- **Fields yêu cầu**: Tên đăng nhập (username), Email, Tên/Họ (firstName, lastName), Mật khẩu (password).
- **Validation (Frontend)**: 
  - Password: Tối thiểu 6 ký tự.
  - Email: Đúng định dạng Email.
  - Form: Bắt buộc điền đủ các trường có dấu hoa thị (*).

### 2.2 Đăng nhập (Sign In)
- **Luồng hoạt động**: Thông tin `username` & `password` -> Gọi API Backend (authController.js) -> Backend trả về `accessToken` và gài `refreshToken` vào Cookie HttpOnly -> Zustand Store cập nhật global state -> Redirect trang chủ.
- **Xử lý đăng xuất (Sign Out)**: Xóa thông tin Global State -> Gọi API `/api/auth/signout` để vô hiệu hóa Cookie.

## 3. Hiển thị & UI/UX (Chuẩn `CLAUDE.md`)
- **Vị trí Layout**: Tạo trang độc lập (`/login`, `/register`) với bố cục 2 cột: 1 cột là ảnh bìa chuẩn thời trang Nam giới hiện đại, 1 cột là Form tối giản.
- **Định hướng Style (Minimalist/Premium)**:
  - Form đi trên nền trắng hoàn toàn (hoặc xám nhạt #f9f9f9). Input boxes không có viền bao bọc, chỉ có `border-bottom` mềm mại.
  - Buttons (Gọi Hành Động) có màu Đen trơn lì, chữ màu trắng, font Outfit hoặc Inter.
  - Label và placeholder cần thiết kế mảnh và dễ chịu. 
  - Animation (Framer Motion): Chuyển màn mượt và hiệu ứng lỗi input rung nhẹ lôi cuốn.

## 4. Database Schema (Đã Tồn Tại - Tham chiếu)
Không phải bổ sung Models mới. `backend/models` đã quy định:
- **`User` Collection**: `username`, `email`, `hashedPassword`, `displayName`, `avatarUrl`, `phone`, `bio`.
- **`Session` Collection**: Lưu trữ `refreshToken` và `expiresAt`.

## 5. API Endpoints (Nối với Backend)
- `POST /api/auth/register` (Mapping tới `signUp` tại `authController.js`)
  - **Body**: `{ username, password, email, firstName, lastName }`
- `POST /api/auth/login` (Mapping tới `signIn`)
  - **Body**: `{ username, password }`
  - **Response**: `{ accessToken, message }` kèm Cookie.
- `POST /api/auth/logout` (Mapping tới `signOut`)

## 6. State Management (Yêu cầu Frontend)
Sử dụng Zustand.
- Tạo Store `useAuthStore`.
- **States**: `user` (lưu info người đăng nhập dở), `accessToken` (string), `isAuthenticated` (bool).
- **Actions**: `loginWithApi()`, `registerWithApi()`, `logout()`.
