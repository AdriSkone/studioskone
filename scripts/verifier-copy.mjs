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
]

/**
 * Textes qui étaient déjà là, mais que le script injectait.
 *
 * Le formulaire de contact se construisait entièrement en JavaScript :
 * ses questions, ses champs et ses messages n'apparaissaient nulle part
 * dans le HTML servi. Ce script compare deux sources HTML — il ne pouvait
 * donc pas les voir, et les signale comme des ajouts alors qu'ils
 * existaient mot pour mot dans src/components/contact-form.ts.
 *
 * Les écrire dans le HTML est un gain, pas une dérive : le contenu
 * devient lisible sans JavaScript, et indexable.
 *
 * Chaque entrée est vérifiable : `grep` la chaîne dans contact-form.ts
 * sur la branche main.
 */
const TEXTES_SORTIS_DU_SCRIPT = [
  'Quel est votre budget estimatif',
  '1 000 – 3 000 €',
  '3 000 – 5 000 €',
  '5 000 – 10 000 €',
  '10 000 € +',
  'À définir',
  'Parlez-moi de vous',
  'Nom',
  'Email',
  'Description du projet',
  'RGPD',
  'En soumettant ce formulaire',
  'politique de confidentialité',
  'Retour',
  'Continuer',
  "Merci,",
  "c'est envoyé.",
  'Je reviens vers vous sous 24h.',
]

/**
 * Textes disparus avec le composant qui les portait.
 *
 * « Discuter de ce projet » était le bouton qui menait de l'estimateur au
 * formulaire. Les deux étant fusionnés, il n'y a plus de trajet à faire
 * faire : le parcours va d'un écran au suivant, et son bouton final porte
 * « Discuter de mon projet », qui existait déjà.
 */
const TEXTES_DE_COMPOSANTS_RETIRES = ['Discuter de ce projet']

/**
 * Textes remplacés à la demande d'Adri : l'ancien texte, et celui qui le
 * remplace.
 *
 * « Partout en France » fermait le bandeau du hero, et « À Nantes et
 * partout en France » vivait seul sous les boutons : la même idée, dite
 * deux fois à quelques centimètres. Le 16 septembre 2026, Adri a demandé
 * que la phrase complète prenne la place de la courte dans le bandeau.
 *
 * Le contrôle reste strict : l'ancien fragment, une fois le remplacement
 * appliqué, doit se retrouver TEL QUEL dans la nouvelle page. Retirer
 * seulement l'ancien texte aurait laissé le reste du fragment à la
 * comparaison mot à mot, qui retrouve « Vous », « êtes » ou « site »
 * n'importe où — et une vraie perte serait passée.
 *
 * Le statement du hero annonçait « Livré en 2 à 6 semaines » : le chantier
 * tarifs du 18 septembre 2026 aligne ce délai sur celui des cards
 * Prestations et de la FAQ, « 5 jours à 3 semaines ».
 */
const REMPLACEMENTS_DEMANDES = [
  { avant: 'Partout en France', apres: 'À Nantes et partout en France' },
  { avant: 'Livré en 2 à 6 semaines', apres: 'Livré en 5 jours à 3 semaines' },
]

/**
 * Chantier tarifs du 18 septembre 2026.
 *
 * C'est le seul chantier du site où le copy change volontairement : les
 * trois offres (Fondation, Studio, Sur mesure) deviennent trois formules à
 * prix fermes, décidées avec Adri et consignées dans
 * docs/superpowers/specs/2026-09-18-tarifs-design.md.
 *
 * Les deux listes ci-dessous ne désactivent rien : tout fragment qui n'y
 * figure pas continue d'échouer, y compris dans les sections voisines.
 */
