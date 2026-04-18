# Kiến Trúc Frontend (Frontend Structure)

Dựa trên yêu cầu của dự án (theo `TOPIC GR1.md`) và các quy tắc thiết kế, coding (theo `CLAUDE.md`), cấu trúc dự án Frontend (React + Vite, Tailwind CSS, Zustand) được thiết kế nhằm mục đích tối giản, dễ bảo trì, dễ mở rộng và tuân thủ các nguyên tắc tái sử dụng Component.

Cấu trúc thư mục được đặt trong `src/` tuân theo mô hình **Feature-based** kết hợp **Atomic Design** thu gọn:

## Cấu Trúc Tổng Quan

```text
frontend/
├── public/                 # Các tài nguyên public (favicon, robots.txt, 3rd party scripts...)
└── src/
    ├── assets/             # Hình ảnh tĩnh, SVG, Font chữ (local assets)
    ├── components/         # Các UI component dùng chung trên toàn hệ thống
    │   ├── ui/             # Atoms/Molecules: Button, Input, Modal, Typography, Spinner...
    │   ├── form/           # Components liên quan đến form xử lý (React Hook Form bindings...)
    │   └── common/         # Khối UI chung: Breadcrumb, Pagination, ProductCard...
    ├── layouts/            # Các khung giao diện chính cho từng khu vực
    │   ├── RootLayout.jsx  # Layout cho Website Khách hàng (chứa Header, Footer chung)
    │   ├── AdminLayout.jsx # Layout cho Trang Quản trị (chứa Sidebar, Topbar)
    │   ├── Header.jsx      # Component Header khách hàng
    │   └── Footer.jsx      # Component Footer khách hàng
    ├── pages/              # Các trang chính của dự án (gom nhóm theo Domain)
    │   ├── Home/           # Trang chủ (Hero, Banner, Carousel...)
    │   ├── Auth/           # Đăng nhập, Đăng ký, Quên mật khẩu
    │   ├── Shop/           # Danh sách sản phẩm & Khối bộ lọc
    │   ├── Product/        # Chi tiết sản phẩm (Gallery, Chọn biến thể, Đánh giá)
    │   ├── Cart/           # Trang giỏ hàng
    │   ├── Checkout/       # Trang thanh toán
    │   ├── Profile/        # Tài khoản người dùng (Lịch sử đơn hàng, Quản lý địa chỉ, Đổi mật khẩu)
    │   └── Admin/          # Các trang quản trị (chia nhỏ theo tính năng yêu cầu)
    │       ├── Dashboard/  # Thống kê doanh thu, Số lượng đơn hàng, Top sản phẩm bán chạy
    │       ├── Products/   # Quản lý Sản phẩm (CRUD, hình ảnh, biến thể size/màu)
    │       ├── Categories/ # Quản lý Danh mục & Thuộc tính (size, màu, thương hiệu)
    │       ├── Orders/     # Quản lý Đơn hàng (Cập nhật trạng thái)
    │       ├── Customers/  # Quản lý Khách hàng (Khóa/mở tài khoản)
    │       └── Coupons/    # Quản lý Mã giảm giá
    ├── routes/             # Cấu hình định tuyến (React Router)
    │   ├── index.jsx       # Khởi tạo createBrowserRouter
    │   ├── ProtectedRoute.jsx # HOC bảo vệ route bắt buộc đăng nhập
    │   └── AdminRoute.jsx  # HOC bảo vệ route dành riêng cho role admin
    ├── services/           # Xử lý gọi API với Backend
    │   ├── api.js          # Cấu hình Axios instance mặc định (kèm interceptors)
    │   ├── auth.service.js # API đăng nhập, đăng ký...
    │   └── product.service.js # API lấy danh sách, chi tiết sản phẩm...
    ├── store/              # Quản lý Global State (Zustand)
    │   ├── authStore.js    # Quản lý state người dùng, JWT token, User Role
    │   ├── cartStore.js    # Quản lý state giỏ hàng (sync với LocalStorage hoặc Backend gốc)
    │   └── uiStore.js      # (Optional) Quản lý trạng thái UI chung (Sidebar mở/đóng, Modal gộp...)
    ├── hooks/              # Custom React Hooks
    │   ├── useDebounce.js  # Trì hoãn gõ phím khi search
    │   └── useClickOutside.js # Phát hiện click ra khỏi dropdown/modal
    ├── utils/              # Các hàm tiện ích (Helpers)
    │   ├── formatCurrency.js  # Format tiền tệ (VNĐ)
    │   ├── formatDate.js      # Format ngày tháng
    │   └── cn.js              # Tiện ích gộp class Tailwind (clsx + tailwind-merge)
    ├── lib/                # Cấu hình hoặc bọc (wrapper) cho các thư viện bên thứ 3
    ├── styles/             # Global css (nếu không dùng index.css trực tiếp) hoặc custom css
    ├── App.jsx             # Cấu hình Provider gộp (QueryClientProvider, RouterProvider...)
    └── main.jsx            # Entry point của ứng dụng
```

