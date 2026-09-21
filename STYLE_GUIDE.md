# STYLE_GUIDE.md — Studio Skøne

> Référence unique de la refonte 2026. Toute valeur de design vient d'ici.
> En cas de contradiction entre ce fichier et une maquette, ce fichier gagne, sauf pour la mise en page.

---

## 0. Règles absolues

1. **Le copywriting ne change jamais.** Pas un mot, pas une virgule, pas un titre. Les textes viennent de studioskone.com. Si un texte ne rentre pas dans une mise en page, on change la mise en page.
2. **Aucune régression SEO.** URL, meta, canonical, Open Graph, geo, données structurées et attributs alt repris à l'identique.
3. **Aucune ombre, aucun dégradé, aucun flou.** Seules exceptions : l'anneau de focus clavier, et un futur menu déroulant ou une modale, où l'ombre signale une vraie superposition.
4. **Un seul mot en accent sur tout le site** : « même personne » dans le hero. Aucun autre titre, sur aucune page, n'a de mot coloré.

---

## 1. Couleur

### Fond clair

| Token | Valeur | Usage |
|---|---|---|
| `--papier` | `#F6ECDB` | Fond principal |
| `--papier-ombre` | `#EEE2CC` | Blocs, rubans, variations de surface |
| `--encre` | `#14181C` | Texte principal |
| `--accent` | `#12455C` | Bleu de Prusse. Accent sur fond clair |
| `--accent-profond` | `#0C3242` | Survols et états actifs |
| `--gris` | `#5F6468` | Texte secondaire |

### Sections sombres

| Token | Valeur | Usage |
|---|---|---|
| `--sombre` | `#121A20` | Fond des sections en négatif : encre teintée vers l'accent (texte 15.02, accent clair 6.60). Le bleu de Prusse plein est écarté comme fond. |
| `--sombre-texte` | `#F6ECDB` | Texte sur sombre |
| `--accent-clair` | `#5FA8C4` | Accent sur fond sombre, à ajuster après mesure |

**Le bleu de Prusse ne porte jamais de texte sur fond sombre**, son contraste est insuffisant. Sur sombre, il ne sert qu'aux filets et aux points d'état.

Toutes les paires texte/fond doivent être vérifiées en WCAG AA. Toute valeur qui échoue est assombrie et signalée.

### Dosage

L'accent ne dépasse jamais 3 % de la surface d'un écran. En dehors du mot du hero, ses seuls usages sont fonctionnels : bouton principal, survols, états actifs, anneaux de focus, filets d'accent, points d'état, curseur.

---

## 2. Le grain

C'est la matière du site, elle n'est pas optionnelle.

- Bruit fin, non répétitif, **teinté brun chaud `#6B5A44`**
- Mode `multiply`, opacité **12 %** sur le papier ; `screen`, opacité **22 %** sur les sections sombres
- Motif de 300 px **étiré à 480 px** (`--grain-taille`) : c'est la taille des grains, pas l'opacité, qui fait passer d'une brume invisible à une matière
- **Jamais un bruit gris** : en multiply, il désature le papier et le fait paraître terne
- Appliqué **en fond uniquement**, derrière tout le contenu. Jamais sur une couche qui recouvre le texte, sinon les lettres sont salies.
- **Une seule couche pour toute la page**, pas une par section
- Sur les sections sombres, le multiply brun n'est pas visible : il y passe en `screen` à 22 %. La matière traverse les deux registres.

---

## 3. Typographie

| Rôle | Famille | Réglages |
|---|---|---|
| Display | **Bricolage Grotesque** (variable) | Graisses 700 et 800, `font-stretch: 92%`, interlettrage -0.02em à -0.035em, interlignage 0.90 à 1.0 sur les grandes tailles |
| Texte | **Switzer** | 400 et 500, longueur de ligne sous 75 caractères |
| Donnée | **JetBrains Mono** | 400, 12 à 13 px |

