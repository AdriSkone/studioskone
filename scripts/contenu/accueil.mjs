/**
 * Contenu de la page d'accueil.
 *
 * Chaque chaîne est reprise mot pour mot de l'accueil d'avant la refonte,
 * espaces insécables compris. Ce fichier n'est pas un endroit où l'on
 * réécrit : c'est l'endroit où le texte cesse d'être mélangé au balisage,
 * pour qu'on puisse changer la mise en page sans risquer d'y toucher.
 *
 * La vérification est mécanique — `node scripts/verifier-copy.mjs` compare
 * le texte rendu à celui de la page d'origine et doit ne rien trouver.
 */

export const nav = {
  liens: [
    { libelle: 'Le studio',   href: '#approach' },
    { libelle: 'Prestations', href: '#services' },
    { libelle: 'Méthode',     href: '#process' },
    { libelle: 'Projets',     href: '#work' },
    { libelle: 'Tarifs',      href: '#tarifs' },
    { libelle: 'Contact',     href: '#contact' },
  ],
  mention: 'Réponse sous 24&nbsp;h',
  cta: { libelle: 'Estimer mon projet', href: '#estimator' },
}

export const hero = {
  // L'accent tombe sur la chute, pas sur le milieu de la phrase : c'est
  // « même personne » qui porte la promesse, et c'est ce que colorent les
  // maquettes. Le texte, lui, ne bouge pas.
  titre: {
    avant: 'Le site que vos clients méritent, conçu et codé par la',
    accent: 'même personne.',
  },
  statement:
    'Je dessine et je développe vos sites et vos applications, du premier croquis à la mise en ligne. ' +
    'Un seul interlocuteur, un seul devis, un seul responsable du résultat. Livré en 5 jours à 3 semaines, à partir de 900&nbsp;€.',
  ctas: [
    { libelle: 'Estimer mon projet',   href: '#estimator', variante: 'principal' },
    { libelle: 'Voir les réalisations', href: '#work',      variante: 'secondaire' },
  ],
  preuves: ['Devis gratuit', 'Réponse sous 24&nbsp;h', 'Vous êtes propriétaire de votre site', 'À Nantes et partout en France'],
}

/** Le ruban du hero. La série est doublée à l'affichage, pas ici. */
export const ruban = [
  'Site Vitrine', 'Refonte de site', 'E-Commerce', 'Application Web &amp; SaaS',
  'Application Mobile', 'Landing Page', 'UX / UI Design', 'Branding',
  'SEO &amp; Performance', 'Maintenance',
]

export const probleme = {
  label: 'Vous vous reconnaissez&nbsp;?',
  titre: { debut: 'Votre site ne travaille', accent: 'pas pour vous.' },
  symptomes: [
    "Vous n'osez plus donner l'adresse de votre site quand on vous la demande.",
    'Il date, il rame sur téléphone, et 8&nbsp;visiteurs sur 10 arrivent depuis un mobile.',
    'Vous payez un abonnement tous les mois pour un site que vous ne pouvez même pas modifier vous-même.',
    'On vous a livré un template comme celui de trois concurrents de votre ville.',
    "Vous avez un devis d'agence à 6&nbsp;000&nbsp;€, un autre à 400&nbsp;€ sur une plateforme, et aucune idée de ce qui les sépare.",
    "Vous n'avez ni le temps ni l'envie de gérer un projet web pendant six mois.",
  ],
}

/**
 * Le pivot. Il vivait au pied du bloc « problème » ; les maquettes lui
 * donnent sa propre section, seule et en grand. Le texte ne bouge pas —
 * il change seulement de place, et ne doit donc apparaître qu'une fois.
 */
export const pivot = {
  premiere: "Rien de tout ça n'est votre métier.",
  seconde: "C'est le mien.",
}

