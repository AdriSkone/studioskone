/**
 * ContactForm — Studio Skøne
 * Formulaire de contact multi-étapes, dark luxury.
 * Vanilla TypeScript — aucune dépendance externe.
 *
 * Usage dans main.ts :
 *   import { initContactForm } from './components/contact-form'
 *   initContactForm()
 */

import '../styles/contact-form.css'

// ============================================================
// Types
// ============================================================

interface ContactData {
  projectType: string
  budget:      string
  delay:       string
  nom:         string
  email:       string
  entreprise:  string
  description: string
  rgpd:        boolean
}

interface ChoiceConfig {
  value: string
  label: string
  icon?: string
  sub?:  string
}

// ============================================================
// Constants
// ============================================================

const STEPS = [
  { num: '01', label: 'Projet' },
  { num: '02', label: 'Budget' },
  { num: '03', label: 'Délai' },
  { num: '04', label: 'Contact' },
]

const PROJECT_CHOICES: ChoiceConfig[] = [
  { value: 'vitrine',   icon: '◈',   label: 'Site vitrine' },
  { value: 'ecommerce', icon: '◎',   label: 'E-commerce' },
  { value: 'app-web',   icon: '⬡',   label: 'Application web' },
  { value: 'redesign',  icon: '↻',   label: 'Refonte / redesign' },
  { value: 'autre',     icon: '···', label: 'Autre' },
]

const BUDGET_CHOICES: ChoiceConfig[] = [
  { value: '1k-3k',  label: '1 000 – 3 000 €' },
  { value: '3k-5k',  label: '3 000 – 5 000 €' },
  { value: '5k-10k', label: '5 000 – 10 000 €' },
  { value: '10k+',   label: '10 000 € +' },
  { value: 'a-def',  label: 'À définir' },
]

const DELAY_CHOICES: ChoiceConfig[] = [
  { value: 'urgent', icon: '⚡', label: 'Urgent',         sub: 'Moins de 2 semaines' },
  { value: '2-4w',   icon: '◷', label: '2 à 4 semaines',  sub: 'Cadence soutenue' },
  { value: '1-2m',   icon: '◑', label: '1 à 2 mois',      sub: 'Rythme confortable' },
  { value: 'flex',   icon: '∞', label: 'Flexible',        sub: 'Pas de contrainte' },
]

// ============================================================
// HTML builders
// ============================================================

