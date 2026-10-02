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
import { attributsTaille } from './dimensions-image.mjs'
import { ORIGIN, lastmodFor, ecrireLastmod } from './sitemap.mjs'

const ici = dirname(fileURLToPath(import.meta.url))
const racine = resolve(ici, '..')

/**
 * Le trait courbé sous un mot de titre (2 octobre 2026). Cinq titres
 * seulement : prestations, réalisations, méthode, tarifs, contact. Le trait est
 * dessiné par src/scripts/trait.ts ; sans script, le mot reste un mot.
 */
const trait = (mot) => `<span class="trait-mot">${mot}</span>`

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
      <p class="tete-bloc hero-surtitre">${C.hero.surtitre}</p>
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
  // Les prestations sont séparées par l'espace et un point de 6 px en
  // accent — jamais un filet. Le point vit aussi à la jointure entre les
  // deux séries dupliquées : la boucle doit se lire comme la même liste
  // qui continue, pas comme deux blocs recollés.
  const serie = [...C.ruban, ...C.ruban]
  const piste = serie
    .map((r, i) => {
      const item = `<span class="ruban-item">${r}</span>`
      const point = i < serie.length - 1 ? '<span class="ruban-point" aria-hidden="true"></span>' : ''
      return item + point
    })
    .join('')

  return `  <section class="ruban" id="ruban" aria-hidden="true">
    <div class="ruban-piste">${piste}</div>
  </section>`
}

function probleme() {
  const items = C.probleme.symptomes
    // Pas de data-reveal : l'apparition de la section est orchestrée à part
    // (src/scripts/probleme.ts), cartes et points compris.
    .map((s) => `        <li class="symptome carte"><span class="carte-point" aria-hidden="true"></span><span class="symptome-texte">${s}</span></li>`)
    .join('\n')

  return `  <section class="section-m" id="probleme">
    <div class="grille">
      <p class="tete-bloc">${C.probleme.label}</p>
      <h2 class="probleme-titre" style="--col: 1 / span 8">${C.probleme.titre.debut} ${C.probleme.titre.accent}</h2>
      <ul class="probleme-liste">
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
      (b) => `        <li class="benefice carte" data-reveal>
          <span class="carte-point" aria-hidden="true"></span>
          <h3 class="benefice-titre">${b.titre}</h3>
          <p class="benefice-texte">${b.texte}</p>
        </li>`
    )
    .join('\n')

  // Ordre du DOM = ordre de lecture au téléphone : libellé et titre
  // d'abord, le portrait ensuite. Le bureau replace le portrait à gauche
  // par grid-row, sans toucher à cet ordre.
  return `  <section class="section-m" id="approach">
    <div class="grille studio-grille">
      <p class="tete-bloc studio-label">${C.studio.label}</p>
      <h2 class="studio-titre">${C.studio.titre.debut} ${C.studio.titre.accent}</h2>
      <figure class="studio-portrait">
        <img src="/adrien-studio.webp" alt="Adrien, fondateur de Studio Skøne, bras croisés et souriant"
             width="624" height="1200" decoding="async" loading="lazy">
      </figure>
      <div class="studio-texte">
        <p>${C.studio.intro}</p>
        <figure class="studio-citation">
          <blockquote><p>«&nbsp;${C.studio.citation.texte}&nbsp;»</p></blockquote>
          <figcaption>${C.studio.citation.signature}</figcaption>
        </figure>
${C.studio.texte.map((t) => `        <p>${t}</p>`).join('\n')}
      </div>
      <div class="metiers">
${metiers}
      </div>

      <ul class="benefices">
${benefices}
      </ul>
    </div>
  </section>`
}

function transparence() {
  // Le second paragraphe est la contrepartie demandée : il porte le point
  // du logo, qui le détache du constat qui précède.
  const textes = C.transparence.textes
    .map((t, i) =>
      i === 1
        ? `          <p class="transparence-echange"><span class="carte-point" aria-hidden="true"></span>${t}</p>`
        : `          <p>${t}</p>`
    )
    .join('\n')
  return `  <section class="section-m" id="transparence">
    <div class="grille">
      <div class="transparence colonnes" data-reveal>
        <p class="tete-bloc">${C.transparence.label}</p>
        <h3 class="t-h2 transparence-titre">${C.transparence.titre}</h3>
        <div class="transparence-corps">
${textes}
        </div>
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
      return `        <article class="carte-prestation carte" data-reveal>
          <span class="carte-point" aria-hidden="true"></span>
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
      <h2 class="t-h1" style="--col: 1 / span 8">${C.prestations.titre.debut} ${trait(C.prestations.titre.accent)}</h2>
      <div class="prestations-grille" style="--col: 1 / -1">
${cartes}
      </div>
    </div>
  </section>`
}

