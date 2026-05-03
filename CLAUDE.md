# Vibe Urban — Men's Fashion E-commerce (CLAUDE.md)

## Tổng Quan Dự Án

- **Tên dự án:** Vibe Urban — Men's Fashion E-commerce Website
- **Mục tiêu:** Hệ thống web thương mại điện tử bán quần áo, phụ kiện thời trang Nam giới. Đầy đủ chức năng cho cả Customer và Admin theo đồ án `docs/topic/TOPIC GR1.md`.
- **Tiêu chí chấm điểm:** Tính năng (40%), Giao diện & UX (15%), Code sạch/chuẩn (15%), Bảo mật (10%).
- **Môi trường triển khai:** Local only — không cần cloud, Docker, Redis hay CDN.

## Nguyên Tắc Dành Cho AI

1. **Ngôn ngữ:** Luôn giao tiếp, giải đáp và comment code bằng **Tiếng Việt**.
2. **Thiết kế Tailwind:** Bám sát bảng màu hệ thống (warm gray + blue accent). Không tự ý thêm màu ngoài hệ thống. Xem chi tiết trong `.claude/rules/ui-design.md`.
3. **Bám sát scope đồ án:** Trước khi implement tính năng mới, đối chiếu với `docs/topic/TOPIC GR1.md`.
4. **Nhất quán pattern hiện có:** Dùng service layer cho API calls, Zustand cho state, Zod + RHF cho form validation. Không đổi pattern chỉ vì có cách khác.
5. **Bảo mật:** Mọi async function backend phải có try/catch. Không để lộ stack trace ra response. Validate đầu vào trước khi query DB.
6. **Controllers phải mỏng:** Controller chỉ làm 3 việc — validate input, gọi service, trả response. Business logic đặt trong `services/`.

## Rules Chi Tiết

Các quy tắc chi tiết nằm trong `.claude/rules/`:

| File | Nội dung | Load khi |
|---|---|---|
| `tech-stack.md` | Danh sách thư viện + phiên bản | Luôn luôn |
| `ui-design.md` | Màu sắc, typography, spacing, animation | Chỉnh sửa frontend UI |
| `coding-frontend.md` | Cấu trúc component, state, form, service layer | Thêm/sửa frontend |
| `coding-backend.md` | Routes/Controllers/Services/Models, response format | Thêm/sửa backend |
| `project-status.md` | Trạng thái từng module, việc còn thiếu, lộ trình | Lên kế hoạch tính năng |
| `architecture.md` | Cấu trúc thư mục, quyết định kiến trúc, lưu ý kỹ thuật | Điều hướng codebase |

## Cập Nhật Phiên Này (2026-05-03)

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| `.claude/rules/` (6 files) | Tách CLAUDE.md thành rules riêng theo chủ đề để load có chọn lọc |
| `.claude/agents/` (3 files) | `researcher`, `reviewer`, `qa-tester` — dùng bằng `/agent-name` |
| `backend/utils/slugUtils.js` | Fix duplicate: `generateSlug` + `ensureUniqueSlug` dùng chung cho mọi model |
| `backend/services/authService.js` | Tách token generation + session management ra khỏi controller |
| `backend/services/productService.js` | Tách `findByIdentifier`, `buildProductFilter`, `generateProductSlug` |
| `backend/services/cartService.js` | Tách `getOrCreateCart`, `resolveProduct` |
| Refactor 4 controllers | `authController`, `productController`, `categoryController`, `cartController` — đã dùng services |

### Quyết định quan trọng & lý do

| Quyết định | Lý do |
|---|---|
| **Thêm services layer** | Chuẩn bị cho Order system — logic tạo đơn quá phức tạp để nhét vào controller (validate stock + coupon + tính tổng + tạo document + clear cart). Controller giờ chỉ còn ~10 dòng/function. |
| **`ensureUniqueSlug` nhận Model làm tham số** | Tái sử dụng được cho cả Product lẫn Category (và bất kỳ model nào sau này) thay vì hard-code từng model. |
| **`generateSlug` tách sang `utils/`** | Hàm này bị duplicate ở cả `productController` và `categoryController`. Đưa vào `utils/slugUtils.js` để có single source of truth. |
| **`authService` tập trung cookie options** | `getCookieOptions()` đảm bảo signIn và signOut dùng cùng config cookie — tránh bug khi signOut không xóa được cookie vì sai domain/sameSite. |
| **Local-only setup** | Không cần Redis, Docker, Cloudinary, Nginx. Multer local + MongoDB local là đủ cho demo đồ án. |

## Ưu Tiên Phiên Tiếp Theo

**Mục tiêu:** Hoàn thiện Order system — đây là nhóm tính năng quan trọng nhất còn thiếu (FR-33–38, FR-51–53).

### 1. Backend — Order system (làm trước)
- [ ] Tạo `backend/models/Order.js` (schema theo SRS §6.5)
- [ ] Tạo `backend/services/orderService.js`:
  - `createOrder(userId, cartItems, shippingInfo, paymentMethod)` — validate stock, apply coupon, tính tổng, tạo Order document, clear cart
  - `getUserOrders(userId)` — lịch sử đơn
  - `updateOrderStatus(orderId, status)` — admin cập nhật trạng thái
  - `cancelOrder(orderId, userId)` — khách hủy khi status còn "pending"
- [ ] Tạo `backend/controllers/orderController.js` (thin — chỉ gọi orderService)
- [ ] Tạo `backend/routes/orderRoute.js` + mount vào `server.js`

### 2. Frontend — Checkout & Profile (làm sau khi có Order API)
- [ ] Nối Checkout form submit → `POST /api/orders` → redirect trang xác nhận
- [ ] Profile: lịch sử đơn hàng (GET /api/users/me/orders hoặc GET /api/orders)
- [ ] Profile: đổi mật khẩu (PUT /api/users/me)

### 3. Admin mở rộng
- [ ] Admin ProductForm — implement toàn bộ (fields + variant editor + image upload)
- [ ] Admin Categories — table + form CRUD
- [ ] Admin Orders — list + cập nhật trạng thái

### 4. Sau đó (ưu tiên thấp hơn)
- [ ] Coupon model + validate logic trong `cartService.applyCoupon`
- [ ] Wishlist (Store + API + UI)
- [ ] `/auth/refresh` endpoint để rotate refresh token
