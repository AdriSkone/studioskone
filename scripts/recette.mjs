#!/usr/bin/env node
/**
 * Recette visuelle et d'accessibilité, sur les pages rendues.
 *
 * Les autres vérificateurs lisent le HTML. Celui-ci ouvre les pages dans
 * un vrai navigateur et lit les styles CALCULÉS : c'est la seule façon de
 * savoir qu'une ombre est bien absente du rendu, et pas seulement du
 * fichier où on l'a cherchée.
 *
 * Il contrôle, pour chaque page :
 *   · aucun échec de contraste WCAG AA
 *   · aucune ombre, aucun dégradé
 *   · deux libellés en capitales au maximum
 *   · aucune cible tactile sous 24 px
 *   · aucun débordement horizontal
 *   · un seul h1
 *
 * Lancer, le site étant servi :
 *   node scripts/recette.mjs http://localhost:5173 [largeur]
 */

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, unlinkSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ici = dirname(fileURLToPath(import.meta.url))
const dist = resolve(ici, '..', 'dist')

const CHROME =
  process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const base = process.argv[2] || 'http://localhost:5173'
const largeur = process.argv[3] || '1440'

const PAGES = [
  'index',
  '404',
  'refonte-site-internet',
  'creation-site-internet-nantes',
  'creation-site-internet-artisan',
  'creation-site-ecommerce-nantes',
  'creation-application-mobile',
  'projets/archeon',
  'projets/cafeo',
  'projets/garantibox',
  'projets/giftmatch',
  'projets/m-bivouak',
  'projets/merel-et-fils',
  'projets/myboat',
  'projets/pepite',
  'projets/tasq',
]

const SONDE = `
<script>
window.addEventListener('load', () => setTimeout(() => {
  const lum=(r,g,b)=>{const f=v=>{v/=255;return v<=0.03928?v/12.92:Math.pow((v+0.055)/1.055,2.4)};return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)};
  const parse=c=>(c.match(/\\d+(\\.\\d+)?/g)||[]).map(Number);
  const fondDe=el=>{let n=el;while(n&&n!==document.documentElement){const p=parse(getComputedStyle(n).backgroundColor);if(p.length>=3&&(p[3]===undefined||p[3]>0))return p;n=n.parentElement}return [246,236,219]};
  const vw=document.documentElement.clientWidth;
  const contraste=[], ombres=[], degrades=[], capitales=new Set(), debord=new Set(), petites=[];

  document.querySelectorAll('*').forEach(el=>{
    const cs=getComputedStyle(el);
    if(cs.boxShadow!=='none') ombres.push(el.tagName+'.'+(typeof el.className==='string'?el.className.split(' ')[0]:''));
    if(cs.backgroundImage.includes('gradient')) degrades.push(el.tagName);
    if(cs.textTransform==='uppercase') capitales.add((el.textContent||'').trim().slice(0,32));
    if(el.closest('.ruban, .ruban-projets')) return;
    const r=el.getBoundingClientRect();
    if(r.width&&(r.right>vw+1||r.left<-1)) debord.add(el.tagName+'.'+(typeof el.className==='string'?el.className.split(' ')[0]:''));
  });

  document.querySelectorAll('p,a,span,h1,h2,h3,h4,li,button,label,legend,strong,dt,dd,figcaption').forEach(el=>{
    const t=(el.textContent||'').trim(); if(!t||el.children.length>0||el.closest('[hidden]'))return;
    const cs=getComputedStyle(el); if(cs.display==='none'||parseFloat(cs.opacity)===0)return;
    const fg=parse(cs.color),bg=fondDe(el); if(fg.length<3)return;
    const l1=lum(fg[0],fg[1],fg[2]),l2=lum(bg[0],bg[1],bg[2]);
    const ratio=(Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05);
    const px=parseFloat(cs.fontSize),gras=parseInt(cs.fontWeight,10)>=700;
    if(ratio<((px>=24||(px>=18.66&&gras))?3:4.5)) contraste.push(t.slice(0,30)+' ('+ratio.toFixed(2)+')');
  });

  document.querySelectorAll('a,button').forEach(el=>{
    // Une hauteur nulle n'est pas une petite cible, c'est une cible
    // repliée : les cartes Réalisations et les inclus des tarifs se
    // rognent à max-height: 0 sous 768 px, pas à display: none, pour
    // rester lisibles par Google et un lecteur d'écran une fois repliés.
    const r=el.getBoundingClientRect(); if(!r.width||!r.height||el.classList.contains('skip-link'))return;
    if(el.getAttribute('aria-hidden')==='true')return;
    const a=getComputedStyle(el,'::after');
    let h=r.height,w=r.width;
    if(a.content!=='none'&&a.position==='absolute'){h+=Math.abs(parseFloat(a.top)||0)*2;w+=Math.abs(parseFloat(a.left)||0)*2}
    if(h<24||w<24) petites.push((el.textContent||'').trim().slice(0,24)+' '+Math.round(w)+'x'+Math.round(h));
  });

  const charge=JSON.stringify({h1:document.querySelectorAll('h1').length,
    contraste,ombres:[...new Set(ombres)],degrades:[...new Set(degrades)],
    capitales:[...capitales],debord:[...debord],petites,
    scrollWidth:document.documentElement.scrollWidth,viewport:vw});

  // La page est mesurée dans un cadre (voir CADRE plus bas) : le résultat
  // remonte à la page hôte, seule dont Chrome dumpe le DOM.
  if (window.parent !== window) { parent.postMessage({ recette: charge }, '*'); return }

  const pre=document.createElement('pre'); pre.id='recette';
  pre.textContent=charge;
  document.body.prepend(pre);
}, 2400));
</script>
`