function methode() {
  const etapes = C.methode.etapes
    .map(
      (e, i) => `          <li class="etape${i === 0 ? ' est-active' : ''}" data-etape="${e.numero}">
            <span class="point" aria-hidden="true"></span>
            <p class="etape-tete"><span class="etape-numero">${e.numero}</span><span class="etape-phase">${e.phase}</span></p>
            <h3 class="etape-titre">${e.titre}</h3>
            <p class="etape-texte">${e.texte}</p>
            <p class="etape-temps">${e.temps}</p>
          </li>`
    )
    .join('\n')

  // Le tracé vertical se remplit au défilement, à toutes les largeurs
  // (src/scripts/methode.ts). Au bureau, la tête reste collée à gauche. Sans JavaScript ou en mouvement réduit,
  // components/etape.css affiche les quatre étapes pleinement lisibles,
  // tracé plein, sans épingle : voir l'en-tête de ce fichier CSS.
  return `  <section class="section-m sombre methode" id="process">
    <div class="grille">
      <div class="methode-tete">
        <p class="tete-bloc">${C.methode.label}</p>
        <h2 class="t-h2">${C.methode.titre.debut}<br>${C.methode.titre.suite} ${trait(C.methode.titre.accent)}${C.methode.titre.fin}</h2>
        <p class="methode-cloture">${C.methode.cloture}</p>
      </div>
      <div class="methode-scene">
        <div class="methode-liste">
          <div class="rail-v" aria-hidden="true"><div class="rail-v-plein"></div></div>
          <ol class="etapes">
${etapes}
          </ol>
        </div>
      </div>
    </div>
  </section>`
}

function realisations() {
  /**
   * Carrousel centré (2 octobre 2026). Une carte par projet : l'image, et
   * dessous son nom, son statut et sa note. Le projet actif est en grand
   * et en couleur, ses voisins plus petits et en niveaux de gris. Tous les
   * textes restent dans le DOM : seul l'actif se voit, les autres restent
   * lisibles par Google et par un lecteur d'écran.
   *
   * Sans script, la piste reste une rangée qu'on fait défiler à la main,
   * toutes les cartes au même format, chacune avec son texte.
   */
  const choisis = C.realisations.accueil.map((slug) => {
    const p = projets.find((x) => x.slug === slug)
    if (!p) throw new Error(`Projet inconnu sur l'accueil : ${slug}`)
    return p
  })

  const cartes = choisis
    .map(
      (p, i) => `          <li class="carrousel-carte" data-index="${i}">
            <a class="carrousel-image" href="/projets/${p.slug}">
              <img src="${p.image}" alt="${p.alt}" loading="lazy"${attributsTaille(p.image)}>
            </a>
            <div class="carrousel-info">
              <div class="carrousel-tete">
                <h3 class="carrousel-titre">${p.titre}</h3>
                <span class="carrousel-type">${p.badge}</span>
              </div>
              <p class="carrousel-tagline">${p.tagline}</p>
              <p class="carrousel-nature">${p.nature}</p>
              <p class="carrousel-note">${p.note}</p>
              <p class="carrousel-meta"><span>${p.signature}</span> <a class="lien carrousel-lien" href="/projets/${p.slug}">${p.lienLibelle}${fleche}</a></p>
            </div>
          </li>`
    )
    .join('\n')

  const points = choisis
    .map((p, i) => `<button type="button" class="carrousel-point" data-index="${i}" aria-label="Voir ${p.titre}"></button>`)
    .join('')

  return `  <section class="section-m" id="work">
    <div class="grille">
      <p class="tete-bloc">${C.realisations.label}</p>
      <h2 class="t-h1" style="--col: 1 / span 10">${C.realisations.titre.debut}<br>${C.realisations.titre.suite} ${trait(C.realisations.titre.accent)}</h2>
      <p class="realisations-intro" style="--col: 1 / span 5">${C.realisations.intro} <span class="realisations-intro-fort">${C.realisations.introFort}</span></p>
    </div>

    <div class="carrousel" id="carrousel" aria-roledescription="carrousel" aria-label="Réalisations">
      <div class="carrousel-fenetre">
        <ul class="carrousel-piste">
${cartes}
        </ul>
      </div>
      <div class="carrousel-commandes">
        <button type="button" class="carrousel-fleche" data-sens="-1" aria-label="Projet précédent"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19"/></svg></button>
        <div class="carrousel-points">${points}</div>
        <button type="button" class="carrousel-fleche" data-sens="1" aria-label="Projet suivant"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19"/></svg></button>
      </div>
    </div>
  </section>`
}

