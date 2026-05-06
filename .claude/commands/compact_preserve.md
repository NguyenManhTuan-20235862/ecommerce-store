# Workflow: Compact & Preserve

## Khi được user đồng ý compact

### Bước 1: Trích xuất thông tin quan trọng

1. **Architecture Authentication**:
   - JWT hay session?
   - Flow login/register/logout?
   - Refresh token strategy?

2. **Database Schema**:
   - Các bảng chính: Account, Member, Employee, PT_Detail...
   - Quan hệ khóa ngoại
   - Các ràng buộc quan trọng

3. **Danh sách file đã tạo**:
   - Liệt kê đầy đủ đường dẫn
   - File nào đã hoàn chỉnh
   - File nào còn dang dở

### Bước 2: Compact

Loại bỏ các chi tiết không cần thiết (lỗi đã sửa, thử nghiệm thất bại, code không còn dùng...)

### Bước 3: Xác nhận

Hiển thị bản tóm tắt đã compact và tiếp tục.
