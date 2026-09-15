#!/usr/bin/env node
/**
 * Génère index.html.
 *
 * Ce fichier ne contient aucun texte : tout vient de scripts/contenu/. Le
 * head, lui, est repris tel quel depuis contenu/head-accueil.html — c'est
 * ce qui garantit qu'aucune balise SEO ne bouge, puisque personne ne la
 * retape. Seul le JSON-LD de la FAQ y est réinjecté, construit à partir
 * des mêmes questions que la section visible : l'ancienne page promettait
 * en commentaire qu'ils étaient « miroir exact », c'est maintenant vrai
 * par construction.
 *
 * Lancer : node scripts/build-accueil.mjs
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as C from './contenu/accueil.mjs'
import { projets } from './contenu/projets.mjs'
import { navigation, piedDePage, bandeauCookies, fleche } from './partials.mjs'

const ici = dirname(fileURLToPath(import.meta.url))
const racine = resolve(ici, '..')

/** Le texte des données porte déjà ses entités ; on ne réencode rien. */
const html = (s) => s

/* ── Head ─────────────────────────────────────────────────────────── */

function jsonLdFaq() {
  const questions = C.faq.items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.r },
  }))
  const bloc = JSON.stringify(
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: questions },
    null,
    2
  )
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n')
  return `  <!-- Schema.org JSON-LD · FAQPage (généré depuis le même contenu que la section) -->
  <script type="application/ld+json">
${bloc}
  </script>`
}

/* ── Sections ─────────────────────────────────────────────────────── */

function hero() {
  const piste = [...C.ruban, ...C.ruban]
    .map((r) => `<span class="ruban-item">${r}</span>`)
    .join('')

  const preuves = C.hero.preuves.map((p) => `<span>${p}</span>`).join('\n        ')

  return `  <section class="hero" id="hero">
    <div class="grille hero-corps">
      <h1 class="t-display hero-titre" style="--col: 1 / -1">
        ${C.hero.titre.avant} <span class="hero-accent">${C.hero.titre.accent}</span>
      </h1>

      <p class="hero-statement">${C.hero.statement}</p>

      <div class="hero-actions">
        <div class="hero-boutons">
          <a class="bouton bouton--principal" href="${C.hero.ctas[0].href}">${C.hero.ctas[0].libelle}</a>
          <a class="lien hero-lien" href="${C.hero.ctas[1].href}">${C.hero.ctas[1].libelle}</a>
        </div>
        <p class="hero-lieu">${C.hero.lieu}</p>
      </div>

      <p class="hero-preuves">
        ${preuves}
      </p>
    </div>

    <div class="ruban" aria-hidden="true">
      <div class="ruban-piste">${piste}</div>
    </div>
  </section>`
}

function probleme() {
  const items = C.probleme.symptomes
    .map((s) => `        <li class="symptome" data-reveal>${s}</li>`)
    .join('\n')

  return `  <section class="section-m" id="probleme">
    <div class="grille">
      <p class="tete-bloc">${C.probleme.label}</p>
      <h2 class="probleme-titre" style="--col: 3 / span 8">${C.probleme.titre.debut} ${C.probleme.titre.accent}</h2>
      <ul class="probleme-liste" style="--col: 3 / span 9">
${items}
      </ul>
    </div>
  </section>`
}

/**
 * Le pivot. Les maquettes le sortent du bloc « problème » pour lui donner
 * sa propre section, seule et en grand. Le texte est le même — il ne doit
 * donc apparaître qu'ici, et nulle part ailleurs.
 */
function pivot() {
  return `  <section class="section-m sombre" id="pivot">
    <div class="grille">
      <p class="pivot-texte" style="--col: 1 / span 9">${C.pivot.premiere}<br>${C.pivot.seconde}</p>
    </div>
  </section>`
}

