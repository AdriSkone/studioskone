# Studio Skøne — Project Brief
> Document central du projet portfolio. Source de vérité unique pour le contenu, le SEO et la structure.
> UI & design system → voir `STYLE_GUIDE.md`

---

## 1. Identité du studio

| Champ | Valeur |
|-------|--------|
| Nom | Studio Skøne |
| URL | `[À RENSEIGNER]` ex: `www.studioskone.com` |
| Baseline | Création de produits web et mobile — de la conception au lancement |
| Positionnement | Studio Skøne conçoit et développe des expériences digitales premium : sites web, applications web et mobiles, MVP pour les marques, startups et indépendants ambitieux. |
| Cible | Startups, PME, entrepreneurs, créateurs de marque et porteurs de projet digitaux |
| Localisation | `[À RENSEIGNER]` ex: Paris, France — Remote |
| Langue du site | Français ✅ (`lang="fr"` corrigé) |
| Valeur unique | De la conception au lancement — design, performance et impact au cœur de chaque décision |

### Palette de couleurs

| Rôle | Valeur | Token CSS |
|------|--------|-----------|
| Background principal | `#FBF4E4` | `--bg` |
| Sections alternées | `#E8D1B3` | `--surface` |
| Cards | `#FFF8EF` | `--card` |
| Accent principal | `#C4603B` | `--accent` |
| Accent hover | `#A84E2E` | `--accent-dark` |
| Texte principal | `#1A1A1A` | `--dark` / `--text` |
| Texte secondaire | `#6B6B6B` | `--muted` |
| Bordures | `#E2D8CB` | `--border` |

---

## 2. SEO & Métadonnées

> Objectif : être trouvé sur des requêtes comme "création site web no-code", "développeur web indépendant Paris", "product builder freelance", "agence web Bubble Figma".

### `<head>` HTML

```html
<html lang="fr">
<title>[À RENSEIGNER]</title>
<!-- Exemple SEO-optimisé : -->
<!-- Studio Skøne — Création de produits web & mobile | No-code · Figma · IA -->

<meta name="description" content="[À RENSEIGNER]">
<!-- Exemple (155 car. max) : -->
<!-- Studio Skøne crée vos produits web et mobile de la conception au lancement. Design Figma, développement no-code Bubble, accompagnement IA. Basé à Paris. -->

<meta name="keywords" content="[À RENSEIGNER]">
<!-- Exemple : création site web, no-code, Bubble.io, Figma, product builder, studio web Paris, design produit, application mobile no-code -->
```

### Open Graph (réseaux sociaux)

```html
<meta property="og:title"       content="[À RENSEIGNER]" />
<meta property="og:description" content="[À RENSEIGNER]" />
<meta property="og:image"       content="[À RENSEIGNER — URL image 1200×630px]" />
<meta property="og:url"         content="[À RENSEIGNER — URL canonique]" />
<meta property="og:type"        content="website" />
<meta property="og:locale"      content="fr_FR" />

<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="[À RENSEIGNER]" />
<meta name="twitter:description" content="[À RENSEIGNER]" />
<meta name="twitter:image"       content="[À RENSEIGNER]" />
```

### Données structurées (Schema.org)

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Studio Skøne",
  "url": "[À RENSEIGNER]",
  "email": "[À RENSEIGNER]",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "[À RENSEIGNER]",
    "addressCountry": "FR"
  },
  "description": "[À RENSEIGNER]",
  "serviceType": ["Création de site web", "Design produit", "No-code", "Application mobile"]
}
```

---

## 3. Navigation

| Ordre | Label affiché | Ancre | Notes |
|-------|--------------|-------|-------|
| 1 | About | `#about` | |
| 2 | Services | `#services` | |
| 3 | Tarifs | `#tarifs` | |
| 4 | Work | `#work` | |
| 5 (CTA) | `[À RENSEIGNER]` | `#contact` | Actuellement "Start a project" — à franciser ? |

---

## 4. Section Hero

> Style : H1 fluid 56px desktop, H2 italic Cormorant dessous, 2 CTAs en ligne.
> Référence UI : `STYLE_GUIDE.md` → Hero Badges, CTA Button Design System.

### Headline H1

```
création de produits [web] et [mobile]
```
*[web] et [mobile] = badges accent arrondis*

> ✅ Validé — modifier si le positionnement évolue.

### Sous-titre H2

```
"de la conception au lancement"
```

