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
import { pathToFileURL } from 'node:url'

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
  // Tâche 9 — pages légales, 18 septembre 2026. Aucun changement de texte
  // ici : le générateur (scripts/build-legal-pages.mjs) passe ce bloc par
  // `esc()`, qui transforme l'apostrophe de « Lieu d'exercice » en
  // `&#39;`. Comme n'importe quelle entité, ce comparateur la réduit
  // ensuite à un espace (voir le commentaire au-dessus de TARIFS_RETIRES),
  // ce qui casse la correspondance mot à mot avec la version sur `main`,
  // qui porte l'apostrophe telle quelle. La déclaration ci-dessous
  // rétablit la correspondance sans toucher au HTML produit ni au
  // normaliseur.
  { avant: "Lieu d'exercice", apres: 'Lieu d exercice' },
  // Revue finale, point 8 — 18 septembre 2026. Les CGV et les mentions
  // légales ont changé de fond ce jour-là (formules de paiement, adresse
  // de domiciliation vs lieu d'exercice) sans que leur date affichée ne
  // suive : elle portait encore le 6 mai 2026.
  { avant: 'Dernière mise à jour : 6 mai 2026', apres: 'Dernière mise à jour : 18 septembre 2026' },
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
  /**
   * CGV — les phrases que la mise en cohérence du 19 septembre 2026 retire,
   * et pourquoi. Elles disaient l'inverse de ce que le site promet.
   * Déclarées avec leur fichier, pour ne rien pardonner ailleurs.
   */
  { fichier: 'public/cgv.html', texte: 'Le solde est payable dans un délai de 30 jours' },
  { fichier: 'public/cgv.html', texte: 'donnés à titre indicatif' },
  { fichier: 'public/cgv.html', texte: 'encaissement de l' },
  { fichier: 'public/cgv.html', texte: 'Aucune pénalité de retard ne pourra être appliquée au Prestataire à ce titre.' },
  { fichier: 'public/cgv.html', texte: 'Sauf disposition contraire prévue au devis, la prestation initiale n' },
  { fichier: 'public/cgv.html', texte: 'Pendant 30 jours à compter de la livraison' },

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

  // Task 6 — les cinq pages prestations, 18 septembre 2026. Anciens
  // paliers et délais retirés au profit de la grille commune (900 € /
  // 1 900 € / à partir de 3 000 €). Les mots avec apostrophe sont notés
  // avec un espace : `esc()` transforme l'apostrophe en `&#39;`, que le
  // comparateur réduit ensuite à un espace, comme n'importe quelle entité.
  'Dès 1 200 €', '1 200 €', 'Rafraîchissement',
  'Nouveau design sur la structure existante, corrections mobile et vitesse. Quand le socle est sain.',
  '2 500 €',
  'Nouvelle structure, nouveau design, contenu repris, migration et redirections. Le cas le plus fréquent.',
  'Deux à trois semaines pour un rafraîchissement, quatre à six pour une refonte complète.',
  'Pensé pour votre métier, pas pour un concours de design.',
  'Site artisan essentiel',
  'formulaire de devis. Livré en deux semaines, fiche Google Business comprise.',
  '1 800 €',
  'Environ deux heures au total, réparties sur les trois semaines du projet.',
  'Je conçois et je développe votre site du premier croquis à la mise en ligne. Une seule personne au dessin et au code, un seul interlocuteur, un seul responsable du résultat.',
  'Site vitrine d une page',
  'Design sur mesure, mobile, mise en ligne. Livré en 1 à 2 semaines.',
  'Site multi-pages',
  'Architecture complète, référencement technique, animations. Livré en 4 à 6 semaines.',
  'Avec réservation ou espace client',
  'quatre à six semaines pour un site complet. Le délai est écrit sur le devis',
  'Une boutique en ligne qui vend, pas un catalogue en ligne.',
  'design sur mesure, paiement, livraison, formation. Livrée en 4 à 6 semaines.',
  'Quatre à six semaines pour une boutique essentielle',
  'sur devis, court',
  'Comptez huit à seize semaines pour une première version, publication comprise.',

  // Tâche 11 — resserrement du vérificateur, 18 septembre 2026. Ce prix de
  // la carte « Avec réservation ou espace client », sur
  // creation-site-internet-nantes.html, est celui que le trou visait
  // exactement : disparu de la carte (remplacé par « à partir de 3 000 € »,
  // déjà déclaré dans TARIFS_AJOUTES), il passait la porte des fragments de
  // deux mots parce que « sur » et « devis » vivent chacun ailleurs sur la
  // page (« Le délai est écrit sur le devis », « Devis gratuit »…), jamais
  // côte à côte. La règle resserrée le signale à raison — c'est un
  // changement de prix voulu par ce chantier, pas une perte : il se déclare
  // ici comme les autres prix retirés.
  //
  // Revue finale, point 2 — cette déclaration n'avait aucune portée de
  // fichier : une chaîne aussi courte que « sur devis » pardonnait toute
  // perte qui la contient, sur n'importe laquelle des pages vérifiées, alors
  // qu'elle ne visait que ce seul palier de creation-site-internet-nantes.html
  // (les autres pages qui affichent encore « sur devis », artisan,
  // e-commerce, mobile, refonte, n'ont rien perdu : leur carte l'affiche
  // toujours). Elle porte donc désormais le nom du fichier qu'elle vise :
  // `f.includes(t)` ne s'applique plus que quand `fichier` correspond (voir
  // le filtre `perdus` plus bas), ce qui referme le trou sans revenir à
  // « sur devis » retrouvé n'importe où ailleurs.
  { fichier: 'creation-site-internet-nantes.html', texte: 'sur devis' },

  // Correction 1 — mode de paiement, 18 septembre 2026. Le studio annonçait
  // encore « en trois fois » sur trois pages prestations, alors que
  // l'accueil (tâches précédentes) est déjà passé à « en deux fois » sauf
  // sur les projets sur mesure.
  "et le paiement en trois fois.",
  'En trois fois sans frais.',
  'Paiement en trois fois sans frais, réparti entre la commande, la validation des maquettes et la mise en ligne.',

  // Correction 2/5 — déclarations manquantes relevées en revue. La chaîne
  // courte 'En trois fois sans frais.' ci-dessus couvrait par accident la
  // phrase suivante via .includes() : elle est retirée pour elle-même, et
  // pour sa vraie raison — elle devient fausse dès lors que la moitié du
  // prix est due à la commande, et non plus rien avant la validation des
  // maquettes.
  "Rien n est dû avant que vous ayez validé les maquettes de votre site.",
  // Idem pour l'ancien titre, qui ne passait jusqu'ici que par
  // l'heuristique de regroupement mot à mot (Artisan, deux paliers → trois).
  'Deux formats, deux prix.',
  // Correction 2/5 — même clause, ancienne ponctuation (phrase à part
  // entière) : la reformulation la rattache désormais par une virgule.
  'Plusieurs pages, une par prestation et par zone principale, galerie de chantiers, avis clients. Meilleure base pour le référencement local.',

  // Tâche 10 — CGV, article 5.2, 18 septembre 2026. Le contrat disait
  // « acompte de 30 %, solde à la livraison », alors que le site annonce
  // depuis les tâches précédentes un paiement en deux fois (50/50) sur les
  // formules Une page et Site complet, et en trois fois (30/40/30) sur le
  // sur mesure. L'article est réécrit pour suivre les formules réellement
  // vendues. Les apostrophes ci-dessous sont notées avec un espace, comme
  // pour la tâche 6 : `esc()` transforme l'apostrophe en `&#39;`, que ce
  // comparateur réduit à un espace, comme n'importe quelle entité.
  'Sauf disposition contraire prévue au devis, les modalités de paiement sont les suivantes :',
  'Acompte de 30 % à la commande, à la signature du devis. Le démarrage des travaux est conditionné à l encaissement de cet acompte.',
  'Solde à la livraison finale, dans un délai de 30 jours à compter de la date d émission de la facture.',
  'Pour les projets d envergure, le devis peut prévoir un échéancier intermédiaire (par exemple : 30 % à la commande, 40 % à mi-parcours, 30 % à la livraison).',

  // Revue finale, point 10 — essai de resserrement du repli long (jusqu'à
  // seize mots), 18 septembre 2026. Le resserrement a exposé trois anciens
  // paliers de prix, sur les pages e-commerce et application mobile, que
  // la version permissive du repli laissait passer comme de simples
  // regroupements alors qu'ils ont bel et bien disparu au profit de la
  // grille commune (remplacés par « sur devis » sur ces deux cartes, déjà
  // couvert par ailleurs).
  'dès 3 000 €', 'dès 5 000 €', 'à partir de 6 000 €',

  // Revue finale, point 1 — FAQ 03, 18 septembre 2026. La réponse disait la
  // rédaction comprise par défaut (« c'est prévu : je rédige les textes et
  // j'organise les visuels ») alors qu'elle est une option facturée, comme
  // le dit déjà la carte Une page et la liste d'options.
  "Une heure d'échange au démarrage, et 30 minutes de retours sur les maquettes. Le reste, je m'en occupe. Si vous avez des textes et des photos, tant mieux. Si vous n'en avez pas, c'est prévu : je rédige les textes et j'organise les visuels.",

  // Revue finale, point 4 — écran de résultat du parcours, 18 septembre
  // 2026. « Estimation indicative » contredisait les prix fermes annoncés
  // par les boutons qui mènent à cet écran.
  'Estimation indicative et hors taxes, établie à partir de vos réponses. Le devis est posé après un premier échange.',

  // Revue finale, point 3 — domaine à 15 € par an, 18 septembre 2026. Les
  // pages prestations donnaient encore 12 € ou « une quinzaine d'euros »,
  // quand l'accueil annonce 15 € depuis les tâches précédentes.
  'Comptez une quinzaine d euros par an pour le domaine.',
  'Le nom de domaine, autour de 12 € par an, et l hébergement, de 0 à 15 € par mois. Vous les payez en direct, à votre nom, sans marge de ma part.',
]

