# Database Document - Men Fashion E-commerce

## 1) Mục tiêu tài liệu

Tài liệu này mô tả:

- Schema MongoDB **đang triển khai thực tế trong code backend**.
- Schema **planned** theo `docs/topic/SRS.md` để phục vụ roadmap hoàn thiện đồ án.

Nguyên tắc đồng bộ:

- `Code hiện tại` là nguồn sự thật cho trạng thái chạy thật.
- `SRS` là nguồn định hướng các collection/chức năng chưa làm.

## 2) Công nghệ và kết nối

- Database: MongoDB (qua Mongoose)
- File kết nối: `backend/libs/db.js`
- Biến môi trường bắt buộc: `MONGODB_CONNECTIONSTRING`

## 3) Collection đã triển khai (Implemented)

Hiện backend đang dùng 2 collection chính: `users`, `sessions`.

### 3.1. `users`

Nguồn schema: `backend/models/User.js`

| Field            | Type   | Constraint / Default                         | Ghi chú                           |
| ---------------- | ------ | -------------------------------------------- | --------------------------------- |
| `username`       | String | required, unique, trim, lowercase            | Tên đăng nhập duy nhất            |
| `hashedPassword` | String | required                                     | Password đã hash bcrypt           |
| `email`          | String | required, unique, trim, lowercase            | Email duy nhất                    |
| `displayName`    | String | required, trim                               | Hiển thị tên người dùng           |
| `avatarUrl`      | String | optional                                     | Link ảnh đại diện                 |
| `avatarId`       | String | optional                                     | ID ảnh trên Cloudinary (nếu dùng) |
| `bio`            | String | optional, maxlength 500                      | Giới thiệu ngắn                   |
| `phone`          | String | optional, sparse                             | Số điện thoại                     |
| `role`           | String | enum(`customer`,`admin`), default `customer` | Phân quyền                        |
| `createdAt`      | Date   | auto (`timestamps`)                          | Ngày tạo                          |
| `updatedAt`      | Date   | auto (`timestamps`)                          | Ngày cập nhật                     |

Ví dụ document:

```json
{
  "_id": "661f...",
  "username": "johndoe",
  "hashedPassword": "$2b$10$...",
  "email": "john@example.com",
  "displayName": "John Doe",
  "role": "customer",
  "createdAt": "2026-04-16T03:00:00.000Z",
  "updatedAt": "2026-04-16T03:00:00.000Z"
}
```

### 3.2. `sessions`

Nguồn schema: `backend/models/Session.js`

| Field          | Type     | Constraint / Default        | Ghi chú              |
| -------------- | -------- | --------------------------- | -------------------- |
| `userId`       | ObjectId | required, ref `User`, index | Liên kết user        |
| `refreshToken` | String   | required, unique            | Refresh token random |
| `expiresAt`    | Date     | required                    | Mốc hết hạn session  |
| `createdAt`    | Date     | auto (`timestamps`)         | Ngày tạo             |
| `updatedAt`    | Date     | auto (`timestamps`)         | Ngày cập nhật        |

Indexes quan trọng:

- `userId` index để truy vấn session theo user.
- TTL index: `{ expiresAt: 1 }` với `expireAfterSeconds: 0` để tự xóa session hết hạn.

Ví dụ document:

```json
{
  "_id": "661f...",
  "userId": "661f...",
  "refreshToken": "a7e2...",
  "expiresAt": "2026-04-30T03:00:00.000Z",
  "createdAt": "2026-04-16T03:00:00.000Z",
  "updatedAt": "2026-04-16T03:00:00.000Z"
}
```

### 3.3. Quan hệ hiện tại

- `users (1) -> (N) sessions`

Mục đích:

- Mỗi lần đăng nhập tạo một session chứa refresh token.
- Đăng xuất sẽ xóa session theo `refreshToken`.

## 4) Collection planned theo SRS (chưa triển khai code)

Theo `docs/topic/SRS.md`, hệ thống mục tiêu cần thêm các collection:

- `addresses`
- `categories`
- `products`
- `orders`
- `coupons`
- `reviews`
- `wishlists`

Trạng thái hiện tại:

- Chưa có model tương ứng trong `backend/models/`.
- Chưa có route/controller CRUD liên quan.
- Frontend mới có khung UI cho nhiều module (Shop, Product, Cart, Checkout, Admin), chưa nối backend thật.

## 5) Chênh lệch giữa schema hiện tại và SRS

### 5.1. User

SRS có các field định hướng như `isActive`; model hiện tại chưa có.

Hiện tại đang dùng:

- `displayName` (1 field)

Trong khi luồng frontend register tách:

- `firstName`, `lastName` (chỉ dùng ở request, sau đó backend gộp vào `displayName`)

### 5.2. Session/Auth

SRS mô tả token lifecycle tổng quát; code hiện tại đã có:

- access token JWT (`30m`)
- refresh token lưu collection `sessions`
- TTL auto cleanup session hết hạn

Điểm còn thiếu cho flow đầy đủ:

- Endpoint refresh access token
- Cơ chế revoke toàn bộ session theo user (nếu cần)

## 6) Đề xuất chuẩn hóa dữ liệu giai đoạn kế tiếp

- Bổ sung `isActive` cho `users` để hỗ trợ khóa/mở tài khoản từ admin.
- Khi thêm `products`, ưu tiên index:
  - `slug` unique
  - `sku` unique
  - index phục vụ lọc/sort (`categoryId`, `price`, `createdAt`, `isActive`).
- Với `orders`, snapshot thông tin sản phẩm vào `items` để tránh lệch lịch sử khi product thay đổi.
- Áp dụng validation mức DB (JSON Schema hoặc Mongoose validation chặt hơn) cho các collection trọng yếu.

## 7) Trạng thái đồng bộ hiện tại

- Đồng bộ với code backend hiện có: **Có**
- Đồng bộ với frontend API usage hiện tại (auth): **Có**
- Đồng bộ với lộ trình SRS/TOPIC (phần planned): **Có**
