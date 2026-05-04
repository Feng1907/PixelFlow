# PixelFlow

> A niche-market portfolio platform for photographers — built with React 19, Node.js, and MongoDB.

[![CI](https://github.com/Feng1907/PixelFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/Feng1907/PixelFlow/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?logo=mongodb)

---

## Features

| Feature | Status |
|---|---|
| Auth — JWT + HttpOnly Cookie, Register/Login | ✅ |
| Masonry Gallery — Infinite Scroll, Lazy Loading | ✅ |
| Drag & Drop Upload — WebP compression, EXIF extraction | ✅ |
| Photo Lightbox — fullscreen, keyboard navigation | ✅ |
| Discover — search, sort (Trending / Latest / Popular), tag filter | ✅ |
| Public Portfolio — `/@username` | ✅ |
| Dashboard Analytics — Recharts area chart, top photos | ✅ |
| Dark / Light Theme — persistent | ✅ |
| Real-time Notifications — Socket.io | ✅ |
| Cloudinary Upload — auto thumbnail, CDN delivery | ✅ |
| CI/CD — GitHub Actions (lint + type check + test) | ✅ |

---

## Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Material UI v9** — component library + theming
- **Redux Toolkit** — global state
- **TanStack Query** — server state & caching
- **React Hook Form + Zod** — type-safe form validation
- **Socket.io Client** — real-time events
- **Recharts** — analytics charts
- **react-dropzone** + **browser-image-compression** + **exifr** — upload pipeline

### Backend
- **Node.js + Express + TypeScript**
- **MongoDB + Mongoose** — data layer with indexes
- **Redis** — session cache
- **Cloudinary** — image storage + CDN
- **JWT** (access + refresh) in **HttpOnly cookies**
- **Helmet + Rate Limiting** — security hardening
- **Swagger UI** — API documentation at `/api-docs`
- **Zod** — request validation

### DevOps
- **Docker Compose** — MongoDB + Redis local dev
- **GitHub Actions** — CI on every push/PR
- **Vercel** — frontend deployment
- **Railway** — backend deployment

---

## Architecture

```
pixelflow/
├── client/                     # React 19 + Vite + TypeScript
│   └── src/
│       ├── features/
│       │   ├── auth/           # Login, Register, Profile, Edit
│       │   ├── gallery/        # Upload flow, EXIF, compression
│       │   ├── discovery/      # Masonry grid, PhotoCard, Lightbox
│       │   └── dashboard/      # Analytics charts, StatsCard
│       ├── components/
│       │   ├── layout/         # Navbar (avatar menu), RootLayout
│       │   └── ui/             # ProtectedRoute, NotificationToast
│       ├── store/              # Redux slices (auth, theme)
│       ├── hooks/              # useSocket
│       ├── services/           # axios instance, queryClient, socket
│       └── types/              # User, Photo, Album, API response
│
├── server/                     # Express + TypeScript
│   └── src/
│       ├── config/             # env, database, redis, cloudinary
│       ├── models/             # User, Photo, Album (Mongoose)
│       ├── middlewares/        # authenticate, errorHandler, validate
│       ├── controllers/        # authController, photoController
│       ├── services/           # authService, photoService
│       └── routes/             # /api/auth, /api/photos
│
├── docker-compose.yml          # MongoDB + Redis
└── .github/workflows/ci.yml   # GitHub Actions CI
```

---

## Quick Start

### Prerequisites
- Node.js 22+
- Docker Desktop

### 1. Clone & install

```bash
git clone https://github.com/Feng1907/PixelFlow.git
cd PixelFlow

# Frontend
cd client && npm install --legacy-peer-deps

# Backend
cd ../server && npm install
```

### 2. Environment variables

```bash
# server/.env  (copy from .env.example)
cp server/.env.example server/.env
# Fill in: CLOUDINARY_*, JWT_SECRET
```

### 3. Start services

```bash
# Start MongoDB + Redis
docker-compose up -d

# Start backend (port 5000)
cd server && npm run dev

# Start frontend (port 3000)
cd client && npm run dev
```

### 4. Open

| URL | Description |
|---|---|
| http://localhost:3000 | Frontend |
| http://localhost:5000/api-docs | Swagger UI |
| http://localhost:5000/api/health | Health check |

---

## API Reference

Full documentation available at `/api-docs` (Swagger UI).

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login |
| POST | `/api/auth/logout` | — | Logout |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/photos` | optional | List photos (paginated, sortable) |
| POST | `/api/photos` | ✅ | Upload photo to Cloudinary |
| POST | `/api/photos/:id/like` | ✅ | Toggle like |
| DELETE | `/api/photos/:id` | ✅ | Delete own photo |

---

## Scripts

```bash
# Frontend
npm run dev           # Dev server
npm run build         # Production build
npm run test:run      # Run tests once (CI)
npm run lint          # ESLint
npm run format        # Prettier

# Backend
npm run dev           # ts-node-dev watch
npm run build         # tsc compile
```

---

## Roadmap

- [ ] E2E tests — Cypress (upload flow, auth flow)
- [ ] Follow system + feed
- [ ] Real-time comments
- [ ] PWA — Service Worker, offline mode
- [ ] Performance — code splitting, Lighthouse > 90

---

## License

MIT © 2026 [Feng1907](https://github.com/Feng1907)
