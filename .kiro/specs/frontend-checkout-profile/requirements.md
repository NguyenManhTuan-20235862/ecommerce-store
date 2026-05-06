# Requirements Document — Frontend Checkout & Profile

## Introduction

Tính năng này xây dựng giao diện frontend cho hai phần chính của hệ thống Vibe Urban e-commerce:

1. **Checkout Flow**: Quy trình thanh toán từ giỏ hàng đến xác nhận đơn hàng thành công
2. **Profile Pages**: Trang quản lý tài khoản cá nhân bao gồm lịch sử đơn hàng và đổi mật khẩu

Tính năng này kết nối với backend Order API đã hoàn thành (POST /api/orders, GET /api/orders, GET /api/orders/:id, POST /api/orders/:id/cancel, PUT /api/users/me) để cung cấp trải nghiệm mua sắm hoàn chỉnh cho khách hàng.

## Glossary

- **Checkout_Form**: Component form thu thập thông tin giao hàng (họ tên, SĐT, địa chỉ, ghi chú)
- **Order_Summary**: Component hiển thị tóm tắt đơn hàng (items, subtotal, shipping, total)
- **Order_History_Page**: Trang hiển thị danh sách đơn hàng của user
- **Order_Detail_View**: View chi tiết một đơn hàng cụ thể
- **Change_Password_Form**: Form đổi mật khẩu với validation
- **Order_Service**: Service layer xử lý HTTP calls liên quan đến orders
- **User_Service**: Service layer xử lý HTTP calls liên quan đến user profile
- **Cart_Store**: Zustand store quản lý giỏ hàng
- **Auth_Store**: Zustand store quản lý authentication state
- **Validation_Schema**: Zod schema định nghĩa rules validation cho form
- **Success_Page**: Trang xác nhận đơn hàng thành công sau khi checkout
- **Error_State**: Trạng thái hiển thị lỗi (hết hàng, validation, server error)
- **Loading_State**: Trạng thái hiển thị loading indicator khi đang xử lý

## Requirements

### Requirement 1: Checkout Form — Thu thập thông tin giao hàng

**User Story:** Là khách hàng, tôi muốn nhập thông tin giao hàng trong form checkout, để đơn hàng được giao đến đúng địa chỉ.

#### Acceptance Criteria

1. THE Checkout_Form SHALL hiển thị các trường: họ tên (fullName), số điện thoại (phone), địa chỉ (address), ghi chú (notes - optional)
2. WHEN user nhập dữ liệu vào form, THE Checkout_Form SHALL validate real-time theo Validation_Schema (họ tên >= 2 ký tự, SĐT đúng format Việt Nam, địa chỉ >= 10 ký tự)
3. WHEN validation thất bại, THE Checkout_Form SHALL hiển thị error message màu đỏ dưới field tương ứng
4. THE Checkout_Form SHALL sử dụng React Hook Form + Zod nhất quán với pattern hiện có trong Auth pages
5. THE Checkout_Form SHALL responsive trên mobile, tablet, desktop theo Tailwind breakpoints

### Requirement 2: Order Summary — Hiển thị tóm tắt đơn hàng

**User Story:** Là khách hàng, tôi muốn xem tóm tắt đơn hàng trước khi đặt, để kiểm tra lại items và tổng tiền.

#### Acceptance Criteria

1. THE Order_Summary SHALL hiển thị danh sách items từ Cart_Store (tên sản phẩm, variant, số lượng, giá)
2. THE Order_Summary SHALL tính và hiển thị subtotal (tổng giá items), shipping fee (phí vận chuyển cố định hoặc 0), total (tổng cộng)
3. WHEN Cart_Store thay đổi, THE Order_Summary SHALL tự động cập nhật hiển thị
4. THE Order_Summary SHALL format giá tiền theo VNĐ sử dụng `formatCurrency` từ utils
5. THE Order_Summary SHALL hiển thị thumbnail ảnh sản phẩm cho mỗi item

### Requirement 3: Checkout Submission — Gửi đơn hàng

**User Story:** Là khách hàng, tôi muốn nhấn nút "Đặt hàng" để hoàn tất checkout, và được chuyển đến trang xác nhận.

#### Acceptance Criteria

