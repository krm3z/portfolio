// Mesure de la part d'ambre sur les captures pleine page d'un tour (règle de la DA : 5 % maximum).
// On compte les pixels « ambre » et « teinte ambre » (halos, fonds ambrés), hors section palette.
// Sorties : pourcentage global, maximum sur une hauteur d'écran, pourcentage par section,
// dans making-of/phase-01/rapports/ambre-tour-NN.json.
//
// Usage : npm run da:ambre -- --tour 1      (ou --etalonnage pour vérifier la mesure sur une page de test)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PNG } from 'pngjs'
import { classerPixel, compterAmbre, pourcentages } from '../design/src/lib/ambre.mjs'
import { erreur, journal } from './lib/journal.mjs'
import { lancerNavigateur } from './lib/navigateur.mjs'

const racine = process.cwd()
const arg = (nom) => process.argv[process.argv.indexOf(nom) + 1]
const OBJECTIF = 5

/** Compte ligne par ligne : renvoie deux tableaux (ambre, teinte) d'une case par ligne. */
function compterParLigne({ data, width, height }) {
  const ambre = new Uint32Array(height)
  const teinte = new Uint32Array(height)
  for (let y = 0; y < height; y++) {
    let i = y * width * 4
    for (let x = 0; x < width; x++, i += 4) {
      const c = classerPixel(data[i], data[i + 1], data[i + 2])
      if (c === 'ambre') ambre[y]++
      else if (c === 'teinte') teinte[y]++
    }
  }
  return { ambre, teinte }
}

/** Analyse une capture : global hors palette, pire fenêtre d'un écran, détail par section. */
function analyser(png, sections, hauteurEcran) {
  const { ambre, teinte } = compterParLigne(png)
  const palette = sections.find((s) => s.id === 'palette')
  const lignes = [...Array(png.height).keys()].filter((y) => !palette || y < palette.haut || y >= palette.bas)
  const somme = (liste, tab) => liste.reduce((s, y) => s + tab[y], 0)
  const pct = (liste) => {
    const total = liste.length * png.width
    return total ? Number(((100 * (somme(liste, ambre) + somme(liste, teinte))) / total).toFixed(2)) : 0
  }
  // Fenêtres d'un écran tous les 100 px, plus la dernière (le bas de page) ; une page plus courte qu'un écran
  // forme une seule fenêtre.
  const debuts = []
  for (let debut = 0; debut + hauteurEcran <= lignes.length; debut += 100) debuts.push(debut)
  debuts.push(Math.max(0, lignes.length - hauteurEcran))
  let pire = { pourcentage: 0, haut: lignes[0] ?? 0 }
  for (const debut of debuts) {
    const p = pct(lignes.slice(debut, debut + hauteurEcran))
    if (p > pire.pourcentage) pire = { pourcentage: p, haut: lignes[debut] }
  }
  const sectionDePire = sections.find((s) => pire.haut >= s.haut && pire.haut < s.bas)?.id ?? 'en-tête'
  const parSection = Object.fromEntries(
    sections.map((s) => [s.id, pct([...Array(Math.max(0, Math.min(s.bas, png.height) - s.haut)).keys()].map((k) => k + s.haut))]),
  )
  return {
    horsPalette: {
      ambre: lignes.length ? Number(((100 * somme(lignes, ambre)) / (lignes.length * png.width)).toFixed(2)) : 0,
      teinte: lignes.length ? Number(((100 * somme(lignes, teinte)) / (lignes.length * png.width)).toFixed(2)) : 0,
      somme: pct(lignes),
    },
    pireEcran: { ...pire, section: sectionDePire },
    parSection,
  }
}

async function mesurerTour(tour) {
  const dossier = join(racine, 'making-of', 'phase-01', 'brut', `tour-${tour}`)
  const positions = JSON.parse(readFileSync(join(dossier, 'sections.json'), 'utf8'))
  const rapport = { tour, objectif: `${OBJECTIF} % maximum, hors section palette`, formats: {} }
  for (const [format, hauteurEcran] of [['1440', 900], ['390', 844]]) {
    const png = PNG.sync.read(readFileSync(join(dossier, `pleine-${format}.png`)))
    rapport.formats[format] = analyser(png, positions[format], hauteurEcran)
  }
  const dossierRapports = join(racine, 'making-of', 'phase-01', 'rapports')
  mkdirSync(dossierRapports, { recursive: true })
  writeFileSync(join(dossierRapports, `ambre-tour-${tour}.json`), `${JSON.stringify(rapport, null, 2)}\n`)
  for (const [format, r] of Object.entries(rapport.formats)) {
    const ok = r.horsPalette.somme <= OBJECTIF ? '✓' : '✗'
    journal(`${ok} ${format} px : ${r.horsPalette.somme} % hors palette (ambre ${r.horsPalette.ambre} %, teinte ${r.horsPalette.teinte} %) · pire écran ${r.pireEcran.pourcentage} % (${r.pireEcran.section})`)
  }
}

/** Page de test : un aplat d'ambre de 3,00 %, un texte ambre, un halo, et le grain de la page. */
async function etalonner() {
  const navigateur = await lancerNavigateur()
  try {
    const page = await navigateur.newPage({ viewport: { width: 1000, height: 1000 } })
    await page.setContent(`<body style="margin:0;background:#0E0F11">
      <div style="position:absolute;left:100px;top:100px;width:300px;height:100px;background:#F2A33A"></div>
      <div style="position:fixed;inset:0;opacity:.04;mix-blend-mode:overlay;background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22180%22 height=%22180%22%3E%3Cfilter id=%22g%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3CfeColorMatrix type=%22saturate%22 values=%220%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23g)%22/%3E%3C/svg%3E')"></div>
    </body>`)
    const png = PNG.sync.read(await page.screenshot())
    const { ambre, teinte, total } = compterAmbre(png.data, png.width, png.height)
    const p = pourcentages({ ambre, teinte, total })
    const ok = Math.abs(p.ambre - 3) <= 0.1 && p.teinte <= 0.1
    journal(`${ok ? '✓' : '✗'} Étalonnage : ${p.ambre.toFixed(2)} % d'ambre attendu 3,00 % ± 0,10 (teinte ${p.teinte.toFixed(2)} %)`)
    if (!ok) process.exitCode = 1
  } finally {
    await navigateur.close()
  }
}

const principal = process.argv.includes('--etalonnage') ? etalonner() : mesurerTour(String(Number(arg('--tour') || 0)).padStart(2, '0'))
principal.catch((e) => {
  erreur(`Échec de la mesure d'ambre : ${e.stack ?? e.message}`)
  process.exit(1)
})
