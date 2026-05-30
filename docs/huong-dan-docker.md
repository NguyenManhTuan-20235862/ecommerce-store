# Hướng Dẫn Chạy Dự Án Bằng Docker

## Yêu cầu

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) đã cài và đang chạy
- MongoDB đang chạy trên máy host (localhost:27017)

---

## Lần đầu tiên setup

### Bước 1 — Tạo file `.env.docker`

Copy file mẫu và điền secret:

```powershell
copy backend\.env.docker.example backend\.env.docker
```

Mở `backend\.env.docker` và thay `REPLACE_WITH_YOUR_SECRET_HERE` bằng secret thật:

```powershell
# Tạo secret ngẫu nhiên
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Nội dung file sau khi sửa:

```env
PORT=5000
MONGODB_CONNECTIONSTRING=mongodb://host.docker.internal:27017/ecommerceStore
ACCESS_TOKEN_SECRET=<paste secret vừa tạo vào đây>
CORS_ORIGINS=http://localhost
FRONTEND_URL=http://localhost
```

> **Lưu ý:** `host.docker.internal` là hostname đặc biệt của Docker Desktop, trỏ vào máy host. Backend container dùng địa chỉ này để kết nối MongoDB trên máy thật.

---

### Bước 2 — Cho phép MongoDB nhận kết nối từ Docker

Mặc định MongoDB chỉ lắng nghe `127.0.0.1` (localhost), Docker container không thể kết nối được. Cần đổi `bindIp` sang `0.0.0.0`.

**Mở PowerShell as Administrator** (chuột phải → Run as administrator):

```powershell
# Sửa bindIp trong mongod.cfg
(Get-Content "C:\Program Files\MongoDB\Server\8.3\bin\mongod.cfg") `
  -replace "bindIp: 127.0.0.1", "bindIp: 0.0.0.0" | `
  Set-Content "C:\Program Files\MongoDB\Server\8.3\bin\mongod.cfg"

# Khởi động lại MongoDB
net stop MongoDB
net start MongoDB
```

Kiểm tra MongoDB đã bind đúng:

```powershell
netstat -ano | findstr ":27017"
# Phải thấy: TCP  0.0.0.0:27017  ...  LISTENING
```

> **Làm 1 lần duy nhất.** Sau khi đã sửa, mọi lần khởi động lại máy MongoDB tự dùng config này.

> **Bảo mật:** `bindIp: 0.0.0.0` mở MongoDB ra tất cả network interface trên máy. Chỉ dùng cho môi trường phát triển, không dùng trên máy expose ra internet.

---

## Chạy dự án

```powershell
# Từ thư mục gốc dự án
docker compose up --build
```

- Lần đầu sẽ mất 2–5 phút để build image.
- Các lần sau (không có thay đổi code): `docker compose up` (không cần `--build`).

Truy cập tại: **http://localhost**

---

## Dừng dự án

```powershell
# Dừng và giữ nguyên container
docker compose stop

# Dừng và xóa container (data không mất vì MongoDB trên máy host)
docker compose down
```

---

## Xem log

```powershell
# Xem log realtime tất cả service
docker compose logs -f

# Chỉ xem log backend
docker compose logs -f backend

# Chỉ xem log frontend (nginx)
docker compose logs -f frontend
```

---

## Cấu trúc Docker

| File                          | Mục đích                                                         |
| ----------------------------- | ---------------------------------------------------------------- |
| `docker-compose.yml`          | Định nghĩa 2 service: `backend` và `frontend`                    |
| `backend/Dockerfile`          | Build Node.js image, chạy `node server.js`                       |
| `backend/.env.docker`         | Biến môi trường cho backend khi chạy Docker (không commit)       |
| `backend/.env.docker.example` | Template — commit vào git, không chứa secret                     |
| `frontend/Dockerfile`         | Multi-stage: build React → copy vào Nginx                        |
| `frontend/nginx.conf`         | Nginx config: serve static, proxy `/api/` → backend, SPA routing |

---

## Sơ đồ kết nối

```
Browser (http://localhost)
    │
    ▼
[frontend:80] — Nginx
    ├── /api/*     → proxy → [backend:5000] — Node.js/Express
    ├── /uploads/* → proxy → [backend:5000]
    └── /*         → serve React SPA (index.html)
                            │
                            ▼
                   [MongoDB trên máy host]
                   host.docker.internal:27017
```

---

## Xử lý lỗi thường gặp

### `ECONNREFUSED 192.168.65.254:27017`

MongoDB chưa bind ra `0.0.0.0`. Thực hiện lại **Bước 2** ở trên.

### `Access is denied` khi `net start/stop MongoDB`

Terminal chưa có quyền admin. Mở PowerShell **as Administrator**.

### Port 80 bị chiếm

Đổi port frontend trong `docker-compose.yml`:

```yaml
ports:
  - "8080:80" # truy cập tại http://localhost:8080
```

### Rebuild sau khi thay đổi code

```powershell
docker compose up --build
```

Hoặc rebuild riêng từng service:

```powershell
docker compose build backend
docker compose up
```

### Seed dữ liệu

@(
"adminSeeder",
"productSeeder",
"costPriceMigration",
"colorMigration",
"demoSeeder",
"orderSeeder",
"comboSeeder",
"saleSeeder",
"aboutSeeder",
"lookbookSeeder"
) | ForEach-Object {
Write-Host "`n=== $_ ===" -ForegroundColor Cyan
  docker exec vibe-backend node "seeders/$\_.js"
}.
