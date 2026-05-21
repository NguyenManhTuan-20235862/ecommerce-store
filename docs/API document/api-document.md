# API Document — Vibe Urban E-commerce

> **Phiên bản:** 3.0 — Cập nhật ngày 21/05/2026
> **Đối chiếu với:** Source code `backend/routes/*`, `backend/controllers/*`, `backend/services/*`.

---

## 1. Thông tin chung

| Thuộc tính | Giá trị |
|---|---|
| Base URL (local) | `http://localhost:5000/api` |
| Content-Type | `application/json` (trừ upload dùng `multipart/form-data`) |
| CORS origin | `http://localhost:5173`, `credentials: true` |
| Body size limit | `10mb` (JSON) / `5mb` mỗi ảnh (upload) |
| Tiền tệ | VNĐ — `Intl.NumberFormat("vi-VN")` ở frontend |

### 1.1. Xác thực (Authentication)

| Token | Mô tả |
|---|---|
| **Access Token** | JWT, TTL = 30 phút. Gửi qua header `Authorization: Bearer <token>`. |
| **Refresh Token** | 128-char hex (crypto), TTL = 14 ngày. Lưu trong collection `sessions`. Set qua HttpOnly cookie `refreshToken`. |

Cookie options:
```
Production:  { httpOnly: true, secure: true,  sameSite: "none" }
Development: { httpOnly: true, secure: false, sameSite: "lax"  }
```

### 1.2. Middleware bảo vệ

| Middleware | Mô tả | HTTP lỗi |
|---|---|---|
| `protectedRoute` | Verify Bearer token → gắn `req.user` | `401` thiếu token · `403` sai/hết hạn · `404` user không tồn tại |
| `adminRoute` | Kiểm tra `req.user.role === "admin"` | `403` không có quyền |

### 1.3. Response format

```json
// Thành công
{ "message": "...", "data": { ... } }

// Thất bại
{ "message": "Mô tả lỗi" }
```

---

## 2. Tổng quan nhanh (Quick Reference)

### 2.1. Auth & User

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| POST | `/api/auth/signup` | No | Đăng ký tài khoản |
| POST | `/api/auth/signin` | No | Đăng nhập |
| POST | `/api/auth/signout` | No (cookie) | Đăng xuất |
| POST | `/api/auth/refresh` | No (cookie) | Refresh access token |
| GET | `/api/users/me` | Bearer | Thông tin user hiện tại |
| PUT | `/api/users/me` | Bearer | Cập nhật profile |
| POST | `/api/users/me/avatar` | Bearer | Upload avatar |
| PUT | `/api/users/me/password` | Bearer | Đổi mật khẩu |
| GET | `/api/users/me/wishlist` | Bearer | Danh sách wishlist |
| POST | `/api/users/me/wishlist` | Bearer | Thêm vào wishlist |
| DELETE | `/api/users/me/wishlist/:productId` | Bearer | Xóa khỏi wishlist |
| GET | `/api/users/me/addresses` | Bearer | Danh sách địa chỉ |
| POST | `/api/users/me/addresses` | Bearer | Thêm địa chỉ |
| PUT | `/api/users/me/addresses/:id` | Bearer | Cập nhật địa chỉ |
| DELETE | `/api/users/me/addresses/:id` | Bearer | Xóa địa chỉ |
| PUT | `/api/users/me/addresses/:id/default` | Bearer | Set địa chỉ mặc định |
| GET | `/api/users` | Admin | Danh sách tất cả users |

