# InvestBeans Project Summary

## Repository Layout

- Root workspace contains the app under `Insvestbeans/`.
- `Insvestbeans/Frontend/` - React + TypeScript SPA (Vite).
- `Insvestbeans/Backend/` - Node.js (ESM) + Express API with Socket.IO and MongoDB.
- No monorepo root `package.json`; frontend and backend are managed separately.

## Frontend Overview

- Stack: React 18, TypeScript, Vite (`@vitejs/plugin-react-swc`).
- Routing: `react-router-dom`.
- Data/API: `axios` shared client (`src/api/axios.ts`), with React Query provider in app root.
- UI libs: Chakra UI, Radix UI, Tailwind CSS, Framer Motion.
- Charts/market UI: Recharts, ApexCharts, Lightweight Charts.
- Realtime: `socket.io-client` (Kite tick hook exists).
- Auth handling: JWT/localStorage flow and Google callback handling in auth context.

## Backend Overview

- Stack: Node.js ESM + Express 5.
- Database: MongoDB via Mongoose.
- Auth: JWT + Passport Google OAuth.
- Sessions: `express-session` + `connect-mongo`.
- Realtime: Socket.IO on the same HTTP server.
- Integrations: Cloudinary uploads, Razorpay, Kite Connect, cron-based token refresh.
- API structure: routes under `/api/v1` plus `/auth` for Google OAuth.

## Frontend and Backend Integration

- Frontend dev proxy forwards `/api` and `/auth` to backend (`localhost:8000`).
- Backend exposes versioned REST routes (`/api/v1/...`) and a health endpoint (`/health`).
- Socket connection logic derives root URL by removing `/api/v1` suffix where needed.

## Environment and Config (No Secrets)

Detected env files:

- `Insvestbeans/Backend/.env`
- `Insvestbeans/Frontend/.env`

Backend expects groups of env vars for:

- DB, JWT/session, Google OAuth, admin controls, Cloudinary, Razorpay, Kite, and email.

Frontend expects env vars for:

- API base URL and admin/market-related configuration.

## Scripts and Commands

### Frontend

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`

### Backend

- `npm run dev` (nodemon)
- `npm start`
- `npm run build`

## Notable Risks and Gaps

- No clear automated test setup (especially frontend).
- No in-repo onboarding docs were found during scan.
- Backend scripts appear partially misaligned with current folder layout.
- Some dependencies look potentially unused.
- Some route/config defaults are permissive and may cause environment drift.

## Architecture Snapshot

InvestBeans is a split frontend/backend platform:

- Frontend handles user/admin experiences, dashboards, and auth UX.
- Backend provides business APIs, auth/session management, market integrations, and realtime channels.
- Production behavior is highly dependent on correct environment configuration.
