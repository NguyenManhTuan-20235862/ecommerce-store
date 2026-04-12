TOPIC GR1

ĐỀ BÀI: XÂY DỰNG WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN TRANG PHỤC (FASHION E-COMMERCE)

I. BỐI CẢNH \& MỤC TIÊU

Bối cảnh:
Một thương hiệu thời trang trẻ muốn chuyển đổi số. Họ cần một website bán hàng chuyên nghiệp, tập trung vào trải nghiệm mua sắm trực quan, khuyến khích người dùng khám phá sản phẩm (áo, quần, váy, phụ kiện…).

Mục tiêu:
Xây dựng hệ thống web hoạt chỉnh, có đầy đủ chức năng cốt lõi của một sàn TMĐT quy mô vừa, bao gồm cả giao diện người dùng (front-end) và trang quản trị (admin/back-office).

II. YÊU CẦU CHỨC NĂNG CỤ THỂ

A. Giao diện khách hàng (Customer-facing site)

1\. Trang chủ

- Banner slider quảng cáo bộ sưu tập mới, khuyến mãi.
- Hiển thị danh mục sản phẩm nổi bật (ví dụ: “Hàng mới về”, “Bán chạy nhất”, “Ưu đãi sốc”).
- Thanh tìm kiếm sản phẩm (theo tên, mô tả, mã SKU).

2\. Danh sách sản phẩm \& Bộ lọc

- Hiển thị sản phẩm dạng grid/lưới, có phân trang.
- Bộ lọc đa tiêu chí: danh mục (áo sơ mi, quần jeans…), kích thước (S/M/L/XL), màu sắc, khoảng giá, thương hiệu.
- Sắp xếp: giá tăng/giảm, mới nhất, tên A-Z.
- Mỗi sản phẩm có ảnh đại diện, tên, giá, nút “Thêm vào giỏ”.

3\. Chi tiết sản phẩm

- Ảnh sản phẩm dạng thư viện (zoom, chuyển ảnh).
- Mô tả chi tiết: chất liệu, hướng dẫn bảo quản, bảng kích thước.
- Chọn biến thể: màu, size, số lượng (tồn kho hiển thị).
- Hiển thị sản phẩm liên quan (cùng danh mục).
- Đánh giá / bình luận của khách hàng (có xác thực).

4\. Giỏ hàng (Shopping cart)

- Xem danh sách sản phẩm đã chọn, cập nhật số lượng, xóa sản phẩm.
- Tính tạm tính, phí vận chuyển (dạng giả định), tổng tiền.
- Áp dụng mã giảm giá (coupon code).

5\. Thanh toán (Checkout)

- Form thu thập thông tin: họ tên, email, số điện thoại, địa chỉ (tỉnh/huyện/xã).
- Chọn phương thức thanh toán:
  - Thanh toán khi nhận hàng (COD)
  - Thanh toán qua cổng giả lập (ví dụ: thẻ tín dụng giả, hoặc tích hợp sandbox của VNPAY/Momo – là điểm cộng)

- Xác nhận đơn hàng, gửi email xác nhận (mô phỏng).

6\. Tài khoản người dùng

- Đăng ký / đăng nhập (xác thực qua email, JWT hoặc session).
- Quên mật khẩu (gửi link reset).
- Trang “Tài khoản của tôi”: xem lịch sử đơn hàng, trạng thái đơn hàng, quản lý địa chỉ giao hàng, đổi mật khẩu.

7\. Tính năng bổ sung (khuyến khích)

- Gợi ý sản phẩm “Những người mua sản phẩm này cũng mua…”.
- Yêu thích sản phẩm (wishlist).

B. Trang quản trị (Admin Dashboard)

1. Quản lý sản phẩm

- CRUD (Thêm, sửa, xóa, xem) sản phẩm.
- Thông tin sản phẩm: tên, mô tả, giá, số lượng tồn kho, ảnh (upload lên server hoặc cloud), danh mục, biến thể (size, màu), SKU.
- Import/export sản phẩm từ file Excel (điểm cộng).

2\. Quản lý danh mục \& thuộc tính (size, màu, thương hiệu).

3\. Quản lý đơn hàng

- Xem danh sách đơn hàng, lọc theo trạng thái (chờ xử lý, đã xác nhận, đang giao, đã giao, hủy).
- Cập nhật trạng thái đơn hàng.
- Xem chi tiết đơn hàng.

