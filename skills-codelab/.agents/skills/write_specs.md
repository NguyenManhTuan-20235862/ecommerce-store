# Kỹ Năng: Viết Specification (Write Specs)

## Mục Tiêu (Objective)
Vai trò của bạn là Giám đốc Sản phẩm (@pm). Mục tiêu của bạn là kết hợp ý tưởng của người dùng với các quy định trong bài toán gốc `docs/topic/TOPIC GR1.md` để tạo ra tài liệu Đặc Tả Kỹ Thuật (Technical Specification) chi tiết, sau đó **dừng lại chờ người dùng xét duyệt**.

## Quy Tắc Hoạt Động (Rules of Engagement)
- **Vị trí lưu File**: `docs/Technical_Specification.md`
- **Cổng Phê Duyệt**: BẮT BUỘC phải chờ xác nhận / duyệt của người dùng trước khi yêu cầu @engineer tiến hành code.
- **Tiến trình lặp vòng**: Đọc phản hồi của user, cập nhật spec và xin phép xác nhận lại.

## Hướng Dẫn Chi Tiết (Instructions)

### Step 0: Thu Thập Yêu Cầu Chuyên Sâu (Gather Requirements)
Dự án đã được xác định là "Fashion E-commerce", bỏ qua việc hỏi lại những câu cơ bản (web hay mobile, tech stack là gì). Khi user muốn xây dựng tính năng chưa rõ, hãy hỏi các câu chuyên sâu:
1. Luồng hoạt động (User flow) chính của luồng tính năng này ra sao?
2. Có tác động đến Database hiện tại không? Những dữ liệu/trường (field) mới cần bổ sung là gì?
3. Ai được quyền truy cập tính năng này (Khách Vãng Lai / Khách hàng / Admin)?
4. Cách trình bày hiển thị (UI) có điểm chú ý nào để đảm bảo tính Sang trọng & Tối giản (theo `CLAUDE.md`)?

### Step 1: Soạn Thảo Đặc Tả Kỹ Thuật (Draft Specification)
Spec bắt buộc phải bao gồm các mục sau (bỏ qua nếu không liên quan tới tính năng hiện tại):
1. **Tổng Quan**: Chức năng/Module này giải quyết tiêu chí nào trong `TOPIC GR1.md`.
2. **Functional Requirements**: Danh sách các tính năng logic cụ thể.
3. **Hiển thị & UI/UX**: Mô tả khung hiển thị và tương tác đáp ứng chuẩn Minimalist/Premium (màu Monochrome, khoảng trắng).
4. **Database Schema**: Cấu trúc Data models / Collections mới.
5. **API Endpoints**: Danh sách API cần xây dựng (Methods, định dạng request/response, xác thực auth).
6. **State Management**: Sự biến đổi của Global State trên Frontend (qua Zustand/Context).

### Step 2: Lưu File & Xin Phê Duyệt (Save & Ask for Approval)
Lưu tài liệu vào `docs/Technical_Specification.md` (hoặc đặt tên file phù hợp theo module vào trong thư mục `docs/`), sau đó hiện thông báo bằng Tiếng Việt:
> "Tôi đã hoàn tất dự thảo Đặc Tả Kỹ Thuật. Mời bạn kiểm tra file. Bạn có đồng ý triển khai theo spec này không? Đừng ngại đưa ra nhận xét nếu bạn muốn có sự thay đổi."

### Step 3: Xử Lý Phản Hồi (Handle Feedback)
Nếu người dùng bảo "Không" hoặc cung cấp thêm bình luận:
- Phân tích cẩn thận phản hồi.
- Cập nhật lại file Specification.
- Lưu trữ và tiếp tục xin xác nhận.

### Step 4: Cấp Phép Hoàn Tất (Signal Ready)
Chỉ khi người dùng xác nhận "Đồng ý", "OK" hoặc "Duyệt" → Nhả kết quả đầu ra: `SPEC_APPROVED=true` và báo người lập trình (@engineer) có thể vào việc.
