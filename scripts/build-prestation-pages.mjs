#!/usr/bin/env node
/**
 * Génère les pages prestations : une page par intention de recherche.
 * Lance : `node scripts/build-prestation-pages.mjs`
 *
 * Sortie : un fichier HTML par page à la racine du dépôt (ex. `refonte-site-internet.html`).
 * `cleanUrls` côté Vercel sert ces fichiers sur `/refonte-site-internet`.
 * Chaque page est aussi une entrée de `vite.config.ts` : elle passe donc par le
 * pipeline Vite et charge `/src/prestation.ts`.
 *
 * Pourquoi un générateur plutôt que cinq fichiers écrits à la main : les cinq
 * pages partagent leur coquille (nav, fil d'Ariane, footer, JSON-LD) et ne
 * diffèrent que par leur contenu. Écrire la coquille cinq fois, c'est cinq
 * occasions de la faire diverger.
 *
 * RÈGLE DURE — anti-cannibalisation.
 * Deux pages qui racontent la même chose ne sont classées ni l'une ni l'autre.
 * Aucune phrase de contenu ne doit apparaître sur deux pages. Le script le
 * vérifie à chaque exécution et échoue si c'est le cas (voir `checkNoDuplicates`).
 * La coquille (nav, footer, fil d'Ariane) est exclue du contrôle : c'est de la
 * navigation, pas du contenu.
 */

import { writeFileSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PAGES } from './prestation-pages-data.mjs'
import { navigation, piedDePage, bandeauCookies, fleche as FLECHE } from './partials.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const ORIGIN = 'https://studioskone.com'

// ── Échappement HTML ────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

/** Échappement pour les valeurs de chaîne JSON-LD (le bloc n'est pas du HTML). */
function jsonLd(obj) {
  return JSON.stringify(obj, null, 2)
    .split('\n').map((l) => '    ' + l).join('\n')
}

// ── Coquille : navigation ───────────────────────────────────────────────────
const ARROW = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`

function renderNav() {
  // La barre de navigation vient du partiel partagé : une seule
  // définition pour les quinze pages.
  return navigation({ prefixe: '/' })
}

// ── Coquille : fil d'Ariane ─────────────────────────────────────────────────
function renderBreadcrumb(page) {
  const items = [{ name: 'Accueil', url: '/' }, ...page.breadcrumb]
  const parts = items.map((it, i) => {
    const last = i === items.length - 1
    const node = last
      ? `<span aria-current="page">${esc(it.name)}</span>`
      : `<a href="${esc(it.url)}">${esc(it.name)}</a>`
    return last ? node : `${node}<span class="crumb-sep" aria-hidden="true">›</span>`
  })
  return `      <nav class="crumbs" aria-label="Fil d'Ariane">
        ${parts.join('\n        ')}
      </nav>`
}

// ── Coquille : footer ───────────────────────────────────────────────────────
function renderFooter(currentSlug) {
  // Le pied de page et le bandeau cookies viennent eux aussi du partiel.
  // Ces pages n'avaient pas de bandeau, alors qu'elles chargent Umami.
  return piedDePage({ prefixe: '/', pageCourante: '/' + currentSlug }) + '\n\n' + bandeauCookies()
}

// ── Blocs de contenu ────────────────────────────────────────────────────────
const BLOCKS = {
  /** Liste de symptômes — réutilise les cartes de la section « Le problème ». */
  problem(b) {
    return `    <section class="pres-section pres-section--alt">
      <div class="container">
        <div class="pres-head">
          <p class="section-label reveal">${esc(b.label)}</p>
          <h2 class="pres-title reveal">${b.h2}</h2>
        </div>
${b.intro ? b.intro.map((p) => `        <p class="pres-lead reveal">${esc(p)}</p>`).join('\n') + '\n' : ''}        <ul class="probleme-grid" role="list">
${b.items.map((t) => `          <li class="symptom-card reveal">
            <span class="symptom-mark" aria-hidden="true"></span>
            <p class="symptom-text">${esc(t)}</p>
          </li>`).join('\n')}
        </ul>