Échelle en `clamp()` :

```
display  clamp(3.5rem, 8vw, 8.5rem)   Bricolage 800, wdth 92, -0.035em
h1       clamp(2.75rem, 5.5vw, 5rem)  Bricolage 800, wdth 92, -0.03em
h2       clamp(2rem, 3.5vw, 3rem)     Bricolage 700, -0.025em
h3       1.5rem                        Bricolage 700, -0.02em
corps L  1.25rem                       Switzer 400
corps    1.0625rem                     Switzer 400
petit    0.875rem                      Switzer 400
data     0.8125rem                     JetBrains Mono 400
```

- Titres en **casse de phrase**, jamais en capitales
- Le monospace ne sert qu'à de la donnée réelle : prix, numéros d'étape, durées, années
- **Deux `text-transform: uppercase` maximum sur toute la page**, et uniquement pour une information de statut

Polices auto-hébergées en `@font-face` depuis `/public/fonts`, préchargées, `font-display: swap`, `size-adjust` pour éviter tout décalage. Aucun CDN de polices.

---

## 4. Rondeur

| Élément | Valeur |
|---|---|
| Interactifs : boutons, champs, boutons de choix, en-têtes d'accordéon | **10 px** |
| Blocs de contenu | **16 px** |
| Images de projet et vignettes | **16 px** |
| Sections pleine largeur, bord à bord | **0** |

Aucune valeur intermédiaire ailleurs. Aucune pilule.

---

## 5. Grille et espacement

- 12 colonnes, gouttière 24 px, marges 40 px en mobile et 64 px au-delà, largeur max 1440 px
- **Aucun filet vertical.** La grille est un système d'alignement, elle n'est pas dessinée.
- Filets horizontaux uniquement, 1 px, encre à 12 % d'opacité, en séparation entre sections. Jamais dans une zone sans contenu.
- **Pas de filet entre la navigation et le hero.**
- **Aucun filet comme séparateur de liste.** Un filet sépare des sections, jamais les items d'une même liste. Deux traitements selon le contenu :
  - **Liste courte de phrases** (symptômes, bandeau de réassurance du hero) : l'espace seul, aucun trait, un espacement vertical franc.
  - **Liste d'arguments avec un titre et un texte** (engagements, avantages, formules, nuances de tarifs) : des cartes. Fond `--papier-ombre` (ou `--papier` quand la carte tombe dans une section déjà `--papier-ombre`), rayon 16 px, padding généreux, aucune bordure, aucune ombre. Grille de deux colonnes sur desktop, une colonne sur mobile. Dans une carte à fond `--papier-ombre`, le texte secondaire s'écrit en `--encre`, jamais en `--gris`, qui y tombe à 4.67 de contraste.
- Espacement vertical sur une échelle de 8 px. Entre sections : **96, 160 ou 240 px**. Trois valeurs, jamais une intermédiaire.
- Les blocs ne sont jamais centrés par défaut. L'asymétrie est la norme.
- Breakpoints de référence : **390, 768, 1024, 1440**.

---

## 6. Rythme clair / sombre

Quatre sections sombres, jamais deux à la suite. Transitions franches, bord à bord, sans dégradé.

| # | Section | Fond |
|---|---|---|
| 1 | Hero | clair |
| 2 | Ruban des prestations | clair |
| 3 | Votre site ne travaille pas pour vous | clair |
| 4 | Rien de tout ça n'est votre métier | **sombre** |
| 5 | Le studio, avec le portrait | clair |
| 6 | Transparence | clair |
| 7 | Prestations | clair |
| 8 | Méthode | **sombre** |
| 9 | Réalisations, double ruban | clair |
| 10 | Tarifs | clair |
| 11 | Estimateur et contact fusionnés | **sombre** |
| 12 | FAQ | clair |
| 13 | Engagements | clair |
| 14 | Contact et pied de page | **sombre** |

L'ordre des sections ne change pas.

---

