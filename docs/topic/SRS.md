Fashion E-commerce Website
Version Date Author Description
1.1 2026-04-15 ITSS-Group15 Updated SRS aligned with TOPIC GR1 and project technical direction

1. Giới thiệu (Introduction)
   1.1. Mục đích
   Tài liệu này nhằm đặc tả đầy đủ và chi tiết các yêu cầu cho hệ thống Website thương mại điện tử bán trang phục (Fashion E-commerce). Tài liệu dành cho các bên liên quan (stakeholders), nhà phát triển (developers), và đội ngũ kiểm thử (QA).

1.2. Phạm vi hệ thống
Hệ thống bao gồm:

Customer-facing site: Giao diện dành cho khách hàng mua sắm.

Admin Dashboard: Giao diện dành cho quản trị viên.

Backend API: Hệ thống API RESTful phục vụ cả hai giao diện trên.

Cơ sở dữ liệu: Lưu trữ sản phẩm, đơn hàng, người dùng, mã giảm giá.

Không nằm trong phạm vi:

Tích hợp thanh toán thực tế (chỉ sandbox/giả lập).

Hệ thống giao hàng thực tế (chỉ mô phỏng phí vận chuyển).

Ứng dụng mobile native (chỉ responsive web).

1.3. Định nghĩa thuật ngữ
Thuật ngữ Định nghĩa
Customer Người dùng cuối, khách hàng mua sắm trên website.
Admin Quản trị viên, người quản lý sản phẩm, đơn hàng, người dùng.
Guest Khách chưa đăng nhập, vẫn có thể xem sản phẩm và thêm vào giỏ.
SKU Stock Keeping Unit - mã định danh duy nhất cho một biến thể sản phẩm.
COD Cash on Delivery - thanh toán khi nhận hàng.
JWT JSON Web Token - phương thức xác thực người dùng.
CRUD Create, Read, Update, Delete - các thao tác cơ bản trên dữ liệu.
1.4. Các bên liên quan (Stakeholders)
Stakeholder Vai trò
Thương hiệu thời trang Khách hàng đặt hàng, cung cấp yêu cầu nghiệp vụ.
Người dùng cuối (Customer) Sử dụng website để mua sắm.
Quản trị viên (Admin) Vận hành website, quản lý nội dung.
Đội ngũ phát triển Xây dựng và triển khai hệ thống.
Giảng viên Đánh giá đồ án theo tiêu chí đề bài.
1.5. Tài liệu tham khảo
Đề bài đồ án TOPIC GR1.md

React.js Documentation

Node.js/Express Documentation

TailwindCSS Documentation

2. Mô tả tổng quan (Overall Description)
   2.1. Góc nhìn sản phẩm
   Hệ thống là một ứng dụng web full-stack, hoạt động theo mô hình Client-Server:

Client: React.js SPA (Single Page Application)

Server: Node.js + Express RESTful API

Database: MongoDB (ưu tiên theo kiến trúc hiện tại)

2.2. Đối tượng người dùng
Người dùng Mô tả Quyền hạn
Guest (Khách chưa đăng nhập) Người truy cập chưa có tài khoản Xem sản phẩm, tìm kiếm, lọc, thêm vào giỏ, tiến hành thanh toán (yêu cầu đăng nhập ở bước cuối)
Customer (Khách hàng) Người đã đăng ký/đăng nhập Toàn bộ quyền của Guest + Xem lịch sử đơn hàng, quản lý địa chỉ, wishlist, đổi mật khẩu
Admin (Quản trị viên) Người quản lý hệ thống Toàn bộ quyền CRUD trên sản phẩm, danh mục, đơn hàng, mã giảm giá, người dùng, xem thống kê
2.3. Môi trường hoạt động
Client: Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge) – desktop, tablet, mobile.

Server: Node.js runtime, hệ điều hành Windows/Linux/macOS.

Database: MongoDB 6+.

Mạng: Kết nối internet (để gọi API và triển khai cloud).