export const studio = {
  label: 'Le studio',
  titre: { debut: 'Conçu et construit par la', accent: 'même personne.' },
  metiers: [
    { label: 'Le pinceau', titre: 'Conception',     items: 'UX · Interface · Direction artistique' },
    { label: 'Le marteau', titre: 'Développement',  items: 'Intégration · Performance · Mise en ligne' },
  ],
  texte: [
    "Je suis Adrien. Je conçois et je développe. Jamais l'un sans l'autre.",
    "Skøne, c'est ça : un bon produit ne naît que si la même personne tient le pinceau et le marteau.",
  ],
  benefices: [
    {
      titre: 'Un seul interlocuteur.',
      texte: 'Vous expliquez votre métier une fois. Pas de dossier qui se perd entre un designer et un développeur.',
    },
    {
      titre: "Rien d'infaisable.",
      texte: "Je ne dessine jamais un écran que je ne saurais pas construire. Ce que vous validez en maquette, c'est ce que vous recevez.",
    },
    {
      titre: "Le prix d'une seule personne.",
      texte: "Pas de chef de projet à facturer, pas de marge d'agence. Le budget part dans le produit.",
    },
  ],
}

export const transparence = {
  label: 'En toute transparence',
  titre: 'Le studio est jeune, et je le dis.',
  textes: [
    "Studio Skøne a ouvert en 2026. Concrètement, pour vous : j'ai le temps de m'investir sur votre projet, vous ne passez pas après dix autres clients, et mes tarifs de lancement sont plus bas qu'ils ne le seront dans un an.",
    "En échange, je demande une chose : si le travail vous plaît, un avis honnête et l'autorisation de montrer le projet.",
  ],
}

export const prestations = {
  label: 'Ce que je construis',
  titre: { debut: 'Mes', accent: 'prestations' },
  cartes: [
    {
      titre: 'Site vitrine &amp; landing page',
      href: '/creation-site-internet-nantes',
      cible: 'artisans, commerçants, thérapeutes, indépendants qui veulent être trouvés et contactés.',
      texte: "Un site rapide, lisible sur téléphone, pensé pour déclencher l'appel ou le formulaire. Du one-pager au site complet.",
      prix: '900 €',
    },
    {
      titre: 'Site e-commerce',
      href: '/creation-site-ecommerce-nantes',
      cible: 'marques et commerçants qui veulent vendre en ligne sans se battre avec leur outil.',
      texte: 'Boutique Shopify ou sur mesure, fiches produits, paiement, livraison, et une prise en main que vous maîtrisez en une heure.',
      prix: 'Dès 3 000 €',
    },
    {
      titre: 'Application web &amp; SaaS',
      href: null,
      cible: 'entreprises et porteurs de projet avec un outil métier à créer ou un process à automatiser.',
      texte: 'Back-office, interfaces métier, applications complexes. De la conception au déploiement.',
      prix: 'Sur devis',
    },
    {
      titre: 'Application mobile',
      href: '/creation-application-mobile',
      cible: "porteurs de projet qui veulent être sur l'App Store et le Play Store, pas juste « avoir une appli ».",
      texte: "iOS et Android, du premier écran jusqu'à la publication. Une interface conçue pour le pouce, pas un site rétréci.",
      prix: 'Sur devis',
    },
    {
      titre: 'Refonte de site',
      href: '/refonte-site-internet',
      cible: "ceux qui ont déjà un site, qui n'en sont plus fiers, et qui ne veulent pas repartir de zéro.",
      texte: 'Audit, reprise du contenu existant, nouveau design, migration, redirections. Vous ne perdez pas votre référencement acquis.',
      prix: 'Dès 900 €',
    },
    {
      titre: 'Direction artistique &amp; UI',
      href: null,
      cible: "ceux qui ont déjà un développeur, ou qui veulent d'abord voir avant d'engager.",
      texte: 'Maquettes haute fidélité, design system, identité visuelle. Rien ne part en développement sans votre validation.',
      prix: 'Dès 600 €',
    },
  ],
}

