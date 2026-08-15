# Estimateur de projet · plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter dans la section tarifs un estimateur en trois questions qui produit une fourchette de prix, puis ouvre le formulaire de contact à sa dernière étape avec Projet, Budget et Délai déjà renseignés.

**Architecture:** Un module de calcul pur et testé (`estimator-pricing.ts`), un composant d'interface sans dépendance (`estimator.ts`), et une façade minimale ajoutée à `contact-form.ts` pour que l'estimateur pilote le formulaire sans accéder à son intérieur.

**Tech Stack:** TypeScript vanilla, Vite, CSS sur les tokens existants. Vitest ajouté en devDependency pour la logique de calcul.

## Global Constraints

- Aucune dépendance d'exécution nouvelle. Vitest est une devDependency, absente du bundle.
- Tokens CSS existants uniquement : `--bg`, `--bg-soft`, `--card`, `--accent`, `--text`, `--muted`, `--border`, `--ease`, `--transition`.
- Typographie : `Bricolage Grotesque Variable`, déjà chargée.
- Pas de tiret cadratin dans les textes visibles. Séparateur : point médian `·`.
- Toute animation passe sous `@media (prefers-reduced-motion: reduce)`.
- Grille tarifaire de référence, TJM 400 € :

| | 1 page | 2-5 pages | 6-12 pages |
|---|---|---|---|
| Vitrine | 900 – 1 200 € | 1 600 – 2 400 € | 2 800 – 4 400 € |
| Vitrine + réservation/devis | 1 400 – 1 800 € | 2 000 – 3 000 € | 3 200 – 4 800 € |
| Boutique en ligne | (renvoie 2-5) | 3 000 – 4 400 € | 4 000 – 6 400 € |
| Application | aucun chiffre |

- Supplément contenus : `a-creer` +25 % sur le haut, `partiel` +12 %, arrondi à la centaine supérieure. Le bas ne bouge jamais.
- Offre : une page donne Fondation, au-delà Studio, boutique Studio, application Sur mesure.
- Valeurs transmises au formulaire, identiques à celles de `contact-form.ts` : `projectType` ∈ `vitrine | ecommerce | app-web`, `budget` ∈ `1k-3k | 3k-5k | 5k-10k | 10k+ | a-def`, `delay` toujours `flex`.

---

### Task 1: Module de calcul

**Files:**
- Create: `src/components/estimator-pricing.ts`
- Create: `src/components/estimator-pricing.test.ts`
- Modify: `package.json` (devDependency vitest + script `test`)

**Interfaces:**
- Consumes: rien.
- Produces: `estimate(input: EstimateInput): Estimate`, plus les types `SiteType`, `SizeChoice`, `ContentChoice`, `EstimateInput`, `Estimate`.

- [ ] **Step 1: Installer vitest**

```bash
npm install -D vitest@^3
```

Puis ajouter le script dans `package.json`, section `scripts` :

```json
"test": "vitest run"
```

- [ ] **Step 2: Écrire les tests**

Créer `src/components/estimator-pricing.test.ts` :

