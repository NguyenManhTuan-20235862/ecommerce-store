# API Document — Men Fashion E-commerce

> **Phiên bản:** 2.0 — Cập nhật ngày 19/04/2026
> **Đối chiếu với:** `docs/topic/TOPIC GR1.md`, `docs/topic/SRS.md`, source code backend hiện tại.

---

## 1. Mục tiêu tài liệu

Tài liệu này đặc tả **toàn bộ API** của hệ thống, bao gồm:

- **✅ Implemented** — Endpoint đã có route + controller hoạt động trong code.
- **📋 Planned** — Endpoint được yêu cầu bởi SRS/TOPIC, chưa triển khai.

Nguồn đối chiếu:

| Nguồn | Đường dẫn |
| --- | --- |
| Backend code | `backend/server.js`, `routes/*`, `controllers/*`, `models/*` |
| Frontend services | `frontend/src/services/*`, `frontend/src/store/authStore.js` |
| Đề bài đồ án | `docs/topic/TOPIC GR1.md` |
| Tài liệu SRS | `docs/topic/SRS.md` (FR-01 → FR-61, NFR-01 → NFR-13) |

---

## 2. Thông tin chung

| Thuộc tính | Giá trị |
| --- | --- |
| Base URL (local) | `http://localhost:5000/api` |
| Content-Type | `application/json` (trừ upload dùng `multipart/form-data`) |
| CORS origin | `http://localhost:5173`, `credentials: true` |
| Body size limit | `10mb` (JSON) / `5mb` mỗi ảnh (upload) |
| Tiền tệ | VNĐ — sử dụng `Intl.NumberFormat("vi-VN")` ở frontend |

### 2.1. Chiến lược xác thực (Authentication Strategy)

| Token | Mô tả |
| --- | --- |
| **Access Token** | JWT, TTL = 30 phút. Payload chứa `{ userId }`. Trả về trong body khi `signin`. Frontend gửi qua header `Authorization: Bearer <token>`. |
| **Refresh Token** | Chuỗi random 128 ký tự (crypto), TTL = 14 ngày. Lưu trong collection `sessions` trên DB. Set vào **HttpOnly cookie** (`refreshToken`). |

Cookie options (theo môi trường):

```
Production:  { httpOnly: true, secure: true, sameSite: "none" }
Development: { httpOnly: true, secure: false, sameSite: "lax" }
```

### 2.2. Middleware bảo vệ

| Middleware | Mô tả | HTTP lỗi |
| --- | --- | --- |
| `protectedRoute` | Xác minh Bearer token → gắn `req.user` | `401` thiếu token, `403` token sai/hết hạn, `404` user không tồn tại |
| `adminRoute` | Kiểm tra `req.user.role === "admin"` | `403` không có quyền admin |

### 2.3. Chuẩn response lỗi

Tất cả lỗi trả về dạng JSON:

```json
{
  "message": "Mô tả lỗi bằng tiếng Việt"
}
```

---

## 3. API đã triển khai (✅ Implemented)

### 3.1. Tổng quan nhanh

| # | Method | Endpoint | Auth | SRS | Mô tả |
| --- | --- | --- | --- | --- | --- |
| 1 | POST | `/api/auth/signup` | No | FR-01 | Đăng ký tài khoản |
| 2 | POST | `/api/auth/signin` | No | FR-02 | Đăng nhập |
| 3 | POST | `/api/auth/signout` | Optional | FR-03 | Đăng xuất |
| 4 | GET | `/api/users/me` | Bearer | FR-06 | Lấy thông tin user hiện tại |
| 5 | GET | `/api/products` | No | FR-10→18 | Danh sách SP (filter/sort/search/pagination) |
| 6 | GET | `/api/products/:slug` | No | FR-19→21 | Chi tiết sản phẩm |
| 7 | GET | `/api/products/:slug/related` | No | FR-22 | Sản phẩm liên quan |
| 8 | GET | `/api/products/admin/all` | Admin | FR-43 | Danh sách SP cho admin (kể cả inactive) |
| 9 | POST | `/api/products` | Admin | FR-44 | Tạo sản phẩm mới |
| 10 | PUT | `/api/products/:id` | Admin | FR-45 | Cập nhật sản phẩm |
| 11 | DELETE | `/api/products/:id` | Admin | FR-46 | Xóa sản phẩm |
| 12 | GET | `/api/categories` | No | FR-12,FR-49 | Lấy tất cả danh mục |
| 13 | GET | `/api/categories/:slug` | No | FR-12 | Chi tiết danh mục |
| 14 | POST | `/api/categories` | Admin | FR-49 | Tạo danh mục |
| 15 | PUT | `/api/categories/:id` | Admin | FR-49 | Cập nhật danh mục |
| 16 | DELETE | `/api/categories/:id` | Admin | FR-49 | Xóa danh mục |
| 17 | POST | `/api/upload` | Admin | FR-44 | Upload ảnh (tối đa 5 file) |

