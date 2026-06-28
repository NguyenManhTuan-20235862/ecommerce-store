# BÁO CÁO ĐỒ ÁN CUỐI KỲ
## Vibe Urban — Website Thương Mại Điện Tử Thời Trang Nam

**Nhóm thực hiện:** GR1
**Ngày nộp:** 29/06/2026
**Môn học:** Phát triển Ứng dụng Web

---

## 1. TỔNG QUAN DỰ ÁN

| Thông tin | Chi tiết |
|---|---|
| **Tên dự án** | Vibe Urban — Men's Fashion E-commerce |
| **Mục tiêu** | Website thương mại điện tử bán quần áo, phụ kiện thời trang nam giới với đầy đủ chức năng cho cả Khách hàng (Customer) và Quản trị viên (Admin) |
| **Đối tượng sử dụng** | Nam giới 18–35 tuổi yêu thích phong cách đường phố (streetwear), urban fashion |
| **Phong cách thiết kế** | Tối giản, hiện đại, cao cấp — lấy cảm hứng từ phong cách editorial của các thương hiệu thời trang quốc tế (Filling Pieces) |
| **Phạm vi triển khai** | Chạy local (localhost) — không yêu cầu cloud |

### 1.1 Ý Tưởng & Lý Do Chọn Đề Tài

Thị trường thời trang nam tại Việt Nam đang tăng trưởng mạnh, đặc biệt phân khúc streetwear và urban fashion. Tuy nhiên, hầu hết website TMĐT trong nước có thiết kế chưa cao cấp, trải nghiệm mua sắm còn rời rạc. Nhóm xây dựng **Vibe Urban** với định hướng tạo ra trải nghiệm mua sắm editorial — nơi người dùng không chỉ mua hàng mà còn khám phá phong cách thông qua Lookbook, Sale page và giao diện động.

---

## 2. PHÂN CÔNG CÔNG VIỆC

| Thành viên | Mã SV | Công việc |
|---|---|---|
| Nguyễn Mạnh Tuấn | 20235862 | Toàn bộ dự án (full-stack): Backend API, Frontend UI, Database design, Animations, Testing |

---

## 3. CÔNG NGHỆ SỬ DỤNG

### 3.1 Frontend

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| React | 19.2.4 | UI framework |
| React Router | 7.14 | Client-side routing |
| Tailwind CSS | 4.2 | Utility-first styling |
| Zustand | 5.0 | Global state management |
| React Hook Form | 7.72 | Form handling |
| Zod | 4.3 | Schema validation |
| Framer Motion | 12.39 | Animations (scroll-triggered, stagger, slide) |
| Axios | 1.15 | HTTP client với interceptor tự động refresh token |
| Lucide React | latest | Icon library |
| Sonner | 2.0 | Toast notifications |
| @tanstack/react-query | 5.99 | Server state caching |
| Radix UI | latest | Accessible component primitives (Dialog, Tabs, Dropdown) |
| Embla Carousel | 8.6 | Image carousel |
| Vite | 8.0 | Build tool |

### 3.2 Backend

| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| Node.js + Express | 5.2 | REST API server |
| Mongoose | 9.6 | ODM cho MongoDB |
| jsonwebtoken | 9.0 | Tạo và xác thực JWT |
| bcryptjs | 3.0 | Hash mật khẩu (salt rounds = 10) |
| Multer | 2.1 | Upload ảnh local |
| xlsx | 0.18 | Xuất danh sách sản phẩm ra file Excel |
| cookie-parser | 1.4 | Đọc HttpOnly cookie |
| cors | 2.8 | Cấu hình CORS |
| dotenv | 17.4 | Biến môi trường |

### 3.3 Database

- **MongoDB** (localhost:27017) + **Mongoose**
- **12 Collection chính:** User, Session, Product, Category, Cart, Order, Review, Coupon, Lookbook, Store, TeamMember, SiteConfig

### 3.4 Lý Do Chọn Tech Stack

| Quyết định | Lý do |
|---|---|
| **React 19** | Framework phổ biến nhất, hệ sinh thái phong phú, phù hợp SPA |
| **MongoDB** | Schema linh hoạt cho sản phẩm có biến thể (size/màu), phù hợp dữ liệu phi cấu trúc |
| **Tailwind CSS 4** | Viết UI nhanh, nhất quán, không cần CSS file riêng |
| **Zustand** | Nhẹ hơn Redux, boilerplate ít, tích hợp tốt với React 19 |
| **JWT + Bcrypt** | Bộ đôi chuẩn industry cho auth — JWT stateless, Bcrypt an toàn cho mật khẩu |
| **Multer local** | Đơn giản, không cần tài khoản cloud, phù hợp môi trường demo |

---

