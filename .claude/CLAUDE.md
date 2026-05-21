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

**Frontend ✅:** Auth · Landing · Header · Shop · Product Detail · Cart · Checkout · Profile · Wishlist · Reviews · Admin (Dashboard với vertical bar chart drill-down/Products/Categories/Orders/Customers/Coupons/About CMS)

## Cập Nhật Phiên Này (2026-05-21) — Session 14

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Demo data seeder** ✅ | `backend/seeders/demoSeeder.js` — 6 users VN thực tế (pass: Demo@1234), 10 coupons ngẫu nhiên, 10 sản phẩm mới đầy đủ thông tin. Idempotent (skip nếu đã tồn tại). |
| **Color auto-fill** ✅ | `ProductForm.jsx` — `COLOR_MAP` (~35 màu VN→hex) + `guessHex()`. Gõ tên màu → ô color picker tự chuyển. `setValue` từ RHF. |
| **Color migration** ✅ | `backend/seeders/colorMigration.js` — cập nhật `colorHex` cho 33 sản phẩm có sẵn trong DB khớp bảng `COLOR_MAP`. |
| **Dashboard vertical bar chart** ✅ | Biểu đồ dọc gradient (#004BE3→#819BFF), Y-axis nhãn rút gọn (tr/k), grid lines, tooltip hover (doanh thu + đơn). Nhấn cột tháng → drill-down ngày. Nút ← quay lại. |
| **Drill-down API** ✅ | `GET /api/orders/stats/daily?year&month` — backend aggregate theo `$dayOfMonth`. FE `order.service.getDailyStats()`. |
| **Tooltip smart position** ✅ | Khi bar cao (doanh thu lớn): tooltip hiện `top-2` bên trong bar thay vì `bottom-full` bị clip. |

### Quyết định quan trọng (session 14)

| Quyết định | Lý do |
|---|---|
| **`COLOR_MAP` đặt ngoài component** | Static constant — không cần re-create mỗi render. |
| **`tooltipAbove = barH < CHART_H - 95`** | 95px ≈ chiều cao tooltip — đủ chỗ thì hiện phía trên, không thì hiện bên trong bar. |
| **`demoSeeder.js` idempotent** | Check trùng username/email/code/slug trước khi insert — chạy lại không lỗi. |
| **`colorMigration.js` tách riêng** | Không bao giờ chạy lại tự động — script 1 lần, tách khỏi demoSeeder để rõ intent. |

## Cập Nhật Phiên Trước (2026-05-21) — Session 13

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **About Page CMS — Backend** ✅ | Models: `Store` (cityKey enum SG/HN/ĐN/HP), `TeamMember`, `SiteConfig` (singleton). Routes tại `/api/stores`, `/api/team`, `/api/about-config`. |
| **About Page CMS — Frontend** ✅ | Services + `cityColors.js` + `Admin/About/index.jsx` (3 tabs) + 4 Customer components fetch từ API. |
| **QA + Bug fix** ✅ | 5 FAIL fixed: `data: null` trong DELETE, imgId `""` xóa file cũ, mass assignment qua `req.body`. |

### Quyết định quan trọng (session 13)

| Quyết định | Lý do |
|---|---|
| **`cityColors.js` dùng chung** | StoresSection + MapSection cùng cần map cityKey → màu. |
| **`MapSection`: `useState(null)`** | Tránh hardcode "SG" — set `stores[0]?.cityKey` sau fetch. |
| **`SiteConfig.getConfig()` trả `config ?? {}`** | Lần đầu deploy chưa có data, không crash. |

## Ưu Tiên Phiên Tiếp Theo

1. **Test thủ công About CMS** — Admin tạo store + member + contact → xác nhận render đúng trên `/about`
2. **Test thủ công Sale CMS** — Tạo combo + tier + bật `isPublic` coupon → xác nhận `/sale`
3. **Cursor-based pagination** — Thay Load More + limit lớn bằng pagination thật
4. **Refresh token rotation** — Thêm endpoint `/auth/refresh`
5. **About/WorkshopSection ảnh thật** — Thay placeholder bằng ảnh upload

## Quy tắc session

- **Context dài**: Hỏi user có muốn `/compact` không khi conversation có nhiều tool calls.
- **Trước khi kết thúc**: Khi user nói "done", "tạm dừng", "xong" — chạy `/update-claude-md`.
