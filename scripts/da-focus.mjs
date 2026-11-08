// Vérification du focus clavier de la page DA, à 1440 et à 390 px (plan, section 7 « Focus clavier ») :
//  1. la liste des éléments focalisables, dans l'ordre de la page ;
//  2. la tabulation jusqu'au bout, puis quelques retours : même suite, aucun piège ;
//  3. pour chaque élément : contour plein de 2 px, ambre, décalé de 3 px (les écarts sont listés) ;
//  4. jamais rogné par un parent ni masqué par un autre élément ;
//  5. contraste de l'anneau ≥ 3:1 face aux pixels voisins, mesuré sur la capture ;
//  6. les actions au clavier (accordéon, filtres, copie, son, pause, Rejouer, interrupteurs, lien d'évitement) ;
//  7. une planche réunit les captures de focus.
// Sorties : making-of/phase-01/brut/tour-NN/focus-<format>.png et rapports/focus-tour-NN.json.
//
// Usage : node scripts/da-focus.mjs --tour 1
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PNG } from 'pngjs'
import { ratioContraste } from '../design/src/lib/contraste.mjs'
import { erreur, journal } from './lib/journal.mjs'
import { attendrePolices, FORMATS, lancerNavigateur } from './lib/navigateur.mjs'
import { demarrerServeur } from './lib/serveur.mjs'

const racine = process.cwd()
const tour = String(Number(process.argv[process.argv.indexOf('--tour') + 1] || 0)).padStart(2, '0')
const sortie = join(racine, 'making-of', 'phase-01', 'brut', `tour-${tour}`)
const rapports = join(racine, 'making-of', 'phase-01', 'rapports')
const AMBRE = 'rgb(242, 163, 58)'
const MARGE = 8 // px autour de l'anneau dans chaque capture
const VIGNETTE = 150 // côté d'une case de la planche

/** Exécuté dans la page : décrit l'élément qui a le focus (styles de l'anneau, rognage, masquage). */
function decrireFocus() {
  const actif = document.activeElement
  if (!actif || actif === document.body || actif === document.documentElement) return { id: null }
  // L'anneau peut être porté par un parent (cadre qui défile : l'anneau est sur la scène qui l'entoure).
  let el = actif
  while (getComputedStyle(el).outlineStyle === 'none' && el.parentElement && el.parentElement !== document.body) el = el.parentElement
  if (getComputedStyle(el).outlineStyle === 'none') el = actif
  const cs = getComputedStyle(el)
  const r = el.getBoundingClientRect()
  const offset = parseFloat(cs.outlineOffset) || 0
  const largeur = parseFloat(cs.outlineWidth) || 0
  const ext = offset + largeur
  const anneau = { x: r.left - ext, y: r.top - ext, l: r.width + 2 * ext, h: r.height + 2 * ext }
  let rogne = null
  for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
    const s = getComputedStyle(a)
    if (!/(hidden|clip|auto|scroll)/.test(`${s.overflowX} ${s.overflowY}`)) continue
    const p = a.getBoundingClientRect()
    const dedans = anneau.x >= p.left - 0.5 && anneau.y >= p.top - 0.5 && anneau.x + anneau.l <= p.right + 0.5 && anneau.y + anneau.h <= p.bottom + 0.5
    if (!dedans) { rogne = `${a.tagName.toLowerCase()}.${String(a.className).split(' ')[0]}`; break }
  }
  const cx = Math.min(innerWidth - 1, Math.max(0, r.left + Math.min(r.width / 2, 12)))
  const cy = Math.min(innerHeight - 1, Math.max(0, r.top + r.height / 2))
  const dessus = document.elementFromPoint(cx, cy)
  const masque = dessus && !(el === dessus || el.contains(dessus) || dessus.contains(el)) ? `${dessus.tagName.toLowerCase()}.${String(dessus.className).split(' ')[0]}` : null
  const nom = (el.getAttribute('aria-label') || el.textContent || el.tagName).trim().replace(/\s+/g, ' ').slice(0, 50)
  return {
    id: actif.dataset.focusId ?? 'inconnu', balise: actif.tagName.toLowerCase(), porteur: el === actif ? null : el.className, nom, section: actif.closest('.section')?.id ?? 'page',
    style: cs.outlineStyle, largeur, couleur: cs.outlineColor, offset, anneau, rect: { x: r.left, y: r.top, l: r.width, h: r.height },
    rogne, masque, visible: r.bottom > 0 && r.top < innerHeight,
  }
}