> ✅ Validé.

### CTAs

| Bouton | Texte actuel | Style | À modifier ? |
|--------|-------------|-------|--------------|
| Primaire | Découvrir nos projets → | Accent plein | `[À RENSEIGNER]` |
| Secondaire | Parlons de votre projet | Ghost border | `[À RENSEIGNER]` |

---

## 5. Bandeau défilant (Marquee)

Outils & partenaires affichés en défilement continu sous le hero.

| Logo | Nom affiché | SVG dispo ? |
|------|------------|-------------|
| Claude (asterisk SVG) | Claude | ✅ Inline |
| Figma (5-shapes SVG) | Figma | ✅ Inline |
| Ottho (placeholder) | Ottho | ⚠️ Placeholder — fournir SVG/PNG |
| Bubble (circles SVG) | bubble | ✅ Inline approximatif |

> Pour remplacer le placeholder Ottho : déposer `ottho.svg` dans `/public/` et indiquer.

---

## 6. Section About

> Style : grille 2 colonnes, label + H2 à gauche, texte + stats à droite.

### Label section
```
[À RENSEIGNER] — actuellement "About us"
```

### Titre H2
```
[À RENSEIGNER] — actuellement "A studio built on craft & intention."
```
*Format : phrase principale + `<em>` italic pour le fragment final*

### Paragraphe 1
```
[À RENSEIGNER]
Actuellement : "Studio Skøne is a boutique creative agency dedicated to building brands
that feel as good as they look. We believe great design sits at the intersection of
strategy, beauty, and purpose."
```

### Paragraphe 2
```
[À RENSEIGNER]
Actuellement : "Founded on a commitment to quality over quantity, we partner with a select
number of clients each year — giving each project the full depth of our attention and expertise."
```

> 💡 SEO : mentionner naturellement les mots-clés métier (no-code, Bubble, Figma, produit web/mobile) dans ces paragraphes.

### Stats (3 chiffres clés)

| Stat | Valeur | Label |
|------|--------|-------|
| 1 | `[À RENSEIGNER]` ex: 8+ | `[À RENSEIGNER]` ex: Années d'expérience |
| 2 | `[À RENSEIGNER]` ex: 60+ | `[À RENSEIGNER]` ex: Projets livrés |
| 3 | `[À RENSEIGNER]` ex: 30+ | `[À RENSEIGNER]` ex: Clients accompagnés |

---

## 7. Section Services

> Style : grille 2×2, fond sombre `--dark`, cards hover chaud.

### Label section
```
[À RENSEIGNER] — actuellement "What we do"
```

### Titre H2
```
[À RENSEIGNER] — actuellement "Our services"
```

### Services (4 cartes)

#### Service 01
- **Titre H3 :** `[À RENSEIGNER]` — actuellement "Brand Identity"
- **Description :** `[À RENSEIGNER]`
- 💡 Ex SEO-friendly : "Création d'identité visuelle complète — logo, charte graphique et guidelines pour une marque cohérente et mémorable."

#### Service 02
- **Titre H3 :** `[À RENSEIGNER]` — actuellement "Web Design"
- **Description :** `[À RENSEIGNER]`
- 💡 Ex SEO-friendly : "Conception et développement de sites web sur Figma et Bubble.io — responsive, performants et orientés conversion."

#### Service 03
- **Titre H3 :** `[À RENSEIGNER]` — actuellement "Art Direction"
- **Description :** `[À RENSEIGNER]`

#### Service 04
- **Titre H3 :** `[À RENSEIGNER]` — actuellement "Brand Strategy"
- **Description :** `[À RENSEIGNER]`

---

## 8. Section Tarifs

> Style : grille 3 colonnes, carte centrale mise en avant (fond sombre).

### Label section
```
[À RENSEIGNER] — actuellement "Investissement"
```

### Titre H2
```
[À RENSEIGNER] — actuellement "Nos formules"
```

### Formule 1 — Essentiel

| Champ | Valeur actuelle | À modifier |
|-------|----------------|------------|
| Nom | Essentiel | `[À RENSEIGNER]` |
| Prix | 2 500 € | `[À RENSEIGNER]` |
| Description | "Idéal pour les projets focalisés…" | `[À RENSEIGNER]` |
| Item 1 | Identité visuelle (logo + charte) | `[À RENSEIGNER]` |
| Item 2 | Site one-page responsive | `[À RENSEIGNER]` |
| Item 3 | 2 révisions incluses | `[À RENSEIGNER]` |
| Item 4 | Livraison en 3 semaines | `[À RENSEIGNER]` |
| CTA | Démarrer | `[À RENSEIGNER]` |

