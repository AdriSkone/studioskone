#!/usr/bin/env node
/**
 * Compare les balises de référencement d'une page à celles de `main`.
 *
 * Le cahier des charges pose « aucune régression SEO » comme règle
 * absolue : title, description, canonical, Open Graph, Twitter, geo,
 * robots, données structurées et attributs alt doivent être repris à
 * l'identique. Ce script le vérifie balise par balise plutôt que de
 * l'affirmer.
 */

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

function balises(html) {
  const tete = html.slice(0, html.indexOf('</head>'))
  const out = new Map()

  const titre = tete.match(/<title>([\s\S]*?)<\/title>/i)
  if (titre) out.set('title', titre[1].trim())

  for (const m of tete.matchAll(/<meta\s+([^>]+?)\/?>/gi)) {
    const attrs = m[1]
    const cle = (attrs.match(/(?:name|property)="([^"]+)"/i) || [])[1]
    const val = (attrs.match(/content="([^"]*)"/i) || [])[1]
    if (cle) out.set(`meta:${cle}`, (val || '').trim())
  }

  for (const m of tete.matchAll(/<link\s+([^>]+?)\/?>/gi)) {
    const rel = (m[1].match(/rel="([^"]+)"/i) || [])[1]
    const href = (m[1].match(/href="([^"]*)"/i) || [])[1]
    if (rel === 'canonical') out.set('link:canonical', href)
  }

  const lds = [...tete.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  lds.forEach((m, i) => {
    try {
      const o = JSON.parse(m[1])
      out.set(`jsonld:${o['@type'] || i}`, JSON.stringify(o))
    } catch {
      out.set(`jsonld:${i}`, 'ILLISIBLE')
    }
  })

  return out
}

/**
 * Les balises dont le changement est voulu, et pourquoi.
 *
 * Une entrée par balise réellement modifiée, avec sa raison. Tout ce qui
 * n'est pas listé ici et qui change fait échouer la vérification — c'est
 * le but du script.
 */
const CHANGEMENTS_DECLARES = {
  'index.html': {
    'meta:description':        'Nouvelle grille tarifaire du 18 septembre 2026 : le délai passe de « 2 à 6 semaines » à « 5 jours à 3 semaines ».',
    'meta:og:description':     'Idem meta description.',
    'meta:twitter:description':'Idem meta description.',
    'jsonld:ProfessionalService': 'Les six Offer deviennent trois formules à prix fermes (900, 1900, 3000) plus l’option design à 600, avec priceCurrency et availability.',
  },
  'projets/tasq.html': {
    'meta:og:image':
      "L'image de partage montrait Tasq dans son ancienne charte " +
      'terracotta, abandonnée en septembre 2026 au profit du « calme ' +
      "japonais ». Le fichier /work/tasq.png a été remplacé ; l'ancien " +
      "n'existe plus, et laisser la balise pointer dessus casserait " +
      'toute prévisualisation de la page. La nouvelle image est un PNG ' +
      "de 1200 × 630 et non le WebP du site : plusieurs réseaux sociaux " +
      'ne lisent pas encore le WebP dans une og:image.',
  },
}

/**
 * Les alt d'image dont la disparition est admise, et pourquoi.
 *
 * Le logo était une image portant alt="Studio Skøne" dans la barre et dans
 * le pied. Les maquettes le composent en toutes lettres, en Bricolage 800 :
 * ce n'est plus une image, donc plus un alt. Le nom n'est pas perdu pour
 * autant — il reste dans l'aria-label du lien et dans la phrase du pied de
 * page. Un texte réel vaut mieux qu'un texte de remplacement.
 */
const ALTS_DEVENUS_TEXTE = ['Studio Skøne']

/** Les alt d'image : ils comptent autant que les meta. */
function alts(html) {
  return [...html.matchAll(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi)].map((m) => m[1]).sort()
}

let echecs = 0

for (const fichier of process.argv.slice(2)) {
  let avant
  try {
    avant = execSync(`git show main:${fichier}`, { encoding: 'utf8', maxBuffer: 20e6 })
  } catch {
    console.log(`— ${fichier} : absent de main`)
    continue
  }
  const apres = readFileSync(fichier, 'utf8')

  const a = balises(avant)
  const b = balises(apres)
  const soucis = []

  const declares = CHANGEMENTS_DECLARES[fichier] || {}

  for (const [cle, val] of a) {
    if (!b.has(cle)) soucis.push(`  − ${cle} : SUPPRIMÉE`)
    else if (b.get(cle) !== val) {
      if (declares[cle]) continue
      soucis.push(`  ≠ ${cle}\n      avant : ${val.slice(0, 110)}\n      après : ${b.get(cle).slice(0, 110)}`)
    }
  }
  for (const cle of b.keys()) {
    if (!a.has(cle) && !cle.startsWith('meta:viewport') && !cle.startsWith('meta:charset'))
      soucis.push(`  + ${cle} : AJOUTÉE (${b.get(cle).slice(0, 80)})`)
  }

  const altAvant = alts(avant)
  const altApres = alts(apres)
  const altPerdus = altAvant.filter(
    (x) => x && !altApres.includes(x) && !ALTS_DEVENUS_TEXTE.includes(x)
  )
  if (altPerdus.length) soucis.push(`  − ${altPerdus.length} attribut(s) alt perdu(s) :\n      ${altPerdus.slice(0, 6).join('\n      ')}`)

  if (!soucis.length) {
    console.log(`✅ ${fichier} — ${a.size} balises SEO et ${altAvant.length} alt identiques`)
  } else {
    echecs++
    console.log(`\n❌ ${fichier}`)
    soucis.forEach((s) => console.log(s))
  }
}

process.exit(echecs ? 1 : 0)