function buildCheckSvg(): string {
  return `<svg class="cf-rgpd-check-icon" width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M1 4L3.5 6.5L9 1" stroke="#FBF4E4" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

function buildChoiceCheckSvg(): string {
  return `<svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
    <path d="M1 4L3.5 6.5L9 1" stroke="#FBF4E4" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`
}

function buildChoice(c: ChoiceConfig, field: string): string {
  const icon = c.icon
    ? `<span class="cf-choice-icon" aria-hidden="true">${c.icon}</span>`
    : ''
  const sub = c.sub
    ? `<span class="cf-choice-sub">${c.sub}</span>`
    : ''
  return `
    <button
      type="button"
      class="cf-choice"
      data-field="${field}"
      data-value="${c.value}"
      aria-pressed="false"
    >
      ${icon}
      <span class="cf-choice-body">
        <span class="cf-choice-label">${c.label}</span>
        ${sub}
      </span>
      <span class="cf-choice-check" aria-hidden="true">${buildChoiceCheckSvg()}</span>
    </button>`
}

function buildTemplate(): string {
  return `
  <div class="container">
    <div class="cf-wrapper" id="cfWrapper">

      <!-- Header -->
      <div class="cf-header">
        <span class="section-label">Contact</span>
        <h2 class="cf-title"><em>Discutons de</em> votre projet.</h2>
      </div>

      <!-- Progress indicator -->
      <nav class="cf-progress" aria-label="Progression du formulaire">
        <div class="cf-steps" role="list">
          ${STEPS.map((s, i) => `
            <div
              class="cf-step-item${i === 0 ? ' is-active' : ''}"
              data-step-idx="${i}"
              role="listitem"
              aria-current="${i === 0 ? 'step' : 'false'}"
            >
              <span class="cf-step-num">${s.num}</span>
              <span class="cf-step-label">${s.label}</span>
            </div>
          `).join('')}
        </div>
        <div
          class="cf-progress-bar"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow="25"
          aria-label="Progression"
        >
          <div class="cf-progress-fill" id="cfProgressFill" style="width:25%"></div>
        </div>
      </nav>

      <!-- Glass card -->
      <div class="cf-card" id="cfCard">

        <!-- Étape 1 — Type de projet -->
        <div class="cf-panel is-active" data-panel="0" role="group" aria-labelledby="cfQ0">
          <p class="cf-question" id="cfQ0">Quel type de projet souhaitez-vous créer&nbsp;?</p>
          <div class="cf-choices cf-choices--2col">
            ${PROJECT_CHOICES.slice(0, 4).map(c => buildChoice(c, 'projectType')).join('')}
          </div>
          <div class="cf-choices" style="margin-top:10px">
            ${buildChoice(PROJECT_CHOICES[4], 'projectType')}
          </div>
        </div>

        <!-- Étape 2 — Budget -->
        <div class="cf-panel" data-panel="1" role="group" aria-labelledby="cfQ1">
          <p class="cf-question" id="cfQ1">Quel est votre budget estimatif&nbsp;?</p>
          <div class="cf-choices">
            ${BUDGET_CHOICES.map(c => buildChoice(c, 'budget')).join('')}
          </div>
        </div>

        <!-- Étape 3 — Délai -->
        <div class="cf-panel" data-panel="2" role="group" aria-labelledby="cfQ2">
          <p class="cf-question" id="cfQ2">Quel est votre délai idéal&nbsp;?</p>
          <div class="cf-choices cf-choices--2col">
            ${DELAY_CHOICES.map(c => buildChoice(c, 'delay')).join('')}
          </div>
        </div>

        <!-- Étape 4 — Contact -->
        <div class="cf-panel" data-panel="3" role="group" aria-labelledby="cfQ3">
          <p class="cf-question" id="cfQ3">Parlez-nous de vous</p>
          <div class="cf-fields">

            <div class="cf-field-row">
              <div class="cf-field" id="cfFieldNom">
                <input
                  type="text"
                  id="cf-nom"
                  name="nom"
                  placeholder=" "
                  autocomplete="name"
                  aria-label="Nom"
                >
                <label for="cf-nom">Nom</label>
              </div>
              <div class="cf-field" id="cfFieldEmail">
                <input
                  type="email"
                  id="cf-email"
                  name="email"
                  placeholder=" "
                  autocomplete="email"
                  aria-label="Email"
                >
                <label for="cf-email">Email</label>
              </div>
            </div>

            <div class="cf-field" id="cfFieldEntreprise">
              <input
                type="text"
                id="cf-entreprise"
                name="entreprise"
                placeholder=" "
                autocomplete="organization"
                aria-label="Entreprise (optionnel)"
              >
              <label for="cf-entreprise">Entreprise <span class="cf-optional">— optionnel</span></label>
            </div>

            <div class="cf-field cf-field--area" id="cfFieldDesc">
              <textarea
                id="cf-description"
                name="description"
                placeholder=" "
                rows="4"
                aria-label="Description du projet"
              ></textarea>
              <label for="cf-description">Description du projet</label>
            </div>

            <!-- RGPD -->
            <div class="cf-rgpd" id="cfRgpd">
              <label class="cf-rgpd-row" for="cf-rgpd-check">
                <input
                  type="checkbox"
                  id="cf-rgpd-check"
                  name="rgpd"
                  aria-required="true"
                >
                <span class="cf-rgpd-box" id="cfRgpdBox">${buildCheckSvg()}</span>
                <span class="cf-rgpd-text">
                  <span class="cf-rgpd-required">RGPD*</span>
                  En soumettant ce formulaire, j'accepte que les informations saisies dans ce formulaire soient utilisées pour permettre de me recontacter. Pour connaître et exercer vos droits, notamment de retrait de votre consentement à l'utilisation des données collectées par ce formulaire, veuillez consulter notre
                  <a
                    href="/politique-de-confidentialite"
                    class="cf-rgpd-link"
                    target="_blank"
                    rel="noopener noreferrer"
                  >politique de confidentialité</a>.
                </span>
              </label>
            </div>

          </div>
        </div><!-- /step 4 -->

      </div><!-- /.cf-card -->

      <!-- Navigation -->
      <div class="cf-nav" id="cfNav">
        <button type="button" class="cf-btn-prev" id="cfPrev" aria-label="Étape précédente">
          <svg width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
            <path d="M5.5 1L1 5.5L5.5 10M1 5.5H12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Retour
        </button>
        <button type="button" class="cf-btn-next" id="cfNext" aria-label="Étape suivante">
          <span class="cf-btn-label">Continuer</span>
          <svg class="cf-btn-arrow" width="13" height="11" viewBox="0 0 13 11" fill="none" aria-hidden="true">
            <path d="M7.5 1L12 5.5L7.5 10M12 5.5H1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="cf-spinner" aria-hidden="true"></span>
        </button>
      </div>

      <!-- Message succès -->
      <div class="cf-success" id="cfSuccess" role="status" aria-live="polite">
        <div class="cf-success-icon" aria-hidden="true">
          <svg width="30" height="26" viewBox="0 0 30 26" fill="none">
            <path d="M2 13L10 21L28 3" stroke="#C4603B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <p class="cf-success-title">Merci, <em>c'est envoyé.</em></p>
        <p class="cf-success-sub">Nous revenons vers vous sous 24h.</p>
        <div class="cf-success-tags" id="cfSuccessTags"></div>
      </div>

      <!-- Note de bas de page -->
      <p class="cf-note" id="cfNote">Réponse garantie sous 24h&nbsp;&nbsp;·&nbsp;&nbsp;Sans engagement</p>

    </div>
  </div>`
}

// ============================================================
// ContactForm class
// ============================================================

class ContactForm {
  private container:    HTMLElement
  private currentStep:  number  = 0
  private transitioning: boolean = false

  private data: ContactData = {
    projectType: '',
    budget:      '',
    delay:       '',
    nom:         '',
    email:       '',
    entreprise:  '',
    description: '',
    rgpd:        false,
  }

  constructor(container: HTMLElement) {
    this.container = container
    this.mount()
    this.bindEvents()
    this.syncUI()
    this.initReveal()
  }

  // ── Mount ──────────────────────────────────────────────────

  private mount(): void {
    this.container.innerHTML = buildTemplate()
  }

  // ── Scroll reveal ──────────────────────────────────────────

  private initReveal(): void {
    const wrapper = this.container.querySelector<HTMLElement>('#cfWrapper')
    if (!wrapper) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            wrapper.classList.add('is-revealed')
            observer.disconnect()
          }
        })
      },
      // Observer le wrapper (le formulaire lui-même), pas la section entière.
      // Sinon l'animation joue hors-champ à cause du padding-top: 120px de #contact.
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(wrapper)
  }

  // ── Event binding (delegation) ─────────────────────────────

  private bindEvents(): void {
    const root = this.container

    // Choice selection
    root.addEventListener('click', (e) => {
      const btn = (e.target as Element).closest<HTMLElement>('.cf-choice')
      if (btn) this.selectChoice(btn)
    })

    // Next / submit
    root.querySelector('#cfNext')?.addEventListener('click', () => this.handleNext())

    // Prev
    root.querySelector('#cfPrev')?.addEventListener('click', () => this.handlePrev())

    // RGPD checkbox — sync custom box
    const rgpdInput = root.querySelector<HTMLInputElement>('#cf-rgpd-check')
    const rgpdBox   = root.querySelector<HTMLElement>('#cfRgpdBox')
    rgpdInput?.addEventListener('change', () => {
      this.data.rgpd = rgpdInput.checked
      rgpdBox?.classList.toggle('is-checked', rgpdInput.checked)
      if (rgpdInput.checked) {
        root.querySelector('#cfRgpd')?.classList.remove('has-error')
      }
    })

    // Text fields — live sync
    const textFields: Array<{ id: string; key: keyof ContactData }> = [
      { id: 'cf-nom',         key: 'nom' },
      { id: 'cf-email',       key: 'email' },
      { id: 'cf-entreprise',  key: 'entreprise' },
      { id: 'cf-description', key: 'description' },
    ]
    textFields.forEach(({ id, key }) => {
      root.querySelector<HTMLInputElement | HTMLTextAreaElement>(`#${id}`)
        ?.addEventListener('input', (e) => {
          (this.data as unknown as Record<string, string | boolean>)[key] =
            (e.target as HTMLInputElement).value.trim()
        })
    })

    // Clear field error on input
    root.addEventListener('input', (e) => {
      ;(e.target as Element).closest<HTMLElement>('.cf-field')
        ?.classList.remove('has-error')
    })

    // Enter key → next (except textarea)
    root.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.target as Element).tagName !== 'TEXTAREA') {
        e.preventDefault()
        this.handleNext()
      }
    })
  }

  // ── Choice selection ───────────────────────────────────────

  private selectChoice(btn: HTMLElement): void {
    const field = btn.dataset.field as keyof ContactData
    const value = btn.dataset.value ?? ''

    // Deselect siblings
    this.getPanels()[this.currentStep]
      .querySelectorAll<HTMLElement>(`.cf-choice[data-field="${field}"]`)
      .forEach((b) => {
        b.classList.remove('is-selected')
        b.setAttribute('aria-pressed', 'false')
      })

    // Select target
    btn.classList.add('is-selected')
    btn.setAttribute('aria-pressed', 'true')
    ;(this.data as unknown as Record<string, string | boolean>)[field] = value

    this.updateNextBtn()
  }

  // ── Navigation ─────────────────────────────────────────────

  private handleNext(): void {
    if (this.transitioning) return
    if (!this.validate()) return

    if (this.currentStep < STEPS.length - 1) {
      this.goTo(this.currentStep + 1, 1)
    } else {
      this.submit()
    }
  }

  private handlePrev(): void {
    if (this.transitioning || this.currentStep === 0) return
    this.goTo(this.currentStep - 1, -1)
  }

  // ── Step transition ────────────────────────────────────────

  private goTo(nextIdx: number, dir: 1 | -1): void {
    if (this.transitioning) return
    this.transitioning = true

    const panels = this.getPanels()
    const curr   = panels[this.currentStep]
    const next   = panels[nextIdx]
    const card   = this.container.querySelector<HTMLElement>('#cfCard')

    // Lock card height to prevent layout jump
    if (card) card.style.minHeight = card.offsetHeight + 'px'

    // --- Animate out current ---
    curr.style.transition   = 'opacity 0.28s ease, transform 0.28s ease'
    curr.style.opacity      = '0'
    curr.style.transform    = dir > 0 ? 'translateY(-12px)' : 'translateY(12px)'
    curr.style.pointerEvents = 'none'

    // --- Prepare next panel (hidden but displayed) ---
    next.style.display      = 'block'
    next.style.opacity      = '0'
    next.style.transform    = dir > 0 ? 'translateY(14px)' : 'translateY(-14px)'
    next.style.transition   = 'none'
    next.style.pointerEvents = 'none'

    // Trigger enter animation after two frames (ensures transition plays)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        next.style.transition    = 'opacity 0.42s cubic-bezier(0.16,1,0.3,1), transform 0.42s cubic-bezier(0.16,1,0.3,1)'
        next.style.opacity       = '1'
        next.style.transform     = 'translateY(0)'
        next.style.pointerEvents = ''
      })
    })

    // Cleanup after animations complete
    setTimeout(() => {
      // Reset exiting panel
      curr.classList.remove('is-active')
      curr.style.cssText = '' // returns to CSS display: none

      // Finalize entering panel
      next.classList.add('is-active')
      next.style.opacity    = ''
      next.style.transform  = ''
      next.style.transition = ''
      next.style.display    = '' // CSS .is-active handles display
      next.style.pointerEvents = ''

      // Release card height lock
      if (card) card.style.minHeight = ''

      this.currentStep   = nextIdx
      this.transitioning = false

      this.syncUI()
    }, 450)
  }

  // ── UI sync ────────────────────────────────────────────────

  private syncUI(): void {
    this.updateSteps()
    this.updateProgressBar()
    this.updatePrevBtn()
    this.updateNextBtn()
  }

  private updateSteps(): void {
    this.container
      .querySelectorAll<HTMLElement>('.cf-step-item')
      .forEach((item, i) => {
        item.classList.toggle('is-active', i === this.currentStep)
        item.classList.toggle('is-done',   i <  this.currentStep)
        item.setAttribute('aria-current', i === this.currentStep ? 'step' : 'false')
      })
  }

  private updateProgressBar(): void {
    const fill = this.container.querySelector<HTMLElement>('#cfProgressFill')
    const bar  = fill?.parentElement
    const pct  = Math.round(((this.currentStep + 1) / STEPS.length) * 100)
    if (fill) fill.style.width = pct + '%'
    if (bar)  bar.setAttribute('aria-valuenow', String(pct))
  }

  private updatePrevBtn(): void {
    this.container.querySelector<HTMLElement>('#cfPrev')
      ?.classList.toggle('is-visible', this.currentStep > 0)
  }

  private updateNextBtn(): void {
    const btn   = this.container.querySelector<HTMLButtonElement>('#cfNext')
    const label = btn?.querySelector<HTMLElement>('.cf-btn-label')
    if (!btn) return

    // Update label on last step
    if (label) {
      label.textContent = this.currentStep === STEPS.length - 1
        ? 'Discuter de mon projet'
        : 'Continuer'
    }

    // Disable if current choice not made
    const canProceed =
      this.currentStep === 0 ? !!this.data.projectType :
      this.currentStep === 1 ? !!this.data.budget      :
      this.currentStep === 2 ? !!this.data.delay       :
      true // step 4 validated on submit

    btn.disabled = !canProceed
  }

  // ── Validation ─────────────────────────────────────────────

  private validate(): boolean {
    // Steps 0–2: choice already validated via disabled button state
    if (this.currentStep < 3) return true

    // Step 4: field validation
    let valid = true

    const markError = (id: string): void => {
      this.container.querySelector<HTMLElement>(`#${id}`)
        ?.classList.add('has-error')
      valid = false
    }

    if (!this.data.nom)         markError('cfFieldNom')
    if (!this.validateEmail())  markError('cfFieldEmail')
    if (!this.data.description) markError('cfFieldDesc')
    if (!this.data.rgpd) {
      this.container.querySelector('#cfRgpd')?.classList.add('has-error')
      valid = false
    }

    return valid
  }

  private validateEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.data.email)
  }

  // ── Submit ─────────────────────────────────────────────────

  private submit(): void {
    if (!this.validate()) return

    const btn = this.container.querySelector<HTMLButtonElement>('#cfNext')
    btn?.classList.add('is-loading')

    fetch('https://formspree.io/f/mjgjwdka', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(this.data),
    })
      .then(r => r.ok ? this.showSuccess() : this.handleError())
      .catch(() => this.handleError())
      .finally(() => btn?.classList.remove('is-loading'))
  }

  private handleError(): void {
    const btn = this.container.querySelector<HTMLButtonElement>('#cfNext')
    if (btn) {
      btn.classList.add('is-error')
      const label = btn.querySelector<HTMLElement>('.cf-btn-label')
      if (label) label.textContent = 'Erreur — réessayer'
      setTimeout(() => {
        btn.classList.remove('is-error')
        if (label) label.textContent = 'Discuter de mon projet'
      }, 3000)
    }
  }

  // ── Success ────────────────────────────────────────────────

  private showSuccess(): void {
    const toHide = [
      '#cfCard',
      '.cf-progress',
      '#cfNav',
      '#cfNote',
    ].map(sel => this.container.querySelector<HTMLElement>(sel))

    // Fade out form UI
    toHide.forEach(el => {
      if (!el) return
      el.style.transition = 'opacity 0.38s ease, transform 0.38s ease'
      el.style.opacity    = '0'
      el.style.transform  = 'translateY(-10px)'
    })

    setTimeout(() => {
      toHide.forEach(el => el && (el.style.display = 'none'))

      // Build summary tags
      const tagsEl = this.container.querySelector<HTMLElement>('#cfSuccessTags')
      if (tagsEl) {
        const summaryLabels = [
          PROJECT_CHOICES.find(c => c.value === this.data.projectType)?.label,
          BUDGET_CHOICES.find(c  => c.value === this.data.budget)?.label,
          DELAY_CHOICES.find(c   => c.value === this.data.delay)?.label,
        ].filter((l): l is string => !!l)

        tagsEl.innerHTML = summaryLabels
          .map(l => `<span class="cf-success-tag">${l}</span>`)
          .join('')
      }

      this.container.querySelector('#cfSuccess')
        ?.classList.add('is-visible')
    }, 400)
  }

  // ── Helpers ────────────────────────────────────────────────

  private getPanels(): HTMLElement[] {
    return Array.from(
      this.container.querySelectorAll<HTMLElement>('.cf-panel')
    )
  }
}

// ============================================================
// Public init
// ============================================================

export function initContactForm(): void {
  const el = document.querySelector<HTMLElement>('#contact')
  if (el) new ContactForm(el)
}
