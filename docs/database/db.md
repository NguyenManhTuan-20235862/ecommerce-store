# Database Document — Vibe Urban E-commerce

> **Phiên bản:** 3.0 — Cập nhật ngày 21/05/2026
> **Đồng bộ với:** Source code `backend/models/*` hiện tại.

---

## 1. Công nghệ & kết nối

- **Database:** MongoDB (qua Mongoose)
- **File kết nối:** `backend/libs/db.js`
- **Biến môi trường bắt buộc:** `MONGODB_CONNECTIONSTRING`

---

## 2. Tổng quan collections

| Collection | Model file | Mô tả | Trạng thái |
|---|---|---|---|
| `users` | `User.js` | Tài khoản, profile, wishlist, địa chỉ | ✅ |
| `sessions` | `Session.js` | Refresh token (TTL tự xóa) | ✅ |
| `products` | `Product.js` | Sản phẩm, biến thể, giá vốn | ✅ |
| `categories` | `Category.js` | Danh mục sản phẩm | ✅ |
| `carts` | `Cart.js` | Giỏ hàng (1 user = 1 cart) | ✅ |
| `orders` | `Order.js` | Đơn hàng, snapshot địa chỉ + sản phẩm | ✅ |
| `coupons` | `Coupon.js` | Mã giảm giá (percent/fixed) | ✅ |
| `reviews` | `Review.js` | Đánh giá sản phẩm (1 user / 1 SP) | ✅ |
| `lookbooks` | `Lookbook.js` | Lookbook / Urban Chronicles stories | ✅ |
| `saleconfigs` | `SaleConfig.js` | Chính sách bậc khách hàng (tiers) | ✅ |
| `combos` | `Combo.js` | Gói combo sản phẩm | ✅ |
| `stores` | `Store.js` | Thông tin cửa hàng (About page) | ✅ |
| `teammembers` | `TeamMember.js` | Thành viên đội ngũ (About page) | ✅ |
| `siteconfigs` | `SiteConfig.js` | Config toàn site (hotline, email, ...) | ✅ |

---

## 3. Chi tiết schema

### 3.1. `users`

**File:** `backend/models/User.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `username` | String | required, unique, lowercase, trim | Tên đăng nhập |
| `hashedPassword` | String | required | Hash bcrypt (salt=10) |
| `email` | String | required, unique, lowercase, trim | Email duy nhất |
| `displayName` | String | required, trim | Tên hiển thị |
| `avatarUrl` | String | optional | URL ảnh đại diện |
| `avatarId` | String | optional | ID ảnh local (dùng để xóa) |
| `bio` | String | optional, maxlength 500 | Giới thiệu ngắn |
| `phone` | String | optional, sparse | Số điện thoại |
| `role` | String | enum `["customer","admin"]`, default `"customer"` | Phân quyền |
| `wishlist` | [ObjectId] | ref `Product` | Danh sách SP yêu thích |
| `addresses` | [addressSchema] | subdoc, tối đa 10 địa chỉ | Địa chỉ giao hàng |

**addressSchema (subdoc trong `users.addresses`):**

| Field | Type | Ràng buộc |
|---|---|---|
| `province` | String | required |
| `district` | String | required |
| `ward` | String | required |
| `detail` | String | required |
| `isDefault` | Boolean | default `false` |

> **Lưu ý thiết kế:** Wishlist và Addresses là subdoc/embedded array trong `users`, không phải collection riêng.

---

### 3.2. `sessions`

**File:** `backend/models/Session.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `userId` | ObjectId | required, ref `User`, index | Liên kết user |
| `refreshToken` | String | required, unique | 128-char hex (crypto.randomBytes) |
| `expiresAt` | Date | required | TTL = 14 ngày từ lúc tạo |

**Indexes:**
- `userId` — tìm session theo user
- `{ expiresAt: 1 }` với `expireAfterSeconds: 0` — **TTL index**, MongoDB tự xóa session hết hạn

---

