// Capture agrandie d'un élément de la page DA, pour regarder un détail de près (boucle visuelle).
// Usage : node scripts/da-zoom.mjs --selecteur "#matiere .panneau:nth-child(2)" [--format 390] [--echelle 2] [--sortie fichier.png]
// La capture va par défaut dans making-of/phase-01/brut/zoom/.
import { mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { erreur, journal } from './lib/journal.mjs'
import { attendrePolices, FORMATS, lancerNavigateur } from './lib/navigateur.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const argument = (nom, defaut) => {
  const i = process.argv.indexOf(`--${nom}`)
  return i > -1 ? process.argv[i + 1] : defaut
}

const selecteur = argument('selecteur')
if (!selecteur) {
  erreur('Indique un sélecteur : --selecteur "#section .classe"')
  process.exit(1)
}
const format = argument('format', '1440') === '390' ? FORMATS.mobile : FORMATS.ordinateur
const echelle = Number(argument('echelle', 2))
const nomFichier = selecteur.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60)
const sortie = argument('sortie', join('making-of', 'phase-01', 'brut', 'zoom', `${nomFichier}-${format.nom}.png`))

const { url, fermer } = await demarrerServeur(join(process.cwd(), 'design'))
const navigateur = await lancerNavigateur()
try {
  const contexte = await navigateur.newContext({ viewport: { width: format.largeur, height: format.hauteur }, deviceScaleFactor: echelle })
  const page = await contexte.newPage()
  await page.goto(`${url}?capture=1`, { waitUntil: 'networkidle' })
  await attendrePolices(page)
  await page.evaluate(() => document.documentElement.classList.add('sans-fixes'))
  mkdirSync(dirname(sortie), { recursive: true })
  await page.locator(selecteur).first().screenshot({ path: sortie })
  journal(`✓ ${sortie}`)
} finally {
  await navigateur.close()
  await fermer()
}