export const methode = {
  label: 'Ma méthode',
  titre: { debut: 'Une méthode claire.', suite: 'Zéro', accent: 'surprise', fin: '.' },
  etapes: [
    {
      numero: '01', phase: 'Découverte', titre: 'Cadrage du projet',
      texte: 'On commence par un atelier : vos objectifs, votre audience, ce que vous avez à dire. De là, on structure le plan de site ensemble.',
      temps: "Votre temps : 1 h d'échange. C'est tout.",
    },
    {
      numero: '02', phase: 'Design', titre: 'Conception visuelle',
      texte: 'Chaque écran est validé avec vous avant le développement. Typo, mise en page, DA : rien ne part en prod sans votre accord.',
      temps: 'Votre temps : 30 min de retours sur les maquettes.',
    },
    {
      numero: '03', phase: 'Développement', titre: 'Build &amp; intégration',
      texte: "Les maquettes deviennent du code. Pixel-perfect, testé sur tous les supports. Vous suivez l'avancement sur un lien privé, en temps réel.",
      temps: 'Votre temps : zéro. Vous regardez avancer.',
    },
    {
      numero: '04', phase: 'Lancement', titre: 'Mise en ligne &amp; suivi',
      texte: 'Mise en ligne, prise en main en visio, suivi inclus. Je reste joignable si quelque chose doit changer après le lancement.',
      temps: 'Votre temps : 45 min de formation, et le site est à vous.',
    },
  ],
  cloture: "Et si vous n'avez ni textes ni photos : je m'en occupe aussi. C'est prévu dans le cadrage.",
}

export const realisations = {
  label: 'Réalisations',
  titre: { debut: "Ce que j'ai construit,", suite: 'et', accent: 'pourquoi.' },
  intro:
    "Le studio a ouvert récemment. Vous trouverez ici des projets clients, des outils que j'ai conçus pour mes propres besoins, " +
    'et des exercices de conception menés pour un secteur précis. Chaque projet dit lequel il est.',
  introFort:
    "Je préfère vous montrer comment je réfléchis plutôt que de vous vendre une ancienneté que je n'ai pas.",
}