2.4. Giả định & phụ thuộc
Giả định:

Người dùng có kiến thức cơ bản về duyệt web.

Admin có kiến thức về quản trị cơ bản.

Hệ thống được triển khai trên môi trường có hỗ trợ Node.js và database.

Phụ thuộc:

Phụ thuộc vào dịch vụ email SMTP để gửi email xác nhận (có thể dùng mailtrap.io để mô phỏng).

Phụ thuộc vào dịch vụ lưu trữ ảnh (local upload hoặc Cloudinary).

2.5. Ràng buộc
Thời gian phát triển: 3 tuần.

Nhóm tối đa 3 người.

Code phải được quản lý bằng Git, commit đều đặn.

Triển khai lên nền tảng cloud miễn phí (Render, Vercel, Railway, hoặc local kèm hướng dẫn).

3. Yêu cầu chức năng (Functional Requirements)
   3.1. Module: Xác thực & Tài khoản (Authentication & User)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-01 Đăng ký tài khoản Người dùng đăng ký bằng email, mật khẩu, họ tên. Mật khẩu được mã hóa bằng bcrypt. Cao
   FR-02 Đăng nhập Đăng nhập bằng email + mật khẩu, trả về access token; refresh token được lưu trong HttpOnly cookie. Cao
   FR-03 Đăng xuất Vô hiệu hóa refresh token phía server và xóa cookie bảo mật. Cao
   FR-04 Quên mật khẩu Gửi email chứa link reset mật khẩu (token có thời hạn). Trung bình
   FR-05 Đổi mật khẩu Cho phép người dùng đã đăng nhập đổi mật khẩu. Trung bình
   FR-06 Xem thông tin tài khoản Hiển thị họ tên, email, danh sách địa chỉ. Cao
   FR-07 Cập nhật thông tin Cập nhật họ tên, thêm/sửa/xóa địa chỉ giao hàng. Trung bình
   FR-08 Xem lịch sử đơn hàng Hiển thị danh sách đơn hàng đã đặt kèm trạng thái. Cao
   FR-09 Xem chi tiết đơn hàng Xem chi tiết sản phẩm, số lượng, giá, tổng tiền của một đơn hàng. Cao
   3.2. Module: Duyệt sản phẩm (Product Browsing)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-10 Hiển thị danh sách sản phẩm Dạng grid/lưới, mỗi sản phẩm hiển thị ảnh, tên, giá. Cao
   FR-11 Phân trang Hỗ trợ phân trang với số lượng sản phẩm mỗi trang có thể cấu hình (mặc định 12). Cao
   FR-12 Lọc theo danh mục Lọc sản phẩm theo danh mục (Áo, Quần, Váy, Phụ kiện...). Cao
   FR-13 Lọc theo kích thước Lọc theo size (S, M, L, XL...). Cao
   FR-14 Lọc theo màu sắc Lọc theo màu (Đỏ, Xanh, Đen, Trắng...). Cao
   FR-15 Lọc theo khoảng giá Lọc theo giá (ví dụ: dưới 200k, 200k-500k, trên 500k). Cao
   FR-16 Lọc theo thương hiệu Lọc theo thương hiệu (nếu có). Trung bình
   FR-17 Sắp xếp Sắp xếp theo: giá tăng dần, giá giảm dần, mới nhất, tên A-Z. Cao
   FR-18 Tìm kiếm Tìm kiếm theo tên sản phẩm, mô tả, hoặc SKU. Cao
   FR-19 Xem chi tiết sản phẩm Trang riêng hiển thị đầy đủ thông tin sản phẩm. Cao
   FR-20 Thư viện ảnh Sản phẩm có nhiều ảnh, hỗ trợ xoay/zoom (cơ bản). Cao
   FR-21 Chọn biến thể Cho phép chọn màu, size, hiển thị tồn kho theo biến thể. Cao
   FR-22 Sản phẩm liên quan Hiển thị sản phẩm cùng danh mục. Trung bình
   FR-23 Đánh giá & bình luận Khách hàng đã mua có thể đánh giá (sao) và viết bình luận. Trung bình
   3.3. Module: Giỏ hàng (Cart)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-24 Thêm vào giỏ Thêm sản phẩm với số lượng, size, màu đã chọn. Cao
   FR-25 Xem giỏ hàng Hiển thị danh sách sản phẩm, ảnh, tên, size, màu, số lượng, giá. Cao
   FR-26 Cập nhật số lượng Tăng/giảm số lượng hoặc nhập trực tiếp. Cao
   FR-27 Xóa sản phẩm khỏi giỏ Xóa một sản phẩm cụ thể khỏi giỏ. Cao
   FR-28 Xóa toàn bộ giỏ Xóa tất cả sản phẩm trong giỏ. Trung bình
   FR-29 Tính tạm tính Tự động tính tổng tiền các sản phẩm trong giỏ. Cao
   FR-30 Tính phí vận chuyển Tính phí vận chuyển dựa trên địa chỉ (dạng giả định: cố định 30k hoặc miễn phí > 500k). Cao
   FR-31 Áp mã giảm giá Nhập mã coupon, kiểm tra hợp lệ, tính lại tổng tiền. Cao
   FR-32 Lưu giỏ hàng Giỏ hàng được lưu trong localStorage (guest) hoặc database (đã đăng nhập). Cao
   3.4. Module: Thanh toán (Checkout)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-33 Form thông tin nhận hàng Thu thập họ tên, email, số điện thoại, địa chỉ (tỉnh/huyện/xã). Cao
   FR-34 Chọn phương thức thanh toán COD hoặc thanh toán qua cổng giả lập (sandbox VNPAY/Momo – điểm cộng). Cao
   FR-35 Xem lại đơn hàng Hiển thị tóm tắt đơn hàng trước khi xác nhận. Cao
   FR-36 Xác nhận đơn hàng Tạo đơn hàng trong database, chuyển trạng thái sang "Chờ xử lý". Cao
   FR-37 Gửi email xác nhận Gửi email xác nhận đơn hàng đến khách hàng (mô phỏng). Trung bình
   FR-38 Xóa giỏ sau khi đặt hàng Sau khi đặt hàng thành công, giỏ hàng được xóa. Cao
   3.5. Module: Trang chủ & Tiện ích (Home & Utilities)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-39 Banner slider Slider hiển thị ảnh quảng cáo bộ sưu tập mới, khuyến mãi. Cao
   FR-40 Sản phẩm nổi bật Hiển thị các section: "Hàng mới về", "Bán chạy nhất", "Ưu đãi sốc". Cao
   FR-41 Wishlist Cho phép khách hàng thêm sản phẩm vào danh sách yêu thích. Trung bình
   FR-42 Gợi ý sản phẩm "Những người mua sản phẩm này cũng mua..." dựa trên lịch sử đơn hàng. Thấp (điểm cộng)
   3.6. Module: Quản trị - Sản phẩm & Danh mục (Admin - Product & Category)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-43 Xem danh sách sản phẩm Admin xem danh sách sản phẩm, có tìm kiếm, lọc, phân trang. Cao
   FR-44 Thêm sản phẩm Form thêm sản phẩm với các trường: tên, mô tả, giá, tồn kho, ảnh (upload), danh mục, biến thể (size, màu), SKU. Cao
   FR-45 Sửa sản phẩm Cập nhật thông tin sản phẩm. Cao
   FR-46 Xóa sản phẩm Xóa sản phẩm (soft delete hoặc hard delete). Cao
   FR-47 Import sản phẩm từ Excel Upload file Excel để thêm hàng loạt sản phẩm (điểm cộng). Thấp
   FR-48 Export sản phẩm ra Excel Xuất danh sách sản phẩm ra file Excel (điểm cộng). Thấp
   FR-49 Quản lý danh mục CRUD danh mục sản phẩm. Cao
   FR-50 Quản lý thuộc tính CRUD size, màu sắc, thương hiệu. Trung bình
   3.7. Module: Quản trị - Đơn hàng & Khách hàng (Admin - Order & User)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-51 Xem danh sách đơn hàng Hiển thị tất cả đơn hàng, lọc theo trạng thái. Cao
   FR-52 Cập nhật trạng thái đơn hàng Cập nhật các trạng thái: Chờ xử lý → Đã xác nhận → Đang giao → Đã giao / Hủy. Cao
   FR-53 Xem chi tiết đơn hàng Xem thông tin đơn hàng, sản phẩm, thông tin khách hàng. Cao
   FR-54 Xem danh sách khách hàng Hiển thị danh sách người dùng, tìm kiếm theo tên/email. Trung bình
   FR-55 Khóa/Mở tài khoản Admin có thể khóa tài khoản khách hàng (không thể đăng nhập). Trung bình
   3.8. Module: Quản trị - Mã giảm giá & Thống kê (Admin - Coupon & Statistics)
   ID Tên yêu cầu Mô tả Ưu tiên
   FR-56 Tạo mã giảm giá Tạo coupon với các trường: mã code, % giảm, tối đa số lần sử dụng, hạn dùng. Cao
   FR-57 Sửa/Xóa mã giảm giá Cập nhật hoặc xóa coupon. Cao
   FR-58 Xem danh sách mã giảm giá Hiển thị danh sách coupon, lọc theo còn hạn/hết hạn. Trung bình
   FR-59 Thống kê doanh thu Biểu đồ doanh thu theo tuần/tháng. Cao
   FR-60 Top sản phẩm bán chạy Hiển thị sản phẩm có số lượng bán nhiều nhất. Cao
   FR-61 Thống kê tổng quan Hiển thị số đơn hàng, tổng doanh thu, số khách hàng, số sản phẩm. Cao
