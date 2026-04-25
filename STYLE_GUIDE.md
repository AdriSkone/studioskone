# Studio Skøne — Style Guide

## Brand Identity

Studio créatif digital premium.
Esthétique minimal luxe.
Moderne, éditorial et élégant.

---

## Colors

| Rôle             | Valeur      | Token CSS       |
|------------------|-------------|-----------------|
| Background       | `#FBF4E4`   | `--bg`          |
| Section alt      | `#E8D1B3`   | `--surface`     |
| Cards            | `#FFF8EF`   | `--card`        |
| Primary Accent   | `#C4603B`   | `--accent`      |
| Accent hover     | `#A84E2E`   | `--accent-dark` |
| Text Primary     | `#1A1A1A`   | `--dark` `--text` |
| Text Secondary   | `#6B6B6B`   | `--muted`       |
| Border           | `#E2D8CB`   | `--border`      |

---

## Typography

### Règle responsive

> Toutes les tailles typographiques ci-dessous sont définies pour le format **desktop**.
> Les tailles doivent être ajustées de manière proportionnelle selon le support :
>
> - **Desktop** : valeurs par défaut
> - **Tablet** : réduire de 15 à 20 %
> - **Mobile** : réduire de 25 à 35 %
>
> Veiller à conserver une excellente lisibilité et une hiérarchie visuelle forte sur tous les supports.

---

### Font Pairing

| Rôle | Police |
|------|--------|
| Hero titles (H1) | **Barlow Bold** |
| Section titles (H2, H3) | **Barlow Bold** |
| Navigation links | **Barlow Bold** |
| Decorative quote marks | **Barlow Bold** |
| Body text | **Barlow Regular** |
| Buttons / labels / forms | **Barlow Regular** |
| Testimonials / citations | **Barlow Regular** |
| Prix / montants | **Barlow Regular** |
| Author names | **Barlow Regular** |

```css
--font-display: 'Barlow', system-ui, sans-serif;
--font-sans:    'Barlow', system-ui, sans-serif;
```

> Import Google Fonts : `font-family=Barlow:wght@400;700` — subset latin + latin-ext

---

### Échelle typographique — Desktop

| Élément | Police | font-size | font-weight | line-height |
|---------|--------|-----------|-------------|-------------|
| Hero title (H1) | Barlow Bold | 64px | 700 | 72px |
| Section title (H2) | Barlow Bold | 40px | 700 | 48px |
| Subheading (H3) | Barlow Bold | 24px | 700 | 32px |
| Body text | Barlow Regular | 18px | 400 | 30px |
| Button text | Barlow Regular | 16px | 400 | 24px |
| Form labels | Barlow Regular | 14px | 400 | 20px |
| Testimonial / citation | Barlow Regular | 20px | 400 | 34px |
| Prix / montants | Barlow Regular | — | 400 | — |
| Author name | Barlow Regular | 16px | 400 | 24px |
| Decorative quote marks | Barlow Bold | 88px | 700 | — |

**Decorative quote marks** : `opacity: 0.15` — positionnement absolu en fond de carte.

---

### Styles complémentaires

- `letter-spacing: 0.025em` sur tous les titres
- `letter-spacing: 0.2em` + `text-transform: uppercase` sur les section labels
- Hiérarchie forte : Hero 700 vs Section title 600 — contraste intentionnel éditorial

---

## Spacing

- Large white space — `padding-block: 140px` desktop, `96px` mobile
- Premium vertical rhythm entre chaque section
- Container : `max-width: 1300px`, `padding-inline: 64px → 40px → 24px`
- Sections aérées, jamais de contenu dense

---

## CTA Button Design System

### Primary CTA

**Usage :** action principale, hero CTA, contact, découverte projets.

```css
background:    #C4603A;           /* --accent */
color:         #FBF4E4;           /* --bg */
border-radius: 16px;
padding:       12px 24px;
font-family:   var(--font-display); /* Barlow Bold */
font-weight:   600;
letter-spacing: 0.08em;
text-transform: uppercase;
box-shadow:    0 4px 16px rgba(196, 96, 58, 0.28);
transition:    background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
```

Hover :
```css
background:  #A84E2E;             /* --accent-dark */
transform:   translateY(-2px);
box-shadow:  0 8px 28px rgba(196, 96, 58, 0.38);
```

> Police : **Montserrat** pour tous les labels CTA.

---

### Secondary CTA

**Usage :** actions secondaires, ghost buttons, liens d'appui.

```css
background:    transparent;       /* ou #FBF4E4 */
border:        1.5px solid #C4603A;
color:         #C4603A;
border-radius: 16px;              /* rounded-2xl */
padding:       12px 24px;         /* py-3 px-6 */
font-family:   var(--font-display); /* Barlow Bold */
font-weight:   400;
letter-spacing: 0.08em;
text-transform: uppercase;
transition:    background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
```