function tarifs() {
  const chevron = (sens) =>
    `<svg class="carte-tarif-chevron" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="${sens === 'haut' ? 'M2 9 L7 4 L12 9' : 'M2 5 L7 10 L12 5'}" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`

  // Deux faces dans une même carte (2 octobre 2026). Devant : de quoi
  // comparer d'un coup d'œil. Derrière, dans un tiroir qui monte du bas :
  // le détail complet. Le tiroir reste dans le DOM, hors de l'écran,
  // jamais en display: none, pour que Google et un lecteur d'écran le
  // lisent ; le script le rend inerte tant qu'il est fermé.
  const cartes = C.tarifs.formules
    .map((f, i) => {
      const cles = f.cles.map((it) => `              <li>${it}</li>`).join('\n')
      const items = f.inclus.map((it) => `              <li>${it}</li>`).join('\n')
      const variante = f.recommandee ? 'principal' : 'secondaire'
      const ecart = f.ecart ? `\n            <p class="carte-tarif-ecart">${f.ecart}</p>` : ''
      const variation = f.variation ? `\n            <p class="carte-tarif-note">${f.variation}</p>` : ''
      const idTiroir = `tarif-detail-${i}`
      return `        <article class="carte-tarif${f.recommandee ? ' carte-tarif--recommandee' : ''}" data-reveal>
          <div class="carte-tarif-recto">
            <p class="carte-tarif-nom">${f.nom}</p>
            <p class="carte-tarif-prix">${f.prix}</p>
            <h3 class="carte-tarif-h3">${f.h3}</h3>
            <p class="carte-tarif-positionnement">${f.positionnement}</p>
            <ul class="carte-tarif-cles">
${cles}
            </ul>
            <p class="carte-tarif-delai">${f.delai}</p>
            <a class="bouton bouton--${variante}" href="${f.cta.href}" data-umami-event="${f.cta.umami}">${f.cta.libelle}${f.cta.fleche ? fleche : ''}</a>
            <button type="button" class="carte-tarif-ouvrir" aria-expanded="false" aria-controls="${idTiroir}"><span>${C.tarifs.voirInclus}</span>${chevron('haut')}</button>
          </div>
          <div class="carte-tarif-tiroir" id="${idTiroir}">
            <button type="button" class="carte-tarif-fermer" aria-controls="${idTiroir}" aria-label="Fermer le détail de la formule ${f.nom}"><span>${f.nom} · ${f.prix}</span>${chevron('bas')}</button>
            <p class="carte-tarif-resume">${f.paragraphe}</p>${ecart}
            <ul class="carte-tarif-liste">
${items}
            </ul>${variation}
          </div>
        </article>`
    })
    .join('\n')

  const options = C.tarifs.options.items.map((o) => `          <li>${o}</li>`).join('\n')

  const charge = C.tarifs.charge.items
    .map(
      // Une liste de phrases courtes, plus des cartes (1er octobre 2026) :
      // STYLE_GUIDE § 5, l'espace seul les sépare.
      (i) => `          <li class="tarifs-charge-ligne">
            <p class="tarifs-charge-chiffre">${i.chiffre}</p>
            <p class="tarifs-charge-texte">${i.texte}</p>
          </li>`
    )
    .join('\n')

  return `  <section class="section-m" id="tarifs">
    <div class="grille">
      <p class="tete-bloc">${C.tarifs.label}</p>
      <h2 class="t-h1" style="--col: 1 / span 10">${C.tarifs.titre.debut} ${trait(C.tarifs.titre.accent)}${C.tarifs.titre.fin}<br>${C.tarifs.titre.suite}</h2>
      <p class="tarifs-note" style="--col: 1 / span 5">${C.tarifs.note[0]}<br>${C.tarifs.note[1]}</p>

      <aside class="tarifs-lancement" style="--col: 1 / -1">
        <p class="pastille">${C.tarifs.lancement.tag}</p>
        <p class="tarifs-lancement-texte">${C.tarifs.lancement.texte}</p>
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

      <div class="tarifs-charge" style="--col: 1 / -1">
        <p class="tete-bloc" style="--col: auto">${C.tarifs.charge.titre}</p>
        <ul class="tarifs-charge-liste">
${charge}
        </ul>
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

  // Les trois questions du prix d'un côté, le budget de l'autre : depuis
  // le 2 octobre 2026, le prix se construit en direct à chaque réponse,
  // et le budget passe à l'étape contact.
  const questionsPrix = P.questions.filter((q) => q.cle !== 'budget')
  const questionBudget = P.questions.find((q) => q.cle === 'budget')

  const groupe = (q) => {
    const options = q.options
      .map(
        (o) => `              <label class="parcours-option">
                <input type="radio" name="${q.cle}" value="${o.valeur}">
                <span>${o.libelle}</span>
              </label>`
      )
      .join('\n')
    return `          <fieldset class="parcours-question" data-question="${q.cle}">
            <legend class="parcours-legende">${q.legende}</legend>
            <div class="parcours-choix">
${options}
            </div>
          </fieldset>`
  }

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
      <div class="parcours-tete" style="--col: 1 / span 7">
        <h2 class="t-h2">${P.titre}</h2>
        <p class="t-corps-l">${P.sousTitre}</p>
      </div>

      <div class="parcours" id="parcours" style="--col: 1 / -1" data-note-budget="${P.noteBudget}">
        <form class="parcours-form" id="parcoursForm" novalidate>
          <div class="parcours-ecran parcours-direct" data-ecran="0">
            <div class="parcours-questions">
${questionsPrix.map(groupe).join('\n')}
            </div>

            <aside class="parcours-panneau" aria-live="polite">
              <p class="parcours-panneau-label">${P.resultat.label}</p>
              <p class="parcours-offre" id="parcoursOffre">${P.resultat.attente}</p>
              <p class="parcours-prix" id="parcoursPrix" hidden></p>
              <p class="parcours-delai" id="parcoursDelai" hidden></p>
              <p class="parcours-ajustement" id="parcoursAjustement" hidden></p>
              <button class="bouton bouton--principal parcours-cta" type="button" id="parcoursSuivant" disabled aria-disabled="true">${P.actions.suivant}</button>
              <p class="parcours-mention">${P.resultat.mention}</p>
            </aside>
          </div>

          <fieldset class="parcours-ecran parcours-contact" data-ecran="1" hidden>
            <legend class="parcours-legende">${P.coordonnees.legende}</legend>
            <p class="parcours-recap"><span id="parcoursRecap"></span> <button type="button" class="lien parcours-modifier" id="parcoursModifier">${P.actions.modifier}</button></p>
${groupe(questionBudget)}
            <p class="parcours-note-budget" id="parcoursNoteBudget" hidden></p>
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
            <div class="parcours-actions">
              <button class="bouton bouton--secondaire" type="button" id="parcoursPrecedent">${P.actions.precedent}</button>
              <button class="bouton bouton--principal" type="button" id="parcoursEnvoyer" disabled aria-disabled="true">${P.actions.envoyer}</button>
            </div>
          </fieldset>
        </form>

        <div class="parcours-succes" id="parcoursSucces" role="status" aria-live="polite" tabindex="-1" hidden>
          <p class="parcours-succes-titre">${P.succes.titre} <em>${P.succes.accent}</em></p>
          <p>${P.succes.texte}</p>
        </div>
      </div>
    </div>
  </section>`
}

