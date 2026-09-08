import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [],
  build: {
    cssTarget: ['safari14', 'chrome90', 'firefox88', 'edge90'],
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        // Vercel sert dist/404.html sur toute route inconnue.
        notFound:    resolve(__dirname, '404.html'),

        // Pages prestations — générées par `node scripts/build-prestation-pages.mjs`.
        // Ne pas les éditer à la main : la source est scripts/prestation-pages-data.mjs.
        presRefonte:   resolve(__dirname, 'refonte-site-internet.html'),
        presArtisan:   resolve(__dirname, 'creation-site-internet-artisan.html'),
        presNantes:    resolve(__dirname, 'creation-site-internet-nantes.html'),
        presEcommerce: resolve(__dirname, 'creation-site-ecommerce-nantes.html'),
        presMobile:    resolve(__dirname, 'creation-application-mobile.html'),

        giftmatch:   resolve(__dirname, 'projets/giftmatch.html'),
        tasq:        resolve(__dirname, 'projets/tasq.html'),
        myboat:      resolve(__dirname, 'projets/myboat.html'),
        garantibox:  resolve(__dirname, 'projets/garantibox.html'),
        cafeo:       resolve(__dirname, 'projets/cafeo.html'),
        archeon:     resolve(__dirname, 'projets/archeon.html'),
        mBivouak:    resolve(__dirname, 'projets/m-bivouak.html'),
        merelEtFils: resolve(__dirname, 'projets/merel-et-fils.html'),
        pepite:      resolve(__dirname, 'projets/pepite.html'),
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
