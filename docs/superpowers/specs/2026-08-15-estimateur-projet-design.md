# Estimateur de projet · section tarifs

Date : 2026-08-15

## Contexte

Le site affiche trois offres : Fondation (900€), Studio (2500€) et Sur mesure.
Un visiteur qui n'a jamais commandé de site ne sait pas dans laquelle il tombe.

Le formulaire de contact est déjà un questionnaire en quatre étapes (Projet,
Budget, Délai, Contact). Sa deuxième étape demande au visiteur sa fourchette de
budget, ce qu'un artisan est justement incapable d'estimer. C'est un point
d'abandon probable.

L'estimateur inverse la relation : au lieu de demander un budget, il en propose
un. Il ne remplace pas le formulaire, il l'alimente.

## Objectif

Permettre à un visiteur de situer son projet en moins d'une minute, puis
d'entrer en contact avec un parcours raccourci.

Critères de réussite :

1. Trois questions suffisent à produire une estimation.
2. Le passage à l'étape Contact du formulaire se fait avec Projet, Budget et
   Délai déjà renseignés.
3. Aucune estimation ne peut être lue comme un devis ferme.

## Architecture

### Fichiers

| Fichier | Rôle |
|---|---|
| `src/components/estimator.ts` | Composant, environ 200 lignes, sans dépendance |
| `src/styles/estimator.css` | Styles, tokens existants |
| `index.html` | Bloc dans la section `#tarifs` |
| `src/main.ts` | Appel à `initEstimator()` |
| `src/components/contact-form.ts` | Ajout d'une façade publique (voir plus bas) |

### Interface avec le formulaire

`contact-form.ts` n'exporte aujourd'hui que `initContactForm()`. La classe
`ContactForm` est privée, l'instance n'est pas conservée, et `goTo()` est une
méthode privée.

`initContactForm()` retournera une façade exposant exactement deux méthodes :

```ts
type ContactFormHandle = {
  prefill(data: { projectType: string; budget: string; delay: string }): void
  jumpToContact(): void
}
```

L'estimateur ne connaît que ces deux méthodes. L'intérieur du formulaire reste
fermé. Modification additive d'une quinzaine de lignes, sans toucher à la
logique existante.

Le découpage de `contact-form.ts` (790 lignes) n'entre pas dans ce périmètre.

### Les trois questions

1. **Type de site** : vitrine · vitrine avec réservation ou devis · boutique en
   ligne · application
2. **Taille** : une page · 2 à 5 pages · 6 à 12 pages · je ne sais pas encore
3. **Contenus** : textes et photos prêts · en partie · à créer

La troisième question porte sur ce qui pèse le plus dans un devis réel, et
apprend au visiteur qu'un site ne se limite pas au design.

Effet de chaque question sur la fourchette :

- **Type** : fixe la base et l'offre. Vitrine et vitrine avec réservation
  partent de Fondation, boutique en ligne de Studio, application de Sur mesure.
- **Taille** : déplace la fourchette à l'intérieur de l'offre, et fait basculer
  de Fondation à Studio au-delà de 5 pages.
- **Contenus** : élargit le haut de la fourchette quand textes et photos sont à
  créer. Ne change jamais l'offre recommandée.

### Sortie

Une fourchette, l'offre correspondante, un délai estimé, puis un bouton
« Discuter de ce projet ».

Règles de formulation :

- Fourchettes larges, jamais un prix isolé (« 1 200 à 1 800 € »).
- Jamais de plancher seul, qui serait lu comme un prix ferme.
- Pour le type « application » : aucun chiffre, mention « à définir ensemble ».
- Mention permanente indiquant qu'il s'agit d'une estimation et non d'un devis.

### Correspondance vers le formulaire

Les valeurs transmises reprennent celles déjà définies dans `contact-form.ts` :

- `projectType` : `vitrine`, `ecommerce`, `app-web`, `redesign`, `autre`
- `budget` : `1k-3k`, `3k-5k`, `5k-10k`, `10k+`, `a-def`
- `delay` : `urgent`, `2-4w`, `1-2m`, `flex`

Correspondance de la première question, les quatre choix de l'estimateur ne
recouvrant pas les cinq du formulaire :

| Choix estimateur | `projectType` |
|---|---|
| Vitrine | `vitrine` |
| Vitrine avec réservation ou devis | `vitrine` |
| Boutique en ligne | `ecommerce` |
| Application | `app-web` |

`redesign` et `autre` restent accessibles dans le formulaire, jamais produits
par l'estimateur : une refonte se décrit mal en trois questions.

Le type « application » et le choix « je ne sais pas encore » envoient `a-def`
en budget.

Le délai affiché en sortie est indicatif, déduit de l'offre retenue. Il n'est
pas transmis : l'estimateur ne pose pas la question, donc `delay` part à `flex`
par défaut, et le visiteur peut le corriger en revenant d'une étape dans le
formulaire.

## Accessibilité

`<fieldset>` et `<legend>` avec de vrais boutons radio, pas des `<div>`
cliquables : la navigation clavier et les lecteurs d'écran fonctionnent sans
code supplémentaire. Résultat annoncé via `aria-live="polite"`. Transitions
soumises à `prefers-reduced-motion`, comme le reste du site.

## Mesure

Umami est branché dans `src/main.ts:57`, conditionné aux variables
d'environnement. Trois événements : démarrage de l'estimation, estimation
obtenue, clic vers le formulaire. Ils indiqueront si l'outil sert, et à quelle
question les visiteurs décrochent.

## Hors périmètre

- Sauvegarde des réponses, génération de PDF, envoi par mail : sans utilité ici
  et générateurs d'obligations RGPD.
- Découpage de `contact-form.ts`.
- Modification des trois offres ou de leurs prix.

## Vérification

- `npm run build` passe.
- Parcours complet au clavier seul, sans souris.
- Les trois combinaisons limites produisent une sortie cohérente : application,
  « je ne sais pas encore », et vitrine une page.
- Le formulaire s'ouvre à l'étape Contact avec les trois champs renseignés.
- Aucun chiffre affiché pour le type application.