function studio() {
  const metiers = C.studio.metiers
    .map(
      (m) => `          <div class="metier">
            <span class="metier-label">${m.label}</span>
            <p class="metier-titre">${m.titre}</p>
            <p class="metier-items">${m.items}</p>
          </div>`
    )
    .join('\n          <span class="metier-joint" aria-hidden="true">&amp;</span>\n')

  const benefices = C.studio.benefices
    .map(
      (b) => `        <li class="benefice" data-reveal>
          <h3 class="benefice-titre">${b.titre}</h3>
          <p class="benefice-texte">${b.texte}</p>
        </li>`
    )
    .join('\n')

  return `  <section class="section-m" id="approach">
    <div class="grille">
      <p class="tete-bloc">${C.studio.label}</p>
      <h2 class="studio-titre" style="--col: 3 / span 8">${C.studio.titre.debut} ${C.studio.titre.accent}</h2>

      <div class="metiers" style="--col: 3 / span 6">
${metiers}
      </div>
      <p class="studio-texte" style="--col: 10 / span 3">${C.studio.texte[0]}<br><br>${C.studio.texte[1]}</p>

      <ul class="benefices" style="--col: 1 / -1">
${benefices}
      </ul>
    </div>
  </section>`
}

function transparence() {
  const textes = C.transparence.textes.map((t) => `        <p>${t}</p>`).join('\n')
  return `  <section class="section-s" id="transparence">
    <div class="grille">
      <p class="tete-bloc">${C.transparence.label}</p>
      <div class="transparence-corps" style="--col: 3 / span 7">
        <h3 class="t-h2">${C.transparence.titre}</h3>
${textes}
      </div>
    </div>
  </section>`
}

function prestations() {
  const cartes = C.prestations.cartes
    .map((p) => {
      const titre = p.href
        ? `<a class="carte-prestation-titre" href="${p.href}">${p.titre}</a>`
        : `<span class="carte-prestation-titre">${p.titre}</span>`
      return `        <article class="carte-prestation" data-reveal>
          <div class="carte-prestation-tete">
            <h3>${titre}</h3>
            <span class="carte-prestation-prix">${p.prix}</span>
          </div>
          <p class="carte-prestation-texte carte-prestation-cible"><strong>Pour qui</strong> ${p.cible}</p>
          <p class="carte-prestation-texte">${p.texte}</p>
        </article>`
    })
    .join('\n')

  return `  <section class="section-m" id="services">
    <div class="grille">
      <p class="tete-bloc">${C.prestations.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 8">${C.prestations.titre.debut} ${C.prestations.titre.accent}</h2>
      <div class="prestations-grille" style="--col: 1 / -1">
${cartes}
      </div>
    </div>
  </section>`
}

function methode() {
  const etapes = C.methode.etapes
    .map(
      (e, i) => `          <div class="etape${i === 0 ? ' est-active' : ''}" data-etape="${e.numero}">
            <span class="etape-numero">${e.numero}</span>
            <span class="etape-phase">${e.phase}</span>
            <div class="etape-corps">
              <h3 class="etape-titre">${e.titre}</h3>
              <p class="etape-texte">${e.texte}</p>
            </div>
            <p class="etape-temps">${e.temps}</p>
          </div>`
    )
    .join('\n')

  // La colonne de gauche reste en place pendant que les étapes défilent :
  // le titre de la section ne quitte pas l'écran tant qu'on la parcourt.
  return `  <section class="section-m sombre" id="process">
    <div class="grille">
      <div class="methode-colonne" style="--col: 1 / span 4">
        <p class="tete-bloc" style="--col: auto">${C.methode.label}</p>
        <h2 class="t-h2">${C.methode.titre.debut}<br>${C.methode.titre.suite} ${C.methode.titre.accent}${C.methode.titre.fin}</h2>
        <p class="methode-cloture">${C.methode.cloture}</p>
      </div>
      <div class="etapes" style="--col: 6 / span 7">
${etapes}
      </div>
    </div>
  </section>`
}

