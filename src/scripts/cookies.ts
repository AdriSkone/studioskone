/**
 * Bandeau de consentement.
 *
 * Il n'existait que sur l'accueil, alors qu'Umami se chargeait sur les
 * quinze pages. Il est désormais posé par le même partiel partout, et ce
 * module le pilote de la même façon partout.
 */

const CLE = 'skone_cookie_consent'

export function initCookies(): void {
  const bandeau = document.getElementById('cookieBanner')
  if (!bandeau) return

  let dejaRepondu = false
  try {
    dejaRepondu = localStorage.getItem(CLE) !== null
  } catch {
    // Navigation privée, stockage refusé : on se tait plutôt que d'échouer.
    dejaRepondu = true
  }
  if (dejaRepondu) return

  // Apparition différée : la page se pose d'abord.
  window.setTimeout(() => {
    bandeau.classList.add('est-visible')
    bandeau.setAttribute('aria-hidden', 'false')
  }, 900)

  function repondre(valeur: string): void {
    try {
      localStorage.setItem(CLE, valeur)
    } catch {
      /* le refus de stockage ne doit pas empêcher le bandeau de se fermer */
    }
    bandeau?.classList.remove('est-visible')
    bandeau?.setAttribute('aria-hidden', 'true')
  }

  document.getElementById('cookieAccept')?.addEventListener('click', () => repondre('accepted'))
  document.getElementById('cookieDecline')?.addEventListener('click', () => repondre('declined'))
}
