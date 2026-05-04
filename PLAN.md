# PixelFlow - Niche-Market Photography Portfolio Platform

**PixelFlow** là nền tảng chuyên biệt dành cho cộng đồng nhiếp ảnh, cho phép người dùng trưng bày, chia sẻ và quản lý tác phẩm dưới dạng portfolio chuyên nghiệp. Dự án tập trung vào trải nghiệm hình ảnh chất lượng cao, real-time interaction và tối ưu hóa hiệu suất web hiện đại.

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript** — type-safe, industry standard
- **Vite** — build tool hiện đại, HMR nhanh
- **Material UI (MUI) v9** — component library
- **Redux Toolkit** — state management
- **React Query (TanStack Query)** — server state, caching
- **Socket.io Client** — real-time interaction
- **Recharts** — biểu đồ thống kê tương tác
- **React Hook Form + Zod** — form validation type-safe

### Backend
- **Node.js + Express** + **TypeScript**
- **MongoDB + Mongoose** — lưu trữ metadata hình ảnh
- **Redis** — cache, session management
- **Socket.io** — WebSocket real-time
- **Cloudinary** — lưu trữ và xử lý ảnh trên cloud
- **JWT + HttpOnly Cookie** — authentication an toàn
- **Helmet.js + Rate Limiting** — bảo mật API
- **Swagger (OpenAPI 3.0)** — API documentation

### DevOps & Tooling
- **Docker + docker-compose** — containerization, dễ setup local
- **GitHub Actions** — CI/CD: lint, test, build tự động khi push
- **ESLint + Prettier** — code quality
- **Husky + lint-staged** — pre-commit hooks
- **Vitest** — Unit Testing
- **Cypress** — E2E Testing

### Deployment
- **Vercel** — Frontend
- **Railway / Render** — Backend
- **MongoDB Atlas** — Database cloud
- **Upstash Redis** — Redis cloud

---

## Feature List

### 1. Authentication & Profile
- [x] Đăng ký / Đăng nhập với JWT, lưu token trong HttpOnly Cookie
- [ ] OAuth2 (Google) — đăng nhập nhanh
- [ ] Quản lý Profile: tiểu sử, avatar, thông tin liên hệ chuyên nghiệp
- [ ] Follow System: theo dõi nhiếp ảnh gia, nhận feed cập nhật
- [ ] Public Portfolio URL: `pixelflow.app/@username`

### 2. Gallery Management
- [x] Upload hình ảnh: kéo thả, multi-file, preview trước khi upload
- [x] Image optimization: tự động compress + convert sang WebP (client-side)
- [x] Metadata Extraction: tự động đọc EXIF (máy ảnh, ống kính, khẩu độ, ISO)
- [ ] Tổ chức Album theo chủ đề (Street Life, Landscape, Portrait...)
- [ ] Polaroid Display Mode: hiển thị ảnh phong cách film/Polaroid cổ điển
- [ ] Drag & drop sắp xếp thứ tự ảnh trong album

### 3. Discovery & Interaction
- [x] Masonry Grid: hiển thị ảnh kiểu Pinterest với Infinite Scroll + Lazy Loading
- [ ] Real-time Like & Comment qua WebSocket (Socket.io)
- [x] Advanced Search: tìm theo thiết bị, hashtag, địa điểm
- [x] Trending Photos: sắp xếp theo lượt tương tác
- [x] Light Table Mode: xem ảnh fullscreen + keyboard navigation

### 4. Dashboard & Analytics
- [ ] Biểu đồ tăng trưởng lượt xem / like / follow theo tuần, tháng (Recharts)
- [ ] Top performing photos: ảnh được tương tác nhiều nhất
- [ ] Audience insights: thiết bị xem, giờ cao điểm
- [ ] Content Management: duyệt, xóa, chỉnh sửa nhanh tác phẩm

### 5. Performance & UX
- [ ] PWA Support: Service Worker, offline mode, installable
- [x] Dark / Light Theme — toggle với MUI
- [x] Skeleton Loading thay vì spinner
- [ ] Lighthouse Score > 90 (Performance, Accessibility, SEO)
- [x] Responsive Design: Mobile-first

---

## Roadmap

### Giai đoạn 1 — Setup & Foundation (Tuần 1)
- [x] Khởi tạo monorepo: `client/` (React + Vite + TS) và `server/` (Express + TS)
- [x] Cấu hình ESLint, Prettier, Husky, lint-staged
- [ ] Setup Docker + docker-compose cho local dev (MongoDB, Redis)
- [ ] Thiết kế MongoDB Schema: User, Photo, Album, Comment, Like, Follow
- [x] Cấu hình GitHub Actions: CI pipeline (lint + test on PR)
- [ ] Khởi tạo Swagger docs skeleton

### Giai đoạn 2 — Core Features (Tuần 2-3)
- [x] Auth flow: Register, Login, Logout, refresh token
- [x] Upload flow: drag & drop, compress WebP, preview, metadata form
- [x] EXIF extraction khi upload (camera, lens, aperture, ISO)
- [x] Masonry Grid với Infinite Scroll và Lazy Loading
- [ ] Upload lên Cloudinary + lưu vào MongoDB (cần Backend)
- [ ] Profile page + Public Portfolio URL

### Giai đoạn 3 — Advanced Features (Tuần 4)
- [ ] Socket.io: real-time like, comment, notification
- [ ] Follow System + Feed
- [ ] Advanced Search (Elasticsearch hoặc MongoDB Atlas Search)
- [ ] Dashboard Analytics với Recharts
- [x] Dark/Light Theme, PWA manifest

### Giai đoạn 4 — Quality & Release (Tuần 5)
- [ ] Unit test với Vitest: auth service, image upload logic
- [ ] E2E test với Cypress: upload flow, login flow
- [ ] Tối ưu Performance: bundle size, image lazy load, code splitting
- [ ] Deploy lên Vercel + Railway, cấu hình domain
- [ ] Hoàn thiện README.md: screenshots, GIF demo, architecture diagram, setup guide

---

## Code Quality Standards

1. **TypeScript strict mode** — không dùng `any`, đảm bảo type safety toàn bộ codebase
2. **Clean Architecture** — tách rõ `controller / service / repository` phía backend; `pages / components / hooks / services` phía frontend
3. **Conventional Commits** — `feat:`, `fix:`, `docs:`, `refactor:`, `test:`
4. **API Documentation** — mọi endpoint được document bằng Swagger (OpenAPI 3.0)
5. **Security** — Helmet.js, rate limiting, validate input với Zod, không expose sensitive data
6. **Accessibility** — semantic HTML, ARIA labels, keyboard navigable (Lighthouse a11y > 90)

---

## Project Structure

```
pixelflow/
├── client/                  # React 19 + Vite + TypeScript
│   ├── src/
│   │   ├── assets/
│   │   ├── components/      # Reusable UI components
│   │   ├── features/        # Feature-based modules (auth, gallery, dashboard)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Route-level pages
│   │   ├── services/        # API call functions
│   │   ├── store/           # Redux Toolkit store
│   │   └── types/           # Shared TypeScript types
│   └── vite.config.ts
│
├── server/                  # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── config/          # DB, Redis, Cloudinary config
│   │   ├── controllers/
│   │   ├── middlewares/     # Auth, rate limit, error handler
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── swagger.yaml
│
├── docker-compose.yml       # MongoDB + Redis local dev
├── .github/
│   └── workflows/
│       └── ci.yml           # GitHub Actions CI
└── PLAN.md
```