```ts
import { describe, it, expect } from 'vitest'
import { estimate } from './estimator-pricing'

describe('estimate', () => {
  it('vitrine une page, contenus prêts : Fondation, 900 à 1200', () => {
    const r = estimate({ type: 'vitrine', size: '1', content: 'pret' })
    expect(r.min).toBe(900)
    expect(r.max).toBe(1200)
    expect(r.offer).toBe('Fondation')
    expect(r.delay).toBe('2 à 3 semaines')
    expect(r.projectType).toBe('vitrine')
    expect(r.budget).toBe('1k-3k')
    expect(r.showPrice).toBe(true)
  })

  it('au-delà d\'une page, l\'offre bascule sur Studio', () => {
    const r = estimate({ type: 'vitrine', size: '2-5', content: 'pret' })
    expect(r.offer).toBe('Studio')
    expect(r.delay).toBe('4 à 6 semaines')
    expect(r.min).toBe(1600)
    expect(r.max).toBe(2400)
  })

  it('contenus à créer : +25 % sur le haut, le bas ne bouge pas', () => {
    const r = estimate({ type: 'vitrine', size: '2-5', content: 'a-creer' })
    expect(r.min).toBe(1600)
    expect(r.max).toBe(3000)
  })

  it('contenus en partie : +12 %, arrondi à la centaine supérieure', () => {
    const r = estimate({ type: 'vitrine', size: '2-5', content: 'partiel' })
    expect(r.min).toBe(1600)
    expect(r.max).toBe(2700)
  })

  it('le supplément contenus ne déplace pas la tranche de budget', () => {
    const a = estimate({ type: 'vitrine', size: '6-12', content: 'pret' })
    const b = estimate({ type: 'vitrine', size: '6-12', content: 'a-creer' })
    expect(a.budget).toBe('3k-5k')
    expect(b.budget).toBe('3k-5k')
    expect(b.max).toBeGreaterThan(a.max!)
  })

  it('boutique une page renvoie la fourchette 2-5', () => {
    const r = estimate({ type: 'boutique', size: '1', content: 'pret' })
    expect(r.min).toBe(3000)
    expect(r.max).toBe(4400)
    expect(r.offer).toBe('Studio')
    expect(r.projectType).toBe('ecommerce')
    expect(r.budget).toBe('3k-5k')
  })

  it('boutique 6-12 tombe dans la tranche 5k-10k', () => {
    const r = estimate({ type: 'boutique', size: '6-12', content: 'pret' })
    expect(r.min).toBe(4000)
    expect(r.max).toBe(6400)
    expect(r.budget).toBe('5k-10k')
  })

  it('application : aucun chiffre, budget à définir', () => {
    const r = estimate({ type: 'application', size: '2-5', content: 'pret' })
    expect(r.showPrice).toBe(false)
    expect(r.min).toBeNull()
    expect(r.max).toBeNull()
    expect(r.offer).toBe('Sur mesure')
    expect(r.projectType).toBe('app-web')
    expect(r.budget).toBe('a-def')
    expect(r.delay).toBe('à définir ensemble')
  })

  it('taille inconnue : fourchette complète de la ligne, budget à définir', () => {
    const r = estimate({ type: 'vitrine', size: 'inconnu', content: 'pret' })
    expect(r.min).toBe(900)
    expect(r.max).toBe(4400)
    expect(r.budget).toBe('a-def')
    expect(r.offer).toBe('Studio')
  })

  it('le délai transmis au formulaire est toujours flex', () => {
    for (const type of ['vitrine', 'vitrine-plus', 'boutique', 'application'] as const) {
      expect(estimate({ type, size: '2-5', content: 'pret' }).formDelay).toBe('flex')
    }
  })
})
```

- [ ] **Step 3: Lancer les tests pour vérifier qu'ils échouent**

Run: `npm test`
Expected: FAIL, `Cannot find module './estimator-pricing'`

- [ ] **Step 4: Écrire l'implémentation**

Créer `src/components/estimator-pricing.ts` :