4. Yêu cầu phi chức năng (Non-functional Requirements)
   ID Loại Mô tả Tiêu chí đánh giá
   NFR-01 Hiệu năng Thời gian tải trang danh sách sản phẩm < 2 giây (với 50 sản phẩm). Đo bằng Chrome DevTools
   NFR-02 Hiệu năng API response time < 500ms cho 95% request. Đo bằng Postman/Load test
   NFR-03 Bảo mật Mật khẩu được mã hóa bằng bcrypt (cost factor ≥ 10). Kiểm tra database
   NFR-04 Bảo mật Chống injection (SQL/NoSQL injection) bằng validate input, sanitize và query an toàn. Kiểm tra code review
   NFR-05 Bảo mật Chống XSS (escape output, CSP headers). Kiểm tra bằng công cụ
   NFR-06 Bảo mật Chống CSRF (dùng token hoặc SameSite cookies). Kiểm tra cấu hình
   NFR-07 Bảo mật Thiết lập vòng đời token hợp lý (access token ngắn hạn, refresh token có thời hạn và có thể thu hồi). Kiểm tra logic
   NFR-08 Khả dụng Hệ thống có thể xử lý đồng thời 50 người dùng. Kiểm tra bằng k6 hoặc tương tự
   NFR-09 Khả năng mở rộng Kiến trúc cho phép thêm module mới (ví dụ: chat, voucher nâng cao). Đánh giá code architecture
   NFR-10 Responsive Giao diện hoạt động tốt trên desktop (1920x1080), tablet (768x1024), mobile (375x667). Kiểm tra bằng DevTools
   NFR-11 UX Form validation hiển thị lỗi rõ ràng, toast/modal thông báo thân thiện. Đánh giá trải nghiệm
   NFR-12 Bảo trì Code có cấu trúc rõ ràng, comment, README hướng dẫn cài đặt. Code review
   NFR-13 Tương thích Hỗ trợ Chrome, Firefox, Safari, Edge phiên bản mới nhất (2 phiên bản gần nhất). Kiểm tra thủ công