## 4. KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────────────────────┐
│                    FRONTEND (React 19)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │ Service Layer│  │ Zustand Store│  │  Zod + RHF    │  │
│  │ (API calls)  │  │ auth/cart/ui │  │ (form valid.) │  │
│  └──────┬───────┘  └──────────────┘  └───────────────┘  │
└─────────┼───────────────────────────────────────────────┘
          │  HTTP / Axios (+ Interceptor auto-refresh JWT)
┌─────────▼───────────────────────────────────────────────┐
│                   BACKEND (Express 5)                    │
│  ┌────────┐  ┌─────────────┐  ┌──────────┐  ┌───────┐  │
│  │ Routes │→ │ Controllers │→ │ Services │→ │Models │  │
│  │        │  │ (thin layer)│  │ (logic)  │  │(ODM)  │  │
│  └────────┘  └─────────────┘  └──────────┘  └───┬───┘  │
└──────────────────────────────────────────────────┼──────┘
                                                   │
┌──────────────────────────────────────────────────▼──────┐
│              MongoDB (localhost:27017)                    │
│  User · Session · Product · Category · Cart · Order      │
│  Review · Coupon · Lookbook · Store · TeamMember · etc.  │
└─────────────────────────────────────────────────────────┘
```

### 4.1 Pattern Kiến Trúc

- **Routes → Controllers → Services → Models**: tách biệt rõ ràng, dễ test và maintain
- **Controller mỏng (thin controller)**: chỉ validate input → gọi service → trả response. Toàn bộ business logic nằm trong `services/`
- **Service Layer (Frontend)**: mọi HTTP call đi qua service file (`product.service.js`, `order.service.js`, ...) — không gọi axios trực tiếp trong component
- **Shared helpers**: `utils/slugUtils.js` dùng chung giữa service và seeder

---

## 5. THIẾT KẾ CƠ SỞ DỮ LIỆU

### 5.1 Sơ Đồ ERD (Mô tả quan hệ)

```
User (1) ─────── (N) Session         # refresh token
User (1) ─────── (N) Order
User (1) ─────── (1) Cart
User (1) ─────── (N) Review
User (N) ─────── (N) Product         # wishlist (embedded array trong User)
User (1) ─────── (N) Address         # embedded subdoc trong User

Product (N) ──── (1) Category
Product (1) ──── (N) Variant         # embedded (size + color + stock)
Product (1) ──── (N) Review
Product (N) ──── (N) Order           # embedded orderItems trong Order
Product (N) ──── (N) Cart            # embedded cartItems trong Cart
Product (N) ──── (N) Combo           # ref array trong Combo.products
Product (N) ──── (N) Lookbook        # ref array trong Lookbook.products

Order (N) ─────── (1) User
Order (N) ─────── (1) Coupon         # couponCode lưu string

