# Refonte de l'offre et des tarifs

Document de conception — 18 septembre 2026

## 1. Ce qu'on fait, et pourquoi

Trois formules remplacent les trois offres actuelles. Chacune est définie par
ce que le client obtient, et le nombre de pages sert de critère, parce que
c'est le seul que le client comprend et compare.

| | Formule | Prix | Pour qui |
|---|---|---|---|
| 1 | Une page | 900 € | Se rendre visible vite, un seul message, un seul appel à l'action |
| 2 | Site complet | 1 900 € | 4 à 6 pages, l'offre détaillée, le référencement local |
| 3 | Sur mesure | à partir de 3 000 € | E-commerce, application web ou mobile, plateforme |

La formule intermédiaire comble le trou entre 900 € et 2 500 €, et c'est elle
qui doit capter la majorité des demandes. Le badge « Le plus choisi »
disparaît : il est remplacé par une recommandation fondée sur le besoin
(« Recommandé si vous avez plusieurs services à présenter »), qui aide à
choisir et qui reste vraie.

**Le prospect de référence est un artisan qui n'a jamais fait faire de site
et qui craint que ça traîne et que ça lui prenne du temps.** Chaque arbitrage
ci-dessous se juge à cette aune : les délais sont fermes et courts, le
paiement se compte sans calculette, et ce qui n'est pas inclus est écrit.

### Décisions prises avec Adri le 18 septembre 2026

1. **Périmètre : tout le site est aligné.** Prix, délais et paiement sont
   repris partout, pas seulement dans la section Tarifs.
2. **Paiement.** Une page et Site complet : 50 % à la commande, 50 % à la
   mise en ligne. Sur mesure : 30 % à la commande, 40 % à la validation des
   maquettes, 30 % à la mise en ligne. Le paiement du milieu est attaché à un
   moment que le client signe, pas à un « mi-parcours » discutable.
3. **Hébergement : à la charge du client**, comme aujourd'hui et comme
   l'article 8.1 des CGV. La mention « hébergement inclus » du brief est
   retirée de la formule Une page.
4. **Délais : 1 semaine pour Une page, 3 semaines pour Site complet**, définis
   au cadrage pour Sur mesure. Toujours suivis de leur condition, dans la même
   phrase : « à partir du moment où j'ai vos textes et vos photos ».
   Contrepartie opérationnelle, non écrite sur le site : une seule Une page en
   cours à la fois.
5. **Pas de page /tarifs dédiée** pour l'instant. La section `#tarifs` de
   l'accueil reçoit déjà les liens des pages prestations et du pied de page.
6. **« Pour situer » garde ses chiffres** (agence 3 500–8 000 €, plateforme à
   29 €/mois) et reçoit en plus la phrase « Je ne suis pas moins cher parce
   que j'en fais moins… ».
7. **Les paliers des 4 pages prestations s'alignent** sur les trois formules,
   avec le vocabulaire de chaque métier.

## 2. Le copy

Le texte des trois cartes, des blocs « Dans toutes les formules », « Ce qui
reste à votre charge » et de l'offre de lancement est repris du brief d'Adri,
avec trois corrections issues des décisions ci-dessus :

- « Mise en ligne et hébergement inclus » devient « Mise en ligne incluse ».
  L'hébergement rejoint « Ce qui reste à votre charge », avec sa fourchette
  actuelle (0 à 15 € par mois) et le rappel qu'il est payé en direct.
- « Livré en 5 jours ouvrés » devient « Livré en 1 semaine ».
- « Paiement en deux fois. La moitié au lancement, la moitié à la mise en
  ligne. Trois fois au-delà de 2 000 € » devient « Paiement en deux fois. La
  moitié à la commande, la moitié à la mise en ligne. En trois fois pour les
  projets sur mesure. »

Les options sous les cartes : design seul à partir de 600 €, rédaction des
textes 200 € par page, séance photo sur devis avec un photographe partenaire.

Les retouches suivent le brief : deux séries pour Une page, trois séries pour
Site complet, défini au cadrage pour Sur mesure. La FAQ n° 8, qui dit encore
« ajustements continus sur l'offre Studio », est réécrite en conséquence.

## 3. Le design de la section

Structure interne d'une carte, de haut en bas : nom de la formule en corps de
texte, prix en display, phrase de positionnement, paragraphe, liste des
inclus, ligne de délai en JetBrains Mono, mention « ce qui fait bouger le
prix » en gris, bouton aligné en bas des trois cartes.

**Aucun filet entre les lignes des listes.** La séparation se fait par
l'espace seul. C'est le défaut principal de la version actuelle, qui fait
tableur.

