/**
 * Le parcours unique — estimateur et formulaire de contact fusionnés.
 *
 * Depuis le 2 octobre 2026, deux écrans seulement :
 *
 *   1. Les trois questions du prix, toutes visibles, et à côté le prix qui
 *      se construit à chaque réponse. Rien n'est caché derrière un écran
 *      suivant : le visiteur voit ce que change chacune de ses réponses.
 *   2. Le contact : le budget, les coordonnées, le consentement.
 *
 * Le budget a quitté l'avant du résultat. Il était demandé avant pour que
 * le visiteur donne le sien sans recopier le chiffre affiché ; avec un
 * prix visible en direct, cet ordre ne tenait plus.
 *
 * Tous les écrans sont dans le HTML dès le départ. Si le script n'arrive
 * pas, la page reste lisible et les questions restent indexables.
 *
 * Le calcul du prix n'est pas ici : il vit dans
 * components/estimator-pricing, qui est pur et couvert par ses tests.
 */

import { estimate } from '../components/estimator-pricing'
import type { Estimate, SiteType, SizeChoice, ContentChoice } from '../components/estimator-pricing'
import { suivre } from '../lib/suivi'

const ENDPOINT = 'https://formspree.io/f/mjgjwdka'
const QUESTIONS_PRIX = ['type', 'size', 'content'] as const

const montant = (n: number): string => `${n.toLocaleString('fr-FR')} €`

/** Le prix tel qu'on l'écrit : « 900 € », « 2 300 à 2 500 € », « À partir de 3 300 € ». */
export function prixEcrit(r: Estimate): string {
  if (!r.showPrice || r.prix === null) return 'Sur devis'
  const valeur = r.prixMax
    ? `${r.prix.toLocaleString('fr-FR')} à ${montant(r.prixMax)}`
    : montant(r.prix)
  return r.prixDepuis ? `À partir de ${valeur}` : valeur
}

