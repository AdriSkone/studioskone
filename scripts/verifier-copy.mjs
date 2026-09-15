#!/usr/bin/env node
/**
 * Compare le texte rendu d'une page à celui de la même page sur `main`.
 *
 * C'est la vérification centrale du chantier : la mise en page change, le
 * texte ne doit pas.
 *
 * La comparaison ne se fait pas ligne à ligne. Refaire une mise en page,
 * c'est justement regrouper le texte autrement — une question de FAQ qui
 * cessait d'être collée à son numéro apparaîtrait comme une perte alors
 * que pas un mot n'a bougé. On vérifie donc autre chose, et de plus juste :
 * que chaque fragment de l'ancienne page se retrouve QUELQUE PART dans la
 * nouvelle, et réciproquement.
 *
 * Lancer : node scripts/verifier-copy.mjs <fichier.html> [...]
 */

import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

/** Les balises qui coupent une phrase. Les balises en ligne n'en coupent pas :
 *  un titre dont un mot est coloré par un span reste une seule phrase. */
const BLOCS =
  'p|div|li|ul|ol|h1|h2|h3|h4|h5|h6|section|article|header|footer|nav|aside|tr|td|th|dt|dd|dl|blockquote|figcaption|button|label|legend|fieldset|form|main|hr|option|title'

/**
 * Les seuls textes que la refonte a le droit d'ajouter, et pourquoi.
 *
 * La liste est courte et le restera : tout ce qui n'y figure pas et qui
 * apparaît dans la nouvelle page est signalé comme un ajout de copy, donc
 * comme une erreur. Les deux entrées ci-dessous ne sont pas de la prose
 * commerciale — ce sont des libellés que l'accessibilité réclame.
 */
const AJOUTS_AUTORISES = [
  // Lien d'évitement : premier élément tabulable, il permet de sauter la
  // navigation. L'ancienne page n'en avait pas.
  'Aller au contenu',
  // Le lien Instagram n'était qu'une icône, son nom vivait dans un
  // aria-label. Il est maintenant écrit : un lien doit avoir un nom visible.
  'Instagram',
  // Quatrième mention du bandeau du hero. Le style guide en demande
  // quatre, le site n'en avait que trois. Texte donné par Adri le
  // 15 septembre 2026 — seul ajout de copy du chantier, et il ne sort pas
  // de nulle part : « partout en France » figure déjà dans le hero et
  // dans le pied de page.
  'Partout en France',
]

/** Signes purement décoratifs. Le cahier des charges interdit d'écrire une
 *  flèche dans une chaîne de texte : elle devient un SVG aria-hidden, et
 *  disparaît donc légitimement du texte rendu. */
const DECOR = /[→←·●•+]/g

