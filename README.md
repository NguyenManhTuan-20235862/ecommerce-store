# Vibe Urban — Men's Fashion E-commerce
### ヴァイブアーバン — メンズファッション ECサイト

Website thương mại điện tử bán quần áo và phụ kiện thời trang Nam giới. Xây dựng theo kiến trúc MERN Stack với giao diện editorial cao cấp lấy cảm hứng từ các thương hiệu thời trang quốc tế.

*男性向けファッションECサイト。MERNスタックで構築し、国際的なファッションブランドにインスパイアされたエディトリアルデザインを採用。*

---

## Mục lục | 目次

- [Tổng quan | 概要](#tổng-quan--概要)
- [Tính năng | 機能](#tính-năng--機能)
- [Công nghệ sử dụng | 使用技術](#công-nghệ-sử-dụng--使用技術)
- [Cấu trúc dự án | プロジェクト構成](#cấu-trúc-dự-án--プロジェクト構成)
- [Cài đặt & Chạy local | セットアップ](#cài-đặt--chạy-local--セットアップ)
- [Chạy với Docker | Docker実行](#chạy-với-docker--docker実行)
- [Biến môi trường | 環境変数](#biến-môi-trường--環境変数)
- [API Overview | API一覧](#api-overview--api一覧)
- [Database Models | データベースモデル](#database-models--データベースモデル)
- [Tài khoản mặc định | デフォルトアカウント](#tài-khoản-mặc-định--デフォルトアカウント)
- [Cấu trúc thư mục chi tiết | ディレクトリ構成](#cấu-trúc-thư-mục-chi-tiết--ディレクトリ構成)

---

## Tổng quan | 概要

**Vibe Urban** là hệ thống e-commerce hoàn chỉnh gồm 2 phần:
***Vibe Urban** は2つのパートで構成された完全なECシステムです。*

- **Customer-facing website** — Landing page, trang Shop, Product Detail, Cart, Checkout, Profile, Wishlist, Lookbook, Sale, About, Support.
  *ランディングページ、商品一覧、商品詳細、カート、決済、プロフィール、ウィッシュリスト、ルックブック、セール、会社紹介、サポート。*

- **Admin Panel** — Dashboard thống kê, quản lý sản phẩm / danh mục / đơn hàng / khách hàng / mã giảm giá / lookbook / chương trình khuyến mãi / nội dung About.
  *統計ダッシュボード、商品・カテゴリ・注文・顧客・クーポン・ルックブック・キャンペーン・コンテンツの管理。*

| Thông tin | Chi tiết | 詳細 |
|-----------|---------|------|
| Backend URL | `http://localhost:5000` | バックエンド |
| Frontend URL | `http://localhost:5173` (dev) · `http://localhost` (Docker) | フロントエンド |
| Database | MongoDB (localhost:27017) | データベース |

---

## Tính năng | 機能

### Khách hàng (Customer) | 顧客向け機能

| Tính năng | Mô tả | 説明（日本語） |
|-----------|-------|--------------|
| **Xác thực** | Đăng ký, đăng nhập, đăng xuất, refresh token (JWT + HttpOnly cookie) | 会員登録・ログイン・ログアウト・トークン更新 |
| **Duyệt sản phẩm** | Tìm kiếm, lọc theo danh mục / giá / màu / size, sắp xếp, cursor-based pagination | 検索・カテゴリ/価格/色/サイズフィルター・ソート・ページネーション |
| **Chi tiết sản phẩm** | Gallery ảnh, chọn variant (size/màu), số lượng tồn kho, đánh giá/nhận xét | 画像ギャラリー・バリアント選択・在庫数・レビュー表示 |
| **Giỏ hàng** | Thêm/xóa/cập nhật số lượng, đồng bộ server | 商品の追加・削除・数量変更・サーバー同期 |
| **Thanh toán** | Checkout nhiều bước, chọn địa chỉ giao hàng, áp mã giảm giá, xác nhận đơn | マルチステップ決済・配送先選択・クーポン適用・注文確認 |
| **Đơn hàng** | Xem lịch sử, theo dõi trạng thái, chi tiết từng đơn | 注文履歴・ステータス追跡・注文詳細 |
| **Hồ sơ cá nhân** | Cập nhật thông tin, avatar, đổi mật khẩu, quản lý nhiều địa chỉ | プロフィール編集・アバター・パスワード変更・住所管理 |
| **Wishlist** | Lưu sản phẩm yêu thích | お気に入りリスト |
| **Đánh giá** | Viết review, chấm sao cho sản phẩm đã mua | レビュー投稿・星評価 |
| **Mã giảm giá** | Áp coupon khi checkout | クーポン適用 |
| **Lookbook** | Bộ sưu tập hình ảnh editorial | エディトリアル写真コレクション |
| **Sale** | Trang chương trình khuyến mãi, combo sản phẩm | セールページ・コンボ商品 |
| **About** | Thông tin thương hiệu, cửa hàng, đội ngũ | ブランド紹介・店舗情報・チーム紹介 |
| **Support** | FAQ, chính sách giao hàng, liên hệ | よくある質問・配送ポリシー・お問い合わせ |

### Quản trị (Admin) | 管理者機能

| Tính năng | Mô tả | 説明（日本語） |
|-----------|-------|--------------|
| **Dashboard** | Doanh thu, số đơn hàng, khách hàng, lợi nhuận ước tính, biên lợi nhuận, biểu đồ thống kê, tỉ lệ hoàn hủy | 売上・注文数・顧客数・利益予測・粗利率・統計グラフ・キャンセル率 |
| **Sản phẩm** | CRUD, upload ảnh, quản lý variants, giá vốn / giá bán / giá gốc | 商品CRUD・画像アップロード・バリアント管理・原価/販売価格/定価 |
| **Danh mục** | Thêm, sửa, xóa danh mục | カテゴリ追加・編集・削除 |
| **Đơn hàng** | Danh sách phân trang server-side, lọc theo trạng thái, cập nhật trạng thái | 注文一覧（サーバーページネーション）・ステータスフィルター・ステータス更新 |
| **Khách hàng** | Danh sách phân trang, tìm kiếm realtime (debounce) | 顧客一覧・リアルタイム検索（デバウンス処理） |
| **Mã giảm giá** | Tạo/xóa coupon, cấu hình tier giảm giá, combo | クーポン作成・削除・割引ティア設定・コンボ設定 |
| **Lookbook** | Quản lý bộ sưu tập story/ảnh | ルックブックの管理 |
| **Sale** | Cấu hình chương trình khuyến mãi, combo | キャンペーン・コンボ設定 |
| **About** | CMS cho thông tin thương hiệu, danh sách cửa hàng, thành viên đội ngũ | ブランド情報・店舗・チームメンバーのCMS管理 |

---

## Công nghệ sử dụng | 使用技術

### Frontend

| Thư viện | Phiên bản | Vai trò | 役割 |
|----------|-----------|---------|------|
| React | 19 | UI framework | UIフレームワーク |
| React Router | 7 | Client-side routing | クライアントサイドルーティング |
| Tailwind CSS | 4 | Utility-first styling | スタイリング |
| Framer Motion | 12 | Animations (scroll-triggered, micro-interactions) | アニメーション（スクロール連動・マイクロインタラクション） |
| Zustand | 5 | Global state (auth, cart, ui, wishlist) | グローバル状態管理 |
| TanStack React Query | 5 | Server state & caching | サーバー状態・キャッシュ管理 |
| React Hook Form | latest | Form management | フォーム管理 |
| Zod | latest | Schema validation | スキーマバリデーション |
| Radix UI | latest | Accessible component primitives | アクセシブルUIコンポーネント |
| Lucide React | latest | Icon library | アイコンライブラリ |
| Sonner | latest | Toast notifications | トースト通知 |
| Axios | latest | HTTP client | HTTPクライアント |
| Embla Carousel | 8 | Image carousel | 画像カルーセル |
| Vite | 6 | Build tool & dev server | ビルドツール |

### Backend

| Thư viện | Vai trò | 役割 |
|----------|---------|------|
| Node.js + Express 5 | REST API server | REST APIサーバー |
| MongoDB + Mongoose 9 | Database & ODM | データベース・ODM |
| JWT (jsonwebtoken) | accessToken (30 phút) + refreshToken (14 ngày, MongoDB Session) | 認証トークン（アクセス30分・リフレッシュ14日） |
| bcryptjs | Hash mật khẩu (salt rounds = 10) | パスワードハッシュ化 |
| Multer | Upload ảnh local (JPEG/PNG/WebP/GIF, 5 file × 5 MB) | 画像アップロード（ローカル保存） |
| cookie-parser | Xử lý HttpOnly cookie | HttpOnly Cookie処理 |
| dotenv | Quản lý biến môi trường | 環境変数管理 |

### DevOps

| Công cụ | Vai trò | 役割 |
|---------|---------|------|
| Docker + Docker Compose | Container hóa backend + frontend | コンテナ化 |
| Nginx | Phục vụ React build (production) | フロントエンドの本番配信 |

---

## Cấu trúc dự án | プロジェクト構成

```
ecommerce-store/
├── backend/                    # Node.js + Express API
│   ├── controllers/            # Validate input → gọi service → trả response
│   │                           # 入力バリデーション → サービス呼び出し → レスポンス返却
│   ├── services/               # Business logic | ビジネスロジック
│   ├── models/                 # Mongoose schemas | モデル定義
│   ├── routes/                 # Express route definitions | ルート定義
│   ├── middlewares/            # authMiddleware (protectedRoute, adminRoute)
│   ├── utils/                  # slugUtils, helpers dùng chung | 共通ヘルパー
│   ├── libs/db.js              # Kết nối MongoDB | MongoDB接続
│   ├── uploads/                # Ảnh upload (multer) | アップロード画像
│   ├── seeders/                # Script seed dữ liệu mẫu | サンプルデータ投入スクリプト
│   ├── server.js               # Entry point
│   ├── .env                    # Biến môi trường local | ローカル環境変数
│   ├── .env.docker             # Biến môi trường Docker | Docker環境変数
│   └── Dockerfile
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── pages/              # Pages theo route | ページ
│   │   │   ├── Landing/        # Landing page (hero, drops, lookbook…)
│   │   │   ├── Shop/           # Danh sách sản phẩm + bộ lọc | 商品一覧・フィルター
│   │   │   ├── Product/        # Chi tiết sản phẩm | 商品詳細
│   │   │   ├── Cart/           # Giỏ hàng | カート
│   │   │   ├── Checkout/       # Thanh toán | 決済
│   │   │   ├── Profile/        # Hồ sơ, địa chỉ, lịch sử đơn | プロフィール・住所・注文履歴
│   │   │   ├── Auth/           # Login, Register | ログイン・会員登録
│   │   │   ├── Wishlist/       # Danh sách yêu thích | お気に入り
│   │   │   ├── About/          # Giới thiệu thương hiệu | ブランド紹介
│   │   │   ├── Support/        # FAQ & hỗ trợ | FAQ・サポート
│   │   │   ├── Lookbook/       # Gallery editorial | ルックブック
│   │   │   ├── Sale/           # Chương trình khuyến mãi | セール
│   │   │   ├── NewDrops/       # Hàng mới về | 新着商品
│   │   │   └── Admin/          # Toàn bộ admin panel | 管理画面
│   │   ├── layouts/            # RootLayout, AdminLayout, Header, Footer
│   │   ├── components/         # ui/ · common/ — Reusable components | 共通コンポーネント
│   │   ├── store/              # Zustand stores | 状態管理
│   │   ├── services/           # Service layer (gọi API) | APIサービス層
│   │   ├── routes/             # AdminRoute, ProtectedRoute
│   │   ├── hooks/              # useClickOutside, useDebounce
│   │   └── utils/              # cn, formatCurrency, formatDate
│   ├── public/
│   ├── vite.config.js
│   └── Dockerfile
│
├── docs/                       # Tài liệu đồ án | プロジェクトドキュメント
│   ├── API document/
│   ├── database/
│   └── topic/
│
├── docker-compose.yml
└── README.md
```

---

## Cài đặt & Chạy local | セットアップ

### Yêu cầu | 動作環境

- Node.js >= 18
- MongoDB đang chạy tại `localhost:27017` *(MongoDBがlocalhost:27017で起動していること)*
- npm

### 1. Clone & cài dependencies | 依存関係のインストール

```bash
git clone <repo-url>
cd ecommerce-store

# Backend
cd backend
npm install

# Frontend (mở terminal mới | 別ターミナルで)
cd ../frontend
npm install
```

### 2. Cấu hình biến môi trường backend | 環境変数の設定

Tạo file `backend/.env` *(ファイルを作成)*:

```env
PORT=5000
MONGODB_CONNECTIONSTRING=mongodb://localhost:27017/ecommerceStore
ACCESS_TOKEN_SECRET=<chuỗi ngẫu nhiên 64 bytes | ランダムな64バイト文字列>
```

Tạo secret ngẫu nhiên *(シークレットの生成)*:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Seed dữ liệu mẫu | サンプルデータの投入 (tuỳ chọn | オプション)

```bash
cd backend
node seeders/adminSeeder.js      # Tạo tài khoản admin | 管理者アカウント作成
node seeders/productSeeder.js    # Tạo sản phẩm mẫu | サンプル商品作成
node seeders/aboutSeeder.js      # Seed thông tin About | About情報の投入
node seeders/lookbookSeeder.js   # Seed lookbook story | ルックブック投入
```

### 4. Chạy server | サーバー起動

```bash
# Backend (cổng 5000 | ポート5000)
cd backend
npm run dev

# Frontend (cổng 5173 | ポート5173)
cd frontend
npm run dev
```

Truy cập *(アクセス)*:
- **Website:** `http://localhost:5173`
- **Admin:** `http://localhost:5173/admin`
- **API:** `http://localhost:5000/api`

---

## Chạy với Docker | Docker実行

### Yêu cầu | 必要条件

- Docker Desktop đang chạy *(Docker Desktopが起動していること)*

### 1. Cấu hình biến môi trường | 環境変数の設定

```bash
cp backend/.env.docker.example backend/.env.docker
```

Chỉnh sửa `backend/.env.docker` *(編集)*:

```env
PORT=5000
MONGODB_CONNECTIONSTRING=mongodb://mongo:27017/ecommerceStore
ACCESS_TOKEN_SECRET=<ランダムな64バイト文字列>
CORS_ORIGINS=http://localhost
FRONTEND_URL=http://localhost
```

### 2. Build & chạy | ビルド・起動

```bash
docker compose up --build
```

Truy cập website tại `http://localhost` *(Webサイトは `http://localhost` でアクセス可能)*.

### 3. Dừng | 停止

```bash
docker compose down
```

> Ảnh upload được mount vào `./backend/uploads` — dữ liệu không mất khi restart container.
> *アップロード画像は `./backend/uploads` にマウントされるため、コンテナ再起動後もデータは保持されます。*

---

## Biến môi trường | 環境変数

### Backend (`backend/.env`)

| Biến | Mô tả | 説明 | Ví dụ |
|------|-------|------|-------|
| `PORT` | Cổng server | サーバーポート | `5000` |
| `MONGODB_CONNECTIONSTRING` | MongoDB URI | MongoDB接続文字列 | `mongodb://localhost:27017/ecommerceStore` |
| `ACCESS_TOKEN_SECRET` | Secret ký JWT | JWT署名シークレット | `<64-byte hex>` |
| `CORS_ORIGINS` | Origins được phép (Docker) | 許可オリジン | `http://localhost` |
| `FRONTEND_URL` | URL frontend (Docker) | フロントエンドURL | `http://localhost` |

---

## API Overview | API一覧

Base URL: `http://localhost:5000/api`

### Public endpoints — Không cần xác thực | 認証不要

| Method | Endpoint | Mô tả | 説明 |
|--------|----------|-------|------|
| POST | `/auth/signup` | Đăng ký tài khoản | ユーザー登録 |
| POST | `/auth/signin` | Đăng nhập | ログイン |
| POST | `/auth/signout` | Đăng xuất | ログアウト |
| POST | `/auth/refresh` | Làm mới access token | トークン更新 |
| GET | `/products` | Danh sách sản phẩm (filter, sort, cursor pagination) | 商品一覧 |
| GET | `/products/:id` | Chi tiết sản phẩm | 商品詳細 |
| GET | `/categories` | Danh sách danh mục | カテゴリ一覧 |
| GET | `/coupons` | Danh sách coupon | クーポン一覧 |
| GET | `/combos` | Danh sách combo | コンボ一覧 |
| GET | `/lookbook` | Danh sách lookbook story | ルックブック一覧 |
| GET | `/sale-config` | Cấu hình chương trình sale | セール設定 |
| GET | `/stores` | Danh sách cửa hàng | 店舗一覧 |
| GET | `/team` | Danh sách thành viên đội ngũ | チームメンバー一覧 |
| GET | `/about-config` | Cấu hình trang About | About設定 |

### Protected endpoints — Cần đăng nhập | 要認証 (`Authorization: Bearer <token>`)

| Method | Endpoint | Mô tả | 説明 |
|--------|----------|-------|------|
| GET/PUT | `/users/profile` | Xem / cập nhật hồ sơ | プロフィール取得・更新 |
| POST | `/users/avatar` | Upload avatar | アバターアップロード |
| GET/POST/PUT/DELETE | `/users/addresses` | Quản lý địa chỉ | 住所管理 |
| GET/POST/DELETE | `/users/wishlist` | Quản lý wishlist | お気に入り管理 |
| GET/POST/PUT | `/cart` | Xem / thêm / cập nhật giỏ hàng | カート操作 |
| POST | `/orders` | Tạo đơn hàng | 注文作成 |
| GET | `/orders` | Lịch sử đơn hàng của user | 注文履歴 |
| GET | `/orders/:id` | Chi tiết đơn hàng | 注文詳細 |

### Admin endpoints — Cần role admin | 管理者権限必須

| Method | Endpoint | Mô tả | 説明 |
|--------|----------|-------|------|
| POST/PUT/DELETE | `/products` | Tạo / sửa / xóa sản phẩm | 商品CRUD |
| POST/PUT/DELETE | `/categories` | Quản lý danh mục | カテゴリ管理 |
| GET | `/orders?page&limit&status` | Tất cả đơn hàng (phân trang) | 全注文一覧（ページネーション） |
| PUT | `/orders/:id/status` | Cập nhật trạng thái đơn | 注文ステータス更新 |
| GET | `/users?page&limit&search` | Tất cả khách hàng (phân trang) | 全顧客一覧（ページネーション） |
| POST/DELETE | `/coupons` | Tạo / xóa coupon | クーポン管理 |
| POST/PUT/DELETE | `/combos` | Quản lý combo | コンボ管理 |
| POST/PUT/DELETE | `/lookbook` | Quản lý lookbook | ルックブック管理 |
| PUT | `/sale-config` | Cập nhật cấu hình sale | セール設定更新 |
| POST/PUT/DELETE | `/stores` | Quản lý cửa hàng | 店舗管理 |
| POST/PUT/DELETE | `/team` | Quản lý đội ngũ | チームメンバー管理 |
| PUT | `/about-config` | Cập nhật cấu hình About | About設定更新 |

---

## Database Models | データベースモデル

| Model | Mô tả chính | 主なフィールド |
|-------|------------|--------------|
| **User** | Người dùng | `name`, `email`, `password`(bcrypt), `role`(customer/admin), `avatar`, `addresses[]`, `wishlist[]` |
| **Session** | Refresh token | `userId`, `refreshToken`, `expiresAt`(14日) |
| **Product** | Sản phẩm | `name`, `slug`, `price`, `compareAtPrice`, `costPrice`, `category`, `images[]`, `variants[]{size,color,stock}` |
| **Category** | Danh mục | `name`, `slug`, `image` |
| **Cart** | Giỏ hàng | `user`, `items[]{product, variant, quantity}` |
| **Order** | Đơn hàng | `user`, `items[]`, `shippingAddress`, `coupon`, `totalAmount`, `finalAmount`, `status`, `orderNumber` |
| **Review** | Đánh giá | `user`, `product`, `rating`, `comment` |
| **Coupon** | Mã giảm giá | `code`, `discountType`(percentage/fixed), `discountValue`, `minOrderValue`, `expiresAt` |
| **Combo** | Gói sản phẩm | `name`, `products[]`, `discountPercent` |
| **Lookbook** | Bộ sưu tập | `title`, `description`, `images[]`, `story` |
| **SaleConfig** | Cấu hình sale | Tiers giảm giá, chương trình khuyến mãi |
| **Store** | Thông tin cửa hàng | `name`, `address`, `city`, `phone`, `hours` |
| **TeamMember** | Thành viên đội ngũ | `name`, `role`, `bio`, `avatar` |
| **SiteConfig** | Cấu hình website | Thông tin thương hiệu, mission, slogan |

---

## Tài khoản mặc định | デフォルトアカウント

Sau khi chạy `node seeders/adminSeeder.js` *(実行後)*:

| Vai trò | Role | Email | Mật khẩu | パスワード |
|---------|------|-------|----------|-----------|
| Admin | Quản trị viên | `admin@vibeUrban.com` | `admin123` | `admin123` |

> Đổi mật khẩu ngay sau khi đăng nhập lần đầu.
> *初回ログイン後、すぐにパスワードを変更してください。*

---

## Cấu trúc thư mục chi tiết | ディレクトリ構成

### Backend — Route → Controller → Service

```
/api/auth           → authRoute.js      → authController.js      → authService.js
/api/products       → productRoute.js   → productController.js   → productService.js
/api/categories     → categoryRoute.js  → categoryController.js
/api/cart           → cartRoute.js      → cartController.js      → cartService.js
/api/orders         → orderRoute.js     → orderController.js     → orderService.js
/api/users          → userRoute.js      → userController.js      → userService.js
/api/coupons        → couponRoute.js    → couponController.js    → couponService.js
/api/combos         → comboRoute.js     → comboController.js     → comboService.js
/api/upload         → uploadRoute.js    → uploadController.js
/api/lookbook       → lookbookRoute.js  → lookbookController.js  → lookbookService.js
/api/sale-config    → saleConfigRoute   → saleConfigController   → saleConfigService
/api/stores         → storeRoute.js     → storeController.js     → storeService.js
/api/team           → teamRoute.js      → teamController.js      → teamService.js
/api/about-config   → siteConfigRoute   → siteConfigController   → siteConfigService
```

### Frontend — Path → Component | ルートとコンポーネント対応

```
/                        → Landing/index.jsx          Hero, New Drops, Trending, Lookbook
/shop                    → Shop/index.jsx             フィルター・カーソルページネーション
/product/:id             → Product/index.jsx          ギャラリー・バリアント・レビュー
/cart                    → Cart/index.jsx
/checkout                → Checkout/index.jsx
/checkout/success/:n     → Checkout/Success.jsx
/wishlist                → Wishlist/index.jsx
/lookbook                → Lookbook/index.jsx
/sale                    → Sale/index.jsx
/new-drops               → NewDrops/index.jsx
/about                   → About/index.jsx
/support                 → Support/index.jsx          FAQ・配送・お問い合わせ
/profile/info            → Profile/Info.jsx           (要ログイン)
/profile/addresses       → Profile/Addresses.jsx      (要ログイン)
/profile/orders          → Profile/Orders.jsx         (要ログイン)
/profile/orders/:id      → Profile/OrderDetail.jsx    (要ログイン)
/profile/change-password → Profile/ChangePassword.jsx (要ログイン)
/login                   → Auth/Login.jsx
/register                → Auth/Register.jsx
/admin                   → Admin/Dashboard/index.jsx  (要管理者権限)
/admin/products          → Admin/Products/index.jsx
/admin/categories        → Admin/Categories/index.jsx
/admin/orders            → Admin/Orders/index.jsx
/admin/customers         → Admin/Customers/index.jsx
/admin/coupons           → Admin/Coupons/index.jsx
/admin/lookbook          → Admin/Lookbook/index.jsx
/admin/sale              → Admin/Sale/index.jsx
/admin/about             → Admin/About/index.jsx
```

### Zustand Stores | 状態管理ストア

| Store | State chính | 管理する状態 |
|-------|------------|------------|
| `authStore` | `user`, `accessToken`, `isAuthenticated` — persist localStorage | 認証状態・トークン |
| `cartStore` | `items[]`, `totalItems`, `totalPrice` — sync server | カート・サーバー同期 |
| `uiStore` | `sidebarOpen`, modal states | UIの開閉状態 |
| `wishlistStore` | `items[]` — sync server | お気に入りリスト |

---

## Thiết kế & UX | デザイン・UX

| Yếu tố | Chi tiết | 詳細 |
|--------|---------|------|
| **Bảng màu** | Warm gray `#F9F6F5` + Blue accent `#004BE3` → `#819BFF` | カラーパレット |
| **Typography** | Inter + Outfit — tiêu đề lớn, tương phản cao | タイポグラフィ |
| **Layout** | Editorial 2 cột, white space rộng (`py-16`–`py-24`) | エディトリアルレイアウト |
| **Animation** | Framer Motion — scroll-triggered, stagger, drawer slide-in | アニメーション |
| **Responsive** | Mobile-first, Tailwind `sm:` / `md:` / `lg:` breakpoints | レスポンシブ対応 |

---

## Tài liệu bổ sung | 参考ドキュメント

| File | Nội dung | 内容 |
|------|---------|------|
| `docs/API document/api-document.md` | Tài liệu API endpoints chi tiết | API詳細ドキュメント |
| `docs/database/db.md` | Schema database | データベーススキーマ |
| `docs/topic/TOPIC GR1.md` | Đề tài & yêu cầu đồ án | プロジェクト要件 |
| `docs/topic/SRS.md` | Software Requirements Specification | ソフトウェア要件定義書 |
| `docs/huong-dan-docker.md` | Hướng dẫn Docker chi tiết | Docker手順書 |
| `.claude/rules/` | Coding conventions & UI design rules | コーディング規約・UIデザイン規則 |