1. WHEN user nhấn nút "Đặt hàng", THE Checkout_Form SHALL validate toàn bộ form trước khi submit
2. WHEN validation pass, THE Checkout_Form SHALL gọi Order_Service.createOrder với payload {shippingAddress, paymentMethod, couponCode} (Backend tự lấy items từ Cart trong DB để chống gian lận)
3. WHEN API trả về success (201), THE Checkout_Form SHALL gọi Cart_Store.fetchCart() để đồng bộ giỏ hàng rỗng từ server và redirect user đến Success_Page với orderNumber
4. WHEN API trả về error (400/500), THE Checkout_Form SHALL hiển thị Error_State với message từ server
5. WHILE đang gọi API, THE Checkout_Form SHALL hiển thị Loading_State và disable nút "Đặt hàng"

### Requirement 4: Success Page — Xác nhận đơn hàng thành công

**User Story:** Là khách hàng, tôi muốn thấy trang xác nhận sau khi đặt hàng thành công, để biết đơn hàng đã được tiếp nhận.

#### Acceptance Criteria

1. THE Success_Page SHALL hiển thị message "Đặt hàng thành công" với icon checkmark màu xanh
2. THE Success_Page SHALL hiển thị orderNumber (mã đơn hàng) nhận từ URL params
3. THE Success_Page SHALL cung cấp nút "Xem đơn hàng" link đến Order_Detail_View
4. THE Success_Page SHALL cung cấp nút "Tiếp tục mua sắm" link về trang Home
5. THE Success_Page SHALL responsive và bám sát bảng màu warm gray + blue accent

### Requirement 5: Order History Page — Danh sách đơn hàng

**User Story:** Là khách hàng, tôi muốn xem lịch sử đơn hàng của mình, để theo dõi trạng thái và chi tiết các đơn đã đặt.

#### Acceptance Criteria

1. WHEN Order_History_Page mount, THE Order_History_Page SHALL gọi Order_Service.getUserOrders để lấy danh sách orders
2. THE Order_History_Page SHALL hiển thị danh sách orders dạng table hoặc card list (orderNumber, ngày đặt, trạng thái, tổng tiền)
3. WHEN danh sách rỗng, THE Order_History_Page SHALL hiển thị empty state "Bạn chưa có đơn hàng nào"
4. WHEN user click vào một order, THE Order_History_Page SHALL navigate đến Order_Detail_View với orderId
5. THE Order_History_Page SHALL hiển thị badge màu sắc khác nhau cho từng trạng thái (pending: vàng, confirmed: xanh, cancelled: đỏ, delivered: xanh đậm)

### Requirement 6: Order Detail View — Chi tiết đơn hàng

**User Story:** Là khách hàng, tôi muốn xem chi tiết một đơn hàng cụ thể, để kiểm tra thông tin giao hàng và items đã đặt.

#### Acceptance Criteria

1. WHEN Order_Detail_View mount, THE Order_Detail_View SHALL gọi Order_Service.getOrderById với orderId từ URL params
2. THE Order_Detail_View SHALL hiển thị orderNumber, ngày đặt, trạng thái, thông tin giao hàng (fullName, phone, address)
3. THE Order_Detail_View SHALL hiển thị danh sách items (tên, variant, số lượng, giá, thumbnail)
4. THE Order_Detail_View SHALL hiển thị subtotal, shipping, total với format VNĐ
5. WHEN trạng thái là "pending", THE Order_Detail_View SHALL hiển thị nút "Hủy đơn hàng" gọi Order_Service.cancelOrder
6. WHEN hủy đơn thành công, THE Order_Detail_View SHALL cập nhật trạng thái hiển thị thành "cancelled" và disable nút hủy

### Requirement 7: Change Password Form — Đổi mật khẩu (⚠️ BLOCKED)

**User Story:** Là khách hàng, tôi muốn đổi mật khẩu tài khoản, để bảo mật thông tin cá nhân.

**⚠️ BLOCKER:** Backend API `PUT /api/users/me/password` chưa tồn tại. Requirement này bị BLOCKED cho đến khi backend API được tạo.

#### Acceptance Criteria

1. THE Change_Password_Form SHALL hiển thị 3 trường: current password, new password, confirm password
2. THE Change_Password_Form SHALL validate new password >= 8 ký tự, có chữ hoa, chữ thường, số
3. THE Change_Password_Form SHALL validate confirm password khớp với new password
4. WHEN user submit form, THE Change_Password_Form SHALL gọi User_Service.updatePassword với {currentPassword, newPassword}
5. WHEN API trả về success, THE Change_Password_Form SHALL hiển thị toast "Đổi mật khẩu thành công" và reset form
6. WHEN API trả về error (401: sai mật khẩu cũ), THE Change_Password_Form SHALL hiển thị error message dưới trường current password
7. THE Change_Password_Form SHALL sử dụng React Hook Form + Zod nhất quán với pattern hiện có

