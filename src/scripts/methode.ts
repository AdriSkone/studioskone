/**
 * Moment 3 — la méthode en colonne collée.
 *
 * La colonne de gauche tient en place par le seul CSS : `position: sticky`
 * suffit et fonctionne sans JavaScript. Ce module ne s'occupe que de
 * l'autre moitié — dire quelle étape est en train d'être lue.
 *
 * Pourquoi un IntersectionObserver et pas un ScrollTrigger, alors que GSAP
 * pilote tout le reste : ce n'est pas une animation, c'est une question de
 * position — « quelle étape traverse la ligne de lecture ? ». L'observateur
 * y répond depuis le navigateur, sans dépendre d'un recalcul. Les positions
 * de la page changent quand le rail des projets s'épingle, et un
 * déclencheur qui n'a pas été rafraîchi au bon moment se trompe alors de
 * plusieurs centaines de pixels. L'observateur, lui, ne mémorise rien.
 *
 * La bande d'observation est une ligne, pas une zone : haute de zéro, posée
 * à 42 % de l'écran. L'étape qui la touche est celle qu'on lit.
 */

import { grandEcran, mouvementReduit } from '../lib/animations'

const LIGNE_DE_LECTURE = 42 // en % de la hauteur de l'écran

export function initMethode(): void {
  const etapes = Array.from(document.querySelectorAll<HTMLElement>('#process .etape'))
  if (!etapes.length) return

  // En empilement, aucune étape n'est « celle qu'on lit » : elles sont
  // toutes également visibles, donc toutes actives.
  if (!grandEcran() || mouvementReduit()) {
    etapes.forEach((e) => e.classList.add('est-active'))
    return
  }

  let activeCourante = etapes[0]
  activeCourante.classList.add('est-active')

  const marquer = (etape: HTMLElement): void => {
    if (etape === activeCourante) return
    activeCourante.classList.remove('est-active')
    etape.classList.add('est-active')
    activeCourante = etape
  }

  const observateur = new IntersectionObserver(
    (entrees) => {
      // Plusieurs étapes peuvent toucher la ligne au même instant pendant
      // un saut de défilement : on garde la plus basse, c'est-à-dire la
      // dernière atteinte.
      const touchees = entrees.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement)
      if (!touchees.length) return
      marquer(touchees[touchees.length - 1])
    },
    {
      rootMargin: `-${LIGNE_DE_LECTURE}% 0px -${100 - LIGNE_DE_LECTURE}% 0px`,
      threshold: 0,
    }
  )

  etapes.forEach((etape) => observateur.observe(etape))
}
