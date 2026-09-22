# KV-AUDIO Frontend

React + Vite frontend for KV-AUDIO (public site + booking flow + admin dashboard). The app talks to a separate backend API (configured via `VITE_BACKEND_URL`) and uses Supabase Storage for media uploads.

## Tech Stack

- React (Vite)
- Tailwind CSS
- React Router
- Axios
- Supabase (Storage)
- ESLint

## Pages / Features (high-level)

- Public: Home, Items, Product overview, Gallery, Contact
- Booking: Cart/booking flow and order requests
- Auth: Register / Login
- Admin: Products (add/update/list), Orders, Users, Contact messages

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- npm

### Install

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```bash
VITE_BACKEND_URL=http://localhost:5000
```

Notes:

- Vite only exposes variables prefixed with `VITE_` to the browser.
- The frontend expects the backend to serve endpoints under `/api/*` (for example `/api/products`, `/api/orders`, `/api/users`, `/api/contact`).

### Run (Development)

```bash
npm run dev
```

This project runs Vite with `--host`, so it can be accessed from your LAN.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Supabase (Media Uploads)

Media uploads use Supabase Storage via `@supabase/supabase-js`.

- Current implementation: Supabase URL and anon key are hardcoded in `src/utils/mediaUpload.jsx`.
- Storage bucket used: `images`.

If you want to switch projects/keys, update the values in `src/utils/mediaUpload.jsx` (or refactor them into `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

## Deployment (Vercel)

This repo includes a `vercel.json` rewrite so React Router routes work on refresh.

Typical Vercel settings:

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Environment: set `VITE_BACKEND_URL` in Vercel Project Settings

## Troubleshooting

- **API requests fail / 401 / CORS:** confirm `VITE_BACKEND_URL` is correct and your backend allows requests from the frontend origin.
- **Images fail to upload:** confirm the Supabase project/bucket (`images`) exists and the anon key has permission to upload.

## Security Note

Do not commit secrets. If you store keys/URLs locally, prefer `.env.local` (which should stay out of git). If `supabase.txt` contains credentials, treat it as sensitive and avoid sharing it publicly.
