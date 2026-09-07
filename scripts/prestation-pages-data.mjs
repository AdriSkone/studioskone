/**
 * Contenu des pages prestations. Une entrée = une intention de recherche.
 *
 * L'ordre du tableau est l'ordre de rentabilité retenu :
 *   1. refonte            intention d'achat la plus forte, concurrence la plus faible
 *   2. artisan            la cible de prospection réelle
 *   3. nantes             page pilier, elle renvoie vers les autres
 *   4. e-commerce         fort panier
 *   5. application mobile volume national, pas local
 *
 * RÈGLE DURE : aucune phrase de contenu ne doit apparaître sur deux pages.
 * `build-prestation-pages.mjs` le vérifie et refuse de générer si c'est le cas.
 * Concrètement : les blocs communs (méthode, garanties, différenciateur) sont
 * REFORMULÉS à chaque page avec l'angle de cette page — jamais copiés.
 *
 * Les phrases de l'accueil sont hors du contrôle automatique mais soumises à la
 * même règle : la page pilier `creation-site-internet-nantes` ne reprend aucune
 * formule du hero ni de la section « Le problème » de `index.html`.
 */

export const PAGES = [

  // ══════════════════════════════════════════════════════════════════════════
  // 1 — REFONTE. Intention corrective : « mon site est nul ».
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'refonte-site-internet',
    footerLabel: 'Refonte de site',
    title: 'Refonte de site internet · Studio Skøne · Nantes',
    description: 'Refonte de votre site internet sans perdre votre référencement : audit, nouveau design, migration et redirections. Dès 1 200 €. Devis gratuit sous 24 h.',
    serviceName: 'Refonte de site internet',
    serviceType: 'Refonte de site internet',
    geo: true,
    areaServed: [{ type: 'City', name: 'Nantes' }, { type: 'Country', name: 'France' }],
    breadcrumb: [{ name: 'Refonte de site internet', url: '/refonte-site-internet' }],

    h1: 'Refonte de <span class="text-accent">site internet</span>',
    lead: "Votre site existe, il fonctionne, mais il ne vous ressemble plus et il ne vous rapporte rien. On ne repart pas forcément de zéro. J'audite, je reprends ce qui mérite de l'être, et je reconstruis le reste. Dès 1 200 €.",
    ctas: [
      { label: 'Demander un audit gratuit', href: '/#contact' },
      { label: 'Voir les réalisations', href: '/#work' },
    ],
    proof: ['Audit gratuit', 'Sans perte de référencement', 'Redirections comprises'],

    blocks: [
      {
        kind: 'problem',
        label: 'Les signes',
        h2: 'Un site ne vieillit pas d’un coup. <span class="text-accent">Il glisse.</span>',
        intro: ["Il a été bien fait il y a six ans. Depuis, votre offre a changé, les téléphones ont pris le dessus, Google a changé ses règles trois fois, et personne n'a touché au site."],
        items: [
          "Vous hésitez avant de donner l'adresse de votre site à un client.",
          "Il est lent, et vous voyez bien que les visiteurs ne restent pas.",
          "Sur téléphone, il faut zoomer pour lire, et le menu ne s'ouvre pas bien.",
          "Vous ne pouvez rien modifier sans rappeler la personne qui l'a fait, et elle ne répond plus.",
          "Vous êtes tombé de la première page de Google et vous ne savez pas quand.",
          "Il parle d'une activité que vous ne faites plus tout à fait.",
        ],
      },
      {
        kind: 'prose',
        label: 'La vraie question',
        h2: '« Est-ce que je vais perdre <span class="text-accent">mon référencement ?</span> »',
        paragraphs: [
          "C'est la bonne question, et c'est celle qui fait échouer la plupart des refontes mal menées. Votre site actuel a accumulé de la valeur aux yeux de Google : des adresses connues, des liens entrants, un historique. Une refonte bâclée jette tout ça.",
        ],
        bullets: [
          "Un relevé complet de vos pages actuelles et de celles qui vous apportent réellement des visites, avant de toucher quoi que ce soit.",
          "Un plan de redirections page par page. Chaque ancienne adresse pointe vers sa remplaçante, aucune n'est abandonnée.",
          "La reprise et l'amélioration du contenu qui fonctionne, plutôt que sa suppression.",
          "Une surveillance des positions dans les semaines qui suivent la mise en ligne, avec correction si quelque chose décroche.",
        ],
      },
      {
        kind: 'deliver',
        label: 'Le périmètre',
        h2: 'Ce que je regarde, et <span class="text-accent">ce que je refais.</span>',
        items: [
          { t: "L'audit, gratuit et sans engagement", d: "Je regarde votre site actuel : vitesse, mobile, structure, référencement, contenu, technologie. Je vous envoie un compte rendu écrit, que vous travailliez avec moi ou non." },
          { t: 'Le verdict honnête', d: "Parfois une reprise du design et de la structure suffit et coûte moitié moins qu'un site neuf. Parfois le socle est trop ancien et recommencer revient moins cher. Je vous dis lequel des deux, même si la réponse ne m'arrange pas." },
          { t: 'Le nouveau design', d: "Une direction artistique alignée sur ce que vous êtes devenu, pas sur ce que vous étiez il y a six ans." },
          { t: 'La reprise du contenu', d: "Vos textes et vos photos sont récupérés, triés, réécrits quand il faut. Vous ne repartez pas d'une page blanche." },
          { t: 'La migration technique', d: "Nouveau site, redirections, plan du site, réindexation. Sans coupure de service : l'ancien site reste en ligne jusqu'à la bascule." },
          { t: 'La main rendue', d: "Une interface d'administration simple, et tous les accès à votre nom. Le problème du « je ne peux rien changer » ne se reproduit pas." },
        ],
      },
      {
        kind: 'pricing',
        label: 'Budget',
        h2: 'Combien coûte <span class="text-accent">une refonte ?</span>',
        tiers: [
          { name: 'Rafraîchissement', price: 'dès 1 200 €', desc: "Nouveau design sur la structure existante, corrections mobile et vitesse. Quand le socle est sain." },
          { name: 'Refonte complète', price: 'dès 2 500 €', desc: "Nouvelle structure, nouveau design, contenu repris, migration et redirections. Le cas le plus fréquent." },
          { name: 'Changement de technologie', price: 'sur devis', desc: "Quand le site actuel repose sur une base obsolète, ou sur un outil dont vous voulez sortir." },
        ],
        notes: [
          { t: "L'audit vous appartient", d: "Il est gratuit et il reste le vôtre, même si vous n'allez pas plus loin. Vous pouvez le confier à quelqu'un d'autre." },
          { t: 'Ce qui pèse dans le prix', d: "Le nombre de pages à reprendre, l'état du contenu existant, et la technologie de départ. Un site sous plateforme propriétaire demande plus de travail de sortie." },
          { t: 'Non compris', d: "Le nom de domaine et l'hébergement restent à votre nom et à votre charge, sans marge de ma part. Si votre domaine est détenu par votre ancien prestataire, je vous aide à le récupérer." },
        ],
        cta: 'Estimer ma refonte',
      },
      {
        kind: 'faq',
        label: 'Questions fréquentes',
        h2: 'Ce qu’on me demande <span class="text-accent">avant une refonte.</span>',
        items: [
          ['Mon site sera-t-il hors ligne pendant la refonte ?',
           "Non. Le nouveau site est construit en parallèle, sur une adresse privée. La bascule prend quelques minutes, généralement en soirée."],
          ['Je peux garder mon nom de domaine ?',
           "Oui, toujours. Et si votre domaine est actuellement détenu par votre ancien prestataire, je vous aide à le récupérer à votre nom."],
          ['Combien de temps prend une refonte ?',
           "Deux à trois semaines pour un rafraîchissement, quatre à six pour une refonte complète. L'audit prend quelques jours et démarre le processus."],
          ["Et si mon ancien prestataire ne me donne pas les accès ?",
           "C'est fréquent, et ce n'est pas bloquant. Le contenu public peut être récupéré, et le domaine peut être transféré par des procédures prévues pour ça. Je vous accompagne sur ces démarches."],
          ['Vous travaillez sur WordPress, Wix, Squarespace ?',
           "Je peux auditer et migrer depuis à peu près n'importe quelle base. Pour le nouveau site, je vous recommande la technologie qui correspond à votre besoin et à votre autonomie souhaitée, pas celle qui m'arrange."],
          ['Combien de temps avant de voir un effet sur mes visites ?',
           "Les gains de vitesse et de mobile sont immédiats. Les effets sur le référencement se voient généralement entre quatre et douze semaines, le temps que Google réindexe l'ensemble."],
        ],
      },
      {
        kind: 'links',
        label: 'Pour aller plus loin',
        h2: 'Si votre besoin est <span class="text-accent">ailleurs.</span>',
        items: [
          { tag: 'Prestation', href: '/creation-site-internet-nantes', title: 'Création de site internet à Nantes', desc: "Si le site est à construire plutôt qu'à reprendre." },
          { tag: 'Prestation', href: '/creation-site-internet-artisan', title: 'Site internet pour artisan', desc: "Si vous êtes du bâtiment ou de l'artisanat d'art." },
          { tag: 'Tarifs', href: '/#tarifs', title: 'La grille tarifaire complète', desc: "Les trois offres, ce qui n'est pas compris, et le paiement en trois fois." },
        ],
      },
      {
        kind: 'cta',
        h2: 'Commencez par l’audit. <span class="text-accent">Il est gratuit.</span>',
        paragraphs: [
          "Donnez-moi l'adresse de votre site. Je regarde la vitesse, le mobile, la structure et le référencement, et je vous envoie un compte rendu écrit sous 48 h, avec ce que je ferais en priorité.",
          "Il est à vous, que vous me confiiez la refonte ou non.",
        ],
        primary: { label: 'Demander mon audit gratuit', href: '/#contact' },
        secondary: { label: 'Estimer mon projet', href: '/#estimator' },
        note: 'Réponse sous 24 h ouvrées.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 2 — ARTISAN. Intention sectorielle : « je suis plombier, il me faut un site ».
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'creation-site-internet-artisan',
    footerLabel: 'Site internet pour artisan',
    title: 'Création de site internet pour artisan · Studio Skøne',
    description: "Sites internet pour artisans du bâtiment et de l'artisanat : trouvé sur Google, lisible sur téléphone, fait pour déclencher l'appel. Dès 900 €, livré en deux semaines.",
    serviceName: 'Création de site internet pour artisan',
    serviceType: 'Création de site vitrine pour artisan',
    geo: true,
    areaServed: [{ type: 'City', name: 'Nantes' }, { type: 'AdministrativeArea', name: 'Loire-Atlantique' }, { type: 'Country', name: 'France' }],
    breadcrumb: [{ name: 'Site internet pour artisan', url: '/creation-site-internet-artisan' }],

    h1: 'Création de site internet <span class="text-accent">pour artisans</span>',
    lead: "Un site qui vous fait trouver sur Google, qui se lit sur un téléphone à une main, et qui déclenche l'appel. Pensé pour votre métier, pas pour un concours de design. Dès 900 €, livré en deux semaines.",
    ctas: [
      { label: 'Estimer mon site', href: '/#estimator' },
      { label: 'Voir un exemple', href: '/projets/merel-et-fils' },
    ],
    proof: ['Devis gratuit', "Vous n'avez rien à rédiger", 'Deux heures de votre temps en tout'],

    blocks: [
      {
        kind: 'problem',
        label: 'Ce que cherche votre client',
        h2: 'Votre meilleur commercial travaille <span class="text-accent">pendant que vous êtes sur le chantier.</span>',
        intro: [
          "Un client qui cherche un artisan ne feuillette pas les Pages Jaunes. Il sort son téléphone, tape son besoin plus le nom de sa commune, et appelle un des trois premiers. S'il ne vous trouve pas, il ne saura jamais que vous existiez.",
          "Et quand il vous trouve, voilà ce qu'il veut, dans cet ordre :",
        ],
        items: [
          "Voir vos réalisations en photo, pas lire trois paragraphes.",
          "Savoir si vous vous déplacez chez lui.",
          "Appeler en un geste, sans recopier un numéro.",
          "Se rassurer : assurance, garantie décennale, avis d'autres clients.",
          "Faire tout ça en marchant, sur un écran de téléphone, en moins d'une minute.",
        ],
      },
      {
        kind: 'deliver',
        label: 'Ce que je livre',
        h2: 'Un site fait pour le téléphone <span class="text-accent">d’un client pressé.</span>',
        items: [
          { t: "Le bouton d'appel toujours visible", d: "Fixé en bas de l'écran sur mobile, du haut jusqu'en bas de page. Un geste, et il vous a au bout du fil." },
          { t: 'Vos chantiers en photo, mis en valeur', d: "Avant et après, matières, détails. Vos réalisations sont votre meilleur argument, et elles méritent mieux qu'une galerie compressée." },
          { t: "Vos zones d'intervention, écrites noir sur blanc", d: "Les communes que vous couvrez, listées et référencées. C'est ce que les gens tapent, et c'est ce qui vous fait apparaître." },
          { t: 'Un formulaire de devis court', d: "Nom, téléphone, nature du chantier, une photo. Cinq champs maximum. Chaque champ en plus vous coûte des demandes." },
          { t: 'Vos garanties affichées', d: "Assurance décennale, certifications, labels, années de métier. C'est ce qui rassure avant l'appel." },
          { t: 'La fiche Google Business, mise en place', d: "Pour beaucoup d'artisans, elle apporte plus de contacts que le site lui-même. Je la crée, je la remplis, je la relie au site et je vous montre comment récolter des avis." },
        ],
      },
      {
        kind: 'prose',
        alt: true,
        label: "L'objection",
        h2: '« Un site, c’est pas <span class="text-accent">un peu cher pour un artisan ?</span> »',
        paragraphs: [
          "Question légitime. Voilà comment je la regarde.",
          "Un site vitrine à 900 €, amorti sur trois ans, revient à 25 € par mois. C'est moins qu'un plein de gasoil. Il suffit d'un chantier gagné dans l'année pour que la question soit réglée.",
          "Une plateforme d'annonces vous prend une commission sur chaque contact, à vie, et vous met en concurrence directe avec dix autres artisans sur la même page. Un site est à vous et ne prélève rien.",
          "Et si ce n'est pas le moment, je vous le dirai pendant l'appel. Il y a des situations où une fiche Google Business bien tenue suffit, et où un site peut attendre six mois. Ça m'est déjà arrivé de le conseiller.",
        ],
      },
      {
        kind: 'method',
        label: 'Comment ça se passe',
        h2: 'Deux heures de votre temps. <span class="text-accent">Pas une de plus.</span>',
        steps: [
          { t: "Un appel d'une heure", d: "Je vous pose des questions sur votre métier, vos chantiers, vos clients, vos zones. Vous parlez, je note. C'est tout ce dont j'ai besoin de vous." },
          { t: "J'écris et je dessine", d: "Textes, structure, maquettes. Vous recevez un lien et vous me dites ce que vous en pensez. Trente minutes." },
          { t: 'Je construis', d: "Vous n'avez rien à faire pendant cette étape." },
          { t: 'On met en ligne', d: "Trente minutes en visio pour vous montrer comment changer une photo ou un texte. Puis le site est à vous." },
        ],
        closing: "Pour les photos : si vous en avez sur votre téléphone, ça suffit souvent. Sinon, je vous dis quoi photographier et comment.",
      },
      {
        kind: 'prose',
        label: 'Les métiers',
        h2: 'Avec qui <span class="text-accent">je travaille.</span>',
        paragraphs: [
          "Plombiers, électriciens, menuisiers, ébénistes, maçons, couvreurs, peintres, carreleurs, paysagistes, serruriers, chauffagistes, plaquistes, terrassiers et artisans d'art.",
          "Si votre métier n'est pas dans cette liste, il rentre quand même.",
        ],
      },
      {
        kind: 'pricing',
        label: 'Budget',
        h2: 'Deux formats, <span class="text-accent">deux prix.</span>',
        tiers: [
          { name: 'Site artisan essentiel', price: '900 €', desc: "Une page complète : présentation, réalisations, zones, garanties, appel et formulaire de devis. Livré en deux semaines, fiche Google Business comprise." },
          { name: 'Site artisan complet', price: 'dès 1 800 €', desc: "Plusieurs pages, une par prestation et par zone principale, galerie de chantiers, avis clients. Meilleure base pour le référencement local." },
        ],
        notes: [
          { t: 'Toujours compris', d: "Les textes écrits par moi, la mise en ligne, la formation et un mois de suivi. Vous n'avez aucun contenu à préparer avant de commencer." },
          { t: 'Le paiement', d: "En trois fois sans frais. Rien n'est dû avant que vous ayez validé les maquettes de votre site." },
          { t: 'Ce qui reste à votre charge', d: "Le nom de domaine et l'hébergement, payés en direct et à votre nom. Comptez une quinzaine d'euros par an pour le domaine." },
        ],
        cta: 'Estimer mon site en 30 secondes',
      },
      {
        kind: 'links',
        label: 'À regarder',
        h2: 'Un site d’artisan, <span class="text-accent">en vrai.</span>',
        items: [
          { tag: 'Exercice de conception', href: '/projets/merel-et-fils', title: 'Mérel & Fils', desc: "Un atelier d'ébénisterie où la matière passe avant le discours. Les décisions de conception y sont expliquées une par une." },
          { tag: 'Prestation', href: '/refonte-site-internet', title: 'Refonte de site internet', desc: "Si vous avez déjà un site et qu'il a pris de l'âge." },
        ],
      },
      {
        kind: 'faq',
        label: 'Questions fréquentes',
        h2: 'Ce que les artisans <span class="text-accent">me demandent.</span>',
        items: [
          ["Je n'ai ni textes ni photos. C'est possible quand même ?",
           "Oui, et c'est le cas le plus fréquent. J'écris les textes à partir de notre échange. Pour les photos, celles de votre téléphone conviennent souvent très bien, et je vous dis quoi cadrer."],
          ['Est-ce que je vais apparaître sur Google ?',
           "Sur votre nom et votre métier dans votre commune, oui, à condition d'avoir une fiche Google Business bien tenue, que je mets en place. Sur des requêtes plus concurrentielles, ça demande du contenu et des avis dans la durée. Je vous explique comment faire, c'est à votre portée."],
          ["Je n'y connais rien en informatique.",
           "C'est prévu. Vous n'avez aucun outil à apprendre pendant le projet. À la livraison, je vous montre en trente minutes comment changer une photo ou un texte, et je vous laisse un guide. Si vous préférez me confier les modifications, c'est possible aussi."],
          ['Combien de temps ça va me prendre ?',
           "Environ deux heures au total, réparties sur les trois semaines du projet. Vous n'avez pas à vous en occuper entre les rendez-vous."],
          ['Est-ce que ça vaut le coup si je travaille déjà par le bouche-à-oreille ?',
           "Le bouche-à-oreille finit toujours sur Google. Quand on vous recommande, la personne tape votre nom pour vérifier avant d'appeler. S'il n'y a rien, ou quelque chose de daté, une partie des recommandations se perd en route."],
          ["Et si je veux ajouter des choses plus tard ?",
           "On commence simple et on ajoute au fur et à mesure. Une page de plus, une nouvelle prestation, une galerie : ça se rajoute sans tout refaire."],
        ],
      },
      {
        kind: 'cta',
        h2: 'Appelez-moi <span class="text-accent">entre deux chantiers.</span>',
        paragraphs: [
          "Vingt minutes, quand ça vous arrange, même depuis la camionnette. Je vous dis ce que je ferais pour votre métier, ce que ça coûte, et si ça vaut le coup pour vous maintenant.",
        ],
        primary: { label: 'Écrire au studio', href: '/#contact' },
        secondary: { label: 'Estimer mon site', href: '/#estimator' },
        note: 'Réponse sous 24 h.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 3 — NANTES. Intention géographique. Page pilier.
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'creation-site-internet-nantes',
    footerLabel: 'Création de site internet',
    title: 'Création de site internet à Nantes · Studio Skøne',
    description: "Création de sites internet à Nantes et en Loire-Atlantique. Design et développement par la même personne, du croquis à la mise en ligne. Dès 900 €, devis gratuit.",
    serviceName: 'Création de site internet à Nantes',
    serviceType: 'Création de site internet',
    geo: true,
    areaServed: [{ type: 'City', name: 'Nantes' }, { type: 'AdministrativeArea', name: 'Loire-Atlantique' }, { type: 'Country', name: 'France' }],
    breadcrumb: [{ name: 'Création de site internet à Nantes', url: '/creation-site-internet-nantes' }],

    h1: 'Création de site internet <span class="text-accent">à Nantes</span>',
    lead: "Je conçois et je développe votre site du premier croquis à la mise en ligne. Une seule personne au dessin et au code, un seul interlocuteur, un seul responsable du résultat. Livré en 2 à 6 semaines, à partir de 900 €.",
    context: "Je me déplace sur Nantes et l'agglomération, et je travaille en visio partout en France.",
    ctas: [
      { label: 'Estimer mon projet', href: '/#estimator' },
      { label: 'Voir les réalisations', href: '/#work' },
    ],
    proof: ['Devis gratuit', 'Réponse sous 24 h', 'Vous êtes propriétaire de votre site'],

    blocks: [
      {
        kind: 'problem',
        label: 'Le contexte local',
        h2: 'À Nantes, un site n’est plus un luxe. <span class="text-accent">C’est le premier rendez-vous.</span>',
        intro: [
          "Un client qui cherche un prestataire à Nantes tape son besoin sur son téléphone, regarde les trois premiers résultats, et décide en moins d'une minute. Il ne vous rencontrera jamais si cette minute se passe mal.",
        ],
        items: [
          "Le site met cinq secondes à s'afficher, et il est déjà reparti.",
          "Il est illisible sur téléphone, alors que c'est de là que viennent la plupart des visites.",
          "Il ne donne ni prix, ni zone d'intervention, ni moyen simple d'appeler.",
          "Il ressemble au site de trois concurrents, parce qu'il vient du même modèle acheté.",
          "Il n'apparaît nulle part sur Google quand on tape le métier plus « Nantes ».",
        ],
      },
      {
        kind: 'deliver',
        label: 'Ce que je livre',
        h2: 'Un site fait pour être <span class="text-accent">trouvé, lu et utilisé.</span>',
        items: [
          { t: 'Un design qui vous appartient', d: "Aucun modèle acheté. Une direction artistique construite à partir de votre métier, de vos clients et de ce qui vous distingue de la boîte d'en face." },
          { t: "Pensé pour le téléphone d'abord", d: "Le mobile représente l'essentiel du trafic local. Je dessine l'écran de téléphone avant l'écran d'ordinateur, pas l'inverse." },
          { t: 'Rapide, vraiment', d: "Un site lent perd des visiteurs et perd des positions. Je vise moins de deux secondes d'affichage sur une connexion mobile ordinaire." },
          { t: 'Le référencement technique intégré', d: "Structure des pages, balises, données structurées, plan du site, indexation, version mobile. La base sans laquelle rien ne remonte." },
          { t: 'Modifiable par vous', d: "Une interface simple pour changer vos textes, vos photos, vos horaires ou vos tarifs, sans m'appeler. Formation en visio à la livraison." },
          { t: 'Les textes compris', d: "Si vous n'avez ni contenu ni photos, c'est prévu dans le cadrage. J'écris, j'organise, vous validez." },
        ],
      },
      {
        kind: 'prose',
        alt: true,
        label: 'La différence',
        h2: 'Le dessin et le code, <span class="text-accent">par la même personne.</span>',
        paragraphs: [
          "Dans la plupart des agences, un designer dessine et un développeur construit. Entre les deux, il y a un chef de projet, des allers-retours, et des maquettes qui deviennent infaisables une fois arrivées en développement. Vous payez cet intermédiaire, et vous payez aussi le malentendu.",
          "Ici, il n'y a personne entre les deux. Je ne dessine jamais un écran que je ne saurais pas construire. Ce que vous validez en maquette est exactement ce que vous recevez.",
          "Concrètement : vous expliquez votre métier une fois, vous avez un seul numéro à appeler, et le budget part dans le produit plutôt que dans la structure.",
        ],
      },
      {
        kind: 'method',
        label: 'Le déroulé',
        h2: 'Quatre étapes, <span class="text-accent">deux heures de votre part.</span>',
        steps: [
          { t: 'On cadre', d: "Un atelier d'une heure. Vos objectifs, vos clients, ce que vous voulez qu'il se passe sur le site. On construit le plan ensemble." },
          { t: 'Je dessine', d: "Les maquettes complètes, écran par écran. Vous validez avant qu'une ligne de code ne soit écrite." },
          { t: 'Je construis', d: "Le site est développé et testé sur tous les supports. Vous suivez l'avancement sur un lien privé." },
          { t: 'On met en ligne', d: "Mise en service, prise en main en visio, un mois de suivi inclus." },
        ],
      },
      {
        kind: 'pricing',
        label: 'Budget',
        h2: 'Combien coûte un site internet <span class="text-accent">à Nantes ?</span>',
        tiers: [
          { name: "Site vitrine d'une page", price: 'dès 900 €', desc: "Design sur mesure, mobile, mise en ligne. Livré en 1 à 2 semaines." },
          { name: 'Site multi-pages', price: 'dès 2 500 €', desc: "Architecture complète, référencement technique, animations. Livré en 4 à 6 semaines." },
          { name: 'Avec réservation ou espace client', price: 'sur devis', desc: "Selon les fonctionnalités à construire et les outils à connecter." },
        ],
        notes: [
          { t: 'Ce qui fait varier le devis', d: "Le nombre de pages, la présence d'une réservation ou d'un paiement, et si les textes et photos sont à créer de zéro." },
          { t: 'Les deux postes annexes', d: "Le nom de domaine, autour de 12 € par an, et l'hébergement, de 0 à 15 € par mois. Vous les payez en direct, à votre nom, sans marge de ma part." },
          { t: 'Étalement', d: "Paiement en trois fois sans frais, réparti entre la commande, la validation des maquettes et la mise en ligne." },
        ],
        cta: 'Estimer mon projet en 30 secondes',
      },
      {
        kind: 'prose',
        label: "Zone d'intervention",
        h2: 'Où <span class="text-accent">j’interviens.</span>',
        paragraphs: [
          "Je me déplace volontiers pour l'atelier de cadrage sur Nantes et sa périphérie : Carquefou, La Chapelle-sur-Erdre, Sucé-sur-Erdre, Nort-sur-Erdre, Treillières, Orvault, Saint-Herblain, Vertou et Ancenis.",
          "Pour le reste de la France, tout se fait en visio. Une bonne partie des projets se déroule sans qu'on se soit rencontrés, et ça fonctionne très bien.",
        ],
      },
      {
        kind: 'faq',
        label: 'Questions fréquentes',
        h2: 'Ce qu’on me demande <span class="text-accent">à Nantes.</span>',
        items: [
          ['Combien de temps pour créer un site internet ?',
           "Une à deux semaines pour un site d'une page, quatre à six semaines pour un site complet. Le délai est écrit sur le devis, et un retard de mon fait ne vous est pas facturé."],
          ['Vous vous déplacez sur Nantes ?',
           "Oui, pour l'atelier de cadrage et pour la formation à la livraison si vous le souhaitez. Le reste se fait à distance, ce qui va plus vite pour tout le monde."],
          ['Est-ce que je serai bien référencé sur Google ?',
           "Le référencement technique est inclus : votre site sera propre, rapide et correctement indexé. Pour ranker sur « votre métier + Nantes », il faut en plus du contenu et une fiche Google Business bien tenue. Je vous explique comment pendant l'appel, et je peux m'en charger si vous préférez."],
          ["Mon site m'appartiendra ?",
           "Entièrement. Code, design, domaine, hébergement, accès : tout est à votre nom dès la mise en ligne. Aucun abonnement, aucune dépendance au studio."],
          ['Vous travaillez avec quelles technologies ?',
           "Des technologies standards et documentées, pas un système maison. Si vous voulez confier la suite à quelqu'un d'autre un jour, n'importe quel développeur peut reprendre le travail."],
          ["J'ai déjà un site, faut-il tout refaire ?",
           "Pas forcément. Voyez la page consacrée à la refonte, ou parlons-en pendant l'appel gratuit. Je vous dirai si une reprise suffit, même si la réponse est de garder votre site actuel."],
        ],
      },
      {
        kind: 'links',
        label: 'Les autres prestations',
        h2: 'Selon <span class="text-accent">votre besoin.</span>',
        items: [
          { tag: 'Prestation', href: '/creation-site-ecommerce-nantes', title: 'Site e-commerce à Nantes', desc: "Si vous voulez vendre en ligne plutôt qu'être contacté." },
          { tag: 'Prestation', href: '/refonte-site-internet', title: 'Refonte de site internet', desc: "Si un site existe déjà et qu'il ne vous ressemble plus." },
          { tag: 'Prestation', href: '/creation-site-internet-artisan', title: 'Site internet pour artisan', desc: "Si vous êtes du bâtiment ou de l'artisanat." },
        ],
      },
      {
        kind: 'cta',
        h2: 'Vingt minutes pour savoir <span class="text-accent">ce que vaut votre projet.</span>',
        paragraphs: [
          "On parle de votre activité, de ce que vous attendez du site et de votre budget. Je vous dis ce que je ferais, ce que ça coûte et combien de temps ça prend.",
          "Vous repartez avec une recommandation claire, même si vous décidez de ne pas travailler avec moi.",
        ],
        primary: { label: 'Écrire au studio', href: '/#contact' },
        secondary: { label: 'Voir la grille tarifaire', href: '/#tarifs' },
        note: 'Réponse sous 24 h ouvrées.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 4 — E-COMMERCE. Intention transactionnelle : « je veux vendre en ligne ».
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'creation-site-ecommerce-nantes',
    footerLabel: 'Site e-commerce',
    title: 'Création de site e-commerce à Nantes · Studio Skøne',
    description: "Création de boutiques en ligne à Nantes : Shopify ou sur mesure. Fiches produits, paiement, livraison, et une prise en main que vous maîtrisez. Dès 3 000 €.",
    serviceName: 'Création de site e-commerce à Nantes',
    serviceType: 'Création de boutique en ligne',
    geo: true,
    areaServed: [{ type: 'City', name: 'Nantes' }, { type: 'Country', name: 'France' }],
    breadcrumb: [{ name: 'Site e-commerce à Nantes', url: '/creation-site-ecommerce-nantes' }],

    h1: 'Création de site e-commerce <span class="text-accent">à Nantes</span>',
    lead: "Une boutique en ligne qui vend, pas un catalogue en ligne. Fiches produits, paiement, livraison, gestion des stocks : je conçois et je développe l'ensemble, et je vous forme à le piloter seul. Dès 3 000 €.",
    ctas: [
      { label: 'Estimer ma boutique', href: '/#estimator' },
      { label: 'Voir une marque construite', href: '/projets/m-bivouak' },
    ],
    proof: ['Devis gratuit', 'Formation au back-office comprise', 'Un mois de suivi après ouverture'],

    blocks: [
      {
        kind: 'problem',
        label: 'Le vrai sujet',
        h2: 'Une boutique se perd rarement sur le design. <span class="text-accent">Elle se perd sur le parcours.</span>',
        intro: [
          "La plupart des boutiques qui ne vendent pas sont jolies. Ce qui les tue est ailleurs, et c'est presque toujours la même chose :",
        ],
        items: [
          "Les frais de port apparaissent à la dernière étape, et le panier est abandonné là.",
          "Les fiches produits décrivent le produit au lieu de lever les doutes de l'acheteur.",
          "Il faut créer un compte avant de pouvoir payer.",
          "Le tunnel d'achat fait cinq étapes sur mobile, là où trois suffisent.",
          "Le back-office est si pénible que vous n'ajoutez plus de produits.",
        ],
        turn: 'Vendre en ligne, c’est enlever<br><span class="probleme-turn-accent">des obstacles un par un.</span>',
      },
      {
        kind: 'deliver',
        label: 'Ce que je livre',
        h2: 'Une boutique complète, <span class="text-accent">prête à encaisser.</span>',
        items: [
          { t: 'Le choix de la bonne base', d: "Shopify quand vous voulez de la simplicité, de la fiabilité et une gestion sans technique. Sur mesure quand votre modèle ne rentre pas dans les cases. Je vous dis lequel des deux vous convient pendant l'appel, sans intérêt à vous vendre l'un plutôt que l'autre." },
          { t: 'Des fiches produits qui répondent aux objections', d: "Photos, description, ce que ça règle, en combien de temps c'est livré, ce qui se passe si ça ne va pas. La fiche produit est votre vendeur." },
          { t: "Un tunnel d'achat court", d: "Paiement invité, frais de port annoncés tôt, moins d'étapes sur mobile. Chaque étape supprimée est du chiffre d'affaires récupéré." },
          { t: 'Paiement, livraison, stocks', d: "Carte bancaire, paiement en plusieurs fois si besoin, transporteurs, points relais, gestion des stocks et courriels automatiques de suivi de commande." },
          { t: 'Un back-office que vous maîtrisez', d: "Ajouter un produit, changer un prix, lancer une promo, éditer une facture. Formation en visio à la livraison, guide écrit fourni." },
          { t: 'Le référencement des catégories et des produits', d: "Structure, balises, données structurées produit pour apparaître avec le prix et la disponibilité directement dans Google." },
        ],
      },
      {
        kind: 'prose',
        alt: true,
        label: 'La différence',
        h2: 'Celui qui dessine le panier <span class="text-accent">est celui qui le code.</span>',
        paragraphs: [
          "Sur une boutique, chaque détail d'interface a une conséquence directe sur le chiffre. Un bouton mal placé, une étape de trop, une image qui charge lentement : ce sont des ventes perdues, et elles sont mesurables.",
          "Quand le dessin et le code sont séparés, ces détails passent entre les mailles. Ici, ils ne passent pas : je construis ce que je dessine, et je peux corriger un parcours en une heure au lieu d'ouvrir un ticket.",
        ],
      },
      {
        kind: 'method',
        label: 'Le déroulé',
        h2: 'Du catalogue <span class="text-accent">à la première commande.</span>',
        steps: [
          { t: 'On cadre le catalogue', d: "Vos produits, vos variantes, vos frais de port, vos zones de livraison, votre logistique. C'est cette étape qui détermine tout le reste." },
          { t: 'Je dessine le parcours', d: "De la page d'accueil à la confirmation de commande. Vous validez chaque écran, y compris le tunnel de paiement." },
          { t: "Je construis et j'intègre", d: "Boutique, paiement, transporteurs, courriels automatiques. Commandes de test de bout en bout." },
          { t: 'On ouvre', d: "Mise en ligne, formation au back-office, un mois de suivi. On vérifie ensemble les premières vraies commandes." },
        ],
      },
      {
        kind: 'pricing',
        label: 'Budget',
        h2: 'Trois formats, <span class="text-accent">selon votre catalogue.</span>',
        tiers: [
          { name: 'Boutique essentielle', price: 'dès 3 000 €', desc: "Jusqu'à 30 produits, design sur mesure, paiement, livraison, formation. Livrée en 4 à 6 semaines." },
          { name: 'Boutique complète', price: 'dès 5 000 €', desc: "Catalogue large, variantes, promotions, comptes clients, automatisations marketing, structure pensée pour le référencement." },
          { name: 'Sur mesure', price: 'sur devis', desc: "Abonnements, ventes privées, place de marché, connexion à votre logiciel de gestion." },
        ],
        notes: [
          { t: 'Ce qui pèse dans le devis', d: "Le nombre de produits et de variantes, la complexité de la livraison, et la reprise éventuelle d'un catalogue existant." },
          { t: 'Les coûts récurrents', d: "L'abonnement Shopify démarre autour de 30 € par mois, auxquels s'ajoutent les commissions bancaires. Vous les payez en direct, sans marge de ma part." },
          { t: 'Ce que je ne fais pas', d: "Les photos produits ne sont pas mon métier. Je peux vous orienter vers un photographe, et je vous dis précisément quels cadrages et quels formats il me faut." },
        ],
        cta: 'Estimer ma boutique',
      },
      {
        kind: 'links',
        label: 'À regarder',
        h2: 'Une marque menée <span class="text-accent">de bout en bout.</span>',
        items: [
          { tag: 'Projet de studio', href: '/projets/m-bivouak', title: 'M.Bivouak', desc: "Ma propre marque outdoor : le nom, l'identité, les visuels et la boutique Shopify. Y compris ce que son arrêt m'a appris sur l'acquisition." },
          { tag: 'Prestation', href: '/creation-site-internet-nantes', title: 'Création de site internet à Nantes', desc: "Si vous cherchez à être contacté plutôt qu'à vendre en ligne." },
        ],
      },
      {
        kind: 'faq',
        label: 'Questions fréquentes',
        h2: 'Ce qu’on me demande <span class="text-accent">avant d’ouvrir.</span>',
        items: [
          ['Shopify ou site sur mesure ?',
           "Shopify si vous voulez vendre vite, sans vous occuper de la technique, et que votre modèle est classique. Sur mesure si vous avez des règles particulières comme des abonnements, un configurateur ou une connexion à un logiciel métier, ou si les commissions de plateforme deviennent lourdes à votre volume."],
          ['Combien coûte Shopify tous les mois ?',
           "L'abonnement démarre autour de 30 € par mois, plus les frais de transaction. Vous payez Shopify en direct. C'est un coût récurrent à intégrer dès le départ dans votre calcul."],
          ['Je pourrai ajouter mes produits moi-même ?',
           "Oui, c'est même le but. Vous ajoutez un produit, changez un prix ou lancez une promotion sans m'appeler. Je vous forme en visio et je vous laisse un guide."],
          ['Vous gérez la reprise de mon catalogue existant ?',
           "Oui. Import des produits, des clients et des commandes depuis votre boutique actuelle, avec les redirections pour ne pas perdre votre référencement."],
          ['Est-ce que vous faites aussi les photos produits ?',
           "Non, ce n'est pas mon métier. Je peux vous orienter vers un photographe, et je vous dis précisément quels cadrages et quels formats il me faut."],
          ['En combien de temps ma boutique peut-elle ouvrir ?',
           "Quatre à six semaines pour une boutique essentielle, à condition d'avoir les visuels et les informations produits. C'est presque toujours le catalogue qui fixe le rythme, pas le développement."],
        ],
      },
      {
        kind: 'cta',
        h2: 'Parlons de <span class="text-accent">ce que vous vendez.</span>',
        paragraphs: [
          "Vingt minutes pour comprendre votre catalogue, votre logistique et votre marge. Je vous dis quelle base choisir, ce que ça coûte, et ce que ça demande de votre côté. Même si vous décidez de partir seul sur Shopify.",
        ],
        primary: { label: 'Écrire au studio', href: '/#contact' },
        secondary: { label: 'Estimer ma boutique', href: '/#estimator' },
        note: 'Réponse sous 24 h ouvrées.',
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 5 — APPLICATION MOBILE. Intention nationale, pas locale.
  // Volontairement non géolocalisée : « création application mobile Nantes »
  // a un volume marginal, et l'intention est nationale.
  // ══════════════════════════════════════════════════════════════════════════
  {
    slug: 'creation-application-mobile',
    footerLabel: 'Application mobile',
    title: "Création d'application mobile iOS et Android · Skøne",
    description: "Conception et développement d'applications mobiles iOS et Android, du premier écran à la publication sur les stores. Design et code par la même personne. Sur devis.",
    serviceName: "Création d'application mobile iOS et Android",
    serviceType: "Développement d'application mobile",
    geo: false,
    areaServed: [{ type: 'Country', name: 'France' }],
    breadcrumb: [{ name: 'Application mobile', url: '/creation-application-mobile' }],

    h1: 'Création d’applications mobiles <span class="text-accent">iOS et Android</span>',
    lead: "Du premier écran jusqu'à la publication sur l'App Store et le Play Store. Une interface conçue pour le pouce, pas un site web rétréci. Conception et développement par la même personne.",
    ctas: [
      { label: 'Parler de mon projet', href: '/#contact' },
      { label: 'Voir les applications', href: '/#work' },
    ],
    proof: ['Cadrage produit facturé, périmètre écrit', 'Prototype sur votre téléphone', 'Le code source est à vous'],

    blocks: [
      {
        kind: 'problem',
        label: 'Ce qui fait échouer',
        h2: 'La plupart des projets d’app <span class="text-accent">meurent avant le store.</span>',
        intro: ["Trois causes reviennent tout le temps, et aucune n'est technique."],
        items: [
          "Le périmètre a doublé en cours de route. On a voulu tout mettre dans la version 1, le budget a explosé, et rien n'est sorti.",
          "L'interface a été dessinée comme un site web, puis adaptée. Sur téléphone, ça se voit immédiatement, et les gens désinstallent.",
          "Personne n'avait anticipé la publication. Les règles d'Apple et de Google sont strictes, et une app refusée peut perdre des semaines.",
        ],
        turn: 'Un projet mobile réussi,<br><span class="probleme-turn-accent">c’est d’abord un périmètre tenu.</span>',
      },
      {
        kind: 'deliver',
        label: 'Ce que je livre',
        h2: 'De l’idée <span class="text-accent">au store.</span>',
        items: [
          { t: 'Le cadrage produit', d: "On définit ensemble ce qui entre dans la version 1 et, surtout, ce qui n'y entre pas. C'est l'étape qui sauve les budgets." },
          { t: "La conception d'interface", d: "Chaque écran, chaque état, chaque transition. Pensé pour une main, un pouce, et une connexion parfois mauvaise." },
          { t: 'Le développement iOS et Android', d: "Une seule base de code pour les deux plateformes. Deux fois moins cher à construire et à faire évoluer que deux applications séparées." },
          { t: 'La publication sur les stores', d: "Comptes développeur, fiches, visuels, textes, respect des règles Apple et Google, gestion des allers-retours de validation." },
          { t: 'La partie serveur', d: "Base de données, comptes utilisateurs, back-office d'administration. C'est souvent la moitié du travail, et c'est inclus dans le cadrage." },
          { t: 'Les mises à jour', d: "Une app n'est jamais finie. Je reste disponible pour les évolutions et pour suivre les nouvelles versions d'iOS et d'Android." },
        ],
      },
      {
        kind: 'prose',
        alt: true,
        label: 'La différence',
        h2: 'Le mobile ne pardonne pas <span class="text-accent">l’approximation.</span>',
        paragraphs: [
          "Sur un écran de six pouces, il n'y a pas de place pour rattraper une erreur de conception. Un menu mal pensé, une transition qui saute, un formulaire trop long : l'utilisateur ferme et n'ouvre plus jamais l'application.",
          "Quand la même personne dessine et développe, ces arbitrages se prennent en direct, avec l'appareil en main, pas dans un fichier de maquette. Je teste sur un vrai téléphone à chaque étape.",
        ],
      },
      {
        kind: 'method',
        label: 'Le déroulé',
        h2: 'Cinq étapes, <span class="text-accent">un périmètre écrit.</span>',
        steps: [
          { t: 'Cadrage produit', d: "Deux ateliers. Le problème que l'app résout, les utilisateurs, les fonctions de la version 1. On sort avec un périmètre écrit et un budget." },
          { t: 'Conception', d: "Parcours puis maquettes haute fidélité, écran par écran. Vous manipulez un prototype cliquable sur votre téléphone avant tout développement." },
          { t: 'Développement', d: "Construction par blocs livrés au fil de l'eau. Vous installez les versions de test sur votre téléphone et vous suivez l'avancement pour de vrai." },
          { t: 'Publication', d: "Préparation des fiches, envoi aux stores, gestion des retours de validation, mise en ligne." },
          { t: 'Suivi', d: "Corrections, ajustements, évolutions au fil des retours de vos utilisateurs." },
        ],
      },
      {
        kind: 'pricing',
        label: 'Budget',
        h2: 'Combien coûte <span class="text-accent">une application mobile ?</span>',
        tiers: [
          { name: 'Cadrage produit', price: 'sur devis, court', desc: "Un périmètre, des maquettes et un devis ferme. Vous restez libre de faire développer ailleurs ensuite." },
          { name: 'Première version', price: 'à partir de 6 000 €', desc: "Une application resserrée, publiée sur les deux stores, mise entre les mains de vrais utilisateurs." },
          { name: 'Plateforme complète', price: 'sur devis', desc: "Comptes, paiements, notifications, synchronisation hors ligne, connexion à des systèmes existants." },
        ],
        notes: [
          { t: 'Pourquoi la fourchette est large', d: "Toute personne qui vous annonce un prix sans avoir défini le périmètre vous vend un devis qui bougera. Le cadrage existe pour transformer une fourchette en chiffre." },
          { t: 'Ce qui pèse le plus', d: "Les comptes utilisateurs, les paiements, les notifications, la synchronisation hors ligne, et la connexion à des systèmes existants." },
          { t: 'Les comptes développeur', d: "À prévoir en plus : le compte Apple à 99 $ par an et le compte Google Play à 25 $ une seule fois. Ils sont ouverts à votre nom." },
        ],
        cta: 'Parler de mon application',
      },
      {
        kind: 'links',
        label: 'À regarder',
        h2: 'Trois applications, <span class="text-accent">trois partis pris.</span>',
        items: [
          { tag: 'Projet de studio', href: '/projets/giftmatch', title: 'GiftMatch', desc: "Transformer trois mots sur une personne en cinq idées cadeaux, en dix secondes." },
          { tag: 'Projet de studio', href: '/projets/pepite', title: 'Pépite', desc: "Deux utilisateurs très différents sur le même téléphone, dont un qui ne lit pas encore." },
          { tag: 'Exercice de conception', href: '/projets/myboat', title: 'MyBoat', desc: "Connaître le prix total d'une location avant la moindre inscription." },
        ],
      },
      {
        kind: 'faq',
        label: 'Questions fréquentes',
        h2: 'Ce qu’on me demande <span class="text-accent">sur le mobile.</span>',
        items: [
          ['Combien de temps pour créer une application ?',
           "Comptez huit à seize semaines pour une première version, publication comprise. Le cadrage prend deux semaines, la conception deux à trois, le développement le reste."],
          ['iOS et Android en même temps ?',
           "Oui. Je travaille avec une base de code unique pour les deux plateformes, ce qui divise le coût par rapport à deux développements séparés, tout en gardant les codes propres à chaque système."],
          ['Faut-il commencer petit ?',
           "Presque toujours. Une première version resserrée, mise entre les mains de vrais utilisateurs, vous apprend en un mois ce que six mois de réunions ne vous diront pas. On ajoute ensuite ce qui est réellement demandé."],
          ["Et si mon application est refusée par l'App Store ?",
           "Ça arrive, et c'est prévu. Je gère les échanges avec Apple et les corrections jusqu'à la publication. Les motifs de refus sont connus, la plupart s'anticipent dès la conception."],
          ['Qui possède le code ?',
           "Vous. Le code source, les comptes stores et les accès sont à votre nom. Vous pouvez confier la suite à une autre équipe quand vous voulez."],
          ['Vous faites aussi la partie serveur ?',
           "Oui. Base de données, comptes utilisateurs, back-office d'administration. C'est souvent la moitié du travail, et c'est compris dans le cadrage."],
        ],
      },
      {
        kind: 'cta',
        h2: 'Racontez-moi <span class="text-accent">votre application.</span>',
        paragraphs: [
          "Trente minutes pour comprendre ce que vous voulez construire, pour qui, et avec quel budget. Je vous dis franchement si le projet tient la route, ce qu'il faut retirer de la version 1, et ce que ça représente.",
        ],
        primary: { label: 'Écrire au studio', href: '/#contact' },
        secondary: { label: 'Voir les réalisations', href: '/#work' },
        note: 'Réponse sous 24 h ouvrées.',
      },
    ],
  },
]
