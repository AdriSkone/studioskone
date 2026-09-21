/**
 * Les fragments partagés par toutes les pages.
 *
 * Avant ce fichier, la barre de navigation existait en trois versions
 * écrites à la main, le pied de page en deux, et le bandeau cookies en
 * une seule — sur l'accueil — alors qu'Umami se chargeait sur les quinze
 * pages. Chaque fonction ici est la seule définition de son fragment.
 *
 * Les liens internes prennent un préfixe : depuis l'accueil une ancre
 * s'écrit « #work », depuis une page projet « /#work ». C'est le seul
 * paramètre qui change d'une page à l'autre.
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { nav as navAccueil } from './contenu/accueil.mjs'
import { pied, cookies, studio } from './contenu/site.mjs'

/* ── Logo ─────────────────────────────────────────────────────────────
   Le vrai logo, et non son nom composé en Bricolage.

   Il est posé en SVG dans le HTML plutôt qu'en <img>, pour une raison
   précise : le fichier définit ses couleurs dans une balise <style> qui
   lui est propre, et une image reste étanche à la feuille de styles de la
   page. Inline, on peut les rebrancher — l'encre sur `currentColor`, donc
   le logo se retourne tout seul sur fond sombre, et l'accent sur le
   terracotta du système.

   Les deux teintes d'origine venaient de l'ancienne palette : #1d1d1b
   pour le noir et #c5603a pour l'accent, là où le nouveau terracotta est
   #A95132. Même teinte, un ton plus profond. */
const ici = dirname(fileURLToPath(import.meta.url))

