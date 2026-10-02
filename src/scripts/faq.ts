/**
 * Accordéon de FAQ.
 *
 * Plusieurs réponses peuvent être ouvertes à la fois (2 octobre 2026) :
 * fermer les autres faisait sauter la page vers le haut à chaque clic, et
 * le visiteur y perdait sa place. La bascule se fait sur l'attribut
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
      const ouverte = question.getAttribute('aria-expanded') !== 'true'
      question.setAttribute('aria-expanded', String(ouverte))
      reponse.hidden = !ouverte
    })
  })
}
