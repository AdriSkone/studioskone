/// <reference types="node" />
// GET /api/umami?path=api/websites/{id}/stats&startAt=...&endAt=... — proxy authentifié vers Umami.
// Le catch-all [...path].ts n'est pas garanti en Vercel Functions pures (sans Next.js),
// donc on passe le chemin Umami via un query param dédié.

import { parseCookies } from '../lib/cookies'
import { SESSION_COOKIE_NAME, verifySessionCookie } from '../lib/session'

export const config = { runtime: 'edge' }

const UMAMI_API_BASE = process.env.VITE_UMAMI_API_URL ?? 'https://api.umami.is'
const WEBSITE_ID = process.env.VITE_UMAMI_WEBSITE_ID ?? ''

// Chemins Umami autorisés — strict whitelist
const ALLOWED_PATH_PATTERNS = [
  /^api\/websites\/[a-f0-9-]+\/stats$/,
  /^api\/websites\/[a-f0-9-]+\/pageviews$/,
  /^api\/websites\/[a-f0-9-]+\/metrics$/,
  /^v1\/websites\/[a-f0-9-]+\/stats$/,
  /^v1\/websites\/[a-f0-9-]+\/pageviews$/,
  /^v1\/websites\/[a-f0-9-]+\/metrics$/,
]

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') return jsonError(405, 'Method Not Allowed')

  const cookies = parseCookies(req.headers.get('cookie'))
  const sessionId = await verifySessionCookie(cookies[SESSION_COOKIE_NAME])
  if (!sessionId) return jsonError(401, 'Non authentifié')

  const url = new URL(req.url)
  const subPath = (url.searchParams.get('path') ?? '').replace(/^\/+/, '')
  if (!subPath) return jsonError(400, 'Paramètre "path" manquant')

  if (!ALLOWED_PATH_PATTERNS.some((p) => p.test(subPath))) {
    return jsonError(403, 'Chemin non autorisé')
  }

  if (WEBSITE_ID && !subPath.includes(WEBSITE_ID)) {
    return jsonError(403, 'Website ID invalide')
  }

  const apiToken = process.env.UMAMI_API_TOKEN ?? process.env.VITE_UMAMI_API_TOKEN
  if (!apiToken) return jsonError(500, 'Config Umami serveur manquante')

  // Reconstruction de la query Umami : tous les params SAUF "path"
  const upstreamParams = new URLSearchParams()
  for (const [k, v] of url.searchParams.entries()) {
    if (k !== 'path') upstreamParams.append(k, v)
  }
  const qs = upstreamParams.toString()
  const targetUrl = `${UMAMI_API_BASE.replace(/\/$/, '')}/${subPath}${qs ? `?${qs}` : ''}`

  try {
    const upstream = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        // Umami Cloud — auth via header custom (PAS Bearer)
        // doc: https://docs.umami.is/docs/cloud/api-key
        'x-umami-api-key': apiToken,
        Accept: 'application/json',
      },
    })

    const body = await upstream.text()
    return new Response(body, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
        'Cache-Control': 'no-store',
        // Debug temporaire — à retirer une fois le bon chemin trouvé
        'X-Debug-Upstream-Url': targetUrl,
        'X-Debug-Upstream-Status': String(upstream.status),
        'X-Debug-Has-Token': apiToken ? 'yes' : 'no',
        'X-Debug-Token-Prefix': apiToken ? apiToken.slice(0, 4) : 'none',
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
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  })
}
