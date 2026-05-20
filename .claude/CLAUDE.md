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

## Cập Nhật Phiên Này (2026-05-20) — Session 12

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Response format chuẩn hóa** ✅ | `couponController`, `saleConfigController`, `comboController`: đổi tất cả response sang `{ message, data }` thay vì key riêng (`coupons`, `tiers`, `combos`). Nhất quán với `coding-backend.md`. |
| **handleError cho couponController** ✅ | Thêm `handleError()` dùng chung xử lý `CastError` (→ 400 "ID không hợp lệ") và `ValidationError`. Áp dụng cho tất cả handlers trong `couponController.js`. |
| **FE cập nhật đọc `res.data.data`** ✅ | Fix 5 file: `CouponsSection.jsx`, `TierSection.jsx`, `ComboSection.jsx`, `AdminCoupons/index.jsx`, `Admin/Sale/index.jsx` — tất cả đọc `res.data.data` thay vì key cũ. |
| **Responsive mobile fix** ✅ | `About/HeroSection`: stats `grid-cols-4` → `grid-cols-2 sm:grid-cols-4` (tránh tràn label "thành viên" trên 375px). `Sale/PerksSection`: thêm `min-w-0` vào text div ngăn overflow. |

### Quyết định quan trọng (session 12)

| Quyết định | Lý do |
|---|---|
| **`{ message, data }` cho coupon/tier/combo** | Nhất quán với chuẩn `coding-backend.md`. Session 11 dùng key riêng là sai — đã sửa. Lưu ý: `validateCoupon` giữ nguyên vì FE đọc `res.data.discountAmount` trực tiếp. |
| **`handleError` copy sang couponController** | Không tạo file utils chung — pattern đơn giản đủ để copy trong mỗi controller, tránh coupling không cần thiết. |
| **Không thay đổi WorkshopSection grid** | Grid `grid-cols-6` trong About/WorkshopSection là decorative placeholder — không sửa mobile vì không ảnh hưởng chức năng và sẽ thay bằng ảnh thật sau. |

## Cập Nhật Phiên Trước (2026-05-20) — Session 11

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Lookbook bug fix** ✅ | `Lookbook/index.jsx`: sửa mapping theo `storyMap[order]` thay vì `stories[index]` — stories với `order=1` giờ đúng slot 1 (NIGHT RIDE), không còn nhảy slot 0 (hero). |
| **WORKSHOP aspect ratio** ✅ | Slot 4 (WORKSHOP) sửa từ `aspect-[3/4]` → `aspect-[8/4]`. Thêm `"8:4"` vào enum `Lookbook.js`, `VALID_ASPECTS` trong `lookbookController.js`, và `ASPECT_OPTIONS`/`ASPECT_CLASS` trong `AdminLookbook`. |
| **Sale CMS — Backend** ✅ | Model + service + controller + route cho: `SaleConfig` (singleton tiers, upsert), `Combo` (products[] ref Product, populate). `Coupon` model thêm `isPublic`. `couponService.getPublicCoupons()`. Routes mount trong `server.js` (public trước protected). |
| **Sale CMS — Admin Frontend** ✅ | `AdminSalePage` 3 tabs: "Mã giảm giá" (link sang `/admin/coupons`), "Bậc thang" (CRUD tiers inline), "Combo" (grid + modal + product picker). `AdminCoupons` thêm cột + toggle `isPublic`. Sidebar + route wired. |
| **Sale CMS — Customer Frontend** ✅ | `CouponsSection` fetch `GET /api/coupons/public`, 4 theme màu xoay vòng, copy-to-clipboard. `TierSection` fetch `GET /api/sale-config`, fallback 4 tier hardcode. `ComboSection` fetch `GET /api/combos`, ảnh thật từ DB, tính savings động. Services: `couponService.getPublic()`, `saleConfig.service.js`, `combo.service.js`. |
| **QA + Bug fix** ✅ | Sub-agent QA phát hiện 2 FAIL + key mismatch: (1) `couponController.createCoupon` thiếu `isPublic` → đã thêm; (2) `comboService.createCombo` không populate → đã sửa; (3) FE đọc sai key → đã fix. |

### Quyết định quan trọng (session 11)

| Quyết định | Lý do |
|---|---|
| **`storyMap` keyed by `order`** | Array index và `order` value là hai thứ khác nhau — phải map theo giá trị `order`, không phải vị trí trong array. |
| **SaleConfig singleton (upsert pattern)** | Chỉ cần 1 document config duy nhất cho tiers. `findOneAndUpdate({}, data, { upsert: true })` đơn giản hơn versioning. |
| **Combo populate ở service layer** | `createCombo` async + `.populate()` sau `Combo.create()` — FE nhận ngay product data đầy đủ mà không cần refetch. |
| **`isPublic: isPublic === true` (strict check)** | Tránh truthy coercion — chỉ `true` mới set public, mọi giá trị khác (undefined/null/"true") đều lưu `false`. |
| **ComboSection ẩn khi DB rỗng** | `if (combos.length === 0) return null` — section không render nếu admin chưa tạo combo, tránh layout trống. Cần tạo combo từ Admin trước. |