### Formule 2 — Studio ⭐ (mise en avant)

| Champ | Valeur actuelle | À modifier |
|-------|----------------|------------|
| Nom | Studio | `[À RENSEIGNER]` |
| Prix | 6 500 € | `[À RENSEIGNER]` |
| Description | "Notre offre signature…" | `[À RENSEIGNER]` |
| Item 1 | Stratégie de marque | `[À RENSEIGNER]` |
| Item 2 | Identité visuelle complète | `[À RENSEIGNER]` |
| Item 3 | Site multi-pages responsive | `[À RENSEIGNER]` |
| Item 4 | Direction artistique | `[À RENSEIGNER]` |
| Item 5 | Révisions illimitées | `[À RENSEIGNER]` |
| Item 6 | Livraison en 6 semaines | `[À RENSEIGNER]` |
| CTA | Démarrer → | `[À RENSEIGNER]` |

### Formule 3 — Sur mesure

| Champ | Valeur actuelle | À modifier |
|-------|----------------|------------|
| Nom | Sur mesure | `[À RENSEIGNER]` |
| Prix | Sur devis | `[À RENSEIGNER]` |
| Description | "Pour les projets complexes…" | `[À RENSEIGNER]` |
| Items | Périmètre défini / Équipe / Suivi / Délais | `[À RENSEIGNER]` |
| CTA | Nous contacter | `[À RENSEIGNER]` |

---

## 9. Section Work / Portfolio

> Style : grille 2 colonnes + 1 carte pleine largeur, images en gradient placeholder.
> À remplacer par de vraies captures ou photos de projet.

### Label section
```
[À RENSEIGNER] — actuellement "Portfolio"
```

### Titre H2
```
[À RENSEIGNER] — actuellement "Selected work"
```

### Projets (5 cartes)

| # | Titre | Catégorie | Année | Image | Lien |
|---|-------|-----------|-------|-------|------|
| 1 | `[À RENSEIGNER]` Maison Soleil | `[À RENSEIGNER]` Brand Identity | `[À RENSEIGNER]` 2024 | `[À RENSEIGNER — /public/work-1.jpg]` | `[À RENSEIGNER]` |
| 2 | `[À RENSEIGNER]` Atelier Nord | `[À RENSEIGNER]` Web Design | `[À RENSEIGNER]` 2024 | `[À RENSEIGNER — /public/work-2.jpg]` | `[À RENSEIGNER]` |
| 3 *(wide)* | `[À RENSEIGNER]` Lumière Collective | `[À RENSEIGNER]` Art Direction | `[À RENSEIGNER]` 2023 | `[À RENSEIGNER — /public/work-3.jpg]` | `[À RENSEIGNER]` |
| 4 | `[À RENSEIGNER]` Terrain Studio | `[À RENSEIGNER]` Brand Strategy | `[À RENSEIGNER]` 2023 | `[À RENSEIGNER — /public/work-4.jpg]` | `[À RENSEIGNER]` |
| 5 | `[À RENSEIGNER]` Brise Parfums | `[À RENSEIGNER]` Brand + Web | `[À RENSEIGNER]` 2023 | `[À RENSEIGNER — /public/work-5.jpg]` | `[À RENSEIGNER]` |

> 💡 SEO : les titres de projets et catégories sont indexables — utiliser des mots-clés métier réels.

---

## 10. Section Contact

> Style : fond `--surface`, titre H2 large, email éditorial Cormorant, grille 3 colonnes de détails.

### Label
```
[À RENSEIGNER] — actuellement "Get in touch"
```

### Titre H2
```
[À RENSEIGNER]
Actuellement : "Let's build something remarkable together."
Format : phrase principale + <em>fragment italic</em>
```

### Email principal (affiché)
```
[À RENSEIGNER] — actuellement hello@studioskone.com
```

### Détails de contact

| Colonne | Label | Valeur |
|---------|-------|--------|
| Nouveau projet | New business | `[À RENSEIGNER]` email |
| Localisation | Based in | `[À RENSEIGNER]` ex: Paris, France |
| Réseaux | Follow us | Instagram · LinkedIn · Behance |

### URLs réseaux sociaux

