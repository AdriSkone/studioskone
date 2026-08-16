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
  const offerEl = document.querySelector<HTMLElement>('#estimatorOffer')
  const rangeEl = document.querySelector<HTMLElement>('#estimatorRange')
  const delayEl = document.querySelector<HTMLElement>('#estimatorDelay')
  const cta     = document.querySelector<HTMLAnchorElement>('#estimatorCta')
  // Un seul garde-fou pour les sept sélecteurs : si le markup est incomplet,
  // le composant se tait plutôt que de risquer un crash sur un `!` isolé.
  if (!root || !formEl || !result || !offerEl || !rangeEl || !delayEl || !cta) return

  let started = false
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

    // Non-null : root/formEl/result/offerEl/rangeEl/delayEl/cta sont déjà
    // vérifiés par le garde-fou en tête de fonction, mais le contrôle de
    // flux de TypeScript ne traverse pas cette closure imbriquée.
    offerEl!.textContent = `Offre ${r.offer}`
    rangeEl!.textContent = r.showPrice && r.min !== null && r.max !== null
      ? `${euros(r.min)} – ${euros(r.max)}`
      : 'À définir ensemble'
    delayEl!.textContent = `Livraison estimée · ${r.delay}`
    result!.hidden = false
    track('estimateur-resultat', { offre: r.offer, type: r.projectType })
  }

  formEl.addEventListener('change', update)

  cta.addEventListener('click', () => {
    track('estimateur-vers-contact', { offre: last?.offer ?? 'inconnue' })
    if (!last || !form) return
    form.prefill({
      projectType: last.projectType,
      budget:      last.budget,
      delay:       last.formDelay,
    })
    // L'ancre #contact fait défiler ; on saute d'étape juste après, le temps
    // que le formulaire soit à l'écran.
    setTimeout(() => form.jumpToContact(), 500)
  })
}
