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

  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)')
  let animation = 0
  let derniereFourchette: [number, number] | null = null

  // Les montants défilent jusqu'à leur valeur : c'est le moment où le
  // visiteur regarde vraiment, donc le seul qui mérite d'être animé.
  function afficherFourchette(min: number, max: number): void {
    cancelAnimationFrame(animation)

    if (mouvementReduit.matches) {
      rangeEl!.textContent = `${euros(min)} – ${euros(max)}`
      derniereFourchette = [min, max]
      return
    }

    const depart = derniereFourchette ?? [0, 0]
    const debut = performance.now()
    const DUREE = 480

    // aria-busy le temps du décompte, sinon un lecteur d'écran annoncerait
    // chaque image intermédiaire de l'animation.
    result!.setAttribute('aria-busy', 'true')

    const etape = (maintenant: number): void => {
      const t = Math.min(1, (maintenant - debut) / DUREE)
      const progression = 1 - Math.pow(1 - t, 3)
      const a = Math.round((depart[0] + (min - depart[0]) * progression) / 10) * 10
      const b = Math.round((depart[1] + (max - depart[1]) * progression) / 10) * 10
      rangeEl!.textContent = `${euros(a)} – ${euros(b)}`

      if (t < 1) {
        animation = requestAnimationFrame(etape)
      } else {
        rangeEl!.textContent = `${euros(min)} – ${euros(max)}`
        result!.setAttribute('aria-busy', 'false')
      }
    }

    animation = requestAnimationFrame(etape)
    derniereFourchette = [min, max]
  }

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
    if (r.showPrice && r.min !== null && r.max !== null) {
      afficherFourchette(r.min, r.max)
    } else {
      cancelAnimationFrame(animation)
      rangeEl!.textContent = 'À définir ensemble'
      derniereFourchette = null
    }

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
