import './style.css'
import { initContactForm } from './components/contact-form'

// Umami Analytics — injecté uniquement si les variables d'environnement sont renseignées
if (import.meta.env.VITE_UMAMI_WEBSITE_ID && import.meta.env.VITE_UMAMI_SCRIPT_URL) {
  const s = document.createElement('script')
  s.defer = true
  s.src = `${import.meta.env.VITE_UMAMI_SCRIPT_URL}/script.js`
  s.dataset.websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  document.head.appendChild(s)
}

// ============================================================
// Hero — apparition au chargement (mask reveal)
// ============================================================
const heroEl = document.getElementById('hero')
if (heroEl) {
  // Double rAF garantit que le navigateur a peint avant la transition
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroEl.classList.add('hero-loaded')
    })
  })
}

// ============================================================
// Scroll-reveal (IntersectionObserver)
// ============================================================
const revealEls = document.querySelectorAll<HTMLElement>('.reveal')

// Stagger siblings that share the same direct parent
document.querySelectorAll<HTMLElement>('.reveal').forEach((el) => {
  const siblings = Array.from(
    el.parentElement?.querySelectorAll<HTMLElement>(':scope > .reveal') ?? []
  )
  const index = siblings.indexOf(el)
  el.style.transitionDelay = `${index * 0.11}s`
})

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
)

revealEls.forEach((el) => revealObserver.observe(el))

// ============================================================
// Services cards — scatter au scroll (style krumzi)
// ============================================================
const sdarkCards = Array.from(document.querySelectorAll<HTMLElement>('.sdark-card'))

if (sdarkCards.length) {
  // Détacher du système reveal — l'animation scatter prend le relais
  sdarkCards.forEach((card) => {
    revealObserver.unobserve(card)
    // Écraser la transition du reveal (opacity/transform) pour un tracking scroll immédiat
    card.style.transition = 'background 0.5s ease'
    card.style.willChange = 'transform, opacity'
  })

  // Direction de scatter alternée par card : pair = gauche, impair = droite
  const dirs = sdarkCards.map((_, i) => (i % 2 === 0 ? -1 : 1))

  function applyServicesScatter(): void {
    const vh = window.innerHeight

    sdarkCards.forEach((card, i) => {
      const rect = card.getBoundingClientRect()
      // raw > 0 quand le haut de la card est encore sous 72% du viewport
      const raw = rect.top - vh * 0.72
      // t : 0 = en vue ou au-dessus du seuil, 1 = bien en-dessous
      const t = Math.max(0, Math.min(1, raw / (vh * 0.5)))

      if (t < 0.001) {
        card.style.transform = 'none'
        card.style.opacity = '1'
        return
      }

      const dir = dirs[i]
      const tx   = (dir * t * 52).toFixed(2)
      const ty   = (t * 66).toFixed(2)
      const sc   = (1 - t * 0.065).toFixed(5)
      const rot  = (dir * t * 2.8).toFixed(3)
      // Fade démarre à t=0.42
      const opacity = t > 0.42
        ? Math.max(0.28, 1 - (t - 0.42) * 1.25)
        : 1

      card.style.transform = `translateX(${tx}px) translateY(${ty}px) scale(${sc}) rotate(${rot}deg)`
      card.style.opacity   = opacity.toFixed(4)
    })
  }

  // Throttle via rAF
  let rafPending = false
  window.addEventListener(
    'scroll',
    () => {
      if (!rafPending) {
        rafPending = true
        requestAnimationFrame(() => {
          applyServicesScatter()
          rafPending = false
        })
      }
    },
    { passive: true }
  )

  window.addEventListener('resize', applyServicesScatter, { passive: true })
  applyServicesScatter()
}

// ============================================================
// Nav — scroll state
// ============================================================
const nav = document.getElementById('nav')!

window.addEventListener(
  'scroll',
  () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60)
  },
  { passive: true }
)

// ============================================================
// Back to top
// ============================================================
const backToTop = document.getElementById('backToTop')!

window.addEventListener(
  'scroll',
  () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 400)
  },
  { passive: true }
)

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('navToggle')!
const navLinks  = document.getElementById('navLinks')!

function openMenu() {
  navToggle.classList.add('is-open')
  navLinks.classList.add('is-open')
  navToggle.setAttribute('aria-expanded', 'true')
  document.body.style.overflow = 'hidden'
}

function closeMenu() {
  navToggle.classList.remove('is-open')
  navLinks.classList.remove('is-open')
  navToggle.setAttribute('aria-expanded', 'false')
  document.body.style.overflow = ''
}

navToggle.addEventListener('click', () => {
  navLinks.classList.contains('is-open') ? closeMenu() : openMenu()
})

navLinks.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu)
})

// Close on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('is-open')) closeMenu()
})

// ============================================================
// Work — arc carousel with auto-scroll
// ============================================================
const workTrack = document.getElementById('workTrack') as HTMLElement | null

