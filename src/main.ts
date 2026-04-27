import './style.css'
import './hero-mount'
import { initContactForm } from './components/contact-form'

// ============================================================
// Custom cursor — accent dot with lerp delay
// ============================================================
;(function initCursor() {
  // Only on pointer devices (no touch)
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const cursorEl = document.getElementById('cursor')
  if (!cursorEl) return

  let mouseX = 0
  let mouseY = 0
  let curX = 0
  let curY = 0
  let visible = false

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    if (!visible) {
      // Snap to position on first move — no lag on entry
      curX = mouseX
      curY = mouseY
      visible = true
      cursorEl.style.opacity = '1'
    }
  }, { passive: true })

  document.addEventListener('mouseleave', () => {
    cursorEl.style.opacity = '0'
    visible = false
  })

  document.addEventListener('mouseenter', () => {
    if (visible) cursorEl.style.opacity = '1'
  })

  const navEl = document.getElementById('nav')
  navEl?.addEventListener('mouseenter', () => { cursorEl.style.opacity = '0' })
  navEl?.addEventListener('mouseleave', () => { if (visible) cursorEl.style.opacity = '1' })

  function tick() {
    curX += (mouseX - curX) * 0.1
    curY += (mouseY - curY) * 0.1
    if (cursorEl) cursorEl.style.transform = `translate(calc(${curX}px - 50%), calc(${curY}px - 50%))`
    requestAnimationFrame(tick)
  }

  tick()
})()

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
  el.style.transitionDelay = `${index * 0.14}s`
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
// Subtle parallax — section headers shift slightly on scroll
// ============================================================
const parallaxHeaders = Array.from(
  document.querySelectorAll<HTMLElement>('#approach .section-label, #work .work-header, #testimonials .section-label, #tarifs .section-label')
)

if (parallaxHeaders.length) {
  function applyParallax(): void {
    parallaxHeaders.forEach((header) => {
      const rect = header.getBoundingClientRect()
      const centerY = rect.top + rect.height / 2 - window.innerHeight / 2
      const shift = centerY * 0.06
      header.style.transform = `translateY(${shift.toFixed(2)}px)`
    })
  }

  let parallaxRaf = false
  window.addEventListener('scroll', () => {
    if (!parallaxRaf) {
      parallaxRaf = true
      requestAnimationFrame(() => { applyParallax(); parallaxRaf = false })
    }
  }, { passive: true })

  applyParallax()
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

// ============================================================
// Témoignages — rotation automatique
// ============================================================
;(function initTestimonials() {
  const slides = Array.from(document.querySelectorAll<HTMLElement>('.testi-slide'))
  const dots   = Array.from(document.querySelectorAll<HTMLElement>('.testi-dot'))
  if (!slides.length) return

  let current = 0
  let timer: ReturnType<typeof setInterval>

  function goTo(idx: number): void {
    slides[current].classList.remove('is-active')
    dots[current].classList.remove('is-active')
    dots[current].setAttribute('aria-selected', 'false')
    current = idx
    slides[current].classList.add('is-active')
    dots[current].classList.add('is-active')
    dots[current].setAttribute('aria-selected', 'true')
  }

  function startTimer(): void {
    timer = setInterval(() => {
      goTo((current + 1) % slides.length)
    }, 5000)
  }

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      clearInterval(timer)
      goTo(Number(dot.dataset.idx))
      startTimer()
    })
  })

  startTimer()
})()
