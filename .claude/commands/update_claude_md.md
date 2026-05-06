# Skill: Update CLAUDE.md

## Trigger

Trước khi kết thúc session (user nói "done", "tạm thời dừng", hoặc thoát).

## Instructions

### Bước 1: Xác định nội dung cần cập nhật

- Những gì đã hoàn thành trong session này
- Trạng thái hiện tại của từng phần
- Bước tiếp theo cần làm
- Quyết định quan trọng đã đưa ra + lý do

### Bước 2: Format theo cấu trúc

```markdown
# Session Update: [YYYY-MM-DD HH:MM]

## ✅ Đã hoàn thành

- [x] Task 1
- [x] Task 2

## 🔄 Trạng thái hiện tại

| Phần     | Trạng thái | Ghi chú                      |
| -------- | ---------- | ---------------------------- |
| Auth     | 80%        | Thiếu refresh token rotation |
| Database | 100%       | Đã tạo xong schema           |
| API      | 50%        | Xong auth endpoints          |

## 📋 Bước tiếp theo

1. Task A
2. Task B

## 💡 Quyết định quan trọng

| Quyết định               | Lý do               |
| ------------------------ | ------------------- |
| Dùng JWT thay vì session | Dễ scale, stateless |

| ...

## 📁 Files đã tạo/modified

- `backend/src/auth/...`
- `frontend/src/pages/...`
```

### Bước 3: Ghi vào file `CLAUDE.md` (hoặc tạo mới nếu chưa có)

### Bước 4: Xác nhận đã cập nhật cho user