${b.turn ? `        <p class="probleme-turn reveal">${b.turn}</p>\n` : ''}      </div>
    </section>`
  },

  /** « Ce que je livre » — réutilise les cartes prestations. */
  deliver(b) {
    return `    <section class="pres-section">
      <div class="container">
        <div class="pres-head">
          <p class="section-label reveal">${esc(b.label)}</p>
          <h2 class="pres-title reveal">${b.h2}</h2>
        </div>
        <div class="services-grid">
${b.items.map((it, i) => `          <div class="service-card reveal">
            <span class="service-num">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="service-title">${esc(it.t)}</h3>
            <p class="service-desc">${esc(it.d)}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </section>`
  },

  /** Bloc de prose — différenciateur, traitement d'objection. */
  prose(b) {
    return `    <section class="pres-section${b.alt ? ' pres-section--alt' : ''}">
      <div class="container">
        <div class="pres-head">
${b.label ? `          <p class="section-label reveal">${esc(b.label)}</p>\n` : ''}          <h2 class="pres-title reveal">${b.h2}</h2>
        </div>
        <div class="pres-prose reveal">
${b.paragraphs.map((p) => `          <p>${p}</p>`).join('\n')}
        </div>
${b.bullets ? `        <ul class="pres-points" role="list">
${b.bullets.map((t) => `          <li class="pres-point reveal"><span class="pres-point-mark" aria-hidden="true"></span><p>${esc(t)}</p></li>`).join('\n')}
        </ul>\n` : ''}      </div>
    </section>`
  },

  /** Méthode — étapes numérotées, réutilise le vocabulaire des garanties. */
  method(b) {
    return `    <section class="pres-section">
      <div class="container">
        <div class="pres-head">
          <p class="section-label reveal">${esc(b.label)}</p>
          <h2 class="pres-title reveal">${b.h2}</h2>
        </div>
        <ol class="garanties-grid pres-steps" role="list">
${b.steps.map((st, i) => `          <li class="garantie reveal">
            <span class="garantie-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
            <h3 class="garantie-title">${esc(st.t)}</h3>
            <p class="garantie-text">${esc(st.d)}</p>
          </li>`).join('\n')}
        </ol>
${b.closing ? `        <p class="process-closing reveal">${esc(b.closing)}</p>\n` : ''}      </div>
    </section>`
  },

  /** Tarifs — lignes de prix + les nuances, réutilise .truth-item. */
  pricing(b) {
    return `    <section class="pres-section pres-section--alt">
      <div class="container">
        <div class="pres-head">
          <p class="section-label reveal">${esc(b.label)}</p>
          <h2 class="pres-title reveal">${b.h2}</h2>
        </div>
        <div class="pres-prices">
${b.tiers.map((t) => `          <div class="pres-price reveal">
            <div class="pres-price-head">
              <h3 class="pres-price-name">${esc(t.name)}</h3>
              <span class="pres-price-amount">${esc(t.price)}</span>
            </div>
            <p class="pres-price-desc">${esc(t.desc)}</p>
          </div>`).join('\n')}
        </div>
        <div class="tarifs-truth reveal">
${b.notes.map((n) => `          <div class="truth-item">
            <h3 class="truth-title">${esc(n.t)}</h3>
            <p class="truth-text">${esc(n.d)}</p>
          </div>`).join('\n')}
        </div>
        <p class="pres-inline-cta reveal">
          <a href="/#estimator" class="bouton bouton--principal">
            <span>${esc(b.cta)}</span>${FLECHE}
          </a>
        </p>
      </div>
    </section>`
  },

  /** Cartes de renvoi — projets ou autres pages prestations. */
  links(b) {
    return `    <section class="pres-section">
      <div class="container">
        <div class="pres-head">
          <p class="section-label reveal">${esc(b.label)}</p>
          <h2 class="pres-title reveal">${b.h2}</h2>
        </div>
        <div class="pres-links">
${b.items.map((it) => `          <a class="pres-link reveal" href="${esc(it.href)}">
            <span class="pres-link-tag">${esc(it.tag)}</span>
            <span class="pres-link-title">${esc(it.title)}</span>
            <span class="pres-link-desc">${esc(it.desc)}</span>
            <span class="pres-link-go" aria-hidden="true">→</span>
          </a>`).join('\n')}
        </div>
      </div>
    </section>`
  },

  /** FAQ — réutilise l'accordéon de l'accueil, piloté par prestation-page.ts. */
  faq(b) {
    return `    <section class="pres-section pres-section--alt" id="faq">
      <div class="container">
        <div class="pres-head">
          <p class="section-label reveal">${esc(b.label)}</p>
          <h2 class="pres-title reveal">${b.h2}</h2>
        </div>
        <div class="faq-list pres-faq" role="list">
${b.items.map(([q, a], i) => `          <div class="faq-item reveal" role="listitem">
            <button class="faq-question" aria-expanded="false">
              <span class="faq-num" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>
              <span class="faq-q-text">${esc(q)}</span>
              <span class="faq-icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-answer" hidden>
              <div class="faq-answer-inner">${esc(a)}</div>
            </div>
          </div>`).join('\n')}
        </div>
      </div>
    </section>`
  },

  /** CTA final. */
  cta(b) {
    return `    <section class="pres-cta sombre">
      <div class="container">
        <h2 class="pres-cta-title reveal">${b.h2}</h2>
        <div class="pres-prose reveal">
${b.paragraphs.map((p) => `          <p>${esc(p)}</p>`).join('\n')}
        </div>
        <div class="hero-cta-row pres-cta-row reveal">
          <a href="${esc(b.primary.href)}" class="bouton bouton--principal">
            <span>${esc(b.primary.label)}</span>${FLECHE}
          </a>
${b.secondary ? `          <a href="${esc(b.secondary.href)}" class="bouton bouton--secondaire">
            <span>${esc(b.secondary.label)}</span>
          </a>\n` : ''}        </div>
        <p class="pres-cta-note reveal">${esc(b.note)}</p>
      </div>
    </section>`
  },
}

