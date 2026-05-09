# Studio Skøne — Redesign éditorial premium

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesigner toutes les sections non-protégées de studio-skone vers une direction éditoriale premium — asymétrique, typographique, non-générique.

**Architecture:** Vanilla TypeScript + Vite. Un seul fichier CSS (`src/style.css`), un seul fichier TS (`src/main.ts`), HTML dans `index.html`. Les sections React (Hero, ContactMultiStepForm) ne sont pas touchées. Toutes les modifications sont dans les fichiers existants — aucun nouveau fichier créé sauf `public/work/` pour les images.

**Tech Stack:** Vite 8, TypeScript 5, Barlow (Google Fonts), Cormorant Garamond (Google Fonts), CSS custom properties, IntersectionObserver API.

---

## Contraintes absolues — NE JAMAIS TOUCHER

- `src/components/Hero.tsx` et `src/components/Hero.module.css`
- `src/components/ContactMultiStepForm.jsx`
- `src/components/contact-form.ts`
- La logique curseur dans `src/main.ts` (lignes ~1–65)
- La logique nav scroll state dans `src/main.ts`
- La logique smooth scroll dans `src/main.ts`

---

## Fichiers modifiés

| Fichier | Rôle |
|---|---|
| `src/style.css` | Tokens CSS, refonte de tous les styles des sections 2–9 |
| `index.html` | Restructuration HTML sections `#approach`, `#work`, `#services`, `#process`, `#tarifs`, `#testimonials`, `#faq` |
| `src/main.ts` | Suppression scatter services, suppression work-stack JS, ajout hover reveal work, ajout rotation témoignages |
| `public/work/` (nouveau répertoire) | 6 images mockup des vrais projets |

---

## Commandes utiles

```bash
# Démarrer le serveur de dev
cd "/Users/adrienbidet/Desktop/Projets claude code/studio-skone"
npm run dev
# → http://localhost:5173

# Vérifier TS sans build
npx tsc --noEmit
```

---

## Task 1 : Tokens CSS et imports typographie

**Fichiers :**
- Modifier : `src/style.css` lignes 1–50 (section `:root`)
- Modifier : `index.html` (vérifier import Google Fonts Cormorant Garamond)

- [ ] **Vérifier que Cormorant Garamond est importé dans `index.html`**

Chercher dans `<head>` de `index.html` :
```html
<link href="https://fonts.googleapis.com/css2?family=Barlow:...&family=Cormorant+Garamond:ital,wght@1,400;1,600&display=swap" rel="stylesheet">
```
Si absent, ajouter `&family=Cormorant+Garamond:ital,wght@1,400;1,600` à l'URL existante.

- [ ] **Remplacer le bloc `:root` dans `src/style.css`**

Remplacer tout le bloc `:root { ... }` existant par :

```css
:root {
  --bg:           #FAEEDF;
  --bg-soft:      #F3E8D7;
  --surface:      #E9D8C2;
  --card:         #FFF8EF;
  --accent:       #C56039;
  --accent-dark:  #A84E2E;
  --dark:         #181716;
  --dark-soft:    #2A2927;
  --text:         #181716;
  --muted:        #6B6B6B;
  --border:       #E2D8CB;

  --grain-opacity: 0.025;
  --glow-accent:   rgba(197, 96, 57, 0.10);
  --shadow-soft:   0 8px 30px rgba(0, 0, 0, 0.08);

  --font-serif:    'Cormorant Garamond', Georgia, serif;
  --font-display:  'Barlow', system-ui, sans-serif;
  --font-sans:     'Barlow', system-ui, sans-serif;

  --ease:       cubic-bezier(0.16, 1, 0.3, 1);
  --duration:   0.7s;
  --transition: var(--duration) var(--ease);
}
```

- [ ] **Ajouter le mixin grain à la fin de `src/style.css`** (avant les media queries finales)

```css
/* ── Grain overlay — appliqué sur sections via .has-grain ── */
.has-grain { position: relative; }
.has-grain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 0;
}
.has-grain > * { position: relative; z-index: 1; }
```

- [ ] **Lancer `npm run dev`, ouvrir http://localhost:5173, vérifier que la page s'affiche correctement (aucune régression)**

- [ ] **Commit**

```bash
git add src/style.css index.html
git commit -m "feat: update CSS tokens — dark #181716, dark-soft #2A2927, grain mixin"
```

---

## Task 2 : Copier les images portfolio dans `public/work/`

**Fichiers :**
- Créer : `public/work/` (répertoire)
- Copier 6 images

- [ ] **Créer le répertoire et copier les images**

```bash
mkdir -p "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work"

cp "/Users/adrienbidet/Desktop/ele - Ateliers Caféologie/ele-ateliers-cafeologie/Capture ancien site/Capture d'écran 2026-04-17 à 14.50.02.png" \
   "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work/cafeo.png"

cp "/Users/adrienbidet/Desktop/MyBoat/Mockup/IMG_1427.jpg" \
   "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work/myboat.jpg"

cp "/Users/adrienbidet/Desktop/Projets claude code/Garantibox/Mockup/dashboard_desktop_mockup.png" \
   "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work/garantibox.png"

cp "/Users/adrienbidet/Desktop/Projets claude code/refonte_site_NiortBasket/mockups/desktop.png" \
   "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work/niortbasket.png"

cp "/Users/adrienbidet/Desktop/Projets claude code/aurem-website/src/assets/hero.png" \
   "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work/aurem.png"

cp "/Users/adrienbidet/Desktop/Projets claude code/Archéon/Mockup/mockup-final-desktop.png" \
   "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work/archeon.png"
```

