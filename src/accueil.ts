import './styles/base.css'
import './styles/composants.css'
import './styles/accueil.css'

import { initCursor } from './scripts/cursor'
import { initReveal } from './scripts/reveal'
import { initFaq } from './scripts/faq'
import { initNav } from './scripts/nav'
import { initCookies } from './scripts/cookies'
import { rafraichirAuChargementDesFontes } from './lib/animations'

import { initContactForm } from './components/contact-form'
import { initEstimator } from './components/estimator'

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
initFaq()
initCookies()

// L'estimateur pousse ses réponses dans le formulaire : il lui faut sa poignée.
const formulaire = initContactForm()
initEstimator(formulaire)

void rafraichirAuChargementDesFontes()
