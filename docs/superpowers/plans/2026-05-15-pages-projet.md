# Pages de détail projet — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer 6 pages de détail projet (Vite MPA) accessibles depuis les cartes du carousel `#work`, avec nav, hero, galerie, contexte, témoignage et CTA.

**Architecture:** Chaque projet est un fichier HTML statique dans `/projets/` déclaré comme point d'entrée Vite. Un script partagé `projet-page.ts` gère les interactions (cursor, reveal, nav scroll). Le contenu est dans le HTML pour le SEO.

**Tech Stack:** Vite, TypeScript vanilla, CSS custom properties (variables de `style.css`), Bricolage Grotesque Variable.

---

## Fichiers créés / modifiés

| Fichier | Action | Rôle |
|---|---|---|
| `src/styles/projet-page.css` | Créer | Styles de toutes les pages projet |
| `src/projet-page.ts` | Créer | Interactions partagées (cursor, reveal, nav) |
| `projets/myboat.html` | Créer | Page MyBoat |
| `projets/garantibox.html` | Créer | Page Garantibox |
| `projets/cafeo.html` | Créer | Page ele — Ateliers Caféologie |
| `projets/niort-basket.html` | Créer | Page Niort Basket |
| `projets/aurem.html` | Créer | Page Aurem |
| `projets/archeon.html` | Créer | Page Archéon |
| `vite.config.ts` | Modifier | Ajouter 6 points d'entrée |
| `index.html` | Modifier | Mettre à jour les 6 liens work-card-cta |

---

## Task 1 : CSS — `src/styles/projet-page.css`

**Files:**
- Create: `src/styles/projet-page.css`

- [ ] **Créer le fichier CSS**

```css
/* ============================================================
   PROJET PAGE — Styles spécifiques
   Chargé via projet-page.ts (qui importe aussi style.css)
   ============================================================ */

/* ── Layout de base ── */
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--font-sans);
  overflow-x: clip;
}

.projet-divider {
  height: 1px;
  background: var(--border);
  margin: 0 32px;
}

/* ── NAV ── */
.projet-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(250, 238, 223, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s var(--ease), background 0.3s var(--ease);
}

.projet-nav.is-scrolled {
  border-color: var(--border);
  background: rgba(250, 238, 223, 0.96);
}

.projet-nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.projet-nav-logo img {
  display: block;
}

.projet-nav-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  text-decoration: none;
  transition: opacity 0.2s;
}

.projet-nav-back:hover { opacity: 0.7; }

.projet-nav-back svg {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* ── HERO ── */
.projet-hero {
  padding: 56px 32px 48px;
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 56px;
  align-items: flex-start;
}

.projet-badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
  border: 1.5px solid var(--accent);
  border-radius: 20px;
  padding: 4px 12px;
  margin-bottom: 16px;
}

.projet-title {
  font-size: clamp(36px, 5vw, 52px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  color: var(--dark);
  margin-bottom: 8px;
}

.projet-type {
  font-size: 14px;
  color: var(--muted);
  margin-bottom: 24px;
}

.projet-desc {
  font-size: 16px;
  line-height: 1.75;
  color: #3a3a3a;
  max-width: 480px;
}

.projet-visual {
  border-radius: 12px;
  border: 2px solid var(--dark);
  box-shadow: 6px 6px 0 rgba(24, 23, 22, 0.12);
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.projet-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── GALERIE ── */
.projet-gallery {
  padding: 40px 32px;
  max-width: 1100px;
  margin: 0 auto;
}

.projet-gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-top: 16px;
}

.projet-gallery-item {
  border-radius: 8px;
  border: 1.5px solid var(--border);
  overflow: hidden;
  position: relative;
  aspect-ratio: 4 / 3;
  display: flex;
  align-items: flex-end;
}

.projet-gallery-item--wide {
  grid-column: span 2;
  aspect-ratio: 16 / 9;
}

.projet-gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.projet-gallery-placeholder {
  background: linear-gradient(135deg, var(--surface) 0%, #c8b098 100%);
}

.projet-gallery-label {
  position: absolute;
  bottom: 8px;
  left: 8px;
  font-size: 8px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  background: rgba(24, 23, 22, 0.65);
  color: #faeedf;
  padding: 3px 8px;
  border-radius: 3px;
  pointer-events: none;
}

/* ── CONTEXTE ── */
.projet-context {
  padding: 40px 32px;
  max-width: 1100px;
  margin: 0 auto;
}

.projet-context-text {
  font-size: 15px;
  line-height: 1.8;
  color: #3a3a3a;
  max-width: 700px;
}

.projet-context-text + .projet-context-text {
  margin-top: 16px;
}

/* ── TÉMOIGNAGE ── */
.projet-testi {
  margin: 0 32px 48px;
  max-width: calc(1100px - 64px);
  margin-left: auto;
  margin-right: auto;
  background: var(--dark);
  border-radius: 12px;
  padding: 28px 32px;
  border: 1.5px solid var(--dark-soft);
}

.projet-testi-quote {
  font-size: 16px;
  font-style: italic;
  color: #e9d8c2;
  line-height: 1.7;
  margin-bottom: 20px;
}

.projet-testi-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.projet-testi-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--accent);
  color: #faeedf;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.projet-testi-name {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #faeedf;
}

.projet-testi-role {
  display: block;
  font-size: 11px;
  color: #8a7a6a;
}

/* ── CTA FINAL ── */
.projet-cta-section {
  margin: 0 32px 56px;
  max-width: calc(1100px - 64px);
  margin-left: auto;
  margin-right: auto;
  background: var(--dark);
  border-radius: 14px;
  padding: 32px 36px;
  border: 1.5px solid var(--dark-soft);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.projet-cta-title {
  font-size: 22px;
  font-weight: 800;
  color: #faeedf;
  letter-spacing: -0.02em;
  margin-bottom: 6px;
}

.projet-cta-sub {
  font-size: 13px;
  color: #8a7a6a;
}

/* ── RESPONSIVE ── */
@media (max-width: 768px) {
  .projet-hero {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 32px 20px 32px;
  }

  .projet-visual {
    max-width: 100%;
    order: -1;
  }

  .projet-gallery { padding: 32px 20px; }
  .projet-context { padding: 32px 20px; }
  .projet-divider { margin: 0 20px; }
  .projet-nav-inner { padding: 0 20px; }
  .projet-testi,
  .projet-cta-section { margin: 0 20px 32px; }
}

@media (max-width: 600px) {
  .projet-gallery-grid { grid-template-columns: 1fr 1fr; }
  .projet-gallery-item--wide { grid-column: span 2; }

  .projet-cta-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}

@media (max-width: 400px) {
  .projet-gallery-grid { grid-template-columns: 1fr; }
  .projet-gallery-item--wide { grid-column: span 1; aspect-ratio: 4 / 3; }
}
```