```ts
export type SiteType = 'vitrine' | 'vitrine-plus' | 'boutique' | 'application'
export type SizeChoice = '1' | '2-5' | '6-12' | 'inconnu'
export type ContentChoice = 'pret' | 'partiel' | 'a-creer'

export type EstimateInput = {
  type: SiteType
  size: SizeChoice
  content: ContentChoice
}

export type Estimate = {
  min: number | null
  max: number | null
  showPrice: boolean
  offer: 'Fondation' | 'Studio' | 'Sur mesure'
  delay: string
  projectType: 'vitrine' | 'ecommerce' | 'app-web'
  budget: '1k-3k' | '3k-5k' | '5k-10k' | '10k+' | 'a-def'
  formDelay: 'flex'
}

type Range = [number, number]

// Fourchettes établies sur un TJM de 400 €.
const GRID: Record<Exclude<SiteType, 'application'>, Record<'1' | '2-5' | '6-12', Range>> = {
  'vitrine':      { '1': [900, 1200],  '2-5': [1600, 2400], '6-12': [2800, 4400] },
  'vitrine-plus': { '1': [1400, 1800], '2-5': [2000, 3000], '6-12': [3200, 4800] },
  // Une boutique d'une seule page n'existe pas : on renvoie la fourchette 2-5.
  'boutique':     { '1': [3000, 4400], '2-5': [3000, 4400], '6-12': [4000, 6400] },
}

const CONTENT_UPLIFT: Record<ContentChoice, number> = {
  'pret':    1,
  'partiel': 1.12,
  'a-creer': 1.25,
}

const PROJECT_TYPE: Record<SiteType, Estimate['projectType']> = {
  'vitrine':      'vitrine',
  'vitrine-plus': 'vitrine',
  'boutique':     'ecommerce',
  'application':  'app-web',
}

const roundUpHundred = (n: number): number => Math.ceil(n / 100) * 100

function budgetBracket(mid: number): Estimate['budget'] {
  if (mid < 3000) return '1k-3k'
  if (mid < 5000) return '3k-5k'
  if (mid < 10000) return '5k-10k'
  return '10k+'
}

export function estimate(input: EstimateInput): Estimate {
  const projectType = PROJECT_TYPE[input.type]

  if (input.type === 'application') {
    return {
      min: null, max: null, showPrice: false,
      offer: 'Sur mesure',
      delay: 'à définir ensemble',
      projectType, budget: 'a-def', formDelay: 'flex',
    }
  }

  const row = GRID[input.type]
  const unknownSize = input.size === 'inconnu'
  const base: Range = unknownSize
    ? [row['1'][0], row['6-12'][1]]
    : row[input.size]

  // Le supplément contenus élargit l'affichage sans déplacer la tranche de
  // budget : un client sans photos ne doit pas être rangé au-dessus de son
  // projet réel.
  const max = roundUpHundred(base[1] * CONTENT_UPLIFT[input.content])
  const budget = unknownSize
    ? 'a-def'
    : budgetBracket((base[0] + base[1]) / 2)

  // Une page relève de Fondation, au-delà de Studio. Une taille inconnue est
  // traitée comme le cas le plus large.
  const offer = input.type === 'boutique' || input.size !== '1' ? 'Studio' : 'Fondation'

  return {
    min: base[0], max, showPrice: true,
    offer,
    delay: offer === 'Fondation' ? '2 à 3 semaines' : '4 à 6 semaines',
    projectType, budget, formDelay: 'flex',
  }
}
```

- [ ] **Step 5: Lancer les tests pour vérifier qu'ils passent**

Run: `npm test`
Expected: PASS, 10 tests.

- [ ] **Step 6: Vérifier que le build passe**

Run: `npm run build`
Expected: succès. Le fichier `.test.ts` ne doit pas apparaître dans `dist/`.

- [ ] **Step 7: Commit**

```bash
git add src/components/estimator-pricing.ts src/components/estimator-pricing.test.ts package.json package-lock.json
git commit -m "Estimateur : module de calcul des fourchettes"
```

---

### Task 2: Façade sur le formulaire de contact

**Files:**
- Modify: `src/components/contact-form.ts:787-790` (la fonction `initContactForm`)
- Modify: `src/main.ts:294` (récupérer la valeur retournée)

**Interfaces:**
- Consumes: la classe privée `ContactForm` et ses membres `data`, `goTo`, `currentStep`.
- Produces: `initContactForm(): ContactFormHandle | null`, avec

```ts
export type ContactFormHandle = {
  prefill(data: { projectType: string; budget: string; delay: string }): void
  jumpToContact(): void
}
```

- [ ] **Step 1: Lire les parties concernées**

Ouvrir `src/components/contact-form.ts` et repérer :
- la déclaration `class ContactForm` (ligne 350 environ),
- la propriété `data` et sa forme,
- la méthode privée `goTo(nextIdx: number, dir: 1 | -1)` (ligne 550 environ),
- la constante `STEPS` (ligne 50) : l'étape Contact est la dernière, index `STEPS.length - 1`,
- la fonction `initContactForm()` en fin de fichier.

Ne rien modifier à ce stade.

- [ ] **Step 2: Ajouter deux méthodes publiques à la classe**

Dans `class ContactForm`, ajouter ces méthodes. Elles sont publiques là où le reste est privé : c'est la seule surface exposée.

```ts
  public prefill(values: { projectType: string; budget: string; delay: string }): void {
    this.data.projectType = values.projectType
    this.data.budget      = values.budget
    this.data.delay       = values.delay
    this.syncChoiceUI()
  }

  public jumpToContact(): void {
    const target = STEPS.length - 1
    if (this.currentStep === target) return
    this.goTo(target, 1)
  }
```

- [ ] **Step 3: Ajouter la synchronisation visuelle des choix**

Les choix sont des `<button class="cf-choice" data-field="…" data-value="…" aria-pressed="…">`, et `selectChoice()` (ligne 510) porte l'état par la classe `is-selected` plus `aria-pressed`. La méthode ci-dessous reprend exactement cette convention.

