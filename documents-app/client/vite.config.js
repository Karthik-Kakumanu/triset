import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client',
  plugins: [react()],
  cacheDir: '../.vite-cache',
  server: { port: 5174, proxy: { '/api': 'http://localhost:4174' } },
  build: { outDir: '../dist', emptyOutDir: false }
});
