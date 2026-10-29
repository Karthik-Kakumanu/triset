import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig({
  root: path.resolve(__dirname, '..'),
  appType: 'custom',
  build: {
    outDir: path.resolve(__dirname, '../dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  server: {
    host: '127.0.0.1',
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
    proxy: {
      '/api': 'http://127.0.0.1:4173',
    },
  },
  plugins: [{
    name: 'extensionless-pages',
    configureServer(server) {
      server.middlewares.use((request, _response, next) => {
        const requestUrl = new URL(request.url, 'http://localhost');
        if (
          request.method === 'GET'
          && request.headers.accept?.includes('text/html')
          && !requestUrl.pathname.startsWith('/api/')
          && !path.extname(requestUrl.pathname)
        ) {
          request.url = `/frontend/index.html${requestUrl.search}`;
        }
        next();
      });
    },
  }],
});
