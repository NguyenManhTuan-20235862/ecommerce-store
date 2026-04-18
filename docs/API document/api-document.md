# API Document - Men Fashion E-commerce

## 1) Mục tiêu tài liệu

Tài liệu này phản ánh **đúng trạng thái API hiện tại trong code** và tách biệt rõ:

- `Implemented`: endpoint đã có route/controller ở backend.
- `Client-ready`: frontend đã chuẩn bị gọi API nhưng backend chưa có route.
- `Planned`: endpoint theo SRS/TOPIC, chưa triển khai trong code.

Nguồn đối chiếu chính:

- Backend: `server.js`, `routes/*`, `controllers/*`, `models/*`.
- Frontend: `src/services/*`, `src/store/authStore.js`.
- Tài liệu nghiệp vụ: `docs/topic/SRS.md`, `docs/topic/TOPIC GR1.md`.

## 2) Thông tin chung

- Base URL (local mặc định): `http://localhost:5000/api`
- Content-Type: `application/json`
- CORS hiện tại: chỉ cho `http://localhost:5173`, `credentials: true`
- Auth strategy hiện tại:
  - Access Token (JWT) trả về trong body khi `signin`
  - Refresh Token random lưu DB (`sessions`) và set vào HttpOnly cookie

## 3) API đã triển khai (Implemented)

### 3.1. Danh sách nhanh

| Method | Endpoint            | Auth              | Trạng thái  |
| ------ | ------------------- | ----------------- | ----------- |
| POST   | `/api/auth/signup`  | No                | Implemented |
| POST   | `/api/auth/signin`  | No                | Implemented |
| POST   | `/api/auth/signout` | Optional (cookie) | Implemented |
| GET    | `/api/users/me`     | Bearer token      | Implemented |

Ghi chú:

- `signout` nằm trong public route nhưng vẫn hoạt động với/không có cookie refresh token.
- Mọi route `/api/users/*` đang được bảo vệ toàn cục bằng `protectedRoute` trong `server.js`.

### 3.2. Chi tiết endpoint

#### POST `/api/auth/signup`

Đăng ký tài khoản mới.

Request body:

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "123456",
  "firstName": "John",
  "lastName": "Doe"
}
```

Validation hiện tại (backend): bắt buộc đủ 5 field trên.

Response:

- `204 No Content`: đăng ký thành công.
- `400 Bad Request`: thiếu field.
- `409 Conflict`: `username` hoặc `email` đã tồn tại.
- `500 Internal Server Error`: lỗi hệ thống.

Ghi chú implement:

- Backend lưu `displayName = firstName + " " + lastName`.
- Password hash bằng `bcrypt` salt rounds = `10`.

#### POST `/api/auth/signin`

Đăng nhập bằng username + password.

Request body:

```json
{
  "username": "johndoe",
  "password": "123456"
}
```

Response `200 OK`:

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

Cookie set:

- `refreshToken` (HttpOnly)
- `secure: true`
- `sameSite: "none"`
- `maxAge`: 14 ngày

Mã lỗi:

- `400`: thiếu username/password
- `401`: thông tin đăng nhập sai
- `500`: lỗi hệ thống

#### POST `/api/auth/signout`

Đăng xuất, xóa refresh token trong DB và xóa cookie.

Response:

- `204 No Content`: thành công.
- `500`: lỗi hệ thống.

#### GET `/api/users/me`

Lấy thông tin người dùng hiện tại từ access token.

Headers bắt buộc:

```http
Authorization: Bearer <accessToken>
```

Response `200 OK`:

```json
{
  "user": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "displayName": "John Doe",
    "role": "customer",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Mã lỗi (middleware):

- `401`: thiếu access token
- `403`: token sai/hết hạn
- `404`: user không tồn tại
- `500`: lỗi hệ thống

## 4) API frontend đã chuẩn bị gọi (Client-ready, backend chưa có)

Các API sau đã có service ở frontend (`product.service.js`) nhưng backend hiện chưa có route:

| Method | Endpoint                      | Nguồn gọi                      | Trạng thái   |
| ------ | ----------------------------- | ------------------------------ | ------------ |
| GET    | `/api/products`               | `productService.list()`        | Client-ready |
| GET    | `/api/products/:slug`         | `productService.detail(slug)`  | Client-ready |
| GET    | `/api/products/:slug/related` | `productService.related(slug)` | Client-ready |

## 5) API planned theo SRS/TOPIC (chưa triển khai code)

Theo `docs/topic/SRS.md`, hệ thống mục tiêu còn các nhóm API:

- Auth mở rộng: forgot/reset password
- User profile mở rộng: update profile, addresses, orders history
- Product browsing đầy đủ: filter/sort/search/category
- Cart
- Order
- Admin: products, categories, coupons, orders, stats, customers

## 6) Chênh lệch tên endpoint giữa SRS và code hiện tại

SRS đang mô tả naming kiểu:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

Code hiện tại đang dùng:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/signout`

Khuyến nghị để đồng bộ tài liệu toàn dự án:

- Giữ phần "Implemented" theo code hiện tại làm source of truth cho dev.
- Nếu muốn bám naming SRS, cần thêm alias route hoặc refactor frontend + backend đồng bộ.

## 7) Môi trường và biến cấu hình liên quan API

### Backend

- `MONGODB_CONNECTIONSTRING`
- `ACCESS_TOKEN_SECRET`
- `PORT` (default `5000`)

### Frontend

- `VITE_API_URL` hoặc `VITE_SERVER_URL`
- fallback mặc định: `http://localhost:5000/api`

## 8) Gợi ý chuẩn hóa tiếp theo

- Bổ sung Swagger/OpenAPI khi mở rộng module Product/Cart/Order.
- Bổ sung endpoint refresh access token (hiện chưa có).
- Chuẩn hóa error response format cho toàn bộ API (code, message, details).