| Réseau | URL |
|--------|-----|
| Instagram | `[À RENSEIGNER]` |
| LinkedIn | `[À RENSEIGNER]` |
| Behance | `[À RENSEIGNER]` |

---

## 11. Footer

| Champ | Valeur actuelle | À modifier |
|-------|----------------|------------|
| Copyright | © 2024 Studio Skøne. All rights reserved. | `[À RENSEIGNER]` — année et texte |
| Lien 1 | Instagram | `[À RENSEIGNER — URL]` |
| Lien 2 | LinkedIn | `[À RENSEIGNER — URL]` |

---

## 12. Assets requis

| Fichier | Usage | Statut |
|---------|-------|--------|
| `/public/logo_skone.svg` | Nav + Footer | ✅ Présent |
| `/public/hero_section_headline.png` | — (remplacé par HTML) | 🗑️ Non utilisé |
| `/public/work-1.jpg` à `work-5.jpg` | Miniatures portfolio | ❌ Manquant |
| `/public/og-image.jpg` | Open Graph 1200×630 | ❌ Manquant |
| `/public/favicon.svg` | Onglet navigateur | `[À VÉRIFIER]` |
| `/public/ottho.svg` | Bandeau marquee | ❌ Manquant — placeholder actif |

---

## 13. Checklist avant mise en ligne

- [ ] Renseigner toutes les balises `[À RENSEIGNER]`
- [ ] Corriger `lang="en"` → `lang="fr"` dans index.html
- [ ] Ajouter les balises Open Graph dans `<head>`
- [ ] Ajouter le schema.org JSON-LD dans `<head>`
- [ ] Remplacer les images placeholder du portfolio par de vraies captures
- [ ] Renseigner les URLs réseaux sociaux (Instagram, LinkedIn, Behance)
- [ ] Fournir le logo SVG Ottho pour le marquee
- [ ] Créer l'image OG (1200×630px, fond `--bg`, logo centré)
- [ ] Vérifier le favicon
- [ ] Tester sur mobile (iOS Safari + Android Chrome)
- [ ] Vérifier les scores Lighthouse (Performance, SEO, Accessibilité)

---

*Référence UI complète → `STYLE_GUIDE.md`*
*Dernière mise à jour : avril 2026*

---

## 14. Architecture de page — Version implémentée (avril 2026)

> Structure complète en 11 sections, dans l'ordre exact du HTML.
> Stack : Vanilla TypeScript + Vite. Aucun framework CSS.

### Ordre des sections

| # | ID / Ancre | Composant | Fond | Statut |
|---|-----------|-----------|------|--------|
| — | `#nav` | Navigation fixe | transparent → `--bg` scrollé | ✅ |
| 1 | `#hero` | Hero centré, H1 + H2 italic + 2 CTAs | `--bg` + gradient mesh | ✅ |
| — | `.marquee-section` | Bandeau défilant (Claude · Figma · Ottho · bubble) | transparent | ✅ |
| 2 | `#stats` | 4 stats clés en bande horizontale | `--bg` | ✅ |
| 3 | `#why` | 3 cartes "Ce qui nous distingue" | `--bg` | ✅ |
| 4 | `#work` | Arc carousel horizontal (5 projets) | `--bg` | ✅ |
| 5 | `#services` | 4 expertises sur fond sombre | `--dark` | ✅ |
| 6 | `#process` | Timeline 4 étapes | `--surface` | ✅ |
| 7 | `#tarifs` | 3 formules tarifaires | `--surface` | ✅ |
| 8 | `#testimonials` | 3 témoignages clients | `--bg` | ✅ |
| 9 | `#faq` | Accordion 5 questions | `--surface` | ✅ |
| 10 | `#contact` | Final CTA dark + détails contact | `--dark` | ✅ |
| — | `#footer` | Footer minimal | `--surface` | ✅ |

---

### Section 2 — Stats strip (`#stats .stats-strip`)

4 chiffres clés en ligne séparés par des diviseurs verticaux.

| Stat | Valeur | Label |
|------|--------|-------|
| 1 | 8+ | Années d'expérience |
| 2 | 60+ | Projets livrés |
| 3 | 30+ | Clients accompagnés |
| 4 | 100% | Livrés dans les délais |

Classes : `.stats-row`, `.stat-strip-item`, `.stat-strip-num` (Cormorant, 36–58px), `.stat-strip-label`, `.stat-strip-divider`

