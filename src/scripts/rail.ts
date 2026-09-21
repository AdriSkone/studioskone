/**
 * Réalisations — double ruban.
 *
 * Le double ruban qui défile n'a plus rien à piloter : les deux rangées
 * tournent par une animation CSS, s'arrêtent au survol par
 * `animation-play-state`, et redeviennent un défilement manuel sur
 * pointeur tactile ou en mouvement réduit. Tout ça tient dans la feuille
 * de styles — voir components/rail.css.
 *
 * Le traitement mobile provisoire (trois cartes visibles, bouton « Voir
 * les 6 autres réalisations », cartes repliées à `inert`) a disparu avec
 * le défilement horizontal, qui donne accès aux neuf projets sans rien
 * replier : cette fonction n'a donc plus rien à faire, mais elle reste un
 * point d'entrée nommé si le ruban a un jour besoin d'un comportement en
 * JavaScript.
 */

export function initRail(): void {}