- [ ] **Vérifier que le fichier est bien dans `src/styles/`** (même dossier que `contact-form.css`)

---

## Task 2 : Script partagé — `src/projet-page.ts`

**Files:**
- Create: `src/projet-page.ts`

- [ ] **Créer le fichier**

```typescript
import './style.css'
import './styles/projet-page.css'

// ============================================================
// Custom cursor (identique à main.ts)
// ============================================================
;(function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const cursorEl = document.getElementById('cursor')
  if (!cursorEl) return

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0, visible = false

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    if (!visible) {
      curX = mouseX; curY = mouseY
      visible = true
      cursorEl.style.opacity = '1'
    }
  }, { passive: true })

  document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; visible = false })
  document.addEventListener('mouseenter', () => { if (visible) cursorEl.style.opacity = '1' })

  const navEl = document.querySelector('.projet-nav')
  navEl?.addEventListener('mouseenter', () => { cursorEl.style.opacity = '0' })
  navEl?.addEventListener('mouseleave', () => { if (visible) cursorEl.style.opacity = '1' })

  function tick() {
    curX += (mouseX - curX) * 0.1
    curY += (mouseY - curY) * 0.1
    if (cursorEl) cursorEl.style.transform = `translate(calc(${curX}px - 50%), calc(${curY}px - 50%))`
    requestAnimationFrame(tick)
  }
  tick()
})()

// ============================================================
// Umami Analytics
// ============================================================
if (import.meta.env.VITE_UMAMI_WEBSITE_ID && import.meta.env.VITE_UMAMI_SCRIPT_URL) {
  const s = document.createElement('script')
  s.defer = true
  s.src = `${import.meta.env.VITE_UMAMI_SCRIPT_URL}/script.js`
  s.dataset.websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  document.head.appendChild(s)
}

// ============================================================
// Nav — état scroll
// ============================================================
const nav = document.querySelector<HTMLElement>('.projet-nav')
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60)
  }, { passive: true })
}

// ============================================================
// Scroll-reveal (IntersectionObserver)
// ============================================================
const revealEls = document.querySelectorAll<HTMLElement>('.reveal')

document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
  const siblings = Array.from(
    el.parentElement?.querySelectorAll<HTMLElement>(':scope > .reveal') ?? []
  )
  const index = siblings.indexOf(el)
  el.style.transitionDelay = `${index * 0.14}s`
})

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
)

revealEls.forEach((el) => revealObserver.observe(el))
```

- [ ] **Vérifier la compilation** : `npm run build` ne doit pas remonter d'erreur TypeScript

---

## Task 3 : Vite config — ajouter les 6 entrées

**Files:**
- Modify: `vite.config.ts`

- [ ] **Ajouter les 6 entrées dans `rollupOptions.input`**

Remplacer le bloc `input` existant :

