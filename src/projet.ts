import './styles/base.css'
import './styles/composants.css'
import './styles/projet.css'

import { initCursor } from './scripts/cursor'
import { initReveal } from './scripts/reveal'
import { initNav } from './scripts/nav'
import { initCookies, lireConsentement } from './scripts/cookies'
import { rafraichirAuChargementDesFontes } from './lib/animations'

// Umami ne se charge qu'avec un consentement donné et mémorisé. Le
// bandeau annonce « vous pouvez refuser » : le charger avant la réponse,
// ou malgré un refus, rendrait cette phrase fausse.
if (
  import.meta.env.VITE_UMAMI_WEBSITE_ID &&
  import.meta.env.VITE_UMAMI_SCRIPT_URL &&
  lireConsentement() === 'accepted'
) {
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
