// Gestion des sessions admin
// - Session ID = 16 octets random (base64url)
// - Cookie = `${sessionId}.${HMAC(SESSION_SECRET, sessionId)}`
// - Stockage KV : clé `session:${sessionId}` → "1", TTL = SESSION_TTL_SECONDS

import { kvDel, kvGet, kvSet } from './kv'
import { constantTimeEquals, hmacSign, randomBase64Url } from './security'

export const SESSION_COOKIE_NAME = 'skone_session'
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30 // 30 jours

function getSecret(): string {
  const s = process.env.SESSION_SECRET
  if (!s || s.length < 32) {
    throw new Error('SESSION_SECRET manquant ou trop court (min 32 caractères)')
  }
  return s
}

export async function createSession(): Promise<string> {
  const sessionId = randomBase64Url(16)
  await kvSet(`session:${sessionId}`, '1', SESSION_TTL_SECONDS)
  const sig = await hmacSign(getSecret(), sessionId)
  return `${sessionId}.${sig}`
}

// Vérifie le cookie : valide la signature HMAC, puis confirme l'existence en KV.
// Retourne le sessionId si valide, null sinon.
export async function verifySessionCookie(cookieValue: string | undefined): Promise<string | null> {
  if (!cookieValue) return null
  const dot = cookieValue.indexOf('.')
  if (dot <= 0 || dot === cookieValue.length - 1) return null

  const sessionId = cookieValue.slice(0, dot)
  const providedSig = cookieValue.slice(dot + 1)

  // Format check léger — protège des erreurs grossières avant de toucher KV
  if (!/^[A-Za-z0-9_-]+$/.test(sessionId) || !/^[A-Za-z0-9_-]+$/.test(providedSig)) return null

  const expectedSig = await hmacSign(getSecret(), sessionId)
  if (!constantTimeEquals(providedSig, expectedSig)) return null

  // Confirmer en KV (permet la révocation à la déconnexion)
  const exists = await kvGet(`session:${sessionId}`)
  if (!exists) return null

  return sessionId
}

export async function destroySession(sessionId: string): Promise<void> {
  await kvDel(`session:${sessionId}`)
}
