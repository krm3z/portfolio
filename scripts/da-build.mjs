// Assemble design/direction-artistique.html (un seul fichier, CSS et JS inclus) à partir de design/src/.
// Le build échoue si la page contient une erreur visible : valeur « undefined », id en double,
// script qui ne compile pas, import/export oublié, caractère « & » non échappé.
//
// Usage : npm run da:build
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import vm from 'node:vm'
import { gzipSync } from 'node:zlib'
import { construirePage } from '../design/src/page/page.mjs'
import { erreur, journal } from './lib/journal.mjs'

/** Contrôles de la page assemblée ; renvoie la liste des problèmes trouvés. */
export function verifierPage(html, js) {
  const problemes = []
  const corps = html.slice(html.indexOf('<body'), html.lastIndexOf('<script'))
  for (const motif of ['undefined', 'NaN', '[object Object]']) {
    if (corps.includes(motif)) problemes.push(`« ${motif} » apparaît dans la page`)
  }
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  const doublons = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))]
  if (doublons.length) problemes.push(`id en double : ${doublons.join(', ')}`)
  try {
    new vm.Script(js)
  } catch (e) {
    problemes.push(`le script ne compile pas : ${e.message}`)
  }
  if (/^\s*(import|export)\s/m.test(js)) problemes.push('import ou export resté dans le script de la page')
  const nu = corps.match(/&(?!(?:[a-z]+|#\d+|#x[0-9a-f]+);)/i)
  if (nu) problemes.push(`« & » non échappé près de : ${corps.slice(Math.max(0, nu.index - 40), nu.index + 20)}`)
  return problemes
}

async function principal() {
  const racine = process.cwd()
  const { html, js } = await construirePage(racine)
  const problemes = verifierPage(html, js)
  if (problemes.length) {
    problemes.forEach((p) => erreur(`✗ ${p}`))
    process.exit(1)
  }
  const sortie = join(racine, 'design', 'direction-artistique.html')
  writeFileSync(sortie, html)
  const ko = (n) => `${(n / 1024).toFixed(0)} Ko`
  journal(`✓ design/direction-artistique.html · ${ko(Buffer.byteLength(html))} (${ko(gzipSync(html).length)} compressé)`)
}

principal().catch((e) => {
  erreur(`Échec de l'assemblage : ${e.stack ?? e.message}`)
  process.exit(1)
})
