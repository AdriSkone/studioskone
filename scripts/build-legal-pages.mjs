#!/usr/bin/env node
/**
 * Génère les pages HTML statiques des documents légaux à partir des fichiers Markdown.
 * Lance : `node scripts/build-legal-pages.mjs`
 *
 * Pour chaque .md dans `Documents légaux/`, produit un fichier HTML dans `public/`
 * avec en-tête (back link + brand), table des matières, et footer (autres pages légales).
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'Documents légaux')
const OUT_DIR = join(ROOT, 'public')

// ── Mapping markdown filename → URL slug + page title + footer label ─────────
const PAGES = [
  { md: '01-mentions-legales.md',            slug: 'mentions-legales',            footer: 'Mentions légales' },
  { md: '02-politique-de-confidentialite.md', slug: 'politique-de-confidentialite', footer: 'Politique de confidentialité' },
  { md: '03-cgu.md',                          slug: 'cgu',                          footer: 'CGU' },
  { md: '04-cgv.md',                          slug: 'cgv',                          footer: 'CGV' },
]

// ── Échappement HTML ────────────────────────────────────────────────────────
function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]))
}

// ── Markdown → HTML (parser minimaliste, adapté à nos documents) ────────────
function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n')
  const out = []
  let i = 0

  // Saute le titre de niveau 1 (on l'affichera séparément) et la ligne "Dernière mise à jour"
  let topTitle = ''
  let lastUpdated = ''
  while (i < lines.length) {
    const l = lines[i].trim()
    if (!topTitle && l.startsWith('# ')) {
      topTitle = l.slice(2).trim()
      i++
    } else if (!lastUpdated && l.startsWith('*Dernière mise à jour')) {
      lastUpdated = l.replace(/^\*|\*$/g, '').trim()
      i++
    } else if (l === '') {
      i++
    } else {
      break
    }
  }

  // Intro = bloc avant le premier `---` (paragraphes + listes + tables, mais pas de h2)
  const introLines = []
  while (i < lines.length && !/^---\s*$/.test(lines[i].trim())) {
    introLines.push(lines[i])
    i++
  }
  const introHtml = renderBlocks(introLines)

  // Sections h2 et leur contenu, séparées par `---`
  const sections = []
  if (i < lines.length && /^---\s*$/.test(lines[i].trim())) i++
  while (i < lines.length) {
    const sec = []
    while (i < lines.length && !/^---\s*$/.test(lines[i].trim())) {
      sec.push(lines[i])
      i++
    }
    if (i < lines.length) i++ // saute le ---
    const block = sec.join('\n').trim()
    if (block) sections.push(block)
  }

  // Génère TOC à partir des h2
  const toc = []
  const sectionHtmls = sections.map((sec) => {
    const m = sec.match(/^##\s+(.+)$/m)
    let anchor = ''
    let title = ''
    if (m) {
      title = m[1].trim()
      anchor = slugify(title)
      toc.push({ anchor, title })
    }
    return renderSection(sec, anchor)
  })

  return { topTitle, lastUpdated, introHtml, sectionsHtml: sectionHtmls.join('\n\n'), toc }
}

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// Rendu d'une section h2 + son contenu
function renderSection(sec, anchor) {
  const lines = sec.split('\n')
  const out = []
  let i = 0
  // Premier ligne = ## titre
  if (lines[i] && lines[i].startsWith('## ')) {
    const title = lines[i].slice(3).trim()
    out.push(`<h2 id="${anchor}">${inline(title)}</h2>`)
    i++
  }
  // Le reste = blocs génériques
  out.push(renderBlocks(lines.slice(i)))
  return out.join('\n')
}

// Rendu d'un ensemble de blocs (paragraphes, listes, tables, h3, h4). Pas de h2.
function renderBlocks(lines) {
  const out = []
  let i = 0
  while (i < lines.length) {
    const l = lines[i]
    // h3
    if (l.startsWith('### ')) {
      out.push(`<h3>${inline(l.slice(4).trim())}</h3>`)
      i++
    }
    // h4
    else if (l.startsWith('#### ')) {
      out.push(`<h4>${inline(l.slice(5).trim())}</h4>`)
      i++
    }
    // Table : ligne commençant par |
    else if (/^\|/.test(l.trim())) {
      const tableLines = []
      while (i < lines.length && /^\|/.test(lines[i].trim())) {
        tableLines.push(lines[i])
        i++
      }
      out.push(renderTable(tableLines))
    }
    // Liste à puces
    else if (/^[-*]\s/.test(l.trim())) {
      const items = []
      while (i < lines.length && /^[-*]\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2))
        i++
      }
      out.push('<ul>')
      items.forEach((it) => out.push(`  <li>${inline(it)}</li>`))
      out.push('</ul>')
    }
    // Liste numérotée
    else if (/^\d+\.\s/.test(l.trim())) {
      const items = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''))
        i++
      }
      out.push('<ol>')
      items.forEach((it) => out.push(`  <li>${inline(it)}</li>`))
      out.push('</ol>')
    }
    // Paragraphe (bloc continu)
    else if (l.trim() !== '') {
      const para = [l]
      i++
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].startsWith('#') &&
        !/^[-*]\s/.test(lines[i].trim()) &&
        !/^\d+\.\s/.test(lines[i].trim()) &&
        !/^\|/.test(lines[i].trim())
      ) {
        para.push(lines[i])
        i++
      }
      out.push(`<p>${inline(para.join(' ').trim())}</p>`)
    } else {
      i++
    }
  }
  return out.join('\n')
}

// Inline : bold, italic, code, links
function inline(s) {
  let out = esc(s)
  // Échappement déjà fait — on désescape les chevrons dans les balises Markdown qu'on va générer
  // Liens [texte](url) — supporte http(s) et chemins relatifs
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
    const safeHref = /^https?:\/\//.test(href) ? href : href
    return `<a href="${esc(safeHref)}">${text}</a>`
  })
  // Bold
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // Italic
  out = out.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>')
  // Code inline
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  return out
}

function renderTable(lines) {
  // Supprime les lignes vides et la ligne de séparation ---|---
  const cleaned = lines
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  if (cleaned.length === 0) return ''

  const parseRow = (l) =>
    l
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim())

  const headerCells = parseRow(cleaned[0])
  // ligne 2 = séparateur (|---|---|), on la saute
  const bodyLines = cleaned.slice(2)
  const bodyRows = bodyLines.map(parseRow)

  const thead = `<thead><tr>${headerCells.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>`
  const tbody = `<tbody>${bodyRows
    .map((row) => `<tr>${row.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`)
    .join('')}</tbody>`
  return `<table>${thead}${tbody}</table>`
}

// ── Template HTML de la page ────────────────────────────────────────────────
function pageTemplate({ slug, title, lastUpdated, intro, toc, body, footerLinks }) {
  const tocHtml = toc
    .map((t) => `      <li><a href="#${t.anchor}">${esc(t.title)}</a></li>`)
    .join('\n')

  const footerLinksHtml = footerLinks
    .map((l) => {
      const aria = l.slug === slug ? ' aria-current="page"' : ''
      return `      <a href="/${l.slug}"${aria}>${esc(l.footer)}</a>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} — Studio Skøne</title>
  <meta name="description" content="${esc(title)} du site studioskone.com — Studio Skøne, agence digitale parisienne.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/legal.css">
</head>
<body>
  <header class="legal-header">
    <div class="legal-header-inner">
      <a href="/" class="legal-back" aria-label="Retour à l'accueil">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Retour à l'accueil
      </a>
      <a href="/" class="legal-brand" aria-label="Studio Skøne">
        <img src="/logo_skone_sansh2.svg" alt="">
        <span>Studio Skøne</span>
      </a>
    </div>
  </header>

  <main class="legal-main">
    <span class="legal-eyebrow">Document légal</span>
    <h1 class="legal-title">${esc(title)}</h1>
    <p class="legal-meta">${esc(lastUpdated)}</p>

    <div class="legal-intro">${intro}</div>

    <nav class="legal-toc" aria-label="Table des matières">
      <p class="legal-toc-label">Table des matières</p>
      <ol>
${tocHtml}
      </ol>
    </nav>

    <article class="legal-content">
${body}
    </article>
  </main>

  <footer class="legal-footer">
    <div class="legal-footer-inner">
      <span class="legal-footer-copy">© 2026 Studio Skøne. Tous droits réservés.</span>
      <nav class="legal-footer-links" aria-label="Documents légaux">
${footerLinksHtml}
      </nav>
    </div>
  </footer>
</body>
</html>
`
}

// ── Build ───────────────────────────────────────────────────────────────────
function buildPage(page, allPages) {
  const md = readFileSync(join(SRC_DIR, page.md), 'utf-8')
  const { topTitle, lastUpdated, introHtml, sectionsHtml, toc } = mdToHtml(md)
  const html = pageTemplate({
    slug: page.slug,
    title: topTitle || page.footer,
    lastUpdated: lastUpdated || '',
    intro: introHtml,
    toc,
    body: sectionsHtml,
    footerLinks: allPages,
  })
  const outPath = join(OUT_DIR, `${page.slug}.html`)
  writeFileSync(outPath, html, 'utf-8')
  return outPath
}

function main() {
  mkdirSync(OUT_DIR, { recursive: true })
  console.log('Génération des pages légales…')
  for (const page of PAGES) {
    const out = buildPage(page, PAGES)
    console.log(`  ✓ ${out.replace(ROOT + '/', '')}`)
  }
  console.log('Terminé. Les pages sont dans public/.')
}

main()