La formule 2 se distingue sans aplat de couleur : plus de colonnes, prix d'un
cran plus grand dans l'échelle, nettement plus de padding, elle dépasse
verticalement les deux autres, et son fond est en papier ombré quand les
autres sont en papier.

Règles héritées du style guide : rayon 16 px sur les cartes, 10 px sur les
boutons, aucune ombre, aucun dégradé, aucun aplat en couleur d'accent, aucune
icône, aucun badge en pilule.

Sous les cartes, pleine largeur : « Dans toutes les formules » (4 arguments),
« Ce qui reste à votre charge » (3 lignes), puis « Pour situer ».

**Mobile.** Les trois cartes s'empilent, la formule 2 en premier. Le bouton
reste atteignable sans dérouler toute la liste : sous 768 px, la liste des
inclus est repliée derrière un `<details>` dont le résumé annonce le nombre
d'éléments, et le bouton passe au-dessus d'elle.

Livrables de recette : 390, 768, 1024 et 1440 px.

## 4. Les endroits du site à aligner

Chaque ligne est une contradiction relevée dans le code le 18 septembre.

| Où | Ce qui est écrit aujourd'hui | Ce qui le remplace |
|---|---|---|
| `accueil.mjs` hero | « Livré en 2 à 6 semaines, à partir de 900 € » | « Livré en 1 à 3 semaines, à partir de 900 € » |
| `head-accueil.html` meta, og, twitter | « livré en 2 à 6 semaines » | même délai que le hero |
| `head-accueil.html` JSON-LD | 6 `Offer` : Fondation 900, Studio 2500, Refonte 1200, E-commerce 3000, DA 600, Sur mesure | 3 `Offer` alignées sur les formules, plus DA 600 en option |
| Cards Prestations | « App web dès 2 500 € », « Refonte dès 1 200 € » | prix des trois formules |
| FAQ 01 | « multi-pages ou application web à 2 500 € » | 900 / 1 900 / dès 3 000 |
| FAQ 02 | « une à deux semaines… quatre à six semaines » | 1 semaine / 3 semaines |
| FAQ 08 | « ajustements continus sur l'offre Studio » | deux séries / trois séries |
| `verites` paiement | « 30 % / 30 % / 40 % » | 50/50, et 30/40/30 sur mesure |
| `verites` hébergement | déjà à la charge du client | inchangé, repris dans la carte |
| Page Artisan | « dès 1 800 € », « livré en deux semaines » | 900 / 1 900, 1 semaine / 3 semaines |
| Page Nantes | « dès 2 500 € », « 4 à 6 semaines » | idem |
| Page Refonte | « dès 1 200 € », « dès 2 500 € » | 900 / 1 900, sur mesure au-delà |
| Page E-commerce | « dès 3 000 € », « dès 5 000 € » | Sur mesure, à partir de 3 000 € |
| Page Mobile | « à partir de 6 000 € » | Sur mesure, chiffré au cadrage |
| `llms.txt` | anciens prix et délais | nouvelle grille |

Les CGV font l'objet d'un lot séparé (§ 7).

## 5. L'estimateur

`src/components/estimator-pricing.ts` raisonne encore en offres Fondation et
Studio, avec une grille de fourchettes bâtie sur un TJM de 400 €. Il doit
rendre une **formule et un prix ferme**, puisque c'est la promesse de la
nouvelle offre.

| Type choisi | Taille | Résultat |
|---|---|---|
| Vitrine | 1 page | Une page — 900 € — 1 semaine |
| Vitrine | 2-5 ou 6-12 pages | Site complet — 1 900 € — 3 semaines |
| Vitrine avec réservation ou devis | toutes | Site complet — à partir de 1 900 € |
| Boutique en ligne | toutes | Sur mesure — à partir de 3 000 € |
| Application | toutes | Sur mesure — chiffré au cadrage |

Au-delà de 6 pages, le résultat affiche « au-delà de six pages, on ajuste
ensemble ». Le choix « contenus à créer » n'augmente plus un maximum
théorique : il affiche l'option rédaction à 200 € la page. Les tests de
`estimator-pricing.test.ts` sont réécrits sur ces cas.

**Pré-sélection depuis les cartes.** Les trois boutons mènent au parcours avec
la formule choisie : `/?formule=une-page#estimator`, `site-complet`,
`sur-mesure`. `src/scripts/parcours.ts` lit le paramètre au chargement,
coche le type et la taille correspondants, et démarre à la question suivante.
Sans paramètre, le comportement actuel ne change pas. La soumission Formspree
transporte en plus la formule et le prix affiché, qui n'étaient pas envoyés.

## 6. SEO et mesure