const TARIFS_RETIRES = [
  'Fondation, pour démarrer',
  'Studio, pour performer',
  'Sur mesure, pour aller plus loin',
  'Le plus choisi',
  'Dès 900€',
  'Dès 2 500€',
  "sur l'offre Fondation et l'offre Studio",
  'De quoi lancer vite un site soigné, sans exploser le budget.',
  'Mon offre la plus demandée',
  "Landing page ou site vitrine d'une page",
  'Responsive mobile-first',
  '2 allers-retours inclus',
  'Livraison en 1–2 semaines',
  'Site vitrine multi-pages ou application web',
  'E-commerce à partir de 3 000€',
  'Architecture UX & design sur mesure',
  'SEO technique intégré',
  'Ajustements continus',
  'Livraison en 4–6 semaines',
  'Application mobile, SaaS ou plateforme complexe',
  'Périmètre défini ensemble',
  'Accompagnement dédié',
  'Suivi régulier',
  'Délais et livrables adaptés',
  'Besoin de design seul, sans développement ?',
  'À partir de 600€',
  "Ce qui n'est pas compris",
  'En trois fois, sans frais : 30 % à la commande, 30 % à la validation des maquettes, 40 % à la mise en ligne.',
  'Choisir cette offre',
  // Phrases complètes des anciennes offres, non couvertes par les fragments
  // courts ci-dessus : le comparateur les signale sinon comme perdues.
  'Ce qui fait bouger le prix : le nombre de pages, et si les textes et photos sont à créer.',
  'Pour les projets plus gros, qui demandent un vrai cadrage produit et un suivi rapproché.',
  'Ce qui fait bouger le prix : le périmètre de la version 1, les comptes utilisateurs et les paiements.',
  "Le nom de domaine (environ 12",
  // Prix des cards Prestations et réponses de FAQ, remplacés le 18
  // septembre 2026 par la nouvelle grille à trois formules.
  'Dès 3 000€',
  'Dès 1 200€',
  'Dès 600€',
  'Un site vitrine démarre à 900 €, un site multi-pages ou une application web à 2 500 €, une boutique en ligne à 3 000 €.',
  'Une à deux semaines pour une landing page, quatre à six semaines pour un site complet ou une application web.',
  "Deux séries de retours sur l'offre Fondation, des ajustements continus sur l'offre Studio.",
  // Ce fragment d'une ancienne card tarif ne se recomposait, avant ce
  // chantier, qu'en empruntant une phrase de la FAQ 01 ci-dessus : les
  // deux ont changé le même jour, il faut donc le déclarer explicitement.
  "Ce qui fait bouger le prix : le nombre de pages, la présence d'une réservation ou d'un paiement, et si les contenus sont à créer.",
]

