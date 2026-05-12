import { useRef, useCallback } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'
import styles from './Hero.module.css'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const { scrollY } = useScroll()
  const vh = window.innerHeight

  const glowY           = useTransform(scrollYProgress, [0, 1], [0, 40])
  const glowOpacity     = useTransform(scrollYProgress, [0, 0.6], [1, 0.25])
  const logoScrollOpacity = useTransform(scrollY, [vh * 0.35, vh * 0.75], [1, 0])

  // Ambient cursor glow — springs behind the cursor with soft inertia
  const rawX = useMotionValue(-800)
  const rawY = useMotionValue(-800)
  const cursorX = useSpring(rawX, { stiffness: 26, damping: 26, mass: 1 })
  const cursorY = useSpring(rawY, { stiffness: 26, damping: 26, mass: 1 })

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set(e.clientX - rect.left)
    rawY.set(e.clientY - rect.top)
  }, [rawX, rawY])

  const handleMouseLeave = useCallback(() => {
    rawX.set(-800)
    rawY.set(-800)
  }, [rawX, rawY])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={styles.section}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >

      {/* Background image — fond_herosection.png à 15% */}
      <div aria-hidden className={styles.heroBgImage} />

      {/* Directional veil — top shadow + lateral light slit for depth */}
      <div aria-hidden className={styles.veil} />

      {/* Main glow — parallax + scroll fade */}
      <motion.div
        aria-hidden
        className={styles.glow}
        style={{ y: glowY, opacity: glowOpacity }}
      />

      {/* Cursor-reactive ambient blob */}
      <motion.div
        aria-hidden
        className={styles.cursorGlow}
        style={{ left: cursorX, top: cursorY }}
      />

      <div aria-hidden className={styles.grain} />

      {/* Contenu hero — grille gauche / droite */}
      <motion.div className={styles.heroTop} style={{ opacity: logoScrollOpacity }}>

        {/* Gauche — H1 */}
        <motion.h1
          className={styles.heroTaglineText}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
        >
          Studio de création
          <br />
          <span className={styles.heroAccent}>web &amp; mobile</span>
          <br />
          <span className={styles.heroItalic}>100% digital</span>
        </motion.h1>

        {/* Droite — description + CTA */}
        <div className={styles.heroRight}>
          <motion.p
            className={styles.statementText}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.7 }}
          >
            De l'idée au lancement, je conçois des expériences claires, performantes et alignées avec vos objectifs.
          </motion.p>
          <motion.div
            className={styles.heroCtaRow}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease, delay: 0.9 }}
          >
            <a href="#contact" className="btn btn--primary btn--with-circle">
              <span className="btn__circle" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
              <span>Discutons de votre projet</span>
            </a>
            <a href="#work" className="btn btn--secondary">
              <span className="btn__dot" aria-hidden="true" />
              <span>Voir mes réalisations</span>
            </a>
          </motion.div>
        </div>

      </motion.div>

      {/* Strip services — ancré en bas */}
      <div className={styles.heroStrip} aria-hidden>
        <div className="strip-scroll">
          <div className="strip-track">
            <span>Site Vitrine</span><span className="bullet">●</span>
            <span>E-Commerce</span><span className="bullet">●</span>
            <span>Application Web &amp; SaaS</span><span className="bullet">●</span>
            <span>Application Mobile</span><span className="bullet">●</span>
            <span>Landing Page</span><span className="bullet">●</span>
            <span>UX / UI Design</span><span className="bullet">●</span>
            <span>Branding</span><span className="bullet">●</span>
            <span>SEO &amp; Performance</span><span className="bullet">●</span>
            <span>Maintenance</span><span className="bullet">●</span>
            <span>Site Vitrine</span><span className="bullet">●</span>
            <span>E-Commerce</span><span className="bullet">●</span>
            <span>Application Web &amp; SaaS</span><span className="bullet">●</span>
            <span>Application Mobile</span><span className="bullet">●</span>
            <span>Landing Page</span><span className="bullet">●</span>
            <span>UX / UI Design</span><span className="bullet">●</span>
            <span>Branding</span><span className="bullet">●</span>
            <span>SEO &amp; Performance</span><span className="bullet">●</span>
            <span>Maintenance</span><span className="bullet">●</span>
          </div>
        </div>
      </div>

    </section>
  )
}
