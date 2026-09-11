# CareerMap

A full-stack PWA for tracking internship applications. Students log their applications through a Kanban-style pipeline, browse opportunities posted by advisors, and get push notifications; advisors monitor student progress and post opportunities.

## Stack

- **Frontend:** React 19 + Vite, PWA (installable, service worker), axios
- **Backend:** Node.js + Express 5, MongoDB (Mongoose), JWT auth, Google OAuth (Passport), Web Push
- **Logging:** Winston

## Project structure

```
backend/server/   Express API (routes, models, middleware, config)
frontend/         React app (Vite)
```

## Setup

### 1. Backend

```bash
cd backend/server
npm install
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, VAPID keys, Google OAuth creds
npm start               # or: node server.js
```

Generate VAPID keys for push notifications:

```bash
npx web-push generate-vapid-keys
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL and VITE_VAPID_PUBLIC_KEY (public key must match backend)
npm run dev
```

The app runs on `http://localhost:5173` and expects the API on `http://localhost:5000` by default (both configurable via `.env`).

## Environment variables

See `backend/server/.env.example` and `frontend/.env.example` for the full list. Never commit `.env` files — only the `.env.example` templates are tracked.

## Auth

- Email/password login issues a JWT (1h expiry).
- Google OAuth: the backend redirects with a short-lived one-time code (`/auth/google/success?code=...`), which the frontend immediately exchanges for a JWT via `POST /api/auth/google/exchange`. The JWT itself is never placed in a URL.

## Scripts

| Location | Command | Purpose |
|---|---|---|
| `frontend` | `npm run dev` | Start Vite dev server |
| `frontend` | `npm run build` | Production build |
| `frontend` | `npm run lint` | ESLint |
| `frontend` | `npm test` | Vitest |
| `backend/server` | `npm start` | Start API server |

## Deployment

**Backend → Render, Frontend → Vercel.** The Express API is a stateful long-running
process (MongoDB connection, OAuth code store, rate limiting) which doesn't map
cleanly onto Vercel serverless functions, so it deploys as a normal Node web
service on Render; the React app deploys to Vercel as a static site.

### 1. Backend on Render

1. Push this repo to GitHub.
2. In Render: **New → Blueprint**, point it at the repo — it picks up `render.yaml`
   at the repo root automatically (service root is `backend/server`).
   (No blueprint? New → Web Service, root directory `backend/server`,
   build command `npm install`, start command `npm start`.)
3. Fill in the env vars Render prompts for (same list as `backend/server/.env.example`):
   `MONGO_URI`, `JWT_SECRET`, `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_EMAIL`,
   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
   - `GOOGLE_CALLBACK_URL` → `https://<your-render-service>.onrender.com/api/auth/google/callback`
   - `FRONTEND_URL` → your Vercel URL from step 2 below (set this after step 2, then redeploy)
4. In Google Cloud Console (OAuth client), add the Render callback URL above to
   **Authorized redirect URIs**.
5. Note your Render service URL — you'll need it as `VITE_API_URL` for the frontend.

### 2. Frontend on Vercel

1. In Vercel: **New Project**, import the repo, set **Root Directory** to `frontend`.
   Framework preset: Vite (build command `vite build`, output `dist` — Vercel
   detects this automatically).
2. Add env vars: `VITE_API_URL` = your Render URL from step 1, `VITE_VAPID_PUBLIC_KEY`
   = same public key as the backend's `VAPID_PUBLIC_KEY`.
3. Deploy. `frontend/vercel.json` handles the SPA fallback (rewrites every path to
   `index.html`) so the Google OAuth redirect to `/auth/google/success` works.
4. Go back to Render and set `FRONTEND_URL` to this Vercel URL, then redeploy the
   backend — this is what CORS and the OAuth `failureRedirect`/success redirect use.

### Notes

- Both `MONGO_URI` (MongoDB Atlas) and the OAuth app need their network/origin
  allowlists updated for production (Atlas: allow Render's IP or `0.0.0.0/0`;
  Google Cloud: add the Vercel domain under **Authorized JavaScript origins**).
- Render's free tier spins down on idle — the first request after inactivity will
  be slow (cold start) and Mongo may take a moment to reconnect.
- Rotate `JWT_SECRET` and the Mongo Atlas password before going live — the values
  currently in local `.env` are development placeholders.

## Known limitations / next steps

- No automated backend tests yet (routes are covered manually).
- No CI pipeline configured.
- Single JWT with 1h expiry and no refresh flow — users must log in again after expiry.
