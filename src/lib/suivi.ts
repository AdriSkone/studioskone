/**
 * Envoi d'événements à Umami.
 *
 * Umami ne se charge qu'après consentement, et en différé : un événement
 * émis avant l'arrivée du script serait perdu. Il attend donc dans une file,
 * vidée dès que `window.umami` existe. Sans consentement, le script n'arrive
 * jamais et la file abandonne au bout de quelques secondes, sans rien envoyer.
 */

type Donnees = Record<string, string | number>
type Umami = { track: (nom: string, donnees?: Donnees) => void }

const ATTENTE_MAX = 15_000
const INTERVALLE = 500

const file: Array<[string, Donnees | undefined]> = []
let attente = 0
let minuteur: number | undefined

function umami(): Umami | undefined {
  return (window as unknown as { umami?: Umami }).umami
}

function vider(): void {
  const u = umami()
  if (u) {
    file.splice(0).forEach(([nom, donnees]) => u.track(nom, donnees))
    minuteur = undefined
    return
  }
  attente += INTERVALLE
  if (attente >= ATTENTE_MAX) {
    file.length = 0
    minuteur = undefined
    return
  }
  minuteur = window.setTimeout(vider, INTERVALLE)
}

export function suivre(nom: string, donnees?: Donnees): void {
  const u = umami()
  if (u && !file.length) {
    u.track(nom, donnees)
    return
  }
  file.push([nom, donnees])
  if (minuteur === undefined) {
    attente = 0
    minuteur = window.setTimeout(vider, INTERVALLE)
  }
}
