/**
 * Barre de navigation.
 *
 * Deux comportements, et rien de plus : la barre se réduit une fois le
 * hero dépassé, et le menu s'ouvre en petit écran.
 *
 * Le suivi du défilement passe par un IntersectionObserver posé sur le
 * hero plutôt que par un écouteur de scroll. L'écouteur se déclenche à
 * chaque frame de défilement pour ne répondre qu'à une seule question —
 * « a-t-on dépassé le hero ? » — alors que l'observateur ne réveille le
 * navigateur qu'au franchissement.
 */

export function initNav(): void {
  const nav = document.getElementById('nav')
  if (!nav) return

  const hero = document.getElementById('hero')
  if (hero) {
    const observateur = new IntersectionObserver(
      ([entree]) => nav.classList.toggle('est-reduite', !entree.isIntersecting),
      // La bascule se fait quand le bas du hero passe sous la barre.
      { rootMargin: '-96px 0px 0px 0px', threshold: 0 }
    )
    observateur.observe(hero)
  }

  suivreLaSection()
  suivreLeFond(nav)

  const bascule = document.getElementById('navBascule')
  const panneau = document.getElementById('navPanneau')
  if (!bascule || !panneau) return

  const focusables = () =>
    Array.from(
      panneau.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    ).filter((el) => el.offsetParent !== null)

  // La cascade de 60 ms est portée par le CSS ; le script ne fait que
  // numéroter les entrées, une fois, à l'initialisation.
  panneau.querySelectorAll<HTMLElement>('.nav-lien').forEach((lien, i) => {
    lien.style.setProperty('--i', String(i))
  })
  const actions = panneau.querySelector<HTMLElement>('.nav-actions')
  actions?.style.setProperty('--i', String(panneau.querySelectorAll('.nav-lien').length))

  function fermer(rendreLeFocus = true): void {
    if (!bascule || !panneau) return
    // La croix pivote d'un quart de tour pendant qu'elle redevient deux
    // traits : la classe tombe à la fin de la transition.
    bascule.classList.add('est-en-fermeture')
    window.setTimeout(() => bascule.classList.remove('est-en-fermeture'), 300)

    bascule.classList.remove('est-ouvert')
    panneau.classList.remove('est-ouvert')
    nav?.classList.remove('est-menu-ouvert')
    bascule.setAttribute('aria-expanded', 'false')
    bascule.setAttribute('aria-label', 'Ouvrir le menu')
    document.body.style.overflow = ''
    if (rendreLeFocus) bascule.focus()
  }

  function ouvrir(): void {
    if (!bascule || !panneau) return
    bascule.classList.add('est-ouvert')
    panneau.classList.add('est-ouvert')
    nav?.classList.add('est-menu-ouvert')
    bascule.setAttribute('aria-expanded', 'true')
    bascule.setAttribute('aria-label', 'Fermer le menu')
    document.body.style.overflow = 'hidden'
    // Le premier lien reçoit le focus : la tabulation commence dans le
    // menu, pas derrière lui.
    focusables()[0]?.focus()
  }

  bascule.addEventListener('click', () => {
    panneau.classList.contains('est-ouvert') ? fermer() : ouvrir()
  })

  // Un lien qui mène ailleurs ferme le menu, mais sans reprendre le focus :
  // il part sur la cible du lien.
  panneau.querySelectorAll('a').forEach((lien) => lien.addEventListener('click', () => fermer(false)))

  document.addEventListener('keydown', (e) => {
    if (!panneau.classList.contains('est-ouvert')) return

    if (e.key === 'Escape') {
      fermer()
      return
    }

    // Piège de focus : la tabulation tourne en boucle dans le menu tant
    // qu'il est ouvert. Sans lui, elle repart dans la page masquée
    // derrière, que le visiteur ne voit pas.
    if (e.key !== 'Tab') return
    const liste = [bascule, ...focusables()]
    const premier = liste[0]
    const dernier = liste[liste.length - 1]
    const actif = document.activeElement

    if (e.shiftKey && actif === premier) {
      e.preventDefault()
      dernier.focus()
    } else if (!e.shiftKey && actif === dernier) {
      e.preventDefault()
      premier.focus()
    }
  })

  // Repasser en grand écran avec le menu ouvert laisserait le défilement
  // bloqué et le bouton dans l'état « fermer ».
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && panneau.classList.contains('est-ouvert')) fermer(false)
  })
}