function faqSection() {
  // Plus de numérotation : le style guide la réserve aux quatre étapes de
  // la méthode. `numero` reste dans le contenu (scripts/contenu/accueil.mjs)
  // pour ce qui en dépend encore ailleurs, mais n'est plus rendu ici.
  const items = C.faq.items
    .map(
      (f) => `        <div class="faq-item">
          <button class="faq-question" type="button">${f.q}<span class="faq-signe" aria-hidden="true"></span></button>
          <div class="faq-reponse"><p>${f.r}</p></div>
        </div>`
    )
    .join('\n')

  // Deux colonnes depuis le 2 octobre 2026 : le titre et la relance à
  // gauche, collés pendant qu'on parcourt les questions à droite.
  return `  <section class="section-m" id="faq">
    <div class="grille">
      <div class="faq-tete">
        <p class="tete-bloc">${C.faq.label}</p>
        <h2 class="t-h1">${C.faq.titre.debut}<br>${C.faq.titre.suite} ${C.faq.titre.accent}</h2>
        <div class="faq-relance">
          <p>${C.faq.relance.question}<br>${C.faq.relance.texte}</p>
          <a class="lien" href="${C.faq.relance.lien.href}">${C.faq.relance.lien.libelle}</a>
        </div>
      </div>
      <div class="faq">
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
      (e) => `        <li class="engagement carte" data-reveal>
          <span class="carte-point" aria-hidden="true"></span>
          <h3 class="engagement-titre">${e.titre}</h3>
          <p class="engagement-texte">${e.texte}</p>
        </li>`
    )
    .join('\n')

  return `  <section class="section-m" id="garanties">
    <div class="grille">
      <p class="tete-bloc">${C.engagements.label}</p>
      <h2 class="t-h1" style="--col: 1 / span 8">${C.engagements.titre.debut} ${C.engagements.titre.accent}</h2>
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
      <h2 class="t-h1" style="--col: 1 / span 8">${C.contact.titre.debut}<br>${C.contact.titre.suite} ${trait(C.contact.titre.accent)}</h2>
      <div class="contact-lead" style="--col: 1 / span 6">
${textes}
      </div>
      <a class="bouton bouton--principal" style="--col: 1 / span 3; margin-top: 40px" href="#estimator">${C.parcours.actions.envoyer}${fleche}</a>
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
${head}  <script>
    /* L'ouverture au s : décidée avant le premier rendu, pour que la page
       ne s'affiche pas une fraction de seconde avant le voile. Une fois par
       visite, jamais en mouvement réduit. Filet : la page revient au bout
       de 4 s, quoi qu'il arrive au script principal. */
    try {
      if (sessionStorage.getItem('skone-ouverture-vue') !== '1' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.classList.add('a-ouverture')
        setTimeout(function () { document.documentElement.classList.remove('a-ouverture') }, 4000)
      }
    } catch (e) {}
  </script>
</head>
<body>
  <a class="skip-link" href="#contenu">Aller au contenu</a>

${navigation()}

  <main id="contenu">
${[
  // Ordre du 2 octobre 2026 : qui, quoi, la preuve, le comment, le prix
  // et ses garanties, l'estimation, les questions, le contact. « Le
  // studio est jeune » a rejoint l'encart de lancement des tarifs.
  hero(), ruban(), probleme(), pivot(), studio(), prestations(), realisations(),
  methode(), tarifs(), engagements(), parcours(), faqSection(), contact(),
].join('\n\n')}
  </main>

${piedDePage()}

${bandeauCookies()}

  <script type="module" src="/src/accueil.ts"></script>
</body>
</html>
`

const cheminIndex = resolve(racine, 'index.html')
let avant = null
try { avant = readFileSync(cheminIndex, 'utf8') } catch { /* première génération */ }

writeFileSync(cheminIndex, page, 'utf8')
console.log(`✅ index.html — ${page.split('\n').length} lignes`)

// Sitemap : ne redate l'accueil que si son rendu a vraiment changé.
const sitemapPath = resolve(racine, 'public/sitemap.xml')
const today = new Date().toISOString().slice(0, 10)
const lastmod = lastmodFor(sitemapPath, `${ORIGIN}/`, avant, page, today)
ecrireLastmod(sitemapPath, `${ORIGIN}/`, lastmod)
