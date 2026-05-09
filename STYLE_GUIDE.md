# Studio Skøne — Style Guide (Premium Upgrade)

## Brand Identity

Studio digital créatif premium.
Positionnement : agence produit & design.

Esthétique :
- minimal éditorial
- contraste maîtrisé
- sophistication discrète

Objectif visuel :
→ évoquer une direction artistique, pas une interface générique

---

## Colors

Palette volontairement chaude, texturée et premium.

| Rôle             | Valeur      | Token CSS       |
|------------------|-------------|-----------------|
| Background       | `#FBF4E4`   | `--bg`          |
| Background deep  | `#F3E8D7`   | `--bg-soft`     |
| Section alt      | `#E8D1B3`   | `--surface`     |
| Cards            | `#FFF8EF`   | `--card`        |
| Primary Accent   | `#C4603B`   | `--accent`      |
| Accent hover     | `#A84E2E`   | `--accent-dark` |
| Text Primary     | `#1A1A1A`   | `--text`        |
| Text Secondary   | `#6B6B6B`   | `--muted`       |
| Border           | `#E2D8CB`   | `--border`      |

### NEW — Depth system

```css
--grain-opacity: 0.03;
--glow-accent:   rgba(196, 96, 59, 0.18);
--shadow-soft:   0 8px 30px rgba(0, 0, 0, 0.08);
```

**Usage :**
- `--bg-soft` : fonds alternatifs, zones de repos visuel (hover léger, sections de transition)
- `--grain-opacity` : overlay bruit de texture sur sections premium (pseudo-élément `::after`)
- `--glow-accent` : lueur douce autour d'éléments accent (box-shadow ou filter)
- `--shadow-soft` : ombre portée standard hover — remplace les ombres arbitraires

---

## Typography

### Règle responsive

Typographie fluide avec `clamp()` — aucune media query nécessaire pour les tailles de texte.

```
clamp(min, preferred·vw, max)
```

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

### Échelle typographique — Fluid clamp()

| Élément | clamp() | min | max | line-height | font-weight |
|--------|---------|-----|-----|-------------|-------------|
| H1 (Hero) | `clamp(38px, 5vw, 64px)` | 38px | 64px | 1.1 | 700 |
| H2 (Section) | `clamp(28px, 3vw, 40px)` | 28px | 40px | 1.2 | 700 |
| H3 (Subheading) | `clamp(20px, 2vw, 24px)` | 20px | 24px | 1.3 | 700 |
| Body standard | `clamp(15px, 1.2vw, 18px)` | 15px | 18px | 1.6 | 400 |
| Small text | `clamp(13px, 1vw, 14px)` | 13px | 14px | — | 400 |
| Button | `16px` | — | — | 1.5 | 500 |
| Label / caption | `12px` | — | — | — | 400 |

```css
h1 { font-size: clamp(38px, 5vw, 64px);   line-height: 1.1; font-weight: 700; }
h2 { font-size: clamp(28px, 3vw, 40px);   line-height: 1.2; font-weight: 700; }
h3 { font-size: clamp(20px, 2vw, 24px);   line-height: 1.3; font-weight: 700; }
body { font-size: clamp(15px, 1.2vw, 18px); line-height: 1.6; }
.small { font-size: clamp(13px, 1vw, 14px); }
```

**Decorative quote marks** : `font-size: 88px; font-weight: 700; opacity: 0.15` — positionnement absolu en fond de carte.

---

### Styles complémentaires

- `letter-spacing: 0.02em` sur H1, H2, H3
- `letter-spacing: 0.2em` + `text-transform: uppercase` sur les section labels
- Hiérarchie forte : Hero 700 vs Section title 600 — contraste intentionnel éditorial

### Largeur de texte

```css
.hero-subtitle { max-width: 560px; }
.section-text  { max-width: 640px; }
```

### Rythme vertical

```css
h1 { margin-bottom: 24px; }
h2 { margin-bottom: 32px; }
h3 { margin-bottom: 16px; }
p  { margin-bottom: 16px; }
```

---

## Spacing

- Large white space — `padding-block: 140px` desktop, `96px` mobile
- Premium vertical rhythm entre chaque section
- Container : `max-width: 1300px`, `padding-inline: 64px → 40px → 24px`
- Sections aérées, jamais de contenu dense

---

