/**
 * ContactMultiStepForm — Studio Skøne
 * Formulaire de contact multi-étapes, dark luxury glassmorphism.
 *
 * Dépendances requises :
 *   npm install react react-dom framer-motion
 *
 * Usage :
 *   import ContactMultiStepForm from './components/ContactMultiStepForm'
 *   <ContactMultiStepForm />
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─── Data ─────────────────────────────────────────────────────── */

const STEP_LABELS = ['Projet', 'Budget', 'Délai', 'Contact']

const PROJECT_TYPES = [
  { id: 'vitrine',     icon: '◈', label: 'Site vitrine' },
  { id: 'ecommerce',  icon: '◎', label: 'E-commerce' },
  { id: 'app',        icon: '⬡', label: 'Application web' },
  { id: 'redesign',   icon: '↻', label: 'Redesign' },
  { id: 'autre',      icon: '···', label: 'Autre' },
]

const BUDGETS = [
  { id: '1k-3k',     label: '1 000 – 3 000 €' },
  { id: '3k-5k',     label: '3 000 – 5 000 €' },
  { id: '5k-10k',    label: '5 000 – 10 000 €' },
  { id: '10k+',      label: '10 000 € +' },
  { id: 'define',    label: 'À définir' },
]

const DELAYS = [
  { id: 'urgent',    icon: '⚡', label: 'Urgent',         sub: 'Moins de 2 semaines' },
  { id: '2-4w',      icon: '◷', label: '2 – 4 semaines',  sub: 'Cadence soutenue' },
  { id: '1-2m',      icon: '◑', label: '1 – 2 mois',      sub: 'Rythme confortable' },
  { id: 'flex',      icon: '∞', label: 'Flexible',        sub: 'Pas de contrainte' },
]

/* ─── Framer Motion variants ────────────────────────────────────── */

const slideVariants = {
  enter: (dir) => ({
    x: dir > 0 ? 64 : -64,
    opacity: 0,
    filter: 'blur(4px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir) => ({
    x: dir > 0 ? -64 : 64,
    opacity: 0,
    filter: 'blur(4px)',
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  }),
}

const successVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 24 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.08 },
  },
}

const itemVariant = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
}

/* ─── Styles ────────────────────────────────────────────────────── */

const css = {
  // Section wrapper
  section: {
    background: '#1A1A1A',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '96px 24px',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Sora', system-ui, sans-serif",
  },

  // Ambient background glow
  glowA: {
    position: 'absolute',
    top: '-20%',
    right: '-10%',
    width: '640px',
    height: '640px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(196,96,59,0.12) 0%, transparent 70%)',
    pointerEvents: 'none',
  },
  glowB: {
    position: 'absolute',
    bottom: '-15%',
    left: '-10%',
    width: '480px',
    height: '480px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(196,96,59,0.07) 0%, transparent 70%)',
    pointerEvents: 'none',
  },

  // Inner container
  inner: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '660px',
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
  },

  // Header
  header: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  label: {
    fontFamily: "'Montserrat', system-ui, sans-serif",
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: '#C4603B',
  },
  title: {
    fontFamily: "'Montserrat', system-ui, sans-serif",
    fontSize: 'clamp(1.75rem, 3vw, 2.75rem)',
    fontWeight: 500,
    lineHeight: 1.1,
    letterSpacing: '0.025em',
    color: '#FBF4E4',
  },
  titleEm: {
    fontFamily: "'Cormorant Garamond', Georgia, serif",
    fontStyle: 'italic',
    fontWeight: 300,
    color: 'rgba(251,244,228,0.65)',
  },

  // Progress
  progressWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  progressSteps: {
    display: 'flex',
    alignItems: 'center',
    gap: '0',
  },
  progressTrack: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.08)',
    position: 'relative',
    overflow: 'hidden',
  },

  // Glass card
  glassCard: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '24px',
    padding: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },

  // Step question
  stepQuestion: {
    fontFamily: "'Montserrat', system-ui, sans-serif",
    fontSize: 'clamp(0.9rem, 1.5vw, 1.05rem)',
    fontWeight: 700,
    letterSpacing: '0.025em',
    color: 'rgba(251,244,228,0.5)',
    textTransform: 'uppercase',
  },

  // Choices grid
  choicesGrid: {
    display: 'grid',
    gap: '12px',
  },

  // Input group
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },

  // Actions
  actions: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  },

  // Btn primary
  btnPrimary: {
    fontFamily: "'Montserrat', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '0.8rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#FBF4E4',
    background: '#C4603B',
    border: 'none',
    borderRadius: '16px',
    padding: '14px 28px',
    cursor: 'pointer',
    boxShadow: '0 4px 24px rgba(196,96,59,0.32)',
    transition: 'background 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },

  // Btn ghost
  btnGhost: {
    fontFamily: "'Montserrat', system-ui, sans-serif",
    fontWeight: 500,
    fontSize: '0.8rem',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    color: 'rgba(251,244,228,0.45)',
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '14px 24px',
    cursor: 'pointer',
    transition: 'color 0.3s ease, border-color 0.3s ease, transform 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
  },
}