```ts
input: {
  main:  resolve(__dirname, 'index.html'),
  admin: resolve(__dirname, 'admin.html'),
},
```

Par :

```ts
input: {
  main:        resolve(__dirname, 'index.html'),
  admin:       resolve(__dirname, 'admin.html'),
  myboat:      resolve(__dirname, 'projets/myboat.html'),
  garantibox:  resolve(__dirname, 'projets/garantibox.html'),
  cafeo:       resolve(__dirname, 'projets/cafeo.html'),
  niortBasket: resolve(__dirname, 'projets/niort-basket.html'),
  aurem:       resolve(__dirname, 'projets/aurem.html'),
  archeon:     resolve(__dirname, 'projets/archeon.html'),
},
```

- [ ] **Créer le dossier** `projets/` à la racine (nécessaire avant la prochaine étape)

```bash
mkdir projets
```

- [ ] **Vérifier que le build échoue proprement** (les fichiers HTML n'existent pas encore — erreur attendue "Could not resolve entry") :

```bash
npm run build 2>&1 | head -20
```

Résultat attendu : erreur mentionnant `projets/myboat.html` introuvable.

---

## Task 4 : `projets/myboat.html`

**Files:**
- Create: `projets/myboat.html`

- [ ] **Créer le fichier**

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MyBoat — Marketplace iOS &amp; Android | Studio Skøne</title>
  <meta name="description" content="Réalisation Studio Skøne : MyBoat, marketplace mobile de bateaux d'occasion iOS &amp; Android. De la maquette Figma au lancement sur les stores en 5 semaines." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.studioskone.com/projets/myboat" />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/bricolage-grotesque-latin-opsz-normal.woff2" crossorigin>
  <meta property="og:type"        content="article" />
  <meta property="og:locale"      content="fr_FR" />
  <meta property="og:site_name"   content="Studio Skøne" />
  <meta property="og:title"       content="MyBoat — Studio Skøne" />
  <meta property="og:description" content="Marketplace mobile de bateaux d'occasion iOS &amp; Android. Maquette → stores en 5 semaines." />
  <meta property="og:image"       content="https://www.studioskone.com/work/myboat.webp" />
  <meta property="og:url"         content="https://www.studioskone.com/projets/myboat" />
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>

  <nav class="projet-nav" aria-label="Navigation projet">
    <div class="projet-nav-inner">
      <a href="/" class="projet-nav-logo">
        <img src="/logo_skone_sansh2.svg" alt="Studio Skøne" width="111" height="28">
      </a>
      <a href="/#work" class="projet-nav-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Tous les projets
      </a>
    </div>
  </nav>

  <main>

    <section class="projet-hero reveal">
      <div class="projet-hero-left">
        <span class="projet-badge">App mobile</span>
        <h1 class="projet-title">MyBoat</h1>
        <p class="projet-type">Marketplace iOS &amp; Android — achat &amp; vente de bateaux</p>
        <p class="projet-desc">MyBoat voulait lancer une marketplace de bateaux d'occasion en France capable de rivaliser avec les grandes plateformes. De la maquette Figma au lancement sur les deux stores en 5 semaines, sans équipe externe.</p>
      </div>
      <div class="projet-visual">
        <img src="/work/myboat.webp" alt="MyBoat — interface application mobile marketplace bateaux iOS Android" loading="eager">
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-gallery reveal">
      <p class="section-label">Mockups &amp; Écrans</p>
      <div class="projet-gallery-grid">
          <div class="projet-gallery-item projet-gallery-item--wide">
            <img src="/work/myboat.webp" alt="MyBoat — écran d'accueil" loading="lazy">
            <span class="projet-gallery-label">Accueil</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Recherche</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Annonce</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Messages</span>
          </div>
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-context reveal">
      <p class="section-label">Contexte &amp; enjeux</p>
      <p class="projet-context-text">MyBoat souhaitait créer une marketplace mobile de bateaux d'occasion en France. Le défi était double : concevoir une expérience comparable aux grandes plateformes (géolocalisation, messagerie intégrée, gestion des annonces) tout en respectant un délai de livraison serré.</p>
      <p class="projet-context-text">J'ai pris en charge la totalité du parcours produit — architecture UX, design des écrans sur Figma, intégration sur Bubble.io et soumission sur l'App Store et le Google Play. Aucune équipe externe impliquée.</p>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-testi reveal">
      <blockquote class="projet-testi-quote">"De la maquette au store en 5 semaines. Exactement ce qu'on voulait, sans aucune surprise."</blockquote>
      <div class="projet-testi-author">
        <div class="projet-testi-avatar" aria-hidden="true">SR</div>
        <div>
          <span class="projet-testi-name">Sébastien Roy</span>
          <span class="projet-testi-role">CTO, MyBoat</span>
        </div>
      </div>
    </section>

    <section class="projet-cta-section reveal">
      <div>
        <p class="projet-cta-title">Un projet similaire en tête ?</p>
        <p class="projet-cta-sub">Premier échange gratuit, sans engagement.</p>
      </div>
      <a href="/#contact" class="btn btn--primary btn--with-circle">
        <span class="btn__circle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        Démarrer un projet similaire
      </a>
    </section>

  </main>

  <script type="module" src="/src/projet-page.ts"></script>
</body>
</html>
```

- [ ] **Démarrer le dev server et ouvrir `http://localhost:5173/projets/myboat`**

```bash
npm run dev
```

Vérifier : nav sticky, hero visible, galerie affichée, témoignage sombre, CTA sombre, animations reveal au scroll.

- [ ] **Commit**

```bash
git add projets/myboat.html src/styles/projet-page.css src/projet-page.ts vite.config.ts
git commit -m "feat: page projet MyBoat (Vite MPA)"
```

---

## Task 5 : `projets/garantibox.html`

**Files:**
- Create: `projets/garantibox.html`

- [ ] **Créer le fichier**

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Garantibox — Plateforme SaaS de gestion SAV | Studio Skøne</title>
  <meta name="description" content="Réalisation Studio Skøne : Garantibox, interface SaaS de gestion SAV. Réduction des délais de traitement de 35%." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.studioskone.com/projets/garantibox" />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/bricolage-grotesque-latin-opsz-normal.woff2" crossorigin>
  <meta property="og:type"        content="article" />
  <meta property="og:locale"      content="fr_FR" />
  <meta property="og:site_name"   content="Studio Skøne" />
  <meta property="og:title"       content="Garantibox — Studio Skøne" />
  <meta property="og:description" content="Interface SaaS de gestion SAV. Réduction des délais de traitement de 35%." />
  <meta property="og:image"       content="https://www.studioskone.com/work/garantibox.png" />
  <meta property="og:url"         content="https://www.studioskone.com/projets/garantibox" />
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>

  <nav class="projet-nav" aria-label="Navigation projet">
    <div class="projet-nav-inner">
      <a href="/" class="projet-nav-logo">
        <img src="/logo_skone_sansh2.svg" alt="Studio Skøne" width="111" height="28">
      </a>
      <a href="/#work" class="projet-nav-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Tous les projets
      </a>
    </div>
  </nav>

  <main>

    <section class="projet-hero reveal">
      <div class="projet-hero-left">
        <span class="projet-badge">Web App SaaS</span>
        <h1 class="projet-title">Garantibox</h1>
        <p class="projet-type">Plateforme SaaS de gestion SAV</p>
        <p class="projet-desc">Garantibox avait besoin d'une interface métier claire pour centraliser la gestion de leurs SAV. L'enjeu : réduire le temps de traitement des équipes sans les noyer sous les menus.</p>
      </div>
      <div class="projet-visual">
        <img src="/work/garantibox.png" alt="Garantibox — interface plateforme SaaS gestion SAV" loading="eager">
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-gallery reveal">
      <p class="section-label">Mockups &amp; Écrans</p>
      <div class="projet-gallery-grid">
          <div class="projet-gallery-item projet-gallery-item--wide">
            <img src="/work/garantibox.png" alt="Garantibox — tableau de bord" loading="lazy">
            <span class="projet-gallery-label">Dashboard</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Gestion SAV</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Détail dossier</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Paramètres</span>
          </div>
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-context reveal">
      <p class="section-label">Contexte &amp; enjeux</p>
      <p class="projet-context-text">Les équipes SAV de Garantibox jonglaient entre plusieurs outils pour suivre les dossiers clients. L'objectif : consolider tout dans une interface unique, pensée pour une utilisation quotidienne intensive.</p>
      <p class="projet-context-text">J'ai conçu l'architecture d'information, designé les écrans sur Figma et développé l'interface complète. Résultat : une réduction de 35% des délais de traitement dès les premières semaines d'utilisation.</p>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-testi reveal">
      <blockquote class="projet-testi-quote">"Interface claire et efficace. Notre équipe a réduit ses délais de traitement de 35%."</blockquote>
      <div class="projet-testi-author">
        <div class="projet-testi-avatar" aria-hidden="true">CD</div>
        <div>
          <span class="projet-testi-name">Claire Dumont</span>
          <span class="projet-testi-role">Product Lead, Garantibox</span>
        </div>
      </div>
    </section>

    <section class="projet-cta-section reveal">
      <div>
        <p class="projet-cta-title">Un projet similaire en tête ?</p>
        <p class="projet-cta-sub">Premier échange gratuit, sans engagement.</p>
      </div>
      <a href="/#contact" class="btn btn--primary btn--with-circle">
        <span class="btn__circle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        Démarrer un projet similaire
      </a>
    </section>

  </main>

  <script type="module" src="/src/projet-page.ts"></script>
</body>
</html>
```

- [ ] **Vérifier dans le browser** : `http://localhost:5173/projets/garantibox`

- [ ] **Commit**

```bash
git add projets/garantibox.html
git commit -m "feat: page projet Garantibox"
```

---

## Task 6 : `projets/cafeo.html`

**Files:**
- Create: `projets/cafeo.html`

- [ ] **Créer le fichier**

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ele — Ateliers Caféologie | Studio Skøne</title>
  <meta name="description" content="Réalisation Studio Skøne : site web et identité visuelle pour ele — Ateliers Caféologie." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.studioskone.com/projets/cafeo" />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/bricolage-grotesque-latin-opsz-normal.woff2" crossorigin>
  <meta property="og:type"        content="article" />
  <meta property="og:locale"      content="fr_FR" />
  <meta property="og:site_name"   content="Studio Skøne" />
  <meta property="og:title"       content="ele — Ateliers Caféologie | Studio Skøne" />
  <meta property="og:description" content="Site web et identité visuelle pour les ateliers de dégustation de café spécialisé." />
  <meta property="og:image"       content="https://www.studioskone.com/work/cafeo.webp" />
  <meta property="og:url"         content="https://www.studioskone.com/projets/cafeo" />
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>

  <nav class="projet-nav" aria-label="Navigation projet">
    <div class="projet-nav-inner">
      <a href="/" class="projet-nav-logo">
        <img src="/logo_skone_sansh2.svg" alt="Studio Skøne" width="111" height="28">
      </a>
      <a href="/#work" class="projet-nav-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Tous les projets
      </a>
    </div>
  </nav>

  <main>

    <section class="projet-hero reveal">
      <div class="projet-hero-left">
        <span class="projet-badge">Site web</span>
        <h1 class="projet-title">ele — Ateliers Caféologie</h1>
        <p class="projet-type">Site web &amp; identité visuelle</p>
        <p class="projet-desc">ele organise des ateliers de dégustation de café spécialisé. Ils avaient besoin d'un site qui retranscrive la précision et la sensorialité de leur univers, avec une identité visuelle cohérente.</p>
      </div>
      <div class="projet-visual">
        <img src="/work/cafeo.webp" alt="ele Ateliers Caféologie — site web et identité visuelle" loading="eager">
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-gallery reveal">
      <p class="section-label">Mockups &amp; Écrans</p>
      <div class="projet-gallery-grid">
          <div class="projet-gallery-item projet-gallery-item--wide">
            <img src="/work/cafeo.webp" alt="ele — page d'accueil" loading="lazy">
            <span class="projet-gallery-label">Accueil</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Ateliers</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Identité</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Réservation</span>
          </div>
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-context reveal">
      <p class="section-label">Contexte &amp; enjeux</p>
      <p class="projet-context-text">ele proposait des ateliers haut de gamme autour du café de spécialité, mais leur présence digitale ne reflétait pas leur niveau d'exigence. L'enjeu était de créer une identité visuelle cohérente et un site qui convertit les curieux en participants.</p>
      <p class="projet-context-text">J'ai développé l'identité visuelle complète (typographie, palette, iconographie) puis le site web en parallèle, pour garantir une cohérence totale entre la marque et son expression digitale.</p>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-testi reveal">
      <blockquote class="projet-testi-quote">"Un résultat qui dépasse nos attentes. L'identité visuelle colle parfaitement à notre univers."</blockquote>
      <div class="projet-testi-author">
        <div class="projet-testi-avatar" aria-hidden="true">LM</div>
        <div>
          <span class="projet-testi-name">Lucas Martin</span>
          <span class="projet-testi-role">Fondateur, ele</span>
        </div>
      </div>
    </section>

    <section class="projet-cta-section reveal">
      <div>
        <p class="projet-cta-title">Un projet similaire en tête ?</p>
        <p class="projet-cta-sub">Premier échange gratuit, sans engagement.</p>
      </div>
      <a href="/#contact" class="btn btn--primary btn--with-circle">
        <span class="btn__circle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        Démarrer un projet similaire
      </a>
    </section>

  </main>

  <script type="module" src="/src/projet-page.ts"></script>
</body>
</html>
```

- [ ] **Vérifier** : `http://localhost:5173/projets/cafeo`

- [ ] **Commit** : `git add projets/cafeo.html && git commit -m "feat: page projet ele — Ateliers Caféologie"`

---

## Task 7 : `projets/niort-basket.html`

**Files:**
- Create: `projets/niort-basket.html`

- [ ] **Créer le fichier**

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Niort Basket — Refonte site club &amp; e-commerce | Studio Skøne</title>
  <meta name="description" content="Réalisation Studio Skøne : refonte du site Niort Basket avec billetterie e-commerce intégrée." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.studioskone.com/projets/niort-basket" />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/bricolage-grotesque-latin-opsz-normal.woff2" crossorigin>
  <meta property="og:type"        content="article" />
  <meta property="og:locale"      content="fr_FR" />
  <meta property="og:site_name"   content="Studio Skøne" />
  <meta property="og:title"       content="Niort Basket — Studio Skøne" />
  <meta property="og:description" content="Refonte du site club et mise en place d'une billetterie e-commerce." />
  <meta property="og:image"       content="https://www.studioskone.com/work/niortbasket.png" />
  <meta property="og:url"         content="https://www.studioskone.com/projets/niort-basket" />
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>

  <nav class="projet-nav" aria-label="Navigation projet">
    <div class="projet-nav-inner">
      <a href="/" class="projet-nav-logo">
        <img src="/logo_skone_sansh2.svg" alt="Studio Skøne" width="111" height="28">
      </a>
      <a href="/#work" class="projet-nav-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Tous les projets
      </a>
    </div>
  </nav>

  <main>

    <section class="projet-hero reveal">
      <div class="projet-hero-left">
        <span class="projet-badge">Site web</span>
        <h1 class="projet-title">Niort Basket</h1>
        <p class="projet-type">Refonte site club &amp; e-commerce billetterie</p>
        <p class="projet-desc">Le club de basket de Niort avait un site vieillissant et aucune solution de vente de billets en ligne. L'objectif : une refonte complète opérationnelle avant le début de la nouvelle saison.</p>
      </div>
      <div class="projet-visual">
        <img src="/work/niortbasket.png" alt="Niort Basket — refonte site club et billetterie e-commerce" loading="eager">
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-gallery reveal">
      <p class="section-label">Mockups &amp; Écrans</p>
      <div class="projet-gallery-grid">
          <div class="projet-gallery-item projet-gallery-item--wide">
            <img src="/work/niortbasket.png" alt="Niort Basket — page d'accueil" loading="lazy">
            <span class="projet-gallery-label">Accueil</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Billetterie</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Équipe</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Actualités</span>
          </div>
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-context reveal">
      <p class="section-label">Contexte &amp; enjeux</p>
      <p class="projet-context-text">Niort Basket voulait moderniser sa présence digitale et, surtout, lancer une billetterie en ligne pour la saison à venir. Le timing était serré : le site devait être opérationnel avant l'ouverture des ventes.</p>
      <p class="projet-context-text">J'ai pris en charge la refonte graphique complète, l'intégration e-commerce pour la billetterie, et la mise en ligne dans les délais. Le club a pu vendre ses billets en ligne dès le premier match de la saison.</p>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-testi reveal">
      <blockquote class="projet-testi-quote">"Site modernisé et billetterie en ligne opérationnelle pour la saison suivante. Impeccable."</blockquote>
      <div class="projet-testi-author">
        <div class="projet-testi-avatar" aria-hidden="true">MP</div>
        <div>
          <span class="projet-testi-name">Marc Perrin</span>
          <span class="projet-testi-role">Directeur, Niort Basket</span>
        </div>
      </div>
    </section>

    <section class="projet-cta-section reveal">
      <div>
        <p class="projet-cta-title">Un projet similaire en tête ?</p>
        <p class="projet-cta-sub">Premier échange gratuit, sans engagement.</p>
      </div>
      <a href="/#contact" class="btn btn--primary btn--with-circle">
        <span class="btn__circle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        Démarrer un projet similaire
      </a>
    </section>

  </main>

  <script type="module" src="/src/projet-page.ts"></script>
</body>
</html>
```

- [ ] **Vérifier** : `http://localhost:5173/projets/niort-basket`

- [ ] **Commit** : `git add projets/niort-basket.html && git commit -m "feat: page projet Niort Basket"`

---

## Task 8 : `projets/aurem.html`

**Files:**
- Create: `projets/aurem.html`

- [ ] **Créer le fichier**

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Aurem — Site haut de gamme immobilier de luxe | Studio Skøne</title>
  <meta name="description" content="Réalisation Studio Skøne : site vitrine haut de gamme pour Aurem, agence immobilière de luxe à Paris." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.studioskone.com/projets/aurem" />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/bricolage-grotesque-latin-opsz-normal.woff2" crossorigin>
  <meta property="og:type"        content="article" />
  <meta property="og:locale"      content="fr_FR" />
  <meta property="og:site_name"   content="Studio Skøne" />
  <meta property="og:title"       content="Aurem — Studio Skøne" />
  <meta property="og:description" content="Site vitrine haut de gamme pour agence immobilière de luxe." />
  <meta property="og:image"       content="https://www.studioskone.com/work/aurem.png" />
  <meta property="og:url"         content="https://www.studioskone.com/projets/aurem" />
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>

  <nav class="projet-nav" aria-label="Navigation projet">
    <div class="projet-nav-inner">
      <a href="/" class="projet-nav-logo">
        <img src="/logo_skone_sansh2.svg" alt="Studio Skøne" width="111" height="28">
      </a>
      <a href="/#work" class="projet-nav-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Tous les projets
      </a>
    </div>
  </nav>

  <main>

    <section class="projet-hero reveal">
      <div class="projet-hero-left">
        <span class="projet-badge">Site vitrine</span>
        <h1 class="projet-title">Aurem</h1>
        <p class="projet-type">Site haut de gamme — immobilier de luxe</p>
        <p class="projet-desc">Aurem est une agence immobilière spécialisée dans les biens d'exception à Paris. Ils avaient besoin d'un site à la hauteur de leur positionnement — sobre, précis, et qui inspire confiance dès la première seconde.</p>
      </div>
      <div class="projet-visual">
        <img src="/work/aurem.png" alt="Aurem — site vitrine agence immobilière de luxe" loading="eager">
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-gallery reveal">
      <p class="section-label">Mockups &amp; Écrans</p>
      <div class="projet-gallery-grid">
          <div class="projet-gallery-item projet-gallery-item--wide">
            <img src="/work/aurem.png" alt="Aurem — page d'accueil" loading="lazy">
            <span class="projet-gallery-label">Accueil</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Biens</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Fiche bien</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Contact</span>
          </div>
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-context reveal">
      <p class="section-label">Contexte &amp; enjeux</p>
      <p class="projet-context-text">Dans l'immobilier de luxe, le site est le premier filtre : il dit aux clients potentiels s'ils sont au bon endroit. Aurem avait un site générique qui ne transmettait pas leur niveau d'exigence ni la qualité de leur catalogue.</p>
      <p class="projet-context-text">J'ai conçu un site épuré et premium, avec une direction artistique centrée sur la mise en valeur des biens. Typographie exclusive, animations discrètes, photos pleine largeur — chaque détail renforce le positionnement.</p>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-testi reveal">
      <blockquote class="projet-testi-quote">"Le prestige qu'on voulait transmettre est là. Les clients le remarquent immédiatement."</blockquote>
      <div class="projet-testi-author">
        <div class="projet-testi-avatar" aria-hidden="true">IM</div>
        <div>
          <span class="projet-testi-name">Isabelle Moreau</span>
          <span class="projet-testi-role">Directrice, Aurem</span>
        </div>
      </div>
    </section>

    <section class="projet-cta-section reveal">
      <div>
        <p class="projet-cta-title">Un projet similaire en tête ?</p>
        <p class="projet-cta-sub">Premier échange gratuit, sans engagement.</p>
      </div>
      <a href="/#contact" class="btn btn--primary btn--with-circle">
        <span class="btn__circle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        Démarrer un projet similaire
      </a>
    </section>

  </main>

  <script type="module" src="/src/projet-page.ts"></script>
</body>
</html>
```

- [ ] **Vérifier** : `http://localhost:5173/projets/aurem`

- [ ] **Commit** : `git add projets/aurem.html && git commit -m "feat: page projet Aurem"`

---

## Task 9 : `projets/archeon.html`

**Files:**
- Create: `projets/archeon.html`

- [ ] **Créer le fichier**

```html
<!doctype html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/favicon_skone.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Archéon — Portfolio &amp; site vitrine cabinet d'architecture | Studio Skøne</title>
  <meta name="description" content="Réalisation Studio Skøne : portfolio et site vitrine pour Archéon, cabinet d'architecture." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.studioskone.com/projets/archeon" />
  <link rel="preload" as="font" type="font/woff2" href="/assets/fonts/bricolage-grotesque-latin-opsz-normal.woff2" crossorigin>
  <meta property="og:type"        content="article" />
  <meta property="og:locale"      content="fr_FR" />
  <meta property="og:site_name"   content="Studio Skøne" />
  <meta property="og:title"       content="Archéon — Studio Skøne" />
  <meta property="og:description" content="Portfolio et site vitrine pour cabinet d'architecture." />
  <meta property="og:image"       content="https://www.studioskone.com/work/archeon.png" />
  <meta property="og:url"         content="https://www.studioskone.com/projets/archeon" />
</head>
<body>
  <div id="cursor" aria-hidden="true"></div>

  <nav class="projet-nav" aria-label="Navigation projet">
    <div class="projet-nav-inner">
      <a href="/" class="projet-nav-logo">
        <img src="/logo_skone_sansh2.svg" alt="Studio Skøne" width="111" height="28">
      </a>
      <a href="/#work" class="projet-nav-back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        Tous les projets
      </a>
    </div>
  </nav>

  <main>

    <section class="projet-hero reveal">
      <div class="projet-hero-left">
        <span class="projet-badge">Portfolio</span>
        <h1 class="projet-title">Archéon</h1>
        <p class="projet-type">Portfolio &amp; site vitrine — cabinet d'architecture</p>
        <p class="projet-desc">Archéon est un cabinet d'architecture reconnu dont le portfolio existant ne reflétait ni la qualité ni la singularité de leurs réalisations. Un nouveau site s'imposait — simple, beau, et à la hauteur de leur travail.</p>
      </div>
      <div class="projet-visual">
        <img src="/work/archeon.png" alt="Archéon — portfolio cabinet d'architecture" loading="eager">
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-gallery reveal">
      <p class="section-label">Mockups &amp; Écrans</p>
      <div class="projet-gallery-grid">
          <div class="projet-gallery-item projet-gallery-item--wide">
            <img src="/work/archeon.png" alt="Archéon — page d'accueil" loading="lazy">
            <span class="projet-gallery-label">Accueil</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Projets</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Fiche projet</span>
          </div>
          <div class="projet-gallery-item projet-gallery-placeholder">
            <span class="projet-gallery-label">Studio</span>
          </div>
      </div>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-context reveal">
      <p class="section-label">Contexte &amp; enjeux</p>
      <p class="projet-context-text">Archéon avait un site daté qui ne mettait pas en valeur la richesse de leur portfolio. Les projets s'y perdaient dans une navigation confuse, sans hiérarchie visuelle ni mise en scène des réalisations.</p>
      <p class="projet-context-text">J'ai repensé l'architecture d'information autour du portfolio, avec une grille de projets épurée et des fiches détaillées. Direction artistique sobre, typographie soignée — chaque projet a maintenant la place qu'il mérite.</p>
    </section>

    <div class="projet-divider"></div>

    <section class="projet-testi reveal">
      <blockquote class="projet-testi-quote">"Un portfolio qui représente enfin notre niveau. Simple, beau, efficace. Exactement ça."</blockquote>
      <div class="projet-testi-author">
        <div class="projet-testi-avatar" aria-hidden="true">AG</div>
        <div>
          <span class="projet-testi-name">Antoine Girard</span>
          <span class="projet-testi-role">Architecte, Archéon</span>
        </div>
      </div>
    </section>

    <section class="projet-cta-section reveal">
      <div>
        <p class="projet-cta-title">Un projet similaire en tête ?</p>
        <p class="projet-cta-sub">Premier échange gratuit, sans engagement.</p>
      </div>
      <a href="/#contact" class="btn btn--primary btn--with-circle">
        <span class="btn__circle" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </span>
        Démarrer un projet similaire
      </a>
    </section>

  </main>

  <script type="module" src="/src/projet-page.ts"></script>
</body>
</html>
```

- [ ] **Vérifier** : `http://localhost:5173/projets/archeon`

- [ ] **Commit** : `git add projets/archeon.html && git commit -m "feat: page projet Archéon"`

---

## Task 10 : Mettre à jour les liens dans `index.html`

**Files:**
- Modify: `index.html` (6 occurrences de `.work-card-cta`)

- [ ] **Remplacer les 6 liens `href="#contact"` par les liens vers les pages dédiées**

Chaque carte du carousel a un lien `<a href="#contact" class="work-card-cta">Voir le projet →</a>`.
Les remplacer dans l'ordre d'apparition dans le fichier :

| Projet | Ancien href | Nouveau href |
|--------|-------------|--------------|
| ele — Ateliers Caféologie | `#contact` | `/projets/cafeo` |
| MyBoat | `#contact` | `/projets/myboat` |
| Garantibox | `#contact` | `/projets/garantibox` |
| Niort Basket | `#contact` | `/projets/niort-basket` |
| Aurem | `#contact` | `/projets/aurem` |
| Archéon | `#contact` | `/projets/archeon` |

Le lien du smooth-scroll dans `main.ts` filtre les anchors `href^="#"` — les nouveaux liens `/projets/...` ne sont pas affectés. Pas de modification à faire dans `main.ts`.

- [ ] **Vérifier** : ouvrir `http://localhost:5173`, cliquer sur "Voir le projet →" de chaque carte → doit naviguer vers la bonne page

- [ ] **Commit**

```bash
git add index.html
git commit -m "feat: relier les cartes projet aux pages dédiées"
```

---

## Task 11 : Build final et vérification

**Files:** aucun nouveau fichier

- [ ] **Build de production**

```bash
npm run build
```

Résultat attendu : build sans erreur, `dist/` contient `projets/myboat.html`, `projets/garantibox.html`, etc.

```bash
ls dist/projets/
# → archeon.html  aurem.html  cafeo.html  garantibox.html  myboat.html  niort-basket.html
```

- [ ] **Prévisualiser le build de production**

```bash
npm run preview
```

Ouvrir `http://localhost:4173/projets/myboat` et vérifier :
- La nav est sticky et passe à `is-scrolled` après 60px de scroll
- Les blocs ont l'animation reveal au scroll
- Le CTA "Démarrer un projet similaire" → `/#contact` fait bien défiler vers le formulaire
- Le lien "← Tous les projets" renvoie vers `/#work`

- [ ] **Commit final**

```bash
git add -A
git commit -m "feat: pages projet complètes — build vérifié"
```
