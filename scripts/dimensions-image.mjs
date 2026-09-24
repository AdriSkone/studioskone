/**
 * Les dimensions réelles d'une image, lues dans le fichier.
 *
 * Pourquoi ça existe : sans `width` et `height` sur une balise `img`, le
 * navigateur ne sait pas quelle place réserver. Il pose le texte, va
 * chercher l'image, puis décale tout ce qui suit quand elle arrive. Les
 * neuf pages projet — celles qui portent le travail — sautaient ainsi à
 * chaque chargement.
 *
 * Les deux attributs ne redimensionnent rien : le CSS garde la main
 * (`width: 100%`, `aspect-ratio`). Ils ne servent qu'à donner la
 * proportion avant que l'image n'arrive.
 *
 * Les valeurs sont lues dans les fichiers plutôt qu'écrites à la main :
 * une dimension recopiée devient fausse à la première image remplacée, et
 * une proportion fausse déplace la page autant qu'une proportion absente.
 */

import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const publics = resolve(ici, '..', 'public')

/** Mémoire : chaque fichier n'est lu qu'une fois par build. */
const cache = new Map()

function lire(buf) {
  // PNG : la taille vit dans le chunk IHDR, toujours en tête.
  if (buf.length > 24 && buf.slice(1, 4).toString() === 'PNG') {
    return [buf.readUInt32BE(16), buf.readUInt32BE(20)]
  }

  // WebP : trois encodages, trois emplacements.
  if (buf.length > 30 && buf.slice(0, 4).toString() === 'RIFF' && buf.slice(8, 12).toString() === 'WEBP') {
    const type = buf.slice(12, 16).toString()
    if (type === 'VP8X') return [(buf.readUIntLE(24, 3) & 0xffffff) + 1, (buf.readUIntLE(27, 3) & 0xffffff) + 1]
    if (type === 'VP8 ') return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff]
    if (type === 'VP8L') {
      const bits = buf.readUInt32LE(21)
      return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1]
    }
  }

  // JPEG : il faut parcourir les segments jusqu'à un marqueur SOF.
  if (buf.length > 4 && buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue }
      const marqueur = buf[i + 1]
      // SOF0–SOF15, en sautant les marqueurs qui n'en sont pas.
      if (marqueur >= 0xc0 && marqueur <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marqueur)) {
        return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)]
      }
      i += 2 + buf.readUInt16BE(i + 2)
    }
  }

  // SVG : width/height s'ils sont posés, sinon la proportion du viewBox.
  const texte = buf.slice(0, 2048).toString('utf8')
  if (texte.includes('<svg')) {
    const w = texte.match(/\swidth="(\d+(?:\.\d+)?)/)
    const h = texte.match(/\sheight="(\d+(?:\.\d+)?)/)
    if (w && h) return [Math.round(+w[1]), Math.round(+h[1])]
    const vb = texte.match(/viewBox="[\d.-]+\s+[\d.-]+\s+([\d.]+)\s+([\d.]+)"/)
    if (vb) return [Math.round(+vb[1]), Math.round(+vb[2])]
  }

  return null
}

/**
 * Rend ` width="W" height="H"` prêt à coller dans une balise, ou une
 * chaîne vide si le fichier est introuvable ou d'un format non lu.
 *
 * Le silence est volontaire : un build ne doit pas tomber parce qu'une
 * image a changé de format. L'attribut manque, la page reste juste.
 */
export function attributsTaille(src) {
  if (cache.has(src)) return cache.get(src)

  let sortie = ''
  const chemin = resolve(publics, src.replace(/^\//, ''))
  if (existsSync(chemin)) {
    const taille = lire(readFileSync(chemin))
    if (taille) sortie = ` width="${taille[0]}" height="${taille[1]}"`
  }

  cache.set(src, sortie)
  return sortie
}

/** Les dimensions brutes, pour qui a besoin des nombres. */
export function dimensions(src) {
  const chemin = resolve(publics, src.replace(/^\//, ''))
  return existsSync(chemin) ? lire(readFileSync(chemin)) : null
}