---

### Section 3 — Why Studio Skøne (`#why`)

Grille 3 colonnes, cartes avec hover lift.

| # | Titre | Icon |
|---|-------|------|
| 1 | Design premium | ◈ |
| 2 | Livraison rapide | ⚡ |
| 3 | Approche produit | ◎ |

Classes : `.why-grid`, `.why-card`, `.why-icon`, `.why-title`, `.why-desc`

---

### Section 4 — Arc Carousel (`#work`)

Défilement horizontal auto (0.55px/frame) avec effet arc 3D.
Clonage des cartes pour boucle infinie. Drag-to-scroll + boutons Prev/Next.

**5 projets (CSS mockups gradient, pas de vraies images) :**

| Projet | Catégorie | Année | Mockup CSS |
|--------|-----------|-------|-----------|
| Veloria | Application mobile | 2024 | `.work-mockup--veloria` — violet → orange |
| Forma Studio | Site web premium | 2024 | `.work-mockup--forma` — crème/caramel |
| Lune App | MVP & Product design | 2023 | `.work-mockup--lune` — navy SaaS |
| Brume Digital | Landing page | 2023 | `.work-mockup--brume` — forêt verte |
| Kōen | E-commerce & Branding | 2023 | `.work-mockup--koen` — noir/or luxe |

> Remplacer les CSS mockups par de vraies captures : `.work-mockup { background-image: url('/work-X.jpg'); background-size: cover; }`

**Arc JS (main.ts)** : `perspective(1000px) rotateY(--tilt-y) translateY(--translate-y) scale(--card-scale)`
- Tilt max : ±22deg | Dip max : 32px | Scale min : 94%

---

### Section 5 — Services dark (`#services.services-dark`)

Fond `--dark`. Grille 2×2.

| # | Service | Tag prix |
|---|---------|----------|
| 01 | Landing page & Site vitrine | Dès 900€ |
| 02 | Web App & SaaS | Sur devis |
| 03 | Application mobile no-code | Dès 2 500€ |
| 04 | Design Figma & UI/UX | Dès 600€ |

Classes : `.services-dark`, `.sdark-grid`, `.sdark-card`, `.sdark-num`, `.sdark-body`, `.sdark-title`, `.sdark-desc`, `.sdark-tag`, `.sdark-cta`
> Important : utiliser `#services.services-dark` en CSS pour surcharger l'ancienne règle `#services { background: var(--surface) }`.

---

### Section 6 — Process (`#process`)

Timeline 4 étapes horizontale (desktop) / verticale (mobile).
Cercles numérotés reliés par `.process-connector`.

| Étape | Titre |
|-------|-------|
| 01 | Découverte |
| 02 | Design |
| 03 | Développement |
| 04 | Lancement |

Classes : `.process-steps`, `.process-step`, `.process-step-num` (cercle 56×56px, border accent), `.process-step-body`, `.process-step-title`, `.process-step-desc`, `.process-connector`

---

### Section 7 — Tarifs (`#tarifs`)

Grille 3 colonnes. Carte centrale (`--featured`) sur fond `--dark`.

| Formule | Prix | Featured |
|---------|------|----------|
| Essentiel | Dès 900€ | Non |
| Studio ⭐ | Dès 2 500€ | **Oui** — fond `--dark` |
| Sur mesure | Sur devis | Non |

Classes : `.tarifs-grid`, `.tarif-card`, `.tarif-card--featured`, `.tarif-header`, `.tarif-label`, `.tarif-amount` (Cormorant), `.tarif-note`, `.tarif-desc`, `.tarif-list`, `.tarif-cta`
> Tous les CTAs tarifs → `#contact`. Bouton via classe `.btn`.

---

### Section 8 — Témoignages (`#testimonials`)

Grille 3 colonnes. Cartes avec citation Cormorant italic.

| Client | Rôle | Projet associé |
|--------|------|---------------|
| Léa Moreau | Fondatrice, Forma Studio | Forma Studio |
| Thomas Klein | CEO, Lune App | Lune App |
| Nina Saito | Directrice, Kōen | Kōen |

Classes : `.testi-grid`, `.testi-card`, `.testi-quote` (Cormorant italic), `.testi-author`, `.testi-name`, `.testi-role`

---

### Section 9 — FAQ (`#faq`)

Accordion JS (main.ts). 5 questions. Un seul item ouvert à la fois.