const TARIFS_AJOUTES = [
  'Une page', 'Site complet', 'Sur mesure',
  'Site internet une page', 'Site vitrine complet, 4 à 6 pages', 'E-commerce et applications sur mesure',
  '900 €', '1 900 €', 'À partir de 3 000 €',
  'Pour exister en ligne sans attendre.',
  'Recommandé si vous avez plusieurs services à présenter.',
  'Quand un site vitrine ne suffit plus.',
  'Choisir cette formule', 'Demander un devis',
  'Livré en 5 jours ouvrés', 'Livré en 3 semaines', 'Délais définis au cadrage.',
  'Dans toutes les formules', 'Ce qui reste à votre charge', 'En option, sur toutes les formules :',
  // Fragments complets des nouvelles formules, non couverts par les
  // fragments courts ci-dessus : le comparateur les signale sinon comme
  // ajoutés.
  'Une seule page, mais complète : qui vous êtes',
  'Design sur mesure, à votre image',
  'Formulaire de contact ou de demande de devis',
  'Pensé pour le mobile en premier',
  'Fiche Google et référencement local configurés',
  'Deux séries de retouches incluses',
  'Mise en ligne incluse',
  'Ce qui fait bouger le prix : la rédaction des textes et la création des photos',
  'Quatre à six pages pour détailler votre offre',
  '4 à 6 pages : accueil, services, réalisations, à propos, contact',
  'Référencement technique intégré',
  'Trois séries de retouches incluses',
  'Ce qui fait bouger le prix : le nombre de pages au-delà de six',
  'Boutique en ligne, application web ou mobile, outil métier',
  'Périmètre et budget définis ensemble',
  'Suivi rapproché tout au long du projet',
  'Rédaction des textes : 200 € par page',
  'Séance photo : sur devis, avec un photographe partenaire',
  // Réponse de FAQ 02, remplacée le 18 septembre 2026.
  'Cinq jours ouvrés pour une page, trois semaines pour un site complet',
  'Le site vous appartient.',
  'Le code est à vous, pas loué.',
  "Je conçois, je développe, je mets en ligne.",
  'Paiement en deux fois.',
  'La moitié à la commande, la moitié à la mise en ligne. En trois fois pour les projets sur mesure.',
  'Aucun abonnement obligatoire.',
  'Pas de mensualité pour garder votre site en ligne.',
  "L'hébergement, de 0 à 15",
  'Les contenus, si vous préférez les rédiger vous-même.',
  'La maintenance après livraison, si vous en voulez une.',
  'En deux fois : la moitié à la commande, la moitié à la mise en ligne. En trois fois sur les projets sur mesure',
  'Une agence facture généralement le même site entre 3 500 et 8 000',
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

/**
 * Le texte des partiels communs — barre de navigation, pied de page,
 * bandeau cookies — et des vignettes de projet.
 *
 * Les pages projet n'avaient ni pied de page ni navigation complète :
 * elles les reçoivent, et tout ce texte apparaît donc comme ajouté. Il
 * n'est pourtant écrit nulle part de neuf — il vient de l'accueil, où
 * cette même vérification l'a déjà comparé mot pour mot à l'ancienne
 * version.
 *
 * On lit donc l'accueil : un fragment qui s'y trouve déjà n'est pas un
 * ajout de copy, c'est un partiel qui arrive sur une page qui en manquait.
 */
let texteAccueil = ''
try {
  texteAccueil = fragments(readFileSync('index.html', 'utf8')).join(' ')
} catch {
  /* l'accueil n'est pas toujours là — la comparaison se fait sans */
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
      if (pris < 2) {
        /**
         * Dernier recours : une liste réordonnée.
         *
         * Le pied de page classe ses liens autrement et retire celui de la
         * page courante. Les libellés sont tous là, mais plus dans le même
         * ordre et jamais deux à la suite — la couverture de gauche à
         * droite ne peut alors rien recouvrir.
         *
         * On vérifie donc que chaque mot du fragment se trouve quelque part
         * dans la cible. Réservé aux fragments courts : sur une phrase
         * entière, retrouver les mots un par un ne prouverait rien.
         */
        if (mots.length <= 16) return mots.every((m) => cible.includes(m))
        return false
      }
      i += pris
    }
    return true
  }

  const absentsAvant = fragmentsAvant.filter((f) => !toutApres.includes(f))
  const absentsApres = fragmentsApres.filter((f) => !toutAvant.includes(f))

  const sansAutorises = (f) =>
    AJOUTS_AUTORISES.reduce((acc, a) => acc.split(a).join(' '), f).replace(/\s+/g, ' ').trim()

  const remplace = (f) =>
    REMPLACEMENTS_DEMANDES.reduce((acc, r) => acc.split(r.avant).join(r.apres), f)

  const perdus = absentsAvant
    .filter((f) => !estUnRegroupement(f, toutApres))
    .filter((f) => remplace(f) === f || !toutApres.includes(remplace(f)))
    .filter((f) => !TEXTES_DE_COMPOSANTS_RETIRES.some((t) => f.includes(t)))
    .filter((f) => !TARIFS_RETIRES.some((t) => f.includes(t)))
  const ajoutes = absentsApres
    .filter((f) => !estUnRegroupement(f, toutAvant))
    .filter((f) => {
      const nettoye = sansAutorises(f)
      if (nettoye.length <= 2) return false
      if (TEXTES_SORTIS_DU_SCRIPT.some((t) => nettoye.includes(t))) return false
      if (TARIFS_AJOUTES.some((t) => nettoye.includes(t))) return false
      // Déjà présent sur l'accueil : c'est un partiel, pas un ajout.
      if (fichier !== 'index.html' && estUnRegroupement(nettoye, texteAccueil)) return false
      return !estUnRegroupement(nettoye, toutAvant)
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
