# BÁO CÁO TIẾN ĐỘ DỰ ÁN
## Vibe Urban — Website Thương Mại Điện Tử Thời Trang Nam

**Nhóm thực hiện:** GR1
**Ngày báo cáo:** 07/05/2026
**Lần báo cáo:** Lần 1 — Tổng kết giai đoạn đầu

---

## 1. TỔNG QUAN DỰ ÁN

| Thông tin | Chi tiết |
|---|---|
| **Tên dự án** | Vibe Urban — Men's Fashion E-commerce |
| **Mục tiêu** | Website TMĐT bán quần áo, phụ kiện thời trang Nam giới, đầy đủ chức năng cho cả Khách hàng (Customer) và Quản trị viên (Admin) |
| **Phong cách thiết kế** | Tối giản, hiện đại, cao cấp — lấy cảm hứng từ phong cách editorial của các thương hiệu thời trang quốc tế |

---

## 2. CÔNG NGHỆ SỬ DỤNG

| Tầng | Công nghệ |
|---|---|
| **Frontend** | React 19, React Router 7, Tailwind CSS 4, Zustand 5 (state), React Hook Form + Zod (form validation), Axios, Lucide React, Sonner |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Bảo mật** | JWT (Access Token 30 phút + Refresh Token 14 ngày), Bcrypt (hash mật khẩu), HttpOnly Cookie |
| **Upload ảnh** | Multer (lưu local) |

---

## 3. TÍNH NĂNG ĐÃ HOÀN THÀNH

### 3.1 Hệ thống Xác Thực (Authentication)

- **Đăng ký** tài khoản mới với validation đầy đủ (Zod schema)
- **Đăng nhập** bằng username **hoặc** email + mật khẩu
- **Đăng xuất** xóa session khỏi database
- **Refresh Token Rotation**: Tự động làm mới Access Token khi hết hạn, không yêu cầu đăng nhập lại. Session cũ bị hủy ngay khi rotate (bảo mật chống token reuse)
- Axios interceptor tự động xử lý hàng đợi request trong khi đang refresh

### 3.2 Giao Diện Khách Hàng (Customer)

| Trang | Mô tả |
|---|---|
| **Landing Page** | Hero banner, Drops section, Trending products, Marquee, Lookbook — thiết kế editorial 2 cột |
| **Header** | Navigation desktop + dropdown menu, mobile menu (hamburger), badge số lượng giỏ hàng, link tài khoản & đơn hàng |
| **Trang Shop** | Danh sách sản phẩm lấy từ API thật, lọc theo danh mục, sắp xếp (giá, mới nhất), tải thêm (load more), grid sản phẩm nổi bật riêng |
| **Chi Tiết Sản Phẩm** | Gallery ảnh, chọn biến thể (size/màu), thêm vào giỏ hàng, danh sách sản phẩm liên quan |
| **Giỏ Hàng** | Tăng/giảm/xóa sản phẩm (đồng bộ API), hiển thị giá VNĐ, tính phí ship (miễn phí ≥ 500k), áp dụng mã giảm giá |
| **Thanh Toán** | Form nhập địa chỉ giao hàng (Zod + RHF), pre-fill họ tên/email từ tài khoản, tích hợp API tạo đơn, trang xác nhận thành công |
| **Hồ Sơ Cá Nhân** | Xem & chỉnh sửa thông tin (họ tên, email, SĐT), lịch sử đơn hàng, xem chi tiết đơn, hủy đơn, đổi mật khẩu |

### 3.3 Hệ Thống Quản Trị (Admin Panel)

| Module | Chức năng |
|---|---|
| **Dashboard** | 4 thẻ thống kê (tổng đơn hàng, doanh thu, đơn chờ xử lý, sản phẩm hết hàng), biểu đồ doanh thu 6 tháng, phân tích đơn theo trạng thái, top 5 sản phẩm bán chạy |
| **Quản lý Sản phẩm** | Danh sách + phân trang (10 items), tìm kiếm, xóa; Form thêm/sửa: upload ảnh (tối đa 5), quản lý biến thể (size/màu/giá/tồn kho) động |
| **Quản lý Danh mục** | Xem danh sách, thêm/sửa (modal), bật/tắt active, xóa với xác nhận |
| **Quản lý Đơn hàng** | Lọc theo trạng thái, cập nhật trạng thái inline, xem chi tiết (drawer), khóa terminal states (delivered/cancelled) |
| **Quản lý Khách hàng** | Tìm kiếm, danh sách, xem chi tiết khách hàng (drawer) |
| **Quản lý Mã giảm giá** | Danh sách, thêm/sửa/xóa, hỗ trợ: % hoặc số tiền cố định, giới hạn lượt dùng, ngày hết hạn, đơn tối thiểu |