### 2.2. Products & Categories

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/products` | No | Danh sách SP (filter/sort/search) |
| GET | `/api/products/:slug` | No | Chi tiết sản phẩm |
| GET | `/api/products/:slug/related` | No | SP liên quan |
| GET | `/api/products/:productId/reviews` | No | Đánh giá của SP |
| POST | `/api/products/:productId/reviews` | Bearer | Tạo đánh giá |
| DELETE | `/api/products/:productId/reviews/:reviewId` | Bearer | Xóa đánh giá |
| GET | `/api/products/admin/all` | Admin | Tất cả SP (kể cả inactive) |
| GET | `/api/products/admin/:id` | Admin | Chi tiết SP theo ID |
| POST | `/api/products` | Admin | Tạo sản phẩm |
| PUT | `/api/products/:id` | Admin | Cập nhật sản phẩm |
| DELETE | `/api/products/:id` | Admin | Xóa sản phẩm |
| GET | `/api/categories` | No | Tất cả danh mục |
| GET | `/api/categories/:slug` | No | Chi tiết danh mục |
| POST | `/api/categories` | Admin | Tạo danh mục |
| PUT | `/api/categories/:id` | Admin | Cập nhật danh mục |
| DELETE | `/api/categories/:id` | Admin | Xóa danh mục |

### 2.3. Cart & Order

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/cart` | Bearer | Lấy giỏ hàng |
| POST | `/api/cart/add` | Bearer | Thêm item vào giỏ |
| PUT | `/api/cart/update-quantity` | Bearer | Cập nhật số lượng |
| DELETE | `/api/cart/remove` | Bearer | Xóa item khỏi giỏ |
| DELETE | `/api/cart/clear` | Bearer | Xóa toàn bộ giỏ |
| POST | `/api/cart/apply-coupon` | Bearer | Áp dụng mã giảm giá |
| POST | `/api/orders` | Bearer | Tạo đơn hàng |
| GET | `/api/orders/me` | Bearer | Đơn hàng của user |
| GET | `/api/orders/:id` | Bearer | Chi tiết đơn hàng |
| PUT | `/api/orders/:id/cancel` | Bearer | Hủy đơn hàng |
| GET | `/api/orders` | Admin | Tất cả đơn hàng |
| PUT | `/api/orders/:id/status` | Admin | Cập nhật trạng thái |
| GET | `/api/orders/stats` | Admin | Dashboard stats |
| GET | `/api/orders/stats/daily` | Admin | Doanh thu từng ngày |

### 2.4. Coupons, Lookbook, Combos, Sale

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/coupons/public` | No | Coupon công khai |
| POST | `/api/coupons/validate` | Bearer | Validate coupon |
| GET | `/api/coupons` | Admin | Tất cả coupon |
| POST | `/api/coupons` | Admin | Tạo coupon |
| PUT | `/api/coupons/:id` | Admin | Sửa coupon |
| DELETE | `/api/coupons/:id` | Admin | Xóa coupon |
| GET | `/api/lookbook` | No | Danh sách lookbook stories |
| GET | `/api/lookbook/admin` | Admin | Tất cả lookbook |
| POST | `/api/lookbook` | Admin | Tạo story |
| PUT | `/api/lookbook/:id` | Admin | Sửa story |
| DELETE | `/api/lookbook/:id` | Admin | Xóa story |
| GET | `/api/combos` | No | Danh sách combo |
| GET | `/api/combos/admin` | Admin | Tất cả combo |
| POST | `/api/combos` | Admin | Tạo combo |
| PUT | `/api/combos/:id` | Admin | Sửa combo |
| DELETE | `/api/combos/:id` | Admin | Xóa combo |
| GET | `/api/sale-config` | No | Bậc khách hàng (tiers) |
| PUT | `/api/sale-config/tiers` | Admin | Cập nhật tiers |

### 2.5. About CMS (Stores, Team, SiteConfig)

| Method | Endpoint | Auth | Mô tả |
|---|---|---|---|
| GET | `/api/stores` | No | Danh sách cửa hàng |
| GET | `/api/stores/admin` | Admin | Tất cả cửa hàng |
| POST | `/api/stores` | Admin | Tạo cửa hàng |
| PUT | `/api/stores/:id` | Admin | Sửa cửa hàng |
| DELETE | `/api/stores/:id` | Admin | Xóa cửa hàng |
| GET | `/api/team` | No | Danh sách thành viên |
| GET | `/api/team/admin` | Admin | Tất cả thành viên |
| POST | `/api/team` | Admin | Thêm thành viên |
| PUT | `/api/team/:id` | Admin | Sửa thành viên |
| DELETE | `/api/team/:id` | Admin | Xóa thành viên |
| GET | `/api/about-config` | No | Site config (hotline, email, ...) |
| PUT | `/api/about-config` | Admin | Cập nhật site config |
| POST | `/api/upload` | Admin | Upload ảnh (tối đa 5 file) |

---

## 3. Chi tiết endpoint

### 3.1. Auth

---

#### POST `/api/auth/signup`

Đăng ký tài khoản mới.

**Request body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```
> Backend gộp `firstName + lastName` → `displayName`.

