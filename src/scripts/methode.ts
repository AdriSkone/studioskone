/**
 * Méthode — frise animée.
 *
 * Tout part d'une seule valeur : la progression du défilement, entre 0 et
 * 1. Rien ne bouge sans elle — pas de tween, pas de transition CSS, pas
 * de lissage. Le tracé, les points et l'allumage des étapes en dérivent,
 * au pixel, via ScrollTrigger.
 *
 * Pourquoi ScrollTrigger ici, alors qu'un IntersectionObserver pilotait
 * cette section jusqu'ici : la version précédente n'avait qu'une chose à
 * dire — « quelle étape traverse la ligne de lecture ? » — une question
 * de position que l'observateur résout sans dépendre d'un recalcul. La
 * frise validée le 17 septembre en demande plus : un tracé qui s'épingle
 * et se remplit AU pixel du défilement, ce qu'un observateur ne sait pas
 * faire.
 *
 * Ce que ça change au risque signalé par l'ancienne version : les
 * positions de la page bougent encore après le premier calcul de
 * ScrollTrigger — les fontes changent la hauteur de tout ce qui précède
 * #process (donc son point de départ), et plus bas, les neuf images de
 * Réalisations peuvent décaler la hauteur totale du document pendant
 * qu'elles chargent. Un ScrollTrigger calé trop tôt se trompe alors de
 * plusieurs centaines de pixels. On rafraîchit donc explicitement une
 * fois les fontes prêtes, et une fois la page entièrement chargée
 * (images comprises) — sans compter sur l'ordre d'arrivée d'un autre
 * module pour le faire à notre place.
 *
 * En mouvement réduit, ce module ne fait rien : la feuille de styles
 * (components/etape.css) affiche déjà, sans lui, un tracé plein et les
 * quatre étapes allumées. C'est aussi ce qui se voit si le script
 * n'arrive jamais à charger.
 */

import { chargerGsap, mouvementReduit } from '../lib/animations'

// Fenêtre de montée/descente d'une étape, en fraction du parcours total —
// reprise telle quelle du prototype validé le 17 septembre.
const FENETRE = 0.05

interface Geometrie {
  fractions: number[]
  remplir(p: number): void
}

function borne(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function centre(el: Element, repere: Element): { x: number; y: number } {
  const a = el.getBoundingClientRect()
  const b = repere.getBoundingClientRect()
  return { x: a.left + a.width / 2 - b.left, y: a.top + a.height / 2 - b.top }
}

export function initMethode(): void {
  const trouvee = document.querySelector<HTMLElement>('.methode')
  const etapes = trouvee ? Array.from(trouvee.querySelectorAll<HTMLElement>('.etape')) : []
  if (!trouvee || !etapes.length || mouvementReduit()) return
  const section = trouvee

  const points = (): HTMLElement[] =>
    etapes.map((e) => e.querySelector('.point') as HTMLElement)

  // Tracé vertical : du premier point au dernier jalon. Il ne s'arrête pas
  // au quatrième point — la dernière mention de durée y reste accrochée.
  function verticale(): Geometrie {
    const liste = section.querySelector('.methode-liste') as HTMLElement
    const rail = section.querySelector('.rail-v') as HTMLElement
    const plein = rail.querySelector('.rail-v-plein') as HTMLElement
    const ys = points().map((p) => centre(p, liste).y)
    const jalons = Array.from(section.querySelectorAll<HTMLElement>('.etape-temps'))
    const haut = ys[0]
    const bas = centre(jalons[jalons.length - 1], liste).y
    rail.style.top = `${haut}px`
    rail.style.height = `${bas - haut}px`
    return {
      fractions: ys.map((y) => (y - haut) / (bas - haut)),
      remplir: (p) => {
        plein.style.transform = `scaleY(${p})`
      },
    }
  }

  let geo: Geometrie | undefined

  function rendre(p: number): void {
    if (!geo) return
    geo.remplir(p)
    const f = geo.fractions
    const monte = f.map((fi, i) => (i === 0 ? 1 : borne((p - fi) / FENETRE + 0.5)))
    etapes.forEach((e, i) => {
      const actif = monte[i] - (monte[i + 1] ?? 0)
      e.style.setProperty('--actif', actif.toFixed(3))
      e.classList.toggle('est-atteinte', p >= f[i] - 0.001)
      e.classList.toggle('est-active', actif > 0.5)
    })
  }

  void (async () => {
    const { ScrollTrigger } = await chargerGsap()
    // Le mouvement réduit peut avoir été activé pendant le chargement :
    // on revérifie avant de brancher quoi que ce soit.
    if (mouvementReduit()) return

    section.classList.add('methode--animee')

    const liste = section.querySelector('.etapes') as HTMLElement
    const scene = section.querySelector('.methode-scene') as HTMLElement

    ScrollTrigger.matchMedia({
      // Grand écran : la section se fige à l'arrivée et reste figée jusqu'à
      // la fin de l'étape 4 (demande d'Adri, 1er octobre 2026). Pendant ce
      // temps, la colonne des étapes remonte dans la section, juste assez
      // pour que la dernière durée apparaisse, et le tracé se remplit.
      '(min-width: 1024px)': () => {
        let course = 0
        // La section figée fait exactement la hauteur de l'écran : ses
        // étapes y remontent de `course`. Gardée à sa hauteur naturelle,
        // elle laissait ces mêmes pixels de vide sombre sous l'étape 4,
        // une fois libérée (2 octobre 2026).
        function preparer(): void {
          section.style.height = ''
          section.style.overflow = ''
          scene.style.transform = ''
          course = Math.max(0, section.offsetHeight - window.innerHeight)
          if (course > 0) {
            section.style.height = `${window.innerHeight}px`
            section.style.overflow = 'clip'
          }
        }
        const st = ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: () => {
            preparer()
            return `+=${course + window.innerHeight * 1.2}`
          },
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: (self) => {
            geo = verticale()
            rendre(self.progress)
          },
          onUpdate: (self) => {
            // La colonne a fini de remonter aux trois quarts du parcours :
            // le dernier quart tient l'étape 4 à l'écran avant de libérer.
            const t = borne(self.progress / 0.75)
            scene.style.transform = `translateY(${-t * course}px)`
            rendre(self.progress)
          },
        })
        return () => {
          st.kill()
          scene.style.transform = ''
          section.style.height = ''
          section.style.overflow = ''
        }
      },
      // Sous 1024 px : pas d'épingle, le tracé suit le défilement.
      '(max-width: 1023px)': () => {
        const st = ScrollTrigger.create({
          trigger: liste,
          start: 'top 62%',
          end: 'bottom 62%',
          onRefresh: (self) => {
            geo = verticale()
            rendre(self.progress)
          },
          onUpdate: (self) => rendre(self.progress),
        })
        return () => st.kill()
      },
    })

    await document.fonts.ready
    ScrollTrigger.refresh()

    // Les images plus bas dans la page (Réalisations en a neuf) peuvent
    // encore changer la hauteur du document une fois `load` déclenché.
    if (document.readyState === 'complete') {
      ScrollTrigger.refresh()
    } else {
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })
    }
  })()
}
