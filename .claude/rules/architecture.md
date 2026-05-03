---
description: Cấu trúc thư mục dự án, các quyết định kiến trúc quan trọng và lưu ý kỹ thuật. Tham khảo khi điều hướng codebase hoặc cần hiểu lý do đằng sau một thiết kế.
alwaysApply: false
---

# Kiến Trúc & Cấu Trúc Dự Án

## Cấu trúc thư mục

```text
ecommerce-store/
├── backend/
│   ├── controllers/        # Nhận request, validate input, gọi service, trả response
│   ├── services/           # Business logic: authService, productService, cartService, (orderService sắp tới)
│   ├── utils/              # Shared helpers: slugUtils (generateSlug, ensureUniqueSlug)
│   ├── middlewares/        # authMiddleware (protectedRoute, adminRoute)
│   ├── models/             # User, Session, Product, Category, Cart
│   ├── routes/             # authRoute, cartRoute, productRoute, categoryRoute, userRoute, uploadRoute
│   ├── seeders/            # adminSeeder.js, productSeeder.js
│   ├── uploads/            # ảnh upload local (multer)
│   ├── libs/db.js
│   └── server.js
└── frontend/src/
    ├── pages/
    │   ├── Auth/           # Login.jsx, Register.jsx
    │   ├── Landing/        # index.jsx + 7 components (Hero, Drops, Trending, ...)
    │   ├── Shop/           # index.jsx + FilterSidebar, ProductTile, FeaturedProductTile
    │   ├── Product/        # index.jsx, ProductDetails, ProductGallery, VibeCheckReviews
    │   ├── Cart/           # index.jsx, CartItem, CartSummary, VibeLoyaltyCard
    │   ├── Checkout/       # index.jsx + 5 components (UI-only)
    │   ├── Profile/        # index.jsx (placeholder)
    │   └── Admin/          # Dashboard✅, Products(list✅/form🚩), Categories🚩, Orders🚩, Customers🚩, Coupons🚩
    ├── layouts/            # Header.jsx, AdminLayout.jsx, RootLayout.jsx, Footer.jsx
    ├── store/              # authStore.js, cartStore.js, uiStore.js
    ├── services/           # api.js (axios), product.service.js, cartService.js, category.service.js
    ├── routes/             # AdminRoute.jsx, ProtectedRoute.jsx
    ├── components/         # ui/Button, ui/Input, ui/ProductCard, common/Breadcrumb, common/Pagination
    └── utils/              # cn.js, formatCurrency.js, formatDate.js
```

## Quyết định Kiến trúc

| Quyết định | Lý do |
|---|---|
| **Token lưu localStorage** (Zustand persist) | accessToken lưu qua key `auth-storage`. refreshToken trong MongoDB Session + HttpOnly cookie. |
| **Upload ảnh local (multer)** | Đơn giản, phù hợp demo local. Lưu tại `backend/uploads/`. |
| **Giá VNĐ** | `Intl.NumberFormat("vi-VN")` nhất quán toàn dự án. |
| **Slug generation tiếng Việt** | NFD normalize + `ensureUniqueSlug` tránh duplicate. |
| **Role trong JWT payload** | `user.role` gắn vào payload signin để FE render quyền ngay mà không cần query thêm. |
| **Thiết kế Editorial** | Nhắm 15% điểm giao diện — layout 2 cột lớn thay vì grid template thông thường. |

## Lưu ý kỹ thuật

- `frontend/src/routes/index.jsx` dùng `createBrowserRouter` nhưng `App.jsx` đang dùng `<BrowserRouter>` — file `routes/index.jsx` không có hiệu lực, có thể xóa hoặc migrate sang.
- `outOfStock` trong Admin Dashboard hiện hardcoded = 0, cần tính từ `variants` thực tế.
- Refresh token lưu trong MongoDB Session nhưng chưa có endpoint `/auth/refresh` để rotate.
- `cartStore` tự fetch cart sau login/hydration — cart badge trên Header đọc từ `cartStore.items`.