- [ ] **Vérifier que les 6 fichiers existent**

```bash
ls -lh "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/public/work/"
```
Résultat attendu : 6 fichiers, aucun vide (taille > 0).

- [ ] **Commit**

```bash
git add public/work/
git commit -m "feat: add real project mockups to public/work/"
```

---

## Task 3 : Section Notre approche (`#approach`)

**Fichiers :**
- Modifier : `index.html` — section `id="approach"`
- Modifier : `src/style.css` — bloc `#approach`

- [ ] **Remplacer le HTML de `#approach` dans `index.html`**

Trouver `<section id="approach">` et remplacer tout son contenu par :

```html
<section id="approach" class="has-grain">
  <div class="approach-glow" aria-hidden="true"></div>
  <div class="container approach-inner">
    <p class="section-label reveal">Notre approche</p>
    <h2 class="approach-title reveal">
      Un studio bâti sur<br>l'artisanat <em>et l'intention.</em>
    </h2>
    <div class="approach-mid reveal">
      <div class="approach-mid-gap"></div>
      <p class="approach-mid-text">
        Studio Skøne est une agence créative dédiée à la construction de marques
        qui ressentent autant qu'elles impressionnent. Nous croyons que le grand
        design se trouve à l'intersection de la stratégie, de la beauté et de l'intention.
      </p>
    </div>
  </div>
  <div class="approach-quote-band">
    <div class="container">
      <p class="approach-quote-text">
        "Nous croyons que le grand design se trouve à l'intersection
        de la stratégie, de la beauté et de l'intention."
      </p>
      <span class="approach-quote-author">Studio Skøne</span>
    </div>
  </div>
</section>
```

- [ ] **Ajouter les styles `#approach` dans `src/style.css`** (remplacer le bloc existant `#approach { ... }`)

```css
/* ── Notre approche ── */
#approach {
  background: var(--dark);
  padding: 80px 0 0;
  overflow: hidden;
}
#approach::before {
  content: '';
  position: absolute;
  right: -80px;
  top: -80px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(197,96,57,.09) 0%, transparent 65%);
  pointer-events: none;
}
.approach-inner {
  padding-bottom: 56px;
}
.approach-inner .section-label {
  color: var(--accent);
  margin-bottom: 24px;
}
.approach-title {
  font-size: clamp(36px, 4.5vw, 54px);
  font-weight: 700;
  line-height: 1.02;
  letter-spacing: -0.02em;
  color: var(--bg);
  max-width: 75%;
  margin-bottom: 48px;
}
.approach-title em { font-style: italic; color: var(--accent); }

.approach-mid {
  display: flex;
  gap: 0;
  align-items: flex-start;
}
.approach-mid-gap { flex: 1; }
.approach-mid-text {
  flex: 1;
  font-size: 14px;
  color: rgba(250,238,223,.38);
  line-height: 1.75;
  border-left: 2px solid rgba(197,96,57,.35);
  padding-left: 20px;
}

.approach-quote-band {
  background: var(--dark-soft);
  padding: 36px 0;
}
.approach-quote-text {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(16px, 1.8vw, 22px);
  color: rgba(250,238,223,.55);
  line-height: 1.55;
  max-width: 640px;
}
.approach-quote-author {
  display: block;
  font-size: 10px;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--accent);
  font-weight: 700;
  margin-top: 12px;
}

/* Mobile */
@media (max-width: 768px) {
  .approach-title { max-width: 100%; }
  .approach-mid { flex-direction: column; gap: 24px; }
  .approach-mid-gap { display: none; }
  .approach-mid-text { border-left: none; border-top: 2px solid rgba(197,96,57,.35); padding-left: 0; padding-top: 20px; }
}
```

- [ ] **Vérifier visuellement dans le navigateur** : section sombre, titre blanc oversized, texte décalé à droite avec filet, bande dark-soft avec citation Cormorant

- [ ] **Commit**

```bash
git add index.html src/style.css
git commit -m "feat: redesign #approach — dark billboard + filet accent + quote band"
```

---

## Task 4 : Section Work — liste éditoriale

**Fichiers :**
- Modifier : `index.html` — section `id="work"`
- Modifier : `src/style.css` — bloc `#work`
- Modifier : `src/main.ts` — supprimer les JS du work-stack, ajouter hover reveal

- [ ] **Remplacer le HTML de `#work` dans `index.html`**

