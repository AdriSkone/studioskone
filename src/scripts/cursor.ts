/**
 * Curseur — un point qui suit la souris, dans quatre états.
 *
 * Reprend la mécanique éprouvée du site actuel (interpolation dans une
 * boucle rAF, écriture en `transform`) et corrige ce qui lui manquait :
 *
 *   · `translate3d` plutôt que `translate`, pour que la position parte sur
 *     sa propre couche. Le point passe au-dessus du rail épinglé et de la
 *     colonne collée : en 2D, chacun de ses déplacements les ferait
 *     repeindre.
 *   · La boucle s'arrête quand le curseur n'est pas visible, au lieu de
 *     tourner pour rien tant que l'onglet est ouvert.
 *   · Les gardes qui manquaient : sous 1024 px et en mouvement réduit.
 *
 * Une seule instance par page. L'élément est créé ici plutôt que posé dans
 * le HTML : c'est ce qui garantit l'unicité, et rien n'est ajouté au DOM
 * sur les appareils qui n'en veulent pas.
 */

const TAILLE_LERP = 0.15

export interface Curseur {
  detruire(): void
}

/** Le curseur ne s'affiche que là où il a du sens. */
function estAutorise(): boolean {
  return (
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    window.matchMedia('(min-width: 1024px)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function initCursor(): Curseur | null {
  if (!estAutorise()) return null

  const el = document.createElement('div')
  el.id = 'curseur'
  el.setAttribute('aria-hidden', 'true')

  const libelle = document.createElement('span')
  libelle.className = 'curseur-libelle'
  el.appendChild(libelle)
  document.body.appendChild(el)
  document.documentElement.classList.add('a-curseur')

  let sourisX = 0
  let sourisY = 0
  let x = 0
  let y = 0
  let visible = false
  let frame = 0
  let modeCourant = ''

  function boucle(): void {
    x += (sourisX - x) * TAILLE_LERP
    y += (sourisY - y) * TAILLE_LERP
    el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`
    frame = requestAnimationFrame(boucle)
  }

  function demarrer(): void {
    if (!frame) frame = requestAnimationFrame(boucle)
  }

  function arreter(): void {
    if (frame) {
      cancelAnimationFrame(frame)
      frame = 0
    }
  }

  /**
   * Quatre états, dans cet ordre de priorité. Une carte projet est aussi un
   * lien : c'est la pastille qui doit gagner, donc elle se teste d'abord.
   */
  function modePour(cible: EventTarget | null): string {
    // `target` n'est pas toujours un Element : un mousemove peut être émis
    // sur window ou sur document, et l'un comme l'autre ignore `closest`.
    if (!(cible instanceof Element)) return ''

    const projet = cible.closest<HTMLElement>('[data-curseur="projet"]')
    if (projet) {
      libelle.textContent = projet.dataset.curseurLibelle ?? ''
      return 'mode-projet'
    }
    if (cible.closest('a, button, [role="button"], summary')) return 'mode-lien'
    if (cible.closest('[data-curseur="negatif"], .negatif')) return 'mode-negatif'
    return ''
  }

  function surMouvement(e: MouseEvent): void {
    sourisX = e.clientX
    sourisY = e.clientY

    if (!visible) {
      // Premier mouvement : on se pose sur la souris sans traîner derrière.
      x = sourisX
      y = sourisY
      visible = true
      el.classList.add('est-visible')
      demarrer()
    }

    const mode = modePour(e.target)
    if (mode !== modeCourant) {
      if (modeCourant) el.classList.remove(modeCourant)
      if (mode) el.classList.add(mode)
      modeCourant = mode
    }
  }

  function masquer(): void {
    visible = false
    el.classList.remove('est-visible')
    arreter()
  }

  function surVisibilite(): void {
    if (document.hidden) arreter()
    else if (visible) demarrer()
  }

  window.addEventListener('mousemove', surMouvement, { passive: true })
  document.addEventListener('mouseleave', masquer)
  document.addEventListener('visibilitychange', surVisibilite)

  return {
    detruire(): void {
      arreter()
      window.removeEventListener('mousemove', surMouvement)
      document.removeEventListener('mouseleave', masquer)
      document.removeEventListener('visibilitychange', surVisibilite)
      document.documentElement.classList.remove('a-curseur')
      el.remove()
    },
  }
}
