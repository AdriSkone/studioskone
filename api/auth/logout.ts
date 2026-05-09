// POST /api/auth/logout — détruit la session côté serveur, supprime le cookie.

import { parseCookies, serializeCookie } from '../../lib/cookies.ts'
import { destroySession, SESSION_COOKIE_NAME, verifySessionCookie } from '../../lib/session.ts'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    })
  }

  // Same-origin check (CSRF defense-in-depth)
  const origin = req.headers.get('origin')
  if (origin) {
    const url = new URL(req.url)
    const expected = process.env.BASE_URL ?? `${url.protocol}//${url.host}`
    if (origin !== expected && origin !== `${url.protocol}//${url.host}`) {
      return new Response(JSON.stringify({ error: 'Origin invalide' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const sessionId = await verifySessionCookie(cookies[SESSION_COOKIE_NAME])
  if (sessionId) await destroySession(sessionId)

  // Cookie effacé (Max-Age=0)
  const expired = serializeCookie(SESSION_COOKIE_NAME, '', {
    maxAge: 0,
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
  })

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Set-Cookie': expired,
      'Cache-Control': 'no-store',
    },
  })
}