if (workTrack) {
  const track = workTrack
  // --- Clone cards for seamless infinite loop ---
  const originalCards = Array.from(track.querySelectorAll<HTMLElement>('.work-scroll-card'))
  originalCards.forEach(card => {
    const clone = card.cloneNode(true) as HTMLElement
    clone.setAttribute('aria-hidden', 'true')
    track.appendChild(clone)
  })
  const loopAt = track.scrollWidth / 2

  // --- Drag to scroll ---
  let isDragging = false
  let startX = 0
  let dragScrollLeft = 0

  track.addEventListener('mousedown', (e) => {
    isDragging = true
    track.classList.add('is-dragging')
    startX = e.pageX - track.offsetLeft
    dragScrollLeft = track.scrollLeft
  })

  const stopDrag = () => {
    isDragging = false
    track.classList.remove('is-dragging')
  }

  track.addEventListener('mouseup', stopDrag)

  track.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - track.offsetLeft
    track.scrollLeft = dragScrollLeft - (x - startX) * 1.4
  })

  // --- Prev / Next buttons ---
  const workPrev = document.getElementById('workPrev')
  const workNext = document.getElementById('workNext')
  const getCardStep = () => {
    const card = track.querySelector<HTMLElement>('.work-scroll-card')
    return card ? card.offsetWidth + 24 : 480
  }
  workPrev?.addEventListener('click', () => track.scrollBy({ left: -getCardStep(), behavior: 'smooth' }))
  workNext?.addEventListener('click', () => track.scrollBy({ left: getCardStep(), behavior: 'smooth' }))

  // --- Arc tilt: rotateY + translateY (cards on sides dip down) ---
  function updateCardTilts() {
    const cards = track.querySelectorAll<HTMLElement>('.work-scroll-card')
    const trackRect = track.getBoundingClientRect()
    const center = trackRect.left + trackRect.width / 2

    cards.forEach(card => {
      const rect = card.getBoundingClientRect()
      const cardCenter = rect.left + rect.width / 2
      const dist = (cardCenter - center) / (trackRect.width * 0.55)
      const clamped = Math.max(-1, Math.min(1, dist))
      card.style.setProperty('--tilt-y',     `${clamped * 22}deg`)
      card.style.setProperty('--card-scale', `${1 - Math.abs(clamped) * 0.06}`)
      card.style.setProperty('--translate-y', `${Math.abs(clamped) * 32}px`)
    })
  }

  // --- Auto-scroll loop ---
  let autoPaused = false
  const SPEED = 0.55 // px per frame

  function tick() {
    if (!isDragging && !autoPaused) {
      track.scrollLeft += SPEED
      if (track.scrollLeft >= loopAt) {
        track.scrollLeft -= loopAt
      }
    }
    updateCardTilts()
    requestAnimationFrame(tick)
  }

  // Pause on hover, resume on leave
  track.addEventListener('mouseenter', () => { autoPaused = true })
  track.addEventListener('mouseleave', () => { autoPaused = false; stopDrag() })

  // Pause on touch, resume 1.2s after finger lifts
  track.addEventListener('touchstart', () => { autoPaused = true }, { passive: true })
  track.addEventListener('touchend',   () => { setTimeout(() => { autoPaused = false }, 1200) }, { passive: true })

  window.addEventListener('resize', updateCardTilts, { passive: true })

  requestAnimationFrame(tick)
}

// ============================================================
// FAQ — accordion (single open at a time)
// ============================================================
document.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
  const btn = item.querySelector<HTMLButtonElement>('.faq-question')
  if (!btn) return
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open')
    document.querySelectorAll<HTMLElement>('.faq-item.is-open').forEach((openItem) => {
      openItem.classList.remove('is-open')
      openItem.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false')
    })
    if (!isOpen) {
      item.classList.add('is-open')
      btn.setAttribute('aria-expanded', 'true')
    }
  })
})

// ============================================================
// Cookie consent
// ============================================================
const COOKIE_KEY = 'skone_cookie_consent'
const cookieBanner  = document.getElementById('cookieBanner')
const cookieAccept  = document.getElementById('cookieAccept')
const cookieDecline = document.getElementById('cookieDecline')

function dismissCookieBanner(): void {
  if (!cookieBanner) return
  cookieBanner.classList.remove('is-visible')
  cookieBanner.classList.add('is-dismissed')
  cookieBanner.setAttribute('aria-hidden', 'true')
}

if (cookieBanner && !localStorage.getItem(COOKIE_KEY)) {
  // Apparition décalée — laisse la page se charger d'abord
  setTimeout(() => {
    cookieBanner.classList.add('is-visible')
    cookieBanner.setAttribute('aria-hidden', 'false')
  }, 900)

  cookieAccept?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'accepted')
    dismissCookieBanner()
  })

  cookieDecline?.addEventListener('click', () => {
    localStorage.setItem(COOKIE_KEY, 'declined')
    dismissCookieBanner()
  })
}

// ============================================================
// Contact multi-step form
// ============================================================
initContactForm()

// ============================================================
// Smooth scroll for anchor links (offset for fixed nav)
// ============================================================
document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href')
    if (!href || href === '#') return

    const target = document.querySelector(href)
    if (!target) return

    e.preventDefault()
    const offset = nav.offsetHeight
    const top = target.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  })
})