5. Thiết kế API (API Endpoints)
   Dự kiến, sẽ chi tiết hóa trong quá trình phát triển

5.1. Xác thực (Auth)
Method Endpoint Mô tả Auth
POST /api/auth/register Đăng ký tài khoản No
POST /api/auth/login Đăng nhập, trả về access token + set refresh token HttpOnly cookie No
POST /api/auth/logout Đăng xuất Yes
POST /api/auth/forgot-password Gửi link reset No
POST /api/auth/reset-password Đặt lại mật khẩu No (token)
5.2. Người dùng (User)
Method Endpoint Mô tả Auth
GET /api/users/me Lấy thông tin cá nhân Yes
PUT /api/users/me Cập nhật thông tin Yes
GET /api/users/me/orders Lấy lịch sử đơn hàng Yes
GET /api/users/me/addresses Lấy danh sách địa chỉ Yes
POST /api/users/me/addresses Thêm địa chỉ mới Yes
PUT /api/users/me/addresses/:id Cập nhật địa chỉ Yes
DELETE /api/users/me/addresses/:id Xóa địa chỉ Yes
5.3. Sản phẩm (Product)
Method Endpoint Mô tả Auth
GET /api/products Lấy danh sách sản phẩm (có phân trang, lọc, sắp xếp) No
GET /api/products/:id Lấy chi tiết sản phẩm No
GET /api/products/categories Lấy danh sách danh mục No
GET /api/products/search?q= Tìm kiếm sản phẩm No
POST /api/admin/products Thêm sản phẩm (admin) Admin
PUT /api/admin/products/:id Sửa sản phẩm (admin) Admin
DELETE /api/admin/products/:id Xóa sản phẩm (admin) Admin
5.4. Giỏ hàng (Cart)
Method Endpoint Mô tả Auth
GET /api/cart Lấy giỏ hàng Yes (hoặc session)
POST /api/cart/items Thêm sản phẩm vào giỏ Yes
PUT /api/cart/items/:id Cập nhật số lượng Yes
DELETE /api/cart/items/:id Xóa sản phẩm khỏi giỏ Yes
DELETE /api/cart Xóa toàn bộ giỏ Yes
POST /api/cart/apply-coupon Áp dụng mã giảm giá Yes
5.5. Đơn hàng (Order)
Method Endpoint Mô tả Auth
POST /api/orders Tạo đơn hàng mới Yes
GET /api/orders Lấy danh sách đơn hàng (admin: tất cả, user: của mình) Yes
GET /api/orders/:id Lấy chi tiết đơn hàng Yes
PUT /api/orders/:id/status Cập nhật trạng thái (admin) Admin
5.6. Mã giảm giá (Coupon) – Admin
Method Endpoint Mô tả Auth
GET /api/admin/coupons Lấy danh sách mã giảm giá Admin
POST /api/admin/coupons Tạo mã giảm giá Admin
PUT /api/admin/coupons/:id Sửa mã giảm giá Admin
DELETE /api/admin/coupons/:id Xóa mã giảm giá Admin
5.7. Thống kê (Statistics) – Admin
Method Endpoint Mô tả Auth
GET /api/admin/stats/dashboard Thống kê tổng quan Admin
GET /api/admin/stats/revenue Doanh thu theo tuần/tháng Admin
GET /api/admin/stats/top-products Top sản phẩm bán chạy Admin

