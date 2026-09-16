# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is Adri's (Adrien Bidet) personal workspace. There is no single unified codebase — the workspace contains multiple projects, primarily no-code/low-code platforms and design assets.

## Primary Project: MyBoat

**Location**: `~/Downloads/MyBoat/`  
**Platform**: Bubble.io (native iOS & Android app)  
**Language**: French (all documentation and UI text is in French)

MyBoat is a marketplace mobile app for buying and selling boats in France. Key documentation:

- `cahier_des_charges_myboat.md` — comprehensive 400+ line product brief covering features, data model, user flows, and tech stack
- HTML wireframes: `myboat-auth-forms.html`, `myboat-home.html`, `myboat-search-results.html`, `myboat-publish.html`, `myboat-messages.html`, `myboat-profil.html`, `myboat-favoris.html`
- `styleguide_myboat.html` — design system reference

### App Architecture

5-tab navigation: Explorer (search) · Favoris · Publier (CTA) · Messages · Profil

Core data types: User (particulier/pro), Annonce (boat listing), Conversation/Message, Favori, Transaction/Boost

Planned integrations (Phase 2+): Stripe, Mapbox, Algolia, Firebase

### No build commands

MyBoat is built on Bubble.io — there are no CLI build, lint, or test commands. Development happens in the Bubble.io visual editor.

## Studio Skøne

**Location**: `~/Desktop/Freelance - studio skøne/Projets/studio-skone/`
**Stack**: Vanilla TypeScript + Vite (MPA) + CSS écrit à la main — pas de framework. GSAP + ScrollTrigger pour les animations, seule dépendance du projet.
**Deploy**: `git push` sur `main` → Vercel build et déploie automatiquement (repo GitHub `AdriSkone/studioskone` connecté au projet Vercel). Pas besoin de `vercel --prod`, ni de Node local.
**SEO local**: marché cible Nantes et périphérie, domiciliation légale à Paris. `address.addressLocality` du JSON-LD reste Paris ; Nantes vit dans `areaServed`, les titres et le contenu. Ne pas nommer d'outils (Figma, IA) dans les meta.
**Build**: `npm run build` (tsc + vite build)

Studio Skøne est le site vitrine du studio créatif d'Adri.

### ⚠️ La source de vérité du design

**`STYLE_GUIDE.md` à la racine.** Toute valeur de design vient de là. En cas
de contradiction avec une maquette, le style guide gagne, sauf sur la mise
en page.

Les tokens sont dans **`src/styles/tokens.css`**, et nulle part ailleurs.
Aucune couleur n'est écrite en dur dans un composant.

Identité en une ligne : papier `#F6ECDB`, encre `#14181C`, accent **bleu de
Prusse `#12455C`**, grain brun en multiply, rondeur 10/16 px, quatre
sections sombres. Aucune ombre, aucun dégradé, aucun flou.

### Le site est généré, pas écrit

Les seize pages sortent de générateurs. **Ne pas éditer les `.html` à la
main** : ils sont écrasés au prochain build.

| Commande | Ce qu'elle génère |
|---|---|
| `node scripts/build-accueil.mjs` | `index.html` |
| `node scripts/build-projet-pages.mjs` | les 9 pages projet |
| `node scripts/build-prestation-pages.mjs` | les 5 pages prestation + sitemap |
| `node scripts/build-404.mjs` | `404.html` |
| `node scripts/build-legal-pages.mjs` | les 4 pages légales |

Le contenu vit dans `scripts/contenu/`. Les `head` sont conservés tels
quels dans `scripts/contenu/heads/` : personne ne les réécrit, ils sont
relus — c'est ce qui garantit qu'aucune balise SEO ne bouge.

### Les deux règles absolues, et comment les vérifier

**Le copywriting ne change jamais.** **Aucune régression SEO.**

```bash
node scripts/verifier-copy.mjs index.html projets/*.html    # le texte servi
node scripts/verifier-copy-rendu.mjs http://localhost:5173/ index.html   # après JS
node scripts/verifier-seo.mjs index.html                    # meta, canonical, OG, alt
node scripts/recette.mjs http://localhost:5173 1440         # contraste, ombres, cibles
```

Ces scripts ne sont pas décoratifs : ils ont trouvé des mots collés par un
découpage de lignes, neuf notes de projet disparues, un pied de page
illisible et des boutons encre sur encre. Les faire tourner avant de
commiter.

Tout ajout de texte doit être déclaré dans `verifier-copy.mjs`, avec sa
raison. Le script refuse tout ce qui n'y est pas.

---

## Secondary Projects

- **Shopify Theme** (`~/Desktop/Micro-entreprise/E-commerce/Theme Shopify/SUPERTHEME-4.0/`): Liquid templates, standard Shopify structure (assets, sections, snippets, templates, layout, config, locales)
- **DemoFootballManag10bc5**: Adalo editor project (binary `.egstore` format)

---

# DESIGN RULES

- Never generate perfect grids
- Avoid repetitive layouts
- Use asymmetry

---

# VISUAL STYLE

- Add depth through material, not shadow — grain, not glow
- Avoid flat UI

---

# MOTION

- Always subtle
- Use stagger and delay
- Rien ne bouge en Z : pas de soulèvement, pas de profondeur simulée

---

# UX

- Reduce density
- Increase spacing

---

# GOAL

All designs must feel:
- premium
- intentional
- non-generic