export const tarifs = {
  label: 'Mes tarifs',
  titre: { debut: 'Des offres', accent: 'claires', fin: ',', suite: 'des résultats concrets.' },
  note: [
    "Tous les projets démarrent par un appel gratuit de 30 minutes. Vous en repartez avec une fourchette et une recommandation, même si on ne travaille pas ensemble.",
    'Pas de frais cachés. Pas de surprise en fin de mission.',
  ],
  lancement: {
    tag: 'Offre de lancement',
    avant: 'Le studio démarre. Sur les prochains projets,',
    remise: '−30 %',
    apres: "sur les formules Une page et Site complet, en échange d'un témoignage et de l'autorisation de publier le projet.",
  },
  /**
   * `nom` est le nom court, lisible en tête de carte. `h3` est le titre
   * réellement rendu : il porte la prestation, pour le référencement.
   */
  formules: [
    {
      nom: 'Une page',
      h3: 'Site internet une page',
      prix: '900 €',
      recommandee: false,
      positionnement: 'Pour exister en ligne sans attendre.',
      paragraphe:
        'Une seule page, mais complète : qui vous êtes, ce que vous faites, comment vous joindre. ' +
        "C'est souvent tout ce dont un artisan a besoin pour être trouvé et appelé.",
      inclus: [
        'Design sur mesure, à votre image',
        'Une page, tous les contenus essentiels',
        'Formulaire de contact ou de demande de devis',
        'Pensé pour le mobile en premier',
        'Fiche Google et référencement local configurés',
        'Deux séries de retouches incluses',
        'Mise en ligne incluse',
      ],
      delai: "Livré en 5 jours ouvrés, à partir du moment où j'ai vos textes et vos photos.",
      variation: 'Ce qui fait bouger le prix : la rédaction des textes et la création des photos, si vous ne les avez pas.',
      cta: { libelle: 'Choisir cette formule', href: '/?formule=une-page#estimator', umami: 'tarif-une-page' },
    },
    {
      nom: 'Site complet',
      h3: 'Site vitrine complet, 4 à 6 pages',
      prix: '1 900 €',
      recommandee: true,
      positionnement: 'Recommandé si vous avez plusieurs services à présenter.',
      paragraphe:
        'Quatre à six pages pour détailler votre offre, montrer vos réalisations et être trouvé ' +
        'sur les recherches de votre métier dans votre secteur.',
      // La seule ligne qui justifie le passage de 900 à 1 900 €. Traitée en
      // argument, pas en mention : sans elle, le visiteur croit payer des
      // pages en plus.
      ecart:
        "Ce qui change vraiment par rapport à la formule Une page : ce n'est pas le nombre de pages qui coûte, " +
        "c'est l'architecture du site, une page dédiée par service pour le référencement, et les contenus à produire pour chacune.",
      inclus: [
        'Tout ce que contient la formule Une page',
        '4 à 6 pages : accueil, services, réalisations, à propos, contact',
        'Une page par service, pour le référencement',
        'Animations et interactions soignées',
        'Référencement technique intégré',
        'Trois séries de retouches incluses',
      ],
      delai: "Livré en 3 semaines, à partir du moment où j'ai vos textes et vos photos.",
      variation:
        'Ce qui fait bouger le prix : le nombre de pages au-delà de six, la prise de rendez-vous ou le paiement en ligne, et les contenus à créer.',
      cta: { libelle: 'Choisir cette formule', href: '/?formule=site-complet#estimator', umami: 'tarif-site-complet', fleche: true },
    },
    {
      nom: 'Sur mesure',
      h3: 'E-commerce et applications sur mesure',
      prix: 'À partir de 3 000 €',
      recommandee: false,
      positionnement: "Quand un site vitrine ne suffit plus.",
      paragraphe:
        'Boutique en ligne, application web ou mobile, outil métier. On définit le périmètre ensemble ' +
        'avant de chiffrer, et vous savez où vous allez avant de signer.',
      inclus: [
        'Boutique en ligne à partir de 3 000 €',
        'Application web ou mobile sur devis',
        'Cadrage du produit avant le premier écran',
        'Périmètre et budget définis ensemble',
        'Suivi rapproché tout au long du projet',
      ],
      delai: 'Délais définis au cadrage.',
      variation: null,
      cta: { libelle: 'Demander un devis', href: '/?formule=sur-mesure#estimator', umami: 'tarif-sur-mesure' },
    },
  ],
  options: {
    intro: 'En option, sur toutes les formules :',
    items: [
      'Design seul, sans développement : à partir de 600 €',
      'Rédaction des textes : 200 € par page',
      'Séance photo : sur devis, avec un photographe partenaire',
    ],
  },
  toujours: {
    titre: 'Dans toutes les formules',
    items: [
      { titre: 'Le site vous appartient.', texte: "Le code est à vous, pas loué. Vous pouvez partir avec, quand vous voulez." },
      { titre: 'Un seul interlocuteur.', texte: "Je conçois, je développe, je mets en ligne. Vous n'avez qu'un numéro." },
      { titre: 'Paiement en deux fois.', texte: 'La moitié à la commande, la moitié à la mise en ligne. En trois fois pour les projets sur mesure.' },
      { titre: 'Aucun abonnement obligatoire.', texte: 'Pas de mensualité pour garder votre site en ligne.' },
    ],
  },
  charge: {
    titre: 'Ce qui reste à votre charge',
    items: [
      "Le nom de domaine, environ 15&nbsp;€ par an, à votre nom.",
      "L'hébergement, de 0 à 15&nbsp;€ par mois selon le projet, payé en direct et à votre nom. Je ne prends pas de marge dessus.",
      'Les contenus, si vous préférez les rédiger vous-même. Sinon je m&rsquo;en occupe, c&rsquo;est une option.',
      "La maintenance après livraison, si vous en voulez une. Elle n'est jamais imposée.",
    ],
  },
  verites: [
    {
      titre: 'Comment on paie',
      texte:
        'En deux fois : la moitié à la commande, la moitié à la mise en ligne. En trois fois sur les projets sur mesure — ' +
        '30&nbsp;% à la commande, 40&nbsp;% à la validation des maquettes, 30&nbsp;% à la mise en ligne. ' +
        'Le site, le code et tous les accès vous appartiennent, sans abonnement.',
    },
    {
      titre: 'Pour situer',
      texte:
        'Une agence facture généralement le même site entre 3&nbsp;500 et 8&nbsp;000&nbsp;€, avec un chef de projet à payer entre vous et la personne qui travaille. ' +
        'Une plateforme à 29&nbsp;€/mois vous coûte 350&nbsp;€ par an, à vie, pour un template que trois de vos concurrents utilisent déjà. ' +
        "Je ne suis pas moins cher parce que j'en fais moins. Je suis moins cher parce qu'il n'y a personne à payer entre vous et moi. " +
        "Pas de chef de projet qui transmet, pas de commercial qui vend, pas de bureaux à financer. Le même travail, sans la chaîne.",
    },
  ],
}