/** Médiane d'une liste de couleurs, canal par canal. */
function mediane(couleurs) {
  const canal = (c) => couleurs.map((x) => x[c]).sort((a, b) => a - b)[Math.floor(couleurs.length / 2)]
  return { r: canal('r'), g: canal('g'), b: canal('b') }
}

/**
 * Contraste de l'anneau sur la capture : pixels au milieu du contour, comparés aux pixels juste dehors
 * et à ceux de l'espace entre l'élément et le contour. On échantillonne le milieu des quatre côtés.
 */
function contrasteAnneau(png, fiche, clip) {
  const pixel = (x, y) => {
    const px = Math.floor(x - clip.x) // le pixel k couvre [k, k + 1)
    const py = Math.floor(y - clip.y)
    if (px < 0 || py < 0 || px >= png.width || py >= png.height) return null
    const i = (py * png.width + px) * 4
    return { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2] }
  }
  const { rect, offset, largeur } = fiche
  // dehors : le pixel juste après le contour (sur fond clair, c'est le liseré night de 1 px) ; dedans : l'espace de 3 px.
  const bandes = { anneau: offset + largeur / 2, dehors: offset + largeur + 0.5, ...(offset > 0 ? { dedans: offset / 2 } : {}) }
  const mesures = {}
  for (const [nom, d] of Object.entries(bandes)) {
    const points = []
    // Seulement les côtés droits : les bouts d'une pilule sont arrondis et fausseraient l'échantillon.
    const horizontaux = []
    const verticaux = []
    for (let t = 0.3; t <= 0.7; t += 0.05) {
      horizontaux.push(pixel(rect.x + rect.l * t, rect.y - d), pixel(rect.x + rect.l * t, rect.y + rect.h + d))
      verticaux.push(pixel(rect.x - d, rect.y + rect.h * t), pixel(rect.x + rect.l + d, rect.y + rect.h * t))
    }
    // Côtés longs d'abord ; si l'élément dépasse de l'écran (grand tableau), on prend les autres côtés.
    const [premiers, seconds] = rect.l >= rect.h ? [horizontaux, verticaux] : [verticaux, horizontaux]
    points.push(...(premiers.some(Boolean) ? premiers : seconds))
    const valides = points.filter(Boolean)
    if (valides.length) mesures[nom] = mediane(valides)
  }
  if (!mesures.anneau) return { dehors: null, dedans: null, retenu: null } // anneau hors de la capture : non mesuré
  const ratio = (nom) => (mesures[nom] ? Number(ratioContraste(mesures.anneau, mesures[nom]).toFixed(2)) : null)
  const dehors = ratio('dehors')
  const dedans = ratio('dedans')
  // Un anneau en deux tons (ambre + liseré night sur fond clair) est lisible si au moins un de ses bords atteint 3:1.
  return { dehors, dedans, retenu: Math.max(dehors ?? 0, dedans ?? 0) }
}

/** Assemble les captures de focus en planche (cases de 150 px, 10 par ligne). */
function planche(images) {
  const parLigne = 10
  const lignes = Math.ceil(images.length / parLigne)
  const sortiePng = new PNG({ width: parLigne * VIGNETTE, height: lignes * VIGNETTE })
  sortiePng.data.fill(0)
  images.forEach((img, k) => {
    // réduction simple au plus proche voisin pour tenir dans la case
    const echelle = Math.min(1, (VIGNETTE - 6) / img.width, (VIGNETTE - 6) / img.height)
    const l = Math.max(1, Math.floor(img.width * echelle))
    const h = Math.max(1, Math.floor(img.height * echelle))
    const ox = (k % parLigne) * VIGNETTE + Math.floor((VIGNETTE - l) / 2)
    const oy = Math.floor(k / parLigne) * VIGNETTE + Math.floor((VIGNETTE - h) / 2)
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < l; x++) {
        const si = (Math.floor(y / echelle) * img.width + Math.floor(x / echelle)) * 4
        const di = ((oy + y) * sortiePng.width + ox + x) * 4
        sortiePng.data.set(img.data.subarray(si, si + 4), di)
      }
    }
  })
  return sortiePng
}

