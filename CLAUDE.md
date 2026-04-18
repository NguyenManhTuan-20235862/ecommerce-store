# Hướng Dẫn Dự Án & Trợ Lý AI (CLAUDE.md)

## 📌 Tổng Quan Dự Án

- **Tên dự án:** Men's Fashion E-commerce Website
- **Mục tiêu:** Xây dựng hệ thống web thương mại điện tử chuyên bán quần áo, đồ phụ kiện thời trang dành riêng cho Nam giới (Menswear). Gồm đầy đủ chức năng cốt lõi cho cả Khách hàng (Customer) và Quản trị viên (Admin) dựa trên đồ án `docs/topic/TOPIC GR1.md`.
- **Yêu cầu cốt lõi:** Đáp ứng đầy đủ tính năng (40%), Giao diện & UX tốt (15%), Code sạch/chuẩn (15%), Bảo mật tuyệt đối (10%).

## 🎨 Nguyên Tắc Thiết Kế Giao Diện (UI/UX)

- **Phong cách chủ đạo:** Tối giản (Minimalism), Hiện đại (Modern), Sang trọng (Premium E-commerce) và Chuyên nghiệp.
- **Cảm hứng thiết kế:** Theo style của website "Filling Pieces" (Layout rộng, hình ảnh lớn tập trung vào chi tiết cấu trúc, cảm giác gọn gàng sang trọng).
- **Chi tiết UI/UX:**
  - **Màu sắc:** Dùng nền trung tính sáng kiểu warm gray (`#F9F6F5`, `#F3F0EF`) kết hợp hệ chữ xám đậm (`#2F2F2E`, `#5C5B5B`) và **accent xanh điện** (`#004BE3` -> `#819BFF`) cho CTA, link, trạng thái tương tác. Tránh dùng accent đỏ/cam trong các màn Auth và các màn cần đồng bộ nhận diện mới.
  - **Typography:** Lựa chọn các bộ font hiện đại, thanh lịch (ví dụ: Inter, Outfit, hoặc các font chữ đặc trưng của mảng thời trang). Text cần lớn, rõ ràng và có độ tương phản cao.
  - **Không gian (Space):** Tận dụng tối đa khoảng trắng (Negative/White space). Các khối (blocks) được giãn cách để tạo sự thoải mái cho đôi mắt.
  - **Chuyển động (Motion):** Bổ sung các micro-animations (hiệu ứng hover, chuyển slide mượt, fade-in trang) tinh tế để tăng tính tương tác, không nên làm quá lố.

## 🛠 Technology Stack (Đề xuất theo lịch sử dự án)

- **Frontend:** ReactJS, Tailwind CSS (để style dễ dàng theo định hướng tối giản), Framer Motion (cho micro-animations), Zustand (quản lý state).
- **Backend:** Node.js vớt Express.
- **Database:** MongoDB.
- **Bảo mật & Auth:** JWT (JSON Web Tokens), Bcrypt (mã hóa mật khẩu).

## 💻 Nguyên tắc Coding (Coding Standards)

### Frontend

- Xây dựng component rõ ràng, có khả năng tái sử dụng (Atoms, Molecules, Organisms).
- Luôn kiểm tra tính Responsive (Mobile, Tablet, Desktop) trên từng component, ưu tiên cách tiếp cận Mobile-First.
- Tối ưu hóa việc render lại, validate form kỹ lưỡng ngay tại frontend trước khi gọi API.

### Backend & Database

- Mô hình kiến trúc rõ ràng (Routes -> Controllers -> Models), code chia tách theo từng feature.
- **Bảo mật đầu ra & vào:** Validate dữ liệu request (tránh SQL/NoSQL Injection, XSS), quản lý luồng lỗi (error handling middleware) tập trung phục vụ response đồng nhất.
- Đảm bảo database có các index hợp lý để tối ưu query, có sẵn dữ liệu mẫu (Seeder) phục vụ việc chạy thử nghiệm.

## 🤖 Nguyên Tắc Dành Cho AI (Khi Phục Vụ Dự Án Này)

1. **Ngôn ngữ:** Luôn giao tiếp, giải đáp và comment bằng **Tiếng Việt**.
2. **Định hướng thiết kế:** Khi code giao diện bằng HTML/CSS/Tailwind, LUÔN đảm bảo việc thiết kế đi theo phương châm trang nhã, tối giản, sang trọng.
3. **Bám sát yêu cầu nghiệp vụ:** Khi triển khai tính năng mới, luôn tự động đối chiếu với `docs/topic/TOPIC GR1.md` để đáp ứng đúng quy định của đồ án môn học.
4. **Bảo mật & Clean Code:** Code sinh ra cung cấp tới người dùng phải trực quan, dễ mở rộng, có đầy đủ các block kiểm tra lỗi (Try/Catch), an toàn về bảo mật ngay từ những dòng code nhỏ nhất.

## 📊 Trạng Thái Dự Án (Project Status)

### 1. Những gì đã hoàn thành (Completed)

- **Backend (Auth Core) đã ổn định cho local dev**:
  - Hoàn thiện luồng Đăng ký, Đăng nhập, Đăng xuất với JWT + Bcrypt.
  - `signIn` hỗ trợ đăng nhập bằng `username` hoặc `email` (identifier linh hoạt).
  - Cookie refresh token cấu hình theo môi trường (`production`/`development`) để chạy localhost mượt.
  - Có phân quyền cơ bản theo `role: "admin" | "customer"` và seeder tạo admin ban đầu.