4\. Quản lý khách hàng (xem danh sách, khóa/mở tài khoản).

5\. Quản lý mã giảm giá (tạo mã, % giảm, tối đa số lần sử dụng, hạn dùng).

6\. Thống kê cơ bản

- Biểu đồ doanh thu theo tuần/tháng.
- Top sản phẩm bán chạy.
- Số lượng đơn hàng, tổng doanh thu.

III. YÊU CẦU KỸ THUẬT \& CÔNG NGHỆ

- Front-end: HTML5, CSS3 (có thể dùng Tailwind, Bootstrap hoặc tự viết), JavaScript (ReactJS/VueJS/Angular là điểm cộng mạnh). Responsive (mobile, tablet, desktop).
- Back-end: Tự chọn: Node.js (Express), Python (Django/Flask), Java (Spring Boot), PHP (Laravel) – miễn là có giải thích kiến trúc.
- Database: MySQL, PostgreSQL hoặc MongoDB (thiết kế quan hệ hợp lý, có index).

- Bảo mật tối thiểu:
  - Mã hóa mật khẩu (bcrypt).
  - Chống SQL injection, XSS, CSRF.
  - Xác thực người dùng với token (JWT) hoặc session.

- API: Thiết kế RESTful API rõ ràng (có tài liệu cơ bản trong báo cáo).
- Phiên bản \& triển khai:
  - Sử dụng Git (commit đều đặn, nhánh rõ ràng).
  - Triển khai lên một nền tảng cloud miễn phí (Render, Vercel + Railway, hoặc hosting local với hướng dẫn cài đặt) – kèm link demo live.

IV. GIAO DIỆN \& TRẢI NGHIỆM NGƯỜI DÙNG (UX/UI)

- Giao diện thân thiện, màu sắc hài hòa (liên quan đến thời trang).
- Tối ưu tốc độ tải trang (lazy loading ảnh, minify CSS/JS).
- Form validation rõ ràng (ví dụ: email sai định dạng, mật khẩu không khớp).
- Thông báo thân thiện (toast, modal) khi thêm vào giỏ, thanh toán thành công hay lỗi.

V. SẢN PHẨM BÀN GIAO

- Source code (đóng gói zip hoặc link GitHub repository - private nhưng cấp quyền cho giảng viên).
  - Có file README.md hướng dẫn cài đặt, cấu hình môi trường, chạy local.
  - Có file .env.example và giải thích biến môi trường.

- Báo cáo PDF (tối đa 15 trang) gồm:
  - Mô tả ý tưởng, đối tượng sử dụng.
  - Sơ đồ use-case, sơ đồ cơ sở dữ liệu (ERD).
  - Kiến trúc hệ thống (ví dụ: MVC, client-server).
  - Các quyết định kỹ thuật quan trọng (tại sao chọn tech stack đó).
  - Hướng dẫn kiểm thử một số chức năng chính.
  - Ảnh chụp màn hình giao diện (cả user và admin).
  - Phân tích hạn chế và hướng phát triển.

- Video demo (dài 5-7 phút) thao tác:
  - Đăng ký/đăng nhập.
  - Duyệt sản phẩm, lọc, tìm kiếm, xem chi tiết.
  - Thêm vào giỏ, áp mã giảm giá, thanh toán.
  - Admin: tạo sản phẩm, cập nhật đơn hàng.

VI. TIÊU CHÍ CHẤM ĐIỂM

Tiêu chí | Tỷ trọng

Hoàn thiện chức năng cốt lõi | 40%

Giao diện \& UX responsive | 15%

Chất lượng code | 15%

Bảo mật \& xử lý lỗi | 10%

Báo cáo + video demo | 10%

Tính sáng tạo | 10%

Lưu ý quan trọng:

- Nộp bài chậm trừ 10%/ngày.
- Không được copy đồ án năm trước hoặc của nhóm khác. Mọi phát hiện đạo văn sẽ bị điểm 0.
- Làm việc nhóm (tối đa 3 người) – nộp bảng phân công công việc rõ ràng.

VII. THỜI GIAN \& HÌNH THỨC NỘP

Thời gian: 3 tuần kể từ ngày giao đề.

Nộp qua: hệ thống LMS của trường (upload zip code + báo cáo + link video demo).
