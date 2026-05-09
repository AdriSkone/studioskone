// POST /api/auth/request — envoie un magic link à l'email admin.
// Body : aucun (l'admin n'a qu'un seul email — pas la peine de le saisir).
// Réponse : 200 {ok:true} dans tous les cas (pas de leak), 429 si rate-limité.

import { sendEmail, magicLinkEmail } from '../../lib/email.ts'
import { kvSet } from '../../lib/kv.ts'
import { checkRateLimit, getClientIp } from '../../lib/rate-limit.ts'
import { randomBase64Url, sha256Hex } from '../../lib/security.ts'

export const config = { runtime: 'edge' }

const TOKEN_TTL_SECONDS = 10 * 60 // 10 minutes
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW = 15 * 60 // 15 minutes

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    })
  }

  // Same-origin check (CSRF defense-in-depth, en plus de SameSite=Lax sur les cookies)
  const origin = req.headers.get('origin')
  const expectedOrigins = getExpectedOrigins(req)
  if (origin && !expectedOrigins.includes(origin)) {
    return jsonError(403, 'Origin invalide')
  }

  const ip = getClientIp(req)
  const rl = await checkRateLimit(`rl:authrequest:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)
  if (!rl.allowed) {
    return new Response(JSON.stringify({ error: 'Trop de tentatives. Réessayez plus tard.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(rl.retryAfterSeconds),
      },
    })
  }

  try {
    const adminEmail = process.env.ADMIN_EMAIL
    if (!adminEmail) throw new Error('ADMIN_EMAIL manquant')

    const baseUrl = resolveBaseUrl(req)

    // Token = 32 octets random (≈256 bits d'entropie). Stocké HASHÉ en KV → un dump de la KV ne donne pas les tokens en clair.
    const token = randomBase64Url(32)
    const tokenHash = await sha256Hex(token)
    await kvSet(`magic:${tokenHash}`, '1', TOKEN_TTL_SECONDS)

    const loginUrl = `${baseUrl}/api/auth/verify?token=${token}`
    const { subject, html, text } = magicLinkEmail(loginUrl, TOKEN_TTL_SECONDS / 60)
    await sendEmail({ to: adminEmail, subject, html, text })

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[auth/request] error:', err)
    // Réponse générique — ne révèle pas si l'envoi a échoué pour cause de config ou autre
    return jsonError(500, 'Une erreur est survenue. Réessayez dans quelques instants.')
  }
}

function getExpectedOrigins(req: Request): string[] {
  const list: string[] = []
  if (process.env.BASE_URL) list.push(process.env.BASE_URL)
  if (process.env.VERCEL_URL) list.push(`https://${process.env.VERCEL_URL}`)
  // Origin du déploiement courant — Vercel injecte VERCEL_URL pour les previews
  const url = new URL(req.url)
  list.push(`${url.protocol}//${url.host}`)
  return list
}

function resolveBaseUrl(req: Request): string {
  if (process.env.BASE_URL) return process.env.BASE_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  const url = new URL(req.url)
  return `${url.protocol}//${url.host}`
}

function jsonError(status: number, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}