Trouver `<section id="work">` et remplacer tout son contenu (jusqu'au `</section>`) par :

```html
<section id="work">
  <div class="container">
    <div class="work-header">
      <div>
        <p class="section-label reveal">Portfolio</p>
        <h2 class="work-title reveal">Travaux sélectionnés</h2>
      </div>
      <span class="work-count" aria-hidden="true">06</span>
    </div>
    <div class="work-list" role="list">

      <div class="work-row reveal" role="listitem" data-project="cafeo">
        <span class="work-num" aria-hidden="true">01</span>
        <div class="work-info">
          <h3 class="work-name">ele — Ateliers Caféologie</h3>
          <p class="work-tagline">Site web &amp; identité pour une école de formation café de spécialité</p>
        </div>
        <span class="work-cat">Site web</span>
        <span class="work-year">2026</span>
        <div class="work-thumb" style="background-image:url('/work/cafeo.png')" aria-hidden="true"></div>
      </div>

      <div class="work-row reveal" role="listitem" data-project="myboat">
        <span class="work-num" aria-hidden="true">02</span>
        <div class="work-info">
          <h3 class="work-name">MyBoat</h3>
          <p class="work-tagline">Marketplace mobile de vente et achat de bateaux en France</p>
        </div>
        <span class="work-cat">App mobile</span>
        <span class="work-year">2026</span>
        <div class="work-thumb" style="background-image:url('/work/myboat.jpg')" aria-hidden="true"></div>
      </div>

      <div class="work-row reveal" role="listitem" data-project="garantibox">
        <span class="work-num" aria-hidden="true">03</span>
        <div class="work-info">
          <h3 class="work-name">Garantibox</h3>
          <p class="work-tagline">Plateforme de gestion et suivi des garanties produit</p>
        </div>
        <span class="work-cat">Web App</span>
        <span class="work-year">2025</span>
        <div class="work-thumb" style="background-image:url('/work/garantibox.png')" aria-hidden="true"></div>
      </div>

      <div class="work-row reveal" role="listitem" data-project="niortbasket">
        <span class="work-num" aria-hidden="true">04</span>
        <div class="work-info">
          <h3 class="work-name">Niort Basket</h3>
          <p class="work-tagline">Refonte du site club — billetterie, boutique et actualités</p>
        </div>
        <span class="work-cat">Site web</span>
        <span class="work-year">2025</span>
        <div class="work-thumb" style="background-image:url('/work/niortbasket.png')" aria-hidden="true"></div>
      </div>

      <div class="work-row reveal" role="listitem" data-project="aurem">
        <span class="work-num" aria-hidden="true">05</span>
        <div class="work-info">
          <h3 class="work-name">Aurem</h3>
          <p class="work-tagline">Site vitrine haut de gamme pour agence immobilière de luxe</p>
        </div>
        <span class="work-cat">Site vitrine</span>
        <span class="work-year">2025</span>
        <div class="work-thumb" style="background-image:url('/work/aurem.png')" aria-hidden="true"></div>
      </div>

      <div class="work-row reveal" role="listitem" data-project="archeon">
        <span class="work-num" aria-hidden="true">06</span>
        <div class="work-info">
          <h3 class="work-name">Archéon</h3>
          <p class="work-tagline">Portfolio &amp; site vitrine pour cabinet d'architecture</p>
        </div>
        <span class="work-cat">Portfolio</span>
        <span class="work-year">2025</span>
        <div class="work-thumb" style="background-image:url('/work/archeon.png')" aria-hidden="true"></div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Ajouter les styles `#work` dans `src/style.css`** (remplacer le bloc `#work { ... }` existant et tout le CSS `.work-stack*`, `.work-card*` qui ne sert plus)

```css
/* ── Work — liste éditoriale ── */
#work {
  background: var(--bg);
  padding: 100px 0;
}
.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 48px;
}
.work-title {
  font-size: clamp(32px, 3.5vw, 42px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.work-count {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 64px;
  font-weight: 600;
  color: var(--accent);
  opacity: .18;
  line-height: 1;
}
.work-list {
  border-top: 1px solid var(--border);
}
.work-row {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px 0;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: padding-left 0.3s var(--ease);
}
.work-row:hover { padding-left: 10px; }
.work-num {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .15em;
  color: var(--accent);
  min-width: 28px;
}
.work-info { flex: 1; min-width: 0; }
.work-name {
  font-size: 21px;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.work-tagline {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.35s var(--ease), opacity 0.35s var(--ease);
}
.work-row:hover .work-tagline { max-height: 24px; opacity: 1; }
.work-cat {
  font-size: 11px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--muted);
  min-width: 110px;
  text-align: right;
}
.work-year {
  font-size: 12px;
  color: var(--muted);
  min-width: 36px;
  text-align: right;
}
.work-thumb {
  width: 64px;
  height: 48px;
  border-radius: 8px;
  flex-shrink: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transform: translateX(12px);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.work-row:hover .work-thumb { opacity: 1; transform: translateX(0); }

@media (max-width: 768px) {
  .work-cat, .work-year { display: none; }
  .work-thumb { width: 48px; height: 36px; }
  .work-name { font-size: 17px; }
}
```

- [ ] **Supprimer la logique work-stack de `src/main.ts`**

Dans `src/main.ts`, trouver et supprimer tout bloc commenté `// Work stack` ou similaire qui gère `.work-stack-card`, `.work-stack-item`. Ces classes n'existent plus.

Si aucun bloc spécifique n'est trouvé (la section work peut ne pas avoir de JS propre), passer à l'étape suivante.

- [ ] **Vérifier `npx tsc --noEmit` passe sans erreur**

```bash
npx tsc --noEmit
```
Résultat attendu : aucune sortie (pas d'erreur).

- [ ] **Vérifier visuellement** : liste de 6 projets, hover → tagline et vignette apparaissent, padding-left augmente

- [ ] **Commit**

```bash
git add index.html src/style.css src/main.ts
git commit -m "feat: redesign #work — editorial list with hover reveal, 6 real projects"
```

---

## Task 5 : Section Services (`#services`)

**Fichiers :**
- Modifier : `index.html` — section `id="services"`
- Modifier : `src/style.css` — bloc `.services-dark`, `.sdark-*`
- Modifier : `src/main.ts` — supprimer `applyServicesScatter`

- [ ] **Remplacer le HTML de `#services` dans `index.html`**

Trouver `<section id="services" class="services-dark">` et remplacer tout le contenu par :

```html
<section id="services" class="has-grain">
  <div class="services-glow" aria-hidden="true"></div>
  <div class="container">
    <div class="services-header">
      <p class="section-label reveal">Ce que nous faisons</p>
      <h2 class="services-title reveal">Nos <em>expertises</em></h2>
    </div>
    <div class="services-grid">
      <div class="service-card reveal">
        <span class="service-num">01</span>
        <h3 class="service-title">Landing page &amp; Site vitrine</h3>
        <p class="service-desc">Sites rapides, orientés conversion, responsive. Du one-pager au site multi-pages sur mesure.</p>
        <span class="service-tag">Dès 900€</span>
      </div>
      <div class="service-card reveal">
        <span class="service-num">02</span>
        <h3 class="service-title">Web App &amp; SaaS</h3>
        <p class="service-desc">Applications complexes, back-office, interfaces métier. Conception et développement complets.</p>
        <span class="service-tag">Sur devis</span>
      </div>
      <div class="service-card reveal">
        <span class="service-num">03</span>
        <h3 class="service-title">Application mobile</h3>
        <p class="service-desc">Apps iOS &amp; Android, de la maquette au déploiement sur les stores. UX pensée mobile-first.</p>
        <span class="service-tag">Dès 2 500€</span>
      </div>
      <div class="service-card reveal">
        <span class="service-num">04</span>
        <h3 class="service-title">Direction artistique &amp; UI</h3>
        <p class="service-desc">Maquettes, design systems, prototypes haute fidélité. Identité visuelle et cohérence de marque.</p>
        <span class="service-tag">Dès 600€</span>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Remplacer les styles services dans `src/style.css`**

Trouver et remplacer tout le bloc `#services`, `.services-dark`, `.sdark-*` par :

```css
/* ── Services ── */
#services {
  background: var(--dark);
  padding: 100px 0;
  overflow: hidden;
}
.services-glow {
  position: absolute;
  right: -80px;
  top: -80px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(197,96,57,.09) 0%, transparent 65%);
  pointer-events: none;
}
.services-header { margin-bottom: 56px; }
.services-header .section-label { color: var(--accent); }
.services-title {
  font-size: clamp(32px, 3.5vw, 42px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  color: var(--bg);
}
.services-title em { font-style: italic; color: var(--accent); }

.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.service-card {
  background: var(--dark-soft);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 16px;
  padding: 28px;
  transition: border-color 0.3s var(--ease), transform 0.4s var(--ease);
  cursor: default;
}
.service-card:hover {
  border-color: rgba(197,96,57,.35);
  transform: translateY(-4px);
}
.service-num {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .18em;
  color: var(--accent);
  margin-bottom: 16px;
}
.service-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--bg);
  margin-bottom: 8px;
  line-height: 1.2;
}
.service-desc {
  font-size: 13px;
  color: rgba(250,238,223,.38);
  line-height: 1.6;
  margin-bottom: 20px;
}
.service-tag {
  display: inline-block;
  padding: 4px 10px;
  background: rgba(197,96,57,.15);
  border: 1px solid rgba(197,96,57,.25);
  border-radius: 6px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--accent);
}

@media (max-width: 768px) {
  .services-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Supprimer `applyServicesScatter` de `src/main.ts`**

Trouver et supprimer le bloc entier :
```
// Services cards — scatter au scroll (style krumzi)
const sdarkCards = ...
```
jusqu'à la fermeture du bloc `if (sdarkCards.length) { ... }` (~lignes 108–162 dans main.ts actuel).

- [ ] **Vérifier `npx tsc --noEmit` passe**

- [ ] **Vérifier visuellement** : fond `#181716`, 4 cards `#2A2927`, hover lift + border accent, grain en overlay

- [ ] **Commit**

```bash
git add index.html src/style.css src/main.ts
git commit -m "feat: redesign #services — dark grid 2×2, remove scatter animation"
```

---

## Task 6 : Section Process (`#process`)

**Fichiers :**
- Modifier : `index.html` — section `id="process"`
- Modifier : `src/style.css` — bloc `#process`

- [ ] **Remplacer le HTML de `#process` dans `index.html`**

Trouver `<section id="process">` et remplacer tout le contenu par :

```html
<section id="process" class="has-grain">
  <div class="container">
    <div class="process-header">
      <p class="section-label reveal">Comment on travaille</p>
      <h2 class="process-main-title reveal">4 étapes,<br>0 surprise.</h2>
    </div>
    <div class="process-grid">
      <div class="process-card reveal">
        <span class="process-bg-num" aria-hidden="true">01</span>
        <span class="process-tag">Découverte</span>
        <h3 class="process-card-title">Cadrage du projet</h3>
        <p class="process-card-text">On discute de vos objectifs, de vos cibles et de vos contenus. On organise un ou plusieurs ateliers pour définir ensemble l'arborescence et le plan de site.</p>
      </div>
      <div class="process-card reveal">
        <span class="process-bg-num" aria-hidden="true">02</span>
        <span class="process-tag">Design</span>
        <h3 class="process-card-title">Conception visuelle</h3>
        <p class="process-card-text">Chaque écran est validé avec vous avant le développement. Direction artistique, typographie, mise en page — rien ne part en prod sans validation.</p>
      </div>
      <div class="process-card reveal">
        <span class="process-bg-num" aria-hidden="true">03</span>
        <span class="process-tag">Développement</span>
        <h3 class="process-card-title">Build &amp; intégration</h3>
        <p class="process-card-text">On donne vie aux maquettes. Pixel-perfect, testé sur tous les supports, optimisé pour la performance. Vous suivez l'avancement en temps réel.</p>
      </div>
      <div class="process-card reveal">
        <span class="process-bg-num" aria-hidden="true">04</span>
        <span class="process-tag">Lancement</span>
        <h3 class="process-card-title">Mise en ligne &amp; suivi</h3>
        <p class="process-card-text">Déploiement, formation à la prise en main, suivi post-lancement inclus. On reste disponibles pour les ajustements et les évolutions.</p>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Remplacer les styles `#process` dans `src/style.css`**

```css
/* ── Process ── */
#process {
  background: var(--surface);
  padding: 100px 0;
}
.process-header { margin-bottom: 64px; }
.process-main-title {
  font-size: clamp(32px, 3.5vw, 42px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-top: 16px;
}
.process-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.process-card {
  background: var(--bg);
  border-radius: 16px;
  padding: 32px 28px;
  position: relative;
  overflow: hidden;
}
.process-bg-num {
  position: absolute;
  top: -8px;
  right: 8px;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 88px;
  font-weight: 600;
  color: var(--accent);
  opacity: .08;
  line-height: 1;
  pointer-events: none;
  user-select: none;
}
.process-tag {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}
.process-card-title {
  font-size: 17px;
  font-weight: 700;
  margin-bottom: 10px;
  position: relative;
}
.process-card-text {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.65;
  position: relative;
}

@media (max-width: 768px) {
  .process-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Vérifier visuellement** : fond `--surface`, 4 cards sur fond `--bg`, numéros Cormorant en fond, tag accent

- [ ] **Commit**

```bash
git add index.html src/style.css
git commit -m "feat: redesign #process — 2×2 grid with oversized Cormorant numbers"
```

---

## Task 7 : Section Tarifs (`#tarifs`)

**Fichiers :**
- Modifier : `src/style.css` — bloc `#tarifs`, `.tarif-*`

La structure HTML des tarifs est déjà correcte. Mise à jour CSS uniquement.

- [ ] **Mettre à jour les styles tarifs dans `src/style.css`**

Trouver le bloc `#tarifs { ... }` et `.tarif-*` et remplacer par :

```css
/* ── Tarifs ── */
#tarifs {
  background: var(--bg);
  padding: 100px 0;
}
.tarifs-header { margin-bottom: 56px; }
.tarifs-title {
  font-size: clamp(32px, 3.5vw, 42px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-top: 16px;
}
.tarifs-grid {
  display: grid;
  grid-template-columns: 1fr 1.1fr 1fr;
  gap: 16px;
  align-items: start;
}
.tarif-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 36px 28px;
}
.tarif-card--featured {
  background: var(--dark);
  border-color: transparent;
  position: relative;
  overflow: hidden;
}
.tarif-card--featured::before {
  content: '';
  position: absolute;
  top: -80px;
  right: -60px;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(197,96,57,.12) 0%, transparent 65%);
  pointer-events: none;
}
.tarif-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}
.tarif-amount {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(36px, 3vw, 48px);
  font-weight: 600;
  color: var(--dark);
  line-height: 1;
}
.tarif-card--featured .tarif-amount { color: var(--bg); }
.tarif-note {
  font-size: 12px;
  color: var(--muted);
  margin-top: 4px;
}
.tarif-card--featured .tarif-note { color: rgba(250,238,223,.35); }
.tarif-divider {
  height: 1px;
  background: var(--border);
  margin: 24px 0;
}
.tarif-card--featured .tarif-divider { background: rgba(255,255,255,.08); }
.tarif-desc {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.6;
  margin-bottom: 20px;
}
.tarif-card--featured .tarif-desc { color: rgba(250,238,223,.45); }
.tarif-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 28px;
}
.tarif-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: var(--dark);
  line-height: 1.4;
}
.tarif-item::before { content: '—'; color: var(--accent); font-weight: 700; flex-shrink: 0; }
.tarif-card--featured .tarif-item { color: rgba(250,238,223,.7); }
.tarif-cta {
  display: block;
  text-align: center;
  padding: 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  text-decoration: none;
  transition: all 0.3s var(--ease);
  position: relative;
}
.tarif-cta--ghost {
  background: transparent;
  border: 1.5px solid var(--border);
  color: var(--dark);
}
.tarif-cta--ghost:hover { border-color: var(--accent); color: var(--accent); }
.tarif-cta--primary {
  background: var(--accent);
  color: var(--bg);
  border: none;
  box-shadow: 0 4px 16px rgba(197,96,57,.3);
}
.tarif-cta--primary:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(197,96,57,.38);
}

@media (max-width: 900px) {
  .tarifs-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Mettre à jour les classes des CTAs dans `index.html`** (section `#tarifs`)

Dans le HTML des tarifs, remplacer les classes `btn` des boutons :
- Boutons latéraux : ajouter la classe `tarif-cta--ghost`
- Bouton central (featured) : ajouter la classe `tarif-cta--primary`

- [ ] **Vérifier visuellement** : 3 colonnes, carte centrale dark avec glow, montants en Cormorant italic

- [ ] **Commit**

```bash
git add index.html src/style.css
git commit -m "feat: redesign #tarifs — dark featured card, Cormorant amounts"
```

---

## Task 8 : Section Témoignages (`#testimonials`)

**Fichiers :**
- Modifier : `index.html` — section `id="testimonials"`
- Modifier : `src/style.css` — bloc `#testimonials`
- Modifier : `src/main.ts` — ajouter rotation automatique

- [ ] **Remplacer le HTML de `#testimonials` dans `index.html`**

```html
<section id="testimonials" class="has-grain">
  <div class="container">
    <p class="section-label testi-label reveal">Ce que nos clients disent</p>
    <div class="testi-inner">
      <span class="testi-mark" aria-hidden="true">"</span>
      <div class="testi-slides" role="region" aria-live="polite">

        <div class="testi-slide is-active">
          <blockquote class="testi-quote">"Studio Skøne a transformé notre idée en un produit que nous sommes fiers de montrer. Livraison en 4 semaines, aucune surprise, résultat au-delà de nos espérances."</blockquote>
          <div class="testi-author">Léa Moreau</div>
          <div class="testi-role">Fondatrice, Forma Studio</div>
        </div>

        <div class="testi-slide">
          <blockquote class="testi-quote">"L'approche produit de l'équipe est remarquable. Ils pensent business avant design — et ça change tout. Notre taux de conversion a augmenté de 40% dès le lancement."</blockquote>
          <div class="testi-author">Thomas Klein</div>
          <div class="testi-role">CEO, Lune App</div>
        </div>

        <div class="testi-slide">
          <blockquote class="testi-quote">"Une collaboration fluide, un résultat exceptionnel. Studio Skøne a su capturer l'essence de notre marque et la traduire en une expérience digitale mémorable."</blockquote>
          <div class="testi-author">Nina Saito</div>
          <div class="testi-role">Directrice, Kōen</div>
        </div>

      </div>
      <div class="testi-nav" role="tablist" aria-label="Témoignages">
        <button class="testi-dot is-active" role="tab" aria-selected="true" aria-label="Témoignage 1" data-idx="0"></button>
        <button class="testi-dot" role="tab" aria-selected="false" aria-label="Témoignage 2" data-idx="1"></button>
        <button class="testi-dot" role="tab" aria-selected="false" aria-label="Témoignage 3" data-idx="2"></button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Ajouter les styles `#testimonials` dans `src/style.css`**

```css
/* ── Témoignages ── */
#testimonials {
  background: var(--surface);
  padding: 100px 0;
  text-align: center;
}
.testi-label { margin-bottom: 40px; }
.testi-inner { max-width: 800px; margin: 0 auto; }
.testi-mark {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 96px;
  font-weight: 600;
  color: var(--accent);
  opacity: .12;
  line-height: .8;
  display: block;
  margin-bottom: 4px;
}
.testi-slides { position: relative; min-height: 160px; }
.testi-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  transform: translateX(24px);
  transition: opacity 0.5s var(--ease), transform 0.5s var(--ease);
  pointer-events: none;
}
.testi-slide.is-active {
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
  position: relative;
}
.testi-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(20px, 2.2vw, 28px);
  color: var(--dark);
  line-height: 1.45;
  quotes: none;
}
.testi-author {
  margin-top: 28px;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: .08em;
  color: var(--dark);
}
.testi-role { font-size: 12px; color: var(--muted); margin-top: 4px; }
.testi-nav {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 36px;
}
.testi-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--border);
  border: none;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, transform 0.2s;
}
.testi-dot.is-active { background: var(--accent); transform: scale(1.3); }
.testi-dot:hover { background: var(--accent); }
```

- [ ] **Ajouter la logique de rotation dans `src/main.ts`**

Ajouter à la fin du fichier, avant la dernière accolade éventuelle :

```typescript
// ============================================================
// Témoignages — rotation automatique
// ============================================================
;(function initTestimonials() {
  const slides = Array.from(document.querySelectorAll<HTMLElement>('.testi-slide'))
  const dots   = Array.from(document.querySelectorAll<HTMLElement>('.testi-dot'))
  if (!slides.length) return

  let current = 0
  let timer: ReturnType<typeof setInterval>

  function goTo(idx: number): void {
    slides[current].classList.remove('is-active')
    dots[current].classList.remove('is-active')
    dots[current].setAttribute('aria-selected', 'false')
    current = idx
    slides[current].classList.add('is-active')
    dots[current].classList.add('is-active')
    dots[current].setAttribute('aria-selected', 'true')
  }

  function startTimer(): void {
    timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 5000)
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      clearInterval(timer)
      goTo(Number(dot.dataset.idx))
      startTimer()
    })
  })

  startTimer()
})()
```

- [ ] **Vérifier `npx tsc --noEmit` passe**

- [ ] **Vérifier visuellement** : guillemet Cormorant géant, citation en Cormorant italic, rotation automatique toutes les 5s, clic sur points fonctionne

- [ ] **Commit**

```bash
git add index.html src/style.css src/main.ts
git commit -m "feat: redesign #testimonials — full-width rotating quote, Cormorant italic"
```

---

## Task 9 : Section FAQ (`#faq`)

**Fichiers :**
- Modifier : `index.html` — section `id="faq"` (markup uniquement)
- Modifier : `src/style.css` — bloc `#faq`
- `src/main.ts` — logique accordion existante conservée, seul le sélecteur change si nécessaire

- [ ] **Remplacer le HTML de `#faq` dans `index.html`**

```html
<section id="faq">
  <div class="container">
    <div class="faq-header">
      <div>
        <p class="section-label reveal">Questions fréquentes</p>
        <h2 class="faq-title reveal">On répond<br>à tout.</h2>
      </div>
      <span class="faq-count" aria-hidden="true">05</span>
    </div>
    <div class="faq-list" role="list">

      <div class="faq-item" role="listitem">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-num" aria-hidden="true">01</span>
          <span class="faq-q-text">Quels types de projets acceptez-vous ?</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" hidden>
          <p>Sites vitrines, landing pages, web apps, SaaS, applications mobiles et direction artistique. Nous travaillons avec des startups, des PME et des créateurs de marque qui veulent des produits digitaux premium.</p>
        </div>
      </div>

      <div class="faq-item" role="listitem">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-num" aria-hidden="true">02</span>
          <span class="faq-q-text">Combien coûte un projet ?</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" hidden>
          <p>Nos formules démarrent à 900€ pour un site vitrine. Pour les projets complexes, nous établissons un devis sur mesure. Contactez-nous pour en discuter — nous sommes transparents sur les prix dès le premier appel.</p>
        </div>
      </div>

      <div class="faq-item" role="listitem">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-num" aria-hidden="true">03</span>
          <span class="faq-q-text">Quels sont vos délais de livraison ?</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" hidden>
          <p>En général : 3 semaines pour un site essentiel, 6 semaines pour une offre Studio complète. Les délais sont définis ensemble au cadrage et respectés — c'est une promesse, pas une estimation.</p>
        </div>
      </div>

      <div class="faq-item" role="listitem">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-num" aria-hidden="true">04</span>
          <span class="faq-q-text">Comment se passe la collaboration au quotidien ?</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" hidden>
          <p>Un point de démarrage, des ateliers de cadrage, des validations par étape. Vous avez toujours un accès direct à votre interlocuteur — pas de compte rendu en retard, pas de surprise.</p>
        </div>
      </div>

      <div class="faq-item" role="listitem">
        <button class="faq-question" aria-expanded="false">
          <span class="faq-num" aria-hidden="true">05</span>
          <span class="faq-q-text">Comment se passe le suivi après livraison ?</span>
          <span class="faq-icon" aria-hidden="true">+</span>
        </button>
        <div class="faq-answer" hidden>
          <p>Formation à la prise en main, suivi 30 jours inclus. Pour les évolutions et la maintenance, nous proposons des formules de suivi adaptées à vos besoins.</p>
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Mettre à jour les sélecteurs FAQ dans `src/main.ts`**

Trouver le bloc FAQ dans `src/main.ts`. Vérifier que les sélecteurs correspondent au nouveau HTML :
- `.faq-item` → inchangé ✓
- `.faq-question` → inchangé ✓
- `.faq-answer` → remplace `.faq-body` si ce nom était utilisé
- Ajouter gestion `hidden` attribute sur `.faq-answer` :

```typescript
document.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
  const btn    = item.querySelector<HTMLButtonElement>('.faq-question')
  const answer = item.querySelector<HTMLElement>('.faq-answer')
  if (!btn || !answer) return

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open')
    // Fermer tous
    document.querySelectorAll<HTMLElement>('.faq-item.is-open').forEach((openItem) => {
      openItem.classList.remove('is-open')
      openItem.querySelector<HTMLButtonElement>('.faq-question')?.setAttribute('aria-expanded', 'false')
      const a = openItem.querySelector<HTMLElement>('.faq-answer')
      if (a) a.hidden = true
    })
    if (!isOpen) {
      item.classList.add('is-open')
      btn.setAttribute('aria-expanded', 'true')
      answer.hidden = false
    }
  })
})
```

- [ ] **Remplacer les styles FAQ dans `src/style.css`**

```css
/* ── FAQ ── */
#faq {
  background: var(--bg);
  padding: 100px 0;
}
.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 56px;
}
.faq-title {
  font-size: clamp(32px, 3.5vw, 42px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.01em;
  margin-top: 16px;
}
.faq-count {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 64px;
  font-weight: 600;
  color: var(--accent);
  opacity: .18;
  line-height: 1;
}
.faq-list { border-top: 1px solid var(--border); }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-question {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 22px 0;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--text);
  font-family: var(--font-sans);
}
.faq-num {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  font-weight: 600;
  color: var(--accent);
  opacity: .4;
  min-width: 28px;
}
.faq-q-text {
  font-size: 17px;
  font-weight: 700;
  flex: 1;
}
.faq-icon {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 1.5px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: var(--accent);
  flex-shrink: 0;
  transition: transform 0.25s var(--ease), border-color 0.25s;
  line-height: 1;
}
.faq-item.is-open .faq-icon { transform: rotate(45deg); border-color: var(--accent); }
.faq-item.is-open .faq-q-text { color: var(--accent); }
.faq-answer {
  padding: 0 48px 20px;
  font-size: 14px;
  color: var(--muted);
  line-height: 1.7;
}
.faq-answer[hidden] { display: none; }
```

- [ ] **Vérifier `npx tsc --noEmit` passe**

- [ ] **Vérifier visuellement** : titres H2 éditoriaux, numéros Cormorant, compteur `05`, accordion fonctionne

- [ ] **Commit**

```bash
git add index.html src/style.css src/main.ts
git commit -m "feat: redesign #faq — editorial accordion, Cormorant numbers"
```

---

## Task 10 : Section Contact — habillage (`#contact`)

