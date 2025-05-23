import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      '/api': {                     
        target: 'https://story-api.dicoding.dev/v1',
        changeOrigin: true,
        secure: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
