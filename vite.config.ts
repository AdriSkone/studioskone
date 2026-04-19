import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
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