Lookbook (1) ─── (N) Product         # ref array
Combo (1) ─────── (N) Product        # ref array
```

### 5.2 Indexes

| Collection | Field | Loại Index | Mục đích |
|---|---|---|---|
| Product | category | Single | Lọc theo danh mục |
| Product | price | Single | Sort giá |
| Product | isFeatured, isActive | Compound | Lọc sản phẩm nổi bật |
| Product | name, description, sku | Text | Full-text search |
| Review | userId + productId | Unique compound | 1 user chỉ review 1 lần/sản phẩm |
| Review | productId, createdAt | Compound | Load review nhanh |
| User | username | Unique | Đăng nhập |
| User | email | Unique | Đăng nhập + check trùng |
| Combo | order | Single | Sort thứ tự hiển thị |

---

## 6. TÍNH NĂNG ĐÃ HOÀN THÀNH

### 6.1 Hệ Thống Xác Thực (Authentication)

| Tính năng | Chi tiết |
|---|---|
| **Đăng ký** | Zod validation: email, username, password confirm; hash bcrypt trước khi lưu |
| **Đăng nhập** | Đăng nhập bằng username **hoặc** email; tạo accessToken (30 phút) + refreshToken (14 ngày) |
| **Đăng xuất** | Xóa Session document khỏi MongoDB |
| **Refresh Token Rotation** | Endpoint `/auth/refresh` — cấp accessToken mới, invalidate refreshToken cũ (chống reuse attack). Session cũ bị xóa ngay khi rotate |
| **Axios Interceptor** | Frontend tự động xếp hàng các request đang chờ trong khi refresh đang chạy — không để lọt request nào dùng token hết hạn |
| **Token lưu trữ** | accessToken trong Zustand (localStorage qua persist), refreshToken trong MongoDB Session + HttpOnly Cookie |

### 6.2 Giao Diện Khách Hàng (Customer)

#### Trang Chủ / Landing Page
- Hero banner với typography lớn, CTA gradient button
- **New Drops section**: danh sách sản phẩm mới, card frosted-glass overlay, giá gạch ngang (`compareAtPrice`)
- **Trending section**: grid sản phẩm nổi bật, stagger animation khi scroll vào
- **Lookbook section**: preview story editorial, link đến Lookbook
- **Marquee section**: chạy text liên tục
- Toàn bộ section có **scroll-triggered animations** (scrollSlideLeft/Right, scrollFadeUp, scrollFadeIn, whileInView stagger với Framer Motion)

#### Trang Shop
- Danh sách sản phẩm lấy từ API thật
- **Bộ lọc**: theo danh mục, sắp xếp (mới nhất, giá tăng, giá giảm, tên A-Z)
- **Quick Sort sidebar**: slide-in từ phải, chọn sort nhanh
- **Cursor-based Load More**: append sản phẩm vào danh sách hiện có, không reset khi filter — dùng compound cursor `(price, _id)` đảm bảo đúng khi nhiều sản phẩm cùng giá
- Grid sản phẩm nổi bật riêng (isFeatured)
- Giá gạch ngang hiển thị trên card

#### Trang New Drops
- Danh sách hàng mới về, card frosted-glass overlay, tên sản phẩm nằm trong card

#### Trang Chi Tiết Sản Phẩm
- **Gallery ảnh**: multi-image, chuyển ảnh, ảnh thumbnail
- Chọn biến thể màu sắc (color swatch), chọn size, hiển thị tồn kho realtime theo biến thể đã chọn
- **Nút Hướng Dẫn Chọn Size**: slide-over panel từ phải — nhập chiều cao/cân nặng → tự động gợi ý size phù hợp + highlight cột trong bảng size; ẩn tự động cho danh mục Phụ kiện
- Bảng size (sizeChart) tùy chỉnh do Admin định nghĩa (headers + rows)
- Giá gạch ngang, thêm vào giỏ hàng
- Sản phẩm liên quan (cùng danh mục)
- Section đánh giá (VibeCheck Reviews): hiển thị danh sách đánh giá, badge "Đã mua" (isVerified check qua đơn hàng delivered), form gửi đánh giá

#### Giỏ Hàng
- Tăng/giảm/xóa sản phẩm (đồng bộ API)
- Hiển thị giá VNĐ, tính phí ship (miễn phí ≥ 500.000đ)
- **Áp dụng mã giảm giá**: validate coupon qua API (kiểm tra còn hạn, còn lượt dùng, đạt đơn tối thiểu)
- **Combo Cart**: hiển thị nhóm sản phẩm combo nếu giỏ hàng có combo items
- **Tier Discount**: tính giảm giá theo bậc loyalty tự động
- VibeLoyaltyCard: hiển thị bậc khách hàng và ưu đãi

#### Thanh Toán (Checkout)
- Form thu thập: họ tên, email, SĐT, tỉnh/huyện/xã (dropdown tỉnh thành VN thực tế)
- Pre-fill thông tin từ tài khoản đang đăng nhập
- **Address Selector Modal**: chọn từ địa chỉ đã lưu trong profile
- Chọn phương thức thanh toán: **COD** (Thanh toán khi nhận hàng)
- Tạo đơn hàng qua API, **atomic stock decrement** (tránh race condition)
- Trang xác nhận thành công với orderNumber

#### Hồ Sơ Cá Nhân (Profile)
- Xem & chỉnh sửa thông tin (họ tên, email, SĐT, bio)
- **Upload avatar** (Multer, lưu local)
- **Đổi mật khẩu**: xác thực mật khẩu cũ trước khi đổi
- **Lịch sử đơn hàng**: danh sách đơn có trạng thái color-coded
- **Chi tiết đơn hàng**: items, địa chỉ giao hàng, trạng thái, tổng tiền
- **Hủy đơn**: chỉ được hủy khi status là `pending` hoặc `confirmed`
- **Quản lý địa chỉ**: thêm/sửa/xóa/đặt địa chỉ mặc định (tối đa nhiều địa chỉ)

#### Wishlist
- Thêm/xóa sản phẩm yêu thích, đồng bộ API
- Icon heart trên Header với badge số lượng
- Trang danh sách wishlist riêng

#### Lookbook
- Grid story editorial, ảnh lớn toàn màn hình
- Click story → xem chi tiết story với văn bản mô tả
- **Shop This Look**: click ảnh sản phẩm gắn trong story → chuyển đến trang chi tiết sản phẩm đó

#### Trang Sale
- Hero section giới thiệu chương trình khuyến mãi
- **TierSection**: hiển thị các bậc loyalty (Bronze/Silver/Gold/...) với phần trăm giảm giá
- **ComboSection**: danh sách combo sản phẩm với giá combo đặc biệt
- **CouponsSection**: mã giảm giá public hiển thị cho khách hàng
- **PerksSection + FaqNewsletterSection**: thông tin lợi ích

#### Trang About
- HeroSection, StorySection (lịch sử thương hiệu)
- **PhilosophySection**: click card → modal overlay chi tiết 4 đoạn văn
- **WorkshopSection**: gallery ảnh với lightbox fullscreen (prev/next, dots navigation)
- StoresSection: danh sách cửa hàng
- TeamSection: thành viên nhóm
- MapSection, ContactSection, FooterBanner

#### Trang Hỗ Trợ (`/support`)
- FAQ accordion, thông tin vận chuyển, form liên hệ
- Hash anchor scroll từ Header/Footer links

#### Tính năng chung
- **ScrollToTop**: nút ^ góc phải, hiện sau 300px scroll
- **Header**: navigation desktop + mobile hamburger, cart badge, wishlist badge, link profile/đơn hàng
- **Footer**: đầy đủ links → support, các trang quan trọng
- Responsive trên desktop và mobile

### 6.3 Hệ Thống Quản Trị (Admin Panel)

#### Dashboard
- **4 thẻ thống kê**: tổng đơn hàng, tổng doanh thu, đơn chờ xử lý, sản phẩm hết hàng
- **Biểu đồ doanh thu 6 tháng**: bar chart, click vào cột tháng → drill-down danh sách đơn hàng theo ngày trong tháng đó
- **Phân tích đơn theo trạng thái**: breakdown 5 trạng thái (pending/confirmed/shipping/delivered/cancelled)
- **Tỉ lệ hoàn hủy**: thanh progress bar color-coded (xanh ≤5%, vàng 5–10%, đỏ >10%) + dòng "X đơn hủy / Y đơn tổng"
- **Top 5 sản phẩm bán chạy**: danh sách xếp hạng theo doanh số
- **Banner lợi nhuận ước tính**: Lợi nhuận = Doanh thu − Giá vốn; hiển thị biên lợi nhuận %, màu xanh/đỏ theo kết quả
- Error banner khi API gặp lỗi

#### Quản Lý Sản Phẩm
- Danh sách sản phẩm với phân trang (10 items/trang), tìm kiếm realtime (debounce)
- Xóa sản phẩm có xác nhận
- **Form thêm/sửa sản phẩm** (ProductForm):
  - Upload ảnh đa ảnh (tối đa 5 file, drag-drop preview)
  - Grid 3 cột: Giá vốn | Giá bán | Giá gốc (so sánh)
  - Quản lý biến thể động: thêm/xóa variant (size + màu + colorHex + tồn kho)
  - **Editor bảng size**: tự định nghĩa headers và rows (add/remove cột/hàng)
  - Thông tin mở rộng: chất liệu, hướng dẫn bảo quản, SKU, mô tả
- **Xuất Excel**: tải toàn bộ sản phẩm ra file `.xlsx` với đầy đủ thông tin variant

#### Quản Lý Danh Mục
- Danh sách danh mục, thêm/sửa qua modal, bật/tắt active, xóa có xác nhận

#### Quản Lý Đơn Hàng
- Lọc theo trạng thái (5 tab: Tất cả / Chờ xử lý / Xác nhận / Đang giao / Đã giao / Hủy)
- **Phân trang server-side**: fetch theo trang + status param
- Cập nhật trạng thái inline (dropdown)
- Xem chi tiết đơn hàng qua drawer slide-in
- Khóa terminal states: không thể thay đổi đơn `delivered` hoặc `cancelled`

#### Quản Lý Khách Hàng
- Tìm kiếm debounce (gửi search param lên server)
- **Phân trang server-side** (page + search reactive)
- Xem chi tiết khách hàng qua drawer
- **Khóa/mở tài khoản** (`isActive` toggle)

#### Quản Lý Mã Giảm Giá (Coupons)
- Danh sách coupon, thêm/sửa/xóa
- Hỗ trợ: % giảm hoặc số tiền cố định, đơn tối thiểu, giới hạn lượt dùng, ngày hết hạn, bật/tắt công khai

#### Quản Lý Lookbook
- Thêm/sửa/xóa story, upload ảnh story
- Liên kết sản phẩm vào story (dùng cho Shop This Look)

#### Quản Lý Sale (Tier + Combo)
- **Tier discounts**: cấu hình các bậc loyalty với % giảm giá và ngưỡng đơn tối thiểu
- **Combo management**: tạo/sửa/xóa combo (bundle sản phẩm với giá combo đặc biệt)

#### Quản Lý About (CMS)
- Danh sách cửa hàng: địa chỉ, giờ mở cửa
- Danh sách thành viên nhóm: ảnh, chức danh, bio
- SiteConfig: cấu hình chung cho trang About

### 6.4 Backend API (RESTful)

| Nhóm | Method | Endpoint | Mô tả |
|---|---|---|---|
| **Auth** | POST | /api/auth/signup | Đăng ký |
| | POST | /api/auth/signin | Đăng nhập |
| | POST | /api/auth/signout | Đăng xuất |
| | POST | /api/auth/refresh | Làm mới access token |
| **Product** | GET | /api/products | Danh sách (cursor/offset pagination, filter, sort) |
| | GET | /api/products/:slug | Chi tiết sản phẩm theo slug |
| | GET | /api/products/:slug/related | Sản phẩm liên quan |
| | GET | /api/products/admin/all | Admin: tất cả sản phẩm |
| | GET | /api/products/admin/export | Admin: xuất Excel |
| | GET | /api/products/admin/:id | Admin: chi tiết theo ID |
| | POST | /api/products | Admin: tạo sản phẩm |
| | PUT | /api/products/:id | Admin: cập nhật |
| | DELETE | /api/products/:id | Admin: xóa |
| **Category** | GET | /api/categories | Danh sách danh mục |
| | POST | /api/categories | Admin: tạo |
| | PUT | /api/categories/:id | Admin: cập nhật |
| | DELETE | /api/categories/:id | Admin: xóa |
| **Cart** | GET | /api/cart | Xem giỏ hàng |
| | POST | /api/cart/add | Thêm sản phẩm |
| | PUT | /api/cart/update-quantity | Cập nhật số lượng |
| | DELETE | /api/cart/item/:id | Xóa item |
| | DELETE | /api/cart/clear | Xóa toàn bộ |
| **Order** | POST | /api/orders | Tạo đơn hàng |
| | GET | /api/orders | Lịch sử đơn (user) |
| | GET | /api/orders/:id | Chi tiết đơn |
| | PUT | /api/orders/:id/cancel | Hủy đơn (user) |
| | PUT | /api/orders/:id/status | Admin: cập nhật trạng thái |
| | GET | /api/orders/stats | Admin: dashboard stats + drill-down |
| | GET | /api/orders/admin/all | Admin: tất cả đơn (phân trang, lọc) |
| **User** | GET | /api/users/me | Xem thông tin |
| | PUT | /api/users/me | Cập nhật profile |
| | POST | /api/users/me/avatar | Upload avatar |
| | PUT | /api/users/me/password | Đổi mật khẩu |
| | GET/POST/DELETE | /api/users/me/wishlist | Wishlist |
| | GET/POST/PUT/DELETE | /api/users/me/addresses | Địa chỉ |
| | GET | /api/users | Admin: danh sách users (pagination, search) |
| | PATCH | /api/users/:id/status | Admin: khóa/mở tài khoản |
| **Review** | GET | /api/products/:id/reviews | Danh sách đánh giá |
| | POST | /api/products/:id/reviews | Gửi đánh giá |
| **Coupon** | POST | /api/coupons/validate | Kiểm tra mã giảm giá |
| | GET/POST/PUT/DELETE | /api/coupons | Admin: CRUD coupon |
| **Lookbook** | GET | /api/lookbook | Danh sách story (public) |
| | POST/PUT/DELETE | /api/lookbook | Admin: CRUD |
| **Combo** | GET | /api/combos | Danh sách combo (public) |
| | GET/POST/PUT/DELETE | /api/combos/admin | Admin: CRUD combo |
| **Sale Config** | GET | /api/sale-config | Tier config (public) |
| | PUT | /api/sale-config/tiers | Admin: cập nhật tiers |
| **About** | GET/POST/PUT/DELETE | /api/stores | Cửa hàng |
| | GET/POST/PUT/DELETE | /api/team | Thành viên |
| | GET/PUT | /api/about-config | SiteConfig |
| **Upload** | POST | /api/upload | Upload ảnh (max 5 files, 5MB/file) |

---

## 7. BẢO MẬT & KỸ THUẬT NỔI BẬT

### 7.1 Bảo Mật

| Kỹ thuật | Mô tả |
|---|---|
| **Bcrypt (salt rounds = 10)** | Mật khẩu được hash trước khi lưu vào DB, không bao giờ lưu plain text |
| **JWT Access + Refresh Token** | AccessToken hết hạn sau 30 phút; RefreshToken 14 ngày lưu trong MongoDB Session + HttpOnly Cookie |
| **Refresh Token Rotation** | Mỗi lần refresh → token cũ bị xóa ngay, tránh tấn công token reuse |
| **HttpOnly Cookie** | RefreshToken trong cookie HttpOnly — JavaScript không thể đọc, chống XSS |
| **CORS** | Chỉ cho phép các origin được cấu hình trong `.env` |
| **Input Validation** | Validate tại controller (field bắt buộc, kiểu dữ liệu) trước khi query DB — trả 400 khi sai |
| **Chống ReDoS** | Escape regex từ user input trước khi dùng trong MongoDB query (`$regex`) |
| **Email uniqueness check** | Khi cập nhật profile, kiểm tra email không trùng với tài khoản khác |
| **Admin route guard** | `adminRoute` middleware kiểm tra `req.user.role === "admin"` trên tất cả admin endpoints |
| **Không lộ stack trace** | Lỗi server chỉ log ra console, response chỉ trả message chung |

### 7.2 Kỹ Thuật Nổi Bật

| Tính năng | Chi tiết |
|---|---|
| **Order State Machine** | `VALID_TRANSITIONS` map kiểm soát luồng chuyển trạng thái hợp lệ: `pending→confirmed/cancelled`, `confirmed→shipping/cancelled`, `shipping→delivered`. Terminal states (`delivered`, `cancelled`) không thể thay đổi |
| **Atomic Stock Decrement** | Dùng `findOneAndUpdate` + `$elemMatch` với điều kiện `stock ≥ qty` để tránh race condition khi nhiều đơn cùng mua hết hàng; có rollback loop nếu một variant thất bại |
| **Cursor-based Pagination** | Compound cursor `{_id, price}` encode base64 — đảm bảo pagination đúng khi nhiều sản phẩm cùng giá; `$or` filter xử lý 2 trường hợp sort giá |
| **Server-side Pagination + Search** | Admin Orders/Customers dùng skip/limit trên server, không slice client-side; search debounce giảm số lần gọi API |
| **Profit Dashboard** | `costPrice` lưu trên Product; Dashboard tính COGS qua `$lookup` aggregate — không phình Order schema nhưng vẫn có profit analytics |
| **Excel Export** | `xlsx` library flatten variant → mỗi variant là 1 row trong file `.xlsx` |
| **React 18/19 Batching** | Các state update trong cùng event handler (vd: `setActiveTab` + `setPage(1)`) được batch thành 1 render → 1 fetch duy nhất, không double fetch |
| **Slug tiếng Việt** | NFD normalize → loại bỏ dấu → lowercase → `ensureUniqueSlug` đảm bảo không trùng |

---

## 8. GIAO DIỆN & UX

### 8.1 Hệ Thống Màu Sắc

| Vai trò | Giá trị |
|---|---|
| Nền chính | `#F9F6F5` (warm gray nhạt) |
| Nền phụ | `#F3F0EF` |
| Chữ chính | `#2F2F2E` (xám đậm) |
| Chữ phụ | `#5C5B5B` |
| Accent CTA (gradient từ) | `#004BE3` (xanh đậm) |
| Accent CTA (gradient đến) | `#819BFF` (xanh lavender) |

