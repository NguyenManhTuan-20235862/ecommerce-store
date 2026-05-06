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

## Cập Nhật Phiên Này (2026-05-06) — Session 3

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Coupon System** ✅ | Backend: Model (code/discountType/value/minOrder/maxUses/usedCount/expiresAt), Service (validateAndApplyCoupon + CRUD), Controller (5 endpoints), Route. Frontend: coupon.service.js, Admin CRUD page, Cart Apply button + discount line |
| **Profile - Thông tin tài khoản** ✅ | `PUT /api/users/me` backend, `ProfileInfo.jsx` với avatar chữ cái + view/edit mode, `profileInfoSchema` Zod, sync `authStore` sau save, redirect mặc định `/profile` → `/profile/info` |
| **Bug fixes (10 lỗi)** | Order status state machine, race condition stock decrement, Shop category filter, Shop default size M, ReDoS regex, Cart +/- REMOVE, Cart USD→VND, Cart tax sai, Cart total overflow, Checkout pre-fill |
| `authStore.js` | Thêm `setUser()` action để update user trong store mà không cần refetch |
| `backend/controllers/authController.js` | Thêm `email` vào signIn response (cần cho Checkout pre-fill) |

### Quyết định quan trọng & lý do (session 3)

| Quyết định | Lý do |
|---|---|
| **`VALID_TRANSITIONS` state machine cho order status** | Single source of truth — terminal states (`delivered`, `cancelled`) map tới `[]`, mọi transition throw ngay thay vì kiểm tra rải rác. |
| **Atomic stock decrement + rollback loop** | MongoDB không có transactions ở setup local. `findOneAndUpdate` + `$elemMatch: { stock: { $gte } }` đảm bảo atomicity từng item. Rollback: vòng lặp `$inc +quantity` cho các item đã trừ trước khi lỗi xảy ra. |
| **`cartItemId` tách khỏi `productId` trong `mapStoreItem`** | Sau `populate`, `item.productId` là object, không dùng làm ID được. Cart subdoc có `_id` riêng (cartItemId) dùng cho API, còn `productId._id` dùng cho reference. |
| **`updateProfile` kiểm tra email uniqueness** | `User.findOne({ email, _id: { $ne: userId } })` — chặn user khác chiếm email, cho phép user giữ email của mình khi edit các field khác. |
| **`setUser` merge thay vì replace** | `set((state) => ({ user: { ...state.user, ...userData } }))` — chỉ cập nhật fields được trả về, giữ nguyên `role`, `username`, `_id` không thay đổi. |
| **Checkout pre-fill email qua signIn response** | `authStore.user.email` chỉ có sau hydration từ `/users/me`. Thêm email vào signIn response đảm bảo field có ngay sau login, trước cả khi hydration xong. |

## Cập Nhật Phiên Trước (2026-05-06) — Session 2

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Admin Categories** ✅ | Table (tên/slug/mô tả/trạng thái), modal create/edit với Zod + RHF, toggle isActive (chỉ khi edit), delete với confirm dialog |
| **Admin Orders** ✅ | Filter tabs theo status + badge đếm, table với inline status select, optimistic update, detail drawer (khách hàng/địa chỉ/items/tóm tắt/status update), lock khi delivered/cancelled |
| **Admin Customers** ✅ | Search debounce 400ms, table (avatar/tên/username/email/SĐT/vai trò/ngày tham gia), click row → detail drawer |
| `backend/controllers/userController.js` | Thêm `getAllUsers` — tìm kiếm theo displayName/email/username, select bỏ hashedPassword |
| `backend/routes/userRoute.js` | Thêm `GET /` (adminRoute) — lấy danh sách users cho admin |
| `frontend/src/services/order.service.js` | Thêm `getAllOrders()`, `updateOrderStatus(orderId, status)` |
| `frontend/src/services/user.service.js` | Thêm `getAllUsers(params)` |
| `frontend/src/App.jsx` | Mount 3 trang admin thật thay cho placeholder div |

