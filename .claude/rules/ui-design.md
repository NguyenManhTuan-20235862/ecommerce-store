---
description: Quy tắc thiết kế giao diện UI/UX cho Vibe Urban — màu sắc, typography, spacing, animation. Áp dụng khi viết hoặc chỉnh sửa component Tailwind CSS.
globs: ["frontend/src/**/*.jsx", "frontend/src/**/*.css"]
alwaysApply: false
---

# Nguyên Tắc Thiết Kế Giao Diện (UI/UX)

## Phong cách chủ đạo
- Tối giản (Minimalism), Hiện đại (Modern), Sang trọng (Premium E-commerce), Chuyên nghiệp.
- Cảm hứng từ "Filling Pieces" — layout rộng, hình ảnh lớn tập trung chi tiết, gọn gàng sang trọng.

## Bảng màu (Color System)

| Vai trò | Giá trị |
|---|---|
| Nền chính | `#F9F6F5` (warm gray nhạt) |
| Nền phụ | `#F3F0EF` |
| Chữ chính | `#2F2F2E` (xám đậm) |
| Chữ phụ | `#5C5B5B` |
| Accent CTA (từ) | `#004BE3` |
| Accent CTA (đến) | `#819BFF` |

- Accent xanh dùng cho CTA, link, trạng thái tương tác (hover, focus, active).
- **Không dùng** accent đỏ/cam ở bất kỳ màn Auth (Login, Register).
- Không tự ý thêm màu ngoài hệ thống trên.

## Typography
- Font: Inter, Outfit (hiện đại, thanh lịch).
- Text lớn, rõ, tương phản cao.
- Tiêu đề section: cỡ lớn, font-weight semibold/bold.

## Spacing & Layout
- Tận dụng tối đa white space — các block giãn cách thoải mái.
- Thiết kế Editorial: ưu tiên layout 2 cột lớn hơn grid template thông thường.
- Padding/margin section rộng rãi (py-16, py-24 thay vì py-8).

## Chuyển động (Motion)
- Micro-animations tinh tế: hover fade, slide mượt, scale nhẹ.
- Không làm quá lố — animation chỉ tăng cảm giác premium, không gây xao nhãng.
- Dùng Tailwind transition/duration/ease đủ là được, không cần animation library riêng.
