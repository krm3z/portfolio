// Captures de la page DA pour un tour de vérification.
// Produit, dans making-of/phase-01/brut/tour-NN/ :
//   - pleine page à 1440 et 390 px (PNG sans perte, pour la mesure d'ambre) ;
//   - premier écran 1440 × 900 et 390 × 844 ;
//   - une capture par section à 1440 et 390 px ;
//   - premier écran et section Mouvement en mouvement réduit ;
//   - sections.json : position de chaque section.
// La page est ouverte en mode ?capture=1 (états finaux, boucles arrêtées, neige figée).
//
// Usage : npm run da:captures -- --tour 1
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { erreur, journal } from './lib/journal.mjs'
import { FORMATS, lancerNavigateur, lireSections, ouvrirPage } from './lib/navigateur.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const racine = process.cwd()
const tour = String(Number(process.argv[process.argv.indexOf('--tour') + 1] || 0)).padStart(2, '0')
const sortie = join(racine, 'making-of', 'phase-01', 'brut', `tour-${tour}`)

async function capturerFormat(navigateur, url, format) {
  const { page, contexte, erreurs } = await ouvrirPage(navigateur, `${url}?capture=1`, format)
  const dossierSections = join(sortie, 'sections', format.nom)
  mkdirSync(dossierSections, { recursive: true })

  await page.screenshot({ path: join(sortie, `ecran-${format.nom}.png`) })
  await page.screenshot({ path: join(sortie, `pleine-${format.nom}.png`), fullPage: true })

  // Captures par section, sans les éléments fixes (index, grain plein écran) qui se répéteraient.
  await page.evaluate(() => document.documentElement.classList.add('sans-fixes'))
  const sections = await lireSections(page)
  for (const s of sections) {
    await page.locator(`#${s.id}`).screenshot({ path: join(dossierSections, `${s.id}.png`) })
  }
  await contexte.close()
  return { sections, erreurs }
}

async function capturerReduit(navigateur, url) {
  const { page, contexte, erreurs } = await ouvrirPage(navigateur, `${url}?capture=1`, FORMATS.ordinateur, { reduit: true })
  await page.screenshot({ path: join(sortie, 'reduit-ecran-1440.png') })
  await page.evaluate(() => document.documentElement.classList.add('sans-fixes'))
  await page.locator('#mouvement').screenshot({ path: join(sortie, 'reduit-mouvement-1440.png') })
  await contexte.close()
  return erreurs
}

async function principal() {
  mkdirSync(sortie, { recursive: true })
  const serveur = await demarrerServeur(join(racine, 'design'))
  const navigateur = await lancerNavigateur()
  const erreurs = []
  const positions = {}
  try {
    for (const format of Object.values(FORMATS)) {
      const resultat = await capturerFormat(navigateur, serveur.url, format)
      positions[format.nom] = resultat.sections
      erreurs.push(...resultat.erreurs.map((e) => `[${format.nom}] ${e}`))
    }
    erreurs.push(...(await capturerReduit(navigateur, serveur.url)).map((e) => `[réduit] ${e}`))
  } finally {
    await navigateur.close()
    await serveur.fermer()
  }
  writeFileSync(join(sortie, 'sections.json'), `${JSON.stringify(positions, null, 2)}\n`)
  if (erreurs.length) {
    erreurs.forEach((e) => erreur(`✗ ${e}`))
    process.exit(1)
  }
  journal(`✓ Captures du tour ${tour} dans ${sortie.slice(racine.length + 1)}`)
}

principal().catch((e) => {
  erreur(`Échec des captures : ${e.stack ?? e.message}`)
  process.exit(1)
})
