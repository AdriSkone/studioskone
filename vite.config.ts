import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/umami-api': {
        target: 'https://api.umami.is',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/umami-api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      input: {
        main:  resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
})
