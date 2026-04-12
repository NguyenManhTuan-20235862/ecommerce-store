---
description: Khởi động quy trình Phát triển Tự động (Autonomous Pipeline) cho ý tưởng mới
---

Khi người dùng gõ lệnh `/startcycle <ý_tưởng>`, hãy tự động điều phối toàn bộ quy trình phát triển dự án "Fashion E-commerce" theo tuần tự, tuân thủ chặt chẽ vai trò tại `.agents/agents.md` và các kỹ năng tại `.agents/skills/`.

Đồng hành xuyên suốt quy trình là các tiêu chuẩn cốt lõi đã được thống nhất tại `docs/topic/TOPIC GR1.md` (yêu cầu đồ án) và `CLAUDE.md` (quy chuẩn UI/UX và Code). Các AI phải giao tiếp 100% bằng Tiếng Việt.

### Trình Tự Thực Thi (Execution Sequence):

1. Nhập vai **Giám đốc Sản phẩm (@pm)** và thực thi kỹ năng `write_specs.md` dựa trên `<ý_tưởng>`.
   *(BẮT BUỘC DỪNG LẠI và chờ người dùng phê duyệt Spec. Nếu người dùng nhận xét hoặc sửa trực tiếp vào file Markdown, tiếp tục nhập vai @pm để phản hồi và cập nhật lại tài liệu. Lặp lại bước này cho đến khi người dùng chốt "Đồng ý", "Duyệt" hoặc "OK").*
2. Chuyển ngữ cảnh, nhập vai **Lập trình viên (@engineer)**, và thực thi kỹ năng `generate_code.md` trên thư mục dự án dựa theo tài liệu Spec vừa chốt.
3. Chuyển ngữ cảnh, nhập vai **Chuyên viên Kiểm thử (@qa)**, và thực thi kỹ năng `audit_code.md` để rà soát chất lượng file quy đổi, bảo mật (nhất là 10% điểm bảo mật), fix lỗi trực tiếp nếu phát hiện.
4. Chuyển ngữ cảnh, nhập vai **Chuyên gia Triển khai (@devops)**, và thực thi kỹ năng `deploy_app.md` để đảm bảo hệ thống có thể chạy trơn tru (start server) hoặc cung cấp câu lệnh chi tiết để khởi chạy toàn bộ frontend/backend.
