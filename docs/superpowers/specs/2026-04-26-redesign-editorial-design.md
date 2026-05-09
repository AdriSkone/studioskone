# Studio Skøne — Redesign éditorial premium

**Date** : 2026-04-26  
**Approche retenue** : Approche 2 — Refonte section par section  
**Stack** : Vanilla TypeScript + Vite, aucun framework CSS

---

## Objectif

Redesigner toutes les sections du site (sauf les zones protégées) pour atteindre une direction éditoriale premium de type agence haut de gamme — intentionnel, asymétrique, non-générique. Inspiration : Labastide.

---

## Contraintes absolues — NE PAS TOUCHER

| Élément | Raison |
|---|---|
| Hero section — layout, texte, structure | Validé, ne pas modifier |
| Navigation / menu | Validé, ne pas modifier |
| `ContactMultiStepForm.jsx` — logique ET layout | Conservé intégralement |
| Curseur (cercle accent qui suit la souris) | Conservé |

Le fond du hero peut être optionnellement restyled (grain + légère lueur).

---

## Tokens CSS — Palette finale

```css
--bg:        #FAEEDF;   /* fond principal */
--surface:   #E9D8C2;   /* sections alternées */
--accent:    #C56039;   /* highlights, interactions */
--dark:      #181716;   /* sections sombres */
--dark-soft: #2A2927;   /* cards sur fond sombre, hover, diviseurs */
--text:      #181716;
--muted:     #6B6B6B;
--border:    #E2D8CB;
--card:      #FFF8EF;

/* Profondeur */
--grain-opacity: 0.025;
--glow-accent:   rgba(197, 96, 57, 0.10);
--shadow-soft:   0 8px 30px rgba(0, 0, 0, 0.08);
```

---

## Système de profondeur global

Toutes les sections appliquent un pseudo-élément `::after` avec `background-image: url("data:image/svg+xml, <feTurbulence...>")` à `opacity: 0.025`. Les sections `--dark` ajoutent un glow radial accent en `::before`.

---

## Typographie

| Rôle | Police | Taille desktop | Poids |
|---|---|---|---|
| Titre H2 éditorial | Barlow | 42–56px | 700 |
| Section label | Barlow | 10px, letter-spacing 0.22em, uppercase | 700 |
| Corps | Barlow | 14–16px | 400 |
| Citation | Cormorant Garamond italic | 24–28px | 600 |
| Numéro décoratif | Cormorant Garamond italic | 48–96px, opacity variable | 600 |
| Email éditorial | Cormorant Garamond italic | 36px | 600 |

`letter-spacing: -0.01em` à `-0.02em` sur tous les titres H2.

---

## Motion global

```css
--ease:     cubic-bezier(0.16, 1, 0.3, 1);
--duration: 0.7s;
```

- Scroll reveal : `opacity + translateY(40px → 0)` via `IntersectionObserver`, stagger `index × 0.11s`
- Hover cards : `translateY(-4px)`, `0.4–0.55s`
- Hover work rows : `padding-left: 10px`, vignette `opacity + translateX`, `0.3–0.35s`
- Témoignages rotation : `opacity + translateX`, `0.5s`

---

## Rythme des sections — ordre de défilement

| # | Section | Fond | Statut |
|---|---|---|---|
| — | Navigation | transparent → `--bg` scrollé | Protégée |
| 1 | Hero | `--bg` + gradient mesh | Protégé |
| — | Marquee défilant | transparent | Conservé tel quel |
| 2 | Notre approche (`#why` dans le HTML actuel — `#stats` supprimé) | `--dark` | **Refondu** |
| 3 | Work | `--bg` | **Refondu** |
| 4 | Services | `--dark` | **Refondu** |
| 5 | Process | `--surface` | **Refondu** |
| 6 | Tarifs | `--bg` | **Refondu** |
| 7 | Témoignages | `--surface` | **Refondu** |
| 8 | FAQ | `--bg` | **Refondu** |
| 9 | Contact | `--dark` | Layout amélioré, form protégé |
| — | Footer | `--surface` | Conservé |

---

## Sections redesignées — détail

### Section 2 — Notre approche (`#about` ou `#why`)

**Direction** : Rupture sombre — fond `--dark`, billboard typographique, texte décalé, bande quote.

