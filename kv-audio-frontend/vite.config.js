import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/

//Fix Missing Anti-clickjacking Header
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
    },
  },
});
