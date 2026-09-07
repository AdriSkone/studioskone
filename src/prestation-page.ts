import './style.css'
import './styles/prestation-page.css'

// ============================================================
// Runtime des pages prestations.
//
// Ces pages reprennent la coquille de l'accueil (nav complète, footer) mais
// n'ont ni carousel, ni estimateur, ni formulaire : `main.ts` planterait sur
// les éléments absents. D'où cette entrée dédiée, qui ne câble que ce qui
// existe ici — curseur, nav, reveal, accordéon FAQ, retour en haut.
//
// Le curseur et le reveal sont volontairement dupliqués depuis main.ts et
// projet-page.ts, comme ces deux fichiers le font déjà entre eux : trois
// copies courtes valent mieux qu'un module partagé qui ferait dépendre les
// trois entrées l'une de l'autre.
// ============================================================

// ── Curseur personnalisé ────────────────────────────────────────────────────
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

// ── Umami ───────────────────────────────────────────────────────────────────
if (import.meta.env.VITE_UMAMI_WEBSITE_ID && import.meta.env.VITE_UMAMI_SCRIPT_URL) {
  const s = document.createElement('script')
  s.defer = true
  s.src = `${import.meta.env.VITE_UMAMI_SCRIPT_URL}/script.js`
  s.dataset.websiteId = import.meta.env.VITE_UMAMI_WEBSITE_ID
  document.head.appendChild(s)
}

// ── Scroll-reveal ───────────────────────────────────────────────────────────
const revealEls = document.querySelectorAll<HTMLElement>('.reveal')

revealEls.forEach((el) => {
  const siblings = Array.from(
    el.parentElement?.querySelectorAll<HTMLElement>(':scope > .reveal') ?? []
  )
  el.style.transitionDelay = `${siblings.indexOf(el) * 0.06}s`
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

// ── Nav — état scroll et bouton « retour en haut » ──────────────────────────
const nav = document.getElementById('nav')
const backToTop = document.getElementById('backToTop')

window.addEventListener('scroll', () => {
  const y = window.scrollY
  nav?.classList.toggle('is-scrolled', y > 60)
  backToTop?.classList.toggle('is-visible', y > 600)
}, { passive: true })

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ── Nav mobile ──────────────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle')
const navLinks = document.getElementById('navLinks')

navToggle?.addEventListener('click', () => {
  const open = navToggle.classList.toggle('is-open')
  navLinks?.classList.toggle('is-open', open)
  document.body.classList.toggle('nav-open', open)
  navToggle.setAttribute('aria-expanded', String(open))
})

navLinks?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navToggle?.classList.remove('is-open')
    navLinks.classList.remove('is-open')
    document.body.classList.remove('nav-open')
    navToggle?.setAttribute('aria-expanded', 'false')
  })
})

// ── Accordéon FAQ — une seule ouverte à la fois, comme sur l'accueil ────────
document.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
  const btn = item.querySelector<HTMLButtonElement>('.faq-question')
  const answer = item.querySelector<HTMLElement>('.faq-answer')
  if (!btn || !answer) return

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('is-open')

    document.querySelectorAll<HTMLElement>('.faq-item.is-open').forEach((openItem) => {
      openItem.classList.remove('is-open')
      openItem.querySelector<HTMLButtonElement>('.faq-question')?.setAttribute('aria-expanded', 'false')
      const a = openItem.querySelector<HTMLElement>('.faq-answer')
      if (a) a.hidden = true
    })

    if (!isOpen) {
      item.classList.add('is-open')
      btn.setAttribute('aria-expanded', 'true')
      answer.hidden = false
    }
  })
})