/**
 * Le point d'accent sous l'entrée de la section en cours de lecture
 * (STYLE_GUIDE § 7). Le CSS existait, rien ne posait `aria-current` :
 * branché le 2 octobre 2026.
 *
 * Une ligne de lecture au milieu de l'écran : la section qui la traverse
 * est la section lue. Les engagements prolongent les tarifs et allument
 * « Tarifs » ; l'estimateur et la FAQ n'ont pas d'entrée, rien ne s'allume.
 */
function suivreLaSection(): void {
  const liens = Array.from(document.querySelectorAll<HTMLAnchorElement>('.nav-lien[href^="#"]'))
  const parId = new Map<string, HTMLAnchorElement[]>()
  liens.forEach((l) => {
    const id = l.getAttribute('href')!.slice(1)
    parId.set(id, [...(parId.get(id) ?? []), l])
  })
  const sections = Array.from(parId.keys())
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => el !== null)
    // Dans l'ordre de la page, pas du menu : les réalisations passent
    // avant la méthode dans la page, après elle dans le menu.
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
  if (!sections.length) return

  // Un seul point pour tout le menu : il glisse sous l'entrée de la
  // section lue au lieu de réapparaître d'une entrée à l'autre. Les autres
  // entrées passent en retrait (CSS). Choisi par Adri le 2 octobre 2026.
  const barre = document.getElementById('navLiens')
  let indicateur: HTMLElement | null = null
  if (barre) {
    indicateur = document.createElement('span')
    indicateur.className = 'nav-indicateur'
    indicateur.setAttribute('aria-hidden', 'true')
    barre.append(indicateur)
  }

  function placerIndicateur(): void {
    if (!indicateur || !barre) return
    const lien = barre.querySelector<HTMLElement>('.nav-lien[aria-current="true"]')
    indicateur.classList.toggle('est-visible', Boolean(lien))
    if (!lien) return
    const x = lien.offsetLeft + lien.offsetWidth / 2 - 3
    indicateur.style.transform = `translateX(${x}px)`
  }

  let courante = ''
  function allumer(id: string): void {
    if (id === courante) return
    courante = id
    liens.forEach((l) => l.removeAttribute('aria-current'))
    parId.get(id)?.forEach((l) => l.setAttribute('aria-current', 'true'))
    placerIndicateur()
  }

  // Les sections qui allument l'entrée d'une autre.
  const PROLONGE: Record<string, string> = { garanties: 'tarifs' }
  const zones = [...sections, ...Object.keys(PROLONGE).map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null)]

  // Mesurée à la frame, pas à chaque événement de défilement.
  let attente = false
  function mesurer(): void {
    attente = false
    const ligne = window.innerHeight * 0.5
    let id = ''
    for (const s of zones) {
      const r = (s.closest<HTMLElement>('.pin-spacer') ?? s).getBoundingClientRect()
      if (r.top <= ligne && r.bottom > ligne) id = PROLONGE[s.id] ?? s.id
    }
    allumer(id)
  }
  const demander = (): void => {
    if (attente) return
    attente = true
    requestAnimationFrame(mesurer)
  }
  window.addEventListener('scroll', demander, { passive: true })
  window.addEventListener('resize', () => { demander(); placerIndicateur() })
  mesurer()
}

/**
 * La barre flottante prend la couleur opposée à ce qu'il y a dessous :
 * encre sur le papier, papier sur une section sombre (2 octobre 2026).
 * On regarde ce qui est sous le centre de la barre, la barre et le
 * curseur mis de côté. Mesuré à la frame, au défilement.
 */
function suivreLeFond(nav: HTMLElement): void {
  const barre = nav.querySelector<HTMLElement>('.nav-interieur')
  if (!barre) return
  let attente = false
  function mesurer(): void {
    attente = false
    const r = barre!.getBoundingClientRect()
    const dessous = document
      .elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
      .find((el) => !nav.contains(el) && el.id !== 'curseur')
    nav.classList.toggle('sur-sombre', Boolean(dessous?.closest('.sombre')))
  }
  const demander = (): void => {
    if (attente) return
    attente = true
    requestAnimationFrame(mesurer)
  }
  window.addEventListener('scroll', demander, { passive: true })
  window.addEventListener('resize', demander)
  mesurer()
}
