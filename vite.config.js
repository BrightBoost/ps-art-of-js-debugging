import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: 'client',
  server: {
    port: 5173,
    // In development, Vite forwards /api calls to the Express server.
    // Same origin for the browser, so no CORS needed here.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    outDir: '../dist/client',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        login: resolve(import.meta.dirname, 'client/index.html'),
        skillList: resolve(import.meta.dirname, 'client/skillList.html'),
        skillForm: resolve(import.meta.dirname, 'client/skillForm.html'),
        admin: resolve(import.meta.dirname, 'client/admin.html'),
      },
    },
  },
});
