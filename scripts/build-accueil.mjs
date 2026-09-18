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
      </div>

      <p class="hero-preuves">
        ${preuves}
      </p>
    </div>

  </section>`
}

/**
 * Le ruban des prestations. Section à part entière, entre le hero et le
 * bloc « Votre site ne travaille pas pour vous » — il était jusqu'ici à
 * l'intérieur du hero, ce qui le liait à une section dont il n'est pas.
 */
function ruban() {
  const piste = [...C.ruban, ...C.ruban]
    .map((r) => `<span class="ruban-item">${r}</span>`)
    .join('')

  return `  <section class="ruban" id="ruban" aria-hidden="true">
    <div class="ruban-piste">${piste}</div>
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
      <p class="tete-bloc studio-label">${C.studio.label}</p>
      <figure class="studio-portrait">
        <img src="/adrien-studio.webp" alt="Adrien, fondateur de Studio Skøne, bras croisés et souriant"
             width="624" height="1200" decoding="async" loading="lazy">
      </figure>
      <h2 class="studio-titre">${C.studio.titre.debut} ${C.studio.titre.accent}</h2>

      <div class="metiers">
${metiers}
      </div>
      <p class="studio-texte">${C.studio.texte[0]}<br><br>${C.studio.texte[1]}</p>

      <ul class="benefices">
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
  /**
   * Une vignette. `copie` marque les exemplaires que la boucle duplique :
   * ils sont retirés de l'arbre d'accessibilité et du parcours clavier,
   * sinon un lecteur d'écran annoncerait neuf projets deux fois et la
   * tabulation passerait deux fois par chacun.
   */
  const vignette = (p, copie = false) => `            <a class="carte-projet" href="/projets/${p.slug}"${
    copie ? ' aria-hidden="true" tabindex="-1"' : ''
  }>
              <img class="carte-projet-image" src="${p.image}" alt="${copie ? '' : p.alt}" loading="lazy" width="1200" height="750">
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

  // Deux rangées qui défilent en sens inverse. Cinq projets sur la
  // première, quatre sur la seconde : la série se lit comme un ensemble,
  // sans qu'aucun projet ne soit mis en avant par sa place.
  const rangees = [projets.slice(0, 5), projets.slice(5)]

  const piste = (liste, sens) => `        <div class="ruban-projets" data-sens="${sens}">
          <div class="ruban-projets-piste">
${liste.map((p) => vignette(p)).join('\n')}
${liste.map((p) => vignette(p, true)).join('\n')}
          </div>
        </div>`

  return `  <section class="section-m" id="work">
    <div class="grille">
      <p class="tete-bloc">${C.realisations.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 6">${C.realisations.titre.debut}<br>${C.realisations.titre.suite} ${C.realisations.titre.accent}</h2>
      <p class="realisations-intro" style="--col: 9 / span 4">${C.realisations.intro} <span class="realisations-intro-fort">${C.realisations.introFort}</span></p>
    </div>

    <div class="realisations-rubans">
${piste(rangees[0], 'avant')}
${piste(rangees[1], 'arriere')}
    </div>
  </section>`
}

function tarifs() {
  const cartes = C.tarifs.formules
    .map((f) => {
      const items = f.inclus.map((i) => `              <li>${i}</li>`).join('\n')
      const variante = f.recommandee ? 'principal' : 'secondaire'
      // La ligne d'écart n'existe que sur la formule recommandée : elle
      // répond à « pourquoi le double pour trois pages de plus ? ».
      const ecart = f.ecart ? `\n          <p class="carte-tarif-ecart">${f.ecart}</p>` : ''
      const variation = f.variation ? `\n          <p class="carte-tarif-note">${f.variation}</p>` : ''
      return `        <article class="carte-tarif${f.recommandee ? ' carte-tarif--recommandee' : ''}" data-reveal>
          <p class="carte-tarif-nom">${f.nom}</p>
          <p class="carte-tarif-prix">${f.prix}</p>
          <h3 class="carte-tarif-h3">${f.h3}</h3>
          <p class="carte-tarif-positionnement">${f.positionnement}</p>
          <p class="carte-tarif-resume">${f.paragraphe}</p>${ecart}
          <ul class="carte-tarif-liste">
${items}
          </ul>
          <p class="carte-tarif-delai">${f.delai}</p>${variation}
          <a class="bouton bouton--${variante}" href="${f.cta.href}" data-umami-event="${f.cta.umami}">${f.cta.libelle}${f.cta.fleche ? fleche : ''}</a>
        </article>`
    })
    .join('\n')

  const options = C.tarifs.options.items.map((o) => `          <li>${o}</li>`).join('\n')

  const toujours = C.tarifs.toujours.items
    .map(
      (i) => `          <div class="tarifs-argument">
            <h3 class="tarifs-argument-titre">${i.titre}</h3>
            <p class="tarifs-argument-texte">${i.texte}</p>
          </div>`
    )
    .join('\n')

  const charge = C.tarifs.charge.items.map((i) => `          <li>${i}</li>`).join('\n')

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
${cartes}
      </div>

      <div class="tarifs-options" style="--col: 1 / -1">
        <p class="tarifs-options-intro">${C.tarifs.options.intro}</p>
        <ul class="tarifs-options-liste">
${options}
        </ul>
      </div>

      <div class="tarifs-toujours" style="--col: 1 / -1">
        <p class="tete-bloc" style="--col: auto">${C.tarifs.toujours.titre}</p>
        <div class="tarifs-arguments">
${toujours}
        </div>
      </div>

      <div class="tarifs-charge" style="--col: 1 / -1">
        <p class="tete-bloc" style="--col: auto">${C.tarifs.charge.titre}</p>
        <ul class="tarifs-charge-liste">
${charge}
        </ul>
      </div>

      <div class="verites" style="--col: 1 / -1">
${verites}
      </div>
    </div>
  </section>`
}