function realisations() {
  const cartes = projets
    .map(
      (p) => `          <a class="carte-projet${p.grand ? ' carte-projet--grande' : ' carte-projet--petite'}" href="/projets/${p.slug}">
            <img class="carte-projet-image" src="${p.image}" alt="${p.alt}" loading="lazy" width="1200" height="750">
            <div>
              <div class="carte-projet-tete">
                <h3 class="carte-projet-titre">${p.titre}</h3>
                <span class="carte-projet-type">${p.badge}</span>
              </div>
              <p class="carte-projet-tagline">${p.tagline}</p>
              <p class="carte-projet-nature">${p.nature}</p>
              <p class="carte-projet-note">${p.note}</p>
              <div class="carte-projet-meta">
                <span>${p.signature}</span>
                <span class="carte-projet-lien">${p.lienLibelle}${fleche}</span>
              </div>
            </div>
          </a>`
    )
    .join('\n')

  return `  <section class="section-m" id="work">
    <div class="grille">
      <p class="tete-bloc">${C.realisations.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 6">${C.realisations.titre.debut}<br>${C.realisations.titre.suite} ${C.realisations.titre.accent}</h2>
      <p class="realisations-intro" style="--col: 9 / span 4">${C.realisations.intro} <span class="realisations-intro-fort">${C.realisations.introFort}</span></p>
    </div>

    <div class="rail" id="rail">
      <div class="rail-piste" id="railPiste">
${cartes}
      </div>
      <div class="rail-progression" aria-hidden="true"><span class="rail-progression-curseur"></span></div>
    </div>
  </section>`
}

function tarifs() {
  const offres = C.tarifs.offres
    .map((o) => {
      const badge = o.badge ? `\n            <span class="statut statut--nu">${o.badge}</span>` : ''
      const items = o.inclus.map((i) => `              <li>${i}</li>`).join('\n')
      const variante = o.recommandee ? 'principal' : 'secondaire'
      return `        <article class="carte-tarif${o.recommandee ? ' carte-tarif--recommandee' : ''}" data-reveal>
          <div class="carte-tarif-tete">
            <h3 class="carte-tarif-nom">${o.nom}</h3>${badge}
          </div>
          <p class="carte-tarif-prix">${o.prix}</p>
          <p class="carte-tarif-resume">${o.resume}</p>
          <ul class="carte-tarif-liste">
${items}
          </ul>
          <p class="carte-tarif-note">${o.variation}</p>
          <a class="bouton bouton--${variante}" href="${o.cta.href}">${o.cta.libelle}${o.cta.fleche ? fleche : ''}</a>
        </article>`
    })
    .join('\n')

  const verites = C.tarifs.verites
    .map(
      (v) => `        <div class="verite">
          <h3 class="verite-titre">${v.titre}</h3>
          <p class="verite-texte">${v.texte}</p>
        </div>`
    )
    .join('\n')

  return `  <section class="section-m" id="tarifs">
    <div class="grille">
      <p class="tete-bloc">${C.tarifs.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 5">${C.tarifs.titre.debut} ${C.tarifs.titre.accent}${C.tarifs.titre.fin}<br>${C.tarifs.titre.suite}</h2>
      <p class="tarifs-note" style="--col: 9 / span 4">${C.tarifs.note[0]}<br>${C.tarifs.note[1]}</p>

      <aside class="tarifs-lancement" style="--col: 1 / -1">
        <p class="pastille">${C.tarifs.lancement.tag}</p>
        <p class="tarifs-lancement-texte">${C.tarifs.lancement.avant} <strong>${C.tarifs.lancement.remise}</strong> ${C.tarifs.lancement.apres}</p>
      </aside>

      <div class="tarifs-grille" style="--col: 1 / -1">
${offres}
      </div>

      <p class="tarifs-pied" style="--col: 1 / span 6">${C.tarifs.notePied.avant} <a class="lien" href="${C.tarifs.notePied.href}">${C.tarifs.notePied.lien}</a></p>

      <div class="verites" style="--col: 1 / -1">
${verites}
      </div>
    </div>
  </section>`
}