// ── Page complète ───────────────────────────────────────────────────────────
function renderPage(page) {
  const url = `${ORIGIN}/${page.slug}`

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Accueil', url: ORIGIN + '/' }, ...page.breadcrumb.map((b) => ({
      name: b.name, url: b.url.startsWith('http') ? b.url : ORIGIN + b.url,
    }))].map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: it.url,
    })),
  }

  const faqBlock = page.blocks.find((b) => b.kind === 'faq')
  const faqLd = faqBlock && {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqBlock.items.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  }

  const serviceLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.serviceName,
    description: page.description,
    url,
    serviceType: page.serviceType,
    provider: {
      '@type': 'ProfessionalService',
      name: 'Studio Skøne',
      url: ORIGIN,
      email: 'contact@studioskone.com',
      telephone: '+33768084752',
      priceRange: '€€',
      // Adresse Maps bâtie sur le CID de la fiche plutôt que sur un lien court
      // de partage : le CID est l'identifiant permanent de l'établissement,
      // les liens courts Google ont déjà été retirés par le passé.
      sameAs: ['https://www.instagram.com/studio.skone/', 'https://maps.google.com/?cid=17161741996888223031'],
      // Pas de bloc `address` : le siège social est une domiciliation
      // parisienne que le studio n'occupe pas, et le lieu d'exercice est en
      // Loire-Atlantique. Déclarer l'un ou l'autre serait faux ou
      // contradictoire avec la fiche d'établissement. `areaServed` dit ce qui
      // est vrai — la zone couverte — et c'est la forme prévue par
      // schema.org pour une activité qui se déplace.
      // L'adresse légale reste où elle doit être : les mentions légales.
    },
    areaServed: page.areaServed.map((n) => ({ '@type': n.type, name: n.name })),
  }

  const lds = [breadcrumbLd, serviceLd, ...(faqLd ? [faqLd] : [])]

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}" />
  <meta name="author" content="Studio Skøne" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
