import { describe, it, expect } from 'vitest'
import { estimate } from './estimator-pricing'

describe('estimate', () => {
  it('vitrine une page, contenus prêts : Fondation, 900 à 1200', () => {
    const r = estimate({ type: 'vitrine', size: '1', content: 'pret' })
    expect(r.min).toBe(900)
    expect(r.max).toBe(1200)
    expect(r.offer).toBe('Fondation')
    expect(r.delay).toBe('2 à 3 semaines')
    expect(r.projectType).toBe('vitrine')
    expect(r.budget).toBe('1k-3k')
    expect(r.showPrice).toBe(true)
  })

  it('au-delà d\'une page, l\'offre bascule sur Studio', () => {
    const r = estimate({ type: 'vitrine', size: '2-5', content: 'pret' })
    expect(r.offer).toBe('Studio')
    expect(r.delay).toBe('4 à 6 semaines')
    expect(r.min).toBe(1600)
    expect(r.max).toBe(2400)
  })

  it('contenus à créer : +25 % sur le haut, le bas ne bouge pas', () => {
    const r = estimate({ type: 'vitrine', size: '2-5', content: 'a-creer' })
    expect(r.min).toBe(1600)
    expect(r.max).toBe(3000)
  })

  it('contenus en partie : +12 %, arrondi à la centaine supérieure', () => {
    const r = estimate({ type: 'vitrine', size: '2-5', content: 'partiel' })
    expect(r.min).toBe(1600)
    expect(r.max).toBe(2700)
  })

  it('le supplément contenus ne déplace pas la tranche de budget', () => {
    const a = estimate({ type: 'vitrine', size: '6-12', content: 'pret' })
    const b = estimate({ type: 'vitrine', size: '6-12', content: 'a-creer' })
    expect(a.budget).toBe('3k-5k')
    expect(b.budget).toBe('3k-5k')
    expect(b.max).toBeGreaterThan(a.max!)
  })

  it('boutique une page renvoie la fourchette 2-5', () => {
    const r = estimate({ type: 'boutique', size: '1', content: 'pret' })
    expect(r.min).toBe(3000)
    expect(r.max).toBe(4400)
    expect(r.offer).toBe('Studio')
    expect(r.projectType).toBe('ecommerce')
    expect(r.budget).toBe('3k-5k')
  })

  it('boutique 6-12 tombe dans la tranche 5k-10k', () => {
    const r = estimate({ type: 'boutique', size: '6-12', content: 'pret' })
    expect(r.min).toBe(4000)
    expect(r.max).toBe(6400)
    expect(r.budget).toBe('5k-10k')
  })

  it('application : aucun chiffre, budget à définir', () => {
    const r = estimate({ type: 'application', size: '2-5', content: 'pret' })
    expect(r.showPrice).toBe(false)
    expect(r.min).toBeNull()
    expect(r.max).toBeNull()
    expect(r.offer).toBe('Sur mesure')
    expect(r.projectType).toBe('app-web')
    expect(r.budget).toBe('a-def')
    expect(r.delay).toBe('à définir ensemble')
  })

  it('taille inconnue : fourchette complète de la ligne, budget à définir', () => {
    const r = estimate({ type: 'vitrine', size: 'inconnu', content: 'pret' })
    expect(r.min).toBe(900)
    expect(r.max).toBe(4400)
    expect(r.budget).toBe('a-def')
    expect(r.offer).toBe('Studio')
  })

  it('vitrine-plus : prix corrects sur les trois tailles', () => {
    const one = estimate({ type: 'vitrine-plus', size: '1', content: 'pret' })
    expect(one.min).toBe(1400)
    expect(one.max).toBe(1800)
    expect(one.offer).toBe('Fondation')

    const mid = estimate({ type: 'vitrine-plus', size: '2-5', content: 'pret' })
    expect(mid.min).toBe(2000)
    expect(mid.max).toBe(3000)
    expect(mid.offer).toBe('Studio')

    const large = estimate({ type: 'vitrine-plus', size: '6-12', content: 'pret' })
    expect(large.min).toBe(3200)
    expect(large.max).toBe(4800)
    expect(large.offer).toBe('Studio')
  })

  describe('offerNamed : l\'offre ne se nomme que si le plancher atteint son prix affiché', () => {
    it('vitrine 2-5 pages : Studio annoncé mais plancher sous 2 500 €, offre non nommée', () => {
      const r = estimate({ type: 'vitrine', size: '2-5', content: 'pret' })
      expect(r.offer).toBe('Studio')
      expect(r.offerNamed).toBe(false)
    })

    it('vitrine-plus 2-5 pages : plancher sous 2 500 €, offre non nommée', () => {
      const r = estimate({ type: 'vitrine-plus', size: '2-5', content: 'pret' })
      expect(r.offer).toBe('Studio')
      expect(r.offerNamed).toBe(false)
    })

    it('vitrine taille inconnue : plancher à 900 €, offre non nommée', () => {
      const r = estimate({ type: 'vitrine', size: 'inconnu', content: 'pret' })
      expect(r.offer).toBe('Studio')
      expect(r.offerNamed).toBe(false)
    })

    it('vitrine-plus taille inconnue : plancher à 1 400 €, offre non nommée', () => {
      const r = estimate({ type: 'vitrine-plus', size: 'inconnu', content: 'pret' })
      expect(r.offer).toBe('Studio')
      expect(r.offerNamed).toBe(false)
    })

    it('vitrine une page : plancher à 900 €, Fondation nommée', () => {
      const r = estimate({ type: 'vitrine', size: '1', content: 'pret' })
      expect(r.offer).toBe('Fondation')
      expect(r.offerNamed).toBe(true)
    })

    it('vitrine 6-12 pages : plancher à 2 800 €, Studio nommée', () => {
      const r = estimate({ type: 'vitrine', size: '6-12', content: 'pret' })
      expect(r.offer).toBe('Studio')
      expect(r.offerNamed).toBe(true)
    })

    it('boutique : plancher toujours au-dessus de 2 500 €, Studio nommée', () => {
      const r = estimate({ type: 'boutique', size: '2-5', content: 'pret' })
      expect(r.offer).toBe('Studio')
      expect(r.offerNamed).toBe(true)
    })

    it('application : Sur mesure n\'a pas de prix affiché, toujours nommée', () => {
      const r = estimate({ type: 'application', size: '2-5', content: 'pret' })
      expect(r.offer).toBe('Sur mesure')
      expect(r.offerNamed).toBe(true)
    })
  })
})