6. Thiết kế cơ sở dữ liệu (Database Schema)
   Thiết kế theo MongoDB collections, có thể chuyển đổi sang SQL khi cần.

6.1. Collection users

- \_id: ObjectId
- username: String, unique, required
- email: String, unique, required
- hashedPassword: String, required
- displayName: String, required
- role: String enum('customer','admin'), default 'customer'
- isActive: Boolean, default true
- phone: String, optional
- avatarUrl: String, optional
- createdAt, updatedAt: Date

  6.2. Collection addresses

- \_id: ObjectId
- userId: ObjectId (ref users), required
- fullName: String, required
- phone: String, required
- province: String, required
- district: String, required
- ward: String, required
- detail: String, required
- isDefault: Boolean, default false
- createdAt, updatedAt: Date

  6.3. Collection categories

- \_id: ObjectId
- name: String, required
- slug: String, unique, required
- parentId: ObjectId, optional (self-reference)
- createdAt, updatedAt: Date

  6.4. Collection products

- \_id: ObjectId
- name: String, required
- slug: String, unique, required
- description: String
- price: Number, required
- stock: Number, default 0
- sku: String, unique
- categoryId: ObjectId (ref categories)
- brand: String
- isActive: Boolean, default true
- images: [{ imageUrl, isPrimary, sortOrder }]
- variants: [{ size, color, stock, sku }]
- createdAt, updatedAt: Date

  6.5. Collection orders