### 8.2 Typography
- **Fraunces**: heading italic — premium, editorial feel
- **Nunito**: body text — hiện đại, dễ đọc
- **Cormorant Garamond**: serif accent — sang trọng, dùng cho price display

### 8.3 Animation (Framer Motion)
- **Landing Page**: scroll-triggered trên tất cả section (scrollSlideLeft/Right, scrollFadeUp, scrollFadeIn, whileInView stagger)
- **Admin Panel**: staggerContainer + fadeUpItem trên 10+ module, drawerSlideIn cho detail drawers, AnimatePresence cho modal/drawer transitions
- **Micro-animations**: hover scale, opacity fade, color transitions — tăng cảm giác premium không gây xao nhãng

### 8.4 Responsive
- Mobile hamburger menu với animation
- Grid sản phẩm: 1 cột mobile → 2 cột tablet → 3-4 cột desktop
- Admin table responsive với horizontal scroll
- Form layout stack vertical trên mobile

---

## 9. HƯỚNG DẪN CÀI ĐẶT & KIỂM THỬ

### 9.1 Yêu Cầu Hệ Thống

- Node.js ≥ 18
- MongoDB đang chạy tại `localhost:27017`
- npm hoặc yarn

### 9.2 Cài Đặt

```bash
# 1. Clone repository
git clone <repo-url>
cd ecommerce-store

# 2. Cài đặt backend
cd backend
npm install

# Tạo file .env từ .env.example
cp .env.example .env
# Điền JWT_SECRET và REFRESH_SECRET vào .env

# Chạy seeders (lần đầu)
node seeders/adminSeeder.js
node seeders/productSeeder.js
node seeders/reviewSeeder.js
node seeders/lookbookSeeder.js
node seeders/aboutSeeder.js

# 3. Cài đặt frontend
cd ../frontend
npm install

# 4. Khởi động
# Terminal 1 (backend)
cd backend && npm run dev

# Terminal 2 (frontend)
cd frontend && npm run dev
```

