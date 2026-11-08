// Planches de mouvement pour le making-of : pour chaque démo de la section 10, 5 instants côte à côte
// (0, 25, 50, 75 et 100 % de sa durée), puis une vidéo des huit démos rejouées l'une après l'autre.
// Sorties : making-of/phase-01/mouvement/demo-<lettre>.png et demos.webm.
//
// Usage : node scripts/da-mouvement.mjs
import { mkdirSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PNG } from 'pngjs'
import { erreur, journal } from './lib/journal.mjs'
import { attendrePolices, lancerNavigateur } from './lib/navigateur.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const racine = process.cwd()
const sortie = join(racine, 'making-of', 'phase-01', 'mouvement')
const INSTANTS = [0, 0.25, 0.5, 0.75, 1]
const ECART = 8 // px entre deux instants
const FOND = [22, 23, 26] // --night-2
// Temps laissé à chaque démo dans la vidéo (ms) : la boucle g fait deux tours, la timeline h défile 3 s.
const ATTENTE = { g: 6200, h: 3600 }

/** Colle des images de même hauteur côte à côte, séparées par un fond night-2. */
function assembler(images) {
  const hauteur = Math.max(...images.map((i) => i.height))
  const largeur = images.reduce((s, i) => s + i.width, 0) + ECART * (images.length - 1)
  const planche = new PNG({ width: largeur, height: hauteur })
  for (let p = 0; p < planche.data.length; p += 4) planche.data.set([...FOND, 255], p)
  let x = 0
  for (const image of images) {
    PNG.bitblt(image, planche, 0, 0, image.width, image.height, x, 0)
    x += image.width + ECART
  }
  return planche
}

async function ouvrir(contexte, url) {
  const page = await contexte.newPage()
  const erreurs = []
  page.on('pageerror', (e) => erreurs.push(e.message))
  await page.goto(`${url}?mouvement=normal`, { waitUntil: 'networkidle' })
  await attendrePolices(page)
  return { page, erreurs }
}

async function planches(navigateur, url) {
  const contexte = await navigateur.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 })
  const { page, erreurs } = await ouvrir(contexte, url)
  await page.evaluate(() => document.documentElement.classList.add('sans-fixes'))
  const ids = await page.evaluate(() => window.daMouvement.ids())
  for (const id of ids) {
    const scene = page.locator(`[data-anim="${id}"] .demo__scene`)
    await scene.evaluate((el) => el.scrollIntoView({ block: 'center' }))
    // La première lecture automatique doit avoir eu lieu avant de figer, sinon elle rejouerait la démo par-dessus.
    await page.waitForFunction((lettre) => !document.querySelector(`[data-anim="${lettre}"].demo--attente`), id, { timeout: 3000 })
    const images = []
    for (const fraction of INSTANTS) {
      await page.evaluate(([lettre, f]) => window.daMouvement.figer(lettre, f), [id, fraction])
      images.push(PNG.sync.read(await scene.screenshot()))
    }
    writeFileSync(join(sortie, `demo-${id}.png`), PNG.sync.write(assembler(images)))
    journal(`✓ demo-${id}.png`)
  }
  await contexte.close()
  return { ids, erreurs }
}

async function video(navigateur, url, ids) {
  const brut = join(sortie, 'video-brute')
  const contexte = await navigateur.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: brut, size: { width: 1440, height: 900 } } })
  const { page, erreurs } = await ouvrir(contexte, url)
  for (const id of ids) {
    const demo = page.locator(`[data-anim="${id}"]`)
    await demo.evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await page.waitForTimeout(500)
    await demo.locator('.demo__rejouer').click()
    await page.waitForTimeout(ATTENTE[id] ?? 1800)
  }
  const chemin = await page.video().path()
  await contexte.close()
  renameSync(chemin, join(sortie, 'demos.webm'))
  rmSync(brut, { recursive: true, force: true })
  journal('✓ demos.webm')
  return erreurs
}

async function principal() {
  mkdirSync(sortie, { recursive: true })
  const serveur = await demarrerServeur(join(racine, 'design'))
  const navigateur = await lancerNavigateur()
  try {
    const { ids, erreurs } = await planches(navigateur, serveur.url)
    erreurs.push(...(await video(navigateur, serveur.url, ids)))
    if (erreurs.length) throw new Error(erreurs.join(' | '))
  } finally {
    await navigateur.close()
    await serveur.fermer()
  }
}

principal().catch((e) => {
  erreur(`Échec des planches de mouvement : ${e.stack ?? e.message}`)
  process.exit(1)
})
