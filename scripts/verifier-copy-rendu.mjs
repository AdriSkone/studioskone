#!/usr/bin/env node
/**
 * Vérifie le copy tel qu'il est RENDU, une fois le JavaScript passé.
 *
 * verifier-copy.mjs lit le HTML servi ; il ne voit donc rien de ce que les
 * scripts font ensuite au texte. C'est une vraie faille, et elle a déjà
 * laissé passer un défaut : le découpage du titre du hero en lignes
 * supprimait l'espace aux jointures, et affichait « clientsméritent ».
 * Invisible à l'œil — chaque ligne est un bloc — mais c'est ce qu'un
 * lecteur d'écran annonce et ce qu'un visiteur copie.
 *
 * Ce script ouvre donc la page dans un vrai navigateur, attend que tout se
 * soit joué, et compare le texte obtenu au fichier source.
 *
 * Lancer : node scripts/verifier-copy-rendu.mjs <url> <fichier-source>
 *   ex.   node scripts/verifier-copy-rendu.mjs http://localhost:4173/ index.html
 */

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const CHROME =
  process.env.CHROME_PATH ||
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const [url, source] = process.argv.slice(2)
if (!url || !source) {
  console.error('usage : node scripts/verifier-copy-rendu.mjs <url> <fichier-source>')
  process.exit(2)
}

function texte(html) {
  return html
    .replace(/\s+/g, ' ')
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#?[a-z0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Les mots du texte, sans ponctuation ni signes décoratifs. */
const mots = (t) =>
  t
    .replace(/[→←·●•+«»"'’,.;:!?()]/g, ' ')
    .split(/\s+/)
    .filter((m) => m.length > 1)

const rendu = execFileSync(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--virtual-time-budget=9000',
    '--dump-dom',
    url,
  ],
  // Chrome bavarde sur stderr au démarrage ; ce n'est pas notre affaire.
  { encoding: 'utf8', maxBuffer: 50e6, stdio: ['ignore', 'pipe', 'ignore'] }
)

const tSource = texte(readFileSync(source, 'utf8'))
const tRendu = texte(rendu)

// Chaque mot du source doit se retrouver dans le rendu, et l'inverse. Un
// mot collé à son voisin disparaît des deux listes à la fois : c'est ce qui
// le rend détectable.
const motsSource = new Set(mots(tSource))
const motsRendu = new Set(mots(tRendu))

const perdus = [...motsSource].filter((m) => !motsRendu.has(m))
const apparus = [...motsRendu].filter((m) => !motsSource.has(m))

/**
 * Ce qu'on cherche, ce sont les PERTES.
 *
 * Des mots peuvent légitimement apparaître : le formulaire de contact est
 * monté par un script, son texte n'est donc nulle part dans le source. En
 * revanche, un mot du source qui manque à l'arrivée signale toujours un
 * défaut — texte écrasé, mots collés, nœud supprimé par erreur.
 */
if (!perdus.length) {
  const note = apparus.length ? ` · ${apparus.length} mot(s) ajouté(s) par un composant` : ''
  console.log(`✅ ${url} — aucun mot perdu au rendu (${motsSource.size} mots vérifiés${note})`)
  process.exit(0)
}

console.log(`\n❌ ${url} — le JavaScript a fait disparaître du texte`)
console.log(`\n  ${perdus.length} mot(s) du source absent(s) du rendu :`)
perdus.slice(0, 25).forEach((m) => console.log(`    − ${m}`))
process.exit(1)
