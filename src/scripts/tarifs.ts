/**
 * Cartes tarif — repli de la liste des inclus sous 768 px.
 *
 * La liste reste dans le DOM en permanence : c'est `max-height` qui la
 * rogne en CSS (voir components/carte-tarif.css), jamais `display: none`.
 * Ce module bascule une classe, l'attribut `aria-expanded` du bouton, et
 * pose `inert` sur la liste tant qu'elle est repliée : aujourd'hui elle ne
 * contient que du texte, mais si un lien s'y ajoute un jour, `inert`
 * l'empêchera d'entrer dans l'ordre de tabulation tant qu'il est invisible
 * — au-delà de 768 px, la liste est toujours visible et n'est jamais
 * inerte.
 */
export function initTarifs(): void {
  const boutons = document.querySelectorAll<HTMLButtonElement>('.carte-tarif-toggle')
  const mq = window.matchMedia('(max-width: 767px)')

  boutons.forEach((bouton) => {
    const bloc = bouton.closest<HTMLElement>('.carte-tarif-liste-bloc')
    const liste = bloc?.querySelector<HTMLElement>('.carte-tarif-liste')
    if (!bloc || !liste) return

    function appliquerInert(): void {
      const doitEtreInerte = mq.matches && !bloc!.classList.contains('est-ouvert')
      if (doitEtreInerte) liste!.setAttribute('inert', '')
      else liste!.removeAttribute('inert')
    }

    appliquerInert()
    mq.addEventListener('change', appliquerInert)

    bouton.addEventListener('click', () => {
      const ouvert = bloc!.classList.toggle('est-ouvert')
      bouton.setAttribute('aria-expanded', String(ouvert))
      appliquerInert()
    })
  })
}
