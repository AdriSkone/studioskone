import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
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
    cssTarget: ['safari14', 'chrome90', 'firefox88', 'edge90'],
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        admin:       resolve(__dirname, 'admin.html'),
        myboat:      resolve(__dirname, 'projets/myboat.html'),
        garantibox:  resolve(__dirname, 'projets/garantibox.html'),
        cafeo:       resolve(__dirname, 'projets/cafeo.html'),
        niortBasket: resolve(__dirname, 'projets/niort-basket.html'),
        archeon:     resolve(__dirname, 'projets/archeon.html'),
        mBivouak:    resolve(__dirname, 'projets/m-bivouak.html'),
      },
      output: {
        assetFileNames: (asset) =>
          asset.name?.endsWith('.woff2')
            ? 'assets/fonts/[name][extname]'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