- \_id: ObjectId
- orderNumber: String, unique, required
- userId: ObjectId (ref users), nullable cho guest
- status: String enum('pending','confirmed','shipping','delivered','cancelled')
- items: [{ productId, productName, productPrice, quantity, size, color }]
- totalAmount: Number, required
- shippingFee: Number, default 0
- discountAmount: Number, default 0
- finalAmount: Number, required
- paymentMethod: String enum('COD','VNPAY','MOMO')
- shippingAddress: { receiverName, receiverPhone, receiverEmail, province, district, ward, detail }
- couponCode: String, optional
- createdAt, updatedAt: Date

  6.6. Collection coupons

- \_id: ObjectId
- code: String, unique, required
- discountPercent: Number (0-100)
- maxUses: Number
- usedCount: Number, default 0
- expiresAt: Date, required
- isActive: Boolean, default true
- createdAt, updatedAt: Date

  6.7. Collection reviews

- \_id: ObjectId
- productId: ObjectId (ref products), required
- userId: ObjectId (ref users), required
- rating: Number (1..5), required
- comment: String
- createdAt, updatedAt: Date

  6.8. Collection wishlists

- \_id: ObjectId
- userId: ObjectId (ref users), required
- productId: ObjectId (ref products), required
- createdAt: Date
- unique compound index: { userId: 1, productId: 1 }

  6.9. Collection sessions

- \_id: ObjectId
- userId: ObjectId (ref users), required
- refreshToken: String, unique, required
- expiresAt: Date, required
- createdAt, updatedAt: Date

