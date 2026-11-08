// Outils communs aux scripts de vérification : navigateur, ouverture de la page, attente des polices.
// Toute erreur console, erreur de script ou requête échouée est relevée : un tour de vérification
// avec une erreur est un tour raté.
import { chromium } from 'playwright'

export const FORMATS = {
  ordinateur: { nom: '1440', largeur: 1440, hauteur: 900 },
  mobile: { nom: '390', largeur: 390, hauteur: 844 },
}

const POLICES = [
  '400 16px "General Sans"',
  '500 16px "General Sans"',
  '600 16px "General Sans"',
  '400 16px "Geist Mono"',
  '500 16px "Geist Mono"',
]

/**
 * Lance Chromium avec un rendu stable pour les mesures :
 *  - --disable-lcd-text : pas d'anticrénelage sous-pixel (sous Windows, il ajoute des franges orange
 *    et bleues au bord des lettres, que la mesure d'ambre compterait à tort) ;
 *  - --force-color-profile=srgb : les couleurs capturées sont celles du CSS, quel que soit l'écran.
 */
export function lancerNavigateur() {
  return chromium.launch({ args: ['--disable-lcd-text', '--force-color-profile=srgb'] })
}

/** Attend que chaque graisse soit vraiment chargée ; échoue sinon (une capture en police de secours ne vaut rien). */
export async function attendrePolices(page) {
  const manquantes = await page.evaluate(async (faces) => {
    await Promise.all(faces.map((f) => document.fonts.load(f)))
    await document.fonts.ready
    return faces.filter((f) => !document.fonts.check(f))
  }, POLICES)
  if (manquantes.length) throw new Error(`Polices non chargées : ${manquantes.join(', ')}`)
}

/** Ouvre la page dans un format donné ; renvoie { page, contexte, erreurs }. */
export async function ouvrirPage(navigateur, url, format, { reduit = false } = {}) {
  const contexte = await navigateur.newContext({
    viewport: { width: format.largeur, height: format.hauteur },
    deviceScaleFactor: 1,
    reducedMotion: reduit ? 'reduce' : 'no-preference',
  })
  const page = await contexte.newPage()
  const erreurs = []
  page.on('console', (m) => { if (m.type() === 'error') erreurs.push(`console : ${m.text()}`) })
  page.on('pageerror', (e) => erreurs.push(`script : ${e.message}`))
  page.on('requestfailed', (r) => erreurs.push(`requête échouée : ${r.url()}`))
  await page.goto(url, { waitUntil: 'networkidle' })
  await attendrePolices(page)
  return { page, contexte, erreurs }
}

/** Positions des sections dans la page (pour exclure la palette de la mesure d'ambre). */
export function lireSections(page) {
  return page.evaluate(() =>
    [...document.querySelectorAll('.section')].map((s) => {
      const r = s.getBoundingClientRect()
      return { id: s.id, haut: Math.round(r.top + scrollY), bas: Math.round(r.bottom + scrollY) }
    }),
  )
}
