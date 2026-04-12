# Hướng Dẫn Dự Án & Trợ Lý AI (CLAUDE.md)

## 📌 Tổng Quan Dự Án
- **Tên dự án:** Men's Fashion E-commerce Website
- **Mục tiêu:** Xây dựng hệ thống web thương mại điện tử chuyên bán quần áo, đồ phụ kiện thời trang dành riêng cho Nam giới (Menswear). Gồm đầy đủ chức năng cốt lõi cho cả Khách hàng (Customer) và Quản trị viên (Admin) dựa trên đồ án `docs/topic/TOPIC GR1.md`.
- **Yêu cầu cốt lõi:** Đáp ứng đầy đủ tính năng (40%), Giao diện & UX tốt (15%), Code sạch/chuẩn (15%), Bảo mật tuyệt đối (10%).

## 🎨 Nguyên Tắc Thiết Kế Giao Diện (UI/UX)
- **Phong cách chủ đạo:** Tối giản (Minimalism), Hiện đại (Modern), Sang trọng (Premium E-commerce) và Chuyên nghiệp.
- **Cảm hứng thiết kế:** Theo style của website "Filling Pieces" (Layout rộng, hình ảnh lớn tập trung vào chi tiết cấu trúc, cảm giác gọn gàng sang trọng).
- **Chi tiết UI/UX:**
  - **Màu sắc:** Sử dụng tông màu Monochrome làm chủ đạo (Trắng, Đen, các dải Xám). Hạn chế sử dụng nhiều màu rực rỡ không cần thiết, nhường sự nổi bật cho hình ảnh sản phẩm.
  - **Typography:** Lựa chọn các bộ font hiện đại, thanh lịch (ví dụ: Inter, Outfit, hoặc các font chữ đặc trưng của mảng thời trang). Text cần lớn, rõ ràng và có độ tương phản cao.
  - **Không gian (Space):** Tận dụng tối đa khoảng trắng (Negative/White space). Các khối (blocks) được giãn cách để tạo sự thoải mái cho đôi mắt.
  - **Chuyển động (Motion):** Bổ sung các micro-animations (hiệu ứng hover, chuyển slide mượt, fade-in trang) tinh tế để tăng tính tương tác, không nên làm quá lố.

## 🛠 Technology Stack (Đề xuất theo lịch sử dự án)
- **Frontend:** ReactJS, Tailwind CSS (để style dễ dàng theo định hướng tối giản), Framer Motion (cho micro-animations), Zustand (quản lý state).
- **Backend:** Node.js vớt Express.
- **Database:** MongoDB.
- **Bảo mật & Auth:** JWT (JSON Web Tokens), Bcrypt (mã hóa mật khẩu).

## 💻 Nguyên tắc Coding (Coding Standards)

### Frontend
- Xây dựng component rõ ràng, có khả năng tái sử dụng (Atoms, Molecules, Organisms).
- Luôn kiểm tra tính Responsive (Mobile, Tablet, Desktop) trên từng component, ưu tiên cách tiếp cận Mobile-First.
- Tối ưu hóa việc render lại, validate form kỹ lưỡng ngay tại frontend trước khi gọi API.

### Backend & Database
- Mô hình kiến trúc rõ ràng (Routes -> Controllers -> Models), code chia tách theo từng feature.
- **Bảo mật đầu ra & vào:** Validate dữ liệu request (tránh SQL/NoSQL Injection, XSS), quản lý luồng lỗi (error handling middleware) tập trung phục vụ response đồng nhất.
- Đảm bảo database có các index hợp lý để tối ưu query, có sẵn dữ liệu mẫu (Seeder) phục vụ việc chạy thử nghiệm.

## 🤖 Nguyên Tắc Dành Cho AI (Khi Phục Vụ Dự Án Này)
1. **Ngôn ngữ:** Luôn giao tiếp, giải đáp và comment bằng **Tiếng Việt**.
2. **Định hướng thiết kế:** Khi code giao diện bằng HTML/CSS/Tailwind, LUÔN đảm bảo việc thiết kế đi theo phương châm trang nhã, tối giản, sang trọng.
3. **Bám sát yêu cầu nghiệp vụ:** Khi triển khai tính năng mới, luôn tự động đối chiếu với `docs/topic/TOPIC GR1.md` để đáp ứng đúng quy định của đồ án môn học.
4. **Bảo mật & Clean Code:** Code sinh ra cung cấp tới người dùng phải trực quan, dễ mở rộng, có đầy đủ các block kiểm tra lỗi (Try/Catch), an toàn về bảo mật ngay từ những dòng code nhỏ nhất.
