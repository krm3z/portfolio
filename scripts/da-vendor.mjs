// Récupère une fois les fichiers tiers de la page de direction artistique
// et note leur origine dans design/src/vendor/sources.json (source, version, licence, empreinte sha256).
// Relancer le script redonne exactement les mêmes fichiers tant que les sources ne changent pas.
//
// Usage : npm run da:vendor
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { chromium } from 'playwright'
import { erreur, journal } from './lib/journal.mjs'

const RACINE = process.cwd()
const VENDOR = join(RACINE, 'design', 'src', 'vendor')
const ICONES = join(VENDOR, 'icons')

const LUCIDE = 'lucide-static@1.70.0'
const LUCIDE_MARQUES = 'lucide-static@0.460.0' // dernière version qui contenait github et linkedin
const SIMPLE_ICONS = 'simple-icons@16.36.0'
const GEIST = 'geist@1.9.2'

const ICONES_LUCIDE = [
  'arrow-right', 'arrow-up-right', 'copy', 'check', 'chevron-down', 'plus', 'mail', 'rotate-ccw',
  'pause', 'play', 'volume-2', 'volume-x', 'menu', 'x', 'grid-3x3', 'database', 'chart-column',
  'sheet', 'workflow', 'bot',
]
const ICONES_MARQUES = ['github', 'linkedin']
const LOGOS = ['python', 'git']

const sources = []

const empreinte = (octets) => createHash('sha256').update(octets).digest('hex')

/** Enregistre un fichier et sa provenance. */
function enregistrer(chemin, octets, provenance) {
  writeFileSync(chemin, octets)
  sources.push({ fichier: chemin.slice(RACINE.length + 1).replaceAll('\\', '/'), ...provenance, sha256: empreinte(octets) })
}

/** Télécharge une adresse et renvoie ses octets ; échoue clairement sinon. */
async function telecharger(adresse) {
  const reponse = await fetch(adresse)
  if (!reponse.ok) throw new Error(`${reponse.status} pour ${adresse}`)
  return Buffer.from(await reponse.arrayBuffer())
}