### Quyết định quan trọng & lý do (session 2)

| Quyết định | Lý do |
|---|---|
| **Status select inline trên table row** | Cập nhật trạng thái ngay tại chỗ, không cần mở modal riêng. UX nhanh hơn cho admin xử lý nhiều đơn. |
| **Optimistic update sau status change** | Sau khi API thành công, update `setOrders(prev => ...)` thay vì refetch. Tránh flicker + tiết kiệm request. Drawer cũng sync cùng lúc nếu đang mở. |
| **Lock select khi delivered/cancelled** | Hai trạng thái này là "trạng thái cuối" — không thể quay lại. Disable select để tránh thao tác nhầm. |
| **Detail drawer thay vì navigate sang page riêng** | Giữ context list page, không mất vị trí filter/tab đang chọn. Backdrop click để đóng nhanh. |
| **`getAllUsers` đặt thẳng trong controller** | Query đơn giản (find + select + regex search), không cần tách ra userService. Giữ service cho business logic phức tạp. |
| **Debounce 400ms cho search (Customers)** | Tránh gọi API liên tục khi user gõ. Pattern giống AdminProductsPage đã có. |

## Cập Nhật Phiên Trước (2026-05-06) — Session 1

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Admin ProductForm** ✅ | Implement đầy đủ: form 2 cột, upload ảnh (tối đa 5, preview grid, xóa từng ảnh), variant editor động (useFieldArray), dropdown danh mục, toggles nổi bật/đang bán, submit create/edit, loading/error states |
| `backend/services/productService.js` | Thêm `findById(id)` — lấy sản phẩm theo `_id`, bao gồm cả inactive (dùng cho admin) |
| `backend/controllers/productController.js` | Thêm `getProductById` controller |
| `backend/routes/productRoute.js` | Thêm `GET /admin/:id` (đặt sau `/admin/all` để tránh conflict) |
| `frontend/src/services/product.service.js` | Thêm `getById(id)` — gọi `GET /products/admin/:id` |
| `frontend/src/pages/Admin/Products/schemas.js` | **Mới** — Zod schema cho ProductForm |
| `frontend/src/pages/Admin/Products/ProductForm.jsx` | Refactor từ skeleton thành form đầy đủ |

### Quyết định quan trọng & lý do (session 1)

| Quyết định | Lý do |
|---|---|
| **GET /admin/:id thêm vào sau /admin/all** | Express match theo thứ tự — literal `/admin/all` phải đứng trước wildcard `/admin/:id` để không bị override. |
| **Upload ảnh trước, submit form sau** | Images không đi qua RHF — lưu trong `useState` riêng. Khi submit, merge `{ ...data, images }`. Tránh complexity của file input trong Zod schema. |
| **`useFieldArray` cho variants** | RHF built-in, hỗ trợ add/remove/re-order mà không cần viết state thủ công. |
| **`findById` không filter `isActive`** | Admin cần xem được sản phẩm đang ẩn để edit/kích hoạt lại. Public `findByIdentifier` vẫn có `isActive: true`. |

## Ưu Tiên Phiên Tiếp Theo

1. **Admin Dashboard statistics** ⭐ — Aggregate query: doanh thu theo tháng, top sản phẩm bán chạy, đơn hàng theo trạng thái
2. **Wishlist** — Store + API + UI
3. **Reviews** — Model + API + UI (submit từ Product Detail)
4. **Profile - Avatar upload** — Multer upload ảnh avatar, lưu local
5. **Refresh token rotation** — endpoint `/auth/refresh`

## Quy tắc session

- **Context dài**: Khi conversation có nhiều tool calls / nội dung dài, hỏi: "Context đang dài, bạn có muốn /compact không? Sẽ ưu tiên giữ: auth architecture, database schema, danh sách file đã tạo."
- **Trước khi kết thúc**: Khi user nói "done", "tạm dừng", "xong" — chạy `/update-claude-md`.