**Structure HTML** :
```
.about-section  (background: --dark, position: relative)
  ::before      glow radial accent top-right
  ::after       grain overlay
  .about-inner  (position: relative, z-index: 1)
    .about-label              section label accent
    .about-title              H2 52px, couleur --bg, em italic accent
    .about-mid                flex: spacer 1 + texte 1 (filet gauche accent)
    .about-quote-band         background: --dark-soft, padding vertical
      .about-quote-text       Cormorant italic 22px, opacity 0.55
      .about-quote-author     label uppercase accent
```

**Copywriting à conserver** (PROJECT_BRIEF.md §6) — sans mention d'outils spécifiques.

---

### Section 3 — Work (`#work`)

**Direction** : Liste éditoriale avec hover reveal. Suppression de l'arc carousel 3D.

**Structure HTML** :
```
.work-section   (background: --bg)
  .work-header  (flex, justify: space-between)
    .work-title   H2 42px
    .work-count   Cormorant italic 64px, accent opacity 0.2
  .work-list    (border-top: 1px --border)
    .work-row × 6  (flex, padding: 20px 0, border-bottom)
      .work-num     11px, accent, min-width 28px
      .work-info    flex: 1
        .work-name     21px bold
        .work-tagline  12px muted, max-height: 0 → reveal au hover
      .work-cat     11px uppercase muted
      .work-year    12px muted
      .work-thumb   64×48px, border-radius 8px, opacity: 0 → 1 au hover
```

**6 projets dans l'ordre** :
1. ele — Ateliers Caféologie · Site web · 2026
2. MyBoat · App mobile · 2026
3. Garantibox · Web App · 2025
4. Niort Basket · Site web · 2025
5. Aurem · Site vitrine · 2025
6. Archéon · Portfolio · 2025

**JS** : remplace la logique arc carousel. `mouseenter` sur `.work-row` → reveal `.work-tagline` et `.work-thumb`. Pas de drag, pas de `requestAnimationFrame`.

**Images** : utiliser les mockups existants dans `/Mockup/` de chaque projet via `background-image: url(...)` dans `.work-thumb`.

---

### Section 4 — Services (`#services`)

**Direction** : Grille 2×2 dark épurée. Fond `--dark`, cards `--dark-soft`.

**Structure HTML** :
```
.services-section  (background: --dark)
  ::before  glow radial accent top-right
  ::after   grain
  .services-inner
    .services-header
      .section-label  accent
      H2  42px, couleur --bg, em italic accent
    .services-grid  (grid 2×2, gap 16px)
      .service-card × 4  (background: --dark-soft, border-radius 16px)
        .service-num    10px uppercase accent
        .service-title  18px bold, couleur --bg
        .service-desc   13px, rgba(--bg, 0.38)
        .service-tag    inline-block, accent bg opacity 0.15
```

**Hover card** : `border-color: rgba(accent, 0.35)`, `translateY(-4px)`.

**4 services** :
1. Landing page & Site vitrine — Dès 900€
2. Web App & SaaS — Sur devis
3. Application mobile — Dès 2 500€
4. Direction artistique & UI — Dès 600€

---

### Section 5 — Process (`#process`)

**Direction** : Grille 2×2, numéros Cormorant en fond opacité 8%.

**Structure HTML** :
```
.process-section  (background: --surface)
  ::after  grain
  .process-header
    .section-label
    H2  42px
  .process-grid  (grid 2×2, gap 16px)
    .process-card × 4  (background: --bg, border-radius 16px, position: relative, overflow: hidden)
      .process-bg-num   Cormorant italic 88px, accent opacity 0.08, position absolute top-right
      .process-tag      10px uppercase accent
      .process-title    17px bold
      .process-text     12px muted
```

**4 étapes** : Découverte / Design / Développement / Lancement — copy PROJECT_BRIEF.md §process.

---

### Section 6 — Tarifs (`#tarifs`)

**Direction** : Grille 3 colonnes, carte centrale featured sur `--dark`.

**Structure** : inchangée par rapport au design actuel, avec mise à jour CSS uniquement :
- Cards latérales : `background: --surface`, `border: 1px solid --border`, `border-radius: 20px`
- Card centrale `.tarif-card--featured` : `background: --dark`, glow radial, textes clairs
- Montants : Cormorant Garamond italic 48px
- CTA primaire : `background: --accent`, ombre accent
- CTA ghost : `border: 1.5px solid --border`

---

### Section 7 — Témoignages (`#testimonials`)

**Direction** : Citation pleine largeur rotative, Cormorant italic, navigation par points.

