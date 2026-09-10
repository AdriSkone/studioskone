# Référence Lighthouse — avant refonte

Relevé le 10 septembre 2026 sur la production, `lighthouse@12`, mobile,
`--throttling-method=simulate`. Aucun score de la refonte ne doit passer
sous ces valeurs.

| Page | Perf | A11y | Bonnes pratiques | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` | **77** | **94** | 100 | 100 | 3,8 s | 0 |
| `/projets/myboat` | **73** | **94** | 100 | 100 | **9,6 s** | 0 |
| `/refonte-site-internet` | **100** | **96** | 100 | 100 | 1,8 s | 0 |

## Ce que la référence dit du travail à faire

Les budgets du brief (§9) ne sont **pas tenus aujourd'hui** : performance 90
minimum, accessibilité 100, LCP sous 2,0 s. Deux pages sur trois échouent.
« Aucun score ne doit baisser » est donc un plancher, pas la cible.

La page prestation à 100 montre que le gabarit sait tenir le budget : le
problème est localisé, pas structurel.

### Accueil — LCP 3,8 s
L'élément LCP est `<h1 class="hero-tagline">`, pas une image. **C'est la
police qui retarde le texte.** Aujourd'hui Bricolage est tiré de
`node_modules` via `@import` dans le CSS, ce qui le place derrière deux
sauts réseau. Le preload en place ne pointe que sur une face.
→ Traité en phase 1 : `@font-face` local, `font-display: swap`,
`size-adjust` mesuré, `preload` sur la face du hero.

### Page projet — LCP 9,6 s
`/work/myboat.webp` en `loading="eager"`, servi en une seule taille.
Lighthouse estime **2 018 Kio** d'économies en images responsives et 724 Kio
en formats modernes.
→ Traité en phase 5 : `srcset` + `sizes`, plusieurs largeurs, dimensions
déclarées.

### Accessibilité — 94 et 96
- `color-contrast` échoue sur les deux pages. L'accent actuel `#C56039` est
  à 3.60 sur le fond `#FAEEDF` : sous AA. La palette de la refonte le corrige
  par construction (terracotta `#A95132` à 4.64 sur le papier).
- `target-size` échoue sur l'accueil : cibles tactiles trop petites ou trop
  serrées.
→ Traité en phases 1 et 2.

## Comment refaire le relevé

```bash
npx --yes lighthouse@12 "<url>" --preset=perf --form-factor=mobile \
  --screenEmulation.mobile --throttling-method=simulate \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path=lh.json \
  --chrome-flags="--headless=new --no-sandbox" --quiet
```