function estimateur() {
  const questions = C.estimateur.questions
    .map((q, qi) => {
      const options = q.options
        .map(
          (o, oi) =>
            `            <label class="estimateur-option">
              <input type="radio" name="${q.cle}" value="${o.valeur}"${oi === 0 ? ' required' : ''}>
              <span>${o.libelle}</span>
            </label>`
        )
        .join('\n')
      return `        <fieldset class="estimateur-q" data-question="${q.cle}">
          <legend class="estimateur-legende">${q.legende}</legend>
          <div class="estimateur-choix">
${options}
          </div>
        </fieldset>`
    })
    .join('\n')

  return `  <section class="section-s" id="estimator">
    <div class="grille">
      <p class="tete-bloc">${C.estimateur.eyebrow}</p>
      <div class="estimateur-tete" style="--col: 3 / span 7">
        <h2 class="t-h2">${C.estimateur.titre}</h2>
        <p class="t-corps-l">${C.estimateur.sousTitre}</p>
      </div>

      <form class="estimateur-form" id="estimatorForm" style="--col: 3 / span 9">
${questions}
      </form>

      <div class="estimateur-resultat-zone" id="estimatorResult" aria-live="polite" style="--col: 3 / span 8">
        <div class="estimateur-resultat" hidden>
          <div class="estimateur-resultat-corps">
            <span class="t-petit t-secondaire">${C.estimateur.resultatLabel}</span>
            <p class="carte-tarif-nom" id="estimatorOffer"></p>
            <p class="estimateur-prix" id="estimatorRange"></p>
            <p class="estimateur-mention" id="estimatorDelay"></p>
          </div>
          <div class="estimateur-resultat-actions">
            <a class="bouton bouton--principal" href="#contact" id="estimatorCta">${C.estimateur.resultatCta}</a>
          </div>
        </div>
        <p class="estimateur-mention estimateur-disclaimer">${C.estimateur.mention}</p>
      </div>
    </div>
  </section>`
}

function faqSection() {
  const items = C.faq.items
    .map(
      (f) => `          <button class="faq-question" type="button"><span class="faq-numero">${f.numero}</span>${f.q}<span class="faq-signe" aria-hidden="true"></span></button>
          <div class="faq-reponse"><p>${f.r}</p></div>`
    )
    .join('\n')

  return `  <section class="section-m" id="faq">
    <div class="grille">
      <p class="tete-bloc">${C.faq.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 6">${C.faq.titre.debut}<br>${C.faq.titre.suite} ${C.faq.titre.accent}</h2>
      <div class="faq-relance" style="--col: 10 / span 3">
        <p>${C.faq.relance.question}<br>${C.faq.relance.texte}</p>
        <a class="lien" href="${C.faq.relance.lien.href}">${C.faq.relance.lien.libelle}</a>
      </div>
      <div class="faq" style="--col: 3 / span 8">
${items}
      </div>
    </div>
  </section>`
}

function engagements() {
  const items = C.engagements.items
    .map(
      // Sans numéro : « Numérotation hors les 4 étapes de la méthode »
      // figure dans les interdits. Cinq engagements ne sont pas une
      // séquence, ils n'ont pas d'ordre à suivre.
      (e) => `        <li class="engagement" data-reveal>
          <h3 class="engagement-titre">${e.titre}</h3>
          <p class="engagement-texte">${e.texte}</p>
        </li>`
    )
    .join('\n')

  return `  <section class="section-m" id="garanties">
    <div class="grille">
      <p class="tete-bloc">${C.engagements.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 8">${C.engagements.titre.debut} ${C.engagements.titre.accent}</h2>
      <ul class="engagements" style="--col: 1 / -1">
${items}
      </ul>
    </div>
  </section>`
}

function contact() {
  const textes = C.contact.textes.map((t) => `        <p>${t}</p>`).join('\n')
  return `  <section class="section-m" id="contact">
    <div class="grille">
      <p class="tete-bloc">${C.contact.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 8">${C.contact.titre.debut}<br>${C.contact.titre.suite} ${C.contact.titre.accent}</h2>
      <div class="contact-lead" style="--col: 3 / span 6">
${textes}
      </div>
      <div id="contact-form-root" style="--col: 1 / -1"></div>
    </div>
  </section>`
}

/* ── Assemblage ───────────────────────────────────────────────────── */

const head = readFileSync(resolve(ici, 'contenu/head-accueil.html'), 'utf8').replace(
  '{{JSONLD_FAQ}}',
  jsonLdFaq()
)

const page = `<!doctype html>
<html lang="fr">
<head>
${head}</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>

${navigation()}

  <main id="contenu">
${[hero(), probleme(), pivot(), studio(), transparence(), prestations(), methode(), realisations(), tarifs(), estimateur(), faqSection(), engagements(), contact()].join('\n\n')}
  </main>

${piedDePage()}

${bandeauCookies()}

  <script type="module" src="/src/accueil.ts"></script>
</body>
</html>
`

writeFileSync(resolve(racine, 'index.html'), page, 'utf8')
console.log(`✅ index.html — ${page.split('\n').length} lignes`)