/**
 * Estimateur. Les `name` et `value` sont ceux que lit src/components/
 * estimator.ts, et que couvrent les tests de estimator-pricing. Ils font
 * partie du contrat, pas de la présentation : on ne les renomme pas.
 */
export const estimateur = {
  eyebrow: 'Estimation · 30 secondes',
  titre: "Pas sûr de l'offre qui vous correspond ?",
  sousTitre: 'Trois questions, une fourchette. Sans engagement.',
  questions: [
    {
      cle: 'type', legende: 'Quel type de site ?',
      options: [
        { valeur: 'vitrine',      libelle: 'Vitrine' },
        { valeur: 'vitrine-plus', libelle: 'Vitrine avec réservation ou devis' },
        { valeur: 'boutique',     libelle: 'Boutique en ligne' },
        { valeur: 'application',  libelle: 'Application' },
      ],
    },
    {
      cle: 'size', legende: 'Quelle taille ?',
      options: [
        { valeur: '1',       libelle: 'Une page' },
        { valeur: '2-5',     libelle: '2 à 5 pages' },
        { valeur: '6-12',    libelle: '6 à 12 pages' },
        { valeur: 'inconnu', libelle: 'Je ne sais pas encore' },
      ],
    },
    {
      cle: 'content', legende: 'Textes et photos prêts ?',
      options: [
        { valeur: 'pret',    libelle: 'Oui' },
        { valeur: 'partiel', libelle: 'En partie' },
        { valeur: 'a-creer', libelle: 'Non, à créer' },
      ],
    },
  ],
  resultatLabel: 'Votre projet ressemble à',
  resultatCta: 'Discuter de ce projet',
  mention: 'Estimation indicative et hors taxes, établie à partir de vos réponses. Le devis est posé après un premier échange.',
}

/**
 * La FAQ sert deux fois : la section visible et le JSON-LD FAQPage du head,
 * que l'ancienne page décrivait comme « miroir exact ». Ils sont désormais
 * tirés d'ici tous les deux, et ne peuvent donc plus diverger.
 */
