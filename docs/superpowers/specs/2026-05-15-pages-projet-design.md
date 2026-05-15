# Pages de détail projet — Design Spec

**Date :** 2026-05-15  
**Statut :** Approuvé  

---

## Objectif

Quand un visiteur clique sur "Voir le projet →" dans le carousel de la section `#work`, il accède à une page dédiée présentant le détail du projet : contexte, mockups, témoignage et CTA.

---

## Approche retenue : Vite MPA

Un fichier HTML par projet dans `/projets/`. Vite compile plusieurs points d'entrée. Pattern identique aux pages légales existantes (`/mentions-legales.html`, `/cgu.html`, etc.).

**URLs générées :**
```
/projets/myboat
/projets/garantibox
/projets/cafeo
/projets/niort-basket
/projets/aurem
/projets/archeon
```

**Pourquoi ce choix :**
- SEO parfait — chaque page a ses propres meta/OG tags
- URLs propres et partageables
- Conforme au pattern existant du projet
- Bouton retour navigateur natif

---

## Structure des fichiers

```
projets/                          — à la racine du projet (comme index.html)
  myboat.html
  garantibox.html
  cafeo.html
  niort-basket.html
  aurem.html
  archeon.html

src/
  projects-data.ts       — données de tous les projets (centralisées)
  projet-page.ts         — logique partagée (nav, animations, reveal)
```

Les 6 fichiers HTML partagent la même structure et chargent `projet-page.ts` via `<script type="module" src="/src/projet-page.ts">`. Le contenu spécifique à chaque projet est dans `projects-data.ts`, identifié par le `data-slug` de chaque page HTML.

### Mise à jour `vite.config.ts`

Les 6 pages sont déclarées comme points d'entrée dans `rollupOptions.input` (même pattern que `main` et `admin` existants) :

```ts
input: {
  main:          resolve(__dirname, 'index.html'),
  admin:         resolve(__dirname, 'admin.html'),
  myboat:        resolve(__dirname, 'projets/myboat.html'),
  garantibox:    resolve(__dirname, 'projets/garantibox.html'),
  cafeo:         resolve(__dirname, 'projets/cafeo.html'),
  niortBasket:   resolve(__dirname, 'projets/niort-basket.html'),
  aurem:         resolve(__dirname, 'projets/aurem.html'),
  archeon:       resolve(__dirname, 'projets/archeon.html'),
},
```

---

## Structure de la page

### 1. Nav
- Logo Studio Skøne (lien vers `/`)
- Lien "← Tous les projets" (retour vers `/#work`)
- Sticky, backdrop-blur, identique à la nav principale

### 2. Hero
- Badge type de projet (ex: "App mobile")
- Titre du projet (H1, 38px, font-weight 800)
- Sous-titre type/catégorie
- Description courte (2-3 phrases, contexte + résultat)
- Visuel principal : mockup/image du projet (format 4/3, border + box-shadow néobrutalist)

### 3. Galerie mockups
- Label section "Mockups & Écrans"
- Grille asymétrique : première image en `grid-column: span 2` (16/9), puis 3 images 4/3
- 4 images par projet minimum
- Si les images de galerie n'existent pas encore, utiliser l'image hero dupliquée ou un placeholder CSS (dégradé neutre) — la structure de la grille reste inchangée

### 4. Contexte & enjeux
- Label section "Contexte & enjeux"
- 2 paragraphes : problème client + solution apportée

### 5. Témoignage
- Fond sombre `#181716`, border-radius 10px
- Citation en italique
- Avatar initiales + nom + rôle

### 6. CTA final
- Fond sombre `#181716`
- Titre "Un projet similaire en tête ?"
- Sous-titre "Premier échange gratuit, sans engagement."
- Bouton accent → `#contact` de la page d'accueil (`/#contact`)

---

## Données projet (`projects-data.ts`)

```typescript
interface Project {
  slug: string
  title: string
  badge: string          // "App mobile", "Site web", etc.
  type: string           // sous-titre catégorie
  description: string    // texte hero (2-3 phrases)
  heroImage: string      // chemin /work/xxx.webp
  gallery: GalleryItem[] // 4 images min
  context: string[]      // 2 paragraphes
  testimonial: {
    quote: string
    name: string
    role: string
    initials: string
  }
}

interface GalleryItem {
  src: string
  label: string
}
```

**Projets à créer :**
| Slug | Titre | Badge |
|------|-------|-------|
| `myboat` | MyBoat | App mobile |
| `garantibox` | Garantibox | Web App SaaS |
| `cafeo` | ele — Ateliers Caféologie | Site web |
| `niort-basket` | Niort Basket | Site web |
| `aurem` | Aurem | Site vitrine |
| `archeon` | Archéon | Portfolio |

---

## Liens depuis le carousel

Les liens `<a href="#contact" class="work-card-cta">` dans `index.html` sont remplacés par des liens vers la page dédiée :

```html
<a href="/projets/myboat" class="work-card-cta">Voir le projet →</a>
```

---

## SEO — meta tags par page

Chaque fichier HTML inclut :
- `<title>` : `[Titre projet] — Studio Skøne`
- `<meta name="description">` : description du projet
- `<meta property="og:*">` : image hero + titre + description
- `<link rel="canonical">` : URL absolue

---

## Animations

- Même système `reveal` + `IntersectionObserver` que la page principale
- Les blocs Hero, Galerie, Contexte, Témoignage, CTA ont la classe `.reveal`
- Stagger sur les items de la galerie

---

## Responsive

- Hero : colonne unique sous 768px (visuel passe sous le texte)
- Galerie : 2 colonnes sous 600px, 1 colonne sous 400px
- CTA : flex-direction column sous 600px

---

## Hors scope

- Page de liste `/projets` (non demandée)
- Filtres / tags par type de projet
- Pagination entre projets (précédent / suivant)
