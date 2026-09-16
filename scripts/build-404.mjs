#!/usr/bin/env node
/**
 * Génère la page 404.
 *
 * Texte repris mot pour mot de l'ancienne page. Son `head` est relu et
 * réinjecté tel quel, comme pour les autres pages.
 *
 * Aucune révélation au défilement ici : elles démarrent invisibles et
 * dépendent du script. Sur une page d'erreur, un script qui n'arrive pas
 * laisserait un écran vide — exactement le contraire de ce qu'on cherche.
 * Tout est visible d'emblée. (Note reprise de l'ancienne page, qui la
 * portait déjà en commentaire.)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { navigation, piedDePage, bandeauCookies, fleche } from './partials.mjs'

const ici = dirname(fileURLToPath(import.meta.url))
const racine = resolve(ici, '..')

const CONTENU = {
  code: '404',
  titre: { debut: 'Cette page', accent: "n'existe pas." },
  lead:
    "Ça arrive même aux meilleurs sites. Un lien qui a vieilli, une adresse mal recopiée, " +
    "une page que j'ai retirée. Voici celles qui existent.",
  liens: [
    { tag: 'Accueil',    titre: 'Studio Skøne',              desc: 'Le studio, la méthode, les réalisations et les tarifs.',   href: '/' },
    { tag: 'Prestation', titre: 'Création de site internet', desc: 'Site vitrine ou multi-pages, à Nantes et partout en France.', href: '/creation-site-internet-nantes' },
    { tag: 'Prestation', titre: 'Refonte de site',           desc: 'Reprendre un site existant sans perdre son référencement.',  href: '/refonte-site-internet' },
    { tag: 'Prestation', titre: 'Site e-commerce',           desc: 'Boutique en ligne, du catalogue à la première commande.',    href: '/creation-site-ecommerce-nantes' },
    { tag: 'Prestation', titre: 'Application mobile',        desc: 'iOS et Android, du premier écran à la publication.',         href: '/creation-application-mobile' },
    { tag: 'Prestation', titre: 'Site pour artisan',         desc: "Trouvé sur Google, lisible sur téléphone, fait pour l'appel.", href: '/creation-site-internet-artisan' },
  ],
  actions: [
    { libelle: "Retour à l'accueil", href: '/',         variante: 'principal' },
    { libelle: 'Écrire au studio',   href: '/#contact', variante: 'secondaire' },
  ],
  note: 'Vous cherchiez quelque chose de précis ? Écrivez-moi, je réponds moi-même sous 24 h ouvrées.',
}

const head = readFileSync(resolve(ici, 'contenu/heads/404.html'), 'utf8')

const liens = CONTENU.liens
  .map(
    (l) => `          <a class="pres-link" href="${l.href}">
            <span class="pres-link-tag">${l.tag}</span>
            <span class="pres-link-title">${l.titre}</span>
            <span class="pres-link-desc">${l.desc}</span>
          </a>`
  )
  .join('\n')

const actions = CONTENU.actions
  .map(
    (a) =>
      `        <a class="bouton bouton--${a.variante}" href="${a.href}">${a.libelle}${a.variante === 'principal' ? fleche : ''}</a>`
  )
  .join('\n')

const page = `<!doctype html>
<html lang="fr">
<head>
${head}</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>

${navigation({ prefixe: '/' })}

  <main id="contenu" class="section-m">
    <div class="grille">
      <span class="err-code" aria-hidden="true" style="--col: 1 / -1">${CONTENU.code}</span>
      <h1 class="t-h1 err-titre" style="--col: 1 / span 8">${CONTENU.titre.debut} <span class="err-accent">${CONTENU.titre.accent}</span></h1>
      <p class="err-lead" style="--col: 1 / span 6">${CONTENU.lead}</p>

      <div class="pres-links err-liens" style="--col: 1 / -1">
${liens}
      </div>

      <div class="err-actions" style="--col: 1 / span 8">
${actions}
      </div>

      <p class="err-note" style="--col: 1 / span 6">${CONTENU.note}</p>
    </div>
  </main>

${piedDePage({ prefixe: '/' })}

${bandeauCookies()}

  <script type="module" src="/src/prestation.ts"></script>
</body>
</html>
`

writeFileSync(resolve(racine, '404.html'), page, 'utf8')
console.log('✅ 404.html générée')
