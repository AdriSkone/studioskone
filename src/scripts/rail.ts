/**
 * Réalisations — double ruban.
 *
 * Il n'y a plus rien à piloter : les deux rangées défilent par une
 * animation CSS, s'arrêtent au survol par `animation-play-state`, et
 * redeviennent une grille sous 1024 px comme en mouvement réduit. Tout
 * tient dans la feuille de styles.
 *
 * (Ce module épinglait la section et traduisait le défilement vertical en
 * translation horizontale. Le style guide a remplacé ce geste par deux
 * rubans qui tournent d'eux-mêmes.)
 *
 * Il forçait aussi le chargement des dix-huit images dès l'approche de la
 * section : la piste étant déplacée par un transform, le chargement
 * différé du navigateur ne voyait jamais venir celles qui étaient hors
 * champ. Ce n'est plus le cas — les rangées sont des conteneurs
 * défilables, et le lazy natif y sait lire les positions. Le forçage
 * coûtait cher : dix-huit images en parallèle saturaient la bande
 * passante et retardaient le titre du hero, qui est l'élément LCP de la
 * page. 84 en performance avec, 95 sans.
 *
 * Ce fichier ne fait donc plus rien, et c'est le bon résultat.
 */

export function initRail(): void {
  /* Rien à initialiser : le double ruban est entièrement en CSS. */
}
