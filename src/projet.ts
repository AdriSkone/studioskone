import './styles/base.css'
import './styles/composants.css'
import './styles/projet.css'

import { initCursor } from './scripts/cursor'
import { initReveal } from './scripts/reveal'
import { initNav } from './scripts/nav'
import { initCookies } from './scripts/cookies'
import { rafraichirAuChargementDesFontes } from './lib/animations'

// Umami — injecté seulement si les variables d'environnement sont renseignées.
if (import.meta.env.VITE_UMAMI_WEBSITE_ID && import.meta.env.VITE_UMAMI_SCRIPT_URL) {
  const s = document.createElement('script')
  s.defer = true
  s.src = `${import.meta.env.VITE_UMAMI_SCRIPT_URL}/script.js`
  s.dataset.websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  document.head.appendChild(s)
}

initCursor()
initNav()
initReveal()
initCookies()
void rafraichirAuChargementDesFontes()
