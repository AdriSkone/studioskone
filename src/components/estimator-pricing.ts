export type SiteType = 'vitrine' | 'vitrine-plus' | 'boutique' | 'application'
/**
 * Tailles alignées sur les formules (2 octobre 2026) : Une page couvre
 * une page, Site complet de 2 à 6 pages. « 2-3 » et « 4-6 » restent
 * séparés pour chiffrer la rédaction au plus juste.
 */
export type SizeChoice = '1' | '2-3' | '4-6' | 'plus' | 'inconnu'
export type ContentChoice = 'pret' | 'partiel' | 'a-creer'

export type EstimateInput = { type: SiteType; size: SizeChoice; content: ContentChoice }

export type Formule = 'Une page' | 'Site complet' | 'Sur mesure'

export type Estimate = {
  formule: Formule
  /** Prix affiché (le bas de la fourchette), ou null quand il n'y en a pas (application). */
  prix: number | null
  /** Haut de la fourchette, quand la rédaction dépend du nombre de pages. Sinon null. */
  prixMax: number | null
  /** true quand le prix s'annonce « à partir de » : périmètre au-delà de la formule. */
  prixDepuis: boolean
  showPrice: boolean
  delay: string
  /** Une seule phrase d'ajustement, ou null. Jamais deux à la fois. */
  ajustement: string | null
  projectType: 'vitrine' | 'ecommerce' | 'app-web'
  // La tranche déduite du projet, pas la réponse du visiteur à la question
  // budget du formulaire, qui vit ailleurs.
  budget: '1k-3k' | '3k-5k' | 'a-def'
}

// Les prix fermes de la grille tarifaire.
const PRIX: Record<Formule, number | null> = {
  'Une page': 900,
  'Site complet': 1900,
  'Sur mesure': 3000,
}

const DELAI: Record<Formule, string> = {
  'Une page': '5 jours ouvrés',
  'Site complet': '3 semaines',
  'Sur mesure': 'défini au cadrage',
}

/** L'option rédaction des textes, telle que la grille l'affiche. */
export const REDACTION_PAR_PAGE = 200

/** Le nombre de pages couvert par chaque réponse : [minimum, maximum ou null]. */
const PAGES: Record<SizeChoice, [number, number | null] | null> = {
  '1': [1, 1],
  '2-3': [2, 3],
  '4-6': [4, 6],
  plus: [7, null],
  inconnu: null,
}

const PROJECT_TYPE: Record<SiteType, Estimate['projectType']> = {
  'vitrine': 'vitrine',
  'vitrine-plus': 'vitrine',
  'boutique': 'ecommerce',
  'application': 'app-web',
}

const euro = (n: number): string => `${n.toLocaleString('fr-FR')} €`

export function estimate(input: EstimateInput): Estimate {
  const projectType = PROJECT_TYPE[input.type]

  if (input.type === 'application') {
    return {
      formule: 'Sur mesure', prix: null, prixMax: null, prixDepuis: true, showPrice: false,
      delay: DELAI['Sur mesure'], ajustement: null, projectType, budget: 'a-def',
    }
  }

  if (input.type === 'boutique') {
    // Une boutique se chiffre au cadrage : le nombre de fiches à rédiger
    // n'est pas une taille de site. La rédaction reste une option signalée.
    const ajustement = input.content !== 'pret'
      ? `Rédaction des textes en option : ${euro(REDACTION_PAR_PAGE)} par page.`
      : null
    return {
      formule: 'Sur mesure', prix: PRIX['Sur mesure'], prixMax: null, prixDepuis: true, showPrice: true,
      delay: DELAI['Sur mesure'], ajustement, projectType, budget: '3k-5k',
    }
  }

  // Une taille encore inconnue reste sur la formule la moins chère :
  // annoncer d'emblée 1 900 € survendrait un projet qui tiendra peut-être
  // sur une seule page.
  const unePage = input.type === 'vitrine' && (input.size === '1' || input.size === 'inconnu')
  const formule: Formule = unePage ? 'Une page' : 'Site complet'
  const base = PRIX[formule] as number

  // « À partir de » dès que le périmètre dépasse la formule : réservation
  // ou devis en ligne, plus de six pages, ou taille encore inconnue.
  let prixDepuis =
    input.type === 'vitrine-plus' || input.size === 'plus' || input.size === 'inconnu'

  // Des textes à créer : la rédaction entre dans le prix affiché, à
  // 200 € la page. Le site promet un prix écrit et aucune surprise à la
  // fin : un prix sans la rédaction en serait une.
  const pages = PAGES[input.size]
  let prix = base
  let prixMax: number | null = null
  let redaction: string | null = null
  if (input.content === 'a-creer' && pages) {
    const [min, max] = pages
    prix = base + REDACTION_PAR_PAGE * min
    if (max === null) prixDepuis = true
    else if (max !== min) prixMax = base + REDACTION_PAR_PAGE * max
    redaction = max === min
      ? `Dont ${euro(REDACTION_PAR_PAGE * min)} pour la rédaction des textes.`
      : `Dont la rédaction des textes : ${euro(REDACTION_PAR_PAGE * min)}${max ? ` à ${euro(REDACTION_PAR_PAGE * max)}` : ' et plus'}, à ${euro(REDACTION_PAR_PAGE)} la page.`
  }

  // Une seule phrase d'ajustement, par ordre de priorité : le périmètre
  // d'abord, les contenus ensuite.
  const ajustement =
    input.type === 'vitrine' && input.size === 'inconnu'
      ? 'Selon le nombre de pages, on passe à la formule Site complet, à 1 900 €.'
      : redaction
        ? redaction
        : input.size === 'plus'
          ? 'Au-delà de six pages, on ajuste ensemble.'
          : input.content === 'partiel'
            ? `Les textes qui manquent : ${euro(REDACTION_PAR_PAGE)} par page à rédiger.`
            : input.content === 'a-creer'
              ? `Rédaction des textes en option : ${euro(REDACTION_PAR_PAGE)} par page.`
              : null

  const haut = prixMax ?? prix
  return {
    formule,
    prix,
    prixMax,
    prixDepuis,
    showPrice: true,
    delay: DELAI[formule],
    ajustement,
    projectType,
    budget: input.size === 'inconnu' ? 'a-def' : haut > 3000 ? '3k-5k' : '1k-3k',
  }
}
