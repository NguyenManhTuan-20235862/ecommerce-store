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
| `architecture.md` | Cấu trúc thư mục, quyết định kiến trúc | Điều hướng codebase |

## Modules Đã Hoàn Thành

**Backend ✅:** Auth · Middleware · Product · Category · Cart · Order (+ daily stats drill-down) · Upload · User (profile/avatar/addresses/wishlist) · Coupon · Review · Store/Team/SiteConfig (About CMS)

**Frontend ✅:** Auth · Landing (+ scroll-triggered animations) · Header · Shop · Product Detail · Cart · Checkout · Profile · Wishlist · Reviews · Admin (Dashboard/Products/Categories/Orders/Customers/Coupons/Lookbook/Sale/About — tất cả có full animation)

## Cập Nhật Phiên Này (2026-05-29) — Session 18

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Cursor-based pagination (Shop)** ✅ | Shop Load More dùng `loadCursor` state: `null` = fresh load, string = append. Backend `getProducts` nhận `cursor` (base64 JSON `{_id, price}`), build compound `$or` filter cho price sorts, `_id` filter cho newest. Response thêm `nextCursor`. |
| **Server-side pagination (Admin Orders)** ✅ | `getAllOrders` nhận `{page, limit, status}`. Filter tabs gọi server với status param, không còn client-side slice. |
| **Server-side pagination (Admin Customers)** ✅ | `getAllUsers` nhận `{page, limit, search}`. Reactive fetch `[page, debouncedSearch]`. Xóa `useCallback` + 3 useEffect cũ → 2 useEffect gọn hơn. |
| **Refresh token** ✅ | Đã implement sẵn từ session trước — xác nhận không cần làm thêm. |
| **QA test** ✅ | 15/18 PASS. Fix 1 bug: cursor base64 hợp lệ nhưng thiếu `_id` → validate trả 400 thay vì trả `[]` rỗng. |

### Files đã thay đổi (session 18)

| File | Thay đổi |
|---|---|
| `backend/controllers/productController.js` | Cursor mode: compound `$or` (price sorts) / `_id` (newest). Validate `!lastId`. `nextCursor` trong response. |
| `backend/services/orderService.js` | `getAllOrders({page,limit,status})` — skip/limit/countDocuments |
| `backend/controllers/orderController.js` | Đọc query params, trả `pagination` object |
| `backend/controllers/userController.js` | `getAllUsers` thêm `page/limit`, skip/limit/countDocuments |
| `frontend/src/pages/Shop/index.jsx` | Thay `[page]` → `[loadCursor, nextCursor, hasMore]` |
| `frontend/src/pages/Admin/Orders/index.jsx` | Reactive useEffect `[page, activeTab]`, `handleTabChange` batch reset |
| `frontend/src/pages/Admin/Customers/index.jsx` | Reactive useEffect `[page, debouncedSearch]`, bỏ `useCallback` |
| `frontend/src/services/order.service.js` | `getAllOrders(params={})` |

### Quyết định quan trọng (session 18)

| Quyết định | Lý do |
|---|---|
| **`loadCursor=null` = fresh load** | Thay vì `page` state, dùng cursor state: `null` trigger fetch mới, string trigger append. Filter handlers đều gọi `setLoadCursor(null)` + React 18 batching đảm bảo 1 render duy nhất. |
| **Compound cursor cho price sorts** | `$or: [{price: {$gt/lt: lastPrice}}, {price: lastPrice, _id: {$lt: lastId}}]` — đảm bảo cursor đúng khi nhiều item cùng giá. |
| **`handleTabChange` batch reset** | `setActiveTab(x); setPage(1)` trong cùng event handler → React 18 batch → 1 render → 1 fetch (không double fetch). |
| **Bỏ tab badge count** | Count per-status không còn chính xác khi chỉ load 1 trang → xóa, tránh mislead. |

## Cập Nhật Phiên Trước (2026-05-28) — Session 17

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Landing scroll animations** ✅ | HeroSection (`scrollSlideLeft/Right`), DropsSection (`scrollFadeUp`), TrendingSection (`scrollFadeUp` + `whileInView` stagger), LookbookSection (`scrollSlideLeft/Right`), MarqueeSection (`scrollFadeIn`). |
| **Admin animations — toàn bộ** ✅ | 10 file cập nhật đồng bộ, build 0 lỗi. `drawerSlideIn`, stagger tbody key reset, AnimatePresence cho modal/drawer. |

