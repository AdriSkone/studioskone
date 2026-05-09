// Wrapper minimal autour de l'API REST Upstash Redis (Vercel KV)
// Doc Upstash : https://upstash.com/docs/redis/features/restapi

const KV_URL = process.env.KV_REST_API_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN

function ensureConfigured() {
  if (!KV_URL || !KV_TOKEN) {
    throw new Error('KV_REST_API_URL ou KV_REST_API_TOKEN manquant')
  }
}

async function kvCommand(command: (string | number)[]): Promise<unknown> {
  ensureConfigured()
  const res = await fetch(KV_URL!, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${KV_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  })
  if (!res.ok) {
    throw new Error(`KV ${res.status}: ${await res.text()}`)
  }
  const data = (await res.json()) as { result?: unknown; error?: string }
  if (data.error) throw new Error(`KV error: ${data.error}`)
  return data.result
}

export async function kvSet(
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<void> {
  const cmd: (string | number)[] = ['SET', key, value]
  if (ttlSeconds && ttlSeconds > 0) cmd.push('EX', ttlSeconds)
  await kvCommand(cmd)
}

export async function kvGet(key: string): Promise<string | null> {
  const result = await kvCommand(['GET', key])
  return result === null || result === undefined ? null : String(result)
}

export async function kvDel(key: string): Promise<void> {
  await kvCommand(['DEL', key])
}

// Incrémente atomiquement et pose un TTL si la clé est nouvelle.
// Retourne la valeur courante du compteur.
export async function kvIncrWithTtl(key: string, ttlSeconds: number): Promise<number> {
  const result = await kvCommand(['INCR', key])
  const count = Number(result)
  // EXPIRE NX = pose le TTL uniquement si la clé n'en a pas
  // (sur les anciennes versions Redis, NX peut ne pas être supporté → fallback sans NX au 1er incr)
  if (count === 1) {
    await kvCommand(['EXPIRE', key, ttlSeconds])
  }
  return count
}
