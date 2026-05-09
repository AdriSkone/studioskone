// ── Config ────────────────────────────────────────────────────────────────────

const UMAMI_PROXY = '/api/umami'
const WEBSITE_ID = import.meta.env.VITE_UMAMI_WEBSITE_ID ?? ''

// ── Types ─────────────────────────────────────────────────────────────────────

type Range = '7d' | '30d' | '90d'

interface UmamiStats {
  pageviews: { value: number; prev: number }
  visitors:  { value: number; prev: number }
  visits:    { value: number; prev: number }
  bounces:   { value: number; prev: number }
  totaltime: { value: number; prev: number }
}

interface PageviewPoint     { x: string; y: number }
interface PageviewsResponse { pageviews: PageviewPoint[]; sessions: PageviewPoint[] }
interface MetricItem        { x: string; y: number }

// ── HTML escape — protection XSS sur les champs venant d'Umami (referrers, URLs) ──

function escapeHtml(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]!))
}

// ── Auth ──────────────────────────────────────────────────────────────────────

async function checkSession(): Promise<boolean> {
  try {
    const res = await fetch('/api/auth/session', { credentials: 'same-origin' })
    if (!res.ok) return false
    const data = (await res.json()) as { authenticated: boolean }
    return !!data.authenticated
  } catch {
    return false
  }
}

async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'X-Requested-With': 'fetch' },
    })
  } catch {
    // pas bloquant — on recharge de toute façon
  }
  location.replace('/admin')
}

// ── Date range ────────────────────────────────────────────────────────────────

function getRange(range: Range): { startAt: number; endAt: number; unit: string } {
  const endAt = Date.now()
  const days  = range === '7d' ? 7 : range === '30d' ? 30 : 90
  return {
    startAt: endAt - days * 86_400_000,
    endAt,
    unit: days <= 30 ? 'day' : 'week',
  }
}

// ── API ───────────────────────────────────────────────────────────────────────

async function apiGet<T>(path: string, params: Record<string, string | number>): Promise<T> {
  const url = new URL(`${UMAMI_PROXY}/v1${path}`, location.origin)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v))
  const res = await fetch(url.toString(), {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })
  if (res.status === 401) {
    // Session expirée pendant la consultation → retour à l'écran de login
    location.replace('/admin')
    throw new Error('Session expirée')
  }
  if (!res.ok) throw new Error(`Umami ${res.status}: ${path}`)
  return res.json() as Promise<T>
}

// ── Formatters ────────────────────────────────────────────────────────────────

function fmt(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n)
}