### 3.4 Backend API

| Nhóm API | Endpoints |
|---|---|
| **Auth** | POST /signup, /signin, /signout, /refresh |
| **Product** | GET / (public), GET /admin/all, POST /, PUT /:id, DELETE /:id, GET /admin/:id |
| **Category** | GET /, POST /, PUT /:id, DELETE /:id |
| **Cart** | GET /, POST /add, PUT /update-quantity, DELETE /item/:id, DELETE /clear |
| **Order** | POST /, GET / (my orders), GET /:id, PUT /:id/cancel, PUT /:id/status (admin), GET /stats (admin) |
| **User** | GET /me, PUT /me, PUT /me/password, GET / (admin) |
| **Coupon** | POST /validate (user), GET /, POST /, PUT /:id, DELETE /:id (admin) |
| **Upload** | POST /upload (max 5 files, 5MB/file, JPEG/PNG/WebP/GIF) |

### 3.5 Bảo Mật & Kỹ Thuật Nổi Bật

- **State machine cho trạng thái đơn hàng**: `VALID_TRANSITIONS` map kiểm soát luồng chuyển đổi hợp lệ, terminal states không thể thay đổi
- **Atomic stock decrement**: Dùng `findOneAndUpdate` + `$elemMatch` để tránh race condition khi nhiều đơn hàng cùng lúc mua hết hàng; có rollback loop nếu thất bại
- **Chống ReDoS**: Escape regex từ user input trước khi dùng trong query
- **Email uniqueness check**: Khi cập nhật profile, kiểm tra email không trùng với tài khoản khác
- **Error state banner**: Admin Dashboard hiển thị banner cảnh báo khi API lỗi, không để số 0 im lặng gây nhầm lẫn

---

## 4. KIẾN TRÚC HỆ THỐNG

```
Frontend (React)
  ├── Service Layer (API calls)
  ├── Zustand Stores (global state)
  └── Zod + RHF (form validation)
        ↕ HTTP (Axios + JWT)
Backend (Express)
  ├── Routes
  ├── Controllers (thin — chỉ validate + gọi service + trả response)
  ├── Services (business logic)
  └── Models (Mongoose)
        ↕
MongoDB
```

---

## 5. TÍNH NĂNG CHƯA HOÀN THIỆN

| Tính năng | Trạng thái | Ưu tiên |
|---|---|---|
| **Wishlist** | Chưa có — icon Header hiện dẫn đến trang login | Cao |
| **Reviews (đánh giá sản phẩm)** | UI placeholder, chưa có logic gửi đánh giá | Trung bình |
| **Avatar upload (Profile)** | Chưa có — chỉ hiển thị chữ cái đầu tên | Thấp |
| **Load More > 50 sản phẩm** | Backend giới hạn 50 sản phẩm/lần, chưa fix | Thấp |

---

## 6. ĐÁNH GIÁ THEO TIÊU CHÍ CHẤM ĐIỂM

| Tiêu chí | Tỷ lệ | Nhận xét tự đánh giá |
|---|---|---|
| **Tính năng** | 40% | Đã cover phần lớn yêu cầu đồ án: auth, shop, cart, checkout, profile, toàn bộ admin panel. Còn thiếu wishlist và reviews. |
| **Giao diện & UX** | 15% | Thiết kế editorial premium theo phong cách thương hiệu thời trang, responsive, micro-animations tinh tế |
| **Code sạch/chuẩn** | 15% | Nhất quán pattern: Routes → Controllers → Services, Zod + RHF cho mọi form, service layer cho mọi API call |
| **Bảo mật** | 10% | JWT + Bcrypt, refresh token rotation, HttpOnly cookie, input validation, chống ReDoS, atomic operations |

---

## 7. KẾ HOẠCH GIAI ĐOẠN TIẾP THEO

1. **Wishlist** — Backend: model + API; Frontend: wishlist store, icon Header, trang wishlist
2. **Reviews** — Backend: Review model + API; Frontend: hiển thị + gửi đánh giá từ Product Detail
3. **Profile Avatar Upload** — Multer endpoint riêng cho avatar
4. **Hoàn thiện & kiểm thử** — End-to-end testing toàn bộ luồng chính

---

*Báo cáo được tổng hợp từ trạng thái dự án tính đến ngày 07/05/2026.*
