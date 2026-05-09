// Rate limiting fenêtre fixe basé sur INCR + EXPIRE Redis.
// Plus simple qu'un sliding window log et suffisant pour les endpoints publics admin.

import { kvIncrWithTtl } from './kv.ts'

export interface RateLimitResult {
  allowed: boolean
  count: number
  limit: number
  retryAfterSeconds: number
}

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<RateLimitResult> {
  const count = await kvIncrWithTtl(key, windowSeconds)
  return {
    allowed: count <= limit,
    count,
    limit,
    retryAfterSeconds: windowSeconds,
  }
}

// Best-effort IP extraction côté Vercel Edge.
// Forwarded peut être spoofé en local, mais sur Vercel prod le header est fiable.
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for')
  if (xff) return xff.split(',')[0]!.trim()
  const xri = req.headers.get('x-real-ip')
  if (xri) return xri.trim()
  return 'unknown'
}
