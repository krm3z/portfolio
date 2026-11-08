// Contrôle automatique d'accessibilité (axe-core) de la page DA, à 1440 et à 390 px.
// Il complète les mesures maison (contrastes des tokens, focus) ; il ne les remplace pas.
// Sortie : making-of/phase-01/rapports/axe-tour-NN.json
//
// Usage : node scripts/da-axe.mjs --tour 1
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import AxeBuilder from '@axe-core/playwright'
import { erreur, journal } from './lib/journal.mjs'
import { FORMATS, lancerNavigateur, ouvrirPage } from './lib/navigateur.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const racine = process.cwd()
const tour = String(Number(process.argv[process.argv.indexOf('--tour') + 1] || 0)).padStart(2, '0')
const rapports = join(racine, 'making-of', 'phase-01', 'rapports')

async function principal() {
  mkdirSync(rapports, { recursive: true })
  const serveur = await demarrerServeur(join(racine, 'design'))
  const navigateur = await lancerNavigateur()
  const resultats = []
  try {
    for (const format of Object.values(FORMATS)) {
      const { page, contexte } = await ouvrirPage(navigateur, `${serveur.url}?capture=1`, format)
      const analyse = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
      resultats.push({
        format: format.nom,
        violations: analyse.violations.map((v) => ({ id: v.id, impact: v.impact, aide: v.help, noeuds: v.nodes.length, exemples: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) })),
        incomplets: analyse.incomplete.map((v) => ({ id: v.id, noeuds: v.nodes.length })),
      })
      await contexte.close()
    }
  } finally {
    await navigateur.close()
    await serveur.fermer()
  }
  writeFileSync(join(rapports, `axe-tour-${tour}.json`), `${JSON.stringify(resultats, null, 2)}\n`)
  for (const r of resultats) {
    journal(`[${r.format}] ${r.violations.length} violation(s), ${r.incomplets.length} point(s) à vérifier à la main`)
    for (const v of r.violations) journal(`   ✗ ${v.id} (${v.impact}, ${v.noeuds} nœud(s)) : ${v.aide} — ${v.exemples.join(' | ')}`)
  }
}

principal().catch((e) => {
  erreur(`Échec du contrôle axe : ${e.stack ?? e.message}`)
  process.exit(1)
})