7. Kiến trúc hệ thống (System Architecture)
   7.1. Tổng quan
   text
   ┌─────────────────────────────────────────────────────────────┐
   │ CLIENT (Browser) │
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │ React SPA (TailwindCSS + Zustand) │ │
   │ │ - Customer Site │ - Admin Dashboard │ │
   │ └─────────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────────────┘
   │
   │ HTTPS / REST API
   ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ BACKEND SERVER (Node.js) │
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │ Express.js + JWT Auth │ │
   │ │ ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │ │
   │ │ │ Product │ │ Order │ │ Auth Middleware │ │ │
   │ │ │ Service │ │ Service │ │ │ │ │
   │ │ └──────────┘ └──────────┘ └──────────────────┘ │ │
   │ └─────────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────────────┘
   │
   │ MongoDB/Mongoose ODM
   ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ DATABASE (MongoDB) │
   │ ┌─────────────────────────────────────────────────────┐ │
   │ │ users │ products │ orders │ coupons │ reviews ... │ │
   │ └─────────────────────────────────────────────────────┘ │
   └─────────────────────────────────────────────────────────────┘
   7.2. Công nghệ đề xuất
   Tầng Công nghệ Lý do chọn
   Frontend React 19 + Vite Hiệu năng cao, ecosystem phong phú, dễ học
   State Management Zustand Nhẹ, đơn giản hơn Redux, đủ cho nhu cầu
   UI Library TailwindCSS + Radix UI Linh hoạt, component sẵn có, responsive
   HTTP Client Axios Dễ dùng, hỗ trợ interceptor cho token
   Form Handling React Hook Form + Zod Performance tốt, validation mạnh
   Backend Node.js + Express JavaScript xuyên suốt, non-blocking I/O, nhiều thư viện
   Database MongoDB Mô hình document linh hoạt, phù hợp phát triển nhanh và dữ liệu biến thể sản phẩm
   ODM Mongoose Dễ định nghĩa schema, validate dữ liệu và quản lý quan hệ tham chiếu
   Authentication JWT + bcrypt Phổ biến, stateless, dễ scale
   Email Nodemailer + Mailtrap Gửi email xác nhận (mô phỏng)
   File Upload Multer + local storage Đơn giản, không cần cloud
   7.3. Cấu trúc thư mục dự kiến
   text
   fashion-ecommerce/
   ├── frontend/
   │ ├── public/
   │ ├── src/
   │ │ ├── components/
   │ │ │ ├── ui/ # Button, Input, Modal...
   │ │ │ ├── layout/ # Header, Footer, Sidebar
   │ │ │ └── forms/ # LoginForm, RegisterForm...
   │ │ ├── pages/
   │ │ │ ├── Home/
   │ │ │ ├── Products/
   │ │ │ ├── ProductDetail/
   │ │ │ ├── Cart/
   │ │ │ ├── Checkout/
   │ │ │ ├── Account/
   │ │ │ └── Admin/
   │ │ ├── hooks/
   │ │ ├── services/ # API calls (axios)
   │ │ ├── stores/ # Zustand stores
   │ │ ├── utils/
   │ │ ├── App.jsx
   │ │ └── main.jsx
   │ ├── package.json
   │ └── vite.config.js
   │
   ├── backend/
   │ ├── src/
   │ │ ├── controllers/
   │ │ ├── middleware/ # auth, validation, errorHandler
   │ │ ├── models/ # Mongoose models
   │ │ ├── routes/
   │ │ ├── services/ # business logic
   │ │ ├── utils/
   │ │ ├── config/ # env, db connection
   │ │ └── app.js
   │ ├── libs/ # db.js, kết nối MongoDB
   │ ├── package.json
   │ └── .env.example
   │
   ├── docs/
   │ ├── SRS.md # Tài liệu này
   │ ├── ERD.png
   │ └── API.md
   │
   └── README.md

8. Yêu cầu về giao diện (External Interface Requirements)
   8.1. Giao diện người dùng (UI)
   Màn hình Yêu cầu tối thiểu
   Trang chủ Banner slider, danh mục, sản phẩm nổi bật, tìm kiếm
   Danh sách sản phẩm Grid layout, bộ lọc (sidebar hoặc dropdown), phân trang
   Chi tiết sản phẩm Thư viện ảnh (zoom cơ bản), chọn size/màu, số lượng, nút thêm giỏ
   Giỏ hàng Bảng sản phẩm, cập nhật số lượng, áp mã giảm giá
   Checkout Form 2-3 bước, xác nhận đơn hàng
   Tài khoản Tabs: Profile, Địa chỉ, Lịch sử đơn hàng, Đổi mật khẩu
   Admin Dashboard Sidebar menu, bảng dữ liệu có CRUD, form nhập liệu, biểu đồ thống kê
   8.2. Màu sắc gợi ý
   Primary (Nền sáng): Warm gray #F9F6F5, surface #F3F0EF

Secondary (Chữ): #2F2F2E (text chính), #5C5B5B (text phụ)

Accent (CTA/Link/Trạng thái): Electric blue #004BE3 và gradient #004BE3 -> #819BFF

Lưu ý nhận diện: Hạn chế accent đỏ/cam ở các màn Auth và các màn cần đồng bộ branding mới.

Font chữ: Inter, Outfit hoặc sans-serif hiện đại theo phong cách tối giản/premium.

8.3. Thông báo (Toast/Modal)
Thêm vào giỏ thành công → Toast xanh ở góc phải

Lỗi validation → Hiển thị dưới form field

Xóa sản phẩm → Modal xác nhận

Thanh toán thành công → Modal hoặc redirect kèm thông báo