Hover :
```css
background:  rgba(196, 96, 58, 0.08);
transform:   translateY(-2px);
box-shadow:  0 4px 16px rgba(196, 96, 58, 0.12);
```

---

## Testimonials Design

### Section title

Utiliser **Barlow Bold (700)**.

Textes recommandés :
- *Ce que nos clients disent*
- *Ils nous ont fait confiance*

### Testimonial text

Utiliser **Barlow Regular (400)** — taille 20px, line-height 34px.

Exemple :
> "Studio Skone a transformé notre image de marque et notre présence digitale."

### Author

Utiliser **Barlow Regular (400)** — taille 16px, line-height 24px.

Exemple : `— Claire Martin, Fondatrice`

### Quote Styling

Les guillemets décoratifs doivent être :

```css
font-family: var(--font-display); /* Barlow Bold */
font-size:   88px;
font-weight: 700;
opacity:     0.15;
position:    absolute;
```

Placés en fond de carte, ils servent de texture visuelle sans concurrencer le contenu.

### Card Style

```css
border-radius:    24px;
background:       rgba(255, 248, 239, 0.6);   /* --card avec transparence */
border:           1px solid rgba(226, 216, 203, 0.5); /* --border subtil */
backdrop-filter:  blur(12px);
-webkit-backdrop-filter: blur(12px);
box-shadow:       0 4px 24px rgba(0, 0, 0, 0.06);
transition:       transform 0.4s ease, box-shadow 0.4s ease;
```

Hover :
```css
transform:  translateY(-6px);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.10);
```

---

## Components

### Boutons

Voir **CTA Button Design System** ci-dessus pour les specs complètes.

Résumé rapide :
- `border-radius: 16px` sur tous les boutons
- Transition `0.3s ease` — jamais brutale
- Lift `translateY(-2px)` au hover sur primaire et secondaire
- Ombre portée accent sur primaire, ombre subtile sur secondaire

### Cartes (Work)

```css
border-radius: 24px;          /* rounded-3xl */
overflow: hidden;
box-shadow: 0 2px 20px rgba(0,0,0,0.06);
transition: transform 0.55s, box-shadow 0.55s;
```

Hover :
```css
transform: translateY(-6px);
box-shadow: 0 12px 40px rgba(0,0,0,0.12);
```

- Lift premium au hover
- Image avec `scale(1.04)` et overlay texte italic
- `work-info` avec `padding: 20px 24px 24px` et fond `--bg`

### Hero Badges

Deux badges dans le hero headline :

| Variante | Usage | Style |
|----------|-------|-------|
| `--filled` | "web", "mobile" | Fond `--accent` plein, texte `--bg` |

```css
background: var(--accent);  /* #C4603A */
color:      var(--bg);      /* #FBF4E4 */
border-radius: 0.28em;
padding:    0.05em 0.26em;
```

---

### Section Labels

```css
font-family: var(--font-display);   /* Barlow Bold */
font-size: 11px;
font-weight: 600;
letter-spacing: 0.2em;
text-transform: uppercase;
color: var(--accent);
```

---

## Layout

- Split hero (image droite / texte gauche) selon le contexte
- Responsive mobile-first — breakpoints : 1100px / 768px / 600px / 480px
- Grid éditoriale — about 2 col, services 2×2, work 2 col + 1 full-width
- Rythme de section aéré et intentionnel

---

## Animations

```css
--ease:     cubic-bezier(0.16, 1, 0.3, 1);
--duration: 0.7s;
```

- Scroll reveal : `opacity + translateY(36px)` via `IntersectionObserver`
- Stagger frères : `index × 0.11s` de `transition-delay`
- Boutons : sweep couleur de gauche à droite, `0.55s`
- Cartes : lift `translateY(-6px)`, `0.55s`
- Transitions : toujours `smooth`, jamais brutales

---

## Ton éditorial

**Français. Premium. Minimal. Confiant. Expert.**

- Phrases courtes
- Pas de superlatifs creux
- Copywriting direct et élégant
- Ton agence internationale, pas startup

---

## Assets

| Fichier                             | Usage                                                          |
|-------------------------------------|----------------------------------------------------------------|
| `/public/favicon_skone.svg`         | Favicon navigateur — **avec fond** `#f5ede0`                  |
| `/public/favicon_skone_nav.svg`     | Icône nav (top-left) — **fond transparent**, h: 32px          |
| `/public/logo_skone_sansh2.svg`     | Wordmark hero plein largeur + usage éditorial                  |
| `/public/logo_skone.svg`            | Logo alternatif (footer, variantes)                            |
| `/public/hero_section_headline.png` | Headline hero — fond transparent                               |
| Google Fonts — Barlow               | Via CDN, weights 400 + 700, subset latin + latin-ext           |

> **Règle icône nav** : toujours utiliser `favicon_skone_nav.svg` (transparent) dans la navigation.
> Ne jamais utiliser `favicon_skone.svg` dans l'UI — réservé au favicon du navigateur.

*Dernière mise à jour : avril 2026*