Différence avec `selectChoice()` : elle balaie tout le conteneur et non le seul panneau courant, puisqu'un `prefill` renseigne trois étapes à la fois.

```ts
  private syncChoiceUI(): void {
    const pairs: Array<[string, string]> = [
      ['projectType', this.data.projectType],
      ['budget',      this.data.budget],
      ['delay',       this.data.delay],
    ]
    for (const [field, value] of pairs) {
      this.container
        .querySelectorAll<HTMLElement>(`.cf-choice[data-field="${field}"]`)
        .forEach(btn => {
          const active = btn.dataset.value === value
          btn.classList.toggle('is-selected', active)
          btn.setAttribute('aria-pressed', String(active))
        })
    }
    this.updateNextBtn()
  }
```

L'appel final à `updateNextBtn()` remet le bouton de progression dans l'état correspondant aux réponses injectées.

- [ ] **Step 4: Faire retourner une façade par initContactForm**

Remplacer la fonction en fin de fichier :

```ts
export type ContactFormHandle = {
  prefill(data: { projectType: string; budget: string; delay: string }): void
  jumpToContact(): void
}

export function initContactForm(): ContactFormHandle | null {
  const el = document.querySelector<HTMLElement>('#contact-form-root')
  if (!el) return null
  const form = new ContactForm(el)
  return {
    prefill: (data) => form.prefill(data),
    jumpToContact: () => form.jumpToContact(),
  }
}
```

- [ ] **Step 5: Conserver la référence dans main.ts**

Dans `src/main.ts`, remplacer `initContactForm()` par :

```ts
const contactForm = initContactForm()
```

- [ ] **Step 6: Vérifier**

Run: `npm run build`
Expected: succès, aucune erreur TypeScript.

Puis `npm run dev`, ouvrir le site et remplir le formulaire de contact de bout en bout comme avant. Le comportement doit être strictement identique : cette tâche n'ajoute que des points d'entrée, elle ne change rien à l'existant.

- [ ] **Step 7: Commit**

```bash
git add src/components/contact-form.ts src/main.ts
git commit -m "Formulaire de contact : expose prefill et jumpToContact"
```

---

### Task 3: Markup et styles

**Files:**
- Modify: `index.html` (section `#tarifs`, après la dernière `.tarif-card`)
- Create: `src/styles/estimator.css`
- Modify: `src/style.css` (import du nouveau fichier)

**Interfaces:**
- Consumes: rien.
- Produces: le DOM sur lequel la Task 4 se branche — racine `#estimator`, questions `[data-question]`, options `input[type="radio"]`, zone de résultat `#estimatorResult`, bouton `#estimatorCta`.

- [ ] **Step 1: Insérer le markup**

Dans `index.html`, à la fin de la section `#tarifs`, après la troisième `.tarif-card` et avant la fermeture de la section :