${page.geo ? `  <meta name="geo.region" content="FR-44" />
  <meta name="geo.placename" content="Nantes" />\n` : ''}  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/bricolage-grotesque-latin-opsz-normal.woff2" crossorigin>

  <meta property="og:type"        content="website" />
  <meta property="og:locale"      content="fr_FR" />
  <meta property="og:site_name"   content="Studio Skøne" />
  <meta property="og:title"       content="${esc(page.title)}" />
  <meta property="og:description" content="${esc(page.description)}" />
  <meta property="og:image"       content="${ORIGIN}/og-image.png" />
  <meta property="og:url"         content="${url}" />
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${esc(page.title)}" />
  <meta name="twitter:description" content="${esc(page.description)}" />
  <meta name="twitter:image"       content="${ORIGIN}/og-image.png" />

${lds.map((ld) => `  <script type="application/ld+json">\n${jsonLd(ld)}\n  </script>`).join('\n')}
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>

${renderNav()}

  <main class="pres-main">

    <header class="pres-hero">
      <div class="container">
${renderBreadcrumb(page)}
        <h1 class="pres-h1">${page.h1}</h1>
        <p class="pres-hero-lead">${esc(page.lead)}</p>
${page.context ? `        <p class="pres-hero-context"><span class="hero-location-dot" aria-hidden="true"></span>${esc(page.context)}</p>\n` : ''}        <div class="hero-cta-row pres-hero-cta">
          <a href="${esc(page.ctas[0].href)}" class="bouton bouton--principal">
            <span>${esc(page.ctas[0].label)}</span>${FLECHE}
          </a>
          <a href="${esc(page.ctas[1].href)}" class="bouton bouton--secondaire">
            <span>${esc(page.ctas[1].label)}</span>
          </a>
        </div>
        <p class="hero-proof pres-hero-proof">
${page.proof.map((t, i) => (i ? `          <span class="hero-proof-sep" aria-hidden="true">·</span>\n` : '') + `          <span>${esc(t)}</span>`).join('\n')}
        </p>
      </div>
    </header>

${page.blocks.map((b) => BLOCKS[b.kind](b)).join('\n\n')}

  </main>

${renderFooter(page.slug)}

  <button id="backToTop" class="back-to-top" aria-label="Remonter en haut de page">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="18 15 12 9 6 15"/>
    </svg>
  </button>

  <script type="module" src="/src/prestation.ts"></script>