/**
 * La largeur demandée n'était pas la largeur mesurée.
 *
 * `--window-size=375,900` ne donne pas une fenêtre de 375 px : sur macOS,
 * Chrome refuse de descendre sous ~500 px et rend ce plancher sans rien
 * dire. La recette « 375 » validait donc une largeur que personne
 * n'utilise, et laissait passer tout ce qui ne casse qu'en dessous — la
 * bascule de la grille à quatre colonnes, par exemple, se déclenche à
 * 767 px et n'était jamais testée dans ses vraies conditions.
 *
 * Un cadre n'a pas ce plancher : une iframe de 375 px de large donne à la
 * page qu'elle contient un viewport de 375 px, avec les mêmes media
 * queries, le même `position: fixed` et le même défilement qu'un
 * téléphone. On ouvre donc une page hôte de la taille que Chrome veut
 * bien, on y pose le cadre à la largeur exacte, et la sonde renvoie son
 * diagnostic à l'hôte, seul dont le DOM est dumpé.
 */
function pageHote(url, w, h) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>recette</title>
<style>html,body{margin:0;padding:0;background:#fff}
iframe{display:block;width:${w}px;height:${h}px;border:0}</style></head>
<body><iframe src="${url}"></iframe>
<script>
addEventListener('message', (e) => {
  if (!e.data || typeof e.data.recette !== 'string') return
  const pre = document.createElement('pre'); pre.id = 'recette'
  pre.textContent = e.data.recette
  document.body.prepend(pre)
})
</script></body></html>`
}

const HAUTEUR = 900

let echecs = 0
console.log(`Recette — ${base} · largeur ${largeur}\n`)

for (const nom of PAGES) {
  const source = resolve(dist, `${nom}.html`)
  if (!existsSync(source)) {
    console.log(`  —  ${nom} (absent du build)`)
    continue
  }
  const slug = nom.replace(/\//g, '_')
  const temp = resolve(dist, `_recette_${slug}.html`)
  const hote = resolve(dist, `_hote_${slug}.html`)
  writeFileSync(temp, readFileSync(source, 'utf8').replace('</body>', SONDE + '</body>'), 'utf8')
  writeFileSync(hote, pageHote(`${base}/_recette_${slug}.html`, largeur, HAUTEUR), 'utf8')

  let dom = ''
  try {
    dom = execFileSync(
      CHROME,
      // La fenêtre est plus large que le cadre : elle ne fait que le
      // contenir. C'est le cadre qui porte la largeur mesurée.
      ['--headless=new', '--disable-gpu', '--no-sandbox',
       `--window-size=${Number(largeur) + 80},${HAUTEUR + 80}`,
       '--virtual-time-budget=12000', '--dump-dom',
       `${base}/_hote_${slug}.html`],
      { encoding: 'utf8', maxBuffer: 60e6, stdio: ['ignore', 'pipe', 'ignore'] }
    )
  } catch {
    /* Chrome sort parfois en erreur tout en ayant écrit le DOM */
  }
  unlinkSync(temp)
  unlinkSync(hote)

  const m = dom.match(/<pre id="recette">(.*?)<\/pre>/s)
  if (!m) {
    console.log(`  ✗  ${nom} — pas de diagnostic`)
    echecs++
    continue
  }
  const d = JSON.parse(m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'))

  const soucis = []
  // Le garde-fou qui manquait : tant qu'on ne le vérifie pas, une largeur
  // silencieusement remplacée par une autre fait passer la recette pour
  // ce qu'elle n'a pas mesuré.
  if (d.viewport !== Number(largeur)) soucis.push(`largeur mesurée ${d.viewport}px ≠ ${largeur}px demandés`)
  if (d.h1 !== 1) soucis.push(`${d.h1} h1`)
  if (d.contraste.length) soucis.push(`${d.contraste.length} contraste`)
  if (d.ombres.length) soucis.push(`${d.ombres.length} ombre(s)`)
  if (d.degrades.length) soucis.push(`${d.degrades.length} dégradé(s)`)
  if (d.capitales.length > 2) soucis.push(`${d.capitales.length} capitales`)
  if (d.petites.length) soucis.push(`${d.petites.length} cible(s) < 24px`)
  if (d.scrollWidth > d.viewport + 1) soucis.push(`débordement ${d.scrollWidth}px`)

  if (!soucis.length) {
    console.log(`  ✅  ${nom}`)
  } else {
    echecs++
    console.log(`  ❌  ${nom} — ${soucis.join(' · ')}`)
    d.contraste.slice(0, 3).forEach((x) => console.log(`        contraste : ${x}`))
    d.petites.slice(0, 3).forEach((x) => console.log(`        cible : ${x}`))
    d.ombres.slice(0, 3).forEach((x) => console.log(`        ombre : ${x}`))
    d.debord.slice(0, 3).forEach((x) => console.log(`        déborde : ${x}`))
  }
}

console.log(`\n${echecs ? `❌ ${echecs} page(s) en échec` : '✅ les 16 pages passent la recette'}`)
process.exit(echecs ? 1 : 0)