## 7. Composants

**Navigation.** Collée en haut, sans filet de séparation avec le hero. Au survol, le libellé glisse vers le haut et sort du cadre pendant qu'une copie identique arrive par le bas, en masque, 300 ms. Aucun soulignement, aucun changement de couleur : le mouvement est le seul signal. L'entrée active porte un point de 4 px en accent. Sur les sections sombres, le texte passe automatiquement en `--sombre-texte` et le CTA en contour clair, transition 200 ms.

**Bouton principal.** Fond `--accent`, texte `--papier`, radius 10 px. Survol : fond `--accent-profond`. Aucun scale, aucune ombre.

**Bouton secondaire et lien de texte.** Soulignement qui se redessine de gauche à droite, 250 ms. Le texte passe en accent.

**Hero.** Titre pleine largeur en display. Paragraphe à gauche, bloc d'action à droite avec les deux boutons **sur une même ligne**, bouton plein à gauche, lien souligné à droite, 24 px entre les deux. Bandeau de réassurance à quatre mentions séparées par l'espace seul, aucun filet. Une seule forme graphique : un grand arc en débord du bord droit, 8 à 10 % d'opacité, dans la moitié basse, jamais derrière un mot. Le hero reste sous la hauteur d'écran et la section suivante affleure sur 80 à 120 px.

**Vignette de projet.** Ratio uniforme 16/10, **toutes de la même taille**, radius 16 px, cadrage sur le haut du site, jamais rognée sur son contenu. Aucun badge posé dessus, aucun cadre de navigateur dessiné. Au survol, l'image ne bouge pas : le curseur passe en pastille « Voir le projet » et le titre passe en accent.

**Réalisations.** Double ruban défilant, deux rangées en sens inverse, 45 à 60 s par cycle, boucle sans couture par duplication, arrêt au survol, défilement possible à la souris. Sous 1024 px : grille verticale statique.

**Prestations.** Six blocs de tailles variables selon l'importance. **Aucune numérotation**, ce n'est pas une séquence. Prix en JetBrains Mono.

**Tarifs.** Trois offres. **Aucun filet entre les lignes d'une liste** : une liste se lit par l'espace. L'offre recommandée se distingue franchement, par la taille, l'air et la densité de fond : plus de colonnes, prix en display, peut dépasser verticalement. **Jamais d'aplat en couleur d'accent derrière une offre.**

**Estimateur et contact, parcours unique.** L'estimateur et le formulaire sont fusionnés : le visiteur ne saisit jamais deux fois la même information. Une question par écran, en display, grandes zones cliquables. Progression par un filet horizontal qui se remplit, jamais un compteur « étape 2 sur 5 ». Navigation clavier complète. La fourchette s'affiche après les trois questions, puis deux champs seulement.

**Méthode.** Quatre étapes numérotées, **seule séquence numérotée du site**. Sticky sur fond sombre, l'étape active se distingue nettement.

**Engagements.** Cinq items, aucune numérotation.

---

## 8. Curseur

Existant, conservé. Point de 10 px en accent, `position: fixed`, suivi par interpolation en `requestAnimationFrame`, position en `transform: translate3d()`.

Quatre états : repos 10 px · sur un élément cliquable, 40 px et `cursor: none` sur la cible · sur une vignette projet, pastille « Voir le projet » · sur fond sombre, couleur `--papier`.

Désactivé sous 1024 px, sur `(pointer: coarse)` et en `prefers-reduced-motion`. Ne remplace jamais le curseur système sur les champs et le texte sélectionnable. Une seule instance dans le layout.

---

## 9. Mouvement

**Principe : rien ne bouge en Z.** Aucun soulèvement, aucune ombre, aucune profondeur simulée. Tout se joue dans le plan : masque, glissement, couleur.

Courbe unique : `cubic-bezier(0.16, 1, 0.3, 1)`. Survols 200 ms, révélations 600 ms.

