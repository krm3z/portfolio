// Exporte les 4 ambiances en PNG 1200 × 675 (making-of/phase-01/ambiances/) et mesure le contraste du micro-texte.
// Deux mesures par zone, car la première seule s'est montrée trompeuse :
//  - « prévu » : la couleur déclarée du texte face au fond (image capturée sans le texte, 5e centile) ;
//    c'est la méthode WCAG ;
//  - « rendu » : les pixels réellement dessinés face au même fond. Un micro-texte trop fin (traits plus
//    minces qu'un pixel) ne reçoit jamais sa couleur pleine : sa couleur prévue peut passer 4,5:1 alors qu'à
//    l'œil il disparaît. On garde le 90e centile des pixels touchés par le texte (ses traits les plus nets).
//
// Usage : node scripts/da-ambiances.mjs
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PNG } from 'pngjs'
import { ratioContraste } from '../design/src/lib/contraste.mjs'
import { hexVersRgb } from '../design/src/lib/couleur.mjs'
import { lireTokens } from '../design/src/lib/tokens.mjs'
import { ZONES } from '../design/src/svg/paysage.mjs'
import { erreur, journal } from './lib/journal.mjs'
import { attendrePolices, lancerNavigateur } from './lib/navigateur.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const racine = process.cwd()
const sortie = join(racine, 'making-of', 'phase-01', 'ambiances')
const rapports = join(racine, 'making-of', 'phase-01', 'rapports')
const ambiance = JSON.parse(readFileSync(join(racine, 'design', 'ambiance.json'), 'utf8'))
const tokens = lireTokens(readFileSync(join(racine, 'design', 'tokens.css'), 'utf8'))
const ETATS = { jour: ambiance.jour, ...ambiance.candidates }
const SEUIL_TRAIT = 1.1 // un pixel appartient au texte si l'écart avec le fond dépasse 1,1:1

const pixel = (png, x, y) => {
  const i = (y * png.width + x) * 4
  return { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] }
}
const centile = (valeurs, c) => {
  const tri = [...valeurs].sort((a, b) => a - b)
  return tri.length ? Number(tri[Math.min(tri.length - 1, Math.floor(tri.length * c))].toFixed(2)) : null
}

/** Contraste « prévu » : couleur déclarée du texte face au fond sans texte, 5e centile de la zone. */
function contrastePrevu(sansTexte, zone, couleurTexte) {
  const texte = hexVersRgb(couleurTexte)
  const ratios = []
  for (let y = zone.y; y < zone.y + zone.h; y++) {
    for (let x = zone.x; x < zone.x + zone.l; x++) ratios.push(ratioContraste(texte, pixel(sansTexte, x, y)))
  }
  return centile(ratios, 0.05)
}

/** Contraste « rendu » : pixels dessinés par le texte face au même pixel sans texte, 90e centile des traits. */
function contrasteRendu(avecTexte, sansTexte, zone) {
  const ratios = []
  for (let y = zone.y; y < zone.y + zone.h; y++) {
    for (let x = zone.x; x < zone.x + zone.l; x++) {
      const r = ratioContraste(pixel(avecTexte, x, y), pixel(sansTexte, x, y))
      if (r >= SEUIL_TRAIT) ratios.push(r)
    }
  }
  return centile(ratios, 0.9)
}

async function principal() {
  mkdirSync(sortie, { recursive: true })
  mkdirSync(rapports, { recursive: true })
  const serveur = await demarrerServeur(join(racine, 'design'))
  const navigateur = await lancerNavigateur()
  const resultats = {}
  try {
    const contexte = await navigateur.newContext({ viewport: { width: 1200, height: 675 }, deviceScaleFactor: 1 })
    const page = await contexte.newPage()
    const erreurs = []
    page.on('pageerror', (e) => erreurs.push(e.message))
    for (const [id, etat] of Object.entries(ETATS)) {
      await page.goto(`${serveur.url}?capture=1&export=${id}`, { waitUntil: 'networkidle' })
      await attendrePolices(page)
      const fichier = join(sortie, `${id}.png`)
      await page.screenshot({ path: fichier })
      const avecTexte = PNG.sync.read(readFileSync(fichier))
      await page.goto(`${serveur.url}?capture=1&export=${id}&ui=0`, { waitUntil: 'networkidle' })
      await attendrePolices(page)
      const sansTexte = PNG.sync.read(await page.screenshot())
      const { haut, bas } = etat.interface.texte
      const mesures = {
        haut: { couleur: haut, prevu: contrastePrevu(sansTexte, ZONES.haut, tokens[haut]), rendu: contrasteRendu(avecTexte, sansTexte, ZONES.haut) },
        bas: { couleur: bas, prevu: contrastePrevu(sansTexte, ZONES.bas, tokens[bas]), rendu: contrasteRendu(avecTexte, sansTexte, ZONES.bas) },
      }
      resultats[id] = mesures
      journal(`✓ ${id}.png · en haut ${haut} : prévu ${mesures.haut.prevu}:1, rendu ${mesures.haut.rendu}:1 · en bas ${bas} : prévu ${mesures.bas.prevu}:1, rendu ${mesures.bas.rendu}:1`)
    }
    if (erreurs.length) throw new Error(erreurs.join(' | '))
  } finally {
    await navigateur.close()
    await serveur.fermer()
  }
  writeFileSync(join(rapports, 'ambiances-contraste.json'), `${JSON.stringify(resultats, null, 2)}\n`)
}

principal().catch((e) => {
  erreur(`Échec de l'export des ambiances : ${e.stack ?? e.message}`)
  process.exit(1)
})
