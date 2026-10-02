/**
 * Réalisations — carrousel centré (2 octobre 2026).
 *
 * Le projet actif au centre, ses voisins de part et d'autre. On passe
 * d'un projet à l'autre par les flèches, les points, un clic sur un
 * voisin, les flèches du clavier, un glissement au doigt ou à la souris,
 * ou un geste horizontal au pavé tactile. Le défilement vertical de la
 * page n'est jamais intercepté. Aucun défilement automatique.
 *
 * Les cartes gardent l'ordre de la page (celui choisi par Adri). À
 * l'ouverture, elles sont réordonnées en cercle autour du premier projet,
 * pour qu'il ait des voisins des deux côtés ; le cercle se reforme à
 * chaque changement, le projet actif reste donc toujours au centre.
 *
 * Les largeurs (--a, --n, --ecart) sont calculées ici et posées en CSS :
 * le centrage s'en sert aussi, les deux ne peuvent pas diverger.
 */
import { mouvementReduit } from '../lib/animations'

export function initCarrousel(): void {
  const racine = document.getElementById('carrousel')
  const fenetre = racine?.querySelector<HTMLElement>('.carrousel-fenetre')
  const piste = racine?.querySelector<HTMLElement>('.carrousel-piste')
  if (!racine || !fenetre || !piste) return
  const cartes = Array.from(piste.querySelectorAll<HTMLElement>('.carrousel-carte'))
  const points = Array.from(racine.querySelectorAll<HTMLButtonElement>('.carrousel-point'))
  const n = cartes.length
  if (n < 2) return

  let actif = 0

  function mesures(): { a: number; v: number; ecart: number } {
    const l = window.innerWidth
    if (l < 768) return { a: l * 0.78, v: l * 0.5, ecart: 16 }
    return {
      a: Math.min(680, Math.max(320, l * 0.46)),
      v: Math.min(320, Math.max(200, l * 0.22)),
      ecart: 28,
    }
  }

  // La place de chaque carte dans le cercle : l'active au milieu.
  function position(i: number): number {
    const milieu = Math.floor(n / 2)
    return (((i - actif + milieu) % n) + n) % n
  }

  function poser(animer = true): void {
    const { a, v, ecart } = mesures()
    racine!.style.setProperty('--a', `${a}px`)
    racine!.style.setProperty('--n', `${v}px`)
    racine!.style.setProperty('--ecart', `${ecart}px`)

    // Le cercle se reforme sans animation : seule la translation glisse.
    piste!.style.transition = 'none'
    cartes.forEach((c, i) => {
      c.style.order = String(position(i))
      const est = i === actif
      c.classList.toggle('est-active', est)
      c.setAttribute('aria-hidden', String(!est))
      // Les liens des voisins restent cliquables à la souris (ils centrent
      // leur carte) mais sortent de la tabulation.
      c.querySelectorAll('a').forEach((lien) => { lien.tabIndex = est ? 0 : -1 })
    })
    points.forEach((p, i) => {
      p.classList.toggle('est-actif', i === actif)
      p.setAttribute('aria-current', String(i === actif))
    })

    const milieu = Math.floor(n / 2)
    const gauche = milieu * (v + ecart)
    const x = fenetre!.clientWidth / 2 - (gauche + a / 2)
    piste!.getBoundingClientRect()
    if (animer && !mouvementReduit()) piste!.style.transition = ''
    piste!.style.transform = `translateX(${x}px)`
  }

  function aller(i: number): void {
    const suivant = ((i % n) + n) % n
    if (suivant === actif) return
    // Le cercle bouge d'un cran : on place d'abord la piste à l'ancienne
    // position vue du nouveau cercle, puis on la laisse glisser.
    const { v, ecart } = mesures()
    const pas = position(suivant) - Math.floor(n / 2)
    actif = suivant
    poser(false)
    const base = new DOMMatrix(getComputedStyle(piste!).transform).m41
    piste!.style.transform = `translateX(${base + pas * (v + ecart)}px)`
    piste!.getBoundingClientRect()
    if (!mouvementReduit()) piste!.style.transition = ''
    piste!.style.transform = `translateX(${base}px)`
  }

  racine.querySelectorAll<HTMLButtonElement>('.carrousel-fleche').forEach((b) => {
    b.addEventListener('click', () => aller(actif + Number(b.dataset.sens)))
  })
  points.forEach((p, i) => p.addEventListener('click', () => aller(i)))

  // Un voisin cliqué se centre au lieu d'ouvrir son projet.
  let glisse = false
  cartes.forEach((c, i) => {
    c.addEventListener('click', (e) => {
      if (glisse) { e.preventDefault(); return }
      if (i !== actif) { e.preventDefault(); aller(i) }
    })
  })

  racine.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); aller(actif - 1) }
    if (e.key === 'ArrowRight') { e.preventDefault(); aller(actif + 1) }
  })

  // Glisser au doigt ou à la souris.
  let depart: number | null = null
  fenetre.addEventListener('pointerdown', (e) => { depart = e.clientX; glisse = false })
  window.addEventListener('pointermove', (e) => {
    if (depart !== null && Math.abs(e.clientX - depart) > 8) glisse = true
  })
  window.addEventListener('pointerup', (e) => {
    if (depart === null) return
    const dx = e.clientX - depart
    depart = null
    if (Math.abs(dx) > 40) aller(actif + (dx < 0 ? 1 : -1))
    window.setTimeout(() => { glisse = false }, 0)
  })
  window.addEventListener('pointercancel', () => { depart = null })
  fenetre.addEventListener('dragstart', (e) => e.preventDefault())

  // Pavé tactile et molette horizontale : un geste, un projet.
  let cumul = 0
  let verrou = false
  fenetre.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
    e.preventDefault()
    if (verrou) return
    cumul += e.deltaX
    if (Math.abs(cumul) > 50) {
      aller(actif + (cumul > 0 ? 1 : -1))
      cumul = 0
      verrou = true
      window.setTimeout(() => { verrou = false }, 650)
    }
  }, { passive: false })

  let attente = 0
  window.addEventListener('resize', () => {
    window.clearTimeout(attente)
    attente = window.setTimeout(() => poser(false), 120)
  })

  racine.classList.add('est-anime')
  racine.tabIndex = 0
  poser(false)
}
