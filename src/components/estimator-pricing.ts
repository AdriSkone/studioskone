export type SiteType = 'vitrine' | 'vitrine-plus' | 'boutique' | 'application'
export type SizeChoice = '1' | '2-5' | '6-12' | 'inconnu'
export type ContentChoice = 'pret' | 'partiel' | 'a-creer'

export type EstimateInput = { type: SiteType; size: SizeChoice; content: ContentChoice }

export type Formule = 'Une page' | 'Site complet' | 'Sur mesure'

export type Estimate = {
  formule: Formule
  /** Prix ferme de la formule, ou null quand il n'y en a pas (application). */
  prix: number | null
  /** true quand le prix s'annonce « à partir de » : périmètre au-delà de la formule. */
  prixDepuis: boolean
  showPrice: boolean
  delay: string
  /** Une seule phrase d'ajustement, ou null. Jamais deux à la fois. */
  ajustement: string | null
  projectType: 'vitrine' | 'ecommerce' | 'app-web'
  // La tranche déduite du projet — pas la réponse du visiteur à la question
  // budget du formulaire, qui vit ailleurs. Restreinte aux valeurs que le
  // calcul produit réellement : vitrine/vitrine-plus rendent '1k-3k' ou
  // 'a-def', boutique rend toujours '3k-5k', application rend 'a-def'.
  // '5k-10k' et '10k+' n'ont pas de cas d'entrée qui les atteigne.
  budget: '1k-3k' | '3k-5k' | 'a-def'
}

// Les prix fermes de la grille tarifaire. Le module ne calcule plus de
// fourchette : la promesse du site est un prix ferme, pas une estimation.
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

const PROJECT_TYPE: Record<SiteType, Estimate['projectType']> = {
  'vitrine': 'vitrine',
  'vitrine-plus': 'vitrine',
  'boutique': 'ecommerce',
  'application': 'app-web',
}

export function estimate(input: EstimateInput): Estimate {
  const projectType = PROJECT_TYPE[input.type]

  if (input.type === 'application') {
    return {
      formule: 'Sur mesure', prix: null, prixDepuis: true, showPrice: false,
      delay: DELAI['Sur mesure'], ajustement: null, projectType, budget: 'a-def',
    }
  }

  if (input.type === 'boutique') {
    // Même règle de priorité que pour une vitrine — le périmètre d'abord,
    // les contenus ensuite — sauf qu'une boutique n'a pas de cas « au-delà
    // de six pages ». Des fiches produits à écrire appellent la même
    // option rédaction qu'une vitrine sans textes.
    const ajustement = input.content === 'a-creer'
      ? 'Rédaction des textes en option : 200 € par page.'
      : null
    return {
      formule: 'Sur mesure', prix: PRIX['Sur mesure'], prixDepuis: true, showPrice: true,
      delay: DELAI['Sur mesure'], ajustement, projectType, budget: '3k-5k',
    }
  }

  // Une taille encore inconnue reste sur la formule la moins chère : annoncer
  // d'emblée le plancher de Site complet (1 900 €) survendrait un projet qui
  // tiendra peut-être sur une seule page, à 900 €. L'ajustement prévient que
  // le nombre de pages peut faire basculer sur Site complet.
  const unePage = input.type === 'vitrine' && (input.size === '1' || input.size === 'inconnu')
  const formule: Formule = unePage ? 'Une page' : 'Site complet'

  // « À partir de » dès que le périmètre dépasse la formule : réservation
  // ou devis en ligne, plus de six pages, ou taille encore inconnue.
  const prixDepuis =
    input.type === 'vitrine-plus' || input.size === '6-12' || input.size === 'inconnu'

  // Une seule phrase d'ajustement, par ordre de priorité : le périmètre
  // d'abord, les contenus ensuite.
  const ajustement =
    input.type === 'vitrine' && input.size === 'inconnu'
      ? 'Selon le nombre de pages, on passe à la formule Site complet, à 1 900 €.'
      : input.size === '6-12'
        ? 'Au-delà de six pages, on ajuste ensemble.'
        : input.content === 'a-creer'
          ? 'Rédaction des textes en option : 200 € par page.'
          : null

  return {
    formule,
    prix: PRIX[formule],
    prixDepuis,
    showPrice: true,
    delay: DELAI[formule],
    ajustement,
    projectType,
    budget: input.size === 'inconnu' ? 'a-def' : '1k-3k',
  }
}