| Status | Mô tả |
|---|---|
| `204` | Đăng ký thành công |
| `400` | Thiếu field bắt buộc |
| `409` | Username hoặc email đã tồn tại |

---

#### POST `/api/auth/signin`

Đăng nhập. Hỗ trợ `identifier` (username hoặc email).

**Request body:**
```json
{ "identifier": "johndoe", "password": "123456" }
```

**Response `200`:**
```json
{
  "message": "User johndoe logged in successfully",
  "accessToken": "<jwt>",
  "user": { "_id": "...", "username": "johndoe", "displayName": "John Doe", "role": "customer" }
}
```
> Cookie `refreshToken` (HttpOnly) được set tự động.

---

#### POST `/api/auth/signout`

Đăng xuất — xóa session trong DB + xóa cookie.

| Status | Mô tả |
|---|---|
| `204` | Thành công (kể cả khi không có cookie) |

---

#### POST `/api/auth/refresh`

Làm mới access token bằng refresh token trong cookie.

> Không cần Bearer token. Đọc cookie `refreshToken`, rotate (xóa cũ tạo mới), trả về access token mới.

**Response `200`:**
```json
{ "accessToken": "<new-jwt>" }
```

| Status | Mô tả |
|---|---|
| `401` | Không có cookie refresh token |
| `403` | Refresh token không hợp lệ / đã hết hạn |

---

### 3.2. User

---

#### GET `/api/users/me`

Thông tin user hiện tại.

**Response `200`:**
```json
{
  "user": {
    "_id": "...", "username": "johndoe", "email": "john@example.com",
    "displayName": "John Doe", "role": "customer", "phone": null,
    "avatarUrl": null, "bio": null, "createdAt": "..."
  }
}
```

---

#### PUT `/api/users/me`

Cập nhật profile.

**Request body (partial):**
```json
{ "displayName": "Tên Mới", "phone": "0901234567", "bio": "..." }
```

---

#### POST `/api/users/me/avatar`

Upload ảnh đại diện.

**Content-Type:** `multipart/form-data` | **Field:** `avatar` (1 file)

**Response `200`:** `{ "message": "...", "avatarUrl": "/uploads/..." }`

---

#### PUT `/api/users/me/password`

Đổi mật khẩu.

**Request body:**
```json
{ "currentPassword": "old123", "newPassword": "new456" }
```

| Status | Mô tả |
|---|---|
| `200` | Đổi mật khẩu thành công |
| `400` | Thiếu field |
| `401` | Mật khẩu hiện tại sai |

---

#### GET `/api/users/me/wishlist`

Trả về danh sách sản phẩm yêu thích (có populate).

**Response `200`:** `{ "wishlist": [ { ...product } ] }`

---

#### POST `/api/users/me/wishlist`

Thêm SP vào wishlist (toggle — nếu đã có thì bỏ ra).

**Request body:** `{ "productId": "..." }`

---

#### DELETE `/api/users/me/wishlist/:productId`

Xóa SP khỏi wishlist.

---

#### GET `/api/users/me/addresses`

Danh sách địa chỉ của user.

**Response `200`:** `{ "addresses": [ { "_id": "...", "province": "...", "isDefault": true, ... } ] }`

---

#### POST `/api/users/me/addresses`

Thêm địa chỉ mới (tối đa 10 địa chỉ/user).

**Request body:**
```json
{ "province": "TP. Hồ Chí Minh", "district": "Quận 1", "ward": "Phường Bến Nghé", "detail": "123 Lê Lợi" }
```

---

#### PUT `/api/users/me/addresses/:addressId`

Cập nhật địa chỉ.

---

#### DELETE `/api/users/me/addresses/:addressId`

Xóa địa chỉ.

---

#### PUT `/api/users/me/addresses/:addressId/default`

Set địa chỉ làm mặc định (unset các địa chỉ khác).

---

### 3.3. Products

---

#### GET `/api/products`

Danh sách sản phẩm công khai (`isActive: true`).

**Query parameters:**

| Param | Type | Default | Mô tả |
|---|---|---|---|
| `page` | number | `1` | Trang |
| `limit` | number | `12` | Số SP/trang (max 50) |
| `category` | string | — | Slug danh mục |
| `minPrice` | number | — | Giá tối thiểu VNĐ |
| `maxPrice` | number | — | Giá tối đa VNĐ |
| `size` | string | — | Lọc size biến thể |
| `color` | string | — | Lọc màu biến thể |
| `brand` | string | — | Lọc thương hiệu |
| `search` | string | — | Full-text search (name, description, sku) |
| `sort` | string | `newest` | `newest` · `oldest` · `price_asc` · `price_desc` · `name_asc` |
| `featured` | string | — | `"true"` để chỉ lấy SP nổi bật |