9. Ma trận theo dõi yêu cầu (Requirements Traceability Matrix)
   Yêu cầu Module API Endpoint Database Table UI Screen
   FR-01 Auth POST /api/auth/register users Register form
   FR-02 Auth POST /api/auth/login users Login form
   FR-10-18 Product GET /api/products products Product list
   FR-24-32 Cart GET/POST/DELETE /api/cart cart (session/local) Cart page
   FR-33-38 Order POST /api/orders orders, order_items Checkout
   FR-43-46 Admin POST/PUT/DELETE /api/admin/products products Admin product page
   FR-51-53 Admin PUT /api/admin/orders/:id/status orders Admin order page
   FR-59-61 Admin GET /api/admin/stats/\* orders, products Admin dashboard
10. Hướng dẫn kiểm thử cơ bản (Testing Guide)
    10.1. Test Case mẫu

TC-01: Đăng ký thành công

- Steps:

1. Vào trang đăng ký.
2. Nhập email chưa tồn tại, mật khẩu > 6 ký tự.
3. Submit.

- Expected Result: Hiển thị thông báo thành công, chuyển hướng về login hoặc tự động đăng nhập.

TC-02: Đăng nhập sai mật khẩu

- Steps:

1. Vào trang login.
2. Nhập email đúng, mật khẩu sai.
3. Submit.

- Expected Result: Hiển thị lỗi "Email hoặc mật khẩu không đúng".

TC-03: Lọc sản phẩm theo giá

- Steps:

1. Vào trang sản phẩm.
2. Chọn khoảng giá "200k-500k".
3. Apply.

- Expected Result: Chỉ hiển thị sản phẩm có giá trong khoảng.

TC-04: Áp mã giảm giá

- Steps:

1. Thêm sản phẩm vào giỏ.
2. Nhập mã "SALE10" (giảm 10%).
3. Apply.

- Expected Result: Tổng tiền giảm 10%.

TC-05: Admin tạo sản phẩm

- Steps:

1. Đăng nhập admin.
2. Vào Quản lý sản phẩm > Thêm mới.
3. Điền đủ thông tin, upload ảnh.
4. Submit.

- Expected Result: Sản phẩm xuất hiện trong danh sách admin và ở trang user.

11. Hạn chế & Hướng phát triển
    11.1. Hạn chế của phiên bản hiện tại

- Thanh toán chưa tích hợp thực tế (chỉ giả lập hoặc COD).
- Chưa có hệ thống chat hỗ trợ khách hàng.
- Chưa có tính năng so sánh sản phẩm.
- Chưa có recommendation engine nâng cao (chỉ gợi ý cơ bản).
- Chưa có hệ thống quản lý kho hàng (warehouse management).

  11.2. Hướng phát triển trong tương lai

- Tích hợp thanh toán thật qua VNPAY, Momo, Stripe.
- Xây dựng ứng dụng mobile (React Native).
- Thêm chat real-time (Socket.io) hỗ trợ khách hàng.
- Tối ưu SEO cho sản phẩm.
- Thêm đánh giá có ảnh/video.
- Tích hợp AI gợi ý sản phẩm dựa trên hành vi người dùng.
- Hệ thống loyalty (tích điểm, quà tặng).

12. Phụ lục
    12.1. Bảng phân công công việc dự kiến (cho nhóm tối đa 3 người)

- Member 1: Backend API, Database, Authentication, Admin Dashboard
- Member 2: Frontend Customer Site, UI/UX, Responsive
- Member 3: Frontend Admin, Tích hợp API, Báo cáo + Video demo

  12.2. Mốc thời gian dự kiến (3 tuần)

- Tuần 1: Thiết lập dự án, database schema, API cơ bản (auth, products)
- Tuần 2: Hoàn thiện frontend (customer site), tích hợp API, giỏ hàng, thanh toán
- Tuần 3: Hoàn thiện admin dashboard, thống kê, kiểm thử, viết báo cáo, quay video
