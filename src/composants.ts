import './styles/base.css'
import './styles/composants.css'
import './styles/inventaire.css'
import { initCursor } from './scripts/cursor'
import { initFaq } from './scripts/faq'
import { rafraichirAuChargementDesFontes } from './lib/animations'

initCursor()
initFaq()
void rafraichirAuChargementDesFontes()