### 9.3 Biến Môi Trường (`.env`)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce-store
JWT_SECRET=your_jwt_secret_here
REFRESH_SECRET=your_refresh_secret_here
```

### 9.4 Tài Khoản Mặc Định

| Loại | Identifier | Mật khẩu |
|---|---|---|
| Admin | `admin` | `123456` |
| Customer | `customer1` | `123456` |

### 9.5 Kiểm Thử Các Chức Năng Chính

**Luồng 1 — Mua hàng:**
1. Truy cập `http://localhost:5173`
2. Đăng ký tài khoản mới → Đăng nhập
3. Vào Shop → Chọn sản phẩm → Xem chi tiết
4. Chọn size/màu → Thêm vào giỏ hàng
5. Vào giỏ hàng → Nhập mã coupon (nếu có) → Thanh toán
6. Điền địa chỉ → Xác nhận → Xem trang success

**Luồng 2 — Admin quản lý đơn hàng:**
1. Đăng nhập với tài khoản admin
2. Vào `/admin` → Dashboard (xem thống kê, click cột tháng xem drill-down)
3. Vào Orders → Filter theo tab trạng thái → Click vào đơn → Xem drawer
4. Cập nhật trạng thái đơn: `pending → confirmed → shipping → delivered`

**Luồng 3 — Admin quản lý sản phẩm:**
1. Vào Admin → Products → Nhấn "Thêm sản phẩm"
2. Điền thông tin, upload ảnh, thêm variants, điền bảng size
3. Lưu → Kiểm tra sản phẩm xuất hiện trên Shop
4. Nhấn nút "Export Excel" → tải file `.xlsx`