**Fichiers :**
- Modifier : `index.html` — section `id="contact"` (wrapping uniquement)
- Modifier : `src/style.css` — bloc `#contact`
- `ContactMultiStepForm.jsx` : **NE PAS TOUCHER**

- [ ] **Vérifier comment `#contact` est actuellement structuré dans `index.html`**

```bash
grep -n "id=\"contact\"" -A 5 "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/index.html"
```

La section `#contact` est actuellement vide (`<section id="contact"></section>`). Le formulaire est injecté par React via `contact-form.ts`. Ne pas modifier la structure de l'injection.

- [ ] **Ajouter du markup d'habillage autour du point d'injection du formulaire**

Remplacer `<section id="contact"></section>` par :

```html
<section id="contact" class="has-grain">
  <div class="contact-glow" aria-hidden="true"></div>
  <div class="container contact-inner">
    <p class="section-label contact-label reveal">Travaillons ensemble</p>
    <h2 class="contact-title reveal">
      Construisons quelque chose <em>de remarquable.</em>
    </h2>
    <a href="mailto:hello@studioskone.com" class="contact-email reveal">
      hello@studioskone.com
    </a>
    <!-- ContactMultiStepForm monte ici via contact-form.ts -->
    <div id="contact-form-root"></div>
    <div class="contact-details reveal">
      <div class="contact-col">
        <span class="contact-col-label">New business</span>
        <span class="contact-col-val">hello@studioskone.com</span>
      </div>
      <div class="contact-col">
        <span class="contact-col-label">Basé à</span>
        <span class="contact-col-val">Paris, France — Remote</span>
      </div>
      <div class="contact-col">
        <span class="contact-col-label">Suivez-nous</span>
        <div class="contact-social">
          <a href="#" class="social-link--light">Instagram</a>
          <a href="#" class="social-link--light">LinkedIn</a>
          <a href="#" class="social-link--light">Behance</a>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Vérifier dans `src/components/contact-form.ts` le sélecteur de montage React**

```bash
grep -n "mount\|getElementById\|querySelector\|contact" "/Users/adrienbidet/Desktop/Projets claude code/studio-skone/src/components/contact-form.ts" | head -10
```

Si le formulaire monte sur `#contact` directement, mettre à jour le sélecteur pour `#contact-form-root`. Si le sélecteur est ailleurs, adapter le `div id="contact-form-root"` en conséquence. **Ne modifier que le sélecteur de montage, pas la logique.**