---

### 3.2. Chi tiết từng endpoint

---

#### 3.2.1. Xác thực & Tài khoản (Auth & User)

---

##### POST `/api/auth/signup`

Đăng ký tài khoản mới. *(SRS: FR-01)*

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

> Backend lưu `displayName = firstName + " " + lastName`. Password hash bằng bcrypt (salt rounds = 10).

**Responses:**

| Status | Body | Mô tả |
| --- | --- | --- |
| `204` | — (No Content) | Đăng ký thành công |
| `400` | `{ "message": "Không thể thiếu username, password, email, firstName, và lastName" }` | Thiếu field bắt buộc |
| `409` | `{ "message": "Username hoặc email đã tồn tại" }` | Trùng username/email |
| `500` | `{ "message": "Lỗi hệ thống" }` | Server error |

---

##### POST `/api/auth/signin`

Đăng nhập. Hỗ trợ đăng nhập bằng `username` **hoặc** `email` (identifier linh hoạt). *(SRS: FR-02)*

**Request body:**

```json
{
  "identifier": "johndoe",
  "password": "123456"
}
```

> Cũng chấp nhận field `username` hoặc `email` thay cho `identifier`.

**Response `200 OK`:**

```json
{
  "message": "User johndoe logged in successfully",
  "accessToken": "<jwt>",
  "user": {
    "_id": "...",
    "username": "johndoe",
    "displayName": "John Doe",
    "role": "customer"
  }
}
```

**Cookie được set:**

```
Set-Cookie: refreshToken=<128-char-hex>; HttpOnly; MaxAge=14d; ...
```

**Responses lỗi:**

| Status | Mô tả |
| --- | --- |
| `400` | Thiếu identifier/password |
| `401` | Sai thông tin đăng nhập |
| `500` | Lỗi hệ thống |

---

##### POST `/api/auth/signout`

Đăng xuất — xóa refresh token khỏi DB và xóa cookie. *(SRS: FR-03)*

> Không yêu cầu Bearer token. Hoạt động dựa trên cookie `refreshToken`.

**Responses:**

| Status | Mô tả |
| --- | --- |
| `204` | Đăng xuất thành công (kể cả khi không có cookie) |
| `500` | Lỗi hệ thống |

---

##### GET `/api/users/me`

Lấy thông tin người dùng hiện tại. *(SRS: FR-06)*

**Headers bắt buộc:**

```http
Authorization: Bearer <accessToken>
```

**Response `200 OK`:**

```json
{
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "role": "customer",
    "phone": null,
    "avatarUrl": null,
    "bio": null,
    "createdAt": "2026-04-10T...",
    "updatedAt": "2026-04-10T..."
  }
}
```

**Responses lỗi (từ `protectedRoute` middleware):**

| Status | Mô tả |
| --- | --- |
| `401` | Thiếu access token |
| `403` | Token sai/hết hạn |
| `404` | User không tồn tại trong DB |
| `500` | Lỗi hệ thống |

---

#### 3.2.2. Sản phẩm (Products)

---

##### GET `/api/products`

Danh sách sản phẩm công khai (chỉ `isActive: true`). *(SRS: FR-10 → FR-18)*

**Query parameters:**

