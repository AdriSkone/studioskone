import Swiper from 'swiper'
import { Autoplay, A11y, Mousewheel, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/mousewheel'

export function initWorkCarousel(): void {
  const el = document.querySelector<HTMLElement>('.work-swiper')
  if (!el) return

  const dots = Array.from(document.querySelectorAll<HTMLElement>('.work-dot'))

  function setActiveDot(index: number): void {
    dots.forEach((dot) => {
      dot.setAttribute('aria-selected', 'false')
      // Stop fill animation
      const fill = dot.querySelector<HTMLElement>('.work-dot-fill')
      if (fill) fill.style.animation = 'none'
    })

    const active = dots[index]
    if (!active) return

    active.setAttribute('aria-selected', 'true')

    // Restart fill animation on the active dot's fill span
    const fill = active.querySelector<HTMLElement>('.work-dot-fill')
    if (fill) {
      fill.style.animation = 'none'
      void fill.offsetHeight // force reflow to restart animation
      fill.style.animation = ''
    }
  }

  const swiper = new Swiper(el, {
    modules: [Autoplay, A11y, Mousewheel, FreeMode],
    slidesPerView: 'auto',
    spaceBetween: 20,
    loop: true,
    grabCursor: true,
    // Drag plus réactif : moins de mouvement requis pour déclencher un swipe
    threshold: 5,
    touchRatio: 1.2,
    longSwipesRatio: 0.2,
    shortSwipes: true,
    longSwipes: true,
    // Défilement libre type "swipe physique" : on peut faire glisser entre 2 slides,
    // et au relâchement ça se cale sur le slide le plus proche (sticky)
    freeMode: {
      enabled: true,
      sticky: true,
      momentum: true,
      momentumRatio: 0.6,
      momentumVelocityRatio: 0.6,
    },
    // Scroll molette horizontal — intercepte uniquement le scroll horizontal (trackpad)
    // ou la rotation de la molette quand le curseur est sur le carousel.
    mousewheel: {
      forceToAxis: true,
      sensitivity: 0.8,
      releaseOnEdges: true,
    },
    autoplay: {
      delay: 4500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    speed: 600,
    a11y: {
      prevSlideMessage: 'Projet précédent',
      nextSlideMessage: 'Projet suivant',
    },
    on: {
      slideChange(s) {
        setActiveDot(s.realIndex)
      },
    },
  })

  // Dot clicks — navigate to project
  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      swiper.slideToLoop(i)
    })
  })

  // Init first dot
  setActiveDot(0)
}