## Các Quyết Định Kiến Trúc (Architectural Decisions)

1. **Pages Directory (Domain-driven Structure)**:
   Mỗi folder trong `pages/` đại diện cho một Domain/Tính năng và nên chứa chính các component chỉ dùng cho trang đó (ví dụ: `pages/Home/components/HeroSection.jsx`). Điều này giúp thư mục `components` ở gốc không bị "chật chội" bởi những thứ không dùng chung.

2. **Components (`components/`)**:
   Chỉ chứa những UI components thực sự **Shared** (được sử dụng từ 2 trang trở lên). Ví dụ `ProductCard`, `Button`, `Input` là những component nên nằm ở đây.

3. **Routing Configuration**:
   Thay vì lồng ghép quá nhiều `Route` lộn xộn trong `App.jsx`, tách việc cấu hình định tuyến thông qua Object-based config của `react-router-dom` (như `createBrowserRouter`) sang folder `routes/` để dễ quản lý các middleware ảo như `<ProtectedRoute>` và `<AdminRoute>`.

4. **Service / API Layer**:
   - Sử dụng thư viện `axios` để tạo ra một instance duy nhất.
   - Thêm Axios Interceptors ở `api.js` để tự động đính kèm thông tin token (từ Cookie hoặc header) vào request, đồng thời xử lý các mã lỗi global (ví dụ bắt 401 thì bắn popup báo phiên đăng nhập hết hạn hoặc redirect tới trang `/login`).

5. **State Management**:
   - Dùng **Zustand** thay cho Redux vì Redux quá cồng kềnh với đồ án Ecommerce tĩnh giản.
   - Cần chia nhỏ store (ví dụ: `useAuthStore`, `useCartStore` thay vì dồn chung vào một cục lớn) để tối ưu re-render ở React.

6. **Theming & Styling**:
   - Dựa vào **Tailwind CSS**. Sẽ cấu hình `tailwind.config.js` bám sát yêu cầu thiết kế Tối giản (Monochrome) từ phân tích `CLAUDE.md`.
   - Các font chữ đặc trưng của UI cao cấp (Editorial Lookbook) sẽ được cài đặt và apply global ở phần theme mở rộng của Tailwind.

## Hướng Dẫn Thực Thi Theo Worktree Dành Cho Developer

Theo `CLAUDE.md`, quy trình hiện tại sẽ đi theo 3 luồng chia tác (Worktree):
- **Luồng 1 (Admin/Products)**: Khởi tạo view nằm trong `layouts/AdminLayout.jsx` và `pages/Admin/`. Bao gồm CRUD Sản phẩm.
- **Luồng 2 (Customer/Shop)**: Quản lý layout giao diện xem mặt hàng tại `pages/Shop/` kèm theo bộ lọc nằm trong `pages/Shop/components/FilterSidebar.jsx`.
- **Luồng 3 (Cart/Checkout)**: Quản lý tính năng lưu giỏ hàng ở `store/cartStore.js` và lên giao diện tại `pages/Cart/` & `pages/Checkout/`.

Tất cả các tài nguyên và thiết kế đều hướng đến việc tối ưu hoá trải nghiệm, giữ dung lượng web nhỏ nhẹ và bảo mật tốt.
