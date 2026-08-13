# SEO local Nantes · page dédiée artisans et commerces

Date : 2026-08-13

## Contexte

Studio Skøne cible Nantes et sa périphérie, mais l'entreprise est domiciliée à
Paris. Le site ne contient aujourd'hui aucun contenu local : la géographie
n'apparaît que dans les meta de l'accueil et dans `areaServed` du JSON-LD,
modifiés le 2026-08-13.

Le portfolio ne comporte aucun client nantais. Mérel & Fils, le seul projet qui
mentionne Nantes, est un atelier d'ébénisterie fictif construit comme
démonstration. Il n'existe donc aucune référence locale à mettre en avant.

Cible retenue : **artisans et commerces locaux** (ébénistes, restaurateurs,
cavistes, salles de sport). Budget 900 à 2500€, souvent sans site ou avec un
site laissé à l'abandon. L'offre Fondation (900€, 2 à 3 semaines) correspond à
ce segment, et Mérel & Fils sert de démonstration ciblée.

## Ce que cette page ne peut pas faire

Le facteur dominant du classement sur les requêtes locales est le **Google
Business Profile**, pas le contenu du site. Tant que ce profil n'existe pas,
aucune page ne classera Studio Skøne sur « création site internet Nantes ».

Cette page est donc un socle, pas un levier immédiat. Elle sert à :

- occuper l'URL et le contenu correspondant à la requête cible ;
- offrir une destination au futur Google Business Profile ;
- prendre de l'âge, facteur qui compte en SEO local.

Les premiers contacts viendront du profil Google, pas de cette page. L'échéance
réaliste se compte en mois.

## Objectif

Publier une page qui se classe à terme sur « création site internet Nantes » et
ses variantes, et qui convertit un artisan nantais arrivé depuis Google.

Critères de réussite :

1. La page est indexée par Google (vérifiable en Search Console).
2. Un artisan qui la lit comprend le prix, le délai et le rendu sans scroller
   jusqu'au bas de page.
3. Aucune affirmation fausse : pas d'antériorité inventée, pas de faux avis,
   pas de client fictif présenté comme réel.

## Architecture

### Fichier et routing

| Élément | Valeur |
|---|---|
| Fichier | `creation-site-web-nantes.html`, à la racine |
| URL | `https://studioskone.com/creation-site-web-nantes` |
| Routing | Aucun rewrite : `cleanUrls: true` dans `vercel.json` retire le `.html` |
| Build | Nouvelle entrée `nantes` dans `rollupOptions.input` de `vite.config.ts` |
| Script | `src/local-page.ts` — réutilise le formulaire de contact et les reveals |
| Styles | `src/styles/local-page.css` — tokens existants, aucune dépendance nouvelle |

L'URL reprend la formulation de la requête cible. Moins élégante que `/nantes`,
mais alignée sur ce que les prospects tapent.

### Structure de la page

Fil conducteur : **présence physique à Nantes + prix d'artisan**. Ce sont les
deux seuls avantages réels à ce stade.

1. **Hero** — H1 « Création de site internet à Nantes ». Sous-titre sur la
   présence nantaise et le brief en présentiel.
2. **Le constat** — la situation d'un artisan nantais : site vieux de plusieurs
   années, illisible sur mobile, absent des résultats sur son métier + Nantes.
3. **Ce que tu livres** — offre Fondation, 900€, 2 à 3 semaines, design et
   développement par la même personne.
4. **La démo** — Mérel & Fils, présenté explicitement comme un atelier fictif
   créé pour montrer le rendu. Lien vers `/projets/merel-et-fils`.
5. **Comment ça se passe** — les 4 étapes du process, reprises de l'accueil.
6. **FAQ locale** — « Vous vous déplacez ? », « Je n'ai pas de logo », « Et
   après la livraison ? ». Objections réelles de ce public.
7. **Contact** — formulaire existant, lien retour vers l'accueil.

Exclusions explicites : pas de « agence web nantaise depuis X années », pas de
faux avis, pas de noms de quartiers plaqués pour densifier les mots-clés.

Ton : celui du `STYLE_GUIDE.md` et des pages projets. Phrases courtes, pas de
superlatifs, point médian plutôt que tiret cadratin. Visuel conforme aux règles
du `CLAUDE.md` : asymétrie, grain, pas de grille régulière, animations discrètes.

## SEO technique

### Meta

```
title       Création de site internet à Nantes · Studio Skøne
description Site vitrine pour artisans et commerçants nantais. Design et
            développement par la même personne, dès 900€, livré en 2 à 3 semaines.
canonical   https://studioskone.com/creation-site-web-nantes
robots      index, follow
```

Open Graph et Twitter Card sur le modèle des pages projets, avec l'image
`og-image.png` existante.

### Données structurées

Deux blocs JSON-LD :

- **`FAQPage`** sur la FAQ locale, même format que celui de l'accueil. Seul des
  deux à pouvoir produire un affichage enrichi.
- **Référence d'entité** : ajout de `"@id": "https://studioskone.com/#studio"`
  au `ProfessionalService` de l'accueil, et référence à ce même `@id` depuis la
  page Nantes. Sans cela, deux entités distinctes seraient déclarées au lieu
  d'une entreprise avec deux pages.

L'`address` reste Paris (domiciliation légale, alignée sur les mentions
légales). Nantes reste dans `areaServed`.

### Maillage interne

Lien dans le footer de l'accueil. À noter : le `<footer>` n'existe que dans
`index.html`, les 10 pages projets n'en ont pas. Le lien ne sera donc présent
que sur l'accueil, ce qui reste suffisant pour l'indexation puisque c'est la
page la plus crawlée du site.

Lien retour de la page Nantes vers l'accueil. Pas d'entrée dans la navigation
principale : le positionnement local n'est pas encore reflété par le portfolio.

### Sitemap

Ajout de `/creation-site-web-nantes`. Correction au passage de deux pages
buildées mais absentes de `sitemap.xml` : `/projets/giftmatch` et
`/projets/tasq`.

## Hors périmètre

- **Google Business Profile** — action manuelle d'Adri, impossible à automatiser,
  mais prioritaire sur tout le reste.
- **Pages métier déclinées** (`/site-internet-artisan-nantes`, etc.) — à
  envisager seulement si cette page démontre un intérêt mesurable.
- **Meta de l'accueil** — déjà traitées le 2026-08-13, non rouvertes ici.

## Vérification

- `npm run build` passe et produit `creation-site-web-nantes.html` dans `dist/`.
- Les deux blocs JSON-LD parsent, et le `@id` de la page correspond à celui de
  l'accueil.
- La page est atteignable depuis le footer de l'accueil.
- Après déploiement : soumission de l'URL en Search Console.