**Luồng 4 — Wishlist & Reviews:**
1. Đăng nhập → Vào Product Detail → Nhấn icon heart
2. Vào `/wishlist` → Xác nhận sản phẩm đã lưu
3. Đặt đơn thành công (status `delivered`) → Vào Product Detail → Gửi đánh giá → Thấy badge "Đã mua"

---

## 10. ĐÁNH GIÁ THEO TIÊU CHÍ CHẤM ĐIỂM

### 10.1 Hoàn Thiện Chức Năng Cốt Lõi (40%)

| Yêu cầu đề bài | Trạng thái | Ghi chú |
|---|---|---|
| Trang chủ (banner, danh mục nổi bật) | ✅ Hoàn thành | Hero + New Drops + Trending + Lookbook sections |
| Thanh tìm kiếm sản phẩm | ⚠️ Một phần | Tìm kiếm theo danh mục trong Shop + search trong Admin; chưa có search toàn cục trên Header |
| Danh sách sản phẩm + phân trang | ✅ Hoàn thành | Cursor-based Load More, grid sản phẩm nổi bật |
| Bộ lọc đa tiêu chí | ✅ Hoàn thành | Lọc danh mục, sắp xếp giá/mới nhất/tên |
| Chi tiết sản phẩm (gallery, biến thể, tồn kho, liên quan, đánh giá) | ✅ Hoàn thành | Đầy đủ |
| Giỏ hàng (cập nhật SL, xóa, tổng tiền, phí ship, coupon) | ✅ Hoàn thành | Đầy đủ + Combo groups + Tier discount |
| Thanh toán (form địa chỉ, phương thức thanh toán, xác nhận) | ✅ Hoàn thành | COD; trang success với orderNumber |
| Tài khoản (đăng ký, đăng nhập, lịch sử đơn, địa chỉ, đổi mật khẩu) | ✅ Hoàn thành | Đầy đủ |
| Quên mật khẩu | ❌ Chưa có | Ngoài scope demo |
| Wishlist | ✅ Hoàn thành | API + UI hoàn chỉnh |
| Admin: CRUD sản phẩm | ✅ Hoàn thành | Form đầy đủ: ảnh, variants, bảng size, giá vốn |
| Admin: Quản lý danh mục | ✅ Hoàn thành | |
| Admin: Quản lý đơn hàng (lọc, cập nhật, xem chi tiết) | ✅ Hoàn thành | Server-side filter + pagination |
| Admin: Quản lý khách hàng | ✅ Hoàn thành | Search + pagination + khóa/mở tài khoản |
| Admin: Mã giảm giá | ✅ Hoàn thành | CRUD đầy đủ |
| Admin: Thống kê (biểu đồ doanh thu, top sản phẩm, tổng đơn/doanh thu) | ✅ Hoàn thành | + Drill-down, profit banner, cancel rate |
| Xuất/nhập Excel | ✅ Xuất Excel | Import từ file chưa có |

