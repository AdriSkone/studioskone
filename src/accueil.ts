import './styles/base.css'
import './styles/composants.css'
import './styles/accueil.css'

import { initCursor } from './scripts/cursor'
import { initReveal } from './scripts/reveal'
import { initHero } from './scripts/hero'
import { initRail } from './scripts/rail'
import { initMethode } from './scripts/methode'
import { initFaq } from './scripts/faq'
import { initNav } from './scripts/nav'
import { initCookies, lireConsentement } from './scripts/cookies'
import { initTarifs } from './scripts/tarifs'
import { rafraichirAuChargementDesFontes } from './lib/animations'

import { initParcours } from './scripts/parcours'

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

// Le curseur s'allume à la fin de l'ouverture du hero — c'est la dernière
// marche de la séquence. Quand celle-ci ne se joue pas (mouvement réduit,
// ou retour sur la page dans la même session), le rappel est immédiat.
initHero(() => initCursor())

initNav()
initReveal()
initFaq()
initCookies()
initRail()
initMethode()
initTarifs()

// L'estimateur et le formulaire ne font plus qu'un.
initParcours()

void rafraichirAuChargementDesFontes()