/** Un SVG tiers ne doit contenir ni script, ni gestionnaire d'événement, ni lien externe. */
function verifierSvg(texte, nom) {
  const interdit = /<script|\son[a-z]+\s*=|href\s*=\s*["']?(https?:|\/\/|javascript:)|<foreignObject/i
  // Lucide place un commentaire de licence avant <svg> : on le garde dans le fichier, on l'ignore ici.
  const debut = texte.replace(/^\s*<!--[\s\S]*?-->\s*/, '')
  if (!debut.startsWith('<svg') || interdit.test(texte)) throw new Error(`SVG refusé : ${nom}`)
  if (texte.length > 20000) throw new Error(`SVG trop lourd : ${nom}`)
}

async function recupererIcones() {
  const lots = [
    { paquet: LUCIDE, noms: ICONES_LUCIDE, chemin: 'icons', licence: 'ISC (Lucide)' },
    { paquet: LUCIDE_MARQUES, noms: ICONES_MARQUES, chemin: 'icons', licence: 'ISC (Lucide)' },
    { paquet: SIMPLE_ICONS, noms: LOGOS, chemin: 'icons', licence: 'CC0-1.0 (Simple Icons) ; marques déposées de leurs propriétaires' },
  ]
  for (const lot of lots) {
    for (const nom of lot.noms) {
      const adresse = `https://cdn.jsdelivr.net/npm/${lot.paquet}/${lot.chemin}/${nom}.svg`
      const texte = (await telecharger(adresse)).toString('utf8')
      verifierSvg(texte, nom)
      const prefixe = lot.paquet.startsWith('simple-icons') ? 'logo-' : ''
      enregistrer(join(ICONES, `${prefixe}${nom}.svg`), Buffer.from(texte), { source: adresse, version: lot.paquet, licence: lot.licence })
    }
  }
}

async function recupererPolices() {
  const adresse = 'https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap'
  const css = (await telecharger(adresse)).toString('utf8')
  // L'API renvoie des adresses sans protocole (//cdn.fontshare.com) : illisibles en file://.
  const propre = css.replaceAll("url('//", "url('https://")
  if (/url\('\/\//.test(propre) || !propre.includes('General Sans')) throw new Error('CSS Fontshare inattendue')
  enregistrer(join(VENDOR, 'general-sans.css'), Buffer.from(propre), {
    source: adresse,
    licence: 'ITF Free Font License (Fontshare) : polices servies par Fontshare, aucun fichier de police dans le dépôt',
  })

  const base = `https://cdn.jsdelivr.net/npm/${GEIST}/dist/fonts/geist-mono`
  const graisses = [
    [400, 'GeistMono-Regular.woff2'],
    [500, 'GeistMono-Medium.woff2'],
  ]
  for (const [, fichier] of graisses) {
    const reponse = await fetch(`${base}/${fichier}`, { method: 'HEAD' })
    if (!reponse.ok) throw new Error(`Geist Mono introuvable : ${fichier}`)
  }
  const faces = graisses
    .map(([poids, fichier]) => `@font-face {\n  font-family: 'Geist Mono';\n  src: url('${base}/${fichier}') format('woff2');\n  font-weight: ${poids};\n  font-style: normal;\n  font-display: swap;\n}`)
    .join('\n')
  enregistrer(join(VENDOR, 'geist-mono.css'), Buffer.from(`/* Geist Mono, paquet npm ${GEIST} */\n${faces}\n`), {
    source: base,
    version: GEIST,
    licence: 'SIL Open Font License 1.1 (Vercel)',
  })
}

/** Récupère le dashboard du projet NASA dans le dépôt de Kerem, puis le réduit en WebP. */
async function recupererDashboardNasa() {
  const png = execFileSync('gh', ['api', '-H', 'Accept: application/vnd.github.raw', 'repos/krm3z/nasa-data-pipeline/contents/docs/missions.png'], {
    maxBuffer: 20 * 1024 * 1024,
  })
  const signature = png.subarray(0, 8).toString('hex')
  if (signature !== '89504e470d0a1a0a') throw new Error('docs/missions.png : signature PNG absente')
  if (png.length > 15 * 1024 * 1024) throw new Error('docs/missions.png : fichier trop lourd')

  const navigateur = await chromium.launch()
  try {
    const page = await navigateur.newPage()
    const dataUrl = `data:image/png;base64,${png.toString('base64')}`
    const resultat = await page.evaluate(async (src) => {
      const image = new Image()
      image.src = src
      await image.decode()
      const largeur = Math.min(1120, image.naturalWidth) // 2 × la largeur d'affichage dans la carte
      const hauteur = Math.round((image.naturalHeight * largeur) / image.naturalWidth)
      const toile = document.createElement('canvas')
      toile.width = largeur
      toile.height = hauteur
      toile.getContext('2d').drawImage(image, 0, 0, largeur, hauteur)
      return { donnees: toile.toDataURL('image/webp', 0.86), largeur, hauteur, origine: [image.naturalWidth, image.naturalHeight] }
    }, dataUrl)
    const webp = Buffer.from(resultat.donnees.split(',')[1], 'base64')
    enregistrer(join(VENDOR, 'nasa-missions.webp'), webp, {
      source: 'github.com/krm3z/nasa-data-pipeline, docs/missions.png (réduit en WebP)',
      licence: 'Projet de Kerem Uysal',
      dimensions: `${resultat.largeur} × ${resultat.hauteur} (origine ${resultat.origine.join(' × ')})`,
    })
  } finally {
    await navigateur.close()
  }
}

async function principal() {
  mkdirSync(ICONES, { recursive: true })
  await recupererPolices()
  await recupererIcones()
  await recupererDashboardNasa()
  sources.sort((a, b) => a.fichier.localeCompare(b.fichier))
  writeFileSync(join(VENDOR, 'sources.json'), `${JSON.stringify(sources, null, 2)}\n`)
  journal(`Fichiers tiers : ${sources.length} enregistrés, provenance dans design/src/vendor/sources.json`)
}

principal().catch((e) => {
  erreur(`Échec de da-vendor : ${e.message}`)
  process.exit(1)
})
