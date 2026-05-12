# Vibe Urban — Men's Fashion E-commerce (CLAUDE.md)

## Tổng Quan Dự Án

- **Tên dự án:** Vibe Urban — Men's Fashion E-commerce Website
- **Mục tiêu:** Hệ thống web thương mại điện tử bán quần áo, phụ kiện thời trang Nam giới. Đầy đủ chức năng cho cả Customer và Admin theo đồ án `docs/topic/TOPIC GR1.md`.
- **Tiêu chí chấm điểm:** Tính năng (40%), Giao diện & UX (15%), Code sạch/chuẩn (15%), Bảo mật (10%).
- **Môi trường triển khai:** Local only — không cần cloud, Docker, Redis hay CDN.

## Nguyên Tắc Dành Cho AI

1. **Ngôn ngữ:** Luôn giao tiếp, giải đáp và comment code bằng **Tiếng Việt**.
2. **Thiết kế Tailwind:** Bám sát bảng màu hệ thống (warm gray + blue accent). Xem `.claude/rules/ui-design.md`.
3. **Bám sát scope đồ án:** Đối chiếu `docs/topic/TOPIC GR1.md` trước khi implement tính năng mới.
4. **Nhất quán pattern:** Service layer cho API calls, Zustand cho state, Zod + RHF cho form validation.
5. **Bảo mật:** Mọi async function backend phải có try/catch. Không để lộ stack trace. Validate input trước DB.
6. **Controllers phải mỏng:** Chỉ validate input → gọi service → trả response. Business logic trong `services/`.

## Rules Chi Tiết

| File | Nội dung | Load khi |
|---|---|---|
| `tech-stack.md` | Danh sách thư viện + phiên bản | Luôn luôn |
| `ui-design.md` | Màu sắc, typography, spacing, animation | Chỉnh sửa frontend UI |
| `coding-frontend.md` | Cấu trúc component, state, form, service layer | Thêm/sửa frontend |
| `coding-backend.md` | Routes/Controllers/Services/Models, response format | Thêm/sửa backend |
| `project-status.md` | Trạng thái từng module, việc còn thiếu, lộ trình | Lên kế hoạch tính năng |
| `architecture.md` | Cấu trúc thư mục, quyết định kiến trúc | Điều hướng codebase |

## Cập Nhật Phiên Này (2026-05-10) — Session 8

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Load More giới hạn 50** ✅ | `getProducts`: nâng cap `Math.min(50,…)` → `Math.min(200,…)`. Admin `getAdminProducts` giữ nguyên 50. |
| **Validate tồn kho khi add to cart** ✅ | `cartService.js`: thêm `findMatchingVariant`. `addToCart`: check variant + `currentQty + quantity ≤ stock`. `updateItemQuantity`: check `quantity ≤ stock`. |
| **Xác nhận Shop sizes + outOfStock Dashboard** | Đã implement từ trước — `shopData.js` có `shoeSizeFilters`/`pantsSizeFilters`, `FilterSidebar` có `getSizeList(activeCategory)`, `getDashboardStats` tính `outOfStockCount` từ DB thực. |

### Quyết định quan trọng (session 8)

| Quyết định | Lý do |
|---|---|
| **Cap 200 cho public `getProducts`** | Frontend Shop gửi `limit: visibleCount` tăng dần — cap 50 làm stuck khi tổng > 50 sản phẩm. |
| **`findMatchingVariant` trong `cartService.js`** | Business logic về variant matching thuộc service layer. Controller chỉ gọi và xử lý response. |
| **Stock check cộng `currentQty` hiện có** | User đã có 3 trong giỏ, stock = 3 → thêm 1 nữa phải bị block. |
| **`updateItemQuantity` cũng check stock** | User có thể tăng qty trực tiếp trong giỏ — cần validate ở cả endpoint này. |

## Cập Nhật Phiên Trước (2026-05-07) — Session 7

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Bug fix: Coupon hết hạn** ✅ | `Cart/index.jsx` catch: thêm `setCouponCode("")` khi Apply thất bại. |
| **Address Management** ✅ | Backend: `addressSchema` subdoc trong User (province/district/ward/detail/isDefault, max 10), 5 routes `/me/addresses`. Frontend: `cityOptions.js`, `Profile/Addresses/index.jsx`, `AddressSelectorModal.jsx`, tích hợp Checkout pre-fill + auto-save. |

### Quyết định quan trọng (session 7)

| Quyết định | Lý do |
|---|---|
| **Address không có receiverName/Phone** | Tên/SĐT đã có trong profile — address chỉ lưu địa điểm. |
| **Auto-save address khi checkout lần đầu** | Guard `savedAddresses.length === 0` tránh ghi đè khi đã có. `.catch(()=>{})` để không block redirect. |
| **`cityOptions.js` file riêng** | Dùng chung giữa Checkout và Profile/Addresses — tránh duplicate. |

## Cập Nhật Phiên Trước (2026-05-07) — Session 6

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Reviews** ✅ | Backend: `Review.js` (unique index {userId,productId}), `reviewService.js` (bulk-verify delivered orders), controller + route (`mergeParams: true`). Frontend: `ReviewModal.jsx` (star selector), `VibeCheckReviews.jsx` (grid text cards), `mapReviewToDisplay`. |
| **Profile - Avatar upload** ✅ | Backend: `uploadAvatar` (fs.unlink ảnh cũ, lưu avatarUrl+avatarId). Frontend: camera overlay, letter fallback, spinner upload. |

### Quyết định quan trọng (session 6)

| Quyết định | Lý do |
|---|---|
| **`isVerified` tính runtime** | Lưu DB → stale nếu order bị cancel sau khi đã review. Bulk query O(1) round-trip. |
| **Review sub-router dưới `productRoute.js`** | `mergeParams: true` nhận `productId` từ cha. Không cần sửa `server.js`. |
| **`/:slug` không shadow `/:productId/reviews`** | Express `end: true` — chỉ match 1 segment. `/productId/reviews` là 2 segments. |
| **Hidden `<input {...register("rating")} />`** | RHF yêu cầu field được `register` trước khi `setValue` có hiệu lực — pattern chuẩn cho custom star selector. |

## Ưu Tiên Phiên Tiếp Theo

1. **UI hết hàng trên Product page** — Disable nút + badge "Hết hàng" khi variant stock = 0, không chờ API
2. **Search trên Shop page** — Thanh tìm kiếm full-text (backend đã có `$text` index)
3. **Cursor-based pagination** — Thay Load More nếu catalog mở rộng

## Quy tắc session

- **Context dài**: Hỏi user có muốn `/compact` không khi conversation có nhiều tool calls.
- **Trước khi kết thúc**: Khi user nói "done", "tạm dừng", "xong" — chạy `/update-claude-md`.
