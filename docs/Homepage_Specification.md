# Đặc Tả Kỹ Thuật: Giao diện Trang Chủ (Homepage & Main Layout)

## 1. Tổng Quan
Xây dựng giao diện Trang chủ (`Home`) và bộ khung Layout chính (`Header`, `Footer`) cho nền tảng Men's Fashion E-commerce. Giao diện này sẽ là điểm chạm đầu tiên của người dùng, thể hiện tính thẩm mỹ cao (Sang trọng, Tối giản) và tuân thủ các chức năng yêu cầu ở mục II.A.1 của `TOPIC GR1.md`.

## 2. Functional Requirements (Yêu Cầu Chức Năng)

### 2.1 Main Layout (Bộ Khung)
- **Header**: 
  - Logo thương hiệu (chữ tối giản).
  - Thanh điều hướng (Trang chủ, Sản phẩm, Bộ sưu tập).
  - Tích hợp 3 nút chức năng: Tìm kiếm (Mở ra thanh search mượt mà), Giỏ hàng, Tài khoản (Check trạng thái đăng nhập từ `useAuthStore`).
  - Phải có tính năng "Sticky" (dính lên mép trên màn hình khi cuộn hoặc làm trong suốt ở đầu trang).
- **Footer**:
  - Chứa thông tin cơ bản: Chăm sóc khách hàng, Liên kết mạng xã hội, form Đăng ký nhận bản tin với tông màu đen/xám nhạt tối giản.

### 2.2 Homepage Components (Thành Phần Trang Chủ)
- **Hero Slider (Banner Quảng Cáo)**: 
  - Slider lớn (chiếm >= 80% chiều cao màn hình) trình bày Bộ sưu tập mới của Nam giới. 
  - Sử dụng hiệu ứng chuyển động mượt mà (Fade hoặc Slide ngang) và có nút Call-to-action "Khám Phá".
- **Thanh Tìm Kiếm (Search)**:
  - Khi click icon Search trên Header, bung ra ô nhập văn bản theo chiều ngang (Slide down) gọn gàng.
- **Giao diện Danh sách Nổi Bật**:
  - Bổ sung 2 khu vực dạng Carousel hoặc Grid: "Hàng Mới Về" (New Arrivals) và "Top Thịnh Hành" (Trending Now).
  - Thiết kế `ProductCard`: Ảnh dọc tỉ lệ 3:4 hoặc 4:5 (đậm chất lookbook thời trang), tên sản phẩm hiển thị nhỏ gọn, giá tiền, và nút "Thêm" nhỏ tinh tế xuất hiện khi thiết bị trượt chuột qua (Hover).

## 3. UI/UX (Định Hướng Từ `CLAUDE.md`)
- **Màu sắc**: Giữ vững triết lý Monochrome. Background hoàn toàn Trắng (`bg-white`).
- **Typography**: Header lớn font cứng cáp hoặc hiện đại, chữ in hoa các Title quan trọng.
- **Cách sắp xếp**: Khoảng trắng (Whitespace) rất rộng để tạo độ "thở" quý phái cho sản phẩm thời trang.

## 4. Kiến Trúc File (Frontend Frontend Setup)
Kỹ sư sẽ khởi tạo:
- `src/layouts/RootLayout.jsx` (Hoặc `MainLayout`)
- `src/layouts/Header.jsx` & `Footer.jsx`
- `src/components/ui/ProductCard.jsx`
- `src/pages/Home/index.jsx`
- `src/pages/Home/components/HeroSlider.jsx`
- *(Mock Data sản phẩm nội bộ để demo UI)*
