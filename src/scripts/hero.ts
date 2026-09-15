/**
 * Moment 1 — l'ouverture du hero.
 *
 * Une séquence d'environ deux secondes : le titre se lève ligne après
 * ligne, puis le reste, puis le curseur s'allume.
 *
 * (Elle commençait par tracer les filets de grille du hero. Ils ont été
 * retirés : le style guide interdit les filets verticaux.)
 *
 * Elle ne se joue qu'une fois par session. Une animation d'entrée est une
 * première impression ; revue à chaque retour sur l'accueil, elle devient
 * un péage. `sessionStorage` s'en souvient le temps de l'onglet.
 *
 * Le découpage en lignes est mesuré après coup, jamais écrit à la main :
 * le nombre de lignes dépend de la largeur de l'écran et de la fonte
 * réellement chargée. On enveloppe les mots, on lit où le navigateur les a
 * posés, et on regroupe ceux qui partagent une même ligne.
 */

import { contexteGsap, mouvementReduit } from '../lib/animations'

const CLE_SESSION = 'skone_hero_joue'

/**
 * Enveloppe chaque ligne visuelle d'un titre dans un masque.
 *
 * Rien n'est retiré ni réécrit : le texte reste le même, il gagne
 * seulement des conteneurs. Un lecteur d'écran lit la même phrase.
 */
function decouperEnLignes(titre: HTMLElement): HTMLElement[] {
  const morceaux: Array<{ texte: string; classe: string | null }> = []

  titre.childNodes.forEach((noeud) => {
    if (noeud.nodeType === Node.TEXT_NODE) {
      const texte = noeud.textContent ?? ''
      texte.split(/(\s+)/).forEach((t) => {
        if (t.trim()) morceaux.push({ texte: t, classe: null })
      })
    } else if (noeud instanceof HTMLElement) {
      const classe = noeud.className || null
      ;(noeud.textContent ?? '').split(/(\s+)/).forEach((t) => {
        if (t.trim()) morceaux.push({ texte: t, classe })
      })
    }
  })

  // Un passage par les mots : on les pose, on regarde où ils tombent.
  titre.textContent = ''
  const mots = morceaux.map(({ texte, classe }) => {
    const mot = document.createElement('span')
    mot.className = classe ? `hero-mot ${classe}` : 'hero-mot'
    mot.textContent = texte
    titre.append(mot, document.createTextNode(' '))
    return mot
  })

  // Regroupement par position verticale : deux mots sur la même ligne ont
  // le même offsetTop, à un pixel près.
  const lignes: HTMLElement[][] = []
  let hauteurCourante = Number.NaN
  mots.forEach((mot) => {
    const haut = mot.offsetTop
    if (Number.isNaN(hauteurCourante) || Math.abs(haut - hauteurCourante) > 4) {
      hauteurCourante = haut
      lignes.push([])
    }
    lignes[lignes.length - 1].push(mot)
  })

  // Chaque ligne reçoit son masque : un conteneur qui rogne, et un
  // intérieur qui coulisse.
  titre.textContent = ''
  return lignes.map((ligne) => {
    const masque = document.createElement('span')
    masque.className = 'hero-ligne'
    const interieur = document.createElement('span')
    interieur.className = 'hero-ligne-interieur'
    ligne.forEach((mot, i) => {
      interieur.append(mot)
      if (i < ligne.length - 1) interieur.append(document.createTextNode(' '))
    })
    masque.append(interieur)
    // L'espace se pose ENTRE les masques, et pas seulement entre les mots
    // d'une même ligne. Sans lui, le dernier mot d'une ligne et le premier
    // de la suivante se touchent dans le texte rendu : « clientsméritent ».
    // Invisible à l'œil, puisque chaque ligne est un bloc — mais c'est ce
    // que lit un lecteur d'écran, et ce que copie un visiteur.
    titre.append(masque, document.createTextNode(' '))
    return interieur
  })
}

export function initHero(auFini?: () => void): void {
  const hero = document.getElementById('hero')
  const titre = hero?.querySelector<HTMLElement>('.hero-titre')
  if (!hero || !titre) {
    auFini?.()
    return
  }

  // Mouvement réduit, ou séquence déjà vue : la page est simplement là.
  let dejaJoue = false
  try {
    dejaJoue = sessionStorage.getItem(CLE_SESSION) === '1'
  } catch {
    dejaJoue = true
  }

  if (mouvementReduit() || dejaJoue) {
    hero.classList.add('est-pose')
    auFini?.()
    return
  }

  // Les fontes d'abord : découper des lignes avant qu'elles ne soient là,
  // c'est découper un texte qui n'a pas encore sa largeur définitive.
  void document.fonts.ready.then(() => {
    const lignes = decouperEnLignes(titre)
    hero.classList.add('est-pose')

    void contexteGsap(({ gsap }) => {
      /**
       * Filet de sécurité.
       *
       * La séquence masque le titre pour le lever ensuite. Si elle
       * n'arrive jamais à son terme, le hero reste vide — et le hero,
       * c'est le h1 et la première phrase du site.
       *
       * Ce n'est pas théorique : rendue avec un budget de temps contraint,
       * comme le fait un robot d'indexation ou une capture automatique, la
       * page s'est affichée sans son titre. Passé ce délai, la séquence est
       * donc poussée à sa fin, où qu'elle en soit.
       */
      const filet = window.setTimeout(() => suite.progress(1), 4000)

      const suite = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => {
          window.clearTimeout(filet)
          try {
            sessionStorage.setItem(CLE_SESSION, '1')
          } catch {
            /* stockage refusé : la séquence rejouera, ce n'est pas grave */
          }
          auFini?.()
        },
      })

      suite
        // Le titre se lève, ligne après ligne.
        .from(lignes, { yPercent: 105, duration: 0.9, stagger: 0.09 })
        // Puis ce qui l'accompagne.
        .from('.hero-droite > *', { y: 16, opacity: 0, duration: 0.6, stagger: 0.08 }, '-=0.45')
        .from('.hero-preuves', { opacity: 0, duration: 0.5 }, '-=0.3')
        .from('.hero .ruban', { opacity: 0, duration: 0.5 }, '-=0.4')
    })
  })
}
