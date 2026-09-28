/**
 * Remonter en haut de page.
 *
 * Le lien (posé par partials.mjs) pointe vers « # » : sans ce script, il
 * remonte déjà. Le script ajoute trois choses :
 *
 * - il ne le montre qu'après deux écrans de défilement ;
 * - il le passe en négatif quand il flotte au-dessus d'une section
 *   sombre, lue sous son centre ;
 * - il adoucit la remontée — instantanée en mouvement réduit — et, si
 *   on l'a actionné au clavier, rend le focus au lien d'évitement du haut
 *   de page : sans ça, le focus resterait en bas, sur un bouton qu'on ne
 *   voit plus.
 */

import { mouvementReduit } from '../lib/animations'

const SEUIL_ECRANS = 2

export function initRemonter(): void {
  const lien = document.querySelector<HTMLAnchorElement>('.remonter')
  if (!lien) return

  let enAttente = false

  function mettreAJour(): void {
    enAttente = false
    lien!.classList.toggle('est-visible', window.scrollY > window.innerHeight * SEUIL_ECRANS)

    // Ce qui est sous le centre du bouton, lui-même mis de côté.
    const r = lien!.getBoundingClientRect()
    const dessous = document
      .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .find((el) => el !== lien && !lien!.contains(el) && el.id !== 'curseur')
    lien!.classList.toggle('sur-sombre', Boolean(dessous?.closest('.sombre')))
  }

  function demander(): void {
    if (enAttente) return
    enAttente = true
    requestAnimationFrame(mettreAJour)
  }

  window.addEventListener('scroll', demander, { passive: true })
  window.addEventListener('resize', demander, { passive: true })
  mettreAJour()

  lien.addEventListener('click', (e) => {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: mouvementReduit() ? 'auto' : 'smooth' })

    // detail === 0 : activé au clavier (Entrée), pas à la souris ni au doigt.
    // À la souris, il se libère : le bouton va disparaître, le focus ne
    // doit pas rester sur un élément invisible.
    if (e.detail === 0) {
      document.querySelector<HTMLElement>('.skip-link')?.focus({ preventScroll: true })
    } else {
      lien.blur()
    }
  })
}
