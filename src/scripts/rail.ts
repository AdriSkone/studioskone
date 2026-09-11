/**
 * Moment 2 — le rail horizontal des projets.
 *
 * La section s'épingle, et la série de projets se translate vers la gauche
 * au rythme du défilement vertical. Le geste reste donc celui que le
 * visiteur connaît : il continue de faire défiler la page.
 *
 * Ce n'est PAS un `overflow-x`. L'export de maquette en contenait un — une
 * approximation commode pour dessiner — mais une barre horizontale se
 * manipule à part, ne se voit pas venir, et se comporte différemment sur
 * chaque appareil. Le défilement piloté n'a aucun de ces défauts.
 *
 * En dessous de 1024 px, rien de tout cela : les projets s'empilent, et le
 * navigateur reprend la main. Même chose en mouvement réduit.
 */

import { contexteGsap, grandEcran, mouvementReduit } from '../lib/animations'

export function initRail(): void {
  const rail = document.getElementById('rail')
  const piste = document.getElementById('railPiste')
  if (!rail || !piste) return

  if (!grandEcran() || mouvementReduit()) return

  void contexteGsap(({ gsap, ScrollTrigger }) => {
    /** Ce qu'il reste à parcourir : la longueur qui dépasse de l'écran. */
    const distance = () => Math.max(0, piste.scrollWidth - rail.clientWidth)

    const curseur = rail.querySelector<HTMLElement>('.rail-progression-curseur')

    const defilement = gsap.to(piste, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        trigger: rail,
        pin: true,
        // La section reste épinglée le temps de parcourir la série. Le
        // rapport est délibérément inférieur à 1 : le rail avance un peu
        // plus vite que le doigt, sinon l'épinglage dure trop longtemps et
        // l'on a le sentiment que la page a cessé de répondre.
        end: () => `+=${distance() * 0.9}`,
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (curseur) curseur.style.transform = `translateX(${self.progress * 400}%)`
        },
      },
    })

    /**
     * Le clavier.
     *
     * Une section épinglée ne bouge pas quand le focus entre dans une carte
     * hors écran : le navigateur essaie de la faire défiler, mais c'est le
     * défilement VERTICAL de la page qui commande la position horizontale.
     * On traduit donc : la carte qui prend le focus dit où elle est dans la
     * série, et la page se place au point de défilement correspondant.
     */
    piste.addEventListener('focusin', (e) => {
      const carte = (e.target as Element).closest<HTMLElement>('.carte-projet')
      if (!carte) return

      const trajet = distance()
      if (trajet <= 0) return

      // Position de la carte dans le parcours, ramenée entre 0 et 1.
      const depart = carte.offsetLeft - piste.offsetLeft
      const avancement = Math.min(1, Math.max(0, (depart - 24) / trajet))

      const st = defilement.scrollTrigger
      if (!st) return
      window.scrollTo({
        top: st.start + (st.end - st.start) * avancement,
        behavior: 'auto',
      })
    })

    // Les images du rail ne sont pas « sous le pli » au sens du navigateur :
    // elles sont dans l'écran, décalées hors champ par un transform. Le
    // chargement différé ne les verrait jamais venir. On les charge donc à
    // l'approche, quand la section entre dans le champ.
    ScrollTrigger.create({
      trigger: rail,
      start: 'top bottom+=20%',
      once: true,
      onEnter: () => {
        piste.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
          img.loading = 'eager'
        })
      },
    })
  })
}