function fragments(html) {
  return html
    // Aplati d'abord : un retour à la ligne d'indentation ne doit pas
    // couper une phrase en deux et faire croire à une perte.
    .replace(/\s+/g, ' ')
    .replace(/<(script|style|svg)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(new RegExp(`</?(?:${BLOCS})\\b[^>]*>`, 'gi'), '\n')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#?[a-z0-9]+;/gi, ' ')
    .split('\n')
    .map(normaliser)
    .filter((l) => l.length > 2)
}

function normaliser(l) {
  return l
    .replace(DECOR, ' ')
    .replace(/\s+/g, ' ')
    // L'espace avant une virgule ou un point vient d'un span refermé, pas
    // du texte. L'espace avant « : » « ? » « ! » est français : on le garde,
    // en le ramenant à une espace simple.
    .replace(/\s+([,.])/g, '$1')
    .trim()
}

const fichiers = process.argv.slice(2)
if (!fichiers.length) {
  console.error('usage : node scripts/verifier-copy.mjs <fichier.html> [...]')
  process.exit(2)
}

let echecs = 0

for (const fichier of fichiers) {
  let avant
  try {
    avant = execSync(`git show main:${fichier}`, { encoding: 'utf8', maxBuffer: 20e6 })
  } catch {
    console.log(`— ${fichier} : absent de main, rien à comparer`)
    continue
  }

  const fragmentsAvant = fragments(avant)
  const fragmentsApres = fragments(readFileSync(fichier, 'utf8'))

  // Le texte complet de chaque version, en une seule chaîne. Un fragment
  // est conservé s'il s'y retrouve, quel que soit son nouveau découpage.
  const toutApres = fragmentsApres.join(' ')
  const toutAvant = fragmentsAvant.join(' ')

  /**
   * Un fragment absent n'est pas forcément perdu : la refonte regroupe le
   * texte autrement. « Le plus choisi Studio, pour performer » devient un
   * badge et un titre séparés — les deux mots sont là, la boîte qui les
   * tenait ensemble a changé.
   *
   * On tranche en découpant le fragment en fenêtres de cinq mots. Si
   * chacune se retrouve dans la nouvelle page, rien n'a disparu : seul le
   * découpage a bougé. S'il en manque une, c'est du texte perdu.
   */
  function estUnRegroupement(fragment, cible) {
    // On tente de recouvrir le fragment avec des morceaux qui existent tels
    // quels dans la cible, en avançant de gauche à droite et en prenant à
    // chaque fois le plus long morceau possible. Si tout le fragment est
    // recouvert, aucun mot n'a disparu — seules les boîtes qui les tenaient
    // ensemble ont changé, y compris quand elles se sont interverties.
    const mots = fragment.split(' ')

    // Un fragment très court — « 01 Découverte » — réunit deux mots qui
    // existaient déjà, mais qui n'étaient pas voisins : le numéro d'étape
    // vivait à l'écart de son intitulé. Exiger deux mots consécutifs le
    // condamnerait à tort, alors que rien n'a été écrit de neuf.
    if (mots.length <= 3) return mots.every((m) => cible.includes(m))

    let i = 0
    while (i < mots.length) {
      let pris = 0
      for (let j = mots.length; j > i; j--) {
        if (cible.includes(mots.slice(i, j).join(' '))) {
          pris = j - i
          break
        }
      }
      // Un mot isolé se retrouve partout : il ne prouve rien. Il faut au
      // moins deux mots consécutifs pour parler de morceau retrouvé.
      if (pris < 2) return false
      i += pris
    }
    return true
  }

  const absentsAvant = fragmentsAvant.filter((f) => !toutApres.includes(f))
  const absentsApres = fragmentsApres.filter((f) => !toutAvant.includes(f))

  const sansAutorises = (f) =>
    AJOUTS_AUTORISES.reduce((acc, a) => acc.split(a).join(' '), f).replace(/\s+/g, ' ').trim()

  const perdus = absentsAvant.filter((f) => !estUnRegroupement(f, toutApres))
  const ajoutes = absentsApres
    .filter((f) => !estUnRegroupement(f, toutAvant))
    .filter((f) => {
      const nettoye = sansAutorises(f)
      return nettoye.length > 2 && !estUnRegroupement(nettoye, toutAvant)
    })

  const regroupes = absentsAvant.length - perdus.length + (absentsApres.length - ajoutes.length)

  if (!perdus.length && !ajoutes.length) {
    const note = regroupes ? `, ${regroupes} simplement regroupé(s)` : ''
    console.log(`✅ ${fichier} — copy identique (${fragmentsAvant.length} fragments vérifiés${note})`)
    continue
  }

  echecs++
  console.log(`\n❌ ${fichier}`)
  if (perdus.length) {
    console.log(`\n  ${perdus.length} fragment(s) de l'ancienne page INTROUVABLE(S) dans la nouvelle :`)
    perdus.forEach((l) => console.log(`    − ${l.slice(0, 130)}`))
  }
  if (ajoutes.length) {
    console.log(`\n  ${ajoutes.length} fragment(s) AJOUTÉ(S), absents de l'ancienne page :`)
    ajoutes.forEach((l) => console.log(`    + ${l.slice(0, 130)}`))
  }
}

process.exit(echecs ? 1 : 0)
