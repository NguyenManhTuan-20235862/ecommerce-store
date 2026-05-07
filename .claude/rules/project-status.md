---
description: Trạng thái hoàn thiện của từng module Backend và Frontend, danh sách việc còn thiếu, và lộ trình ưu tiên tiếp theo. Dùng khi lên kế hoạch implement tính năng mới.
alwaysApply: false
---

# Trạng Thái Dự Án (cập nhật 2026-05-07, session 4)

## Backend — Hoàn thành ✅

| Module | Ghi chú |
|---|---|
| Auth (signup/signin/signout) | JWT + Bcrypt, login bằng username hoặc email |
| Middleware (protectedRoute, adminRoute) | JWT verify từ Authorization header |
| Product API (public + admin) | CRUD, filter/sort/pagination/search, related, slug + `GET /admin/:id` |
| Category API (public + admin) | CRUD, slug generation |
| Cart API | get/add/update-quantity/remove/clear |
| **Order API** ✅ | Tạo đơn (atomic stock decrement + rollback), danh sách, chi tiết, hủy (hoàn stock), đổi trạng thái có state machine |
| Upload API | Max 5 files, 5MB/file, JPEG/PNG/WebP/GIF — trả **full URL** `http://host/uploads/filename` |
| **User API** ✅ | `GET /users/me`, `PUT /users/me` (update profile), `PUT /users/me/password`, `GET /users` (admin) |
| **Coupon API** ✅ | `POST /coupons/validate` (user), CRUD admin — Model (code, discountType, value, minOrder, maxUses, expiresAt, usedCount) |
| Models | User, Session, Product, Category, Cart, Order, Coupon |
| Seeder | 5 danh mục + 24+ sản phẩm (8 featured) |
| **Services layer** ✅ | `authService`, `productService`, `cartService`, `orderService`, `userService`, `couponService` + `utils/slugUtils` |

## Backend — Chưa có ❌

- Model + API `Review`
- Validate tồn kho khi thêm vào giỏ
- Refresh token rotation endpoint (`/auth/refresh`)

## Frontend — Hoàn thành ✅

