import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    strictPort: true,
    open: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_PROXY_TARGET || 'http://localhost:3001',
        changeOrigin: true,
      },
      '/wp-json': {
        target: process.env.VITE_WP_PROXY_TARGET || 'https://thebluepassport.org',
        changeOrigin: true,
      },
    },
  },
});