### 3.3. `products`

**File:** `backend/models/Product.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `name` | String | required, maxlength 200 | Tên sản phẩm |
| `slug` | String | required, unique | Tự sinh từ name, SEO-friendly |
| `description` | String | maxlength 5000 | Mô tả |
| `price` | Number | required, min 0 | Giá bán VNĐ |
| `compareAtPrice` | Number | default 0 | Giá gốc (gạch ngang, marketing) |
| `costPrice` | Number | default 0, min 0 | Giá vốn nhập hàng (dùng tính lợi nhuận) |
| `category` | ObjectId | required, ref `Category` | Danh mục |
| `brand` | String | optional | Thương hiệu |
| `sku` | String | optional, uppercase | Mã SKU |
| `images` | [String] | optional | Mảng URL ảnh |
| `variants` | [variantSchema] | optional | Biến thể (size × màu) |
| `material` | String | optional | Chất liệu |
| `careInstructions` | String | optional | Hướng dẫn bảo quản |
| `sizeChart` | Mixed | optional | Bảng size tùy chỉnh |
| `isFeatured` | Boolean | default false | Sản phẩm nổi bật |
| `isActive` | Boolean | default true | Hiển thị / ẩn |

**variantSchema (subdoc trong `products.variants`):**

| Field | Type | Ràng buộc |
|---|---|---|
| `size` | String | required, uppercase |
| `color` | String | required |
| `colorHex` | String | optional (mã hex) |
| `stock` | Number | required, min 0, default 0 |

**Virtual field:** `totalStock` — tổng `stock` của tất cả variants.

**Indexes:** `category`, `price`, `(isFeatured, isActive)`, text index trên `(name, description, sku)`.

---

### 3.4. `categories`

**File:** `backend/models/Category.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `name` | String | required, maxlength 100 | Tên danh mục |
| `slug` | String | required, unique | Slug SEO |
| `description` | String | optional, maxlength 500 | Mô tả |
| `image` | String | optional | URL ảnh đại diện |
| `isActive` | Boolean | default true | Hiển thị / ẩn |

---

### 3.5. `carts`

**File:** `backend/models/Cart.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `userId` | ObjectId | required, unique, ref `User` | 1 user = 1 cart |
| `items` | [cartItemSchema] | optional | Danh sách item |
| `couponCode` | String | default null | Mã coupon đang áp dụng |
| `shippingFee` | Number | default 0 | Phí vận chuyển tạm tính |

**cartItemSchema (subdoc):**

| Field | Type | Ràng buộc |
|---|---|---|
| `productId` | ObjectId | required, ref `Product` |
| `productName` | String | required |
| `productImage` | String | required |
| `quantity` | Number | required, min 1, default 1 |
| `price` | Number | required |
| `selectedSize` | String | required |
| `selectedColor` | String | required |
| `comboGroupId` | String | default null |
| `comboName` | String | default null |
| `originalPrice` | Number | default null |

---

### 3.6. `orders`

**File:** `backend/models/Order.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `orderNumber` | String | required, unique | Format: `ORD-YYYYMMDD-XXXX` |
| `userId` | ObjectId | required, ref `User` | Người đặt hàng |
| `status` | String | enum (xem bên dưới), default `"pending"` | Trạng thái đơn |
| `items` | [orderItemSchema] | required | Snapshot SP tại thời điểm đặt |
| `totalAmount` | Number | required | Tổng giá trước giảm + ship |
| `shippingFee` | Number | default 0 | Phí vận chuyển |
| `discountAmount` | Number | default 0 | Số tiền giảm (coupon) |
| `tierDiscount` | Number | default 0 | Số tiền giảm (bậc KH) |
| `tierLabel` | String | default `""` | Tên bậc khách hàng |
| `finalAmount` | Number | required | Số tiền thực thu |
| `paymentMethod` | String | enum `["COD","VNPAY","MOMO"]`, default `"COD"` | Phương thức TT |
| `shippingAddress` | shippingAddressSchema | required | Snapshot địa chỉ giao |
| `couponCode` | String | default null | Mã coupon đã dùng |

