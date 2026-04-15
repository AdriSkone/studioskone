import './style.css'
import { initContactForm } from './components/contact-form'

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