| Question |
|----------|
| Quels types de projets acceptez-vous ? |
| Combien coûte un projet ? |
| Quels sont vos délais de livraison ? |
| Travaillez-vous en no-code ou en développement custom ? |
| Comment se passe le suivi après livraison ? |

Classes : `.faq-list`, `.faq-item`, `.faq-item.is-open`, `.faq-question`, `.faq-icon` (+ rotate 45° quand ouvert), `.faq-answer` (max-height: 0 → 300px)
JS : clic sur `.faq-question` → toggle `.is-open` sur `.faq-item`, ferme tous les autres.

---

### Section 10 — Contact / Final CTA (`#contact`)

Fond `--dark`. Centré. Email Cormorant géant + 2 CTAs + grille 3 colonnes détails.

- Email : `hello@studioskone.com`
- CTA primaire : "Démarrer un projet →" (`.hero-btn-primary`)
- CTA secondaire : "Voir les tarifs" → `#tarifs` (`.hero-btn-secondary--light`)

Classes : `.cta-final-inner`, `.cta-final-title`, `.cta-final-email`, `.cta-final-actions`, `.hero-btn-secondary--light`, `.cta-final-details`, `.cta-detail-col`, `.cta-detail-label`, `.social-link--light`
> Surcharge CSS : `#contact { background: var(--dark); }` en bas de style.css (après les règles legacy).

---

## 15. Architecture CSS — Points d'attention

### Surcharges d'ordre (CSS cascade)

Les sections `#services` et `#contact` ont des règles legacy dans le fichier, puis des surcharges en fin de fichier :

```css
/* Legacy (milieu du fichier) */
#services { background: var(--surface); padding-top: 140px; }
#contact  { background: var(--surface); padding-top: 160px; }

/* Surcharges (fin du fichier) — prennent le dessus */
#services.services-dark { background: var(--dark); }
#contact { background: var(--dark); padding-top: 120px; }
```

### Classes utilitaires ajoutées

| Classe | Usage |
|--------|-------|
| `.section-title--light` | Titre H2 blanc sur fond sombre |
| `.section-label--light` | Label accent (idem base — conservé pour cohérence) |
| `.hero-btn-secondary--light` | Ghost button blanc pour section sombre |
| `.social-link--light` | Social pills sur fond sombre |
| `.stat-strip-*` | Stats strip (différencié de `.stat-*` de l'ancien About) |

---

## 16. JavaScript — Points d'attention (main.ts)

| Fonctionnalité | Mécanisme |
|---------------|-----------|
| Hero reveal | Double `requestAnimationFrame` → `.hero-loaded` |
| Scroll reveal | `IntersectionObserver` → `.is-visible` sur `.reveal` |
| Nav scroll state | `scroll` event → `.is-scrolled` à 60px |
| Mobile menu | Toggle `.is-open` sur `#navToggle` et `#navLinks` |
| Arc carousel | `requestAnimationFrame` tick, `scrollLeft += 0.55`, clone-loop, `rotateY/translateY/scale` via CSS props |
| Drag carousel | `mousedown/mousemove/mouseup`, pause on hover/touch |
| FAQ accordion | Clic `.faq-question` → toggle `.is-open` sur `.faq-item`, ferme les autres |
| Smooth scroll | `querySelectorAll('a[href^="#"]')`, offset nav |

---

## 17. Checklist mise à jour (avril 2026)

### Contenu à renseigner
- [ ] URLs réseaux sociaux (Instagram, LinkedIn, Behance) dans `#contact` et `#footer`
- [ ] Vrais noms/rôles témoignages (ou confirmation des placeholders)
- [ ] Vrais projets portfolio (titres, catégories, années)

### Assets à produire
- [ ] `work-1.jpg` à `work-5.jpg` — screenshots projets (ratio ~480×380px)
- [ ] `/public/og-image.jpg` — 1200×630px, fond `--bg` (#FBF4E4), logo centré
- [ ] `/public/ottho.svg` — logo Ottho pour le marquee
- [ ] Vérifier `/public/favicon.svg`

### Technique
- [ ] Tester FAQ accordion sur mobile
- [ ] Vérifier arc carousel sur iOS Safari (momentum scroll)
- [ ] Vérifier scores Lighthouse (cible : Perf 90+, SEO 100, A11y 90+)
- [ ] Ajouter `<link rel="canonical" href="https://www.studioskone.com">` dans `<head>`
