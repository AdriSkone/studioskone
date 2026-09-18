import { describe, it, expect } from 'vitest'
import { estUnRegroupement } from './verifier-copy.mjs'

/**
 * `estUnRegroupement(fragment, cible)` décide si un fragment absent de la
 * cible est un simple regroupement (le texte existe, juste redécoupé
 * autrement) ou une vraie perte. Ces tests couvrent la porte des fragments
 * de deux ou trois mots (voir le commentaire au-dessus, dans
 * verifier-copy.mjs) : c'est elle qui laissait passer la disparition d'un
 * prix comme « Sur devis ».
 */
describe('estUnRegroupement — fragments de deux ou trois mots', () => {
  it("ne valide pas un prix disparu au seul motif que ses deux mots vivent ailleurs", () => {
    // Reproduit le cas mesuré sur les cards Prestations : le prix
    // « Sur devis » a été supprimé de la carte Application mobile, mais
    // « Sur » vit toujours dans « Sur mesure » et « devis » dans
    // « Demander un devis » — deux mots réels, jamais voisins.
    const cible =
      'Application mobile Sur mesure, pour aller plus loin. Choisir cette formule Demander un devis'
    expect(estUnRegroupement('Sur devis', cible)).toBe(false)
  })

  it('ne valide pas un fragment de trois mots dont aucune paire ne survit côte à côte', () => {
    // Même trou, à trois mots : chacun des trois mots existe isolément
    // dans la cible, mais aucune paire consécutive du fragment n'y est
    // jamais voisine — ce n'est donc pas un regroupement, mais une perte.
    const fragment = 'Le plus choisi'
    const cible = 'Le service est plus demandé une fois, ce choisi ne veut rien dire'
    expect(estUnRegroupement(fragment, cible)).toBe(false)
  })

  it('valide un fragment de deux mots resté strictement voisin (regroupement réel)', () => {
    // Le numéro d'étape et son intitulé restent côte à côte : ce sont des
    // <span> en ligne, jamais séparés par un bloc — la mise en page peut
    // changer autour, tant que les deux mots restent l'un contre l'autre.
    const cible = 'Ma méthode 01 Découverte Cadrage du projet'
    expect(estUnRegroupement('01 Découverte', cible)).toBe(true)
  })

  it('valide un fragment de trois mots si au moins une paire consécutive survit', () => {
    // Seul le premier mot du fragment a changé de place ; « plus choisi »
    // reste une paire intacte ailleurs dans la page.
    const fragment = 'Le plus choisi'
    const cible = 'Studio, mon offre plus choisi et la plus demandée'
    expect(estUnRegroupement(fragment, cible)).toBe(true)
  })

  it('exige le fragment entier pour deux mots : aucune fenêtre plus petite ne peut le couvrir', () => {
    // Sur exactement deux mots, il n'y a qu'une seule fenêtre de deux
    // mots possible : le fragment lui-même. C'est voulu — un prix ou un
    // libellé de deux mots ne peut pas se cacher dans une fenêtre plus
    // courte que lui.
    const cible = 'Sur mesure, demander un devis rapidement'
    expect(estUnRegroupement('Sur devis', cible)).toBe(false)
    expect(estUnRegroupement('Sur mesure', cible)).toBe(true)
  })
})
