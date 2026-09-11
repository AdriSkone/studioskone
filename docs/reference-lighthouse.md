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

---

## Après la phase 3 — accueil refaite

Relevé le 11 septembre 2026, même commande, mais **en local** (`vite preview`)
et non en production : la nouvelle accueil n'est pas déployée. Les chiffres
ne sont donc pas comparables terme à terme à la référence ci-dessus — un
serveur local n'a ni la latence ni le CDN de Vercel. Ils disent une
direction, pas un résultat.

| Page | Perf | A11y | Bonnes pratiques | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/` (local) | **97** | **100** | 100 | 100 | 2,4 s | 0 |

Pour mémoire, la même page en production avant refonte : 77 / 94 / 100 / 100,
LCP 3,8 s.

Les deux échecs d'accessibilité de la référence ont disparu :

- `color-contrast` — la nouvelle palette le règle par construction. Vérifié
  aussi hors Lighthouse, sur les styles calculés de toute la page : zéro
  paire sous son seuil.
- `target-size` — trois corrections ont été nécessaires, toutes mesurées :
  les liens de texte (21 px), les liens du pied (23 px), « CGU » et « CGV »
  (21 × 29 px). Le minimum est de 24 px dans les deux sens.

Un troisième échec est apparu en cours de route, `label-content-name-mismatch`,
sur les deux boutons du formulaire de contact. Il préexistait à la refonte et
restait masqué par les autres. Leur `aria-label` ne reprenait pas leur texte
visible — et mentait en plus, puisque le libellé passe de « Continuer » à
« Envoyer » à la dernière étape pendant que l'`aria-label` restait figé sur
« Étape suivante ». Les deux ont été retirés : le texte visible est un nom
accessible exact, et il suit le changement.

**À refaire en production** une fois la branche déployée en preview, avec les
pages projet et service, qui n'ont pas encore été refaites.
