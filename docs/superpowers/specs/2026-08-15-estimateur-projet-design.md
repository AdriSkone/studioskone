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

- **Type** : fixe la base. Boutique en ligne part de Studio, application de Sur
  mesure.
- **Taille** : déplace la fourchette et détermine l'offre. Une page donne
  Fondation, au-delà c'est Studio.
- **Contenus** : élargit le haut de la fourchette. Ne change jamais l'offre
  recommandée, ni la tranche de budget transmise.

Le seuil de bascule Fondation / Studio est d'**une page**, et non de cinq :
l'offre Fondation a été ramenée à une page le 2026-08-16. Un site de 2 à 5
pages relève donc de Studio.

Le choix « en partie » sur les contenus applique la moitié du supplément, soit
+12 %. Le spec initial ne traitait que « à créer ».

### Grille tarifaire

Établie sur un TJM de 400 €. Chaque fourchette correspond à un nombre de jours
multiplié par ce taux, ce qui permet de la recalculer si le TJM évolue.

| | 1 page | 2-5 pages | 6-12 pages |
|---|---|---|---|
| Vitrine | 900 – 1 200 € | 1 600 – 2 400 € | 2 800 – 4 400 € |
| Vitrine + réservation/devis | 1 400 – 1 800 € | 2 000 – 3 000 € | 3 200 – 4 800 € |
| Boutique en ligne | — | 3 000 – 4 400 € | 4 000 – 6 400 € |
| Application | Aucun chiffre, « à définir ensemble » |

La boutique en ligne n'a pas de variante une page : le choix reste affiché mais
renvoie la fourchette 2-5 pages.

Contenus à créer : +25 % sur le haut de la fourchette uniquement. Une fourchette
1 600 – 2 400 € devient 1 600 – 3 000 €. Le bas ne bouge jamais.

Le choix « je ne sais pas encore » sur la taille affiche la fourchette complète
de la ligne, du plancher 1 page au plafond 6-12 pages.

Cette grille suppose l'offre Fondation limitée à une page. Le libellé
« jusqu'à 5 pages » a été corrigé dans `index.html` et le JSON-LD le
2026-08-16, sans quoi la page tarifs contredirait l'estimateur.

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

Pour tous les autres cas, la tranche transmise est celle qui contient le milieu
de la fourchette estimée. Une estimation 1 600 – 2 400 € a pour milieu 2 000 €,
donc `1k-3k`. Une estimation 3 000 – 4 400 € a pour milieu 3 700 €, donc
`3k-5k`. Le supplément « contenus à créer » est exclu de ce calcul : il élargit
l'affichage sans déplacer la tranche annoncée au formulaire.

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