/**
 * Une entrée de TARIFS_RETIRES est soit une chaîne (s'applique à tout
 * fichier, comme la quasi-totalité des entrées ci-dessus), soit un objet
 * `{ fichier, texte }` qui restreint la déclaration au seul fichier nommé —
 * pour les fragments trop courts ou trop génériques pour rester sûrs sans
 * cette portée (voir « sur devis » ci-dessus).
 */
function correspondTarifRetire(entree, fragment, fichier) {
  if (typeof entree === 'string') return fragment.includes(entree)
  return entree.fichier === fichier && fragment.includes(entree.texte)
}

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

  // Task 6 — les cinq pages prestations, 18 septembre 2026. Nouveaux
  // paliers et délais, un par page, avec le vocabulaire de son métier.
  "Refonte complète, 4 à 6 pages",
  'trois semaines pour une refonte complète, une fois vos textes et vos photos réunis.',
  'Nouveau design sur une page complète, reprise du contenu existant, corrections mobile et vitesse.',
  'Nouvelle structure sur l ensemble du site, nouveau design, contenu repris, migration et redirections.',
  'Plusieurs pages, une par prestation et par zone principale, galerie de chantiers, avis clients. Meilleure base pour le référencement local.',
  'Trois formats, trois prix.',
  'Avec réservation ou espace client',
  'Prise de rendez-vous en ligne, espace client pour suivre un chantier, ou connexion à votre outil de facturation.',
  'réparties sur les cinq jours ouvrés ou les trois semaines du projet selon la formule choisie.',
  'trois semaines pour un site complet, à partir du moment où',
  'une fois votre catalogue, vos visuels et vos informations produits réunis.',
  'Les délais sont définis au cadrage, une fois le périmètre de la version 1 fixé.',

  // Correction 1 — mode de paiement, 18 septembre 2026.
  "et le paiement en deux fois.",

  // Correction 2/5 — condition de délai alignée sur la formulation
  // canonique (« à partir du moment où j'ai vos textes et vos photos »)
  // sur Refonte et Artisan. Pour ne pas dupliquer mot pour mot la phrase
  // isolée de Nantes (garde-fou anti-cannibalisation), la clause est
  // rattachée par une virgule à la phrase qui précède plutôt que d'ouvrir
  // sa propre phrase : le texte lu reste identique, seule la ponctuation
  // change.
  'Nouveau design sur une page complète, reprise du contenu existant, corrections mobile et vitesse, livré en 5 jours ouvrés',
  'Nouvelle structure sur l ensemble du site, nouveau design, contenu repris, migration et redirections, livré en 3 semaines',
  'trois semaines pour une refonte complète, à partir du moment où',
  'galerie de chantiers, avis clients, meilleure base pour le référencement local',

  // Tâche 10 — CGV, article 5.2, 18 septembre 2026 (voir la déclaration
  // miroir dans TARIFS_RETIRES ci-dessus).
  'Pour les projets sur mesure : 30 % à la commande, 40 % à la validation des maquettes, 30 % à la mise en ligne.',
  'Le solde est payable dans un délai de 30 jours à compter de la date d émission de la facture.',

  // Revue finale, point 10 — essai de resserrement du repli long, 18
  // septembre 2026. Le resserrement a exposé six fragments réellement
  // nouveaux de ce chantier, jusque-là couverts par accident par la
  // version permissive du repli (chaque mot pris isolément existait déjà
  // ailleurs sur la page, sans jamais être voisin) plutôt que déclarés.
  'Application web ou mobile sur devis',
  'Cadrage du produit avant le premier écran',
  'Design seul, sans développement : à partir de 600 €',
  "Le nom de domaine, environ 15 € par an, à votre nom.",
  'Site artisan, une page',
  "Site d une page",
  'Avec réservation ou paiement',

  // Revue finale, point 1 — FAQ 03, 18 septembre 2026 (voir la déclaration
  // miroir dans TARIFS_RETIRES ci-dessus).
  "Si vous n'en avez pas, je peux les rédiger, en option, à 200 € la page.",

  // Revue finale, point 4 — écran de résultat du parcours, 18 septembre
  // 2026 (voir la déclaration miroir dans TARIFS_RETIRES ci-dessus).
  'Prix ferme sur les formules Une page et Site complet, estimation à cadrer ensemble sur le sur mesure, le tout hors taxes.',

  // Revue finale, point 3 — domaine à 15 € par an, 18 septembre 2026 (voir
  // la déclaration miroir dans TARIFS_RETIRES ci-dessus).
  'Comptez 15 € par an pour le domaine.',

  // Revue finale, point 8 — date des documents légaux, 18 septembre 2026.
  // Le remplacement demandé (REMPLACEMENTS_DEMANDES) protège l'ancienne
  // date contre une fausse alerte de perte ; il ne dispense pas de déclarer
  // la nouvelle, qui est un texte que la page n'avait jamais porté.
  'Dernière mise à jour : 18 septembre 2026',

  /**
   * CGV, articles 5.2, 6.1, 6.2, 8.3 et 9.1 — mise en cohérence du contrat
   * avec ce que le site promet, décidée par Adri le 19 septembre 2026.
   *
   * Le site vend des délais fermes et « un mois de suivi inclus » ; le
   * contrat disait des délais « indicatifs » et n'engageait aucune
   * assistance après livraison. C'est le contrat qui fait foi en cas de
   * litige, mais c'est la promesse qui a convaincu le client : l'écart se
   * retournait contre le studio.
   *
   * À RELIRE PAR ADRI, et idéalement par un juriste : document contractuel.
   */
  'Ils constituent un',
  'engagement ferme',
  'du Prestataire, dans les conditions définies ci-après.',
  'encaissement du premier versement prévu',
  'ensemble des éléments nécessaires à la réalisation',
  'Ils sont',
  'suspendus',
  "pendant toute période d'attente d'un élément ou d'une validation demandés au Client",
  'Si le Prestataire dépasse le délai de son fait, le dépassement',
  'Passé une mise en demeure écrite restée sans effet pendant',
  "le Client peut résoudre le contrat dans les conditions de l'article 11",
  'durée au moins équivalente à celle du retard constaté',
  'La prestation initiale comprend un',
  'mois de suivi',
  'Le mois de suivi inclus',
  'le Prestataire corrige gratuitement ce qui ne fonctionne pas comme prévu',
  "il n'ouvre droit ni à de nouvelles pages, ni à de nouvelles fonctionnalités",
  "Il couvre la même période que la garantie de conformité prévue à l'article 9.1",
  "période identique à celle du mois de suivi prévu à l'article 8.3",
  'Le dernier versement est exigible à la mise en ligne',
  'La facture correspondante est émise à cette date et payable sous',
  'cession des droits sur les livrables ne devient effective',
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

  // Un fragment de deux ou trois mots est trop court pour la couverture
  // par fenêtres ci-dessous (elle exige au moins deux mots consécutifs
  // retrouvés, ce qui, sur deux mots au total, revient à exiger le
  // fragment entier — donc à ne jamais tolérer de regroupement).
  //
  // La version précédente contournait ça en acceptant chaque mot du
  // fragment trouvé N'IMPORTE OÙ dans la cible, indépendamment des autres.
  // C'était le trou : « Sur devis », le prix d'une carte de prestation, a
  // pu disparaître entièrement sans que rien ne s'allume, parce que « Sur »
  // vit dans « Sur mesure » et « devis » dans « Demander un devis » — deux
  // mots réels, mais qui n'ont jamais été voisins.
  //
  // On exige donc qu'au moins deux mots CONSÉCUTIFS du fragment (une
  // fenêtre de deux) se retrouvent côte à côte dans la cible. Sur un
  // fragment de deux mots, cela revient à chercher le fragment entier :
  // c'est voulu, un prix ou un libellé de deux mots n'a pas de fenêtre
  // plus petite où se cacher. Sur un fragment de trois mots — le cas
  // « 01 Découverte », où le numéro d'étape et son intitulé restent
  // voisins dans le HTML (des <span> en ligne, jamais séparés par un bloc)
  // — la première ou la deuxième paire suffit, ce qui couvre aussi bien le
  // fragment intact que les cas où seul le premier ou le dernier mot a été
  // déplacé.
  if (mots.length <= 3) {
    for (let i = 0; i < mots.length - 1; i++) {
      if (cible.includes(mots.slice(i, i + 2).join(' '))) return true
    }
    return false
  }

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
       * Resserré comme la porte des fragments courts (tâche 11) : un mot
       * isolé retrouvé n'importe où ne prouve rien, deux mots consécutifs
       * retrouvés côte à côte, si. On exige donc que CHAQUE paire de mots
       * voisins du fragment (et pas seulement chaque mot pris seul) se
       * retrouve, quelque part, encore voisine dans la cible. Un libellé
       * réordonné garde ses mots voisins tels quels ; un mot qui a
       * vraiment disparu casse au moins une des paires qui le touchent.
       * Réservé aux fragments courts : sur une phrase entière, retrouver
       * des paires de mots ne prouverait rien.
       */
      if (mots.length <= 16) {
        for (let k = 0; k < mots.length - 1; k++) {
          if (!cible.includes(mots.slice(k, k + 2).join(' '))) return false
        }
        return true
      }
      return false
    }
    i += pris
  }
  return true
}

// Le script s'exécute soit en CLI (`node scripts/verifier-copy.mjs …`), soit
// importé par scripts/verifier-copy.test.mjs pour tester `estUnRegroupement`
// et `fragments` isolément. Le bloc ci-dessous — argv, `git show`,
// `process.exit` — ne doit tourner que dans le premier cas : un import ne
// doit ni exiger de fichiers en argument, ni terminer le process de test.
const estAppeleDirectement =
  process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (estAppeleDirectement) {
  executerCli(process.argv.slice(2))
}

function executerCli(fichiers) {
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
      .filter((f) => !TARIFS_RETIRES.some((t) => correspondTarifRetire(t, f, fichier)))
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
}

export { fragments, normaliser, estUnRegroupement }