export function initParcours(): void {
  const racine = document.getElementById('parcours')
  const form = document.getElementById('parcoursForm') as HTMLFormElement | null
  if (!racine || !form) return

  const ecrans = Array.from(form.querySelectorAll<HTMLElement>('.parcours-ecran'))
  const suivant = document.getElementById('parcoursSuivant') as HTMLButtonElement | null
  const precedent = document.getElementById('parcoursPrecedent') as HTMLButtonElement | null
  const envoyerBtn = document.getElementById('parcoursEnvoyer') as HTMLButtonElement | null
  const succes = document.getElementById('parcoursSucces')
  const offre = document.getElementById('parcoursOffre')
  const prix = document.getElementById('parcoursPrix')
  const delai = document.getElementById('parcoursDelai')
  const ajustement = document.getElementById('parcoursAjustement')
  const recap = document.getElementById('parcoursRecap')
  const modifier = document.getElementById('parcoursModifier')
  const noteBudget = document.getElementById('parcoursNoteBudget')
  if (ecrans.length < 2 || !suivant || !precedent || !envoyerBtn || !succes || !offre || !prix || !delai || !ajustement || !recap || !modifier || !noteBudget) return

  const ATTENTE = offre.textContent ?? ''

  /* ── Suivi de l'entonnoir ───────────────────────────────── */

  // Un événement par marche, compté une fois par visite :
  // parcours-vu → parcours-type → parcours-taille → parcours-contenu →
  // parcours-resultat → parcours-budget → estimation-envoyee.
  // `origine` distingue le visiteur arrivé par une carte tarifaire.
  const MARCHES: Record<string, string> = {
    type: 'parcours-type',
    size: 'parcours-taille',
    content: 'parcours-contenu',
    budget: 'parcours-budget',
  }
  const franchies = new Set<string>()
  let origine = 'direct'

  function marche(nom: string, donnees: Record<string, string> = {}): void {
    if (franchies.has(nom)) return
    franchies.add(nom)
    suivre(nom, { origine, ...donnees })
  }

  /* ── Réponses ───────────────────────────────────────────── */

  function reponse(cle: string): string {
    return form!.querySelector<HTMLInputElement>(`input[name="${cle}"]:checked`)?.value ?? ''
  }

  function resultat(): Estimate | null {
    const type = reponse('type') as SiteType
    const size = reponse('size') as SizeChoice
    const content = reponse('content') as ContentChoice
    if (!type || !size || !content) return null
    return estimate({ type, size, content })
  }

  /* ── Le prix en direct ──────────────────────────────────── */

  function afficher(): void {
    const r = resultat()
    const pret = r !== null
    suivant!.disabled = !pret
    suivant!.setAttribute('aria-disabled', String(!pret))

    if (!r) {
      offre!.textContent = ATTENTE
      prix!.hidden = delai!.hidden = ajustement!.hidden = true
      return
    }

    offre!.textContent = `Formule ${r.formule}`
    prix!.hidden = false
    prix!.textContent = prixEcrit(r)
    delai!.hidden = false
    delai!.textContent = r.formule === 'Sur mesure'
      ? `Délai ${r.delay}`
      : `Livré en ${r.delay}, à partir de la réception des textes et des photos`
    ajustement!.hidden = !r.ajustement
    ajustement!.textContent = r.ajustement ?? ''
    marche('parcours-resultat', { formule: r.formule })
  }

  /* ── Écrans ─────────────────────────────────────────────── */

  function montrer(index: number, focus = true): void {
    ecrans.forEach((e, i) => { e.hidden = i !== index })
    if (index === 1) {
      const r = resultat()
      recap!.textContent = r ? `Formule ${r.formule} · ${prixEcrit(r)}` : ''
    }
    // Le focus suit l'écran : sans cela, la tabulation repartirait du haut.
    if (focus) {
      const premier = ecrans[index].querySelector<HTMLElement>('input, textarea, select')
      premier?.focus({ preventScroll: true })
      racine!.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }

  function contactValide(): boolean {
    const nom = (form!.querySelector('#p-nom') as HTMLInputElement | null)?.value.trim()
    const email = (form!.querySelector('#p-email') as HTMLInputElement | null)?.value.trim()
    const rgpd = (form!.querySelector('#p-rgpd') as HTMLInputElement | null)?.checked
    return Boolean(nom && email && /.+@.+\..+/.test(email) && rgpd)
  }

  function majEnvoyer(): void {
    const ok = contactValide()
    envoyerBtn!.disabled = !ok
    envoyerBtn!.setAttribute('aria-disabled', String(!ok))
  }

  /* ── Envoi ──────────────────────────────────────────────── */

  function envoyer(): void {
    const r = resultat()
    const donnees = new FormData()
    donnees.append('projectType', reponse('type'))
    donnees.append('taille', reponse('size'))
    donnees.append('contenu', reponse('content'))
    donnees.append('budget', reponse('budget'))
    ;['nom', 'email', 'description'].forEach((cle) => {
      const champ = form!.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#p-${cle}`)
      if (champ) donnees.append(cle, champ.value.trim())
    })
    // La formule et le prix affichés partent avec la demande : sans eux,
    // le mail ne dit pas ce que le visiteur a vu à l'écran.
    if (r) {
      donnees.append('formule', r.formule)
      donnees.append('prixAffiche', prixEcrit(r))
    }

    envoyerBtn!.disabled = true
    envoyerBtn!.classList.add('est-en-cours')
    marche('estimation-envoyee', { formule: r?.formule ?? '' })

    void fetch(ENDPOINT, { method: 'POST', headers: { Accept: 'application/json' }, body: donnees })
      .then((rep) => {
        if (!rep.ok) throw new Error('envoi refusé')
        form!.hidden = true
        succes!.hidden = false
        succes!.focus?.()
      })
      .catch(() => {
        suivre('parcours-erreur', { origine })
        envoyerBtn!.disabled = false
        envoyerBtn!.textContent = 'Erreur · réessayer'
      })
      .finally(() => envoyerBtn!.classList.remove('est-en-cours'))
  }

  /* ── Liaisons ───────────────────────────────────────────── */

  /**
   * Un budget plus bas que le prix de départ ne bloque pas l'envoi : un
   * artisan à 2 000 € qui demande une boutique peut finir sur un Site
   * complet, et c'est un contact à ne pas perdre. Une phrase le prévient.
   */
  const PLAFOND: Record<string, number> = { '1k-3k': 3000, '3k-5k': 5000, '5k-10k': 10000 }
  function majNoteBudget(): void {
    const r = resultat()
    const plafond = PLAFOND[reponse('budget')]
    const sous = r !== null && r.prix !== null && plafond !== undefined &&
      (r.prix > plafond || (r.prix === plafond && (r.prixDepuis || r.prixMax !== null)))
    noteBudget!.hidden = !sous
    if (sous && r?.prix) {
      noteBudget!.textContent = (racine!.dataset.noteBudget ?? '').replace('{prix}', montant(r.prix))
    }
  }

  form.addEventListener('change', (e) => {
    const cible = e.target as HTMLInputElement
    if (cible.type === 'radio' && MARCHES[cible.name]) marche(MARCHES[cible.name])
    if ((QUESTIONS_PRIX as readonly string[]).includes(cible.name)) afficher()
    majNoteBudget()
    majEnvoyer()
  })
  form.addEventListener('input', majEnvoyer)

  suivant.addEventListener('click', () => { if (resultat()) montrer(1) })
  precedent.addEventListener('click', () => montrer(0))
  modifier.addEventListener('click', () => montrer(0))
  envoyerBtn.addEventListener('click', () => { if (contactValide()) envoyer() })

  // Entrée envoie depuis l'écran contact, comme un formulaire ordinaire.
  form.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target instanceof HTMLTextAreaElement) return
    e.preventDefault()
    if (!ecrans[1].hidden && contactValide()) envoyer()
  })

  /**
   * Les boutons des cartes tarifaires arrivent avec ?formule=… Le parcours
   * coche alors les réponses correspondantes : le visiteur qui a déjà
   * choisi sa formule voit son prix tout de suite. « sur-mesure » ne coche
   * rien : la carte couvre aussi bien les boutiques que les applications.
   */
  const PRESELECTION: Record<string, { type: SiteType; size?: SizeChoice }> = {
    'une-page': { type: 'vitrine', size: '1' },
    'site-complet': { type: 'vitrine' },
  }

  function cocher(nom: string, valeur: string): boolean {
    const champ = form!.querySelector<HTMLInputElement>(`input[name="${nom}"][value="${valeur}"]`)
    if (!champ) return false
    champ.checked = true
    return true
  }

  const formule = new URLSearchParams(location.search).get('formule')
  const pre = formule ? PRESELECTION[formule] : undefined
  if (pre) {
    origine = 'carte'
    marche('parcours-vu')
    if (cocher('type', pre.type)) marche(MARCHES.type)
    if (pre.size && cocher('size', pre.size)) marche(MARCHES.size)
  }

  // Première marche : le parcours a été vu, pas seulement chargé.
  if ('IntersectionObserver' in window) {
    const observateur = new IntersectionObserver((entrees) => {
      if (entrees.some((e) => e.isIntersecting)) {
        marche('parcours-vu')
        observateur.disconnect()
      }
    }, { threshold: 0.25 })
    observateur.observe(racine)
  }

  montrer(0, false)
  afficher()
  majEnvoyer()
}
