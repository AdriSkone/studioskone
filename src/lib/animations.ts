/**
 * Chargement de GSAP, et contexte partagé.
 *
 * GSAP est la seule librairie d'animation du projet, et elle arrive en
 * import dynamique : le paquet ne bloque ni le premier rendu ni le LCP.
 * Le relevé d'avant-refonte (docs/reference-lighthouse.md) montre que le
 * LCP de l'accueil est un titre, pas une image — c'est-à-dire du texte que
 * rien ne doit retarder.
 *
 * Tout ce qui anime passe par `contexteGsap()`. Les contextes sont retenus
 * ici pour pouvoir être défaits d'un seul appel : `revertAnimations()`.
 */

import type { gsap as GsapType } from 'gsap'

export interface Gsap {
  gsap: typeof GsapType
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger
}

let promesse: Promise<Gsap> | null = null
const contextes: Array<{ revert(): void }> = []

/** Le mouvement réduit est un chemin de rendu à part : GSAP n'y sert à rien. */
export function mouvementReduit(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** Les trois moments orchestrés ne concernent que le grand écran. */
export function grandEcran(): boolean {
  return window.matchMedia('(min-width: 1024px)').matches
}

/** Charge GSAP une fois, quel que soit le nombre d'appelants. */
export function chargerGsap(): Promise<Gsap> {
  if (!promesse) {
    promesse = Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger)
        garderLAncre(ScrollTrigger)
        return { gsap, ScrollTrigger }
      }
    )
  }
  return promesse
}

/**
 * Garde l'ancre de l'adresse (/#work, /#tarifs…) malgré ScrollTrigger.
 *
 * Pour mesurer ses déclencheurs, `ScrollTrigger.refresh()` remonte la
 * page à 0 puis restaure la position qu'il avait notée. S'il passe avant
 * que le navigateur soit descendu sur l'ancre, il note 0, restaure 0, et
 * l'ancre est perdue : « Tous les projets », depuis une page projet,
 * ramenait en haut de l'accueil au lieu de la section Réalisations. Selon
 * l'ordre d'arrivée des fichiers, ça tombait d'un côté ou de l'autre —
 * l'adresse tapée à la main marchait, le clic non.
 *
 * Tant que le visiteur n'a pas touché au défilement, chaque
 * rafraîchissement le ramène donc sur l'ancre. Au premier geste — molette,
 * doigt, clavier, clic — ou au bout de quatre secondes, on lâche : on ne
 * confisque jamais le défilement de quelqu'un.
 */
function garderLAncre(ScrollTrigger: Gsap['ScrollTrigger']): void {
  const id = decodeURIComponent(location.hash.slice(1))
  const cible = id ? document.getElementById(id) : null
  if (!cible) return

  const rejoindre = (): void => cible.scrollIntoView({ block: 'start' })
  const lacher = (): void => {
    ScrollTrigger.removeEventListener('refresh', rejoindre)
    for (const t of GESTES) window.removeEventListener(t, lacher)
  }

  ScrollTrigger.addEventListener('refresh', rejoindre)
  for (const t of GESTES) window.addEventListener(t, lacher, { passive: true })
  window.setTimeout(lacher, 4000)
}

const GESTES = ['wheel', 'touchstart', 'keydown', 'mousedown'] as const

/**
 * Ouvre un contexte GSAP et le retient. Tout ce qui est créé dedans se
 * défait ensemble, ce qui évite qu'un ScrollTrigger survive à la section
 * qu'il pilotait.
 */
export async function contexteGsap(
  travail: (api: Gsap) => void,
  portee?: Element
): Promise<void> {
  if (mouvementReduit()) return
  const api = await chargerGsap()
  const ctx = api.gsap.context(() => travail(api), portee)
  contextes.push(ctx)
}

export function revertAnimations(): void {
  while (contextes.length) contextes.pop()?.revert()
}

/**
 * Un seul recalcul, une fois les fontes posées.
 *
 * Il compte : les fontes changent la hauteur du texte, donc la position de
 * chaque déclencheur. Recalculer avant qu'elles ne soient là revient à
 * caler les animations sur une page qui n'existe plus.
 */
export async function rafraichirAuChargementDesFontes(): Promise<void> {
  if (mouvementReduit()) return
  const [{ ScrollTrigger }] = await Promise.all([chargerGsap(), document.fonts.ready])
  ScrollTrigger.refresh()
}
