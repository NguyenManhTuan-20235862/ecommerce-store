---
description: Trạng thái hoàn thiện của từng module Backend và Frontend, danh sách việc còn thiếu, và lộ trình ưu tiên tiếp theo. Dùng khi lên kế hoạch implement tính năng mới.
alwaysApply: false
---

# Trạng Thái Dự Án (cập nhật 2026-05-03)

## Backend — Hoàn thành ✅

| Module | Ghi chú |
|---|---|
| Auth (signup/signin/signout) | JWT + Bcrypt, login bằng username hoặc email |
| Middleware (protectedRoute, adminRoute) | JWT verify từ Authorization header |
| Product API (public + admin) | CRUD, filter/sort/pagination/search, related, slug |
| Category API (public + admin) | CRUD, slug generation |
| Cart API | get/add/update-quantity/remove/clear — applyCoupon là placeholder |
| Upload API | Max 5 files, 5MB/file, JPEG/PNG/WebP/GIF |
| User API ⚠️ | Chỉ có `GET /users/me` |
| Models | User, Session, Product, Category, Cart |
| Seeder | 5 danh mục + 24+ sản phẩm (8 featured) |
| **Services layer** ✅ | `authService`, `productService`, `cartService` + `utils/slugUtils` — tách business logic khỏi controllers |

## Backend — Chưa có ❌

- Model + API `Order` (tạo đơn, lấy danh sách, cập nhật trạng thái)
- Model + API `Coupon` (applyCoupon hiện là placeholder)
- Model + API `Review`
- `PUT /users/me` cập nhật profile
- Refresh token rotation endpoint (`/auth/refresh`)
- Validate tồn kho khi thêm vào giỏ

## Frontend — Hoàn thành ✅

| Trang / Module | Ghi chú |
|---|---|
| Auth (Login, Register) | Zod validation, toast, redirect, auto-login sau register |
| Landing Page | Hero, Drops, Trending, Marquee, Lookbook |
| Header | Desktop nav + dropdown, mobile menu, cart badge |
| Shop | API thật, filter, sort, load-more pagination, featured grid |
| Product Detail | Gallery, biến thể (size/color), thêm vào giỏ, sản phẩm liên quan |
| Cart | API thật, +/-/remove, CartSummary, coupon input (UI) |
| Admin Layout (Sidebar) | Active state, user info, logout |
| Admin Dashboard | Stats cards, quick actions |
| Admin Products (list) | Table, search, phân trang 10 items, edit/delete |
| Stores (Zustand) | authStore, cartStore, uiStore — persist localStorage |
| Services (API layer) | product.service.js, cartService.js, category.service.js |
| Routes | AdminRoute, ProtectedRoute guard |

## Frontend — Chưa hoàn thiện 🚩

| Trang / Module | Việc cần làm |
|---|---|
| Admin ProductForm | Skeleton — cần implement toàn bộ: fields, variant editor, image upload, submit |
| Admin Categories | Placeholder — cần table + form CRUD |
| Admin Orders | Placeholder — cần implement sau khi có Order API |
| Admin Customers | Placeholder |
| Admin Coupons | Placeholder |
| Checkout | UI-only — cần nối submit handler với Order API |
| Profile | Placeholder "coming soon" |
| Wishlist | Chưa có — icon Header dẫn đến login |
| Reviews (VibeCheckReviews) | `reviews = []`, chưa có submit logic |

## Lộ trình tiếp theo (ưu tiên cao → thấp)

1. **Admin ProductForm** — fields validation, variant editor, image upload preview, create/edit
2. **Order system** — Model + API backend; frontend: Checkout submit → order → trang xác nhận
3. **Checkout flow** — nối với Order API, validate địa chỉ, COD
4. **Profile** — lịch sử đơn, quản lý địa chỉ, đổi mật khẩu
5. **Admin mở rộng** — Categories CRUD, Orders management, Customers list, Coupon CRUD
6. **Coupon backend** — Model + validate logic trong applyCoupon
7. **Wishlist** — Store + API + UI
