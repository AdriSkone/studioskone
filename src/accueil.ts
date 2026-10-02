import './styles/base.css'
import './styles/composants.css'
import './styles/accueil.css'

import { initCursor } from './scripts/cursor'
import { initReveal } from './scripts/reveal'
import { initHero } from './scripts/hero'
import { initCarrousel } from './scripts/carrousel'
import { initMethode } from './scripts/methode'
import { initFaq } from './scripts/faq'
import { initNav } from './scripts/nav'
import { initCookies, lireConsentement } from './scripts/cookies'
import { initRemonter } from './scripts/remonter'
import { initTarifs } from './scripts/tarifs'
import { initProbleme } from './scripts/probleme'
import { rafraichirAuChargementDesFontes } from './lib/animations'

import { initParcours } from './scripts/parcours'
import { initTrait } from './scripts/trait'
import { essaiActif, ouverture, fond } from './scripts/essai-s'

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
// ESSAI ?essai-s : l'ouverture au s passe avant le hero, et le grand s
// s'installe en fond. Sans le paramètre, rien ne change.
if (essaiActif()) {
  fond()
  void ouverture().then(() => initHero(() => initCursor()))
} else {
  initHero(() => initCursor())
}

initNav()
initReveal()
initProbleme()
initFaq()
initCookies()
initRemonter()
initCarrousel()
initMethode()
initTarifs()
initTrait()

// L'estimateur et le formulaire ne font plus qu'un.
initParcours()

void rafraichirAuChargementDesFontes()
