import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

// Development needs inline scripts for React Fast Refresh. Production uses the
// stricter policy in vercel.json, where no development runtime is injected.
const developmentContentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "connect-src 'self' http://localhost:3000 ws://localhost:* ws://127.0.0.1:*",
  "font-src 'self' data:",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob: https:",
  "object-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'"
].join('; ')

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    host: '0.0.0.0',
    allowedHosts: ['host.docker.internal'],

    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': developmentContentSecurityPolicy,
    },
  },
});