**Trạng thái đơn hàng (state machine):**
```
pending → confirmed → shipping → delivered
               └─────────────────→ cancelled
```

**orderItemSchema (subdoc — snapshot tại thời điểm đặt hàng):**

| Field | Type | Ràng buộc |
|---|---|---|
| `productId` | ObjectId | required, ref `Product` |
| `productName` | String | required |
| `productImage` | String | required |
| `quantity` | Number | required, min 1 |
| `price` | Number | required (giá tại thời điểm order) |
| `selectedSize` | String | required |
| `selectedColor` | String | required |

**shippingAddressSchema (subdoc — snapshot):**

| Field | Type | Ràng buộc |
|---|---|---|
| `receiverName` | String | required |
| `receiverPhone` | String | required |
| `receiverEmail` | String | required |
| `province` | String | required |
| `district` | String | required |
| `ward` | String | required |
| `detail` | String | required |

> **Thiết kế quan trọng:** Thông tin SP và địa chỉ được **snapshot** vào order — tránh lệch lịch sử khi product/address thay đổi sau này.

---

### 3.7. `coupons`

**File:** `backend/models/Coupon.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `code` | String | required, unique, uppercase, trim | Mã coupon |
| `discountType` | String | required, enum `["percent","fixed"]` | Loại giảm giá |
| `discountValue` | Number | required, min 1 | Giá trị giảm (% hoặc VNĐ) |
| `minOrderValue` | Number | default 0 | Giá trị đơn tối thiểu |
| `maxUses` | Number | default null | null = không giới hạn |
| `usedCount` | Number | default 0 | Số lần đã dùng |
| `expiresAt` | Date | default null | null = không hết hạn |
| `isActive` | Boolean | default true | Bật / tắt |
| `isPublic` | Boolean | default false | Hiển thị trên trang public |

---

### 3.8. `reviews`

**File:** `backend/models/Review.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `userId` | ObjectId | required, ref `User` | Người đánh giá |
| `productId` | ObjectId | required, ref `Product` | Sản phẩm được đánh giá |
| `rating` | Number | required, min 1, max 5, integer | Điểm đánh giá |
| `comment` | String | optional, maxlength 1000 | Nội dung đánh giá |

**Indexes:**
- Compound unique `(userId, productId)` — mỗi user chỉ review 1 lần/sản phẩm
- `(productId, createdAt desc)` — lấy review theo SP, mới nhất trước

> **Verified flag:** Service `reviewService.getReviewsByProduct()` tự tính `isVerified = true` nếu user có đơn hàng `delivered` chứa sản phẩm đó.

---

### 3.9. `lookbooks`

**File:** `backend/models/Lookbook.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `title` | String | required, maxlength 100 | Tiêu đề story |
| `subtitle` | String | optional | Phụ đề |
| `imageUrl` | String | optional | URL ảnh |
| `imageId` | String | optional | ID ảnh local (xóa file) |
| `aspectRatio` | String | enum `["16:9","4:5","3:4","8:4"]`, default `"4:5"` | Tỉ lệ hiển thị |
| `order` | Number | required, default 0 | Thứ tự hiển thị |
| `isActive` | Boolean | default true | Hiển thị / ẩn |

**Index:** `order`

---

### 3.10. `saleconfigs`

**File:** `backend/models/SaleConfig.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `tiers` | [tierSchema] | optional | Danh sách bậc khách hàng |

**tierSchema (subdoc):**

| Field | Type | Ràng buộc |
|---|---|---|
| `label` | String | required (ví dụ: "Silver", "Gold") |
| `threshold` | Number | required, min 0 (mốc chi tiêu VNĐ) |
| `discountPercent` | Number | required, min 0, max 100 |
| `perks` | [String] | optional |
| `order` | Number | default 0 |

---

### 3.11. `combos`