function fmtDuration(seconds: number): string {
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

function pctDelta(current: number, prev: number): string {
  if (prev === 0) return '—'
  const p = Math.round(((current - prev) / prev) * 100)
  return p >= 0 ? `+${p}% vs période préc.` : `${p}% vs période préc.`
}

function deltaClass(current: number, prev: number): string {
  if (prev === 0) return ''
  return current >= prev ? 'up' : 'down'
}

// ── SVG Sparkline ─────────────────────────────────────────────────────────────

function renderSparkline(container: HTMLElement, data: PageviewPoint[]): void {
  if (data.length < 2) {
    container.innerHTML = '<p class="empty-state">Pas assez de données pour afficher le graphique.</p>'
    return
  }

  const W   = Math.max(container.clientWidth, 400)
  const H   = 160
  const pad = { top: 12, right: 16, bottom: 32, left: 48 }
  const iW  = W - pad.left - pad.right
  const iH  = H - pad.top  - pad.bottom

  const maxY = Math.max(...data.map(d => d.y), 1)
  const pts  = data.map((d, i) => ({
    x: pad.left + (i / (data.length - 1)) * iW,
    y: pad.top  + iH * (1 - d.y / maxY),
  }))

  const line = pts.map((p, i) =>
    `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`
  ).join(' ')

  const area = [
    `M${pts[0].x.toFixed(1)},${(pad.top + iH).toFixed(1)}`,
    ...pts.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `L${pts.at(-1)!.x.toFixed(1)},${(pad.top + iH).toFixed(1)}Z`,
  ].join(' ')

  const yTicks = [0, Math.ceil(maxY / 2), maxY].map(v => {
    const y = (pad.top + iH * (1 - v / maxY)).toFixed(1)
    return `
      <line x1="${pad.left}" y1="${y}" x2="${(pad.left + iW).toFixed(1)}" y2="${y}" stroke="#E2D8CB" stroke-width="1"/>
      <text x="${pad.left - 8}" y="${y}" text-anchor="end" dominant-baseline="middle"
            fill="#6B6B6B" font-size="11" font-family="Barlow,sans-serif">${fmt(v)}</text>`
  }).join('')

  const xIdxs  = [0, Math.floor((data.length - 1) / 2), data.length - 1]
  const xTicks = xIdxs.map(i => {
    const p     = pts[i]
    const label = new Date(data[i].x).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
    return `<text x="${p.x.toFixed(1)}" y="${(pad.top + iH + 20).toFixed(1)}" text-anchor="middle"
            fill="#6B6B6B" font-size="11" font-family="Barlow,sans-serif">${label}</text>`
  }).join('')

  const gId      = `g${Math.random().toString(36).slice(2, 8)}`
  const showDots = data.length <= 14

  container.innerHTML = `
    <svg viewBox="0 0 ${W} ${H}" width="100%" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="${gId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#C4603B" stop-opacity="0.22"/>
          <stop offset="100%" stop-color="#C4603B" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${yTicks}
      <path d="${area}" fill="url(#${gId})"/>
      <path d="${line}" fill="none" stroke="#C4603B" stroke-width="2"
            stroke-linejoin="round" stroke-linecap="round"/>
      ${showDots ? pts.map(p =>
        `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.5" fill="#C4603B"/>`
      ).join('') : ''}
      ${xTicks}
    </svg>`
}

// ── HTML builders ─────────────────────────────────────────────────────────────

function statsHTML(s: UmamiStats): string {
  const avgSec = s.visits.value > 0 ? Math.round(s.totaltime.value / s.visits.value) : 0
  const bounce = s.visits.value > 0 ? Math.round((s.bounces.value / s.visits.value) * 100) : 0
  return `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Pageviews</div>
        <div class="stat-value">${fmt(s.pageviews.value)}</div>
        <div class="stat-delta ${deltaClass(s.pageviews.value, s.pageviews.prev)}">${pctDelta(s.pageviews.value, s.pageviews.prev)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Visiteurs uniques</div>
        <div class="stat-value">${fmt(s.visitors.value)}</div>
        <div class="stat-delta ${deltaClass(s.visitors.value, s.visitors.prev)}">${pctDelta(s.visitors.value, s.visitors.prev)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Sessions</div>
        <div class="stat-value">${fmt(s.visits.value)}</div>
        <div class="stat-delta ${deltaClass(s.visits.value, s.visits.prev)}">${pctDelta(s.visits.value, s.visits.prev)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Durée moy. / session</div>
        <div class="stat-value">${fmtDuration(avgSec)}</div>
        <div class="stat-delta">Taux rebond : ${bounce}%</div>
      </div>
    </div>`
}

function metricListHTML(items: MetricItem[], maxVal: number): string {
  if (!items.length) return '<p class="empty-state">Aucune donnée</p>'
  return items.map(item => {
    const safeX = escapeHtml(item.x)
    return `
    <div class="metric-row">
      <span class="metric-url" title="${safeX}">${safeX || '(direct)'}</span>
      <div class="metric-bar-wrap">
        <div class="metric-bar-bg">
          <div class="metric-bar-fill" style="width:${Math.round((Number(item.y) / maxVal) * 100)}%"></div>
        </div>
        <span class="metric-count">${Number(item.y)}</span>
      </div>
    </div>`
  }).join('')
}

const DEVICE_COLORS = ['#C4603B', '#A84E2E', '#6B6B6B', '#E8D1B3', '#1A1A1A']

function devicesHTML(items: MetricItem[]): string {
  const total = items.reduce((s, d) => s + Number(d.y), 0)
  return items.map((item, i) => {
    const pct = total > 0 ? Math.round((Number(item.y) / total) * 100) : 0
    const safeX = escapeHtml(item.x)
    return `<div class="device-item">
      <span class="device-dot" style="background:${DEVICE_COLORS[i % DEVICE_COLORS.length]}"></span>
      ${safeX || 'Inconnu'} <strong>${pct}%</strong>
    </div>`
  }).join('')
}

// ── Load dashboard ────────────────────────────────────────────────────────────

async function loadDashboard(range: Range): Promise<void> {
  const body = document.getElementById('dash-body')!
  body.innerHTML = '<div class="loading">Chargement…</div>'

  const { startAt, endAt, unit } = getRange(range)
  const base = { startAt, endAt }

  try {
    const [stats, pvData, pages, refs, devices] = await Promise.all([
      apiGet<UmamiStats>          (`/websites/${WEBSITE_ID}/stats`,    base),
      apiGet<PageviewsResponse>   (`/websites/${WEBSITE_ID}/pageviews`, { ...base, unit, timezone: 'Europe/Paris' }),
      apiGet<MetricItem[]>        (`/websites/${WEBSITE_ID}/metrics`,   { ...base, type: 'url',      limit: '8' }),
      apiGet<MetricItem[]>        (`/websites/${WEBSITE_ID}/metrics`,   { ...base, type: 'referrer', limit: '8' }),
      apiGet<MetricItem[]>        (`/websites/${WEBSITE_ID}/metrics`,   { ...base, type: 'device',   limit: '5' }),
    ])

    body.innerHTML = `
      ${statsHTML(stats)}
      <div class="chart-card">
        <div class="section-label">Pageviews</div>
        <div id="chart-container"></div>
      </div>
      <div class="bottom-grid">
        <div class="list-card">
          <div class="section-label">Pages populaires</div>
          ${metricListHTML(pages, pages[0]?.y ?? 1)}
        </div>
        <div class="list-card">
          <div class="section-label">Sources de trafic</div>
          ${metricListHTML(refs, refs[0]?.y ?? 1)}
        </div>
      </div>
      <div class="devices-card">
        <div class="section-label">Appareils</div>
        <div class="devices-row">${devicesHTML(devices)}</div>
      </div>`

    renderSparkline(document.getElementById('chart-container')!, pvData.pageviews)
  } catch (err) {
    body.innerHTML = `
      <div class="loading error">
        Erreur de chargement — vérifiez votre configuration Umami.<br>
        <small>${escapeHtml(err instanceof Error ? err.message : String(err))}</small>
      </div>`
  }
}

// ── Init dashboard ────────────────────────────────────────────────────────────

function showDashboard(): void {
  document.getElementById('login-screen')!.style.display = 'none'
  const dash = document.getElementById('dashboard')!
  dash.style.display = 'flex'

  if (!WEBSITE_ID) {
    document.getElementById('config-warning')!.style.display = 'block'
  }

  let range: Range = '7d'
  void loadDashboard(range)

  document.querySelectorAll<HTMLButtonElement>('.range-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'))
      btn.classList.add('active')
      range = btn.dataset.range as Range
      void loadDashboard(range)
    })
  })

  document.getElementById('logout-btn')!.addEventListener('click', () => { void logout() })
}

// ── Init login ────────────────────────────────────────────────────────────────

function showMessage(text: string, kind: 'success' | 'error' | 'info'): void {
  const el = document.getElementById('login-message')
  if (!el) return
  el.textContent = text
  el.classList.remove('is-success', 'is-error', 'is-info')
  el.classList.add(`is-${kind}`)
}

function readErrorParam(): string | null {
  const params = new URLSearchParams(location.search)
  const err = params.get('error')
  if (!err) return null
  switch (err) {
    case 'expired_or_used':  return 'Ce lien a expiré ou a déjà été utilisé. Demandez-en un nouveau.'
    case 'invalid_token':    return 'Lien de connexion invalide.'
    case 'rate_limited':     return 'Trop de tentatives. Réessayez dans quelques minutes.'
    case 'invalid_method':   return 'Requête invalide.'
    case 'server_error':     return 'Erreur serveur. Réessayez.'
    default:                 return 'Erreur lors de la connexion.'
  }
}

function initLogin(): void {
  const btn = document.getElementById('magic-btn') as HTMLButtonElement | null
  if (!btn) return

  // Affiche un éventuel message d'erreur transmis par /api/auth/verify via ?error=
  const errMsg = readErrorParam()
  if (errMsg) {
    showMessage(errMsg, 'error')
    // Nettoie l'URL pour éviter de re-afficher l'erreur au reload
    history.replaceState(null, '', '/admin')
  }

  async function requestLink(): Promise<void> {
    btn!.disabled = true
    showMessage('Envoi en cours…', 'info')
    try {
      const res = await fetch('/api/auth/request', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'fetch',
        },
        body: '{}',
      })
      if (res.status === 429) {
        showMessage('Trop de tentatives. Réessayez dans 15 minutes.', 'error')
        return
      }
      if (!res.ok) {
        showMessage('Une erreur est survenue. Réessayez.', 'error')
        return
      }
      showMessage('Lien envoyé. Vérifiez votre boîte mail (valable 10 min).', 'success')
      btn!.textContent = 'Lien envoyé ✓'
    } catch {
      showMessage('Erreur réseau. Réessayez.', 'error')
    } finally {
      // On laisse le bouton désactivé après envoi pour éviter le spam (rate limit côté serveur de toute façon)
      // Mais on le réactive après 30 sec pour permettre un renvoi si le mail n'arrive pas
      setTimeout(() => {
        btn!.disabled = false
        btn!.textContent = 'Renvoyer un lien →'
      }, 30000)
    }
  }

  btn.addEventListener('click', () => { void requestLink() })
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

void (async () => {
  const authenticated = await checkSession()
  if (authenticated) {
    showDashboard()
  } else {
    initLogin()
  }
})()