| Param | Type | Default | Mô tả |
| --- | --- | --- | --- |
| `page` | number | `1` | Trang hiện tại |
| `limit` | number | `12` | Số SP mỗi trang (tối đa 50) |
| `category` | string | — | Lọc theo slug danh mục (FR-12) |
| `minPrice` | number | — | Giá tối thiểu VNĐ (FR-15) |
| `maxPrice` | number | — | Giá tối đa VNĐ (FR-15) |
| `size` | string | — | Lọc theo size biến thể, vd: `M`, `L` (FR-13) |
| `color` | string | — | Lọc theo màu biến thể (FR-14) |
| `brand` | string | — | Lọc theo thương hiệu (FR-16) |
| `search` | string | — | Tìm kiếm full-text (name, description, sku) (FR-18) |
| `sort` | string | `newest` | Sắp xếp: `newest`, `oldest`, `price_asc`, `price_desc`, `name_asc` (FR-17) |
| `featured` | string | — | `"true"` để chỉ lấy SP nổi bật (FR-40) |

**Response `200 OK`:**

```json
{
  "products": [
    {
      "_id": "...",
      "name": "Áo thun Urban Minimal",
      "slug": "ao-thun-urban-minimal",
      "description": "...",
      "price": 450000,
      "compareAtPrice": 550000,
      "category": { "_id": "...", "name": "Áo thun", "slug": "ao-thun" },
      "brand": "Vibe Urban",
      "sku": "VU-AT-001",
      "images": ["/uploads/1713...abc.jpg"],
      "variants": [
        { "_id": "...", "size": "M", "color": "Đen", "stock": 25 },
        { "_id": "...", "size": "L", "color": "Trắng", "stock": 18 }
      ],
      "material": "Cotton 100%",
      "careInstructions": "Giặt máy ≤ 30°C",
      "isFeatured": true,
      "isActive": true,
      "totalStock": 43,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 14,
    "totalPages": 2
  }
}
```

---

##### GET `/api/products/:slug`

Chi tiết một sản phẩm (chỉ `isActive: true`). *(SRS: FR-19 → FR-21)*

**Response `200 OK`:**

```json
{
  "product": { ... }
}
```

| Status | Mô tả |
| --- | --- |
| `404` | Không tìm thấy sản phẩm (slug sai hoặc inactive) |
| `500` | Lỗi hệ thống |

---

##### GET `/api/products/:slug/related`

Sản phẩm cùng danh mục, tối đa 4 SP, sắp xếp mới nhất. *(SRS: FR-22)*

**Response `200 OK`:**

```json
{
  "products": [ ... ]
}
```

---

##### GET `/api/products/admin/all`

Danh sách sản phẩm cho Admin, bao gồm cả sản phẩm inactive. *(SRS: FR-43)*

**Auth:** `protectedRoute` + `adminRoute`

**Query parameters:**

| Param | Type | Default | Mô tả |
| --- | --- | --- | --- |
| `page` | number | `1` | Trang hiện tại |
| `limit` | number | `20` | Số SP mỗi trang (tối đa 50) |
| `search` | string | — | Tìm theo tên hoặc SKU (regex) |

**Response:** Cùng format với `GET /api/products`.

---

##### POST `/api/products`

Tạo sản phẩm mới. *(SRS: FR-44)*

**Auth:** `protectedRoute` + `adminRoute`

**Request body:**

```json
{
  "name": "Áo khoác Cargo Utility",
  "description": "Áo khoác phong cách quân đội...",
  "price": 890000,
  "compareAtPrice": 1100000,
  "category": "6620a...",
  "brand": "Vibe Urban",
  "sku": "VU-AK-003",
  "images": ["/uploads/1713...abc.jpg"],
  "variants": [
    { "size": "M", "color": "Olive", "stock": 30 },
    { "size": "L", "color": "Đen", "stock": 20 }
  ],
  "material": "Nylon + Cotton",
  "careInstructions": "Không tẩy, giặt tay",
  "isFeatured": true
}
```

> Slug tự động sinh từ `name` (hỗ trợ tiếng Việt), đảm bảo unique.

**Responses:**

| Status | Body | Mô tả |
| --- | --- | --- |
| `201` | `{ "message": "Tạo sản phẩm thành công", "product": {...} }` | Thành công |
| `400` | `{ "message": "..." }` | Thiếu name/price/category hoặc category không tồn tại |
| `403` | — | Không có quyền admin |
| `500` | — | Lỗi hệ thống |

---

##### PUT `/api/products/:id`

Cập nhật sản phẩm. Chỉ gửi các field cần thay đổi (partial update). *(SRS: FR-45)*

**Auth:** `protectedRoute` + `adminRoute`

**Request body:** Giống `POST`, tất cả field đều optional. Nếu đổi `name` → slug tự động cập nhật.

