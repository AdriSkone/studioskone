import './styles/base.css'
import './styles/components/cursor.css'
import './styles/fondations.css'
import { initCursor } from './scripts/cursor'
import { initReveal } from './scripts/reveal'
import { rafraichirAuChargementDesFontes } from './lib/animations'

initCursor()
initReveal()
void rafraichirAuChargementDesFontes()
