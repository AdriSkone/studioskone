import './style.css'
import './styles/projet-page.css'

// ============================================================
// Custom cursor (identique à main.ts)
// ============================================================
;(function initCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

  const cursorEl = document.getElementById('cursor')
  if (!cursorEl) return

  let mouseX = 0, mouseY = 0, curX = 0, curY = 0, visible = false

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    if (!visible) {
      curX = mouseX; curY = mouseY
      visible = true
      cursorEl.style.opacity = '1'
    }
  }, { passive: true })

  document.addEventListener('mouseleave', () => { cursorEl.style.opacity = '0'; visible = false })
  document.addEventListener('mouseenter', () => { if (visible) cursorEl.style.opacity = '1' })

  const navEl = document.querySelector('.projet-nav')
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

// ============================================================
// Umami Analytics
// ============================================================
if (import.meta.env.VITE_UMAMI_WEBSITE_ID && import.meta.env.VITE_UMAMI_SCRIPT_URL) {
  const s = document.createElement('script')
  s.defer = true
  s.src = `${import.meta.env.VITE_UMAMI_SCRIPT_URL}/script.js`
  s.dataset.websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  document.head.appendChild(s)
}

// ============================================================
// Nav — état scroll
// ============================================================
const nav = document.querySelector<HTMLElement>('.projet-nav')
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('is-scrolled', window.scrollY > 60)
  }, { passive: true })
}

// ============================================================
// Scroll-reveal (IntersectionObserver)
// ============================================================
const revealEls = document.querySelectorAll<HTMLElement>('.reveal')

revealEls.forEach((el) => {
  const siblings = Array.from(
    el.parentElement?.querySelectorAll<HTMLElement>(':scope > .reveal') ?? []
  )
  el.style.transitionDelay = `${siblings.indexOf(el) * 0.14}s`
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
