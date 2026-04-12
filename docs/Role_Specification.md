# Đặc Tả Kỹ Thuật: Hệ thống Phân Quyền (Role-Based Access Control)

## 1. Tổng Quan
Xây dựng cơ chế phân quyền để phân tách ranh giới rõ ràng giữa Khách hàng (Customer) và Quản trị viên (Admin). Giúp chặn người dùng thường truy cập vào các API Dashboard, đồng thời cập nhật Frontend nhận diện được quyền hạn của tài khoản đang đăng nhập.

## 2. Functional Requirements (Yêu Cầu Chức Năng)

### 2.1 Cập nhật Database
- **Model `User.js`**: Bổ sung trường `role` (kiểu String, giá trị mặc định là `"customer"`, chỉ chấp nhận `"customer"` hoặc `"admin"`).

### 2.2 Backend Phân Quyền (Middlewares & Controllers)
- **Middleware `adminRoute`**: Xây dựng hàm chặn đứng mọi Request nếu `req.user.role` không phải là `"admin"`. Hàm này sẽ chặn ngay lập tức với lỗi `403 Forbidden`.
- **Cập nhật `signIn`**: API đăng nhập sau khi xác thực hợp lệ sẽ trả về không chỉ `accessToken`, mà bắt buộc phải trả thêm thông tin người dùng: `user: { _id, username, displayName, role }` thay vì gửi một message suông.
- **Tạo Admin Đầu Tiên (Seeder)**: Lập một file `backend/seeders/adminSeeder.js` để tự động tạo một tài khoản `admin` (ví dụ `admin/123456`) phục vụ việc test trang Dashboard tương lai.

### 2.3 Cập nhật Giao diện & State (Frontend)
- **Cập nhật `useAuthStore.js`**: Khi Login thành công, bắt giá trị `role` và toàn bộ Object `user` nạp vào Store thay vì tạo Mock data.
- **Tạo Protected Components**: Tương lai sẽ bọc các Routes của Admin Dashboard trong một hàm bảo vệ (`AdminRoute`). Tạm thời ở giai đoạn này, chỉ cần `Zustand` lưu đúng chữ `"admin"`.

## 3. UI/UX (Định hướng)
- Vì đây là tính năng bảo mật chìm, UI tạm thời không thay đổi. Nếu đăng nhập bằng quyền Admin, sẽ chuẩn bị sẵn logic để hiển thị Menu "Trang Quản Trị" trên Header (nếu Header được sinh ra).

## 4. API Endpoints Ảnh Hưởng
- `POST /api/auth/signin`
  - Body: Giữ nguyên.
  - Response: Bổ sung thêm object `user` => `{ message, accessToken, user: { username, role, displayName } }`.