async function parcourir(page, format) {
  const attendus = await page.evaluate(() => {
    const selecteur = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])'
    const liste = [...document.querySelectorAll(selecteur)].filter((el) => el.tabIndex >= 0 && el.checkVisibility({ checkVisibilityCSS: true }) && !el.closest('[inert]'))
    liste.forEach((el, i) => { el.dataset.focusId = String(i) })
    return liste.map((el) => el.dataset.focusId)
  })
  await page.evaluate(() => { document.activeElement?.blur(); window.scrollTo(0, 0) })
  const fiches = []
  const images = []
  for (let k = 0; k < attendus.length + 2; k++) {
    await page.keyboard.press('Tab')
    const fiche = await page.evaluate(decrireFocus)
    if (fiche.id === null || (fiches.length && fiche.id === fiches[0].id)) break
    const clip = {
      x: Math.max(0, Math.floor(fiche.anneau.x - MARGE)),
      y: Math.max(0, Math.floor(fiche.anneau.y - MARGE)),
    }
    clip.width = Math.max(1, Math.min(format.largeur - clip.x, Math.ceil(fiche.anneau.l + 2 * MARGE)))
    clip.height = Math.max(1, Math.min(format.hauteur - clip.y, Math.ceil(fiche.anneau.h + 2 * MARGE)))
    const png = PNG.sync.read(await page.screenshot({ clip }))
    fiche.contraste = contrasteAnneau(png, fiche, clip)
    fiches.push(fiche)
    images.push(png)
  }
  // Retours : quelques Maj+Tab depuis la fin doivent remonter la même suite.
  const retours = []
  for (let k = 0; k < 5; k++) {
    await page.keyboard.press('Shift+Tab')
    retours.push((await page.evaluate(decrireFocus)).id)
  }
  const ordre = fiches.map((f) => f.id)
  return { attendus, ordre, retours, fiches, images }
}

/**
 * Appuie sur une touche et compare un attribut avant et après (bouton à deux états).
 * Le sélecteur doit rester stable : on ne cible pas l'attribut qui change.
 */
async function basculer(page, selecteur, attribut, touche = 'Enter') {
  const cible = page.locator(selecteur).first()
  const avant = await cible.getAttribute(attribut)
  await cible.focus()
  await page.keyboard.press(touche)
  const apres = await cible.getAttribute(attribut)
  return { ok: avant !== apres, detail: `${avant} → ${apres}` }
}

/** Les actions au clavier à vérifier : chaque test renvoie { ok, detail }. */
const TESTS_CLAVIER = [
  ['Lien d’évitement → contenu', async (page) => {
    await page.reload({ waitUntil: 'networkidle' }) // repart du début de la page pour la tabulation
    await page.keyboard.press('Tab')
    const premier = await page.evaluate(() => document.activeElement.className)
    await page.keyboard.press('Enter')
    const actif = await page.evaluate(() => document.activeElement.id)
    return { ok: premier.includes('evitement') && actif === 'contenu', detail: `premier : ${premier}, puis : ${actif}` }
  }],
  ['Accordéon : Entrée ouvre et ferme', (page) => basculer(page, '[data-demo="accordeon"]', 'aria-expanded')],
  ['Filtre : Espace change l’état', async (page) => {
    const cle = await page.locator('[data-demo="filtre"][aria-pressed="false"]').first().getAttribute('data-cle')
    return basculer(page, `[data-demo="filtre"][data-cle="${cle}"]`, 'aria-pressed', 'Space')
  }],
  ['Copie de l’email annoncée', async (page) => {
    const bouton = page.locator('[data-demo="copier"]:visible').first()
    if (!(await bouton.count())) return { ok: true, detail: 'sans objet à cette largeur : l’adresse est dans le menu' }
    await bouton.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(150)
    const annonce = (await page.locator('#annonces').textContent())?.trim()
    return { ok: Boolean(annonce), detail: annonce }
  }],
  ['Son : le libellé change', (page) => basculer(page, '[data-demo="son"]', 'aria-label')],
  ['Pause : l’état change', (page) => basculer(page, '[data-demo="pause"]', 'aria-pressed')],
  ['Rejouer (démo a) lance des animations', async (page) => {
    await page.locator('[data-anim="a"] .demo__rejouer').focus()
    await page.keyboard.press('Enter')
    const n = await page.evaluate(() => document.querySelector('[data-anim="a"]').getAnimations({ subtree: true }).length)
    return { ok: n > 0, detail: `${n} animations` }
  }],
  ['Interrupteur « Mouvement réduit » (démo f)', (page) => basculer(page, '[data-anim="f"] .demo__bascule', 'aria-pressed', 'Space')],
]

