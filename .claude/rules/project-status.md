---
description: Trạng thái hoàn thiện của từng module Backend và Frontend, danh sách việc còn thiếu, và lộ trình ưu tiên tiếp theo. Dùng khi lên kế hoạch implement tính năng mới.
alwaysApply: false
---

# Trạng Thái Dự Án (cập nhật 2026-05-10, session 8)

## Backend — Hoàn thành ✅

| Module | Ghi chú |
|---|---|
| Auth (signup/signin/signout/refresh) | JWT + Bcrypt, login bằng username hoặc email, refresh token rotation |
| Middleware (protectedRoute, adminRoute) | JWT verify từ Authorization header |
| Product API (public + admin) | CRUD, filter/sort/pagination/search, related, slug + `GET /admin/:id`. **Limit cap 200** cho public endpoint |
| Category API (public + admin) | CRUD, slug generation |
| **Cart API** ✅ | get/add/update-quantity/remove/clear. **Validate tồn kho**: `findMatchingVariant` + stock check trong `addToCart` + `updateItemQuantity` |
| **Order API** ✅ | Tạo đơn (atomic stock decrement + rollback), danh sách, chi tiết, hủy (hoàn stock), đổi trạng thái có state machine |
| Upload API | Max 5 files, 5MB/file, JPEG/PNG/WebP/GIF — trả **full URL** `http://host/uploads/filename` |
| **User API** ✅ | `GET /users/me`, `PUT /users/me`, `PUT /users/me/password`, `POST /users/me/avatar`, `GET /users` (admin), `GET/POST/DELETE /users/me/wishlist`, **`GET/POST /me/addresses`, `PUT/DELETE /me/addresses/:id`, `PUT /me/addresses/:id/default`** |
| **Coupon API** ✅ | `POST /coupons/validate` (user), CRUD admin — Model (code, discountType, value, minOrder, maxUses, expiresAt, usedCount) |
| **Review API** ✅ | `GET /products/:id/reviews` (public), `POST /products/:id/reviews` (protected), `DELETE /products/:id/reviews/:reviewId` (protected/admin) |
| Models | User (+ wishlist + avatarUrl/avatarId + **addresses[]**), Session, Product, Category, Cart, Order, Coupon, **Review** |
| Seeder | 5 danh mục + 24+ sản phẩm (8 featured) |
| **Services layer** ✅ | `authService`, `productService`, `cartService` (+ **findMatchingVariant**), `orderService`, `userService` (+ wishlist + avatar + **addresses CRUD**), `couponService`, **`reviewService`** + `utils/slugUtils` |

## Backend — Chưa có ❌

_(Không còn backlog — tất cả items đã hoàn thành)_

## Frontend — Hoàn thành ✅

| Trang / Module | Ghi chú |
|---|---|
| Auth (Login, Register) | Zod validation, toast, redirect, auto-login sau register |
| Landing Page | Hero, Drops, Trending, Marquee, Lookbook |
| Header | Desktop nav + dropdown, mobile menu, cart badge, wishlist badge (đỏ) |
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
| **Wishlist** ✅ | Trang `/wishlist`, heart icon trên ProductTile/FeaturedProductTile/ProductDetails, store Zustand (optimistic toggle), badge Header |
| **Reviews** ✅ | `VibeCheckReviews.jsx` redesign grid text cards (sm:2/lg:3), `ReviewModal.jsx` (Zod+RHF, star hover), `Product/index.jsx` fetch + mapReviewToDisplay, `review.service.js` |
| **Profile - Avatar upload** ✅ | Nút camera overlay, hidden file input, upload → `POST /users/me/avatar`, `setUser({ avatarUrl })`, hiển thị ảnh hoặc letter fallback |
| **Profile - Địa chỉ** ✅ | Trang `/profile/addresses`, list/add/edit/delete/set-default, form Zod+RHF (province/district/ward/detail), max 10 địa chỉ |
| **Checkout - Address integration** ✅ | Pre-fill form từ địa chỉ mặc định khi vào trang, nút "Thay đổi địa chỉ" mở modal, chọn địa chỉ → set làm mặc định, auto-save khi checkout lần đầu chưa có địa chỉ |
| Stores (Zustand) | authStore (+ setUser + fetchWishlist), cartStore (+ couponDiscount), wishlistStore, uiStore — persist localStorage |
| **Services (API layer)** ✅ | `product.service.js`, `cartService.js`, `category.service.js`, `order.service.js`, `user.service.js` (+ uploadAvatar + **addresses CRUD**), `coupon.service.js`, `wishlist.service.js`, **`review.service.js`** |
| **Utils** ✅ | `getImageUrl.js` — prefix backend origin cho `/uploads/` path; `cityOptions.js` — shared data dùng chung giữa Profile/Addresses và Checkout |
| Routes | AdminRoute, ProtectedRoute guard |

## Frontend — Chưa hoàn thiện 🚩

_(Không còn backlog bắt buộc — tất cả items đã hoàn thành)_