**Responses:**

| Status | Mô tả |
| --- | --- |
| `200` | `{ "message": "Cập nhật sản phẩm thành công", "product": {...} }` |
| `400` | Category không tồn tại |
| `404` | Không tìm thấy sản phẩm |
| `409` | Slug trùng lặp |
| `500` | Lỗi hệ thống |

---

##### DELETE `/api/products/:id`

Xóa sản phẩm (hard delete). *(SRS: FR-46)*

**Auth:** `protectedRoute` + `adminRoute`

**Responses:**

| Status | Mô tả |
| --- | --- |
| `200` | `{ "message": "Xóa sản phẩm thành công" }` |
| `404` | Không tìm thấy sản phẩm |
| `500` | Lỗi hệ thống |

---

#### 3.2.3. Danh mục (Categories)

---

##### GET `/api/categories`

Lấy tất cả danh mục, sắp xếp theo tên A→Z. *(SRS: FR-12, FR-49)*

**Response `200 OK`:**

```json
{
  "categories": [
    {
      "_id": "...",
      "name": "Áo khoác",
      "slug": "ao-khoac",
      "description": "Áo khoác nam các loại",
      "image": "/uploads/...",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

##### GET `/api/categories/:slug`

Chi tiết một danh mục theo slug.

**Responses:**

| Status | Mô tả |
| --- | --- |
| `200` | `{ "category": {...} }` |
| `404` | Không tìm thấy danh mục |

---

##### POST `/api/categories`

Tạo danh mục mới. *(SRS: FR-49)*

**Auth:** `protectedRoute` + `adminRoute`

**Request body:**

```json
{
  "name": "Giày & Sneaker",
  "description": "Giày phong cách streetwear",
  "image": "/uploads/category-shoes.jpg"
}
```

**Responses:**

| Status | Mô tả |
| --- | --- |
| `201` | `{ "message": "Tạo danh mục thành công", "category": {...} }` |
| `400` | Thiếu tên danh mục |
| `409` | Danh mục (slug) đã tồn tại |
| `500` | Lỗi hệ thống |

---

##### PUT `/api/categories/:id`

Cập nhật danh mục. *(SRS: FR-49)*

**Auth:** `protectedRoute` + `adminRoute`

**Request body (partial update):**

```json
{
  "name": "Tên mới",
  "description": "Mô tả mới",
  "image": "/uploads/new.jpg",
  "isActive": false
}
```

**Responses:**

| Status | Mô tả |
| --- | --- |
| `200` | `{ "message": "Cập nhật danh mục thành công", "category": {...} }` |
| `404` | Không tìm thấy danh mục |
| `409` | Slug đã tồn tại |
| `500` | Lỗi hệ thống |

---

##### DELETE `/api/categories/:id`

Xóa danh mục (hard delete). *(SRS: FR-49)*

**Auth:** `protectedRoute` + `adminRoute`

**Responses:**

| Status | Mô tả |
| --- | --- |
| `200` | `{ "message": "Xóa danh mục thành công" }` |
| `404` | Không tìm thấy danh mục |
| `500` | Lỗi hệ thống |

---

#### 3.2.4. Upload Ảnh

---

##### POST `/api/upload`

Upload tối đa 5 ảnh cùng lúc. *(SRS: FR-44 — Hỗ trợ upload ảnh sản phẩm)*

**Auth:** `protectedRoute` + `adminRoute`

**Content-Type:** `multipart/form-data`

**Form field:** `images` (array of files)

**Ràng buộc:**

| Ràng buộc | Giá trị |
| --- | --- |
| Số file tối đa | 5 |
| Dung lượng tối đa / file | 5 MB |
| Định dạng cho phép | JPEG, PNG, WebP, GIF |

**Response `200 OK`:**

```json
{
  "message": "Upload thành công 3 ảnh",
  "urls": [
    "/uploads/1713...-a1b2c3.jpg",
    "/uploads/1713...-d4e5f6.png",
    "/uploads/1713...-g7h8i9.webp"
  ]
}
```

> URL trả về có thể dùng trực tiếp trong field `images` của Product hoặc `image` của Category.

**Responses lỗi:**

| Status | Mô tả |
| --- | --- |
| `400` | Không có file nào được upload |
| `500` | Lỗi hệ thống |

---

## 4. API chưa triển khai (📋 Planned)

Theo yêu cầu trong `TOPIC GR1.md` và `SRS.md` (FR-04 → FR-61), các nhóm API sau cần được xây dựng trong các phase tiếp theo.

### 4.1. Auth mở rộng

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| POST | `/api/auth/forgot-password` | FR-04 | Gửi email chứa link reset mật khẩu | Trung bình |
| POST | `/api/auth/reset-password` | FR-04 | Đặt lại mật khẩu bằng token | Trung bình |
| POST | `/api/auth/refresh-token` | NFR-07 | Làm mới access token bằng refresh token | Cao |

### 4.2. User Profile mở rộng

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| PUT | `/api/users/me` | FR-07 | Cập nhật displayName, phone, avatar | Trung bình |
| PUT | `/api/users/me/password` | FR-05 | Đổi mật khẩu (oldPassword + newPassword) | Trung bình |
| GET | `/api/users/me/orders` | FR-08 | Lịch sử đơn hàng của user | Cao |
| GET | `/api/users/me/addresses` | FR-07 | Danh sách địa chỉ giao hàng | Trung bình |
| POST | `/api/users/me/addresses` | FR-07 | Thêm địa chỉ mới | Trung bình |
| PUT | `/api/users/me/addresses/:id` | FR-07 | Cập nhật địa chỉ | Trung bình |
| DELETE | `/api/users/me/addresses/:id` | FR-07 | Xóa địa chỉ | Trung bình |

### 4.3. Giỏ hàng (Cart)

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| GET | `/api/cart` | FR-25 | Lấy giỏ hàng (user đã đăng nhập) | Cao |
| POST | `/api/cart/items` | FR-24 | Thêm sản phẩm vào giỏ (productId, variantId, quantity) | Cao |
| PUT | `/api/cart/items/:id` | FR-26 | Cập nhật số lượng | Cao |
| DELETE | `/api/cart/items/:id` | FR-27 | Xóa sản phẩm khỏi giỏ | Cao |
| DELETE | `/api/cart` | FR-28 | Xóa toàn bộ giỏ | Trung bình |
| POST | `/api/cart/apply-coupon` | FR-31 | Áp dụng mã giảm giá | Cao |

> Guest lưu giỏ ở localStorage; user đã đăng nhập lưu trên server (FR-32).

### 4.4. Đơn hàng (Order)

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| POST | `/api/orders` | FR-36 | Tạo đơn hàng mới (từ giỏ hàng + shipping info) | Cao |
| GET | `/api/orders` | FR-08 | Danh sách đơn hàng (user: của mình, admin: tất cả) | Cao |
| GET | `/api/orders/:id` | FR-09,FR-53 | Chi tiết đơn hàng | Cao |
| PUT | `/api/orders/:id/status` | FR-52 | Admin cập nhật trạng thái đơn hàng | Cao |

**Luồng trạng thái đơn hàng (SRS FR-52):**

```
pending → confirmed → shipping → delivered
                                → cancelled
