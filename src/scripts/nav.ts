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