export const faq = {
  label: 'Questions fréquentes',
  titre: { debut: 'Les questions qu\'on me pose', suite: 'avant de', accent: 'signer.' },
  relance: {
    question: "Une question qui n'est pas là ?",
    texte: 'Écrivez-moi, je réponds moi-même sous 24 h.',
    lien: { libelle: 'Écrire au studio', href: 'mailto:contact@studioskone.com' },
  },
  items: [
    { numero: '01', q: 'Combien coûte un site chez vous ?', r: "Une page à 900 €, un site complet de quatre à six pages à 1 900 €, une boutique en ligne ou une application à partir de 3 000 €. Le prix est ferme : il figure sur le devis et ne bouge pas si le périmètre ne bouge pas." },
    { numero: '02', q: 'Combien de temps ça prend ?', r: "Cinq jours ouvrés pour une page, trois semaines pour un site complet, à partir du moment où j'ai vos textes et vos photos. Le délai est écrit sur le devis. Si je le dépasse de mon fait, vous ne payez pas le dépassement." },
    { numero: '03', q: "Qu'est-ce que j'ai à fournir ?", r: "Une heure d'échange au démarrage, et 30 minutes de retours sur les maquettes. Le reste, je m'en occupe. Si vous avez des textes et des photos, tant mieux. Si vous n'en avez pas, c'est prévu : je rédige les textes et j'organise les visuels." },
    { numero: '04', q: "Le site m'appartient vraiment ?", r: "Oui, entièrement. Le code, le design, le nom de domaine, les accès à l'hébergement : tout est à votre nom, dès la mise en ligne. Vous n'êtes lié à moi par aucun abonnement. Si vous voulez confier la suite à quelqu'un d'autre un jour, vous le pouvez sans rien me demander." },
    { numero: '05', q: 'Je pourrai modifier mon site moi-même ?', r: "Oui. Selon le projet, je mets en place une interface d'administration simple pour changer vos textes, vos photos, vos horaires ou vos tarifs. Je vous forme en visio à la mise en ligne, et je vous laisse un guide écrit. Si vous préférez me confier les modifications, c'est possible aussi, à la demande." },
    { numero: '06', q: 'Pourquoi pas Wix, Squarespace ou un site à 400 € ?', r: "Parce que ce sont deux besoins différents. Une plateforme vous donne un template que d'autres utilisent, un abonnement à vie, et un site que vous ne pourrez pas emporter ailleurs. C'est une solution honnête si votre site est une carte de visite. Si votre site doit vous apporter des clients, vous faire sortir sur Google et vous ressembler, ça ne suffira pas. Je vous le dirai franchement pendant l'appel si votre besoin relève plutôt de la plateforme." },
    { numero: '07', q: 'Le référencement est-il inclus ?', r: "Le référencement technique, oui : structure, vitesse, balises, données structurées, version mobile, indexation. C'est la base sans laquelle rien ne remonte. Le référencement éditorial, celui qui vous fait ranker sur des requêtes précises, demande un travail dans la durée. On peut le prévoir en accompagnement mensuel si vous le souhaitez." },
    { numero: '08', q: "Combien d'allers-retours sont inclus ?", r: "Deux séries de retouches sur la formule Une page, trois sur la formule Site complet. Au-delà, on en parle avant, jamais après." },
    { numero: '09', q: "Que se passe-t-il après la mise en ligne ?", r: "Un mois de suivi est inclus sur tous les projets : je corrige tout ce qui ne fonctionne pas comme prévu, sans facturer. Au-delà, je reste joignable à la demande, ou avec un forfait de maintenance mensuel si vous préférez ne pas y penser." },
    { numero: '10', q: "Vous êtes seul. Que se passe-t-il s'il vous arrive quelque chose ?", r: "Question légitime, et c'est pour ça que tout est à votre nom dès le départ : domaine, hébergement, code, accès. Je travaille avec des technologies standards et documentées, pas avec un système maison que personne d'autre ne saurait reprendre. N'importe quel développeur peut prendre la suite. C'est exactement ce qui n'est pas vrai avec les plateformes propriétaires." },
    { numero: '11', q: 'Le studio est récent. Pourquoi vous faire confiance ?', r: "Studio Skøne a ouvert en 2026, et je ne vais pas vous inventer dix ans d'ancienneté. Ce que je peux vous proposer à la place : une maquette complète avant que vous n'engagiez le budget de développement, un devis ferme, un délai écrit, des tarifs de lancement, et une disponibilité que je n'aurai plus dans deux ans. Regardez les projets : ils vous montrent comment je réfléchis, ce qui est plus utile qu'un compteur de clients." },
    { numero: '12', q: "J'ai déjà un site, faut-il tout refaire ?", r: "Pas forcément. Je regarde d'abord ce qui existe. Parfois une refonte du design et de la structure suffit et coûte moitié moins qu'un site neuf. Parfois le socle est trop ancien et repartir est plus économique. Je vous dis lequel des deux pendant l'appel gratuit, même si la réponse est « gardez votre site actuel »." },
  ],
}

export const engagements = {
  label: 'Mes engagements',
  titre: { debut: 'Ce sur quoi', accent: "je m'engage." },
  items: [
    { numero: '01', titre: 'Devis ferme', texte: 'Le prix annoncé est le prix payé. Si le périmètre change, on en parle avant, jamais après.' },
    { numero: '02', titre: 'Maquette avant développement', texte: "Vous voyez et validez le résultat avant qu'une seule ligne de code ne soit écrite. Si la direction ne vous convient pas, on s'arrête là." },
    { numero: '03', titre: 'Délai écrit', texte: 'Le délai figure sur le devis. Un retard de mon fait ne vous est pas facturé.' },
    { numero: '04', titre: 'Tout est à vous', texte: 'Code, design, domaine, hébergement, accès. À votre nom, sans abonnement, sans dépendance.' },
    { numero: '05', titre: 'Un mois de suivi inclus', texte: "Après la mise en ligne, je corrige ce qui doit l'être, sans facturer." },
  ],
}

