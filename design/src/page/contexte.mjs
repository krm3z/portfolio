// Contexte partagé par toutes les sections : sources de vérité, contenu, icônes et outils.
// Tout est lu sur le disque au moment de l'assemblage ; rien n'est recopié à la main dans la page.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { echapper, typographier } from '../lib/html.mjs'
import { lireTokens } from '../lib/tokens.mjs'

/** Lit un fichier texte UTF-8. */
const lire = (...chemin) => readFileSync(join(...chemin), 'utf8')
const lireJson = (...chemin) => JSON.parse(lire(...chemin))

/** Prépare une icône SVG pour l'insérer dans la page (taille, trait de 1,5 px, masquée aux lecteurs d'écran). */
function fabriqueIcone(dossierIcones) {
  const cache = new Map()
  return function icone(nom, { taille = 20, classe = '', trait = 1.5 } = {}) {
    if (!cache.has(nom)) cache.set(nom, lire(dossierIcones, `${nom}.svg`).replace(/^\s*<!--[\s\S]*?-->\s*/, ''))
    let svg = cache.get(nom).replace(/\s*<title>[\s\S]*?<\/title>/, '')
    const estLogo = nom.startsWith('logo-')
    svg = svg
      .replace(/\s(width|height|class|role)="[^"]*"/g, '')
      .replace(/stroke-width="[^"]*"/, `stroke-width="${trait}"`)
      .replace(
        '<svg',
        `<svg class="icone ${classe}" width="${taille}" height="${taille}" aria-hidden="true" focusable="false"${estLogo ? ' fill="currentColor"' : ''}`,
      )
    return svg.replace(/\n\s*/g, ' ')
  }
}

/** Construit le contexte à partir de la racine du projet. */
export function creerContexte(racine) {
  const design = join(racine, 'design')
  const contenuFr = (nom) => lireJson(racine, 'content', 'fr', `${nom}.json`)
  const tokensCss = lire(design, 'tokens.css')
  return {
    racine,
    tokensCss,
    tokens: lireTokens(tokensCss),
    motion: lireJson(design, 'motion.json'),
    ambiance: lireJson(design, 'ambiance.json'),
    contenu: {
      identite: contenuFr('identite'),
      projets: contenuFr('projets'),
      competences: contenuFr('competences'),
      stack: contenuFr('stack'),
      parcours: contenuFr('parcours'),
      ui: { fr: contenuFr('ui'), en: lireJson(racine, 'content', 'en', 'ui.json') },
    },
    vendor: {
      polices: lire(design, 'src', 'vendor', 'general-sans.css') + lire(design, 'src', 'vendor', 'geist-mono.css'),
      sources: lireJson(design, 'src', 'vendor', 'sources.json'),
      dashboardNasa: readFileSync(join(design, 'src', 'vendor', 'nasa-missions.webp')).toString('base64'),
    },
    icone: fabriqueIcone(join(design, 'src', 'vendor', 'icons')),
    e: (texte) => echapper(typographier(texte)), // texte affiché : apostrophe typographique, puis échappement
  }
}
