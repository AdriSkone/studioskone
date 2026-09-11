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
  titre: {
    debut: 'Le site que vos clients méritent,',
    accent: 'conçu et codé',
    fin: 'par la même personne.',
  },
  statement:
    'Je dessine et je développe vos sites et vos applications, du premier croquis à la mise en ligne. ' +
    'Un seul interlocuteur, un seul devis, un seul responsable du résultat. Livré en 2 à 6 semaines, à partir de 900&nbsp;€.',
  lieu: 'À Nantes et partout en France',
  ctas: [
    { libelle: 'Estimer mon projet',   href: '#estimator', variante: 'principal' },
    { libelle: 'Voir les réalisations', href: '#work',      variante: 'secondaire' },
  ],
  preuves: ['Devis gratuit', 'Réponse sous 24&nbsp;h', 'Vous êtes propriétaire de votre site'],
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
      prix: 'Dès 900€',
    },
    {
      titre: 'Site e-commerce',
      href: '/creation-site-ecommerce-nantes',
      cible: 'marques et commerçants qui veulent vendre en ligne sans se battre avec leur outil.',
      texte: 'Boutique Shopify ou sur mesure, fiches produits, paiement, livraison, et une prise en main que vous maîtrisez en une heure.',
      prix: 'Dès 3 000€',
    },
    {
      titre: 'Application web &amp; SaaS',
      href: null,
      cible: 'entreprises et porteurs de projet avec un outil métier à créer ou un process à automatiser.',
      texte: 'Back-office, interfaces métier, applications complexes. De la conception au déploiement.',
      prix: 'Dès 2 500€',
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
      prix: 'Dès 1 200€',
    },
    {
      titre: 'Direction artistique &amp; UI',
      href: null,
      cible: "ceux qui ont déjà un développeur, ou qui veulent d'abord voir avant d'engager.",
      texte: 'Maquettes haute fidélité, design system, identité visuelle. Rien ne part en développement sans votre validation.',
      prix: 'Dès 600€',
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
    apres: "sur l'offre Fondation et l'offre Studio, en échange d'un témoignage et de l'autorisation de publier le projet.",
  },
  offres: [
    {
      nom: 'Fondation, pour démarrer',
      prix: 'Dès 900€',
      recommandee: false,
      resume: 'De quoi lancer vite un site soigné, sans exploser le budget.',
      inclus: [
        "Landing page ou site vitrine d'une page",
        'Design sur mesure',
        'Responsive mobile-first',
        '2 allers-retours inclus',
        'Mise en ligne',
        'Livraison en 1–2 semaines',
      ],
      variation: 'Ce qui fait bouger le prix : le nombre de pages, et si les textes et photos sont à créer.',
      cta: { libelle: 'Choisir cette offre', href: '#contact' },
    },
    {
      nom: 'Studio, pour performer',
      prix: 'Dès 2 500€',
      recommandee: true,
      badge: 'Le plus choisi',
      resume: 'Mon offre la plus demandée. Un produit complet, aussi soigné côté design que côté performance.',
      inclus: [
        'Site vitrine multi-pages ou application web',
        'E-commerce à partir de 3 000€',
        'Architecture UX &amp; design sur mesure',
        'Animations et interactions soignées',
        'SEO technique intégré',
        'Ajustements continus',
        'Livraison en 4–6 semaines',
      ],
      variation: "Ce qui fait bouger le prix : le nombre de pages, la présence d'une réservation ou d'un paiement, et si les contenus sont à créer.",
      cta: { libelle: 'Choisir cette offre', href: '#contact', fleche: true },
    },
    {
      nom: 'Sur mesure, pour aller plus loin',
      prix: 'Sur devis',
      recommandee: false,
      resume: 'Pour les projets plus gros, qui demandent un vrai cadrage produit et un suivi rapproché.',
      inclus: [
        'Application mobile, SaaS ou plateforme complexe',
        'Périmètre défini ensemble',
        'Accompagnement dédié',
        'Suivi régulier',
        'Délais et livrables adaptés',
      ],
      variation: 'Ce qui fait bouger le prix : le périmètre de la version 1, les comptes utilisateurs et les paiements.',
      cta: { libelle: 'Demander un devis', href: '#contact' },
    },
  ],
  notePied: { avant: 'Besoin de design seul, sans développement ?', lien: 'À partir de 600€', href: '#contact' },
  verites: [
    {
      titre: "Ce qui n'est pas compris",
      texte: "Le nom de domaine (environ 12&nbsp;€/an) et l'hébergement (de 0 à 15&nbsp;€/mois selon le projet). Vous payez ces deux postes en direct, à votre nom. Je ne prends pas de marge dessus.",
    },
    {
      titre: 'Comment on paie',
      texte: 'En trois fois, sans frais : 30&nbsp;% à la commande, 30&nbsp;% à la validation des maquettes, 40&nbsp;% à la mise en ligne. Le site, le code et tous les accès vous appartiennent, sans abonnement.',
    },
    {
      titre: 'Pour situer',
      texte: 'Une agence facture généralement le même site entre 3&nbsp;500 et 8&nbsp;000&nbsp;€, avec un chef de projet à payer entre vous et la personne qui travaille. Une plateforme à 29&nbsp;€/mois vous coûte 350&nbsp;€ par an, à vie, pour un template que trois de vos concurrents utilisent déjà.',
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
    { numero: '01', q: 'Combien coûte un site chez vous ?', r: "Un site vitrine démarre à 900 €, un site multi-pages ou une application web à 2 500 €, une boutique en ligne à 3 000 €. Le prix dépend surtout de trois choses : le nombre de pages, la présence d'une réservation ou d'un paiement, et si les contenus sont à créer. L'estimateur plus haut vous donne une fourchette en 30 secondes." },
    { numero: '02', q: 'Combien de temps ça prend ?', r: "Une à deux semaines pour une landing page, quatre à six semaines pour un site complet ou une application web. Le délai est écrit sur le devis. Si je le dépasse de mon fait, vous ne payez pas le dépassement." },
    { numero: '03', q: "Qu'est-ce que j'ai à fournir ?", r: "Une heure d'échange au démarrage, et 30 minutes de retours sur les maquettes. Le reste, je m'en occupe. Si vous avez des textes et des photos, tant mieux. Si vous n'en avez pas, c'est prévu : je rédige les textes et j'organise les visuels." },
    { numero: '04', q: "Le site m'appartient vraiment ?", r: "Oui, entièrement. Le code, le design, le nom de domaine, les accès à l'hébergement : tout est à votre nom, dès la mise en ligne. Vous n'êtes lié à moi par aucun abonnement. Si vous voulez confier la suite à quelqu'un d'autre un jour, vous le pouvez sans rien me demander." },
    { numero: '05', q: 'Je pourrai modifier mon site moi-même ?', r: "Oui. Selon le projet, je mets en place une interface d'administration simple pour changer vos textes, vos photos, vos horaires ou vos tarifs. Je vous forme en visio à la mise en ligne, et je vous laisse un guide écrit. Si vous préférez me confier les modifications, c'est possible aussi, à la demande." },
    { numero: '06', q: 'Pourquoi pas Wix, Squarespace ou un site à 400 € ?', r: "Parce que ce sont deux besoins différents. Une plateforme vous donne un template que d'autres utilisent, un abonnement à vie, et un site que vous ne pourrez pas emporter ailleurs. C'est une solution honnête si votre site est une carte de visite. Si votre site doit vous apporter des clients, vous faire sortir sur Google et vous ressembler, ça ne suffira pas. Je vous le dirai franchement pendant l'appel si votre besoin relève plutôt de la plateforme." },
    { numero: '07', q: 'Le référencement est-il inclus ?', r: "Le référencement technique, oui : structure, vitesse, balises, données structurées, version mobile, indexation. C'est la base sans laquelle rien ne remonte. Le référencement éditorial, celui qui vous fait ranker sur des requêtes précises, demande un travail dans la durée. On peut le prévoir en accompagnement mensuel si vous le souhaitez." },
    { numero: '08', q: "Combien d'allers-retours sont inclus ?", r: "Deux séries de retours sur l'offre Fondation, des ajustements continus sur l'offre Studio. En pratique je n'ai jamais compté, parce que la validation des maquettes avant développement évite les allers-retours coûteux. C'est tout l'intérêt de valider le dessin avant de construire." },
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