## Cập Nhật Phiên Trước (2026-05-21) — Session 16

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **New Drops card redesign** ✅ | Tên sản phẩm vào trong frosted glass overlay, bên dưới chỉ còn price + button → các card đồng chiều cao, không lệch khi title dài/ngắn. |
| **Giá gạch ngang (compareAtPrice)** ✅ | Hiển thị giá gốc gạch ngang trên: Landing `ProductCard`, Shop `ProductCard` (`components/ui/`), `ProductDetails`. Data truyền từ `Landing/index.jsx` + `Product/index.jsx`. |
| **Tỉ lệ hoàn hủy Dashboard** ✅ | Cuối panel "Đơn hàng theo trạng thái" — thanh progress bar color-coded (xanh ≤5%, vàng 5–10%, đỏ >10%) + dòng "X đơn hủy / Y đơn tổng". |
| **Field `costPrice` (giá vốn)** ✅ | Backend: `Product.js` + `productController.js` + `orderService.js` ($lookup tính COGS). Frontend: `schemas.js` + `ProductForm.jsx` (3 cột: Giá vốn \| Giá bán \| Giá gốc) + Dashboard banner lợi nhuận. |
| **Dashboard lợi nhuận ước tính** ✅ | Banner hiển thị: Lợi nhuận = doanh thu − giá vốn, Biên lợi nhuận %, màu xanh/đỏ theo kết quả. |
| **costPriceMigration.js** ✅ | `backend/seeders/costPriceMigration.js` — cập nhật `costPrice` cho 33 sản phẩm hiện có, làm tròn 5.000đ, bỏ qua sản phẩm đã có giá vốn. Đã chạy xong. |

### Tỉ lệ giá vốn theo danh mục (đã áp dụng)

| Danh mục | Ratio | Margin |
|---|---|---|
| `ao` | 46% giá bán | ~54% |
| `quan` | 44% giá bán | ~56% |
| `hoodie-sweater` | 50% giá bán | ~50% |
| `giay` | 52% giá bán | ~48% |
| `phu-kien` | 38% giá bán | ~62% |

### Quyết định quan trọng (session 16)

| Quyết định | Lý do |
|---|---|
| **costPrice tính profit dùng $lookup** | Không lưu costPrice vào order items (tránh phình Order schema); join sang Product collection khi aggregate — đủ chính xác cho dashboard |
| **Profit = totalRevenue − totalCost** | `totalRevenue` dùng `finalAmount` (đã trừ coupon/discount + có phí ship), `totalCost` = sum(costPrice × qty). Cách tính gọn, phù hợp demo. |
| **Migration script idempotent** | Bỏ qua sản phẩm `costPrice > 0` — an toàn chạy lại nhiều lần khi thêm sản phẩm mới. |

## Cập Nhật Phiên Trước (2026-05-21) — Session 15

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **About seeder** ✅ | `backend/seeders/aboutSeeder.js` — 4 cửa hàng (SG/HN/ĐN/HP), 8 thành viên có ảnh `randomuser.me`, 1 SiteConfig. |
| **Lookbook seeder** ✅ | `backend/seeders/lookbookSeeder.js` — 7 story cho URBAN CHRONICLES. |
| **PhilosophySection modal** ✅ | Click card → overlay modal chi tiết 4 đoạn văn. |
| **WorkshopSection lightbox** ✅ | Click ảnh → lightbox fullscreen, prev/next, dots navigation. |
| **Font overhaul** ✅ | Fraunces (heading) + Nunito (sans) + Cormorant Garamond (serif). `.price` utility class `0.75em`. |
| **Trang Hỗ Trợ `/support`** ✅ | Hero + sticky nav + FaqSection + ShippingSection + ContactSection. Hash anchor scroll. |
| **Footer + Header links** ✅ | Footer trỏ đúng `/support#shipping`, `/support#faq`, `/support#contact`. Header "Hỗ trợ" dẫn `/support`. |
| **ScrollToTop button** ✅ | `RootLayout.jsx` — nút ^ góc phải, hiện sau 300px scroll. |

## Ưu Tiên Phiên Tiếp Theo

1. **Ảnh team người Việt** — Upload thủ công qua `/admin/about` → tab Thành viên
2. **Lookbook ảnh thật** — Upload qua Admin → Lookbook thay ảnh picsum
3. **costPrice sản phẩm mới** — Khi tạo sản phẩm mới qua Admin form, nhớ điền Giá vốn (cột đầu tiên trong grid 3 cột)
4. **Sale page — CouponsTab animation** — Tab này chưa có stagger (chỉ TiersTab + CombosTab được thêm trong session 17)
5. **Test thủ công UI pagination** — Cần verify trên browser: Shop Load More, Admin Orders tab switch + phân trang, Admin Customers search + phân trang

## Quy tắc session

- **Context dài**: Hỏi user có muốn `/compact` không khi conversation có nhiều tool calls.
- **Trước khi kết thúc**: Khi user nói "done", "tạm dừng", "xong" — chạy `/update-claude-md`.