## CTA Button Design System

### Primary CTA

**Usage :** action principale, hero CTA, contact, nav principale.

**Règle systématique :** tout bouton CTA primaire comporte obligatoirement un cercle icône flèche à gauche.

```css
background:    var(--accent);     /* #C4603A */
color:         var(--bg);         /* #FBF4E4 */
border-radius: 100px;
padding:       7px 24px 7px 7px;  /* pill avec icône cercle gauche */
gap:           16px;
font-family:   var(--font-display);
font-weight:   600;
letter-spacing: 0.08em;
text-transform: uppercase;
transition:    background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
```

Hover :
```css
background:  var(--accent-dark);  /* #A84E2E */
transform:   translateY(-2px);
box-shadow:  0 8px 28px rgba(196, 96, 58, 0.38);
```

Icône cercle gauche : `42px`, `background: var(--bg)`, `color: var(--accent)`.
Hover : animation ring pulse sur le cercle + nudge doux de la flèche (4px, `ease-in-out`, 1.4s, loop infini).

```css
@keyframes ctaArrow {
  0%   { transform: translateX(0);   }
  50%  { transform: translateX(4px); }
  100% { transform: translateX(0);   }
}
/* animation: ctaArrow 1.4s ease-in-out infinite; */
```

---

### Secondary CTA

**Usage :** nav CTA, actions secondaires, ghost buttons, liens d'appui.

**Règle systématique :** tout bouton CTA secondaire comporte un dot rond accent à gauche, avec `gap: 10px` entre le dot et le texte.

```css
background:    transparent;
border:        1.5px solid var(--accent);
color:         var(--accent);
border-radius: 100px;
padding:       12px 24px;
gap:           10px;              /* espacement dot → texte */
font-family:   var(--font-display);
font-weight:   600;
letter-spacing: 0.08em;
text-transform: uppercase;
transition:    background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
```

Dot :
```css
width: 6px; height: 6px;
border-radius: 50%;
background: var(--accent);  /* var(--bg) si fond primaire */
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

## Hero Layout

Structure validée — ne pas modifier sans validation visuelle préalable.

```
┌──────────────────────────────────────┐
│  [tagline gauche]   [statement droit]│
│                     [CTA bouton]     │
│                                      │
│  ████████████████████████████████   │  ← logo pleine largeur
└──────────────────────────────────────┘
```

### Logo
- Pleine largeur, ancré en bas, contenu dans la section (`overflow: hidden`)
- `padding: 0 32px 32px` — marges égales gauche, droite, bas
- Fond gradient : `linear-gradient(148deg, #ECE4D0, #F4EDD9, #FBF4E4, #F7EDDB)`

### Texte gauche (tagline)
- Position : `left: 32px; top: 40%` (aligné sur le bord gauche du logo)
- Style : 11px, weight 400, `letter-spacing: 0.2em`, `text-transform: uppercase`, `color: #20201E`
- Badges inline "web" et "mobile" : fond `--accent`, texte `--bg`, `border-radius: 0.28em`

### Texte droit (statement)
- Position : `right: 32px; top: 40%` (aligné sur le bord droit du logo)
- Style : `clamp(28px, 4vw, 64px)`, weight 700, `text-align: right`
- "attire." : `font-weight: 300; font-style: italic`
- "convertit." : `color: var(--accent)`

### CTA hero
- Pill bouton : `background: var(--accent); border-radius: 100px; padding: 7px 24px 7px 7px`
- Cercle icône gauche : `42px, background: var(--bg)`, flèche `color: var(--accent)`
- Label : 14px, 600, uppercase, `letter-spacing: 0.08em`, `color: var(--bg)`
- Lien vers `#work`

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

---

# DESIGN PRINCIPLES

- Avoid perfect grids
- Prefer asymmetry
- Create visual tension

---

# DEPTH SYSTEM

- Add grain overlay (2–3%)
- Add subtle glow using accent color
- Use layered backgrounds

---

# LAYOUT RULES

- Mix block sizes
- Offset elements
- Avoid repetitive structures

---

# SPACING

- Increase vertical spacing
- Prioritize breathing room

---

# MOTION

- Add stagger animations
- Add subtle parallax
- Keep everything smooth and minimal

---

# GOAL

Design must feel:
- editorial
- premium
- intentional

Never generic.