- **Frontend (Auth State + API Layer)**:
  - `authStore` dùng `zustand` + `persist`, có `hydrateAuth()` khi app khởi động.
  - Axios API có interceptor gắn Bearer token (`setAccessToken`) để gọi route bảo vệ.
  - Luồng Đăng nhập/Đăng ký đã nối backend, trạng thái đăng nhập được đồng bộ.
- **Frontend (UI/UX chính)**:
  - Login/Register đã redesign theo định hướng Figma và bảng màu mới trong CLAUDE.md.
  - Home page đã cập nhật theo concept mới, nội dung chính đã Việt hóa.
  - Header mới đã hoàn thiện: dropdown menu desktop, menu mobile, account menu theo role, nút đăng xuất.
  - Đã bổ sung route `/shop` và `/cart` để tránh dead link từ điều hướng chính.
- **Validation build**:
  - Frontend đã build thành công sau các thay đổi lớn gần nhất.

### 2. Trạng thái hiện tại

- **Module Khách hàng:**
  - ✅ Đã xong: Auth flow, Home (dữ liệu thật từ API), Header/Footer, điều hướng chính.
  - 🔨 Đang ở mức khung: Shop (có FilterSidebar placeholder), Cart placeholder.
  - ❌ Chưa hoàn chỉnh: Checkout thật, Profile thật, Product Detail thật, Wishlist.
- **Module Quản trị (Admin):**
  - ✅ Admin Panel hoàn chỉnh: Layout sidebar (icon, active state, user info, logout).
  - ✅ Dashboard: Stats cards (tổng SP, danh mục, featured, hết hàng) + quick actions.
  - ✅ CRUD Sản phẩm: Bảng danh sách (search, phân trang), Form tạo/sửa (upload ảnh, biến thể, validation), Xóa.
  - ✅ Route admin được bảo vệ bởi `AdminRoute` (check auth + role).
  - 🔨 Placeholder: Categories, Orders, Customers, Coupons admin pages.
- **Backend nghiệp vụ bán hàng:**
  - ✅ API Product CRUD + filter/sort/pagination/search (public + admin).
  - ✅ API Category CRUD (public + admin).
  - ✅ API Upload ảnh local (multer, max 5 files, 5MB/file).
  - ❌ Chưa có API Order/Cart/Checkout theo scope đồ án.
- **Database:**
  - ✅ Model `User`, `Session` (Auth).
  - ✅ Model `Product` (variants, images, giá VNĐ, virtual totalStock, text index).
  - ✅ Model `Category` (name, slug, description, image).
  - ✅ Seeder: 5 danh mục + 14 sản phẩm mẫu (7 featured).
  - ❌ Chưa có model `Order`, `Coupon`, `Review`.

### 3. Bước tiếp theo cần làm (Lộ trình)

- **Worktree 1 (Admin/Products):** ✅ **ĐÃ HOÀN THÀNH**
  - Model + API CRUD Product/Category ở backend.
  - Admin UI nối API thật (list/create/update/delete).
  - Homepage hiển thị sản phẩm thật từ API (không còn fake data).

- **Worktree 2 (Customer/Shop) — ĐANG CHỜ:**
  - Hoàn thiện trang Shop: listing, filter, sort, search, pagination.
  - Trang Chi tiết sản phẩm: gallery ảnh, chọn biến thể, sản phẩm liên quan.
  - Đồng bộ query params từ UI -> API.

- **Worktree 3 (Cart/Checkout) — ĐANG CHỜ:**
  - Hoàn thiện store giỏ hàng + trang Cart thật (line item, subtotal, coupon).
  - Triển khai Checkout flow end-to-end và tạo Order.
  - Trang Profile: lịch sử đơn hàng, quản lý địa chỉ, đổi mật khẩu.

- **Worktree 4 (Admin mở rộng) — ĐANG CHỜ:**
  - Quản lý đơn hàng (cập nhật trạng thái).
  - Quản lý khách hàng (khóa/mở tài khoản).
  - Quản lý mã giảm giá (tạo mã, % giảm, hạn dùng).
  - Thống kê doanh thu (biểu đồ tuần/tháng).

### 4. Quyết định quan trọng & Lý do (Key Decisions)

- **Thiết kế "Editorial/Lookbook" (2 Cột to thay vì 4 Cột nhỏ)**: Đánh bật nhận diện thời trang High-end của đồ án, nhắm tối đa 15% điểm sáng tạo/giao diện thay vì các Template mỳ ăn liền.
- **Authentication qua HttpOnly Cookie**: Không vứt Token ngớ ngẩn ở LocalStorage. Cấu hình bảo mật CORS gắt gao ngay từ đầu để ôm trọn 10% điểm số bảo mật (Chống XSS/CSRF hoàn toàn).
- **Phân quyền dính kèm Payload JWT**: Gắn thẳng `user.role` vào payload lúc Sign-in để FE render đúng quyền ngay, giảm số call kiểm tra role.
- **Ưu tiên không để dead link trên điều hướng chính**: Các route nền như `/shop`, `/cart` được tạo sớm để bảo toàn UX trong giai đoạn phát triển song song.
- **Upload ảnh Local (multer)**: Lưu ảnh vào `backend/uploads/` thay vì dùng cloud service. Đơn giản, nhanh, phù hợp cho đồ án và demo local. Có thể migrate sang Cloudinary sau nếu cần deploy.
- **Giá VNĐ thống nhất toàn dự án**: Tất cả giá sản phẩm đều lưu và hiển thị bằng VNĐ với `Intl.NumberFormat("vi-VN")`.