- [ ] **Ajouter les styles `#contact` dans `src/style.css`**

```css
/* ── Contact ── */
#contact {
  background: var(--dark);
  padding: 100px 0 80px;
  overflow: hidden;
}
.contact-glow {
  position: absolute;
  left: -100px;
  top: -100px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(197,96,57,.09) 0%, transparent 65%);
  pointer-events: none;
}
.contact-inner { position: relative; z-index: 1; }
.contact-label { color: var(--accent); margin-bottom: 28px; }
.contact-title {
  font-size: clamp(32px, 3.5vw, 44px);
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.015em;
  color: var(--bg);
  max-width: 640px;
  margin-bottom: 16px;
}
.contact-title em { font-style: italic; color: var(--accent); }
.contact-email {
  display: block;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 600;
  color: rgba(250,238,223,.55);
  margin-bottom: 48px;
  text-decoration: none;
  transition: color 0.3s;
}
.contact-email:hover { color: var(--accent); }
.contact-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0;
  padding-top: 48px;
  border-top: 1px solid rgba(255,255,255,.07);
  margin-top: 48px;
}
.contact-col + .contact-col { border-left: 1px solid rgba(255,255,255,.07); padding-left: 32px; }
.contact-col-label {
  display: block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 10px;
}
.contact-col-val {
  font-size: 14px;
  color: rgba(250,238,223,.55);
  line-height: 1.6;
}
.contact-social { display: flex; flex-direction: column; gap: 4px; }
.social-link--light {
  font-size: 14px;
  color: rgba(250,238,223,.55);
  text-decoration: none;
  transition: color 0.2s;
}
.social-link--light:hover { color: var(--accent); }

@media (max-width: 768px) {
  .contact-details { grid-template-columns: 1fr; gap: 24px; }
  .contact-col + .contact-col { border-left: none; padding-left: 0; border-top: 1px solid rgba(255,255,255,.07); padding-top: 24px; }
}
```