### 10.2 Giao Diện & UX Responsive (15%)

- Thiết kế editorial premium, bảng màu nhất quán
- Scroll-triggered animations toàn trang Landing
- Admin Panel animations đồng bộ
- Typography 3 font (Fraunces + Nunito + Cormorant Garamond)
- Size Guide slide-over panel với calculator
- Responsive mobile/tablet/desktop

### 10.3 Chất Lượng Code (15%)

- Pattern nhất quán: Routes → Controllers → Services → Models
- Thin controller pattern (không có business logic trong controller)
- Zod + RHF cho tất cả form có validation
- Service layer cho tất cả API call từ frontend
- Cursor-based pagination đúng chuẩn
- Server-side pagination + debounce search
- React 18/19 batching tối ưu số lần render
- Tổng LOC: ~7,500 (backend) + ~20,000 (frontend)

### 10.4 Bảo Mật & Xử Lý Lỗi (10%)

- Bcrypt hash mật khẩu
- JWT access + refresh token rotation
- HttpOnly cookie cho refresh token
- Input validation tại controller
- Chống ReDoS (escape regex)
- Atomic stock decrement (chống race condition)
- Order state machine (chống cập nhật trạng thái không hợp lệ)
- Try/catch trên tất cả async functions
- Không lộ stack trace ra response

