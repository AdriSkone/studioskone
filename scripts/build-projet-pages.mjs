#!/usr/bin/env node
/**
 * Génère les neuf pages projet.
 *
 * Elles étaient écrites à la main, neuf fois, avec leur barre de
 * navigation dupliquée et sans pied de page — alors qu'elles chargeaient
 * Umami. Elles partagent maintenant les partiels de l'accueil.
 *
 * Le `head` de chaque page est relu depuis contenu/heads/ et réinjecté
 * tel quel : aucune balise SEO n'est réécrite, donc aucune ne peut bouger.
 *
 * Lancer : node scripts/build-projet-pages.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { pagesProjet } from './contenu/projets-pages.mjs'
import { projets } from './contenu/projets.mjs'
import { navigation, piedDePage, bandeauCookies, fleche } from './partials.mjs'
import { attributsTaille } from './dimensions-image.mjs'

const ici = dirname(fileURLToPath(import.meta.url))
const racine = resolve(ici, '..')

/** Les autres projets, pour la série de fin de page. */
function autresProjets(slug) {
  return projets.filter((p) => p.slug !== slug).slice(0, 3)
}

function page(slug, d) {
  const head = readFileSync(resolve(ici, 'contenu/heads', `${slug}.html`), 'utf8')

  const galerie = d.galerie
    .map(
      (g) => `          <figure class="projet-vue${g.large ? ' projet-vue--large' : ''}">
            <img src="${g.src}" alt="${g.alt}" loading="lazy"${attributsTaille(g.src)}>
            ${g.label ? `<figcaption>${g.label}</figcaption>` : ''}
          </figure>`
    )
    .join('\n')

  const suite = autresProjets(slug)
    .map(
      (p) => `          <a class="carte-projet" href="/projets/${p.slug}">
            <img class="carte-projet-image" src="${p.image}" alt="${p.alt}" loading="lazy"${attributsTaille(p.image)}>
            <div>
              <div class="carte-projet-tete">
                <h3 class="carte-projet-titre">${p.titre}</h3>
                <span class="carte-projet-type">${p.badge}</span>
              </div>
              <p class="carte-projet-tagline">${p.tagline}</p>
            </div>
          </a>`
    )
    .join('\n')

  return `<!doctype html>
<html lang="fr">
<head>
${head}</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>

${navigation({ prefixe: '/' })}

  <main id="contenu">
    <section class="section-s projet-tete">
      <div class="grille">
        <a class="lien projet-retour" style="--col: 1 / span 3" href="/#work">${d.retour}</a>

        <div class="projet-identite" style="--col: 1 / span 6">
          <p class="carte-projet-type">${d.badge}</p>
          <h1 class="t-h1 projet-titre">${d.titre}</h1>
          <p class="projet-type">${d.type}</p>
        </div>

        <p class="projet-desc" style="--col: 8 / span 5">${d.desc}</p>

        <figure class="projet-visuel" style="--col: 1 / -1">
          <img src="${d.heroImg}" alt="${d.heroAlt}" loading="eager" fetchpriority="high"${attributsTaille(d.heroImg)}>
        </figure>
      </div>
    </section>

    <section class="section-m sombre" id="contexte">
      <div class="grille">
        <p class="tete-bloc">${d.labelContexte}</p>
        <div class="projet-contexte" style="--col: 3 / span 7">
${d.contextes.map((t) => `          <p>${t}</p>`).join('\n')}
        </div>
      </div>
    </section>

    <section class="section-m" id="nature">
      <div class="grille">
        <p class="tete-bloc">${d.testiBadge}</p>
        <div class="projet-contexte" style="--col: 3 / span 7">
          <p class="projet-note">${d.testiNote}</p>
          ${d.testiSign ? `<p class="projet-signature">${d.testiSign}</p>` : ''}
        </div>
      </div>
    </section>

    <section class="section-m" id="galerie">
      <div class="grille">
        <p class="tete-bloc">${d.labelGalerie}</p>
        <div class="projet-galerie" style="--col: 1 / -1">
${galerie}
        </div>
      </div>
    </section>

    <section class="section-m" id="suite">
      <div class="grille">
        <p class="tete-bloc">Réalisations</p>
        <h2 class="t-h2" style="--col: 3 / span 6">${d.ctaTitre}</h2>
        <p class="projet-cta-sous" style="--col: 9 / span 4">${d.ctaSub}</p>
        <a class="bouton bouton--principal" style="--col: 3 / span 4; margin-top: 32px" href="${d.ctaHref}">${d.ctaLibelle}${fleche}</a>

        <div class="projet-suite" style="--col: 1 / -1">
${suite}
        </div>
      </div>
    </section>
  </main>

${piedDePage({ prefixe: '/' })}

${bandeauCookies()}

  <script type="module" src="/src/projet.ts"></script>
</body>
</html>
`
}

let n = 0
for (const [slug, d] of Object.entries(pagesProjet)) {
  writeFileSync(resolve(racine, 'projets', `${slug}.html`), page(slug, d), 'utf8')
  n++
}
console.log(`✅ ${n} pages projet générées`)