**File:** `backend/models/Combo.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `name` | String | required, maxlength 100 | Tên combo |
| `subtitle` | String | optional | Phụ đề |
| `products` | [subdoc] | optional | Danh sách SP trong combo |
| `comboPrice` | Number | required, min 0 | Giá combo (đã giảm) |
| `isActive` | Boolean | default true | Bật / tắt |
| `order` | Number | default 0 | Thứ tự hiển thị |

**products subdoc:**

| Field | Type | Ràng buộc |
|---|---|---|
| `product` | ObjectId | required, ref `Product` |
| `label` | String | optional (ví dụ: "Quần tây") |

---

### 3.12. `stores`

**File:** `backend/models/Store.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `name` | String | required, maxlength 100 | Tên cửa hàng |
| `cityKey` | String | required, enum `["SG","HN","ĐN","HP"]` | Thành phố |
| `tag` | String | optional | Tag hiển thị |
| `address` | String | optional | Địa chỉ chi tiết |
| `time` | String | optional | Giờ hoạt động |
| `phone` | String | optional | Số điện thoại |
| `rating` | Number | default 5.0, min 0, max 5 | Điểm đánh giá |
| `reviews` | Number | default 0 | Số lượt đánh giá |
| `mapSrc` | String | optional | Embed src Google Maps |
| `mapsUrl` | String | optional | Link Google Maps |
| `imgUrl` | String | optional | URL ảnh cửa hàng |
| `imgId` | String | optional | ID ảnh local |
| `order` | Number | default 0 | Thứ tự hiển thị |
| `isActive` | Boolean | default true | Hiển thị / ẩn |

---

### 3.13. `teammembers`

**File:** `backend/models/TeamMember.js` | **Timestamps:** có

| Field | Type | Ràng buộc | Ghi chú |
|---|---|---|---|
| `name` | String | required, maxlength 100 | Tên thành viên |
| `role` | String | optional | Vai trò / chức vụ |
| `photoUrl` | String | optional | URL ảnh chân dung |
| `photoId` | String | optional | ID ảnh local |
| `order` | Number | default 0 | Thứ tự hiển thị |
| `isActive` | Boolean | default true | Hiển thị / ẩn |

---

### 3.14. `siteconfigs`

**File:** `backend/models/SiteConfig.js` | **Timestamps:** có

| Field | Type | Ghi chú |
|---|---|---|
| `hotline` | String | Số hotline hiển thị toàn site |
| `email` | String | Email liên hệ |
| `zalo` | String | Số Zalo |
| `press` | String | Email báo chí / PR |

> Document singleton — chỉ có 1 record, dùng `upsert`.

---

## 4. Quan hệ giữa các collection

```
users (1) ────────────────────── (N) sessions
users (1) ────────────────────── (1) carts
users (1) ────────────────────── (N) orders
users (N) ─── wishlist[] ──────── (N) products
users (N) ─── addresses[] ────── (embedded subdoc)
users (1) ────────────────────── (N) reviews

products (N) ──── category ───── (1) categories
products (1) ────────────────── (N) reviews
products (N) ─── combos.products (N) combos

orders (1) ─── items[].productId (N) products  [snapshot]
orders (1) ─── userId ─────────── (1) users

carts (1) ──── items[].productId (N) products
carts (1) ──── userId ──────────── (1) users
```

---

## 5. Biến môi trường

### Backend (`.env`)

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `MONGODB_CONNECTIONSTRING` | URI kết nối MongoDB | `mongodb://localhost:27017/ecommerce` |
| `ACCESS_TOKEN_SECRET` | Khóa bí mật JWT | `my-super-secret-key` |
| `PORT` | Cổng server | `5000` |
| `NODE_ENV` | Môi trường | `development` / `production` |

### Frontend (`.env`)

| Biến | Mô tả | Ví dụ |
|---|---|---|
| `VITE_SERVER_URL` | URL backend (không có `/api`) | `http://localhost:5000` |