**Response `200`:**
```json
{
  "products": [ { "_id": "...", "name": "...", "price": 450000, "compareAtPrice": 550000, "costPrice": 207000, ... } ],
  "pagination": { "page": 1, "limit": 12, "total": 33, "totalPages": 3 }
}
```

---

#### GET `/api/products/:slug`

Chi tiết sản phẩm theo slug (`isActive: true`).

**Response `200`:** `{ "product": { ... } }`

---

#### GET `/api/products/:slug/related`

Sản phẩm cùng danh mục, tối đa 4, mới nhất trước.

---

#### POST `/api/products`

Tạo sản phẩm mới. **Auth:** Admin.

**Request body:**
```json
{
  "name": "Áo khoác Cargo",
  "price": 890000,
  "compareAtPrice": 1100000,
  "costPrice": 445000,
  "category": "<categoryId>",
  "brand": "Vibe Urban",
  "sku": "VU-AK-003",
  "images": ["/uploads/abc.jpg"],
  "variants": [ { "size": "M", "color": "Olive", "stock": 30 } ],
  "isFeatured": true
}
```
> Slug tự sinh từ `name`, đảm bảo unique. `costPrice` nên điền để dashboard tính lợi nhuận chính xác.

---

#### PUT `/api/products/:id`

Cập nhật sản phẩm (partial update). **Auth:** Admin.

---

#### DELETE `/api/products/:id`

Xóa sản phẩm (hard delete). **Auth:** Admin.

---

### 3.4. Reviews

---

#### GET `/api/products/:productId/reviews`

Danh sách đánh giá của sản phẩm.

**Response `200`:**
```json
{
  "reviews": [
    {
      "_id": "...", "rating": 5, "comment": "Áo đẹp!",
      "userId": { "_id": "...", "displayName": "John Doe", "avatarUrl": null },
      "isVerified": true,
      "createdAt": "..."
    }
  ],
  "stats": { "avgRating": 4.5, "totalReviews": 12 }
}
```
> `isVerified = true` nếu user đã có đơn hàng `delivered` chứa SP này.

---

#### POST `/api/products/:productId/reviews`

Tạo đánh giá. **Auth:** Bearer (đã mua hàng).

**Request body:**
```json
{ "rating": 5, "comment": "Áo đẹp, vải mát!" }
```

| Status | Mô tả |
|---|---|
| `201` | Tạo thành công |
| `409` | Đã đánh giá sản phẩm này rồi |

---

#### DELETE `/api/products/:productId/reviews/:reviewId`

Xóa đánh giá. **Auth:** Bearer (chính chủ hoặc admin).

---

### 3.5. Categories

---

#### GET `/api/categories`

Tất cả danh mục, sắp xếp A→Z.

**Response `200`:**
```json
{
  "categories": [ { "_id": "...", "name": "Áo khoác", "slug": "ao-khoac", "image": "/uploads/...", "isActive": true } ]
}
```

---

#### POST `/api/categories`

Tạo danh mục. **Auth:** Admin.

**Request body:** `{ "name": "Giày & Sneaker", "description": "...", "image": "/uploads/..." }`

---

### 3.6. Upload

---

#### POST `/api/upload`

Upload tối đa 5 ảnh. **Auth:** Admin. **Content-Type:** `multipart/form-data`

| Ràng buộc | Giá trị |
|---|---|
| Số file tối đa | 5 |
| Dung lượng / file | 5 MB |
| Định dạng | JPEG, PNG, WebP, GIF |

**Response `200`:**
```json
{ "message": "Upload thành công 2 ảnh", "urls": ["/uploads/abc.jpg", "/uploads/def.png"] }
```

---

### 3.7. Cart

---

#### GET `/api/cart`

Lấy giỏ hàng. Tự tạo giỏ trống nếu chưa có.

**Response `200`:**
```json
{
  "cart": {
    "_id": "...", "userId": "...",
    "items": [ { "_id": "...", "productId": "...", "productName": "...", "price": 450000, "quantity": 2, "selectedSize": "M", "selectedColor": "Đen" } ],
    "couponCode": null, "shippingFee": 0
  }
}
```

