import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import styles from './Hero.module.css'

const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const logoY       = useTransform(scrollYProgress, [0, 1], [0, -20])
  const glowY       = useTransform(scrollYProgress, [0, 1], [0, 40])
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.25])

  return (
    <section ref={sectionRef} id="hero" className={styles.section}>

      <motion.div
        aria-hidden
        className={styles.glow}
        style={{ y: glowY, opacity: glowOpacity }}
      />
      <div aria-hidden className={styles.grain} />

      {/* Logo massif ancré en bas */}
      <motion.div
        className={styles.logoBlock}
        style={{ y: logoY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease, delay: 0.2 }}
      >
        <img
          src="/logo_skone_sansh2.svg"
          alt="Studio Skøne"
          className={styles.logoMassive}
          draggable={false}
        />
      </motion.div>

    </section>
  )
}