**Partout :** révélation par masque vertical avec translation de 16 px, déclenchée à 85 % du viewport, jouée une seule fois · cascade de 60 ms dans les listes · chiffres qui s'incrémentent à l'entrée dans le viewport · formes graphiques en parallaxe très lente, jamais de mouvement autonome.

**Quatre moments orchestrés :**
1. Hero au chargement : titre ligne par ligne, puis paragraphe et boutons, puis le curseur. Deux secondes, une seule fois par session.
2. Double ruban des réalisations.
3. Méthode en sticky sur fond sombre.
4. Estimateur plein écran, 250 ms entre étapes.

**Survols détaillés :** ligne de prestation, un filet en accent se trace de gauche à droite et le prix passe en accent · bouton de choix, fond et bordure changent d'un coup, état sélectionné franc en encre sur papier · champ de formulaire, bordure en accent au focus, sans halo · accordéon, ouverture en hauteur 350 ms, indicateur en trait qui pivote de 90°, jamais un chevron qui rebondit.

**Focus clavier :** anneau de 2 px en accent, décalé de 2 px. Jamais supprimé, jamais remplacé par le curseur personnalisé. Seule exception à l'interdiction des effets de contour.

**`prefers-reduced-motion: reduce` :** tout est visible à l'état final immédiatement. Pas de pin, pas de scrub, pas de parallaxe. Les rubans deviennent des grilles statiques. Les formes graphiques sont supprimées. Les survols ne gardent que le changement de couleur.

---

## 10. Interdits

Vérifiables par `grep`, doivent revenir vides.

- `box-shadow`, `drop-shadow`, `filter: blur`, sauf anneau de focus
- `linear-gradient`, `radial-gradient`
- Toute couleur en dur : uniquement des tokens
- `!important`
- Effet de verre dépoli ou de transparence sur un bouton
- Radius hors des quatre valeurs de la section 4
- `text-transform: uppercase` au-delà des deux libellés autorisés
- Flèche dans une chaîne de texte de bouton : si nécessaire, SVG à part, `aria-hidden`
- Trame de points, quadrillage, motif géométrique en fond
- Badge en pilule posé sur une image
- Numérotation hors les 4 étapes de la méthode
- Plus d'un mot en accent sur tout le site

---

## 11. Stack et implémentation

- **Vite en multi-pages**, TypeScript strict, CSS natif écrit à la main. Pas de framework de composants, pas de migration.
- Tokens déclarés une seule fois dans `:root`, fichier `src/styles/tokens.css`. Aucun second endroit où une couleur est définie.
- **GSAP + ScrollTrigger** en vanilla, seule librairie d'animation. Importés en dynamique, chargés au-delà de 1024 px quand l'animation ne concerne que le desktop. Contextes via `gsap.context()`, nettoyés au démontage. Un seul `ScrollTrigger.refresh()` après chargement des polices.
- **Pas de Lenis, pas de scroll lissé.** Scroll natif.
- Un module TypeScript par comportement, qui ne s'initialise que si sa cible existe dans la page.
- Données des projets et des prestations dans des fichiers typés, pas en dur dans le HTML.
- Navigation, pied de page et bandeau cookies factorisés une seule fois.
- Hébergement Vercel. Umami conservé intact.

---

## 12. Performance et accessibilité

- Lighthouse mobile : Performance 90 minimum, Accessibilité 100, Bonnes pratiques 100, SEO 100. Aucun score en baisse par rapport à l'existant.
- LCP sous 2.0 s en 4G simulée, CLS sous 0.05
- Images en WebP, `srcset` et `sizes`, dimensions déclarées, `loading="lazy"` sauf sur le hero
- Structure de titres logique, un seul `h1` par page
- Navigation complète au clavier, accordéons et estimateur inclus
- `aria-expanded` et `aria-controls` sur les accordéons
- Le ruban s'arrête au survol et en `prefers-reduced-motion`
- Aucune information portée par la couleur seule
