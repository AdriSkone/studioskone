/**
 * Contenu des neuf pages projet.
 *
 * Extrait des pages elles-mêmes, jamais retapé : le copy y est donc au
 * caractère près. Les `head` sont conservés tels quels dans
 * contenu/heads/, ce qui garantit qu'aucune balise SEO ne bouge — personne
 * ne les réécrit, ils sont relus.
 */

export const pagesProjet = {
  "archeon": {
    "titre": "Archéon",
    "badge": "Portfolio",
    "type": "Portfolio &amp; site vitrine · cabinet d'architecture",
    "desc": "Archéon est un cabinet d'architecture reconnu dont le portfolio existant ne reflétait ni la qualité ni la singularité de leurs réalisations. Un nouveau site s'imposait : simple, beau, à la hauteur de leur travail.",
    "heroImg": "/work/archeon.png",
    "heroAlt": "Archéon · portfolio cabinet d'architecture",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/archeon-hero-desktop.png",
        "alt": "Archéon · page d'accueil, hero desktop",
        "label": "Accueil",
        "large": true
      },
      {
        "src": "/work/archeon-mobile.png",
        "alt": "Archéon · version mobile",
        "label": "Mobile",
        "large": false
      },
      {
        "src": "/work/archeon-contact.png",
        "alt": "Archéon · section contact",
        "label": "Contact",
        "large": false
      },
      {
        "src": "/work/archeon-agence.png",
        "alt": "Archéon · page agence",
        "label": "Agence",
        "large": false
      },
      {
        "src": "/work/archeon-projets.png",
        "alt": "Archéon · section projets",
        "label": "Projets",
        "large": false
      }
    ],
    "testiBadge": "Exercice de conception",
    "testiNote": "Pas de client sur ce projet. Le brief que je me suis donné : un portfolio d'agence d'architecture où l'on comprend un projet en quelques secondes, sans texte d'intention. Ce que je voulais résoudre : les sites d'agences ouvrent presque tous sur une page « philosophie » alors que le visiteur vient voir des bâtiments.",
    "testiSign": "Studio Skøne · Démo sectorielle",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Mockups &amp; Écrans",
    "contextes": [
      "Archéon avait un site daté qui ne mettait pas en valeur la richesse de leur portfolio. Les projets s'y perdaient dans une navigation confuse, sans hiérarchie visuelle ni mise en scène des réalisations.",
      "J'ai repensé l'architecture d'information autour du portfolio, avec une grille de projets épurée et des fiches détaillées. Direction artistique sobre, typographie soignée. Chaque projet a enfin la place qu'il mérite."
    ]
  },
  "cafeo": {
    "titre": "ele · Ateliers Caféologie",
    "badge": "Site web",
    "type": "Site web &amp; identité visuelle",
    "desc": "ele organise des ateliers de dégustation de café de spécialité. Ils voulaient un site qui rende la précision et le côté sensoriel de leurs ateliers, porté par une identité visuelle cohérente.",
    "heroImg": "/work/cafeo.webp",
    "heroAlt": "ele Ateliers Caféologie · site web et identité visuelle",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/cafeo.webp",
        "alt": "ele · page d'accueil",
        "label": "Accueil",
        "large": true
      },
      {
        "src": "/work/cafeo-story-modal.webp",
        "alt": "ele · modale de lecture des stories",
        "label": "Story",
        "large": false
      },
      {
        "src": "/work/cafeo-stories.webp",
        "alt": "ele · section stories « En Coulisses »",
        "label": "En coulisses",
        "large": false
      },
      {
        "src": "/work/cafeo-booking-1.webp",
        "alt": "ele · réservation étape 1, participants",
        "label": "Participants",
        "large": false
      },
      {
        "src": "/work/cafeo-booking-2.webp",
        "alt": "ele · réservation étape 2, récapitulatif &amp; paiement",
        "label": "Paiement",
        "large": false
      },
      {
        "src": "/work/cafeo-booking-3.webp",
        "alt": "ele · réservation étape 3, confirmation",
        "label": "Confirmation",
        "large": false
      }
    ],
    "testiBadge": "Projet client",
    "testiNote": "Projet client, livré et pas encore en ligne : il n'y a donc pas encore d'avis à afficher. Le besoin : construire l'identité complète d'un atelier de dégustation de café et la faire vivre sur un site, sans tomber dans les codes attendus du secteur.",
    "testiSign": "Studio Skøne · Mise en ligne à venir",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Mockups &amp; Écrans",
    "contextes": [
      "ele proposait des ateliers haut de gamme autour du café de spécialité, mais leur présence digitale ne reflétait pas leur niveau d'exigence. L'enjeu était de créer une identité visuelle cohérente et un site qui convertit les curieux en participants.",
      "J'ai développé l'identité visuelle complète (typographie, palette, iconographie) puis le site web en parallèle, pour garantir une cohérence totale entre la marque et son expression digitale."
    ]
  },
  "garantibox": {
    "titre": "Garantibox",
    "badge": "Web App SaaS",
    "type": "Application SaaS · garanties &amp; factures",
    "desc": "Garantibox voulait lancer un SaaS qui réunit toutes les garanties et factures de ses utilisateurs au même endroit. Fini les tickets de caisse perdus : on retrouve un justificatif en deux secondes et on sait quand chaque garantie expire.",
    "heroImg": "/work/garantibox.png",
    "heroAlt": "Garantibox · application SaaS pour centraliser garanties et factures",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/garantibox-garanties.png",
        "alt": "Garantibox · écran de gestion des garanties",
        "label": "Garanties",
        "large": true
      },
      {
        "src": "/work/garantibox-mobile.png",
        "alt": "Garantibox · version mobile",
        "label": "Mobile",
        "large": false
      },
      {
        "src": "/work/garantibox-facture.png",
        "alt": "Garantibox · détail d'une facture",
        "label": "Facture",
        "large": true
      },
      {
        "src": "/work/garantibox.png",
        "alt": "Garantibox · tableau de bord",
        "label": "Dashboard",
        "large": false
      }
    ],
    "testiBadge": "Exercice de conception",
    "testiNote": "Pas de client sur ce projet. Le brief que je me suis donné : une application où l'on enregistre sa première facture en moins d'une minute, sans tutoriel, sans compte à créer d'abord. Ce que je voulais résoudre : les applications de rangement de documents meurent toutes de la même chose, la première saisie est trop pénible pour qu'il y en ait une deuxième.",
    "testiSign": "Studio Skøne · Démo sectorielle",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Mockups &amp; Écrans",
    "contextes": [
      "Quand on achète un appareil, la garantie et la facture finissent vite au fond d'un tiroir ou perdues dans une boîte mail. Garantibox voulait régler ça : un seul endroit où l'utilisateur ajoute ses produits, garde ses justificatifs et reçoit une alerte avant la fin de chaque garantie.",
      "J'ai conçu l'architecture d'information, dessiné les écrans sur Figma et développé l'interface complète, du dashboard à la version mobile. L'ajout d'un produit prend quelques secondes, photo de la facture comprise."
    ]
  },
  "giftmatch": {
    "titre": "GiftMatch",
    "badge": "App mobile",
    "type": "App mobile d'idées cadeaux par IA",
    "desc": "GiftMatch génère des idées cadeaux par IA. On décrit la personne en quelques mots, on choisit l'occasion et le budget, et l'app propose cinq idées en quelques secondes, chacune avec son prix et où l'acheter.",
    "heroImg": "/work/giftmatch.png",
    "heroAlt": "GiftMatch · écran d'accueil « Offrir juste. »",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/giftmatch.png",
        "alt": "GiftMatch · onboarding avec la sphère terracotta",
        "label": "Onboarding",
        "large": false
      },
      {
        "src": "/work/giftmatch-input.png",
        "alt": "GiftMatch · saisie de l'occasion, de la personne et du budget",
        "label": "Saisie",
        "large": false
      },
      {
        "src": "/work/giftmatch-loading.png",
        "alt": "GiftMatch · écran de recherche animé pendant la génération des idées",
        "label": "Recherche",
        "large": false
      },
      {
        "src": "/work/giftmatch-results.png",
        "alt": "GiftMatch · cinq idées cadeaux avec leur niveau d'accord",
        "label": "Résultats",
        "large": false
      },
      {
        "src": "/work/giftmatch-detail.png",
        "alt": "GiftMatch · détail d'une idée cadeau et où l'acheter",
        "label": "Détail",
        "large": false
      }
    ],
    "testiBadge": "Projet de studio",
    "testiNote": "Né d'un besoin réel : je sèche systématiquement sur les cadeaux. J'ai construit une app qui transforme trois mots sur une personne en cinq propositions concrètes, en faisant le pari qu'une bonne idée vaut mieux qu'un catalogue de mille produits.",
    "testiSign": "Studio Skøne · Produit maison",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Écrans de l'app",
    "contextes": [
      "Offrir un cadeau, c'est souvent la galère : on sèche, on repousse, et on prend la carte cadeau par défaut. GiftMatch s'attaque à ce moment-là. On décrit la personne en trois mots et on récupère des pistes qui tiennent la route, avec un prix et une adresse pour acheter.",
      "L'app est en React Native (Expo). L'IA tourne derrière un proxy : la clé API reste sur le serveur et ne se retrouve jamais dans le code de l'app. Les réponses arrivent en JSON structuré, donc affichables directement sans retouche. Côté design, un dark mode chaud et une petite sphère terracotta qui sert de repère."
    ]
  },
  "m-bivouak": {
    "titre": "M.Bivouak",
    "badge": "Branding &amp; e-commerce",
    "type": "Identité de marque + boutique Shopify",
    "desc": "M.Bivouak est une marque de vêtements outdoor imprimés en France. L'idée : porter l'esprit du bivouac au quotidien. On voulait une identité qui sente le grand air et une boutique simple, sans fioritures.",
    "heroImg": "/work/mbivouak.png",
    "heroAlt": "M.Bivouak · boutique Shopify de vêtements outdoor",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/mbivouak.png",
        "alt": "M.Bivouak · page d'accueil",
        "label": "Accueil",
        "large": true
      },
      {
        "src": "/work/mbivouak-produit.png",
        "alt": "M.Bivouak · fiche produit",
        "label": "Fiche produit",
        "large": false
      },
      {
        "src": "/work/crop-desktop-section-lifestyle.jpg",
        "alt": "M.Bivouak · section lifestyle « Pour ceux qui bivouaquent »",
        "label": "Lifestyle",
        "large": false
      },
      {
        "src": "/work/crop-mobile-hero.jpg",
        "alt": "M.Bivouak · accueil version mobile",
        "label": "Mobile",
        "large": false
      }
    ],
    "testiBadge": "Projet de studio",
    "testiNote": "Ma propre marque. Je l'ai créée de bout en bout : le nom, l'identité, le ton, les visuels produits et la boutique Shopify, sur un modèle d'impression à la demande en coton bio imprimé en France. La marque est aujourd'hui fermée, faute d'avoir trouvé son marché. Elle reste le meilleur exemple de ce que je sais faire quand je porte à la fois la marque, le design et la technique.",
    "testiSign": "Studio Skøne · Marque maison",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Mockups &amp; Écrans",
    "contextes": [
      "Lancer une marque outdoor, c'est arriver dans un univers déjà saturé de codes : montagnes stylisées, palettes terreuses, slogans d'aventure à la pelle. M.Bivouak voulait y exister sans ressembler à tout le monde. D'où une voix honnête et complice, un peu décalée, mais jamais potache.",
      "J'ai construit toute l'identité (logo, palette, typographies, ton de marque) autour de la signature « Nulle part. Partout. ». Puis je l'ai déclinée sur une boutique Shopify épurée : zéro arrondi, zéro ombre, des photos pleine largeur et un tunnel d'achat direct, pensé pour la production à la demande, imprimée en France."
    ]
  },
  "merel-et-fils": {
    "titre": "Mérel &amp; Fils",
    "badge": "Site web",
    "type": "Site vitrine · ébénisterie d'art",
    "desc": "Mérel &amp; Fils est un atelier d'ébénisterie imaginé de toutes pièces pour servir de démonstration. L'idée : montrer aux artisans du sur-mesure à quoi ressemble un site où la matière prend toute la place, et où le visiteur comprend le niveau de finition avant même d'avoir lu une ligne.",
    "heroImg": "/work/merel-et-fils-hero.webp",
    "heroAlt": "Mérel &amp; Fils · accueil du site, gros plan sur un rabot qui court sur une planche",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/merel-et-fils.webp",
        "alt": "Mérel &amp; Fils · pièce d'exception, escalier hélicoïdal réalisé à Nantes",
        "label": "Réalisations",
        "large": true
      },
      {
        "src": "/work/merel-et-fils-matiere.webp",
        "alt": "Mérel &amp; Fils · triptyque des essences, chêne, noyer et frêne",
        "label": "Matière",
        "large": false
      },
      {
        "src": "/work/merel-et-fils-atelier.webp",
        "alt": "Mérel &amp; Fils · section atelier, « La main avant la machine »",
        "label": "L'atelier",
        "large": false
      },
      {
        "src": "/work/merel-et-fils-contact.webp",
        "alt": "Mérel &amp; Fils · formulaire de contact avec type de projet et essence souhaitée",
        "label": "Contact",
        "large": false
      },
      {
        "src": "/work/merel-et-fils-mobile.webp",
        "alt": "Mérel &amp; Fils · accueil sur mobile",
        "label": "Mobile",
        "large": false
      }
    ],
    "testiBadge": "Exercice de conception",
    "testiNote": "Pas de client sur ce projet. Le brief que je me suis donné : un site d'atelier d'ébénisterie où la première chose que l'on voit est le bois, pas un slogan. Ce que je voulais résoudre : les artisans d'art ont un travail spectaculaire et des sites qui le cachent derrière du texte.",
    "testiSign": "Studio Skøne · Démo sectorielle",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Écrans du site",
    "contextes": [
      "Les ébénistes et menuisiers d'art ont un problème commun : leur travail se juge à la lumière, au grain, à l'ajustement d'un assemblage. Rien de tout ça ne passe dans une galerie photo classique posée sur un fond blanc. Ce site part donc de l'inverse. Le bois occupe l'écran entier, le texte se fait rare, et la navigation suit le rythme d'une visite d'atelier en fin de journée plutôt que celui d'un catalogue.",
      "Côté technique : Next.js 16 (App Router, TypeScript, Tailwind v4), GSAP et ScrollTrigger pour les apparitions, Lenis pour le défilement. L'accueil s'appuie sur une séquence de 120 images dessinées en Canvas 2D, déroulée au scroll : le geste du rabot avance à la vitesse du visiteur, sans lecteur vidéo ni librairie 3D. Les visuels sont en WebP, les animations se coupent d'elles-mêmes si le système demande moins de mouvement, et l'ensemble a été vérifié à 390, 768 et 1440 pixels de large."
    ]
  },
  "myboat": {
    "titre": "MyBoat",
    "badge": "App mobile",
    "type": "Marketplace iOS &amp; Android · achat &amp; vente de bateaux",
    "desc": "MyBoat voulait lancer une marketplace de bateaux d'occasion en France capable de rivaliser avec les grandes plateformes. De la maquette Figma au lancement sur les deux stores en 5 semaines, sans équipe externe.",
    "heroImg": "/work/myboat.webp",
    "heroAlt": "MyBoat · interface application mobile marketplace bateaux iOS Android",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/myboat.webp",
        "alt": "MyBoat · écran d'accueil",
        "label": "Accueil",
        "large": true
      },
      {
        "src": "/work/myboat-publier.png",
        "alt": "MyBoat · écran de publication d'annonce",
        "label": "Publier",
        "large": false
      },
      {
        "src": "/work/myboat-favoris.png",
        "alt": "MyBoat · écran favoris et collections",
        "label": "Favoris",
        "large": false
      },
      {
        "src": "/work/myboat-messages.png",
        "alt": "MyBoat · écran messagerie",
        "label": "Messages",
        "large": false
      }
    ],
    "testiBadge": "Exercice de conception",
    "testiNote": "Pas de client sur ce projet. Le brief que je me suis donné : concevoir un parcours de location nautique où l'on connaît le prix total, assurance et caution comprises, avant la moindre inscription. Ce que je voulais résoudre : les marketplaces nautiques demandent presque toutes un compte avant d'afficher le vrai prix, et perdent une grande partie des candidats à la réservation à cette étape précise.",
    "testiSign": "Studio Skøne · Démo sectorielle",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Mockups &amp; Écrans",
    "contextes": [
      "MyBoat souhaitait créer une marketplace mobile de bateaux d'occasion en France. Le défi était double : concevoir une expérience comparable aux grandes plateformes (géolocalisation, messagerie intégrée, gestion des annonces) tout en respectant un délai de livraison serré.",
      "J'ai pris en charge la totalité du parcours produit : architecture UX, design des écrans sur Figma, intégration sur Bubble.io, puis soumission sur l'App Store et le Google Play. Aucune équipe externe."
    ]
  },
  "pepite": {
    "titre": "Pépite",
    "badge": "App mobile",
    "type": "App mobile de récompenses familiales",
    "desc": "Pépite remet le tableau des bonnes actions sur le téléphone de la famille. Le parent crée les missions du quotidien, l'enfant les coche et gagne des étoiles, qu'il échange contre de vraies récompenses décidées à la maison. Un seul appareil, deux espaces : le parent pilote, l'enfant reçoit le téléphone pour son rituel.",
    "heroImg": "/work/pepite.webp",
    "heroAlt": "Pépite · écran de passation, « Qui joue aujourd'hui ? » avec une pastille colorée par enfant",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/pepite-accueil.webp",
        "alt": "Pépite · tableau de bord parent avec les enfants du jour et la file à valider",
        "label": "Tableau de bord",
        "large": false
      },
      {
        "src": "/work/pepite-missions.webp",
        "alt": "Pépite · liste des missions créées par le parent, avec leur valeur en étoiles",
        "label": "Mes missions",
        "large": false
      },
      {
        "src": "/work/pepite-nouvelle-mission.webp",
        "alt": "Pépite · création d'une mission, titre, icône, valeur en étoiles, fréquence et destinataire",
        "label": "Nouvelle mission",
        "large": false
      },
      {
        "src": "/work/pepite-missions-enfant.webp",
        "alt": "Pépite · missions du jour côté enfant, deux missions cochées sur trois",
        "label": "Missions du jour",
        "large": false
      },
      {
        "src": "/work/pepite-collection.webp",
        "alt": "Pépite · planche de collection où les étoiles gagnées viennent se poser",
        "label": "Ma collection",
        "large": false
      },
      {
        "src": "/work/pepite-boutique.webp",
        "alt": "Pépite · boutique de récompenses, « il te manque 10 étoiles » pour choisir le dessert",
        "label": "La boutique",
        "large": false
      }
    ],
    "testiBadge": "Projet de studio",
    "testiNote": "Né d'un besoin à la maison : les tableaux de récompenses en carton finissent tous au fond d'un tiroir. J'ai construit Pépite en faisant le pari qu'une récompense décidée ensemble vaut mieux qu'un système de points imposé.",
    "testiSign": "Studio Skøne · Produit maison, en développement",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Écrans de l'app",
    "contextes": [
      "Les tableaux à gommettes marchent bien jusqu'au jour où la feuille se décolle du frigo. Pépite reprend le principe sans en faire un compteur de points creux : une étoile vaut toujours quelque chose de réel, une sortie, le choix du dessert, un peu d'argent de poche, et c'est la famille qui fixe le prix. Le parti pris tient en trois règles. Cocher une mission fait se poser une gommette, avec son rebond et son ombre colorée, parce que c'est le geste que l'enfant vient chercher. Une mission non faite reste neutre, jamais rouge, jamais grondée, et aucun enfant n'est comparé à un autre. Enfin le code à quatre chiffres protège la sortie du mode enfant, pas l'entrée côté parent : verrouiller le chemin fréquent aurait freiné l'usage quotidien pour rien.",
      "L'app est en React Native (Expo) et TypeScript strict, avec Expo Router pour la navigation et Reanimated pour les animations d'étoiles. Tout est stocké dans une base SQLite locale : pas de compte, pas de serveur, aucune donnée d'enfant qui quitte l'appareil, ce qui simplifie l'architecture autant que ça règle la question de la conformité. La logique métier est couverte par 78 tests exécutés contre un vrai moteur SQLite en mémoire, contraintes et clés étrangères comprises. Les étoiles sont figées à l'instant du gain : changer le prix d'une mission demain ne retouche pas ce que l'enfant a déjà mérité. Côté design, un système sur mesure inspiré du cahier d'autocollants, formes très arrondies, ombres colorées plutôt que grises, base crème plutôt que blanc clinique, et un jaune réservé à l'étoile et à rien d'autre. Aucun composant n'écrit une couleur ou un rayon en dur, tout passe par des tokens."
    ]
  },
  "tasq": {
    "titre": "Tasq",
    "badge": "Web App",
    "type": "Web App de pilotage de projets freelance",
    "desc": "Tasq aide les freelances du web et créatifs à piloter leurs projets clients. L'idée : mettre le projet au centre plutôt que la facture, pour ne jamais laisser filer une relance, une livraison ou un paiement.",
    "heroImg": "/work/tasq-dashboard.webp",
    "heroAlt": "Tasq · dashboard « ce qui demande ton attention aujourd'hui »",
    "contexteTitre": "",
    "galerie": [
      {
        "src": "/work/tasq-dashboard.webp",
        "alt": "Tasq · dashboard « À traiter » avec relances et encaissements en attente",
        "label": "Dashboard",
        "large": true
      },
      {
        "src": "/work/tasq-landing.webp",
        "alt": "Tasq · landing page « Tes projets clients, enfin tous au même endroit »",
        "label": "Landing",
        "large": false
      }
    ],
    "testiBadge": "Projet de studio",
    "testiNote": "Né d'un besoin réel : mes projets, mes devis et mes relances étaient éparpillés entre trois outils et ma mémoire. J'ai construit Tasq pour les freelances qui travaillent seuls, en faisant le pari qu'un outil qui fait trois choses bien vaut mieux qu'une usine à gaz qui en fait trente.",
    "testiSign": "Studio Skøne · Produit maison",
    "ctaTitre": "Un projet similaire en tête ?",
    "ctaSub": "Premier échange gratuit, sans engagement.",
    "ctaHref": "/#contact",
    "ctaLibelle": "Démarrer un projet similaire",
    "retour": "Tous les projets",
    "labelContexte": "Contexte &amp; enjeux",
    "labelGalerie": "Mockups &amp; Écrans",
    "contextes": [
      "Quand on jongle entre plusieurs clients, on finit par tout garder dans sa tête. Et c'est là qu'une relance saute, qu'un solde traîne, qu'une révision s'endort. Le vrai concurrent de Tasq, ce n'est pas Notion, c'est justement ce « je le retiens ». Son écran d'accueil ne montre qu'une chose : ce qui demande de l'attention aujourd'hui.",
      "Côté technique : Next.js 15 (App Router) et Supabase (Postgres, Auth, sécurité par ligne). Pensé pour le desktop et pour 3 à 5 projets en parallèle, pas pour en gérer cinquante. Surtout, tout est calé sur la vitesse de saisie : mettre à jour un projet doit prendre quelques secondes, sinon on décroche. Le parti pris est clair : Tasq suit l'argent qui rentre, il ne fait pas la facturation."
    ]
  }
}
