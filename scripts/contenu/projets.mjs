/**
 * Les neuf projets.
 *
 * Extraits de l'accueil d'avant la refonte, pas retapés : le copy y est
 * donc au caractère près. Ajouter un projet, c'est ajouter une entrée ici
 * — les cartes de l'accueil et, à terme, les pages projet s'en servent
 * toutes les deux.
 *
 * L'ordre est celui des maquettes, et il compte : les deux projets que le
 * studio met en avant ouvrent la série.
 *
 * Le champ `grand` n'est plus lu. Il servait à donner deux formats de
 * vignette ; le style guide les veut toutes identiques, pour que la série
 * se lise comme un ensemble plutôt que comme un classement. Il est
 * conservé le temps qu'on soit sûr de ne pas y revenir.
 *
 * Une seule chose a été retirée des libellés : la flèche « → » qui était
 * écrite dans la chaîne de texte. Le cahier des charges l'interdit, parce
 * qu'un lecteur d'écran l'annonce au milieu de la phrase. Elle est
 * redessinée en SVG aria-hidden au moment du rendu.
 */

export const projets = [
  {
    slug: 'cafeo',
    titre: "ele · Ateliers Caféologie",
    badge: "Site web",
    tagline: "Une identité de torréfacteur qui se tient aussi à l'écran",
    nature: "Projet client",
    natureCle: 'client',
    note: "Projet client, livré et pas encore en ligne : il n'y a donc pas encore d'avis à afficher. Le besoin : une identité d'atelier de dégustation de café qui tienne aussi bien à l'écran qu'ailleurs, sans tomber dans les codes attendus du secteur.",
    signature: "Studio Skøne · Mise en ligne à venir",
    lienLibelle: "Voir le projet",
    image: '/work/cafeo.webp',
    alt: "Site web et identité visuelle ele · Ateliers Caféologie, réalisés par Studio Skøne",
    grand: true,
  },
  {
    slug: 'merel-et-fils',
    titre: "Mérel &amp; Fils",
    badge: "Site web",
    tagline: "Un site d'ébéniste où la matière passe avant le discours",
    nature: "Exercice de conception",
    natureCle: 'exercice',
    note: "Pas de client sur ce projet. Le brief que je me suis donné : un site d'atelier d'ébénisterie où la première chose que l'on voit est le bois, pas un slogan.",
    signature: "Studio Skøne · Démo sectorielle",
    lienLibelle: "Voir le projet",
    image: '/work/merel-et-fils-hero.webp',
    alt: "Mérel &amp; Fils · site vitrine d'un atelier d'ébénisterie d'art, accueil avec un rabot en gros plan",
    grand: true,
  },
  {
    slug: 'giftmatch',
    titre: "GiftMatch",
    badge: "App mobile",
    tagline: "Cinq idées cadeaux qui tiennent la route, en dix secondes",
    nature: "Projet de studio",
    natureCle: 'studio',
    note: "Né d'un besoin réel : je sèche systématiquement sur les cadeaux. J'ai construit une app qui transforme trois mots sur une personne en cinq propositions concrètes.",
    signature: "Studio Skøne · Produit maison",
    lienLibelle: "Voir le projet",
    image: '/work/giftmatch.png',
    alt: "GiftMatch · application mobile qui génère des idées cadeaux personnalisées par IA",
    grand: false,
  },
  {
    slug: 'myboat',
    titre: "MyBoat",
    badge: "App mobile",
    tagline: "Louer un bateau sans créer de compte pour connaître le prix",
    nature: "Exercice de conception",
    natureCle: 'exercice',
    note: "Pas de client sur ce projet. Le brief que je me suis donné : un parcours de location nautique où l'on connaît le prix total, assurance et caution comprises, avant la moindre inscription.",
    signature: "Studio Skøne · Démo sectorielle",
    lienLibelle: "Voir le projet",
    image: '/work/myboat.webp',
    alt: "MyBoat · application mobile marketplace bateaux iOS et Android",
    grand: false,
  },
  {
    slug: 'garantibox',
    titre: "Garantibox",
    badge: "Web App SaaS",
    tagline: "Ajouter sa première garantie sans avoir besoin d'explication",
    nature: "Exercice de conception",
    natureCle: 'exercice',
    note: "Pas de client sur ce projet. Le brief que je me suis donné : une application où l'on enregistre sa première facture en moins d'une minute, sans tutoriel et sans compte à créer d'abord.",
    signature: "Studio Skøne · Démo sectorielle",
    lienLibelle: "Voir le projet",
    image: '/work/garantibox.png',
    alt: "Garantibox · application SaaS pour centraliser garanties et factures",
    grand: false,
  },
  {
    slug: 'm-bivouak',
    titre: "M.Bivouak",
    badge: "Branding &amp; e-commerce",
    tagline: "Identité de marque et boutique, de la première esquisse à la première commande",
    nature: "Projet de studio",
    natureCle: 'studio',
    note: "Ma propre marque, créée de bout en bout : le nom, l'identité, le ton, les visuels produits et la boutique Shopify. Fermée depuis, faute d'avoir trouvé son marché.",
    signature: "Studio Skøne · Marque maison",
    lienLibelle: "Voir le projet",
    image: '/work/mbivouak.png',
    alt: "M.Bivouak · identité de marque outdoor et boutique Shopify",
    grand: false,
  },
  {
    slug: 'tasq',
    titre: "Tasq",
    badge: "Web App",
    tagline: "Ouvrir un seul outil le matin et savoir quoi faire",
    nature: "Projet de studio",
    natureCle: 'studio',
    note: "Né d'un besoin réel : mes projets, mes devis et mes relances étaient éparpillés entre trois outils et ma mémoire. J'ai construit Tasq pour les freelances qui travaillent seuls.",
    signature: "Studio Skøne · Produit maison",
    lienLibelle: "Voir le projet",
    image: '/work/tasq-dashboard.webp',
    alt: "Tasq · web app de pilotage de projets pour freelances du web et créatifs",
    grand: false,
  },
  {
    slug: 'archeon',
    titre: "Archéon",
    badge: "Portfolio",
    tagline: "Un portfolio d'architecte où le projet parle avant l'agence",
    nature: "Exercice de conception",
    natureCle: 'exercice',
    note: "Pas de client sur ce projet. Le brief que je me suis donné : un portfolio d'agence d'architecture où l'on comprend un projet en quelques secondes, sans texte d'intention.",
    signature: "Studio Skøne · Démo sectorielle",
    lienLibelle: "Voir le projet",
    image: '/work/archeon.png',
    alt: "Archéon · portfolio et site vitrine pour cabinet d'architecture",
    grand: false,
  },
  {
    slug: 'pepite',
    titre: "Pépite",
    badge: "App mobile",
    tagline: "Une étoile gagnée mène à une vraie récompense, décidée en famille",
    nature: "Projet de studio",
    natureCle: 'studio',
    note: "Né d'un besoin à la maison : les tableaux de récompenses en carton finissent tous au fond d'un tiroir. J'ai fait le pari qu'une récompense décidée ensemble vaut mieux qu'un système de points imposé.",
    signature: "Studio Skøne · Produit maison, en développement",
    lienLibelle: "Voir le projet",
    image: '/work/pepite.webp',
    alt: "Pépite · application mobile de récompenses familiales, écran de passation du téléphone à l'enfant",
    grand: false,
  },
]