| Trang / Module | Ghi chú |
|---|---|
| Auth (Login, Register) | Zod validation, toast, redirect, auto-login sau register |
| Landing Page | Hero, Drops, Trending, Marquee, Lookbook |
| Header | Desktop nav + dropdown, mobile menu, cart badge |
| Shop | API thật, filter (category slug chuẩn), sort, load-more, featured grid |
| Product Detail | Gallery, biến thể (size/color), thêm vào giỏ, sản phẩm liên quan |
| Cart | API thật, +/-/remove (dùng cartItemId), CartSummary VND, coupon Apply + discount line |
| **Checkout** ✅ | Zod + RHF validation, pre-fill displayName/email/**phone**, coupon discount sync từ store, guard `cartLoading`, API integration, Success page |
| **Profile - Thông tin tài khoản** ✅ | Avatar chữ cái, info read-only (username/role/joinDate), form edit (displayName/email/phone), Zod + RHF |
| **Profile - Order History** ✅ | Danh sách orders, status badges, loading/error/empty states |
| **Profile - Order Detail** ✅ | Chi tiết, nút hủy, API integration |
| **Profile - Change Password** ✅ | Zod validation, password toggle, API integration |
| Admin Layout (Sidebar) | Active state, user info, logout |
| Admin Dashboard | Stats cards, quick actions |
| Admin Products (list) | Table, search, phân trang 10 items, edit/delete |
| **Admin ProductForm** ✅ | Form 2 cột, upload ảnh (max 5), variant editor (useFieldArray), Zod + RHF |
| **Admin Categories** ✅ | Table + modal CRUD, Zod + RHF, toggle isActive, delete confirm |
| **Admin Orders** ✅ | Filter tabs, inline status select, optimistic update, detail drawer, lock terminal states |
| **Admin Customers** ✅ | Search debounce, table, detail drawer |
| **Admin Coupons** ✅ | Table (mã/loại/giá trị/min đơn/đã dùng/hết hạn/trạng thái), modal create/edit Zod + RHF, delete |
| Stores (Zustand) | authStore (+ setUser), cartStore (+ couponDiscount), uiStore — persist localStorage |
| **Services (API layer)** ✅ | `product.service.js`, `cartService.js`, `category.service.js`, `order.service.js`, `user.service.js` (+ updateProfile), `coupon.service.js` |
| **Utils** ✅ | `getImageUrl.js` — prefix backend origin cho `/uploads/` path |
| Routes | AdminRoute, ProtectedRoute guard |

## Frontend — Chưa hoàn thiện 🚩

| Trang / Module | Việc cần làm |
|---|---|
| Wishlist | Chưa có — icon Header dẫn đến login |
| Reviews (VibeCheckReviews) | `reviews = []`, chưa có submit logic |
| Shop — shoe/pants sizes | Filter size chỉ có S/M/L/XL/XXL/OS, chưa có size giày/quần |
| Load More giới hạn 50 | Backend cap `Math.min(50, ...)`, Load More stuck khi tổng > 50 |

## Lộ trình tiếp theo (ưu tiên cao → thấp)

1. **Admin Dashboard statistics** ⭐ — Aggregate query: doanh thu theo tháng, top sản phẩm bán chạy, đơn hàng theo trạng thái
2. **Wishlist** — Store + API + UI
3. **Reviews** — Model + API + UI (submit từ Product Detail)
4. **Profile - Avatar upload** — Multer upload ảnh avatar, lưu local
5. **Refresh token rotation** — endpoint `/auth/refresh`

## Trạng Thái Chi Tiết

### ✅ Profile (Hoàn thành 100%)

- ✅ `PUT /api/users/me` — update profile (displayName, email, phone) với email uniqueness check
- ✅ `PUT /api/users/me/password` — đổi mật khẩu bcrypt
- ✅ `ProfileInfo.jsx` — avatar chữ cái, view + edit mode, Zod + RHF, sync authStore sau save
- ✅ `ProfileLayout` — 3 nav items: Thông tin tài khoản, Đơn hàng, Đổi mật khẩu
- ✅ `/profile` → redirect `/profile/info` (mặc định)

### ✅ Coupon System (Hoàn thành 100%)

- ✅ `backend/models/Coupon.js` — code, discountType (percent/fixed), discountValue, minOrderValue, maxUses, usedCount, expiresAt, isActive
- ✅ `backend/services/couponService.js` — `validateAndApplyCoupon` + CRUD
- ✅ `backend/controllers/couponController.js` — 5 endpoints
- ✅ `backend/routes/couponRoute.js` — mount tại `/api/coupons`
- ✅ `backend/services/orderService.js` — thay DEMO10 bằng `couponService.validateAndApplyCoupon`, increment usedCount
- ✅ Cart Apply button + discount line trong CartSummary
- ✅ `frontend/src/pages/Admin/Coupons/index.jsx` — full CRUD table + modal

### ✅ Bug Fixes (Session 3)

| Bug | Fix |
|---|---|
| Order status invalid transition | `VALID_TRANSITIONS` state machine trong `orderService.updateOrderStatus` |
| Race condition stock decrement | Atomic `findOneAndUpdate` + `$elemMatch: { stock: { $gte } }` + rollback loop |
| Shop category filter sai key | `shopData.js`: English keys → Vietnamese slugs (`ao`, `quan`, `hoodie-sweater`, `giay`, `phu-kien`) |
| Shop mặc định lọc size M | `useState([])` thay vì `useState(["M"])` |
| ReDoS trong product filter | Escape regex với `.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")` |
| Cart +/- REMOVE không hoạt động | `mapStoreItem` dùng `cartItemId: item._id` (subdoc `_id`), callbacks dùng `cartItemId ?? productId` |
| Cart hiển thị "$3,256,000" | `formatUSD` → `formatVND` với locale `vi-VN`/`VND` |
| Cart tổng tiền sai (cộng thêm tax) | Xóa Urban Tax (8%), tính shipping khớp backend: `>= 500k → miễn phí, else 30k` |
| Cart total tràn container | `flex flex-col gap-1` (label trên, giá dưới) thay vì `flex justify-between` |
| Checkout không pre-fill họ tên/email | `authController.signIn` thêm `email` vào response; `defaultValues` dùng `user?.displayName`, `user?.email` |

### ✅ Bug Fixes (Session 4)

| Bug | Fix |
|---|---|
| couponDiscount mất khi Cart → Checkout | `couponDiscount` chuyển vào `cartStore`; Checkout đọc từ store |
| Admin Coupon edit fail Zod validation | `openEdit()` thêm `code: coupon.code`; payload edit strip `code` |
| fetchCart không reset couponDiscount | `fetchCart` và `clearCart` đều set `couponDiscount: 0` |
| jsconfig path alias không hoạt động | Thêm `"baseUrl": "."` vào `compilerOptions` |
| Checkout không pre-fill phone | `defaultValues.receiverPhone: user?.phone \|\| ""` |
| Checkout redirect sai khi cart đang load | Guard `!cartLoading &&` trước `items.length === 0` |
| Shop hàng cuối luôn thiếu 1 sản phẩm | `INITIAL_VISIBLE=11`, step `+4` — `(N-3)%4==0` với featured span 2 cols |
| Ảnh upload local bị vỡ (404) | `uploadController` trả full URL; `getImageUrl` utility prefix backend origin |
| Ảnh rỗng/vỡ hiển thị icon broken | `onError` fallback + src fallback trong `ProductTile` + `FeaturedProductTile` |

### ✅ Admin Panel (Hoàn thành 100%)

- ✅ Admin Layout với sidebar
- ✅ Admin Dashboard (stats cards)
- ✅ Admin Products list + ProductForm (variant editor, image upload)
- ✅ Admin Categories (modal CRUD)
- ✅ Admin Orders (filter tabs, inline status update, detail drawer)
- ✅ Admin Customers (search, table, detail drawer)
- ✅ Admin Coupons (table + modal CRUD)