function logoSvg(fichier, classe) {
  const brut = readFileSync(resolve(ici, '..', 'public', fichier), 'utf8')
  return brut
    .replace(/<\?xml[^>]*\?>\s*/, '')
    .replace(/id="Calque_2"/, `class="${classe}" role="img" aria-label="Studio Skøne"`)
    .replace(/fill:\s*#c5603a/gi, 'fill: var(--accent)')
    .replace(/fill:\s*#1d1d1b/gi, 'fill: currentColor')
    .replace(/fill:\s*#C56039/gi, 'fill: var(--accent)')
    .replace(/fill:\s*#FAEEDF/gi, 'fill: currentColor')
    // Les identifiants internes sont préfixés : deux logos dans la même
    // page partageraient sinon leurs classes .cls-1 et .cls-2.
    .replace(/cls-(\d)/g, `${classe}-c$1`)
    .replace(/\s+/g, ' ')
    .trim()
}

/* ── Icônes ────────────────────────────────────────────────────────────
   Toutes en aria-hidden : elles doublent un texte, elles ne le portent
   jamais. Une flèche annoncée au milieu d'une phrase par un lecteur
   d'écran est une gêne, pas une information. */

export const fleche = `<svg class="bouton-fleche" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`

const icones = {
  lieu: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  telephone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
  etoile: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
}

/** Sur l'accueil les ancres sont locales ; ailleurs elles repassent par « / ». */
function resoudre(href, prefixe) {
  if (!prefixe || !href.startsWith('#')) return href
  return prefixe + href
}

/* ── Navigation ───────────────────────────────────────────────────── */

export function navigation({ prefixe = '' } = {}) {
  const liens = navAccueil.liens
    // data-libelle nourrit la copie que le CSS fait glisser par le bas.
    // Elle n'est pas dans le DOM : un lecteur d'écran ne lit donc pas le
    // libellé deux fois.
    .map(
      (l) =>
        `<a class="nav-lien" href="${resoudre(l.href, prefixe)}" data-libelle="${l.libelle}"><span>${l.libelle}</span></a>`
    )
    .join('\n          ')

  return `  <nav class="nav" id="nav" aria-label="Navigation principale">
    <div class="nav-interieur colonnes">
      <a class="nav-logo" href="${prefixe || '#'}" aria-label="${studio.nom}, accueil">${logoSvg('logo_skone_sansh2.svg', 'logo')}</a>
      <button class="nav-bascule" id="navBascule" type="button" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="navPanneau">
        <span></span><span></span>
      </button>
      <!-- Un seul panneau porte les liens ET le bouton d'action. Sous
           1024 px il devient le menu plein écran ; au-delà, il passe en
           display:contents et ses deux enfants reprennent leur place dans
           la grille, comme s'il n'existait pas. Cela évite de dupliquer le
           bouton dans le HTML pour le mobile : un lecteur d'écran
           l'annoncerait deux fois. -->
      <div class="nav-panneau" id="navPanneau">
        <div class="nav-liens" id="navLiens">
          ${liens}
        </div>
        <div class="nav-actions">
          <span class="nav-mention">${navAccueil.mention}</span>
          <a class="bouton bouton--secondaire bouton--compact nav-cta" href="${resoudre(navAccueil.cta.href, prefixe)}">${navAccueil.cta.libelle}</a>
        </div>
      </div>
    </div>
  </nav>`
}

/* ── Pied de page ─────────────────────────────────────────────────── */

/**
 * @param prefixe  Les ancres repassent par « / » depuis une page intérieure.
 * @param pageCourante  Chemin de la page affichée. Son entrée est retirée de
 *   la liste des prestations : un lien vers la page qu'on est en train de
 *   lire n'a rien à offrir, et il dilue le maillage interne. Comportement
 *   repris du générateur des pages prestation, qui le faisait déjà.
 */
export function piedDePage({ prefixe = '', pageCourante = '' } = {}) {
  // Chaque colonne dit où elle va. Sans --col, la grille les plaçait
  // d'elle-même, à la suite des blocs précédents — d'où un pied où les
  // rubriques dérivaient vers la droite sans alignement.
  const placements = ['6 / span 2', '8 / span 3']

  const colonnes = pied.colonnes
    .map(
      (c, i) => `        <nav class="pied-colonne" style="--col: ${placements[i] ?? 'auto'}" aria-label="${c.aria}">
          <span class="pied-titre">${c.titre}</span>
          <div class="pied-liste">
${c.liens
  .filter((l) => l.href !== pageCourante)
  .map((l) => `            <a href="${l.href}">${l.libelle}</a>`)
  .join('\n')}
          </div>
        </nav>`
    )
    .join('\n')

  const legal = pied.legal.map((l) => `<a href="${l.href}">${l.libelle}</a>`).join('\n            ')

  return `  <footer class="pied sombre" id="footer">
    <div class="grille">
      <div class="sombre sombre sombre--pleine-largeur" style="--col: 1 / -1">
        <div class="colonnes">
          <p class="statut" style="--col: 1 / span 6">${pied.cta.statut}</p>
          <p class="sombre-mention" style="--col: 9 / span 4">${pied.cta.mention}</p>
          <a class="bouton bouton--principal" style="--col: 1 / span 4; margin-top: 40px" href="${resoudre(pied.cta.lien.href, prefixe)}">${pied.cta.lien.libelle}${fleche}</a>
        </div>
      </div>

      <a class="pied-logo" style="--col: 1 / span 4; margin-top: var(--section-s)" href="${prefixe || '#'}" aria-label="${studio.nom}, accueil">${logoSvg('logo_skone_sansh2.svg', 'logo')}</a>
      <p class="pied-intro">${pied.tagline}</p>
      <p class="pied-zone">${icones.lieu} ${pied.zone}</p>

${colonnes}

        <div class="pied-colonne" style="--col: 11 / span 2">
          <span class="pied-titre">Contact</span>
          <div class="pied-liste">
            <a href="mailto:${studio.email}">${studio.email}</a>
            <a href="tel:${studio.telephoneLien}">${icones.telephone} ${studio.telephone}</a>
            <a href="${studio.instagram}" target="_blank" rel="noopener noreferrer">${icones.instagram} Instagram</a>
            <a href="${studio.ficheGoogle}" target="_blank" rel="noopener noreferrer">${icones.etoile} ${pied.ficheGoogleLibelle}</a>
          </div>
        </div>

      <div class="pied-bas">
        <span>${pied.copyright}</span>
        <div class="pied-bas-liens">
            ${legal}
        </div>
      </div>
    </div>
  </footer>`
}

/* ── Bandeau cookies ──────────────────────────────────────────────── */

export function bandeauCookies() {
  return `  <div class="cookies" id="cookieBanner" role="dialog" aria-modal="false" aria-label="Gestion des cookies" aria-hidden="true">
    <p class="cookies-titre">${cookies.titre}</p>
    <p class="cookies-texte">${cookies.texte}</p>
    <div class="cookies-actions">
      <button class="bouton bouton--secondaire" id="cookieDecline" type="button">${cookies.refuser}</button>
      <button class="bouton bouton--principal" id="cookieAccept" type="button">${cookies.accepter}</button>
    </div>
  </div>`
}

/* ── Colonnes de colonnes : placement sur la grille ───────────────── */

/** Raccourci lisible pour poser un élément sur la grille. */
export function col(debut, portee) {
  return `--col: ${debut} / span ${portee}`
}