## Lộ trình tiếp theo (cải thiện thêm)

1. **UI hết hàng trên Product page** — Disable nút + badge "Hết hàng" trên variant khi stock = 0, không cần chờ API
2. **Search trên Shop page** — Thanh tìm kiếm full-text (backend đã có `$text` index)
3. **Cursor-based pagination** — Thay Load More + limit lớn bằng pagination thật nếu catalog mở rộng

## Trạng Thái Chi Tiết

### ✅ Profile (Hoàn thành 100%)

- ✅ `PUT /api/users/me` — update profile (displayName, email, phone) với email uniqueness check
- ✅ `PUT /api/users/me/password` — đổi mật khẩu bcrypt
- ✅ `POST /api/users/me/avatar` — upload avatar (multer single, xóa file cũ, lưu avatarUrl+avatarId)
- ✅ `ProfileInfo.jsx` — avatar ảnh hoặc letter fallback, nút camera overlay, upload handler, view + edit mode, Zod + RHF
- ✅ `ProfileLayout` — 3 nav items: Thông tin tài khoản, Đơn hàng, Đổi mật khẩu
- ✅ `/profile` → redirect `/profile/info` (mặc định)

### ✅ Reviews (Hoàn thành 100%)

- ✅ `backend/models/Review.js` — userId, productId, rating(1-5 int), comment(optional max 1000), unique index {userId,productId}
- ✅ `backend/services/reviewService.js` — `getReviewsByProduct` (bulk verify delivered orders, O(1) DB round-trip), `createReview`, `deleteReview`
- ✅ `backend/controllers/reviewController.js` — 3 handlers, 409 duplicate, 403 forbidden, 404 not found
- ✅ `backend/routes/reviewRoute.js` — `mergeParams: true`, sub-mount dưới `productRoute.js`
- ✅ `frontend/src/services/review.service.js` — `getByProduct`, `create`, `remove`
- ✅ `frontend/src/pages/Product/ReviewModal.jsx` — Zod+RHF, star selector với hover, textarea
- ✅ `frontend/src/pages/Product/VibeCheckReviews.jsx` — grid text cards (sm:2/lg:3), auth gate, modal trigger
- ✅ `frontend/src/pages/Product/index.jsx` — `mapReviewToDisplay` (tên → "MINH H."), fetch reviews, truyền props

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

### ✅ Wishlist (Hoàn thành 100%)

- ✅ `backend/models/User.js` — thêm `wishlist: [ObjectId ref Product]`
- ✅ `backend/services/userService.js` — `getWishlist` (populate isActive), `addToWishlist` ($addToSet), `removeFromWishlist` ($pull), validate ObjectId
- ✅ `backend/controllers/userController.js` — 3 handlers wishlist
- ✅ `backend/routes/userRoute.js` — `GET/POST /me/wishlist`, `DELETE /me/wishlist/:productId`
- ✅ `frontend/src/services/wishlist.service.js` — 3 hàm gọi API
- ✅ `frontend/src/store/wishlistStore.js` — `items`, `isWishlisted()`, `toggle()` optimistic + rollback, `reset()`
- ✅ `frontend/src/store/authStore.js` — `fetchWishlist()` sau login + hydration; `reset()` khi logout
- ✅ `frontend/src/pages/Wishlist/index.jsx` — grid sản phẩm, empty state, redirect nếu chưa auth
- ✅ `frontend/src/layouts/Header.jsx` — heart → `/wishlist`, badge đỏ wishlistCount
- ✅ `frontend/src/pages/Shop/components/ProductTile.jsx` — heart button hover (absolute top-right)
- ✅ `frontend/src/pages/Shop/components/FeaturedProductTile.jsx` — heart button hover
- ✅ `frontend/src/pages/Product/ProductDetails.jsx` — button "Add to Wishlist"/"Đã lưu", nhận `productSlug` + `productImages`
- ✅ `frontend/src/pages/Product/index.jsx` — truyền thêm `productSlug` + `productImages` xuống ProductDetails
- ✅ `frontend/src/pages/Shop/index.jsx` — thêm `_id: p._id` vào `formattedProducts`
- ✅ `frontend/src/App.jsx` — route `/wishlist`

**Lưu ý kỹ thuật Wishlist:**
- `wishlistStore` không persist (fetch lại sau login/hydration — by design, giống cartStore)
- `isWishlisted(id)`: so sánh `String(item._id) === String(productId)` — an toàn với ObjectId và string
- Heart button dùng `e.stopPropagation()` để không trigger Link navigation bên ngoài

### ✅ Admin Panel (Hoàn thành 100%)

- ✅ Admin Layout với sidebar
- ✅ Admin Dashboard (stats cards)
- ✅ Admin Products list + ProductForm (variant editor, image upload)
- ✅ Admin Categories (modal CRUD)
- ✅ Admin Orders (filter tabs, inline status update, detail drawer)
- ✅ Admin Customers (search, table, detail drawer)
- ✅ Admin Coupons (table + modal CRUD)
