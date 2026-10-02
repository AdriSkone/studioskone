import { describe, it, expect } from 'vitest'
import { estimate } from './estimator-pricing'

describe('formule et prix ferme', () => {
  it('une vitrine d’une page donne la formule Une page à 900 €', () => {
    const r = estimate({ type: 'vitrine', size: '1', content: 'pret' })
    expect(r.formule).toBe('Une page')
    expect(r.prix).toBe(900)
    expect(r.prixMax).toBeNull()
    expect(r.prixDepuis).toBe(false)
    expect(r.delay).toBe('5 jours ouvrés')
  })

  it('dès deux pages, c’est Site complet à 1 900 €', () => {
    const r = estimate({ type: 'vitrine', size: '2-3', content: 'pret' })
    expect(r.formule).toBe('Site complet')
    expect(r.prix).toBe(1900)
    expect(r.delay).toBe('3 semaines')
    expect(r.ajustement).toBeNull()
  })

  it('4 à 6 pages restent sur Site complet à 1 900 €', () => {
    const r = estimate({ type: 'vitrine', size: '4-6', content: 'pret' })
    expect(r.formule).toBe('Site complet')
    expect(r.prix).toBe(1900)
    expect(r.prixDepuis).toBe(false)
  })

  it('au-delà de six pages, le prix s’annonce comme un point de départ', () => {
    const r = estimate({ type: 'vitrine', size: 'plus', content: 'pret' })
    expect(r.formule).toBe('Site complet')
    expect(r.prix).toBe(1900)
    expect(r.prixDepuis).toBe(true)
    expect(r.ajustement).toBe('Au-delà de six pages, on ajuste ensemble.')
  })

  it('une vitrine avec réservation ou devis part de 1 900 €', () => {
    const r = estimate({ type: 'vitrine-plus', size: '1', content: 'pret' })
    expect(r.formule).toBe('Site complet')
    expect(r.prix).toBe(1900)
    expect(r.prixDepuis).toBe(true)
  })

  it('une boutique relève du sur mesure, à partir de 3 000 €', () => {
    const r = estimate({ type: 'boutique', size: '4-6', content: 'pret' })
    expect(r.formule).toBe('Sur mesure')
    expect(r.prix).toBe(3000)
    expect(r.prixDepuis).toBe(true)
    expect(r.delay).toBe('défini au cadrage')
  })

  it('une boutique avec des textes à créer signale l’option rédaction, sans la chiffrer', () => {
    const r = estimate({ type: 'boutique', size: '4-6', content: 'a-creer' })
    expect(r.prix).toBe(3000)
    expect(r.ajustement).toBe('Rédaction des textes en option : 200 € par page.')
  })

  it('une application ne s’annonce pas en prix', () => {
    const r = estimate({ type: 'application', size: 'inconnu', content: 'a-creer' })
    expect(r.formule).toBe('Sur mesure')
    expect(r.showPrice).toBe(false)
    expect(r.prix).toBeNull()
  })

  it('une taille inconnue reste sur Une page, à partir de 900 €, avec un ajustement vers Site complet', () => {
    const r = estimate({ type: 'vitrine', size: 'inconnu', content: 'pret' })
    expect(r.formule).toBe('Une page')
    expect(r.prix).toBe(900)
    expect(r.prixDepuis).toBe(true)
    expect(r.ajustement).toBe('Selon le nombre de pages, on passe à la formule Site complet, à 1 900 €.')
    expect(r.budget).toBe('a-def')
  })
})

describe('rédaction des textes comprise dans le prix', () => {
  it('une page sans textes : 900 € + 200 € = 1 100 €', () => {
    const r = estimate({ type: 'vitrine', size: '1', content: 'a-creer' })
    expect(r.prix).toBe(1100)
    expect(r.prixMax).toBeNull()
    expect(r.ajustement).toBe('Dont 200 € pour la rédaction des textes.')
  })

  it('2 à 3 pages sans textes : 2 300 à 2 500 €', () => {
    const r = estimate({ type: 'vitrine', size: '2-3', content: 'a-creer' })
    expect(r.prix).toBe(2300)
    expect(r.prixMax).toBe(2500)
  })

  it('4 à 6 pages sans textes : 2 700 à 3 100 €, tranche 3 000 à 5 000 €', () => {
    const r = estimate({ type: 'vitrine', size: '4-6', content: 'a-creer' })
    expect(r.prix).toBe(2700)
    expect(r.prixMax).toBe(3100)
    expect(r.budget).toBe('3k-5k')
  })

  it('plus de six pages sans textes : à partir de 3 300 €', () => {
    const r = estimate({ type: 'vitrine', size: 'plus', content: 'a-creer' })
    expect(r.prix).toBe(3300)
    expect(r.prixMax).toBeNull()
    expect(r.prixDepuis).toBe(true)
  })

  it('des textes en partie prêts gardent le prix et signalent la rédaction', () => {
    const r = estimate({ type: 'vitrine', size: '4-6', content: 'partiel' })
    expect(r.prix).toBe(1900)
    expect(r.ajustement).toBe('Les textes qui manquent : 200 € par page à rédiger.')
  })

  it('la tranche de budget suit le prix affiché', () => {
    expect(estimate({ type: 'vitrine', size: '1', content: 'pret' }).budget).toBe('1k-3k')
    expect(estimate({ type: 'boutique', size: '4-6', content: 'pret' }).budget).toBe('3k-5k')
  })
})