## Cập Nhật Phiên Trước (2026-05-19) — Session 10

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Lookbook CMS** ✅ | Backend: `Lookbook` model + service + controller + route. Frontend: `AdminLookbook` page (grid + modal upload + delete confirm), `lookbook.service.js`. Route `/admin/lookbook` + sidebar item "Lookbook". Trang Lookbook fetch từ API, fallback placeholder. |

### Quyết định quan trọng (session 10)

| Quyết định | Lý do |
|---|---|
| **Map stories theo array index (0-6)** | Lookbook có layout bento cố định — index 0 = hero, 1 = NIGHT RIDE, …, 6 = RIDE OUT. Admin thay đổi ảnh/tiêu đề cho từng slot qua Order field. |
| **Vùng upload ảnh fixed `h-52`** | `aspectRatio` động trên modal rộng → cao 600px+, tràn viewport. Fixed height + `object-cover` là giải pháp đúng cho preview trong modal. |
| **Modal `max-h-[calc(100vh-2rem)]` + `overflow-y-auto`** | Đảm bảo modal không vượt chiều cao màn hình ở mọi zoom level. |
| **`handleError()` dùng chung** | Bắt `CastError` → 400, `ValidationError` → 400 (extract message đầu tiên từ `err.errors`). Không lộ stack trace. |
| **`runValidators: true` trong `findByIdAndUpdate`** | Mongoose mặc định KHÔNG chạy validators khi update — thiếu option này enum sai vẫn ghi vào DB. |
| **Validate enum + `title.trim()` ở controller** | Guard trước khi xuống DB: tránh Mongoose ValidationError ra 500. |

## Cập Nhật Phiên Trước (2026-05-19) — Session 9

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **4 trang mới hoàn thiện** ✅ | `About`, `Lookbook`, `NewDrops`, `Sale` — toàn bộ component đã có, routes wired trong `App.jsx`, Header nav links đầy đủ. |
| **OOS UI trên Product page** ✅ | `ProductDetails.jsx`: `isSizeAvailable`, `isColorAvailable`, size buttons `line-through cursor-not-allowed`, color buttons `opacity-40` + diagonal line, button text "Hết hàng", badge near price. |
| **Search trên Shop page** ✅ | `Shop/index.jsx`: `searchQuery` state + debounce 400ms → `search` param gửi backend `$text` index. Search bar UI với nút clear (X). |
| **ProductsSection Sale → API thật** ✅ | Thay hardcode 8 sản phẩm fake bằng `productService.list({ sort: "price_asc", limit: 8 })`. Hiện ảnh thật, giá VNĐ thật, % giảm từ `compareAtPrice`, stock bar, skeleton loading, load more. |
| **`FeaturedProductTile` đã xóa** ✅ | Replaced bằng `ProductTile` + right sidebar collection grid trực tiếp trong `Shop/index.jsx`. |

### Quyết định quan trọng (session 9)

| Quyết định | Lý do |
|---|---|
| **Không tạo lại component đã có** | Tất cả 12 component (About × 7, Sale × 5) đã được implement — CLAUDE.md cũ không phản ánh đúng trạng thái. |
| **ProductsSection chỉ fetch `price_asc`** | Không có backend concept "Flash 48h" / "Clearance" — filter tabs giữ nguyên visual-only, chỉ "Tất cả" fetch real. |
| **Stock bar width = `Math.min(100, stock * 5)`** | Tỷ lệ trực quan cho stock nhỏ (20 = 100%), không cần tổng max stock. |

## Cập Nhật Phiên Trước (2026-05-10) — Session 8

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

1. **Test thủ công Sale CMS** — Tạo combo + tier + bật `isPublic` coupon từ Admin → xác nhận render đúng trên `/sale`
2. **Cursor-based pagination** — Thay Load More + limit lớn bằng cursor pagination thật nếu catalog mở rộng
3. **Refresh token rotation** — Thêm endpoint `/auth/refresh` để rotate refreshToken (hiện lưu MongoDB Session nhưng chưa dùng)
4. **About/WorkshopSection ảnh thật** — Thay placeholder pattern bằng ảnh upload thật khi có nội dung

## Quy tắc session

- **Context dài**: Hỏi user có muốn `/compact` không khi conversation có nhiều tool calls.
- **Trước khi kết thúc**: Khi user nói "done", "tạm dừng", "xong" — chạy `/update-claude-md`.