### Requirement 8: Service Layer — Order Service

**User Story:** Là developer, tôi muốn có Order_Service tập trung các HTTP calls liên quan đến orders, để component không gọi axios trực tiếp.

#### Acceptance Criteria

1. THE Order_Service SHALL export function createOrder(orderData) gọi POST /api/orders với payload {shippingAddress, paymentMethod, couponCode}
2. THE Order_Service SHALL export function getUserOrders() gọi GET /api/orders/me (endpoint dành cho customer)
3. THE Order_Service SHALL export function getOrderById(orderId) gọi GET /api/orders/:id
4. THE Order_Service SHALL export function cancelOrder(orderId) gọi PUT /api/orders/:id/cancel (method PUT, không phải POST)
5. THE Order_Service SHALL sử dụng axios instance từ lib/axios.js với interceptor xử lý token
6. THE Order_Service SHALL throw error với message rõ ràng khi API call thất bại

### Requirement 9: Service Layer — User Service

**User Story:** Là developer, tôi muốn có User_Service xử lý các HTTP calls liên quan đến user profile, để tách biệt logic API khỏi component.

#### Acceptance Criteria

1. THE User_Service SHALL export function updatePassword(passwordData) gọi PUT /api/users/me/password với payload {currentPassword, newPassword} (⚠️ BLOCKER: API này chưa tồn tại ở backend, cần tạo trước)
2. THE User_Service SHALL export function getUserProfile() gọi GET /api/users/me
3. THE User_Service SHALL sử dụng axios instance từ lib/axios.js với interceptor xử lý token
4. THE User_Service SHALL throw error với message rõ ràng khi API call thất bại

### Requirement 10: Error Handling — Xử lý lỗi toàn diện

**User Story:** Là khách hàng, tôi muốn thấy thông báo lỗi rõ ràng khi có vấn đề, để biết cách khắc phục.

#### Acceptance Criteria

1. WHEN API trả về 400 (validation error), THE Error_State SHALL hiển thị message cụ thể từ response.data.message
2. WHEN API trả về 401 (unauthorized), THE Error_State SHALL redirect user đến trang Login
3. WHEN API trả về 404 (order not found), THE Error_State SHALL hiển thị "Không tìm thấy đơn hàng"
4. WHEN API trả về 500 (server error), THE Error_State SHALL hiển thị "Lỗi hệ thống, vui lòng thử lại sau"
5. WHEN network error (không kết nối được server), THE Error_State SHALL hiển thị "Không thể kết nối đến server"
6. THE Error_State SHALL sử dụng toast notification (Sonner) cho error tạm thời và inline error cho form validation

### Requirement 11: Loading States — Trạng thái loading

**User Story:** Là khách hàng, tôi muốn thấy loading indicator khi hệ thống đang xử lý, để biết request đang được thực hiện.

#### Acceptance Criteria

1. WHILE đang gọi API, THE Loading_State SHALL hiển thị spinner hoặc skeleton loader
2. WHILE đang submit Checkout_Form, THE Loading_State SHALL disable nút "Đặt hàng" và hiển thị text "Đang xử lý..."
3. WHILE đang load Order_History_Page, THE Loading_State SHALL hiển thị skeleton cards cho danh sách orders
4. WHILE đang load Order_Detail_View, THE Loading_State SHALL hiển thị skeleton layout cho chi tiết đơn hàng
5. THE Loading_State SHALL sử dụng Tailwind animation (animate-pulse, animate-spin) nhất quán với UI design

### Requirement 12: Responsive Design — Tương thích đa thiết bị

**User Story:** Là khách hàng, tôi muốn sử dụng checkout và profile trên mọi thiết bị, để mua sắm thuận tiện.

#### Acceptance Criteria

1. THE Checkout_Form SHALL responsive: mobile (1 cột), tablet (1 cột), desktop (2 cột: form bên trái, summary bên phải)
2. THE Order_History_Page SHALL responsive: mobile (card list), desktop (table layout)
3. THE Order_Detail_View SHALL responsive: mobile (stack vertical), desktop (2 cột: info bên trái, items bên phải)
4. THE Change_Password_Form SHALL responsive: mobile (full width), desktop (max-width 500px centered)
5. THE Success_Page SHALL responsive và centered trên mọi breakpoint