### 10.5 Tính Sáng Tạo (10%)

| Điểm sáng tạo | Chi tiết |
|---|---|
| **Lookbook + Shop This Look** | Trang editorial story với click-through sản phẩm |
| **Size Guide Calculator** | Tính toán size gợi ý từ chiều cao/cân nặng |
| **Profit Dashboard** | Theo dõi lợi nhuận thực tế (doanh thu − giá vốn) |
| **Combo + Tier Loyalty** | Hệ thống khuyến mãi nhiều tầng |
| **Cursor-based Pagination** | Trải nghiệm Load More mượt, không flicker |
| **Scroll-triggered Animations** | Premium editorial feel tương tự Filling Pieces |
| **About CMS** | Admin có thể chỉnh sửa toàn bộ trang About |

---

## 11. HẠN CHẾ & HƯỚNG PHÁT TRIỂN

### 11.1 Hạn Chế Hiện Tại

| Hạn chế | Lý do |
|---|---|
| Chưa có tìm kiếm toàn cục trên Header | Cần full-text search index + UX search dropdown |
| Chỉ hỗ trợ COD, chưa có cổng thanh toán | Tích hợp VNPAY/Momo cần tài khoản merchant |
| Chưa có quên mật khẩu | Cần SMTP server để gửi email |
| Upload ảnh chỉ lưu local | Cần Cloudinary/S3 cho môi trường production |
| Chưa có import Excel | Chỉ export; import cần parse + validate phức tạp |
| Dữ liệu test ít | DB chưa có đủ orders/users để test phân trang đầy đủ |

### 11.2 Hướng Phát Triển

1. **Thanh toán điện tử**: Tích hợp VNPAY sandbox
2. **Tìm kiếm toàn cục**: Search bar trên Header, full-text MongoDB + dropdown kết quả
3. **Thông báo đẩy**: Email/SMS khi đơn hàng thay đổi trạng thái
4. **Gợi ý sản phẩm**: "Người mua cũng mua..." dựa trên lịch sử đơn
5. **Đánh giá ảnh**: Upload ảnh trong review
6. **Upload cloud**: Migrate từ local Multer sang Cloudinary
7. **Import Excel**: Cho phép admin nhập liệu hàng loạt từ file

---

## 12. KẾT LUẬN

Dự án **Vibe Urban** đã hoàn thiện đầy đủ các chức năng cốt lõi của một website thương mại điện tử thời trang, bao gồm:

- **Customer flow hoàn chỉnh**: Đăng ký → Duyệt sản phẩm → Lọc/sort → Xem chi tiết → Thêm giỏ → Thanh toán → Theo dõi đơn
- **Admin panel toàn diện**: Dashboard analytics → Quản lý sản phẩm/danh mục/đơn hàng/khách hàng/mã giảm giá/lookbook/sale/about
- **Kỹ thuật vững**: Cursor pagination, refresh token rotation, atomic stock, order state machine, Excel export
- **UX premium**: Scroll animations, editorial typography, size guide calculator, Shop This Look

Dự án được xây dựng theo đúng yêu cầu đề bài với nhiều điểm mở rộng sáng tạo vượt scope gốc, phù hợp để demo và đánh giá.

---

*Báo cáo được tổng hợp từ trạng thái dự án tính đến ngày 29/06/2026.*
