/**
 * Cartes tarif — repli de la liste des inclus sous 768 px.
 *
 * La liste reste dans le DOM en permanence : c'est `max-height` qui la
 * rogne en CSS (voir components/carte-tarif.css), jamais `display: none`.
 * Ce module ne fait que basculer une classe et l'attribut `aria-expanded`
 * du bouton — au-delà de 768 px, le CSS ignore cette classe et la liste
 * reste entièrement visible.
 */
export function initTarifs(): void {
  const boutons = document.querySelectorAll<HTMLButtonElement>('.carte-tarif-toggle')

  boutons.forEach((bouton) => {
    const bloc = bouton.closest<HTMLElement>('.carte-tarif-liste-bloc')
    if (!bloc) return

    bouton.addEventListener('click', () => {
      const ouvert = bloc.classList.toggle('est-ouvert')
      bouton.setAttribute('aria-expanded', String(ouvert))
    })
  })
}