```html
<div class="estimator reveal" id="estimator">
  <div class="estimator-head">
    <span class="estimator-eyebrow">Estimation · 30 secondes</span>
    <h3 class="estimator-title">Pas sûr de l'offre qui vous correspond ?</h3>
    <p class="estimator-sub">Trois questions, une fourchette. Sans engagement.</p>
  </div>

  <form class="estimator-form" id="estimatorForm">
    <fieldset class="estimator-q" data-question="type">
      <legend class="estimator-legend">Quel type de site ?</legend>
      <div class="estimator-options">
        <label class="estimator-opt"><input type="radio" name="type" value="vitrine" required><span>Vitrine</span></label>
        <label class="estimator-opt"><input type="radio" name="type" value="vitrine-plus"><span>Vitrine avec réservation ou devis</span></label>
        <label class="estimator-opt"><input type="radio" name="type" value="boutique"><span>Boutique en ligne</span></label>
        <label class="estimator-opt"><input type="radio" name="type" value="application"><span>Application</span></label>
      </div>
    </fieldset>

    <fieldset class="estimator-q" data-question="size">
      <legend class="estimator-legend">Quelle taille ?</legend>
      <div class="estimator-options">
        <label class="estimator-opt"><input type="radio" name="size" value="1" required><span>Une page</span></label>
        <label class="estimator-opt"><input type="radio" name="size" value="2-5"><span>2 à 5 pages</span></label>
        <label class="estimator-opt"><input type="radio" name="size" value="6-12"><span>6 à 12 pages</span></label>
        <label class="estimator-opt"><input type="radio" name="size" value="inconnu"><span>Je ne sais pas encore</span></label>
      </div>
    </fieldset>

    <fieldset class="estimator-q" data-question="content">
      <legend class="estimator-legend">Textes et photos prêts ?</legend>
      <div class="estimator-options">
        <label class="estimator-opt"><input type="radio" name="content" value="pret" required><span>Oui</span></label>
        <label class="estimator-opt"><input type="radio" name="content" value="partiel"><span>En partie</span></label>
        <label class="estimator-opt"><input type="radio" name="content" value="a-creer"><span>Non, à créer</span></label>
      </div>
    </fieldset>
  </form>

  <div class="estimator-result" id="estimatorResult" aria-live="polite" hidden>
    <div class="estimator-result-inner">
      <span class="estimator-result-label">Votre projet ressemble à</span>
      <p class="estimator-offer" id="estimatorOffer"></p>
      <p class="estimator-range" id="estimatorRange"></p>
      <p class="estimator-delay" id="estimatorDelay"></p>
      <a href="#contact" class="estimator-cta" id="estimatorCta">Discuter de ce projet</a>
      <p class="estimator-disclaimer">Estimation indicative, établie à partir de vos réponses. Le devis est posé après un premier échange.</p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Écrire les styles**

Créer `src/styles/estimator.css` :

```css
.estimator {
  margin-top: 4.5rem;
  padding: 2.5rem 2rem 2.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: var(--shadow-soft);
  position: relative;
  overflow: hidden;
}

/* halo d'accent décentré : de la profondeur, pas un aplat */
.estimator::before {
  content: '';
  position: absolute;
  top: -140px;
  right: -110px;
  width: 340px;
  height: 340px;
  background: var(--glow-accent);
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}

.estimator-head { max-width: 34rem; margin-bottom: 2rem; }

.estimator-eyebrow {
  font-size: 0.6875rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--accent);
}

.estimator-title {
  font-size: clamp(1.5rem, 3vw, 2rem);
  line-height: 1.15;
  margin: 0.6rem 0 0.5rem;
  color: var(--text);
}

.estimator-sub { color: var(--muted); font-size: 0.95rem; margin: 0; }

.estimator-q { border: 0; padding: 0; margin: 0 0 1.75rem; }

.estimator-legend {
  font-size: 0.8125rem;
  color: var(--muted);
  margin-bottom: 0.75rem;
  padding: 0;
}

.estimator-options { display: flex; flex-wrap: wrap; gap: 0.5rem; }

.estimator-opt { position: relative; }

/* le radio reste focusable : accessible sans JS */
.estimator-opt input {
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
}

.estimator-opt span {
  display: block;
  padding: 0.6rem 1.05rem;
  border: 1px solid var(--border);
  border-radius: 999px;
  font-size: 0.9rem;
  color: var(--text);
  background: var(--bg);
  transition: border-color var(--transition), background var(--transition),
              transform var(--transition);
}

.estimator-opt input:hover + span { border-color: var(--accent); }

.estimator-opt input:focus-visible + span {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.estimator-opt input:checked + span {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
  transform: translateY(-1px);
}

.estimator-result {
  margin-top: 0.5rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--border);
  animation: estimator-in 0.5s var(--ease) both;
}

.estimator-result[hidden] { display: none; }

.estimator-result-label {
  font-size: 0.75rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted);
}

.estimator-offer {
  font-size: 1.25rem;
  margin: 0.35rem 0 0.15rem;
  color: var(--text);
}

.estimator-range {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  line-height: 1.1;
  margin: 0.25rem 0 0.35rem;
  color: var(--accent);
}

.estimator-delay { color: var(--muted); font-size: 0.9rem; margin: 0 0 1.5rem; }

.estimator-cta {
  display: inline-block;
  padding: 0.85rem 1.6rem;
  background: var(--text);
  color: var(--bg);
  border-radius: 999px;
  font-size: 0.95rem;
  text-decoration: none;
  transition: transform var(--transition), background var(--transition);
}

.estimator-cta:hover { background: var(--accent); transform: translateY(-2px); }

