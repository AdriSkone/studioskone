/**
 * Le trait courbé sous un mot de titre (2 octobre 2026).
 *
 * Le même geste que le s du logo : un trait épais, bouts coupés net, qui
 * se dessine une fois, quand le titre arrive à l'écran. Il est en encre,
 * ou en papier sur une section sombre (currentColor), jamais en accent :
 * la charte ne garde qu'un mot en couleur sur tout le site.
 *
 * Le tracé est calculé en pixels, à la largeur réelle du mot : étiré par
 * preserveAspectRatio, le trait s'épaissirait de travers. Il est recalculé
 * quand la largeur change. En mouvement réduit, il est simplement là.
 */
import { mouvementReduit } from '../lib/animations'

const NS = 'http://www.w3.org/2000/svg'

function courbe(w: number, h: number): string {
  return `M 0,${h * 0.75} C ${w * 0.3},${h * 0.2} ${w * 0.7},${h * 0.2} ${w},${h * 0.5}`
}

function poser(mot: HTMLElement, dejaTrace: boolean): SVGPathElement {
  mot.querySelector('svg')?.remove()
  const w = mot.getBoundingClientRect().width
  const taille = parseFloat(getComputedStyle(mot).fontSize)
  const h = taille * 0.16
  const svg = document.createElementNS(NS, 'svg')
  svg.setAttribute('width', String(w))
  svg.setAttribute('height', String(h))
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
  svg.setAttribute('aria-hidden', 'true')
  svg.setAttribute('focusable', 'false')
  const chemin = document.createElementNS(NS, 'path')
  chemin.setAttribute('d', courbe(w, h))
  chemin.setAttribute('stroke-width', String(Math.max(4, taille * 0.075)))
  svg.append(chemin)
  mot.append(svg)
  if (!dejaTrace) {
    const longueur = chemin.getTotalLength()
    chemin.style.strokeDasharray = String(longueur)
    chemin.style.strokeDashoffset = String(longueur)
  }
  return chemin
}

export function initTrait(): void {
  const mots = Array.from(document.querySelectorAll<HTMLElement>('.trait-mot'))
  if (!mots.length) return
  const reduit = mouvementReduit()
  const traces = new Set<HTMLElement>()

  const tout = (): void => mots.forEach((m) => poser(m, reduit || traces.has(m)))
  void document.fonts.ready.then(() => {
    tout()
    if (reduit || !('IntersectionObserver' in window)) return
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach((e) => {
        if (!e.isIntersecting) return
        const mot = e.target as HTMLElement
        const chemin = mot.querySelector('path')
        traces.add(mot)
        observateur.unobserve(mot)
        if (!chemin) return
        chemin.getBoundingClientRect()
        chemin.classList.add('est-trace')
        chemin.style.strokeDashoffset = '0'
      })
    }, { threshold: 0.8 })
    mots.forEach((m) => observateur.observe(m))
  })

  let attente = 0
  window.addEventListener('resize', () => {
    window.clearTimeout(attente)
    attente = window.setTimeout(tout, 150)
  })
}