```

**Phương thức thanh toán (SRS FR-34):**
- `COD` — Thanh toán khi nhận hàng
- `VNPAY` — Cổng thanh toán giả lập (điểm cộng)
- `MOMO` — Cổng thanh toán giả lập (điểm cộng)

### 4.5. Đánh giá & Bình luận (Reviews)

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| GET | `/api/products/:id/reviews` | FR-23 | Lấy danh sách đánh giá của sản phẩm | Trung bình |
| POST | `/api/products/:id/reviews` | FR-23 | Tạo đánh giá (rating 1-5, comment) — chỉ khách đã mua | Trung bình |
| DELETE | `/api/reviews/:id` | FR-23 | Xóa đánh giá (admin hoặc chính chủ) | Trung bình |

### 4.6. Wishlist (Yêu thích)

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| GET | `/api/wishlist` | FR-41 | Lấy danh sách sản phẩm yêu thích | Trung bình |
| POST | `/api/wishlist` | FR-41 | Thêm sản phẩm vào wishlist | Trung bình |
| DELETE | `/api/wishlist/:productId` | FR-41 | Bỏ sản phẩm khỏi wishlist | Trung bình |

### 4.7. Admin — Quản lý khách hàng

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| GET | `/api/admin/customers` | FR-54 | Danh sách khách hàng (tìm kiếm tên/email) | Trung bình |
| PUT | `/api/admin/customers/:id/status` | FR-55 | Khóa/Mở tài khoản khách hàng | Trung bình |

### 4.8. Admin — Mã giảm giá (Coupons)

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| GET | `/api/admin/coupons` | FR-58 | Danh sách mã giảm giá | Trung bình |
| POST | `/api/admin/coupons` | FR-56 | Tạo mã giảm giá (code, %, maxUses, expiresAt) | Cao |
| PUT | `/api/admin/coupons/:id` | FR-57 | Sửa mã giảm giá | Cao |
| DELETE | `/api/admin/coupons/:id` | FR-57 | Xóa mã giảm giá | Cao |

### 4.9. Admin — Thống kê (Statistics)

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| GET | `/api/admin/stats/dashboard` | FR-61 | Thống kê tổng quan (số đơn, doanh thu, số KH, số SP) | Cao |
| GET | `/api/admin/stats/revenue` | FR-59 | Biểu đồ doanh thu theo tuần/tháng | Cao |
| GET | `/api/admin/stats/top-products` | FR-60 | Top sản phẩm bán chạy | Cao |

### 4.10. Admin — Import/Export (Điểm cộng)

| Method | Endpoint | SRS | Mô tả | Ưu tiên |
| --- | --- | --- | --- | --- |
| POST | `/api/admin/products/import` | FR-47 | Import sản phẩm từ file Excel | Thấp |
| GET | `/api/admin/products/export` | FR-48 | Export danh sách sản phẩm ra Excel | Thấp |

---

## 5. Chênh lệch naming giữa SRS và Code

| Mục đích | SRS ghi | Code hiện tại | Ghi chú |
| --- | --- | --- | --- |
| Đăng ký | `POST /api/auth/register` | `POST /api/auth/signup` | Giữ naming code làm source of truth |
| Đăng nhập | `POST /api/auth/login` | `POST /api/auth/signin` | Giữ naming code làm source of truth |
| Đăng xuất | `POST /api/auth/logout` | `POST /api/auth/signout` | Giữ naming code làm source of truth |
| Chi tiết SP | `GET /api/products/:id` | `GET /api/products/:slug` | Code dùng slug thay vì ObjectId cho SEO-friendly URL |
| Admin SP | `POST /api/admin/products` | `POST /api/products` (admin middleware) | Code gộp chung prefix `/api/products`, phân quyền bằng middleware |

> **Quyết định:** Giữ naming code hiện tại. Nếu cần bám SRS hoàn toàn, thêm alias route cho các endpoint chênh lệch.

---

## 6. Database Schema tóm tắt

Dưới đây là các MongoDB collection hỗ trợ toàn bộ API:

### 6.1. Đã có trong code

| Collection | Model file | Mô tả |
| --- | --- | --- |
| `users` | `models/User.js` | Tài khoản người dùng (username, email, hashedPassword, displayName, role, phone, avatarUrl) |
| `sessions` | `models/Session.js` | Quản lý refresh token (userId, refreshToken, expiresAt). Có TTL index tự xóa khi hết hạn |
| `products` | `models/Product.js` | Sản phẩm (name, slug, price, compareAtPrice, category ref, variants[], images[], material, isFeatured, isActive). Virtual field `totalStock`. Text index cho search |
| `categories` | `models/Category.js` | Danh mục (name, slug, description, image, isActive) |

### 6.2. Cần tạo thêm theo SRS

| Collection | SRS | Mô tả |
| --- | --- | --- |
| `addresses` | FR-07 | Địa chỉ giao hàng (userId, fullName, phone, province, district, ward, detail, isDefault) |
| `orders` | FR-36 | Đơn hàng (orderNumber, userId, status, items[], totalAmount, shippingFee, discountAmount, finalAmount, paymentMethod, shippingAddress, couponCode) |
| `coupons` | FR-56 | Mã giảm giá (code, discountPercent, maxUses, usedCount, expiresAt, isActive) |
| `reviews` | FR-23 | Đánh giá (productId, userId, rating 1-5, comment) |
| `wishlists` | FR-41 | Yêu thích (userId + productId, compound unique index) |

---

## 7. Môi trường & Biến cấu hình

### Backend (`.env`)

| Biến | Mô tả | Ví dụ |
| --- | --- | --- |
| `MONGODB_CONNECTIONSTRING` | URI kết nối MongoDB | `mongodb://localhost:27017/ecommerce` |
| `ACCESS_TOKEN_SECRET` | Khóa bí mật JWT | `my-super-secret-key` |
| `PORT` | Cổng server | `5000` |
| `NODE_ENV` | Môi trường | `development` / `production` |