### Requirement 13: UI Design Compliance — Bám sát bảng màu

**User Story:** Là designer, tôi muốn checkout và profile pages bám sát design system, để đảm bảo tính nhất quán UI.

#### Acceptance Criteria

1. THE Checkout_Form SHALL sử dụng màu nền #F9F6F5, chữ #2F2F2E, accent #004BE3 cho CTA
2. THE Order_Summary SHALL sử dụng nền #F3F0EF cho card tóm tắt
3. THE Order_History_Page SHALL sử dụng badge màu: pending (yellow-500), confirmed (blue-500), cancelled (red-500), delivered (green-600)
4. THE Change_Password_Form SHALL sử dụng Input component từ components/ui/Input.jsx
5. THE Success_Page SHALL sử dụng Button component từ components/ui/Button.jsx với variant primary (gradient blue)

### Requirement 14: Cart Integration — Tích hợp giỏ hàng

**User Story:** Là khách hàng, tôi muốn giỏ hàng tự động clear sau khi đặt hàng thành công, để không bị trùng lặp đơn hàng.

#### Acceptance Criteria

1. WHEN checkout thành công, THE Checkout_Form SHALL gọi Cart_Store.fetchCart() để đồng bộ giỏ hàng rỗng từ server về local state (Backend đã tự động clear cart trong DB)
2. WHEN user quay lại trang Cart sau checkout thành công, THE Cart SHALL hiển thị empty state
3. THE Checkout_Form SHALL KHÔNG gửi items trong payload (Backend tự lấy từ Cart trong DB để chống gian lận)
4. WHEN Cart_Store rỗng, THE Checkout_Form SHALL không cho phép truy cập trang checkout và redirect về Cart
5. THE Checkout_Form SHALL hiển thị preview items từ Cart_Store.items chỉ để user xem trước, không gửi lên server

### Requirement 15: Navigation & Routing — Điều hướng

**User Story:** Là khách hàng, tôi muốn điều hướng giữa các trang checkout và profile dễ dàng, để trải nghiệm mượt mà.

#### Acceptance Criteria

1. THE Checkout_Form SHALL accessible tại route /checkout và protected bởi ProtectedRoute
2. THE Order_History_Page SHALL accessible tại route /profile/orders và protected bởi ProtectedRoute
3. THE Order_Detail_View SHALL accessible tại route /profile/orders/:orderId và protected bởi ProtectedRoute
4. THE Change_Password_Form SHALL accessible tại route /profile/change-password và protected bởi ProtectedRoute
5. THE Success_Page SHALL accessible tại route /checkout/success/:orderNumber
6. WHEN user chưa login và truy cập protected route, THE ProtectedRoute SHALL redirect đến /login với returnUrl

## Notes

### Backend APIs Status

**✅ Đã sẵn sàng:**
- `POST /api/orders` — Tạo đơn hàng (payload: {shippingAddress, paymentMethod, couponCode})
- `GET /api/orders/me` — Lấy danh sách đơn hàng của user
- `GET /api/orders/:id` — Chi tiết đơn hàng
- `PUT /api/orders/:id/cancel` — Hủy đơn hàng (method PUT)
- `GET /api/users/me` — Lấy thông tin user

**⚠️ BLOCKER - Chưa tồn tại:**
- `PUT /api/users/me/password` — Đổi mật khẩu (cần tạo backend API trước khi implement Requirement 7)

### Technical Notes

- **Tech stack**: React + Vite, Zustand, React Hook Form + Zod, Tailwind CSS, Axios
- **Patterns hiện có**: Service layer (product.service.js, cartService.js), Zustand stores (authStore, cartStore), Component structure (pages/, components/ui/)
- **Comment code bằng Tiếng Việt** theo quy tắc dự án
- **Shipping fee logic**: Backend tự tính (>= 500k: freeship, < 500k: 30,000 VNĐ)
- **Payment method**: Hiện tại chỉ COD (thanh toán khi nhận hàng), không cần tích hợp payment gateway
- **Cart security**: Backend tự lấy items từ Cart trong DB, frontend không gửi items trong payload để chống gian lận
- **Cart sync**: Backend tự động clear cart sau khi tạo đơn thành công, frontend chỉ cần gọi fetchCart() để đồng bộ