/** Lance les tests au clavier ; une erreur dans un test devient un échec, sans arrêter les autres. */
async function actionsClavier(page) {
  const resultats = []
  for (const [nom, test] of TESTS_CLAVIER) {
    try {
      resultats.push({ nom, ...(await test(page)) })
    } catch (e) {
      resultats.push({ nom, ok: false, detail: e.message })
    }
  }
  return resultats
}

async function verifierFormat(navigateur, url, format) {
  const contexte = await navigateur.newContext({
    viewport: { width: format.largeur, height: format.hauteur }, deviceScaleFactor: 1,
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await contexte.newPage()
  const erreurs = []
  page.on('pageerror', (e) => erreurs.push(e.message))
  await page.goto(`${url}?capture=1`, { waitUntil: 'networkidle' })
  await attendrePolices(page)
  const parcours = await parcourir(page, format)
  writeFileSync(join(sortie, `focus-${format.nom}.png`), PNG.sync.write(planche(parcours.images)))
  const actions = await actionsClavier(page)
  await contexte.close()

  const ecarts = parcours.fiches.filter((f) => f.style !== 'solid' || f.largeur !== 2 || f.couleur !== AMBRE || f.offset !== 3)
  const problemes = parcours.fiches.filter((f) => f.rogne || f.masque || !f.visible || !(f.contraste.retenu >= 3))
  const memeSuite = JSON.stringify(parcours.ordre) === JSON.stringify(parcours.attendus)
  // La boucle s'arrête quand le focus sort de la page : le premier Maj+Tab revient sur le dernier élément.
  const retoursOk = JSON.stringify(parcours.retours) === JSON.stringify(parcours.ordre.slice(-5).reverse())
  return {
    format: format.nom, focalisables: parcours.attendus.length, atteints: parcours.ordre.length,
    ordre: { memeSuiteQueLeDom: memeSuite, retoursOk },
    ecartsDeStyle: ecarts.map(({ id, nom, section, style, largeur, couleur, offset }) => ({ id, nom, section, style, largeur, couleur, offset })),
    problemes: problemes.map(({ id, nom, section, rogne, masque, visible, contraste }) => ({ id, nom, section, rogne, masque, visible, contraste })),
    contrasteMin: Math.min(...parcours.fiches.map((f) => f.contraste.retenu ?? 0)),
    actions, erreurs,
  }
}

async function principal() {
  mkdirSync(sortie, { recursive: true })
  mkdirSync(rapports, { recursive: true })
  const serveur = await demarrerServeur(join(racine, 'design'))
  const navigateur = await lancerNavigateur()
  const resultats = []
  try {
    for (const format of Object.values(FORMATS)) resultats.push(await verifierFormat(navigateur, serveur.url, format))
  } finally {
    await navigateur.close()
    await serveur.fermer()
  }
  writeFileSync(join(rapports, `focus-tour-${tour}.json`), `${JSON.stringify(resultats, null, 2)}\n`)
  for (const r of resultats) {
    journal(`[${r.format}] ${r.atteints}/${r.focalisables} atteints · ordre DOM ${r.ordre.memeSuiteQueLeDom ? 'oui' : 'NON'} · retours ${r.ordre.retoursOk ? 'oui' : 'NON'} · écarts de style ${r.ecartsDeStyle.length} · problèmes ${r.problemes.length} · contraste min ${r.contrasteMin}:1`)
    for (const a of r.actions) journal(`   ${a.ok ? '✓' : '✗'} ${a.nom} (${a.detail})`)
  }
}

principal().catch((e) => {
  erreur(`Échec de la vérification du focus : ${e.stack ?? e.message}`)
  process.exit(1)
})
