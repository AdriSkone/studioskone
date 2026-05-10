/// <reference types="node" />
// /api/auth/verify
// - GET ?token=xxx → rend une page HTML d'interstitiel qui auto-soumet un POST.
//   Les scanners email (IONOS, Outlook Safe Links, antivirus) suivent les GET mais
//   n'exécutent pas le JavaScript → ne consomment pas le token.
// - POST avec token en form data → valide le token, crée la session, redirige vers /admin.

import { serializeCookie } from '../../lib/cookies'
import { kvDel, kvGet } from '../../lib/kv'
import { checkRateLimit, getClientIp } from '../../lib/rate-limit'
import { escapeHtml, sha256Hex } from '../../lib/security'
import { createSession, SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from '../../lib/session'

export const config = { runtime: 'edge' }

const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW = 15 * 60
const TOKEN_RE = /^[A-Za-z0-9_-]{20,128}$/

export default async function handler(req: Request): Promise<Response> {
  const ip = getClientIp(req)
  const rl = await checkRateLimit(`rl:authverify:${ip}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW)
  if (!rl.allowed) return redirectToAdmin(req, 'rate_limited')

  if (req.method === 'GET') {
    const url = new URL(req.url)
    const token = url.searchParams.get('token') ?? ''
    if (!TOKEN_RE.test(token)) return redirectToAdmin(req, 'invalid_token')
    return renderInterstitial(token)
  }

  if (req.method === 'POST') {
    const form = await req.formData().catch(() => null)
    const token = String(form?.get('token') ?? '')
    if (!TOKEN_RE.test(token)) return redirectToAdmin(req, 'invalid_token')

    try {
      const tokenHash = await sha256Hex(token)
      const key = `magic:${tokenHash}`
      const exists = await kvGet(key)
      if (!exists) return redirectToAdmin(req, 'expired_or_used')

      // Single-use : on supprime AVANT de créer la session pour éviter une race.
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

  return redirectToAdmin(req, 'invalid_method')
}

function renderInterstitial(token: string): Response {
  const safeToken = escapeHtml(token)
  // Pas d'auto-submit JS — exige un clic humain explicite. Garantit que les scanners
  // de liens (même ceux qui exécutent du JS) ne consommeront pas le token, parce qu'aucun
  // bot ne va cliquer sur un bouton.
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Confirmer la connexion — Studio Skøne</title>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  body{font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;background:#FBF4E4;color:#1A1A1A;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
  .card{background:#FFF8EF;border:1px solid #E2D8CB;border-radius:20px;padding:40px 36px;max-width:420px;width:100%;text-align:center;box-shadow:0 4px 40px rgba(0,0,0,0.06)}
  .label{font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6B6B6B;margin-bottom:10px}
  h1{font-size:24px;font-weight:700;margin-bottom:14px;line-height:1.3}
  p{font-size:14px;line-height:1.55;color:#6B6B6B;margin-bottom:28px}
  button{background:#C4603B;color:#FBF4E4;border:none;border-radius:10px;padding:16px 28px;font-size:15px;font-weight:600;letter-spacing:0.02em;cursor:pointer;font-family:inherit;width:100%;transition:background 0.2s}
  button:hover{background:#A84E2E}
</style>
</head>
<body>
<form method="POST" action="/api/auth/verify">
  <input type="hidden" name="token" value="${safeToken}">
  <div class="card">
    <p class="label">Studio Skøne — Admin</p>
    <h1>Confirmer la connexion</h1>
    <p>Cliquez sur le bouton ci-dessous pour finaliser votre connexion au dashboard.</p>
    <button type="submit">Se connecter →</button>
  </div>
</form>
</body>
</html>`

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
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
