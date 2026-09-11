/**
 * Accordéon de FAQ.
 *
 * Une seule réponse ouverte à la fois. La bascule se fait sur l'attribut
 * `hidden` et non sur une classe : le contenu replié sort alors vraiment
 * de l'arbre d'accessibilité, au lieu d'être seulement invisible à l'œil
 * tout en restant lu par un lecteur d'écran et atteignable au clavier.
 *
 * `aria-controls` relie la question à sa réponse, `aria-expanded` dit son
 * état. Les deux sont posés ici plutôt que dans le HTML : ils décrivent un
 * état qui change, et un attribut d'état écrit en dur finit toujours par
 * mentir.
 */

export function initFaq(racine: ParentNode = document): void {
  const questions = racine.querySelectorAll<HTMLButtonElement>('.faq-question')
  if (!questions.length) return

  questions.forEach((question, index) => {
    const reponse = question.nextElementSibling
    if (!(reponse instanceof HTMLElement)) return

    if (!reponse.id) reponse.id = `faq-reponse-${index + 1}`
    question.setAttribute('aria-controls', reponse.id)
    question.setAttribute('aria-expanded', 'false')
    reponse.hidden = true

    question.addEventListener('click', () => {
      const etaitOuverte = question.getAttribute('aria-expanded') === 'true'

      questions.forEach((autre) => {
        const sonContenu = autre.nextElementSibling
        autre.setAttribute('aria-expanded', 'false')
        if (sonContenu instanceof HTMLElement) sonContenu.hidden = true
      })

      if (!etaitOuverte) {
        question.setAttribute('aria-expanded', 'true')
        reponse.hidden = false
      }
    })
  })
}