/* ─── Sub-components ────────────────────────────────────────────── */

function ProgressBar({ current, total }) {
  return (
    <div style={css.progressWrapper}>
      <div style={css.progressSteps}>
        {STEP_LABELS.map((label, i) => {
          const isActive  = i === current
          const isDone    = i < current
          return (
            <div
              key={label}
              style={{ display: 'flex', alignItems: 'center', flex: i < total - 1 ? 1 : 'none' }}
            >
              {/* Dot */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <motion.div
                  animate={{
                    background: isDone
                      ? '#C4603B'
                      : isActive
                      ? '#C4603B'
                      : 'rgba(255,255,255,0.12)',
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(196,96,59,0.18), 0 0 16px rgba(196,96,59,0.4)'
                      : 'none',
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                  }}
                />
                <span
                  style={{
                    fontFamily: "'Montserrat', system-ui, sans-serif",
                    fontSize: '9px',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: isActive
                      ? '#C4603B'
                      : isDone
                      ? 'rgba(196,96,59,0.6)'
                      : 'rgba(255,255,255,0.2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
              </div>

              {/* Track */}
              {i < total - 1 && (
                <div style={{ ...css.progressTrack, margin: '0 8px', marginBottom: '18px' }}>
                  <motion.div
                    animate={{ scaleX: isDone ? 1 : 0 }}
                    initial={{ scaleX: 0 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: '#C4603B',
                      transformOrigin: 'left',
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ChoiceCard({ label, icon, sub, selected, onClick, large }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: large ? '20px 24px' : '16px 20px',
        borderRadius: '16px',
        border: selected
          ? '1.5px solid #C4603B'
          : hovered
          ? '1.5px solid rgba(196,96,59,0.4)'
          : '1.5px solid rgba(255,255,255,0.07)',
        background: selected
          ? 'rgba(196,96,59,0.1)'
          : hovered
          ? 'rgba(196,96,59,0.04)'
          : 'rgba(255,255,255,0.025)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'border-color 0.25s ease, background 0.25s ease',
        boxShadow: selected
          ? '0 0 0 1px rgba(196,96,59,0.2), 0 4px 24px rgba(196,96,59,0.12)'
          : 'none',
        width: '100%',
      }}
    >
      {icon && (
        <span
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: large ? '1.5rem' : '1.1rem',
            color: selected ? '#C4603B' : 'rgba(251,244,228,0.35)',
            minWidth: '28px',
            textAlign: 'center',
            transition: 'color 0.25s ease',
            lineHeight: 1,
          }}
        >
          {icon}
        </span>
      )}
      <div style={{ flex: 1 }}>
        <span
          style={{
            fontFamily: "'Montserrat', system-ui, sans-serif",
            fontSize: '0.875rem',
            fontWeight: selected ? 600 : 500,
            letterSpacing: '0.02em',
            color: selected ? '#FBF4E4' : 'rgba(251,244,228,0.65)',
            transition: 'color 0.25s ease, font-weight 0.1s ease',
            display: 'block',
          }}
        >
          {label}
        </span>
        {sub && (
          <span
            style={{
              fontFamily: "'Sora', system-ui, sans-serif",
              fontSize: '0.75rem',
              color: selected ? 'rgba(196,96,59,0.8)' : 'rgba(255,255,255,0.25)',
              marginTop: '2px',
              display: 'block',
              transition: 'color 0.25s ease',
            }}
          >
            {sub}
          </span>
        )}
      </div>
      {selected && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: '#C4603B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M2 5.5L4 7.5L8 3" stroke="#FBF4E4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      )}
    </motion.button>
  )
}

function GlassInput({ label, type = 'text', value, onChange, required, optional, as: Tag = 'input', rows, placeholder }) {
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0
  return (
    <div style={{ position: 'relative' }}>
      <label
        style={{
          position: 'absolute',
          left: '18px',
          top: focused || hasValue ? '8px' : '50%',
          transform: focused || hasValue || Tag === 'textarea' ? 'none' : 'translateY(-50%)',
          fontFamily: "'Montserrat', system-ui, sans-serif",
          fontSize: focused || hasValue ? '9px' : '0.8rem',
          fontWeight: 600,
          letterSpacing: focused || hasValue ? '0.15em' : '0.04em',
          textTransform: focused || hasValue ? 'uppercase' : 'none',
          color: focused
            ? '#C4603B'
            : hasValue
            ? 'rgba(196,96,59,0.6)'
            : 'rgba(255,255,255,0.3)',
          transition: 'all 0.25s ease',
          pointerEvents: 'none',
          zIndex: 1,
          ...(Tag === 'textarea' && { top: '14px', transform: 'none' }),
        }}
      >
        {label}
        {optional && (
          <span style={{ marginLeft: '6px', opacity: 0.5, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
            — optionnel
          </span>
        )}
      </label>
      <Tag
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        placeholder={focused ? placeholder : ''}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          background: focused
            ? 'rgba(196,96,59,0.05)'
            : 'rgba(255,255,255,0.03)',
          border: focused
            ? '1.5px solid rgba(196,96,59,0.5)'
            : '1.5px solid rgba(255,255,255,0.08)',
          borderRadius: '14px',
          padding: Tag === 'textarea'
            ? '32px 18px 14px'
            : '28px 18px 10px',
          color: '#FBF4E4',
          fontFamily: "'Sora', system-ui, sans-serif",
          fontSize: '0.875rem',
          fontWeight: 400,
          lineHeight: 1.5,
          outline: 'none',
          resize: 'none',
          transition: 'border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease',
          boxShadow: focused ? '0 0 0 3px rgba(196,96,59,0.1)' : 'none',
          caretColor: '#C4603B',
        }}
      />
    </div>
  )
}

function BtnPrimary({ onClick, disabled, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={disabled ? {} : { scale: 0.97 }}
      style={{
        ...css.btnPrimary,
        background: disabled ? 'rgba(196,96,59,0.3)' : hovered ? '#A84E2E' : '#C4603B',
        transform: hovered && !disabled ? 'translateY(-2px)' : 'none',
        boxShadow: hovered && !disabled
          ? '0 8px 32px rgba(196,96,59,0.42)'
          : '0 4px 24px rgba(196,96,59,0.28)',
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {children}
    </motion.button>
  )
}

function BtnGhost({ onClick, children }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.97 }}
      style={{
        ...css.btnGhost,
        color: hovered ? 'rgba(251,244,228,0.75)' : 'rgba(251,244,228,0.35)',
        borderColor: hovered ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)',
        transform: hovered ? 'translateY(-1px)' : 'none',
      }}
    >
      {children}
    </motion.button>
  )
}

/* ─── Main Component ─────────────────────────────────────────────── */

export default function ContactMultiStepForm() {
  const [step, setStep]       = useState(0)
  const [direction, setDir]   = useState(1)
  const [submitted, setSubmit] = useState(false)
  const [isLoading, setLoad]   = useState(false)

  const [projectType, setProjectType] = useState('')
  const [budget, setBudget]           = useState('')
  const [delay, setDelay]             = useState('')
  const [form, setForm]               = useState({
    nom: '',
    email: '',
    entreprise: '',
    description: '',
  })
  const [errors, setErrors] = useState({})

  const TOTAL = 4

  /* ── Validation ── */
  const validateStep = useCallback(() => {
    if (step === 0) return !!projectType
    if (step === 1) return !!budget
    if (step === 2) return !!delay
    if (step === 3) {
      const e = {}
      if (!form.nom.trim())   e.nom   = 'Requis'
      if (!form.email.trim()) e.email = 'Requis'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email invalide'
      if (!form.description.trim()) e.description = 'Requis'
      setErrors(e)
      return Object.keys(e).length === 0
    }
    return true
  }, [step, projectType, budget, delay, form])

  /* ── Navigation ── */
  const next = useCallback(() => {
    if (!validateStep()) return
    if (step === TOTAL - 1) {
      handleSubmit()
      return
    }
    setDir(1)
    setStep(s => s + 1)
  }, [step, validateStep])

  const prev = useCallback(() => {
    if (step === 0) return
    setDir(-1)
    setStep(s => s - 1)
  }, [step])

  /* ── Submit ── */
  const handleSubmit = async () => {
    setLoad(true)
    // Simulated async submit — replace with real endpoint
    await new Promise(r => setTimeout(r, 1400))
    setLoad(false)
    setSubmit(true)
  }

  const handleField = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(er => { const n = {...er}; delete n[field]; return n })
  }

  /* ── Success state ── */
  if (submitted) {
    return (
      <section id="contact" style={css.section}>
        <div style={css.glowA} />
        <div style={css.glowB} />
        <motion.div
          variants={successVariants}
          initial="hidden"
          animate="visible"
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            maxWidth: '480px',
          }}
        >
          {/* Checkmark */}
          <motion.div
            variants={itemVariant}
            style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'rgba(196,96,59,0.12)',
              border: '1.5px solid rgba(196,96,59,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(196,96,59,0.2)',
            }}
          >
            <motion.svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
            >
              <motion.path
                d="M6 16.5L12.5 23L26 10"
                stroke="#C4603B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
              />
            </motion.svg>
          </motion.div>

          <motion.div variants={itemVariant} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={css.label}>Message envoyé</span>
            <h2
              style={{
                fontFamily: "'Montserrat', system-ui, sans-serif",
                fontSize: 'clamp(1.6rem, 3vw, 2.5rem)',
                fontWeight: 500,
                letterSpacing: '0.025em',
                color: '#FBF4E4',
                lineHeight: 1.15,
              }}
            >
              On revient vers vous{' '}
              <em
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontStyle: 'italic',
                  fontWeight: 300,
                  color: 'rgba(251,244,228,0.55)',
                }}
              >
                rapidement.
              </em>
            </h2>
          </motion.div>

          <motion.p
            variants={itemVariant}
            style={{
              fontFamily: "'Sora', system-ui, sans-serif",
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.35)',
              lineHeight: 1.6,
              maxWidth: '360px',
            }}
          >
            Votre demande a bien été reçue. L'équipe Studio Skøne prendra contact dans les 48 heures.
          </motion.p>

          {/* Summary pill */}
          <motion.div
            variants={itemVariant}
            style={{
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '8px',
            }}
          >
            {[projectType, budget, delay].filter(Boolean).map((val) => (
              <span
                key={val}
                style={{
                  fontFamily: "'Montserrat', system-ui, sans-serif",
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(196,96,59,0.8)',
                  background: 'rgba(196,96,59,0.08)',
                  border: '1px solid rgba(196,96,59,0.2)',
                  borderRadius: '999px',
                  padding: '5px 12px',
                }}
              >
                {val.replace('define', 'À définir').replace('flex', 'Flexible').replace('urgent', 'Urgent').replace('2-4w', '2–4 semaines').replace('1-2m', '1–2 mois')}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>
    )
  }

  /* ── Step content ── */
  const renderStep = () => {
    switch (step) {
      /* Step 0 — Type de projet */
      case 0:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={css.stepQuestion}>Quel type de projet ?</p>
            <div style={{ ...css.choicesGrid, gridTemplateColumns: '1fr 1fr' }}>
              {PROJECT_TYPES.slice(0, 4).map(({ id, icon, label }) => (
                <ChoiceCard
                  key={id}
                  icon={icon}
                  label={label}
                  selected={projectType === id}
                  onClick={() => setProjectType(id)}
                  large
                />
              ))}
            </div>
            <ChoiceCard
              icon={PROJECT_TYPES[4].icon}
              label={PROJECT_TYPES[4].label}
              selected={projectType === PROJECT_TYPES[4].id}
              onClick={() => setProjectType(PROJECT_TYPES[4].id)}
              large
            />
          </div>
        )

      /* Step 1 — Budget */
      case 1:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={css.stepQuestion}>Quelle enveloppe budgétaire ?</p>
            <div style={{ ...css.choicesGrid, gridTemplateColumns: '1fr' }}>
              {BUDGETS.map(({ id, label }) => (
                <ChoiceCard
                  key={id}
                  label={label}
                  selected={budget === id}
                  onClick={() => setBudget(id)}
                />
              ))}
            </div>
          </div>
        )

      /* Step 2 — Délai */
      case 2:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={css.stepQuestion}>Dans quel délai ?</p>
            <div style={{ ...css.choicesGrid, gridTemplateColumns: '1fr 1fr' }}>
              {DELAYS.map(({ id, icon, label, sub }) => (
                <ChoiceCard
                  key={id}
                  icon={icon}
                  label={label}
                  sub={sub}
                  selected={delay === id}
                  onClick={() => setDelay(id)}
                  large
                />
              ))}
            </div>
          </div>
        )

      /* Step 3 — Contact */
      case 3:
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <p style={css.stepQuestion}>Parlez-moi de vous</p>
            <div style={css.inputGroup}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <GlassInput
                    label="Nom"
                    value={form.nom}
                    onChange={handleField('nom')}
                    required
                    placeholder="Votre nom"
                  />
                  {errors.nom && <p style={{ color: '#C4603B', fontSize: '0.72rem', marginTop: '6px', paddingLeft: '4px' }}>{errors.nom}</p>}
                </div>
                <div>
                  <GlassInput
                    label="Email"
                    type="email"
                    value={form.email}
                    onChange={handleField('email')}
                    required
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p style={{ color: '#C4603B', fontSize: '0.72rem', marginTop: '6px', paddingLeft: '4px' }}>{errors.email}</p>}
                </div>
              </div>
              <GlassInput
                label="Entreprise"
                value={form.entreprise}
                onChange={handleField('entreprise')}
                optional
                placeholder="Votre société"
              />
              <div>
                <GlassInput
                  label="Description du projet"
                  as="textarea"
                  rows={4}
                  value={form.description}
                  onChange={handleField('description')}
                  required
                  placeholder="Décrivez votre projet en quelques mots…"
                />
                {errors.description && <p style={{ color: '#C4603B', fontSize: '0.72rem', marginTop: '6px', paddingLeft: '4px' }}>{errors.description}</p>}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  /* ── Render ── */
  return (
    <section id="contact" style={css.section}>
      {/* Ambient glows */}
      <div style={css.glowA} />
      <div style={css.glowB} />

      <div style={css.inner}>
        {/* Header */}
        <div style={css.header}>
          <span style={css.label}>Contact</span>
          <h2 style={css.title}>
            Discutons de{' '}
            <em style={css.titleEm}>votre projet.</em>
          </h2>
        </div>

        {/* Progress */}
        <ProgressBar current={step} total={TOTAL} />

        {/* Form card */}
        <div style={css.glassCard}>
          {/* Step content with AnimatePresence */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div style={css.actions}>
            <div>
              {step > 0 && (
                <BtnGhost onClick={prev}>
                  ← Retour
                </BtnGhost>
              )}
            </div>
            <BtnPrimary
              onClick={next}
              disabled={
                (step === 0 && !projectType) ||
                (step === 1 && !budget) ||
                (step === 2 && !delay) ||
                isLoading
              }
            >
              {isLoading ? (
                <>
                  <LoadSpinner /> Envoi…
                </>
              ) : step === TOTAL - 1 ? (
                'Discuter de mon projet →'
              ) : (
                'Continuer →'
              )}
            </BtnPrimary>
          </div>
        </div>

        {/* Footer note */}
        <p
          style={{
            textAlign: 'center',
            fontFamily: "'Sora', system-ui, sans-serif",
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.2)',
            lineHeight: 1.5,
          }}
        >
          Réponse garantie sous 48h · Aucun engagement
        </p>
      </div>
    </section>
  )
}

/* ─── Loader ────────────────────────────────────────────────────── */

function LoadSpinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      style={{ display: 'inline-block', width: 14, height: 14 }}
    >
      <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
        <circle cx="7" cy="7" r="5.5" stroke="rgba(251,244,228,0.25)" strokeWidth="1.5" />
        <path d="M7 1.5A5.5 5.5 0 0112.5 7" stroke="#FBF4E4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </motion.span>
  )
}
