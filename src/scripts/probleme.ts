/**
 * « Vous vous reconnaissez ? » — apparition de la section.
 *
 * Une séquence plutôt que des éléments qui surgissent chacun pour soi :
 * le libellé, puis le titre qui se dévoile par masque, puis les six
 * cartes en cascade dans l'ordre de lecture, chacune suivie de son point
 * qui éclot.
 *
 * Les cartes ne sont pas dans la même chronologie que le titre. Sur
 * téléphone elles s'empilent sur plus de deux écrans : suspendues au
 * titre, les dernières joueraient leur entrée hors champ. Elles passent
 * donc par ScrollTrigger.batch, qui regroupe celles qui entrent ensemble
 * — une ligne de trois sur grand écran, une carte à la fois au doigt.
 *
 * Comme dans reveal.ts, l'état masqué est posé par GSAP et jamais par le
 * CSS : sans script, la section reste entièrement lisible. En mouvement
 * réduit, contexteGsap ne lance rien.
 */

import { contexteGsap } from '../lib/animations'

const CASCADE = 0.08

export function initProbleme(): void {
  const section = document.querySelector<HTMLElement>('#probleme')
  if (!section) return

  const libelle = section.querySelector<HTMLElement>('.tete-bloc')
  const titre = section.querySelector<HTMLElement>('.probleme-titre')
  const cartes = Array.from(section.querySelectorAll<HTMLElement>('.symptome'))
  if (!libelle || !titre || !cartes.length) return

  void contexteGsap(({ gsap, ScrollTrigger }) => {
    gsap
      .timeline({
        defaults: { ease: 'power3.out' },
        scrollTrigger: { trigger: titre, start: 'top 85%', once: true },
      })
      .fromTo(libelle, { y: 8, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5 })
      // Le masque descend sous la boîte (-25 %) pendant l'animation : les
      // jambages de « pas pour vous » dépassent la ligne et seraient rognés.
      .fromTo(
        titre,
        { y: 24, clipPath: 'inset(100% 0% -25% 0%)' },
        { y: 0, clipPath: 'inset(0% 0% -25% 0%)', duration: 0.8, clearProps: 'clipPath,transform' },
        '-=0.3'
      )

    const points = cartes.map((c) => c.querySelector<HTMLElement>('.symptome-point'))
    gsap.set(cartes, { y: 32, clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(points, { scale: 0 })

    ScrollTrigger.batch(cartes, {
      start: 'top 90%',
      once: true,
      onEnter: (lot) => {
        const lotPoints = lot.map((c) => c.querySelector('.symptome-point'))
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .to(lot, {
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.7,
            stagger: CASCADE,
            // Le masque ne doit plus rogner une fois l'entrée jouée, et la
            // translation doit rendre la main au survol.
            clearProps: 'clipPath,transform',
          })
          .to(
            lotPoints,
            { scale: 1, duration: 0.45, stagger: CASCADE, ease: 'back.out(3)', clearProps: 'transform' },
            0.35
          )
      },
    })
  }, section)
}