export const contact = {
  label: 'Travaillons ensemble',
  titre: { debut: 'Vingt minutes pour savoir', suite: 'ce que vaut', accent: 'votre projet.' },
  textes: [
    "On parle de votre activité, de ce que vous attendez du site, et de votre budget. Je vous dis ce que je ferais, ce que ça coûte et combien de temps ça prend.",
    'Vous repartez avec une recommandation claire, même si vous décidez de ne pas travailler avec moi. Pas de relance commerciale, pas de blabla.',
  ],
}

/**
 * Le parcours unique — estimateur et contact fusionnés.
 *
 * Le visiteur ne saisit jamais deux fois la même chose : le type de projet
 * n'est demandé qu'une fois, et le délai ne l'est plus du tout puisque la
 * fourchette l'annonce déjà.
 *
 * Le budget, lui, reste — et il est demandé AVANT que la fourchette ne
 * s'affiche. Posé après, le visiteur reprendrait le chiffre qu'on vient de
 * lui montrer au lieu de donner le sien, et l'écart entre les deux est
 * précisément ce qui sert à préparer l'appel.
 *
 * Les `name` et `value` des trois premières questions sont ceux que lisent
 * estimator-pricing et ses tests : ils font partie du contrat, pas de la
 * présentation.
 */
export const parcours = {
  label: 'Estimation · 30 secondes',
  titre: "Pas sûr de l'offre qui vous correspond ?",
  sousTitre: 'Trois questions, une fourchette. Sans engagement.',

  questions: [
    { cle: 'type', legende: 'Quel type de site ?', options: [
      { valeur: 'vitrine',      libelle: 'Vitrine' },
      { valeur: 'vitrine-plus', libelle: 'Vitrine avec réservation ou devis' },
      { valeur: 'boutique',     libelle: 'Boutique en ligne' },
      { valeur: 'application',  libelle: 'Application' },
    ]},
    { cle: 'size', legende: 'Quelle taille ?', options: [
      { valeur: '1',       libelle: 'Une page' },
      { valeur: '2-5',     libelle: '2 à 5 pages' },
      { valeur: '6-12',    libelle: '6 à 12 pages' },
      { valeur: 'inconnu', libelle: 'Je ne sais pas encore' },
    ]},
    { cle: 'content', legende: 'Textes et photos prêts ?', options: [
      { valeur: 'pret',    libelle: 'Oui' },
      { valeur: 'partiel', libelle: 'En partie' },
      { valeur: 'a-creer', libelle: 'Non, à créer' },
    ]},
    { cle: 'budget', legende: 'Quel est votre budget estimatif&nbsp;?', options: [
      { valeur: '1k-3k',  libelle: '1 000 – 3 000 €' },
      { valeur: '3k-5k',  libelle: '3 000 – 5 000 €' },
      { valeur: '5k-10k', libelle: '5 000 – 10 000 €' },
      { valeur: '10k+',   libelle: '10 000 € +' },
      { valeur: 'a-def',  libelle: 'À définir' },
    ]},
  ],

  resultat: {
    label: 'Votre projet ressemble à',
    mention: 'Estimation indicative et hors taxes, établie à partir de vos réponses. Le devis est posé après un premier échange.',
  },

  coordonnees: {
    legende: 'Parlez-moi de vous',
    champs: [
      { cle: 'nom',         libelle: 'Nom',                   type: 'text',  requis: true },
      { cle: 'email',       libelle: 'Email',                 type: 'email', requis: true },
      { cle: 'description', libelle: 'Description du projet',  type: 'area',  requis: false },
    ],
    rgpd: {
      marque: 'RGPD*',
      texte: "En soumettant ce formulaire, j'accepte que les informations saisies dans ce formulaire soient utilisées pour permettre de me recontacter. Pour connaître et exercer vos droits, notamment de retrait de votre consentement à l'utilisation des données collectées par ce formulaire, veuillez consulter la",
      lien: { libelle: 'politique de confidentialité', href: '/politique-de-confidentialite' },
    },
  },

  actions: { precedent: 'Retour', suivant: 'Continuer', envoyer: 'Discuter de mon projet' },

  succes: { titre: 'Merci,', accent: "c'est envoyé.", texte: 'Je reviens vers vous sous 24h.' },
  erreur: { titre: 'Erreur · réessayer' },
}
