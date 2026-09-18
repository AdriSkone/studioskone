import { describe, it, expect } from 'vitest'
import { estimate } from './estimator-pricing'

describe('formule et prix ferme', () => {
  it('une vitrine d’une page donne la formule Une page à 900 €', () => {
    const r = estimate({ type: 'vitrine', size: '1', content: 'pret' })
    expect(r.formule).toBe('Une page')
    expect(r.prix).toBe(900)
    expect(r.prixDepuis).toBe(false)
    expect(r.delay).toBe('5 jours ouvrés')
  })

  it('une vitrine de 2 à 5 pages donne Site complet à 1 900 €', () => {
    const r = estimate({ type: 'vitrine', size: '2-5', content: 'pret' })
    expect(r.formule).toBe('Site complet')
    expect(r.prix).toBe(1900)
    expect(r.delay).toBe('3 semaines')
    expect(r.ajustement).toBeNull()
  })

  it('au-delà de six pages, le prix reste 1 900 € mais s’annonce comme un point de départ', () => {
    const r = estimate({ type: 'vitrine', size: '6-12', content: 'pret' })
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
    const r = estimate({ type: 'boutique', size: '2-5', content: 'pret' })
    expect(r.formule).toBe('Sur mesure')
    expect(r.prix).toBe(3000)
    expect(r.prixDepuis).toBe(true)
    expect(r.delay).toBe('défini au cadrage')
  })

  it('une application ne s’annonce pas en prix', () => {
    const r = estimate({ type: 'application', size: 'inconnu', content: 'a-creer' })
    expect(r.formule).toBe('Sur mesure')
    expect(r.showPrice).toBe(false)
    expect(r.prix).toBeNull()
  })

  it('des contenus à créer renvoient vers l’option rédaction, sans gonfler le prix', () => {
    const r = estimate({ type: 'vitrine', size: '1', content: 'a-creer' })
    expect(r.prix).toBe(900)
    expect(r.ajustement).toBe('Rédaction des textes en option : 200 € par page.')
  })

  it('une taille inconnue reste sur Site complet, prix à partir de', () => {
    const r = estimate({ type: 'vitrine', size: 'inconnu', content: 'pret' })
    expect(r.formule).toBe('Site complet')
    expect(r.prixDepuis).toBe(true)
    expect(r.budget).toBe('a-def')
  })

  it('la tranche de budget suit le prix de la formule', () => {
    expect(estimate({ type: 'vitrine', size: '1', content: 'pret' }).budget).toBe('1k-3k')
    expect(estimate({ type: 'boutique', size: '2-5', content: 'pret' }).budget).toBe('3k-5k')
  })
})
