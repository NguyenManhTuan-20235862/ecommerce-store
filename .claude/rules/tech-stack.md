---
description: Technology stack thực tế của dự án Vibe Urban — danh sách thư viện, phiên bản, và mục đích sử dụng.
alwaysApply: true
---

# Technology Stack — Vibe Urban

## Frontend
| Thư viện | Phiên bản | Mục đích |
|---|---|---|
| React | 19 | UI framework |
| React Router | 7 | Client-side routing |
| Tailwind CSS | 4 | Styling |
| Zustand | 5 | State management (authStore, cartStore, uiStore) |
| React Hook Form | latest | Form handling |
| Zod | latest | Schema validation |
| Radix UI | latest | Accessible component primitives |
| Lucide React | latest | Icon library |
| Sonner | latest | Toast notifications |
| React Query | 5 | Server state (installed, chưa dùng nhiều) |
| Axios | latest | HTTP client |
| Vite | 6 | Build tool |

## Backend
| Thư viện | Mục đích |
|---|---|
| Node.js + Express | REST API server |
| Multer | Upload ảnh local |
| JWT (jsonwebtoken) | accessToken (30 phút) + refreshToken (14 ngày trong MongoDB Session) |
| Bcrypt | Hash mật khẩu (salt rounds = 10) |

## Database
- **MongoDB + Mongoose** — models: User, Session, Product, Category, Cart
- Chưa có: Order, Coupon, Review
