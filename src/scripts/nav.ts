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
  const liens = document.getElementById('navLiens')
  if (!bascule || !liens) return

  function fermer(): void {
    bascule?.classList.remove('est-ouvert')
    liens?.classList.remove('est-ouvert')
    bascule?.setAttribute('aria-expanded', 'false')
    bascule?.setAttribute('aria-label', 'Ouvrir le menu')
    document.body.style.overflow = ''
  }

  function ouvrir(): void {
    bascule?.classList.add('est-ouvert')
    liens?.classList.add('est-ouvert')
    bascule?.setAttribute('aria-expanded', 'true')
    bascule?.setAttribute('aria-label', 'Fermer le menu')
    document.body.style.overflow = 'hidden'
  }

  bascule.addEventListener('click', () => {
    liens.classList.contains('est-ouvert') ? fermer() : ouvrir()
  })

  liens.querySelectorAll('a').forEach((lien) => lien.addEventListener('click', fermer))

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && liens.classList.contains('est-ouvert')) {
      fermer()
      bascule.focus()
    }
  })
}
