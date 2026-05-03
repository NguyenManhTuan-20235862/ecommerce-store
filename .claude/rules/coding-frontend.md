---
description: Quy tắc coding Frontend cho dự án — cấu trúc component, state management, form validation, HTTP calls. Áp dụng khi thêm trang, component hoặc logic frontend.
globs: ["frontend/src/**/*.jsx", "frontend/src/**/*.js"]
alwaysApply: false
---

# Nguyên Tắc Coding Frontend

## Cấu trúc Component
- Tổ chức theo trang: `pages/<TênTrang>/` — mỗi trang có subfolder `components/` riêng nếu cần.
- Shared UI dùng chung: `components/ui/` (atoms: Button, Input, ProductCard) và `components/common/` (Breadcrumb, Pagination).
- Không tạo shared component khi chỉ có 1 nơi dùng — đặt thẳng vào folder trang đó.

## State Management (Zustand)
- Ba store chính: `authStore` (auth + token), `cartStore` (giỏ hàng + API sync), `uiStore` (sidebar, modal).
- Tất cả persist vào localStorage.
- Không tạo store mới cho state local của một component — dùng `useState`/`useReducer`.

## Form Validation
- Dùng **Zod + React Hook Form** nhất quán ở mọi form mới.
- Pattern hiện có ở Auth (Login, Register) — làm theo cùng cấu trúc cho Admin ProductForm, Checkout và các form sau.

## HTTP Calls (Service Layer)
- Mọi HTTP call đi qua service layer tương ứng (`product.service.js`, `cartService.js`, `category.service.js`).
- **Không** gọi `axios` trực tiếp trong component.
- Service mới đặt tại `frontend/src/services/`.

## Responsive
- Kiểm tra mobile breakpoint khi thêm trang mới.
- Dùng Tailwind responsive prefix chuẩn: `sm:`, `md:`, `lg:`.

## Routing & Guards
- Protected pages dùng `ProtectedRoute`, admin pages dùng `AdminRoute`.
- `App.jsx` dùng `<BrowserRouter>` — không dùng `createBrowserRouter` từ `routes/index.jsx` (file đó không có hiệu lực).

## Format dữ liệu
- Giá VNĐ: `Intl.NumberFormat("vi-VN")` — dùng `formatCurrency` từ `utils/formatCurrency.js`.
- Date: dùng `utils/formatDate.js`.
- Class merging: dùng `cn()` từ `utils/cn.js`.