/**
 * Le parcours unique — estimateur et contact fusionnés.
 *
 * Une question par écran. Les écrans sont tous dans le HTML dès le
 * départ, et c'est le script qui les montre l'un après l'autre : le
 * contenu reste lisible si le script n'arrive pas, et un moteur
 * d'indexation voit les questions.
 *
 * La progression est un filet qui se remplit, jamais un compteur.
 */
function parcours() {
  const P = C.parcours

  const ecransQuestions = P.questions
    .map((q, i) => {
      const options = q.options
        .map(
          (o) => `              <label class="parcours-option">
                <input type="radio" name="${q.cle}" value="${o.valeur}">
                <span>${o.libelle}</span>
              </label>`
        )
        .join('\n')

      return `        <fieldset class="parcours-ecran" data-ecran="${i}" data-question="${q.cle}">
          <legend class="parcours-legende">${q.legende}</legend>
          <div class="parcours-choix">
${options}
          </div>
        </fieldset>`
    })
    .join('\n')

  const champs = P.coordonnees.champs
    .map((c) =>
      c.type === 'area'
        ? `            <div class="parcours-champ parcours-champ--area">
              <label for="p-${c.cle}">${c.libelle}</label>
              <textarea id="p-${c.cle}" name="${c.cle}" rows="4"></textarea>
            </div>`
        : `            <div class="parcours-champ">
              <label for="p-${c.cle}">${c.libelle}</label>
              <input type="${c.type}" id="p-${c.cle}" name="${c.cle}"${c.requis ? ' required' : ''}>
            </div>`
    )
    .join('\n')

  const rgpd = P.coordonnees.rgpd

  return `  <section class="section-m sombre" id="estimator">
    <div class="grille">
      <p class="tete-bloc">${P.label}</p>
      <div class="parcours-tete" style="--col: 3 / span 7">
        <h2 class="t-h2">${P.titre}</h2>
        <p class="t-corps-l">${P.sousTitre}</p>
      </div>

      <div class="parcours" id="parcours" style="--col: 1 / -1">
        <div class="parcours-progression" aria-hidden="true">
          <span class="parcours-progression-remplissage"></span>
        </div>

        <form class="parcours-form" id="parcoursForm" novalidate>
${ecransQuestions}

          <fieldset class="parcours-ecran" data-ecran="${P.questions.length}" data-resultat>
            <legend class="parcours-legende">${P.resultat.label}</legend>
            <div class="parcours-resultat">
              <p class="parcours-offre" id="parcoursOffre"></p>
              <p class="parcours-prix" id="parcoursPrix"></p>
              <p class="parcours-delai" id="parcoursDelai"></p>
            </div>
            <p class="parcours-mention">${P.resultat.mention}</p>
          </fieldset>

          <fieldset class="parcours-ecran" data-ecran="${P.questions.length + 1}">
            <legend class="parcours-legende">${P.coordonnees.legende}</legend>
            <div class="parcours-champs">
${champs}
            </div>
            <label class="parcours-rgpd">
              <input type="checkbox" id="p-rgpd" required>
              <span class="parcours-rgpd-case" aria-hidden="true"></span>
              <span class="parcours-rgpd-texte">
                <span class="parcours-rgpd-marque">${rgpd.marque}</span>
                ${rgpd.texte}
                <a href="${rgpd.lien.href}" target="_blank" rel="noopener noreferrer">${rgpd.lien.libelle}</a>.
              </span>
            </label>
          </fieldset>

          <div class="parcours-actions">
            <button class="bouton bouton--secondaire" type="button" id="parcoursPrecedent">${P.actions.precedent}</button>
            <button class="bouton bouton--principal" type="button" id="parcoursSuivant">${P.actions.suivant}</button>
          </div>
        </form>

        <div class="parcours-succes" id="parcoursSucces" role="status" aria-live="polite" hidden>
          <p class="parcours-succes-titre">${P.succes.titre} <em>${P.succes.accent}</em></p>
          <p>${P.succes.texte}</p>
        </div>
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
  return `  <section class="section-m sombre" id="contact">
    <div class="grille">
      <p class="tete-bloc">${C.contact.label}</p>
      <h2 class="t-h1" style="--col: 3 / span 8">${C.contact.titre.debut}<br>${C.contact.titre.suite} ${C.contact.titre.accent}</h2>
      <div class="contact-lead" style="--col: 3 / span 6">
${textes}
      </div>
      <a class="bouton bouton--principal" style="--col: 3 / span 3; margin-top: 40px" href="#estimator">${C.parcours.actions.envoyer}${fleche}</a>
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
${[hero(), ruban(), probleme(), pivot(), studio(), transparence(), prestations(), methode(), realisations(), tarifs(), parcours(), faqSection(), engagements(), contact()].join('\n\n')}
  </main>

${piedDePage()}

${bandeauCookies()}

  <script type="module" src="/src/accueil.ts"></script>
</body>
</html>
`

writeFileSync(resolve(racine, 'index.html'), page, 'utf8')
console.log(`✅ index.html — ${page.split('\n').length} lignes`)