---

#### POST `/api/cart/add`

Thêm SP vào giỏ. Nếu cùng productId + size + color đã có → tăng số lượng.

**Request body:**
```json
{ "productId": "...", "quantity": 1, "selectedSize": "M", "selectedColor": "Đen" }
```
> Cũng chấp nhận `slug` thay cho `productId`.

---

#### PUT `/api/cart/update-quantity`

**Request body:** `{ "itemId": "...", "quantity": 3 }` (quantity ≥ 1)

---

#### DELETE `/api/cart/remove`

**Request body:** `{ "itemId": "..." }`

---

#### POST `/api/cart/apply-coupon`

Validate và áp dụng mã giảm giá.

**Request body:** `{ "couponCode": "SALE10" }`

**Response `200`:**
```json
{
  "message": "Áp dụng mã giảm giá thành công",
  "discount": 45000,
  "discountType": "percent",
  "discountValue": 10,
  "cart": { ... }
}
```

| Status | Mô tả |
|---|---|
| `400` | Coupon không hợp lệ / hết hạn / vượt giới hạn / đơn chưa đủ minOrderValue |

---

### 3.8. Orders

---

#### POST `/api/orders`

Tạo đơn hàng từ giỏ hàng. Giảm stock atomic (rollback nếu hết hàng).

**Request body:**
```json
{
  "shippingAddress": {
    "receiverName": "Nguyễn Văn A",
    "receiverPhone": "0901234567",
    "receiverEmail": "a@example.com",
    "province": "TP. Hồ Chí Minh",
    "district": "Quận 1",
    "ward": "Phường Bến Nghé",
    "detail": "123 Lê Lợi"
  },
  "paymentMethod": "COD",
  "couponCode": "SALE10"
}
```

**Response `201`:**
```json
{
  "message": "Đặt hàng thành công",
  "order": {
    "_id": "...", "orderNumber": "ORD-20260521-0001",
    "status": "pending", "finalAmount": 855000, ...
  }
}
```

| Status | Mô tả |
|---|---|
| `400` | Giỏ hàng trống / thiếu thông tin / hết hàng |

---

#### GET `/api/orders/me`

Danh sách đơn hàng của user hiện tại, mới nhất trước.

**Response `200`:** `{ "orders": [ { ...order } ] }`

---

#### GET `/api/orders/:id`

Chi tiết đơn hàng. User chỉ xem được đơn của mình; admin xem được tất cả.

---

#### PUT `/api/orders/:id/cancel`

User hủy đơn. Chỉ được hủy khi `status = "pending"`. Hoàn lại stock.

---

#### GET `/api/orders/stats` — Admin

Dashboard stats tổng hợp.

**Response `200`:**
```json
{
  "totalOrders": 150,
  "totalRevenue": 75000000,
  "totalCustomers": 82,
  "totalProducts": 33,
  "outOfStock": 3,
  "ordersByStatus": { "pending": 12, "confirmed": 8, "shipping": 5, "delivered": 120, "cancelled": 5 },
  "revenueByMonth": [ { "month": 1, "revenue": 5000000 }, ... ],
  "topProducts": [ { "name": "Áo thun Urban", "totalSold": 45, "revenue": 20250000 } ],
  "estimatedProfit": 34500000
}
```
> `estimatedProfit = totalRevenue − totalCost` (tính via `$lookup` sang `products.costPrice`).

---

#### GET `/api/orders/stats/daily?year=2026&month=5` — Admin

Doanh thu từng ngày trong tháng.

**Response `200`:** `{ "daily": [ { "day": 1, "revenue": 450000, "orders": 2 }, ... ] }`

---

#### PUT `/api/orders/:id/status` — Admin

Cập nhật trạng thái đơn hàng.

**Request body:** `{ "status": "confirmed" }`

**State machine hợp lệ:**
```
pending → confirmed
confirmed → shipping
shipping → delivered
pending/confirmed/shipping → cancelled
```

---

### 3.9. Coupons

---

#### GET `/api/coupons/public`

Danh sách coupon có `isPublic: true` và còn hiệu lực.

---

#### POST `/api/coupons/validate`

Kiểm tra coupon có thể dùng với đơn hàng không (không áp dụng vào cart).

