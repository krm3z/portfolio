// Assemble la page de direction artistique en un seul fichier HTML (CSS et JS inclus).
// Chaque section vit dans design/src/sections/NN-nom/ : index.mjs (le HTML), style.css et client.js (facultatifs).
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { META, SECTIONS } from '../data/meta.mjs'
import { definitionsPartagees } from '../svg/kit.mjs'
import { creerContexte } from './contexte.mjs'

const ICI = dirname(fileURLToPath(import.meta.url))
const DOSSIER_SECTIONS = join(ICI, '..', 'sections')

/** Transforme un module pur (lib/*.mjs) en code utilisable dans la page : sans import ni export. */
export function versClient(code) {
  return code.replace(/^import .*$/gm, '').replace(/^export (function|const|let|class) /gm, '$1 ')
}

/** Charge une section : son HTML, sa feuille de style et son script s'ils existent. */
async function chargerSection(section, ctx) {
  const dossier = join(DOSSIER_SECTIONS, `${section.numero}-${section.id}`)
  const module = await import(pathToFileURL(join(dossier, 'index.mjs')).href)
  const lireSiPresent = (nom) => (existsSync(join(dossier, nom)) ? readFileSync(join(dossier, nom), 'utf8') : '')
  return { ...section, html: module.rendre(ctx, section), css: lireSiPresent('style.css'), js: lireSiPresent('client.js') }
}

/** Index latéral : une vraie séquence, celle des 13 sections du document. */
function rendreIndex(ctx) {
  const liens = SECTIONS.map(
    (s) =>
      `<li><a class="index__lien" href="#${s.id}" data-index="${s.id}"><span class="index__num">${s.numero}</span><span class="index__nom">${ctx.e(s.nom)}</span></a></li>`,
  ).join('')
  const outil = (id, libelle, presse = false) =>
    `<button type="button" class="outil" data-outil="${id}" aria-pressed="${presse}">${ctx.e(libelle)}</button>`
  return `<nav class="index" aria-label="Sections de la page">
  <details class="index__menu" open>
    <summary class="index__resume"><span class="index__courant" aria-hidden="true">01 / 13 · En-tête</span><span class="sr-only">Sommaire de la page</span></summary>
    <ol class="index__liste">${liens}</ol>
    <div class="outils" role="group" aria-label="Réglages de la page">
      <p class="etiquette outils__titre">Réglages</p>
      ${outil('grain', 'Grain', true)}${outil('grille', 'Grille')}${outil('mouvement', 'Mouvement réduit')}${outil('pause', 'Boucles en pause')}
    </div>
  </details>
</nav>`
}

function rendrePied(ctx) {
  return `<footer class="pied">
  <p class="etiquette">Direction artistique · version ${META.version} · ${META.dateCourte}</p>
  <p class="petit pied__credits">Polices : General Sans (Indian Type Foundry, ITF Free Font License, servie par Fontshare) et Geist Mono (Vercel, SIL Open Font License 1.1). Icônes : Lucide (ISC) et Simple Icons (CC0). Dashboard : projet NASA Data Pipeline de Kerem Uysal.</p>
</footer>`
}

/** Point d'entrée : renvoie { html, js } pour le script d'assemblage. */
export async function construirePage(racine) {
  const ctx = creerContexte(racine)
  const sections = []
  for (const section of SECTIONS) sections.push(await chargerSection(section, ctx))

  const css = [
    ctx.tokensCss,
    ctx.vendor.polices,
    // Le dashboard NASA n'est inclus qu'une fois : toutes les cartes le lisent par cette variable.
    `:root { --visuel-nasa: url("data:image/webp;base64,${ctx.vendor.dashboardNasa}"); }`,
    // Couleurs de l'état « jour », lues dans ambiance.json (source de vérité) pour les vignettes.
    `:root { --jour-brume: ${ctx.ambiance.jour.brouillard.couleur}; --jour-ciel-haut: ${ctx.ambiance.jour.ciel.haut}; --jour-ciel-horizon: ${ctx.ambiance.jour.ciel.horizon}; }`,
    readFileSync(join(ICI, 'base.css'), 'utf8'),
    readFileSync(join(ICI, '..', 'svg', 'kit.css'), 'utf8'),
    ...sections.map((s) => s.css),
  ].join('\n')
  const js = [
    versClient(readFileSync(join(ICI, '..', 'lib', 'prng.mjs'), 'utf8')),
    readFileSync(join(ICI, 'client.js'), 'utf8'),
    ...sections.map((s) => s.js),
  ].join('\n')
  const jsPage = `(() => {\n'use strict';\n${js}\n})();`

  const html = `<!doctype html>
<html lang="fr" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Direction artistique · Portfolio Kerem Uysal</title>
<meta name="description" content="${ctx.e(META.description)}">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0E0F11">
<!-- Fichier généré par scripts/da-build.mjs à partir de design/src/ : ne pas éditer à la main. -->
<link rel="preconnect" href="https://cdn.fontshare.com" crossorigin>
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
<script>document.documentElement.classList.replace('no-js', 'js')</script>
<style>
${css}
</style>
</head>
<body>
${definitionsPartagees()}
<a class="evitement" href="#contenu">Aller au contenu</a>
<div class="page">
${rendreIndex(ctx)}
<main id="contenu" class="contenu" tabindex="-1">
${sections.map((s) => s.html).join('\n')}
</main>
${rendrePied(ctx)}
</div>
<div class="grille-calque" aria-hidden="true">${'<span></span>'.repeat(12)}</div>
<div class="grain" aria-hidden="true"></div>
<div class="vignette" aria-hidden="true"></div>
<div class="curseur" aria-hidden="true"></div>
<p class="sr-only" id="annonces" aria-live="polite"></p>
<script>
${jsPage}
</script>
</body>
</html>
`
  return { html, js: jsPage }
}