.estimator-disclaimer {
  margin: 1.1rem 0 0;
  font-size: 0.78rem;
  line-height: 1.5;
  color: var(--muted);
  max-width: 32rem;
}

@keyframes estimator-in {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: none; }
}

@media (max-width: 640px) {
  .estimator { padding: 2rem 1.25rem 2.25rem; border-radius: 18px; }
  .estimator-options { gap: 0.4rem; }
  .estimator-opt span { padding: 0.55rem 0.9rem; font-size: 0.85rem; }
}

@media (prefers-reduced-motion: reduce) {
  .estimator-result { animation: none; }
  .estimator-opt span,
  .estimator-cta { transition: none; }
  .estimator-opt input:checked + span,
  .estimator-cta:hover { transform: none; }
}
```

- [ ] **Step 3: Importer les styles**

Repérer dans `src/style.css` comment `contact-form.css` est importé, et ajouter la ligne équivalente pour `estimator.css` juste à côté.

- [ ] **Step 4: Vérifier visuellement**

Run: `npm run dev`

Ouvrir la section tarifs. Attendu :
- Le bloc apparaît sous les trois cartes, avec les trois questions et leurs options en pastilles.
- Cliquer une option la colore en accent.
- La zone de résultat reste invisible, aucun script ne la pilote encore.
- Sur mobile (largeur 375 px), les pastilles passent à la ligne sans débordement horizontal.
- Navigation au clavier : Tab atteint chaque groupe, les flèches parcourent les options d'un même groupe, l'anneau de focus est visible.

- [ ] **Step 5: Commit**

```bash
git add index.html src/styles/estimator.css src/style.css
git commit -m "Estimateur : markup et styles"
```

---

### Task 4: Composant et branchement

**Files:**
- Create: `src/components/estimator.ts`
- Modify: `src/main.ts` (import et appel)

**Interfaces:**
- Consumes: `estimate()` de la Task 1, `ContactFormHandle` de la Task 2, le DOM de la Task 3.
- Produces: `initEstimator(form: ContactFormHandle | null): void`.

- [ ] **Step 1: Écrire le composant**

Créer `src/components/estimator.ts` :

```ts
import { estimate } from './estimator-pricing'
import type { SiteType, SizeChoice, ContentChoice } from './estimator-pricing'
import type { ContactFormHandle } from './contact-form'

type UmamiWindow = Window & {
  umami?: { track: (event: string, data?: Record<string, unknown>) => void }
}

function track(event: string, data?: Record<string, unknown>): void {
  ;(window as UmamiWindow).umami?.track(event, data)
}

const euros = (n: number): string => n.toLocaleString('fr-FR') + ' €'