**Structure HTML** :
```
.testi-section   (background: --surface, text-align: center)
  ::after  grain
  .testi-inner   (max-width: 800px, margin: auto)
    .testi-label
    .testi-mark   Cormorant " 96px, accent opacity 0.12
    .testi-slides (position: relative)
      .testi-slide × 3  (position: absolute → fade in/out)
        .testi-quote   Cormorant italic 28px
        .testi-author  13px bold
        .testi-role    12px muted
    .testi-nav    (flex, gap 8px, justify: center)
      .testi-dot × 3  (7px, border-radius 50%)
```

**JS** : auto-rotation toutes les 5s, `opacity + translateX` entre slides, click sur `.testi-dot` → jump to slide.

**3 témoignages** : Léa Moreau / Thomas Klein / Nina Saito (copy PROJECT_BRIEF.md §8).

---

### Section 8 — FAQ (`#faq`)

**Direction** : Accordéon éditorial avec numéros Cormorant et compteur décoratif.

**Structure HTML** :
```
.faq-section
  .faq-header  (flex, justify: space-between, align: flex-end)
    H2  42px
    .faq-count   Cormorant italic 64px, accent opacity 0.18
  .faq-list    (border-top: 1px --border)
    .faq-item × 5  (border-bottom: 1px --border)
      .faq-row  (flex, gap 20px, cursor pointer)
        .faq-num     Cormorant italic 18px, accent opacity 0.4
        .faq-q       17px bold
        .faq-icon    28px cercle border, "+" → rotate(45deg) quand ouvert
      .faq-body  (max-height: 0 → reveal, padding-left 48px)
```

**JS** : logique existante conservée (toggle `.is-open`, ferme les autres). Seul le markup et le style changent.

---

### Section 9 — Contact (`#contact`)

**Layout amélioré, multi-step form `ContactMultiStepForm.jsx` conservé intégralement.**

```
.contact-section  (background: --dark)
  ::before  glow radial accent
  ::after   grain
  .contact-inner
    .contact-label
    H2  44px, couleur --bg, em italic accent
    .contact-email   Cormorant italic 36px, opacity 0.55 → accent au hover
    .contact-actions (flex, gap 12px)
      .btn-primary   background --accent, box-shadow accent
      .btn-secondary ghost blanc
    /* ContactMultiStepForm.jsx — rendu ici, inchangé */
    .contact-details  (grid 3 colonnes, border-top rgba blanc 0.07)
      .contact-col × 3
```

---

## Fichiers à modifier

| Fichier | Type de modification |
|---|---|
| `src/style.css` | Refonte complète des sections redesignées, nouveaux tokens |
| `index.html` | Restructuration HTML des sections 2–9 |
| `src/main.ts` | Suppression logique arc carousel, ajout hover reveal work, rotation témoignages |
| `src/components/Hero.tsx` | Optionnel : grain + glow sur fond hero |
| `src/components/ContactMultiStepForm.jsx` | **Aucune modification** |
| `src/components/contact-form.ts` | **Aucune modification** |

---

## Fichiers à ne pas modifier

- `src/components/ContactMultiStepForm.jsx`
- `src/components/contact-form.ts`
- `src/components/Hero.tsx` (sauf optionnel background)
- Toute logique de navigation, smooth scroll, curseur

---

## Images portfolio

Les mockups réels existent dans les dossiers projets. À référencer via chemins relatifs depuis `/public/` (copier dans `public/work/`) :

| Projet | Source |
|---|---|
| ele — Caféologie | `~/Desktop/ele - Ateliers Caféologie/ele-ateliers-cafeologie/Capture ancien site/` |
| MyBoat | `~/Desktop/MyBoat/Mockup/IMG_1427.jpg` |
| Garantibox | `~/Desktop/Projets claude code/Garantibox/Mockup/dashboard_desktop_mockup.png` |
| Niort Basket | `~/Desktop/Projets claude code/refonte_site_NiortBasket/mockups/desktop.png` |
| Aurem | `~/Desktop/Projets claude code/aurem-website/src/assets/hero.png` |
| Archéon | `~/Desktop/Projets claude code/Archéon/Mockup/mockup-final-desktop.png` |

---

## Ce qui ne change pas (hors zones protégées)

- Marquee section (bandeau défilant outils)
- Footer structure
- Smooth scroll
- Nav scroll state (`.is-scrolled`)
- Mobile menu toggle
