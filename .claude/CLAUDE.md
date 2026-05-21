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

## Cập Nhật Phiên Này (2026-05-21) — Session 15

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **About seeder** ✅ | `backend/seeders/aboutSeeder.js` — 4 cửa hàng (SG/HN/ĐN/HP), 8 thành viên có ảnh `randomuser.me`, 1 SiteConfig. Chạy `node seeders/aboutSeeder.js`. |
| **Lookbook seeder** ✅ | `backend/seeders/lookbookSeeder.js` — 7 story (order 0–6) cho URBAN CHRONICLES, title + subtitle thực tế, ảnh picsum. |
| **PhilosophySection modal** ✅ | Click card → overlay modal chi tiết 4 đoạn văn, giữ màu card, nút × + click-outside đóng. |
| **WorkshopSection lightbox** ✅ | Click bất kỳ ảnh quy trình → lightbox fullscreen, prev/next, dots navigation, zoom hint khi hover. |
| **WorkshopSection text fix** ✅ | Thêm `text-white` explicit vào h2 — "để hoàn thành một đôi giày" trắng rõ trên nền `#1e293b`. |
| **HeroSection ảnh** ✅ | User thay bằng `src/assets/vibe-urban-v2.jpg` (local). |
| **StorySection ảnh** ✅ | User thay bằng `src/assets/image.png`, `Store1.jpg`, `Store4.jpg` (local). |
| **WorkshopSection ảnh** ✅ | User thay bằng `src/assets/Cat.png`, `Khau.png`, `Danhso.png`, `Ktra.png`, `Goi.png` (local). |

### Quyết định quan trọng (session 15)

| Quyết định | Lý do |
|---|---|
| **Ảnh team dùng `randomuser.me`** | Không có dịch vụ nào cung cấp ảnh người Việt + đứng khoanh tay — user cần tự upload qua Admin. |
| **Lightbox WorkshopSection inline** | Không tách component riêng — chỉ dùng 1 lần, đặt thẳng vào file. |
| **Lookbook seeder xóa sạch rồi insert** | Stories luôn là content cố định, không cần idempotent như demoSeeder. |

## Cập Nhật Phiên Trước (2026-05-21) — Session 14

### Hoàn thành

| Hạng mục | Chi tiết |
|---|---|
| **Demo data seeder** ✅ | `backend/seeders/demoSeeder.js` — 6 users VN thực tế (pass: Demo@1234), 10 coupons ngẫu nhiên, 10 sản phẩm mới đầy đủ thông tin. Idempotent. |
| **Color auto-fill** ✅ | `ProductForm.jsx` — `COLOR_MAP` (~35 màu VN→hex) + `guessHex()`. Gõ tên màu → ô color picker tự chuyển. |
| **Dashboard vertical bar chart** ✅ | Biểu đồ dọc gradient, drill-down ngày, tooltip smart position. |
| **Drill-down API** ✅ | `GET /api/orders/stats/daily?year&month`. |

## Ưu Tiên Phiên Tiếp Theo

1. **Ảnh team người Việt** — Upload thủ công qua `/admin/about` → tab Thành viên (ảnh đứng khoanh tay)
2. **Lookbook ảnh thật** — Upload qua `/admin` → Lookbook thay ảnh picsum
3. **Cursor-based pagination** — Thay Load More + limit lớn bằng pagination thật
4. **Refresh token rotation** — Thêm endpoint `/auth/refresh`
5. **Test thủ công Sale CMS** — Tạo combo + tier + bật `isPublic` coupon → xác nhận `/sale`

## Quy tắc session

- **Context dài**: Hỏi user có muốn `/compact` không khi conversation có nhiều tool calls.
- **Trước khi kết thúc**: Khi user nói "done", "tạm dừng", "xong" — chạy `/update-claude-md`.
