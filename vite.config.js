import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Base public path. Default `/` (root host) — Hostinger, custom domain, etc.
// Set VITE_BASE_PATH=/repo-name/ at build time for a GitHub Pages project page.
const base = process.env.VITE_BASE_PATH || '/';

function manifestPlugin() {
  return {
    name: 'manifest-transform',
    closeBundle() {
      const manifestPath = resolve(__dirname, 'public', 'manifest.webmanifest');
      if (!existsSync(manifestPath)) return;
      const raw = readFileSync(manifestPath, 'utf-8');
      // Replace absolute / paths with base-prefixed paths
      const transformed = raw.replace(/"\//g, `"${base}`);
      writeFileSync(resolve(__dirname, 'dist', 'manifest.webmanifest'), transformed, 'utf-8');
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), manifestPlugin()],
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
