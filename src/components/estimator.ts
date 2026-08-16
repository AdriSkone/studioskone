import { estimate } from './estimator-pricing'
import type { SiteType, SizeChoice, ContentChoice } from './estimator-pricing'
import type { ContactFormHandle } from './contact-form'

type UmamiWindow = Window & {
  umami?: { track: (event: string, data?: Record<string, unknown>) => void }
}

function track(event: string, data?: Record<string, unknown>): void {
  ;(window as UmamiWindow).umami?.track(event, data)
}

const euros = (n: number): string => n.toLocaleString('fr-FR') + ' €'

export function initEstimator(form: ContactFormHandle | null): void {
  const root = document.querySelector<HTMLElement>('#estimator')
  const formEl = document.querySelector<HTMLFormElement>('#estimatorForm')
  const result = document.querySelector<HTMLElement>('#estimatorResult')
  const resultInner = document.querySelector<HTMLElement>('.estimator-result-inner')
  const offerEl = document.querySelector<HTMLElement>('#estimatorOffer')
  const rangeEl = document.querySelector<HTMLElement>('#estimatorRange')
  const delayEl = document.querySelector<HTMLElement>('#estimatorDelay')
  const cta     = document.querySelector<HTMLAnchorElement>('#estimatorCta')
  // Un seul garde-fou pour les huit sélecteurs : si le markup est incomplet,
  // le composant se tait plutôt que de risquer un crash sur un `!` isolé.
  if (!root || !formEl || !result || !resultInner || !offerEl || !rangeEl || !delayEl || !cta) return

  // Aucun bouton submit n'existe dans ce formulaire, mais cette ligne
  // supprime tout risque de rechargement de page selon les navigateurs.
  formEl.addEventListener('submit', e => e.preventDefault())

  let started = false
  let resultTracked = false
  let last: ReturnType<typeof estimate> | null = null

  const read = (name: string): string | null =>
    formEl.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? null

  function update(): void {
    if (!started) {
      started = true
      track('estimateur-demarre')
    }

    const type = read('type') as SiteType | null
    const size = read('size') as SizeChoice | null
    const content = read('content') as ContentChoice | null
    if (!type || !size || !content) return

    const r = estimate({ type, size, content })
    last = r

    // Non-null : root/formEl/result/resultInner/offerEl/rangeEl/delayEl/cta
    // sont déjà vérifiés par le garde-fou en tête de fonction, mais le
    // contrôle de flux de TypeScript ne traverse pas cette closure imbriquée.
    offerEl!.textContent = r.offerNamed
      ? `Offre ${r.offer}`
      : 'Entre les offres Fondation et Studio · on cadre ensemble'
    rangeEl!.textContent = r.showPrice && r.min !== null && r.max !== null
      ? `${euros(r.min)} – ${euros(r.max)}`
      : 'À définir ensemble'

    // Cas application : la fourchette affiche déjà « à définir ensemble »,
    // répéter la même formule sur la ligne délai serait redondant.
    if (r.showPrice) {
      delayEl!.hidden = false
      delayEl!.textContent = `Livraison estimée · ${r.delay}`
    } else {
      delayEl!.hidden = true
      delayEl!.textContent = ''
    }

    // #estimatorResult reste en permanence dans l'arbre d'accessibilité
    // (aria-live="polite" sans hidden) : seul son contenu interne est
    // masqué/révélé, sinon une région live absente au moment de la mutation
    // n'annonce jamais la première estimation.
    resultInner!.hidden = false

    if (!resultTracked) {
      resultTracked = true
      track('estimateur-resultat', { offre: r.offer, type: r.projectType })
    }
  }

  formEl.addEventListener('change', update)

  cta.addEventListener('click', () => {
    track('estimateur-vers-contact', { offre: last?.offer ?? 'inconnue' })
    if (!last || !form) return
    form.prefill({
      projectType: last.projectType,
      budget:      last.budget,
    })
    // L'ancre #contact fait défiler la page ; le saut d'étape n'a pas besoin
    // d'attendre la fin du défilement, une transition pendant le défilement
    // n'est pas un problème.
    form.jumpToDelay()
  })
}
