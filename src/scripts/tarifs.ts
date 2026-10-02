/**
 * Cartes tarif — le tiroir du détail (2 octobre 2026).
 *
 * Devant, de quoi comparer les trois formules d'un coup d'œil. « Voir ce
 * qui est compris » fait monter le détail du bas de la carte ; la flèche
 * du haut du tiroir le referme, comme la touche Échap. Le même geste au
 * bureau et au doigt : un libellé et une flèche, comme la FAQ.
 *
 * Un clic n'importe où sur la carte fait aussi basculer, dans les deux
 * sens (demande d'Adri, 2 octobre 2026) — sauf sur le bouton de la
 * formule, qui garde son lien, et sauf quand le visiteur sélectionne du
 * texte : il lisait, il ne voulait pas tourner la carte.
 *
 * Le tiroir est dans le HTML en permanence, poussé hors de la carte par
 * le CSS, jamais en display: none : Google et un lecteur d'écran lisent
 * le détail. Fermé, il est inerte (hors tabulation) ; ouvert, c'est le
 * recto qui le devient.
 */
export function initTarifs(): void {
  document.querySelectorAll<HTMLElement>('.carte-tarif').forEach((carte) => {
    const recto = carte.querySelector<HTMLElement>('.carte-tarif-recto')
    const tiroir = carte.querySelector<HTMLElement>('.carte-tarif-tiroir')
    const ouvrir = carte.querySelector<HTMLButtonElement>('.carte-tarif-ouvrir')
    const fermer = carte.querySelector<HTMLButtonElement>('.carte-tarif-fermer')
    if (!recto || !tiroir || !ouvrir || !fermer) return

    function poser(ouvert: boolean, focus = true): void {
      carte.classList.toggle('est-ouvert', ouvert)
      ouvrir!.setAttribute('aria-expanded', String(ouvert))
      if (ouvert) {
        tiroir!.removeAttribute('inert')
        recto!.setAttribute('inert', '')
        if (focus) fermer!.focus({ preventScroll: true })
      } else {
        tiroir!.setAttribute('inert', '')
        recto!.removeAttribute('inert')
        if (focus) ouvrir!.focus({ preventScroll: true })
      }
    }

    poser(false, false)
    ouvrir.addEventListener('click', () => poser(true))
    fermer.addEventListener('click', () => poser(false))

    carte.addEventListener('click', (e) => {
      const cible = e.target as HTMLElement
      if (cible.closest('a, button, input, label')) return
      if (window.getSelection()?.toString()) return
      poser(!carte.classList.contains('est-ouvert'), false)
    })
    carte.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && carte.classList.contains('est-ouvert')) poser(false)
    })
  })
}