**Request body:** `{ "code": "SALE10", "orderAmount": 500000 }`

**Response `200`:**
```json
{ "valid": true, "discount": 50000, "discountType": "percent", "discountValue": 10 }
```

---

#### POST `/api/coupons` — Admin

Tạo coupon.

**Request body:**
```json
{
  "code": "SUMMER20",
  "discountType": "percent",
  "discountValue": 20,
  "minOrderValue": 300000,
  "maxUses": 100,
  "expiresAt": "2026-08-31T23:59:59.000Z",
  "isActive": true,
  "isPublic": true
}
```

---

### 3.10. Sale Config (Bậc khách hàng)

---

#### GET `/api/sale-config`

Lấy cấu hình bậc tích lũy.

**Response `200`:**
```json
{
  "tiers": [
    { "label": "Silver", "threshold": 1000000, "discountPercent": 5, "perks": ["Ưu tiên hỗ trợ"] },
    { "label": "Gold", "threshold": 3000000, "discountPercent": 10, "perks": ["Miễn phí ship", "Ưu tiên hỗ trợ"] }
  ]
}
```

---

#### PUT `/api/sale-config/tiers` — Admin

Cập nhật toàn bộ danh sách tiers.

**Request body:** `{ "tiers": [ { "label": "Silver", "threshold": 1000000, "discountPercent": 5, "order": 1 } ] }`

---

### 3.11. Lookbook

---

#### GET `/api/lookbook`

Danh sách stories (isActive = true), sắp xếp theo `order`.

**Response `200`:**
```json
{
  "stories": [ { "_id": "...", "title": "Urban Chronicles", "imageUrl": "/uploads/...", "aspectRatio": "4:5" } ]
}
```

---

### 3.12. Combos

---

#### GET `/api/combos`

Danh sách combo (isActive = true), có populate product.

**Response `200`:**
```json
{
  "combos": [
    {
      "_id": "...", "name": "Street Combo",
      "products": [ { "product": { "_id": "...", "name": "Áo thun", "price": 450000 }, "label": "Áo" } ],
      "comboPrice": 750000
    }
  ]
}
```

---

### 3.13. About CMS (Stores / Team / SiteConfig)

#### GET `/api/stores`

Danh sách cửa hàng đang hoạt động.

**Response `200`:** `{ "stores": [ { "name": "VU Sài Gòn", "cityKey": "SG", "address": "...", "phone": "...", "mapSrc": "..." } ] }`

---

#### GET `/api/team`

Danh sách thành viên đang hoạt động, sắp xếp theo `order`.

---

#### GET `/api/about-config`

Lấy thông tin liên lạc toàn site.

**Response `200`:** `{ "config": { "hotline": "1800 9090", "email": "hello@vibeurban.vn", "zalo": "...", "press": "..." } }`

---

## 4. Chênh lệch naming giữa SRS và Code

| Mục đích | SRS ghi | Code hiện tại | Ghi chú |
|---|---|---|---|
| Đăng ký | `POST /api/auth/register` | `POST /api/auth/signup` | Giữ naming code |
| Đăng nhập | `POST /api/auth/login` | `POST /api/auth/signin` | Giữ naming code |
| Đăng xuất | `POST /api/auth/logout` | `POST /api/auth/signout` | Giữ naming code |
| Chi tiết SP | `GET /api/products/:id` | `GET /api/products/:slug` | Code dùng slug (SEO-friendly) |
| Admin SP | `POST /api/admin/products` | `POST /api/products` (admin middleware) | Phân quyền bằng middleware, không chia prefix |
| Admin stats | `GET /api/admin/stats/dashboard` | `GET /api/orders/stats` | Nằm trong orderRoute |

---

## 5. Tính năng chưa triển khai (Planned)

| Tính năng | Mô tả | Ưu tiên |
|---|---|---|
| `POST /api/auth/forgot-password` | Gửi email reset mật khẩu | Thấp |
| `POST /api/auth/reset-password` | Đặt lại mật khẩu bằng token | Thấp |
| `PUT /api/admin/customers/:id/status` | Khóa/mở tài khoản khách hàng | Thấp |
| `POST /api/admin/products/import` | Import sản phẩm từ Excel | Thấp |
| `GET /api/admin/products/export` | Export sản phẩm ra Excel | Thấp |
| Cursor-based pagination | Thay offset pagination bằng cursor | Trung bình |
