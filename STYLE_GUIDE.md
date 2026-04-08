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

### Headlines — Montserrat (Google Fonts)

Utilisé pour : **H1, H2, H3, boutons CTA, section labels**

```css
--font-display: 'Montserrat', system-ui, sans-serif;
```

Chargement : `Montserrat:wght@400;500;600;700;800` — subset `latin,latin-ext` (couvre tous les accents français : é è ê ë à â ù û ü ô î ï ç œ æ)

### Échelle typographique — fluid responsive (`clamp()`)

Calibrée pour atteindre les tailles cibles à **1300px (desktop)**. Calcul : `clamp(min, slope·vw + intercept, max)`.

| Élément | Mobile (≤480) | Tablet (768) | Desktop (1300) | Large (1600) | Weight | Line-height |
|---------|--------------|--------------|----------------|--------------|--------|-------------|
| H1      | 32px         | ~42px        | **56px**       | 64px         | 500    | 1.1 (~62px) |
| H2      | 18px         | ~22px        | **27px**       | 30px         | 800    | 1.0         |
| H3      | 14px         | ~16px        | **19px**       | 22px         | 700    | 1.53 (~29px)|
| Body    | 14px         | ~16px        | **18px**       | 20px         | 500    | 1.44 (~26px)|

```css
h1 { font-size: clamp(2rem, 2.58vw + 1.42rem, 4rem);          line-height: 1.1;  font-weight: 500; }
h2 { font-size: clamp(1.125rem, 1vw + 0.906rem, 1.875rem);    line-height: 1.0;  font-weight: 800; }
h3 { font-size: clamp(0.875rem, 0.53vw + 0.756rem, 1.375rem); line-height: 1.53; font-weight: 700; }
body { font-size: clamp(0.875rem, 0.48vw + 0.769rem, 1.25rem); line-height: 1.44; font-weight: 500; }
```

Style :
- `letter-spacing: 0.025em` sur tous les titres
- `letter-spacing: 0.2em` + uppercase sur les section labels
- Hiérarchie forte : H2 weight 800 vs H1 weight 500 — contraste intentionnel éditorial

### Body text — Sora (Google Fonts)

Utilisé pour : **paragraphes, descriptions, cartes, navigation, footer, boutons secondaires**

```css
--font-sans: 'Sora', system-ui, sans-serif;
```

Chargement : `Sora:wght@300;400;500;600`

Style :
- Clean et moderne
- Très lisible
- Espacement élégant

### Éléments éditoriaux — Cormorant Garamond (Google Fonts)

Utilisé pour : **citations, stat-numbers, email contact, sous-titres italiques**

```css
--font-serif: 'Cormorant Garamond', Georgia, serif;
```

Chargement : `Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500`

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
font-family:   var(--font-display); /* Montserrat */
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
font-family:   var(--font-display); /* Montserrat */
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
font-family: var(--font-display);   /* Montserrat */
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

| Fichier                             | Usage                                |
|-------------------------------------|--------------------------------------|
| `/public/logo_skone.svg`            | Logo nav (h: 30px) + footer (h: 24px) |
| `/public/hero_section_headline.png` | Headline hero — fond transparent     |
| Google Fonts — Montserrat           | Via CDN, subset latin + latin-ext    |

*Dernière mise à jour : avril 2026*
