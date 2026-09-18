/**
 * Mise à jour de public/sitemap.xml, partagée par tous les générateurs.
 *
 * Une seule règle : une page dont le rendu n'a pas changé garde sa date
 * d'origine. Redater du jour une page inchangée dirait à Google qu'elle a
 * évolué alors que non, et cette fausse indication use la confiance qu'il
 * accorde au fichier.
 *
 * Avant ce module, seul build-prestation-pages.mjs appliquait cette règle,
 * pour les cinq pages prestations. L'accueil et les pages légales n'avaient
 * aucun mécanisme équivalent : leur date au sitemap ne bougeait jamais,
 * même quand leur contenu changeait vraiment (chantier tarifs, 18 septembre
 * 2026 : l'accueil et /cgv ont changé, leur date au sitemap est restée
 * ancienne). Ce module centralise la règle pour que build-accueil.mjs et
 * build-legal-pages.mjs puissent l'appliquer aussi.
 */

import { readFileSync, writeFileSync } from 'node:fs'

export const ORIGIN = 'https://studioskone.com'

/**
 * Détermine la date à déclarer pour `loc` : celle du jour si `htmlAvant`
 * (le rendu précédent, ou `null` à la première génération) diffère de
 * `htmlApres`, sinon la date déjà présente dans le sitemap pour cette URL.
 */
export function lastmodFor(sitemapPath, loc, htmlAvant, htmlApres, today) {
  if (htmlAvant !== null && htmlAvant === htmlApres) {
    let xml
    try {
      xml = readFileSync(sitemapPath, 'utf-8')
    } catch {
      return today
    }
    const m = xml.match(new RegExp(`<loc>${loc}</loc>\\s*<lastmod>([^<]+)</lastmod>`))
    if (m) return m[1]
  }
  return today
}

/**
 * Écrit la date `lastmod` calculée par `lastmodFor` pour l'URL `loc`, sans
 * toucher au reste de l'entrée ni à son ordre dans le fichier.
 */
export function ecrireLastmod(sitemapPath, loc, date) {
  let xml = readFileSync(sitemapPath, 'utf-8')
  const re = new RegExp(`(<loc>${loc}</loc>\\s*<lastmod>)[^<]+(</lastmod>)`)
  if (!re.test(xml)) return
  xml = xml.replace(re, `$1${date}$2`)
  writeFileSync(sitemapPath, xml, 'utf-8')
}
