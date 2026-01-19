import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true
          },
          '/auth': {
            target: 'http://localhost:3001',
            changeOrigin: true
          },
          '/uploads': {
            target: 'http://localhost:3001',
            changeOrigin: true
          },
          // Proxy API requests to /admin/* endpoints (but not the /admin page itself or /admin/dashboard)
          '^/admin/(anunturi|audit|csrf)': {
            target: 'http://localhost:3001',
            changeOrigin: true
          }
        }
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      publicDir: 'public',
    };
});
