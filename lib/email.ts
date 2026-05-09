// Envoi d'emails via l'API Resend (REST direct, pas de SDK pour éviter une dépendance)

import { escapeHtml } from './security.ts'

const RESEND_API = 'https://api.resend.com/emails'

interface SendArgs {
  to: string
  subject: string
  html: string
  text: string
}

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM
  if (!apiKey || !from) {
    throw new Error('RESEND_API_KEY ou RESEND_FROM manquant')
  }

  const res = await fetch(RESEND_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Resend ${res.status}: ${body}`)
  }
}

export function magicLinkEmail(loginUrl: string, expiryMinutes: number) {
  const safeUrl = escapeHtml(loginUrl)
  const subject = 'Connexion Studio Skøne — Admin'

  const text = [
    'Quelqu\'un a demandé un lien de connexion à votre dashboard admin Studio Skøne.',
    '',
    `Cliquez ici pour vous connecter (lien valable ${expiryMinutes} minutes, à usage unique) :`,
    loginUrl,
    '',
    'Si vous n\'êtes pas à l\'origine de cette demande, ignorez ce message — aucune action n\'est requise.',
    '',
    '— Studio Skøne',
  ].join('\n')

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#FBF4E4;font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:#1A1A1A">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF4E4">
    <tr>
      <td align="center" style="padding:48px 24px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:440px;background:#FFF8EF;border-radius:20px;border:1px solid #E2D8CB">
          <tr>
            <td style="padding:40px 36px">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#6B6B6B">Studio Skøne</p>
              <h1 style="margin:0 0 24px;font-size:22px;font-weight:700;color:#1A1A1A;line-height:1.3">Lien de connexion admin</h1>
              <p style="margin:0 0 28px;font-size:15px;line-height:1.55;color:#1A1A1A">
                Quelqu'un a demandé un lien de connexion à votre dashboard.
                Si c'est bien vous, cliquez sur le bouton ci-dessous pour vous connecter.
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px">
                <tr>
                  <td style="background:#C4603B;border-radius:10px">
                    <a href="${safeUrl}" style="display:inline-block;padding:14px 28px;font-size:15px;font-weight:600;color:#FBF4E4;text-decoration:none;letter-spacing:0.02em">Se connecter →</a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;font-size:13px;line-height:1.55;color:#6B6B6B">
                Lien valable <strong>${expiryMinutes} minutes</strong>, à usage unique.
              </p>
              <p style="margin:0 0 24px;font-size:13px;line-height:1.55;color:#6B6B6B">
                Si le bouton ne fonctionne pas, copiez-collez cette URL dans votre navigateur :<br>
                <span style="word-break:break-all;color:#1A1A1A">${safeUrl}</span>
              </p>
              <hr style="border:none;border-top:1px solid #E2D8CB;margin:24px 0">
              <p style="margin:0;font-size:12px;line-height:1.55;color:#6B6B6B">
                Vous n'êtes pas à l'origine de cette demande ? Ignorez ce message — aucune action n'est requise et personne ne peut se connecter sans cliquer sur ce lien.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:11px;color:#6B6B6B">Studio Skøne · studioskone.com</p>
      </td>
    </tr>
  </table>
</body>
</html>`

  return { subject, text, html }
}