- **Pas de `Product`.** Google réserve les extraits produit aux produits ; les
  prestations se déclarent avec `Service` et `Offer`. Le site a déjà un
  `ProfessionalService` avec ses `Offer` : on met à jour les trois prix et les
  descriptions, et on ajoute `priceCurrency` et `availability`.
- **Pas de nouvelles questions de FAQ.** Depuis 2023, les extraits FAQ ne sont
  affichés que pour les sites gouvernementaux et de santé. Les trois questions
  visées (prix, délai, abonnement) existent déjà : ce sont leurs réponses qui
  sont réécrites, et le `FAQPage` suit automatiquement.
- **Les prix restent du texte réel**, jamais une image.
- **Les `h3` de formule portent la prestation** : « Site internet une page »,
  « Site vitrine complet, 4 à 6 pages », « E-commerce et applications sur
  mesure ». Le nom court de la formule reste visible en tête de carte.
- **Umami.** Un événement par carte (`data-umami-event="tarif-une-page"`,
  `tarif-site-complet`, `tarif-sur-mesure`) et un à l'envoi du parcours
  (`estimation-envoyee`), avec la formule en propriété. Umami ne pose pas de
  cookie, donc rien n'est à demander au visiteur pour ces événements.

**Hors périmètre, à traiter séparément :** le bandeau annonce « deux cookies
de mesure d'audience » et permet de refuser, mais le script Umami se charge
quand même, et la politique de confidentialité affirme qu'il ne dépose aucun
cookie. Trois discours qui ne se recoupent pas. Ce n'est pas un problème de
tarifs, c'est un problème de conformité, et il mérite son propre lot.

## 7. Les CGV

L'article 5.2 dit aujourd'hui « acompte de 30 % à la commande, solde à la
livraison ». Il devient :

- Une page et Site complet : 50 % à la commande, 50 % à la mise en ligne.
- Sur mesure : 30 % à la commande, 40 % à la validation des maquettes, 30 % à
  la mise en ligne.

La source est `Documents légaux/04-cgv.md`, régénérée par
`scripts/build-legal-pages.mjs`. **Ce générateur n'est plus synchrone avec les
pages en ligne** : il écrit des tirets cadratins là où les pages publiées
portent des points médians, et une régénération naïve changerait les `title`
et les `meta description` des quatre pages légales. Il faut donc d'abord le
remettre d'aplomb, puis régénérer.

Ce lot est livré séparément et **n'est pas mis en ligne sans relecture
d'Adri** : c'est un document contractuel.

## 8. Vérificateurs

Le chantier change volontairement du copy, ce que `verifier-copy.mjs` refuse
par construction. On ne désactive rien : on déclare.

- Un bloc `CHANTIER_TARIFS` dans `verifier-copy.mjs` liste les fragments
  retirés et les fragments ajoutés, avec leur raison. Tout ce qui n'y figure
  pas continue d'échouer, y compris dans les sections voisines.
- `verifier-seo.mjs` reçoit des entrées `CHANGEMENTS_DECLARES` pour
  `index.html` (meta description, og:description, twitter:description,
  `jsonld:ProfessionalService`) et pour les quatre pages prestations dont la
  description mentionne un prix.
- La recette (contraste, ombres, dégradés, cibles tactiles, débordement)
  tourne sans modification, à 1440 et 375 px.

## 9. Ordre de livraison

1. **Lot A — la section Tarifs de l'accueil** : contenu, rendu, CSS, blocs
   « Dans toutes les formules » et « Ce qui reste à votre charge », options.
2. **Lot B — l'alignement du reste du site** : hero, meta et JSON-LD, FAQ,
   cards Prestations, `llms.txt`, puis les quatre pages prestations.
3. **Lot C — l'estimateur** : grille, tests, pré-sélection, envoi Formspree,
   événements Umami.
4. **Lot D — les CGV** : générateur remis d'aplomb, article 5.2 réécrit,
   relecture d'Adri avant mise en ligne.

Chaque lot passe les quatre vérificateurs et les tests avant d'être commité.
Les lots A à C partent ensemble sur une URL de prévisualisation Vercel ; rien
ne va sur `main` sans validation d'Adri sur cette prévisualisation.

## 10. Ce qui reste à décider par Adri

Ces points ne bloquent pas la mise en œuvre, mais ils conditionnent la
tenue de la promesse :

1. **Le calcul en heures sur un projet réel** (Caféologie), pour savoir si 630 €
   après remise de 30 % est tenable sur une Une page.
2. **La durée de l'offre de lancement.** Elle n'est pas chiffrée : sans
   échéance mentale, la ligne restera un an.
3. **L'option rédaction à 200 € la page**, à calibrer sur le temps réel.
4. **Le risque d'impayé** du paiement en trois fois sur les projets sur mesure.
