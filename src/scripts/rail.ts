/**
 * Réalisations — double ruban.
 *
 * Le double ruban qui défile n'a plus rien à piloter : les deux rangées
 * tournent par une animation CSS, s'arrêtent au survol par
 * `animation-play-state`, et redeviennent une grille sous 1024 px comme en
 * mouvement réduit. Tout ça tient dans la feuille de styles.
 *
 * Sous 768 px, en revanche, la grille elle-même ne montre que les trois
 * premières cartes réelles : les six autres sont dans le DOM (Google et un
 * lecteur d'écran les lisent), mais leur hauteur visible est nulle — voir
 * components/rail.css. Ce module ne fait qu'un geste : au clic sur le
 * bouton, il retire la classe qui les réduit, et fait disparaître le
 * bouton devenu inutile. Rien de tout ça n'existe au-delà de 768 px : la
 * classe posée ici n'y a aucun effet, le CSS l'ignore.
 *
 * Les copies de boucle (`aria-hidden="true"`) ne sont jamais comptées ici :
 * le CSS les cible par leur attribut, ce script ne les touche pas.
 */

export function initRail(): void {
  const bouton = document.getElementById('realisationsToggle')
  const rubans = document.getElementById('realisationsRubans')
  if (!(bouton instanceof HTMLButtonElement) || !rubans) return

  bouton.addEventListener('click', () => {
    rubans.classList.add('est-etendu')
    bouton.setAttribute('aria-expanded', 'true')
    bouton.hidden = true
  })
}
