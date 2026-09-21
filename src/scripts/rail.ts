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
 * components/rail.css. `max-height: 0` les retire de l'écran, pas de
 * l'ordre de tabulation : sans intervention, un visiteur au clavier tombe
 * dans six liens invisibles avant d'atteindre la suite de la page. C'est
 * `inert` qui les sort de la tabulation et de l'arbre d'accessibilité —
 * sans les retirer du DOM ni du HTML servi, donc sans toucher à ce que
 * Google en lit.
 *
 * `inert` est posé ici, jamais en CSS, et seulement sous 768 px : au-delà,
 * les cartes sont visibles et ne doivent jamais être inertes. Le
 * `matchMedia` réévalue l'état à chaque changement de largeur — un
 * téléphone qui tourne, ou une fenêtre qu'on redimensionne.
 *
 * Les copies de boucle (`aria-hidden="true"`) ne sont jamais comptées ici :
 * le CSS les cible par leur attribut, ce script ne les touche pas.
 */

export function initRail(): void {
  const bouton = document.getElementById('realisationsToggle')
  const rubans = document.getElementById('realisationsRubans')
  if (!(bouton instanceof HTMLButtonElement) || !rubans) return

  // Les trois premières cartes réelles restent toujours accessibles ; les
  // six suivantes sont celles que le CSS replie sous 768 px.
  const cartesReelles = Array.from(rubans.querySelectorAll<HTMLElement>('.carte-projet:not([aria-hidden])'))
  const cartesRepliees = cartesReelles.slice(3)

  const mq = window.matchMedia('(max-width: 767px)')

  function appliquerInert(): void {
    const doitEtreInerte = mq.matches && !rubans!.classList.contains('est-etendu')
    cartesRepliees.forEach((carte) => {
      if (doitEtreInerte) carte.setAttribute('inert', '')
      else carte.removeAttribute('inert')
    })
  }

  appliquerInert()
  mq.addEventListener('change', appliquerInert)

  bouton.addEventListener('click', () => {
    rubans.classList.add('est-etendu')
    bouton.setAttribute('aria-expanded', 'true')
    bouton.hidden = true
    appliquerInert()
  })
}