</body>
</html>
`
}

// ── Contrôle anti-cannibalisation ───────────────────────────────────────────
/**
 * Extrait les phrases de contenu d'une page (hors coquille) et vérifie
 * qu'aucune n'apparaît sur une autre page. Google ne classe ni l'une ni
 * l'autre de deux pages qui disent la même chose.
 */
function sentencesOf(page) {
  const bag = []
  const push = (s) => {
    if (typeof s !== 'string') return
    s.replace(/<[^>]+>/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .map((x) => x.trim().replace(/\s+/g, ' '))
      // Sous 40 caractères, ce sont des libellés (titres de blocs, intitulés de
      // boutons, noms d'offres), pas de la prose. Deux pages ont le droit de
      // partager « Devis gratuit » sans se cannibaliser.
      .filter((x) => x.length >= 40)
      .forEach((x) => bag.push(x))
  }
  push(page.lead); push(page.context); push(page.description)
  for (const b of page.blocks) {
    push(b.h2); push(b.turn); push(b.closing); push(b.note)
    ;(b.intro || []).forEach(push)
    ;(b.paragraphs || []).forEach(push)
    ;(b.items || []).forEach((it) => {
      if (typeof it === 'string') push(it)
      else if (Array.isArray(it)) it.forEach(push)
      else { push(it.t); push(it.d); push(it.desc); push(it.title) }
    })
    ;(b.bullets || []).forEach(push)
    ;(b.steps || []).forEach((st) => { push(st.t); push(st.d) })
    ;(b.tiers || []).forEach((t) => push(t.desc))
    ;(b.notes || []).forEach((n) => push(n.d))
  }
  return bag
}

function checkNoDuplicates(pages) {
  const seen = new Map()
  const clashes = []
  for (const p of pages) {
    for (const s of sentencesOf(p)) {
      const key = s.toLowerCase()
      if (seen.has(key) && seen.get(key) !== p.slug) {
        clashes.push({ a: seen.get(key), b: p.slug, s })
      } else {
        seen.set(key, p.slug)
      }
    }
  }
  if (clashes.length) {
    console.error('\n✗ Phrases identiques entre pages — Google n’en classerait aucune :\n')
    for (const c of clashes) console.error(`  ${c.a} ↔ ${c.b}\n    « ${c.s} »\n`)
    process.exit(1)
  }
  console.log(`✓ anti-cannibalisation : aucune phrase partagée (${seen.size} phrases vérifiées)`)
}

// ── Sitemap ─────────────────────────────────────────────────────────────────
function updateSitemap(pages, dates) {
  const path = join(ROOT, 'public', 'sitemap.xml')
  let xml = readFileSync(path, 'utf-8')

  const entries = pages.map((p) => `  <url>
    <loc>${ORIGIN}/${p.slug}</loc>
    <lastmod>${dates[p.slug]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('\n')

  // Retire les entrées prestations déjà présentes, puis réinsère avant </urlset>.
  for (const p of pages) {
    xml = xml.replace(
      new RegExp(`\\s*<url>\\s*<loc>${ORIGIN}/${p.slug}</loc>[\\s\\S]*?</url>`, 'g'), '')
  }
  xml = xml.replace(/\s*<\/urlset>/, '\n' + entries + '\n</urlset>')
  writeFileSync(path, xml, 'utf-8')
  console.log(`✓ sitemap : ${pages.length} URLs prestations à jour`)
}

// ── Main ────────────────────────────────────────────────────────────────────
/**
 * Date de dernière modification à déclarer au sitemap.
 * Une page dont le rendu n'a pas bougé garde sa date d'origine : dater du jour
 * une page inchangée dit à Google qu'elle a évolué alors que non, et cette
 * fausse indication use la confiance qu'il accorde au fichier. On ne redate
 * que ce qui a réellement changé.
 */
function lastmodFor(slug, htmlAvant, htmlApres, today) {
  if (htmlAvant !== null && htmlAvant === htmlApres) {
    const xml = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf-8')
    const m = xml.match(
      new RegExp(`<loc>${ORIGIN}/${slug}</loc>\\s*<lastmod>([^<]+)</lastmod>`))
    if (m) return m[1]
  }
  return today
}

function main() {
  checkNoDuplicates(PAGES)
  const today = new Date().toISOString().slice(0, 10)
  const dates = {}
  for (const page of PAGES) {
    const html = renderPage(page)
    const out = join(ROOT, `${page.slug}.html`)
    let avant = null
    try { avant = readFileSync(out, 'utf-8') } catch { /* première génération */ }
    dates[page.slug] = lastmodFor(page.slug, avant, html, today)
    const inchange = avant === html
    writeFileSync(out, html, 'utf-8')
    const words = html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
    console.log(`✓ ${page.slug}.html  (~${words} mots${inchange ? ', inchangé' : ''})`)
  }
  updateSitemap(PAGES, dates)
  console.log('\nPenser à `npm run build` : les pages sont des entrées de vite.config.ts.')
}

main()
