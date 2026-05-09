// GET /api/umami/<path> — proxy authentifié vers l'API Umami.
// Exige une session admin valide. Le token Umami reste côté serveur (jamais exposé au front).
// Whitelist stricte des chemins pour empêcher l'utilisation comme proxy ouvert.

import { parseCookies } from '../../lib/cookies.ts'
import { SESSION_COOKIE_NAME, verifySessionCookie } from '../../lib/session.ts'

export const config = { runtime: 'edge' }

const UMAMI_API_BASE = process.env.VITE_UMAMI_API_URL ?? 'https://api.umami.is'
const WEBSITE_ID = process.env.VITE_UMAMI_WEBSITE_ID ?? ''

// Chemins autorisés — tout ce qui n'est pas matché ici est refusé en 403.
const ALLOWED_PATTERNS = [
  /^v1\/websites\/[a-f0-9-]+\/stats$/,
  /^v1\/websites\/[a-f0-9-]+\/pageviews$/,
  /^v1\/websites\/[a-f0-9-]+\/metrics$/,
]

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return jsonError(405, 'Method Not Allowed')
  }

  // Auth — refus immédiat si pas de session valide
  const cookies = parseCookies(req.headers.get('cookie'))
  const sessionId = await verifySessionCookie(cookies[SESSION_COOKIE_NAME])
  if (!sessionId) return jsonError(401, 'Non authentifié')

  // Reconstruction du chemin Umami à partir de l'URL : /api/umami/<reste...>
  const url = new URL(req.url)
  const apiPathPrefix = '/api/umami/'
  const idx = url.pathname.indexOf(apiPathPrefix)
  if (idx < 0) return jsonError(404, 'Route inconnue')
  const subPath = url.pathname.slice(idx + apiPathPrefix.length)

  if (!ALLOWED_PATTERNS.some((p) => p.test(subPath))) {
    return jsonError(403, 'Chemin non autorisé')
  }

  // Sécurité supplémentaire : on impose le WEBSITE_ID admin, on n'accepte pas un autre id depuis l'URL
  if (WEBSITE_ID && !subPath.includes(WEBSITE_ID)) {
    return jsonError(403, 'Website ID invalide')
  }

  const apiToken = process.env.UMAMI_API_TOKEN ?? process.env.VITE_UMAMI_API_TOKEN
  if (!apiToken) return jsonError(500, 'Config Umami serveur manquante')

  const targetUrl = `${UMAMI_API_BASE.replace(/\/$/, '')}/${subPath}${url.search}`

  try {
    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: 'application/json',
      },
    })

    const body = await upstream.text()
    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[umami proxy] error:', err)
    return jsonError(502, 'Upstream Umami indisponible')
  }
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