export function initEstimator(form: ContactFormHandle | null): void {
  const root = document.querySelector<HTMLElement>('#estimator')
  const formEl = document.querySelector<HTMLFormElement>('#estimatorForm')
  const result = document.querySelector<HTMLElement>('#estimatorResult')
  if (!root || !formEl || !result) return

  const offerEl = document.querySelector<HTMLElement>('#estimatorOffer')!
  const rangeEl = document.querySelector<HTMLElement>('#estimatorRange')!
  const delayEl = document.querySelector<HTMLElement>('#estimatorDelay')!
  const cta     = document.querySelector<HTMLAnchorElement>('#estimatorCta')!

  let started = false
  let last: ReturnType<typeof estimate> | null = null

  const read = (name: string): string | null =>
    formEl.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? null

  function update(): void {
    if (!started) {
      started = true
      track('estimateur-demarre')
    }

    const type = read('type') as SiteType | null
    const size = read('size') as SizeChoice | null
    const content = read('content') as ContentChoice | null
    if (!type || !size || !content) return

    const r = estimate({ type, size, content })
    last = r

    offerEl.textContent = `Offre ${r.offer}`
    rangeEl.textContent = r.showPrice && r.min !== null && r.max !== null
      ? `${euros(r.min)} – ${euros(r.max)}`
      : 'À définir ensemble'
    delayEl.textContent = `Livraison estimée · ${r.delay}`

    result.hidden = false
    track('estimateur-resultat', { offre: r.offer, type: r.projectType })
  }

  formEl.addEventListener('change', update)

  cta.addEventListener('click', () => {
    track('estimateur-vers-contact', { offre: last?.offer ?? 'inconnue' })
    if (!last || !form) return
    form.prefill({
      projectType: last.projectType,
      budget:      last.budget,
      delay:       last.formDelay,
    })
    // L'ancre #contact fait défiler ; on saute d'étape juste après, le temps
    // que le formulaire soit à l'écran.
    setTimeout(() => form.jumpToContact(), 500)
  })
}
```

- [ ] **Step 2: Brancher dans main.ts**

Ajouter l'import en haut de `src/main.ts`, sous les imports existants :

```ts
import { initEstimator } from './components/estimator'
```

Puis, juste après la ligne `const contactForm = initContactForm()` :

```ts
initEstimator(contactForm)
```

- [ ] **Step 3: Vérifier le build**

Run: `npm run build`
Expected: succès, aucune erreur TypeScript.

- [ ] **Step 4: Vérifier le parcours complet**

Run: `npm run dev`

Vérifier une à une :
1. Répondre aux trois questions fait apparaître le résultat.
2. Vitrine · une page · contenus prêts affiche « Offre Fondation », « 900 € – 1 200 € », « 2 à 3 semaines ».
3. Application affiche « À définir ensemble » et aucun chiffre.
4. Changer une réponse met le résultat à jour immédiatement.
5. Cliquer « Discuter de ce projet » fait défiler jusqu'au formulaire, puis l'ouvre à l'étape Contact, les trois premières étapes marquées comme faites.
6. Revenir en arrière dans le formulaire montre Projet, Budget et Délai renseignés conformément à l'estimation.

- [ ] **Step 5: Commit**

```bash
git add src/components/estimator.ts src/main.ts
git commit -m "Estimateur : composant et branchement au formulaire"
```

---

### Task 5: Vérification finale et mise en ligne

**Files:**
- Modify: aucun, sauf correctifs issus des vérifications.

**Interfaces:**
- Consumes: tout ce qui précède.
- Produces: rien.

- [ ] **Step 1: Tests et build**

```bash
npm test
npm run build
```

Expected: 10 tests au vert, build sans erreur.

- [ ] **Step 2: Parcours au clavier uniquement**

Souris débranchée, depuis le haut de la page : atteindre l'estimateur à la tabulation, sélectionner une option par groupe avec les flèches, atteindre le bouton, l'activer avec Entrée. Le focus doit rester visible en permanence.

- [ ] **Step 3: Cas limites**

Vérifier les trois combinaisons qui ont le plus de risque de produire une sortie incohérente :
- Application + n'importe quelle taille : aucun chiffre affiché nulle part.
- Taille « je ne sais pas encore » : fourchette large, budget transmis `a-def`.
- Boutique + une page : fourchette 3 000 – 4 400 €, pas de division par zéro ni de champ vide.

- [ ] **Step 4: Mouvement réduit**

Activer Réglages Système → Accessibilité → Affichage → Réduire les animations. Recharger : le résultat apparaît sans animation, les pastilles ne se déplacent plus au survol.

- [ ] **Step 5: Mobile**

Largeur 375 px : aucun défilement horizontal, pastilles lisibles, fourchette non tronquée.

- [ ] **Step 6: Pousser**

```bash
git push
```

Vercel construit et déploie. Vérifier ensuite sur `studioskone.com` que l'estimateur répond comme en local.

---

## Notes d'implémentation

**Ce que ce plan ne fait pas** : aucune sauvegarde des réponses, aucun envoi d'estimation par mail, aucun PDF. Ces ajouts déclencheraient des obligations RGPD sans servir l'objectif.

**Task 2, point de vigilance.** Le markup des choix a été vérifié avant l'écriture de ce plan : `buildChoice()` (ligne 103) produit bien `data-field` et `data-value`, et `selectChoice()` (ligne 510) porte l'état par `is-selected` et `aria-pressed`. `syncChoiceUI()` reprend cette convention à l'identique. Les trois dépendances de `syncChoiceUI()` et `jumpToContact()` ont également été confirmées : `this.container` est une propriété privée (ligne 351), `updateNextBtn()` existe (ligne 641), et `goTo(nextIdx, dir)` lit `panels[nextIdx]` directement, donc accepte un saut de trois étapes aussi bien que d'une.

**Le délai de 500 ms** avant `jumpToContact()` compense le défilement de l'ancre. Si le saut d'étape se produit avant que le formulaire soit visible, augmenter la valeur ou écouter la fin du défilement.
