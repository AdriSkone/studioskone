/**
 * Bandeau de consentement.
 *
 * Trois choses, dans cet ordre : savoir si le visiteur a déjà répondu,
 * poser la question sinon, et ne plus jamais la reposer ensuite.
 *
 * La mémoire du choix est le point délicat. Safari réglé sur « bloquer
 * tous les cookies », et plusieurs navigateurs en mode strict, font lever
 * une exception à `localStorage` ET refusent silencieusement l'écriture
 * d'un cookie. Une écriture qui ne lève pas d'exception n'est donc pas une
 * écriture réussie : chaque tentative est relue pour être crue. Sans cette
 * relecture, le bandeau réapparaissait à chaque page, indéfiniment, sans
 * que rien ne le signale.
 */

const CLE = 'skone_cookie_consent'

type Choix = 'accepted' | 'declined'

/* ── Mémoire ────────────────────────────────────────────────── */

function lireLocal(): string | null {
  try {
    return localStorage.getItem(CLE)
  } catch {
    return null
  }
}

function lireCookie(): string | null {
  const trouve = document.cookie.split('; ').find((c) => c.startsWith(`${CLE}=`))
  return trouve ? trouve.slice(CLE.length + 1) : null
}

export function lireConsentement(): string | null {
  return lireLocal() ?? lireCookie()
}

/** Écrit, puis relit. Rend `true` seulement si la valeur a survécu. */
function ecrire(valeur: Choix): boolean {
  try {
    localStorage.setItem(CLE, valeur)
    if (lireLocal() === valeur) return true
  } catch {
    /* stockage refusé : on tente le cookie */
  }
  // Six mois, la durée que recommande la CNIL pour un choix de cookies.
  document.cookie = `${CLE}=${valeur}; path=/; max-age=${60 * 60 * 24 * 182}; SameSite=Lax`
  return lireCookie() === valeur
}

/* ── Bandeau ────────────────────────────────────────────────── */

export function initCookies(): void {
  const bandeau = document.getElementById('cookieBanner')
  if (!bandeau) return

  // Masqué, il sort du flux et de la tabulation : un bandeau seulement
  // poussé hors écran continue d'attraper les doigts au bord de l'écran.
  const masquer = (): void => {
    bandeau.classList.remove('est-visible')
    bandeau.setAttribute('aria-hidden', 'true')
    bandeau.hidden = true
  }

  if (lireConsentement() !== null) {
    masquer()
    return
  }

  // Apparition différée : la page se pose d'abord.
  window.setTimeout(() => {
    bandeau.hidden = false
    bandeau.classList.add('est-visible')
    bandeau.setAttribute('aria-hidden', 'false')
  }, 900)

  function repondre(valeur: Choix): void {
    const memorise = ecrire(valeur)
    masquer()

    // Le choix n'a pas pu être mémorisé : le navigateur refuse tout
    // stockage. On ne peut pas le reposer à chaque page — ce serait un
    // bandeau que le visiteur ne pourrait jamais faire taire. On ferme
    // pour cette page, et la mesure d'audience reste éteinte, faute de
    // consentement démontrable.
    if (!memorise) {
      document.documentElement.dataset.consentementVolatile = 'true'
    }
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => repondre('accepted'))
  document.getElementById('cookieDecline')?.addEventListener('click', () => repondre('declined'))
}
