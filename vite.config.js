import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base public path. Default `/` (root host) — Hostinger, custom domain, etc.
// Set VITE_BASE_PATH=/repo-name/ at build time for a GitHub Pages project page.
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
