/**
 * Le parcours unique — estimateur et formulaire de contact fusionnés.
 *
 * Une question par écran, six écrans : quatre questions, la fourchette,
 * puis les coordonnées. Le visiteur ne saisit jamais deux fois la même
 * chose — le type de projet n'est demandé qu'une fois, et le délai plus du
 * tout puisque la fourchette l'annonce.
 *
 * Le budget est demandé AVANT que la fourchette ne s'affiche. Posé après,
 * le visiteur reprendrait le chiffre qu'on vient de lui montrer au lieu de
 * donner le sien.
 *
 * Tous les écrans sont dans le HTML dès le départ ; ce module ne fait que
 * les montrer l'un après l'autre. Si le script n'arrive pas, la page reste
 * lisible et les questions restent indexables.
 *
 * Le calcul de la fourchette n'est pas ici : il vit dans
 * components/estimator-pricing, qui est pur et couvert par dix-huit tests.
 * Ce module ne fait que lui passer les réponses.
 */

import { estimate } from '../components/estimator-pricing'
import type { SiteType, SizeChoice, ContentChoice } from '../components/estimator-pricing'

const ENDPOINT = 'https://formspree.io/f/mjgjwdka'

export function initParcours(): void {
  const racine = document.getElementById('parcours')
  const form = document.getElementById('parcoursForm') as HTMLFormElement | null
  if (!racine || !form) return

  const ecrans = Array.from(form.querySelectorAll<HTMLElement>('.parcours-ecran'))
  const remplissage = racine.querySelector<HTMLElement>('.parcours-progression-remplissage')
  const precedent = document.getElementById('parcoursPrecedent') as HTMLButtonElement | null
  const suivant = document.getElementById('parcoursSuivant') as HTMLButtonElement | null
  const succes = document.getElementById('parcoursSucces')
  if (!ecrans.length || !precedent || !suivant || !succes) return

  const LIBELLE_SUIVANT = suivant.textContent ?? 'Continuer'
  const LIBELLE_ENVOYER = 'Discuter de mon projet'

  let courant = 0

  /* ── Affichage ──────────────────────────────────────────── */

  function montrer(index: number, focus = true): void {
    courant = index
    ecrans.forEach((e, i) => {
      const actif = i === index
      e.hidden = !actif
      e.classList.toggle('est-actif', actif)
    })

    if (remplissage) {
      remplissage.style.transform = `scaleX(${(index + 1) / ecrans.length})`
    }

    precedent!.hidden = index === 0
    suivant!.textContent = index === ecrans.length - 1 ? LIBELLE_ENVOYER : LIBELLE_SUIVANT

    // Le focus suit l'écran : sans cela, la tabulation repartirait du haut
    // de la page à chaque étape.
    if (focus) {
      const premier = ecrans[index].querySelector<HTMLElement>('input, textarea, select')
      premier?.focus({ preventScroll: true })
    }
  }

  /* ── Validation ─────────────────────────────────────────── */

  function reponse(cle: string): string {
    return form!.querySelector<HTMLInputElement>(`input[name="${cle}"]:checked`)?.value ?? ''
  }

  function ecranValide(index: number): boolean {
    const ecran = ecrans[index]
    const question = ecran.dataset.question
    if (question) return reponse(question) !== ''

    // Écran des coordonnées : le nom, un e-mail plausible, et le consentement.
    if (index === ecrans.length - 1) {
      const nom = (form!.querySelector('#p-nom') as HTMLInputElement | null)?.value.trim()
      const email = (form!.querySelector('#p-email') as HTMLInputElement | null)?.value.trim()
      const rgpd = (form!.querySelector('#p-rgpd') as HTMLInputElement | null)?.checked
      return Boolean(nom && email && /.+@.+\..+/.test(email) && rgpd)
    }
    return true
  }

  function majBoutonSuivant(): void {
    const ok = ecranValide(courant)
    suivant!.disabled = !ok
    suivant!.setAttribute('aria-disabled', String(!ok))
  }

  /* ── Résultat ───────────────────────────────────────────── */

  function calculer(): void {
    const type = reponse('type') as SiteType
    const size = reponse('size') as SizeChoice
    const content = reponse('content') as ContentChoice
    if (!type || !size || !content) return

    const r = estimate({ type, size, content })

    const offre = document.getElementById('parcoursOffre')
    const prix = document.getElementById('parcoursPrix')
    const delai = document.getElementById('parcoursDelai')
    if (!offre || !prix || !delai) return

    offre.textContent = `Formule ${r.formule}`

    if (r.showPrice && r.prix !== null) {
      const montant = `${r.prix.toLocaleString('fr-FR')} €`
      prix.textContent = r.prixDepuis ? `À partir de ${montant}` : montant
      delai.hidden = false
      delai.textContent = r.ajustement
        ? `Livraison · ${r.delay} — ${r.ajustement}`
        : `Livraison · ${r.delay}`
    } else {
      prix.textContent = 'À définir ensemble'
      delai.hidden = true
      delai.textContent = ''
    }
  }

  /* ── Envoi ──────────────────────────────────────────────── */

  function envoyer(): void {
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
    const r = estimate({
      type: reponse('type') as SiteType,
      size: reponse('size') as SizeChoice,
      content: reponse('content') as ContentChoice,
    })
    donnees.append('formule', r.formule)
    donnees.append('prixAffiche', r.prix === null ? 'à définir' : `${r.prixDepuis ? 'à partir de ' : ''}${r.prix} €`)

    suivant!.disabled = true
    suivant!.classList.add('est-en-cours')

    // Umami ne pose pas de cookie : rien à demander au visiteur.
    ;(window as unknown as { umami?: { track: (n: string, d?: unknown) => void } }).umami?.track(
      'estimation-envoyee',
      { formule: r.formule }
    )

    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: donnees,
    })
      .then((r) => {
        if (!r.ok) throw new Error('envoi refusé')
        form!.hidden = true
        succes!.hidden = false
        succes!.focus?.()
      })
      .catch(() => {
        suivant!.disabled = false
        suivant!.textContent = 'Erreur · réessayer'
      })
      .finally(() => suivant!.classList.remove('est-en-cours'))
  }

  /* ── Liaisons ───────────────────────────────────────────── */

  suivant.addEventListener('click', () => {
    if (!ecranValide(courant)) return
    if (courant === ecrans.length - 1) {
      envoyer()
      return
    }
    // L'écran du résultat se calcule au moment où on y arrive.
    if (ecrans[courant + 1].hasAttribute('data-resultat')) calculer()
    montrer(courant + 1)
    majBoutonSuivant()
  })

  precedent.addEventListener('click', () => {
    if (courant > 0) {
      montrer(courant - 1)
      majBoutonSuivant()
    }
  })

  // Un choix fait avance tout seul : c'est une question par écran, il n'y
  // a rien d'autre à y faire. Le délai laisse voir que la réponse a été
  // prise en compte avant que l'écran ne change.
  form.addEventListener('change', (e) => {
    majBoutonSuivant()
    const cible = e.target as HTMLElement
    if (cible instanceof HTMLInputElement && cible.type === 'radio' && ecranValide(courant)) {
      window.setTimeout(() => {
        if (courant === ecrans.length - 1) return
        if (ecrans[courant + 1].hasAttribute('data-resultat')) calculer()
        montrer(courant + 1)
        majBoutonSuivant()
      }, 250)
    }
  })

  form.addEventListener('input', majBoutonSuivant)

  // Entrée fait avancer, comme un formulaire ordinaire.
  form.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault()
      if (ecranValide(courant)) suivant.click()
    }
  })

  /**
   * Les boutons des cartes tarifaires arrivent avec ?formule=… Le parcours
   * coche alors les réponses correspondantes et démarre à la question
   * suivante : le visiteur qui a déjà choisi sa formule ne la ressaisit pas.
   */
  const PRESELECTION: Record<string, { type: SiteType; size?: SizeChoice }> = {
    'une-page':    { type: 'vitrine', size: '1' },
    'site-complet': { type: 'vitrine', size: '2-5' },
    'sur-mesure':  { type: 'boutique' },
  }

  function cocher(nom: string, valeur: string): boolean {
    const champ = form!.querySelector<HTMLInputElement>(`input[name="${nom}"][value="${valeur}"]`)
    if (!champ) return false
    champ.checked = true
    return true
  }

  const formule = new URLSearchParams(location.search).get('formule')
  const pre = formule ? PRESELECTION[formule] : undefined
  let depart = 0
  if (pre) {
    if (cocher('type', pre.type)) depart = 1
    if (pre.size && cocher('size', pre.size)) depart = 2
  }
  montrer(depart, false)
  majBoutonSuivant()
}
