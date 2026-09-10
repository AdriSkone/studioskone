/**
 * Apparition au défilement.
 *
 * Un masque vertical qui se lève, plus 16 px de translation. Déclenché
 * quand l'élément atteint 85 % de la hauteur de l'écran, joué une fois.
 *
 * Les éléments qui partagent un parent forment une liste et apparaissent en
 * cascade de 60 ms. Le regroupement se fait par parent plutôt que par une
 * classe posée à la main : une liste, dans le HTML, ce sont déjà des frères.
 *
 * L'état masqué est posé par GSAP, jamais par le CSS. C'est délibéré : si le
 * script ne s'exécute pas, ou si le paquet n'arrive pas, la page reste
 * entièrement lisible au lieu de se vider. Rien de ce qui porte le contenu
 * ne dépend d'un chargement réussi.
 */

import { contexteGsap, mouvementReduit } from '../lib/animations'

const CASCADE = 0.06
const DECALAGE = 16

export function initReveal(racine: ParentNode = document): void {
  const cibles = Array.from(racine.querySelectorAll<HTMLElement>('[data-reveal]'))
  if (!cibles.length || mouvementReduit()) return

  // Regroupe les frères : une liste apparaît en cascade, un élément isolé seul.
  const groupes = new Map<Element, HTMLElement[]>()
  for (const el of cibles) {
    const parent = el.parentElement
    if (!parent) continue
    const groupe = groupes.get(parent)
    if (groupe) groupe.push(el)
    else groupes.set(parent, [el])
  }

  void contexteGsap(({ gsap }) => {
    for (const groupe of groupes.values()) {
      // `fromTo` et non `from` : l'état d'arrivée est écrit noir sur blanc.
      // Un `from` viserait la valeur calculée du clip-path, c'est-à-dire
      // `none` — or `none` ne s'interpole pas avec un `inset()`. La
      // transition échoue alors sans bruit et l'élément reste masqué pour
      // de bon. C'est du contenu qui disparaît, pas une animation ratée.
      gsap.fromTo(
        groupe,
        { y: DECALAGE, clipPath: 'inset(100% 0% 0% 0%)' },
        {
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: lireDuree('--dur-base', 0.6),
          ease: 'power3.out',
          stagger: CASCADE,
          // Le masque ne doit plus rogner une fois l'animation finie, sinon
          // il découpe les anneaux de focus et les débordements légitimes.
          clearProps: 'clipPath',
          scrollTrigger: {
            // 85 % de la hauteur de l'écran : l'élément entre, il n'a pas
            // encore à être au milieu pour se montrer.
            trigger: groupe[0],
            start: 'top 85%',
            once: true,
          },
        }
      )
    }
  })
}

/**
 * Les durées viennent des tokens, pas du script. Une seule source de
 * vérité, et le mouvement réduit qui les ramène à zéro vaut aussi ici.
 */
function lireDuree(token: string, defaut: number): number {
  const brut = getComputedStyle(document.documentElement).getPropertyValue(token).trim()
  if (brut.endsWith('ms')) return parseFloat(brut) / 1000
  if (brut.endsWith('s')) return parseFloat(brut)
  return defaut
}
