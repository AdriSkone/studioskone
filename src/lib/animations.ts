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
        return { gsap, ScrollTrigger }
      }
    )
  }
  return promesse
}

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
