// GET /api/auth/session — { authenticated: true | false }

import { parseCookies } from '../../lib/cookies.ts'
import { SESSION_COOKIE_NAME, verifySessionCookie } from '../../lib/session.ts'

export const config = { runtime: 'edge' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'GET' },
    })
  }

  const cookies = parseCookies(req.headers.get('cookie'))
  const sessionId = await verifySessionCookie(cookies[SESSION_COOKIE_NAME])

  return new Response(JSON.stringify({ authenticated: !!sessionId }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  })
}
