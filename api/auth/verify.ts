// GET /api/auth/verify?token=xxx — valide le token magic link, crée la session, redirige vers /admin.

import { serializeCookie } from '../../lib/cookies.ts'
import { kvDel, kvGet } from '../../lib/kv.ts'
import { checkRateLimit, getClientIp } from '../../lib/rate-limit.ts'
import { sha256Hex } from '../../lib/security.ts'
import { createSession, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from '../../lib/session.ts'

export const config = { runtime: 'edge' }

const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW = 15 * 60

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return redirectToAdmin(req, 'invalid_method')
  }

  const ip = getClientIp(req)
  const rl = await checkRateLimit(`rl:authverify:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)
  if (!rl.allowed) return redirectToAdmin(req, 'rate_limited')

  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''

  // Validation grossière du format avant tout calcul lourd
  if (!/^[A-Za-z0-9_-]{20,128}$/.test(token)) {
    return redirectToAdmin(req, 'invalid_token')
  }

  try {
    const tokenHash = await sha256Hex(token)
    const key = `magic:${tokenHash}`
    const exists = await kvGet(key)
    if (!exists) return redirectToAdmin(req, 'expired_or_used')

    // Single-use : on supprime AVANT de créer la session, pour éviter une race condition
    // qui permettrait à un attaquant ayant intercepté l'URL de la rejouer.
    await kvDel(key)

    const cookieValue = await createSession()
    const cookie = serializeCookie(SESSION_COOKIE_NAME, cookieValue, {
      maxAge: SESSION_TTL_SECONDS,
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'Lax',
    })

    return new Response(null, {
      status: 302,
      headers: {
        Location: '/admin',
        'Set-Cookie': cookie,
        'Cache-Control': 'no-store',
      },
    })
  } catch (err) {
    console.error('[auth/verify] error:', err)
    return redirectToAdmin(req, 'server_error')
  }
}

function redirectToAdmin(req: Request, reason: string): Response {
  const u = new URL(req.url)
  u.pathname = '/admin'
  u.search = `?error=${encodeURIComponent(reason)}`
  return new Response(null, {
    status: 302,
    headers: { Location: u.pathname + u.search, 'Cache-Control': 'no-store' },
  })
}
