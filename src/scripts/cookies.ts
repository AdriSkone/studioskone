/**
 * Bandeau de consentement.
 *
 * Il n'existait que sur l'accueil, alors qu'Umami se chargeait sur les
 * quinze pages. Il est désormais posé par le même partiel partout, et ce
 * module le pilote de la même façon partout.
 */

const CLE = 'skone_cookie_consent'

/**
 * Le choix se range dans localStorage quand il est disponible, sinon dans
 * un cookie de session.
 *
 * Safari en navigation privée fait lever une exception à la première
 * écriture : sans ce repli, le bandeau disparaissait purement et
 * simplement — on considérait « stockage inaccessible » comme « déjà
 * répondu », donc on ne demandait plus rien à personne, alors que la
 * mesure d'audience, elle, continuait de se charger.
 */
function lire(): string | null {
  try {
    const v = localStorage.getItem(CLE)
    if (v !== null) return v
  } catch {
    /* stockage refusé : on tente le cookie */
  }
  const trouve = document.cookie.split('; ').find((c) => c.startsWith(`${CLE}=`))
  return trouve ? trouve.slice(CLE.length + 1) : null
}

function ecrire(valeur: string): void {
  try {
    localStorage.setItem(CLE, valeur)
    return
  } catch {
    /* stockage refusé : on retombe sur le cookie */
  }
  // Six mois, la durée que recommande la CNIL pour un choix de cookies.
  document.cookie = `${CLE}=${valeur}; path=/; max-age=${60 * 60 * 24 * 182}; SameSite=Lax`
}

export function initCookies(): void {
  const bandeau = document.getElementById('cookieBanner')
  if (!bandeau) return

  if (lire() !== null) return

  // Apparition différée : la page se pose d'abord.
  window.setTimeout(() => {
    bandeau.classList.add('est-visible')
    bandeau.setAttribute('aria-hidden', 'false')
  }, 900)

  function repondre(valeur: string): void {
    ecrire(valeur)
    bandeau?.classList.remove('est-visible')
    bandeau?.setAttribute('aria-hidden', 'true')
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => repondre('accepted'))
  document.getElementById('cookieDecline')?.addEventListener('click', () => repondre('declined'))
}
