export type SiteType = 'vitrine' | 'vitrine-plus' | 'boutique' | 'application'
export type SizeChoice = '1' | '2-5' | '6-12' | 'inconnu'
export type ContentChoice = 'pret' | 'partiel' | 'a-creer'

export type EstimateInput = {
  type: SiteType
  size: SizeChoice
  content: ContentChoice
}

export type Estimate = {
  min: number | null
  max: number | null
  showPrice: boolean
  offer: 'Fondation' | 'Studio' | 'Sur mesure'
  // L'offre n'est nommée que si le plancher de la fourchette atteint son
  // prix affiché sur la grille tarifaire (Fondation 900 €, Studio 2 500 €).
  // Sinon le visiteur lit deux prix contradictoires pour la même offre.
  offerNamed: boolean
  delay: string
  projectType: 'vitrine' | 'ecommerce' | 'app-web'
  budget: '1k-3k' | '3k-5k' | '5k-10k' | '10k+' | 'a-def'
}

type Range = [number, number]

// Fourchettes établies sur un TJM de 400 €.
const GRID: Record<Exclude<SiteType, 'application'>, Record<'1' | '2-5' | '6-12', Range>> = {
  'vitrine':      { '1': [900, 1200],  '2-5': [1600, 2400], '6-12': [2800, 4400] },
  'vitrine-plus': { '1': [1400, 1800], '2-5': [2000, 3000], '6-12': [3200, 4800] },
  // Une boutique d'une seule page n'existe pas : on renvoie la fourchette 2-5.
  'boutique':     { '1': [3000, 4400], '2-5': [3000, 4400], '6-12': [4000, 6400] },
}

const CONTENT_UPLIFT: Record<ContentChoice, number> = {
  'pret':    1,
  'partiel': 1.12,
  'a-creer': 1.25,
}

// Prix affichés sur la grille tarifaire (index.html), sert de référence pour
// décider si une offre peut être nommée sans se contredire.
const OFFER_PRICE: Record<'Fondation' | 'Studio', number> = {
  'Fondation': 900,
  'Studio':    2500,
}

const PROJECT_TYPE: Record<SiteType, Estimate['projectType']> = {
  'vitrine':      'vitrine',
  'vitrine-plus': 'vitrine',
  'boutique':     'ecommerce',
  'application':  'app-web',
}

const roundUpHundred = (n: number): number => Math.ceil(n / 100) * 100

function budgetBracket(mid: number): Estimate['budget'] {
  if (mid < 3000) return '1k-3k'
  if (mid < 5000) return '3k-5k'
  if (mid < 10000) return '5k-10k'
  return '10k+'
}

export function estimate(input: EstimateInput): Estimate {
  const projectType = PROJECT_TYPE[input.type]

  if (input.type === 'application') {
    return {
      min: null, max: null, showPrice: false,
      offer: 'Sur mesure', offerNamed: true,
      delay: 'à définir ensemble',
      projectType, budget: 'a-def',
    }
  }

  const row = GRID[input.type]
  const unknownSize = input.size === 'inconnu'
  const base: Range = unknownSize
    ? [row['1'][0], row['6-12'][1]]
    : row[input.size as '1' | '2-5' | '6-12']

  // Le supplément contenus élargit l'affichage sans déplacer la tranche de
  // budget : un client sans photos ne doit pas être rangé au-dessus de son
  // projet réel.
  const max = roundUpHundred(base[1] * CONTENT_UPLIFT[input.content])
  const budget = unknownSize
    ? 'a-def'
    : budgetBracket((base[0] + base[1]) / 2)

  // Une page relève de Fondation, au-delà de Studio. Une taille inconnue est
  // traitée comme le cas le plus large.
  const offer = input.type === 'boutique' || input.size !== '1' ? 'Studio' : 'Fondation'
  const offerNamed = base[0] >= OFFER_PRICE[offer]

  return {
    min: base[0], max, showPrice: true,
    offer, offerNamed,
    delay: offer === 'Fondation' ? '1 à 2 semaines' : '4 à 6 semaines',
    projectType, budget,
  }
}