### Frontend (`.env`)

| Biến | Mô tả | Ví dụ |
| --- | --- | --- |
| `VITE_API_URL` hoặc `VITE_SERVER_URL` | URL backend API | `http://localhost:5000/api` |

---

## 8. Ma trận truy vết yêu cầu (Traceability Matrix)

| SRS ID | Module | API Endpoint(s) | DB Collection | UI Screen | Trạng thái |
| --- | --- | --- | --- | --- | --- |
| FR-01 | Auth | `POST /api/auth/signup` | users | Register form | ✅ |
| FR-02 | Auth | `POST /api/auth/signin` | users, sessions | Login form | ✅ |
| FR-03 | Auth | `POST /api/auth/signout` | sessions | Header logout | ✅ |
| FR-04 | Auth | `POST /api/auth/forgot-password`, `reset-password` | users | Forgot password form | 📋 |
| FR-05 | User | `PUT /api/users/me/password` | users | Profile > Đổi MK | 📋 |
| FR-06 | User | `GET /api/users/me` | users | Profile page | ✅ |
| FR-07 | User | `PUT /api/users/me`, addresses CRUD | users, addresses | Profile > Địa chỉ | 📋 |
| FR-08 | User | `GET /api/users/me/orders` | orders | Profile > Đơn hàng | 📋 |
| FR-09 | User | `GET /api/orders/:id` | orders | Chi tiết đơn hàng | 📋 |
| FR-10→18 | Product | `GET /api/products` (filter/sort/search/pagination) | products, categories | Shop page | ✅ |
| FR-19→21 | Product | `GET /api/products/:slug` | products | Product detail | ✅ |
| FR-22 | Product | `GET /api/products/:slug/related` | products | Product detail | ✅ |
| FR-23 | Review | `GET/POST /api/products/:id/reviews` | reviews | Product detail | 📋 |
| FR-24→32 | Cart | `/api/cart/*` | localStorage / cart | Cart page | 📋 |
| FR-33→38 | Order | `POST /api/orders` | orders | Checkout page | 📋 |
| FR-39→40 | Home | `GET /api/products?featured=true` | products | Home page | ✅ |
| FR-41 | Wishlist | `/api/wishlist/*` | wishlists | Wishlist page | 📋 |
| FR-43→46 | Admin Product | `GET/POST/PUT/DELETE /api/products/*` | products | Admin Products | ✅ |
| FR-47→48 | Admin Import | `/api/admin/products/import`, `/export` | products | Admin Products | 📋 |
| FR-49 | Admin Category | `GET/POST/PUT/DELETE /api/categories/*` | categories | Admin Categories | ✅ |
| FR-51→53 | Admin Order | `/api/orders/*` | orders | Admin Orders | 📋 |
| FR-54→55 | Admin Customer | `/api/admin/customers/*` | users | Admin Customers | 📋 |
| FR-56→58 | Admin Coupon | `/api/admin/coupons/*` | coupons | Admin Coupons | 📋 |
| FR-59→61 | Admin Stats | `/api/admin/stats/*` | orders, products | Admin Dashboard | 📋 |

---

## 9. Gợi ý chuẩn hóa & cải thiện

1. **Bổ sung endpoint Refresh Token** (`POST /api/auth/refresh-token`) — hiện chưa có, access token hết hạn sẽ buộc đăng nhập lại.
2. **Chuẩn hóa error response format** — Thêm `code` và `details` cho validation errors:
   ```json
   { "code": "VALIDATION_ERROR", "message": "...", "details": [...] }
   ```
3. **Rate limiting** — Thêm middleware giới hạn request cho các route auth (chống brute force).
4. **Swagger/OpenAPI** — Tự động sinh tài liệu tương tác khi mở rộng module Cart/Order.
5. **Pagination chuẩn hóa** — Tất cả listing endpoint nên trả về cùng format `{ data: [], pagination: {} }`.