- [ ] **Vérifier `npx tsc --noEmit` passe**

- [ ] **Vérifier visuellement** : fond dark, titre blanc, email Cormorant italic, grille 3 colonnes, formulaire multi-step toujours fonctionnel

- [ ] **Commit final**

```bash
git add index.html src/style.css src/components/contact-form.ts
git commit -m "feat: redesign #contact layout — dark section with Cormorant email, form preserved"
```

---

## Self-review plan

**Couverture spec :**
- ✅ Tokens dark/dark-soft — Task 1
- ✅ Notre approche dark billboard — Task 3
- ✅ Work liste éditoriale 6 projets — Tasks 2 + 4
- ✅ Services dark grid 2×2 — Task 5
- ✅ Process grid 2×2 Cormorant — Task 6
- ✅ Tarifs dark card featured — Task 7
- ✅ Témoignages citation rotative — Task 8
- ✅ FAQ accordion éditorial — Task 9
- ✅ Contact layout amélioré, form protégé — Task 10
- ✅ Grain appliqué sur sections concernées via `.has-grain`
- ✅ Stats strip supprimé (non présent dans le nouveau HTML)

**Contraintes respectées :**
- Hero.tsx / Hero.module.css : non mentionnés dans aucune tâche ✅
- ContactMultiStepForm.jsx : explicitement protégé en Task 10 ✅
- Curseur JS : non modifié ✅
- Nav / smooth scroll : non modifiés ✅

**Cohérence des types :**
- `testi-slide` → `is-active` cohérent entre HTML, CSS et TS ✅
- `faq-answer` → `hidden` attribute cohérent entre HTML, CSS et TS ✅
- `.has-grain > *` → `z-index: 1` nécessaire pour que le contenu passe devant le grain ✅
