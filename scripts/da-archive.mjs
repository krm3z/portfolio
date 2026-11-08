// Archive d'un tour de vérification pour le making-of (dossiers commités : avant/, intermediaire/, apres/).
// Pleines pages en JPEG qualité 85 (le grain empêche le PNG de se compresser) ; premiers écrans, mouvement réduit
// et planches de focus en PNG. Les PNG bruts restent dans brut/, ignoré par git.
//
// Usage : node scripts/da-archive.mjs --tour 2 --vers apres
import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { PNG } from 'pngjs'
import { erreur, journal } from './lib/journal.mjs'
import { lancerNavigateur } from './lib/navigateur.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const racine = process.cwd()
const argument = (nom) => process.argv[process.argv.indexOf(`--${nom}`) + 1]
const tour = String(Number(argument('tour') || 0)).padStart(2, '0')
const vers = argument('vers')
if (!['avant', 'intermediaire', 'apres'].includes(vers)) {
  erreur('Indique la destination : --vers avant | intermediaire | apres')
  process.exit(1)
}
const source = join(racine, 'making-of', 'phase-01', 'brut', `tour-${tour}`)
const destination = join(racine, 'making-of', 'phase-01', vers)

/**
 * Place un PNG dans une page, à sa taille réelle, et l'enregistre en JPEG pleine hauteur.
 * (Ouvert seul, Chromium réduirait l'image pour la faire tenir dans la fenêtre.)
 */
async function versJpeg(navigateur, url, nom, jpg) {
  const { width, height } = PNG.sync.read(readFileSync(join(source, nom)))
  const page = await navigateur.newPage({ viewport: { width, height: 900 } })
  await page.setContent(`<style>html, body { margin: 0; background: #0E0F11; } img { display: block; }</style><img src="${url}${nom}" width="${width}" height="${height}" alt="">`, { waitUntil: 'load' })
  await page.screenshot({ path: jpg, type: 'jpeg', quality: 85, fullPage: true })
  await page.close()
}

async function principal() {
  mkdirSync(destination, { recursive: true })
  const serveur = await demarrerServeur(source, 4311)
  const navigateur = await lancerNavigateur()
  try {
    for (const format of ['1440', '390']) {
      const nom = `pleine-${format}.png`
      if (existsSync(join(source, nom))) await versJpeg(navigateur, serveur.url, nom, join(destination, `pleine-${format}.jpg`))
    }
  } finally {
    await navigateur.close()
    await serveur.fermer()
  }
  const copies = ['ecran-1440.png', 'ecran-390.png', 'reduit-ecran-1440.png', 'reduit-mouvement-1440.png', 'focus-1440.png', 'focus-390.png']
  for (const nom of copies) if (existsSync(join(source, nom))) copyFileSync(join(source, nom), join(destination, nom))
  journal(`✓ Tour ${tour} archivé dans making-of/phase-01/${vers}/`)
}

principal().catch((e) => {
  erreur(`Échec de l'archive : ${e.stack ?? e.message}`)
  process.exit(1)
})
