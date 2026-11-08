// Paysage d'ambiance : aperçu 2D d'un état d'ambiance.json (sections 09 et 11, exports PNG en 1200 × 675).
// Il est calculé comme la future scène three.js :
//  - chaque crête est à une distance connue (ambiance.plans) ; sa couleur mélange la matière éclairée
//    et le brouillard selon FogExp2 (lib/scene.mjs) ;
//  - le vignettage suit la formule de la bibliothèque postprocessing ;
//  - l'éclairage reste simplifié (albédo × ambiante × exposition), à recaler en phase 05.
// Le contraste du micro-texte posé sur l'image est calculé avec les mêmes formules (mesurerInterface).
import { facteurBrouillard } from '../lib/brouillard.mjs'
import { ratioContraste } from '../lib/contraste.mjs'
import { hexVersRgb, melangerLineaire, multiplierLineaire, rgbVersHex } from '../lib/couleur.mjs'
import { entre, mulberry32 } from '../lib/prng.mjs'
import { couleurAuLoin, facteurVignette } from '../lib/scene.mjs'
import { aFrame, aFrameFilaire, nuage, treillisConvergent } from './kit.mjs'

export const FORMAT = { l: 1200, h: 675 }
const { l: L, h: H } = FORMAT
const ECHELLE = L / 1440 // l'image figure un écran d'ordinateur de 1440 px de large
const HORIZON = 0.6 // le ciel atteint sa couleur d'horizon à 60 % de la hauteur
const SOL = 0.885 // ligne de sol de la cabane
const CABANE = { x: 0.64 * L, y: SOL * H, l: 0.085 * L }
const PAS = 8 // pas horizontal des lignes de crête, en unités
const r1 = (n) => Math.round(n) // l'image fait 1200 unités : l'unité entière suffit et allège la page
const points = (liste) => liste.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ')

/**
 * Crêtes, de la plus lointaine à la plus proche.
 * plan : index dans ambiance.plans · base : bas de la crête (fraction de la hauteur)
 * pics : [centre, hauteur, demi-largeur gauche, rapport droite/gauche] en fractions
 * neige : part haute couverte de neige · couloirs : traînées rocheuses par pic.
 */
const CRETES = [
  { plan: 4, graine: 41, base: 0.64, pics: [[0.06, 0.07, 0.16], [0.38, 0.1, 0.2, 1.3], [0.8, 0.07, 0.2]], neige: 0.75, couloirs: 0 },
  { plan: 3, graine: 52, base: 0.69, pics: [[0.13, 0.18, 0.15, 1.4], [0.53, 0.13, 0.14, 0.8], [0.93, 0.2, 0.16]], neige: 0.6, couloirs: 3 },
  { plan: 2, graine: 63, base: 0.79, pics: [[0.27, 0.41, 0.24, 1.25], [0.47, 0.22, 0.1], [0.69, 0.26, 0.17, 0.9]], neige: 0.5, couloirs: 7 },
  { plan: 1, graine: 74, base: 0.9, pics: [[0.02, 0.21, 0.22], [0.98, 0.26, 0.24], [0.46, 0.06, 0.25]], neige: 0.85, couloirs: 0 },
]

/** Rochers du premier plan : [centre, sol, largeur] ; loin de la zone du micro-texte en bas à gauche. */
const ROCHERS = [[0.245, 0.905, 34], [0.285, 0.9, 16], [0.87, 0.935, 44], [0.935, 0.918, 22]]

/** Bruit fractal 1D (déplacement du point milieu), ré-échantillonné sur n points ; valeurs autour de [-1, 1]. */
function bruitFractal(alea, n, rugosite = 0.55) {
  let valeurs = [entre(alea, -1, 1), entre(alea, -1, 1)]
  let ecart = 1
  while (valeurs.length < n) {
    const suivantes = []
    for (let i = 0; i < valeurs.length - 1; i++) suivantes.push(valeurs[i], (valeurs[i] + valeurs[i + 1]) / 2 + entre(alea, -ecart, ecart))
    suivantes.push(valeurs.at(-1))
    valeurs = suivantes
    ecart *= rugosite
  }
  return Array.from({ length: n }, (_, i) => {
    const p = (i * (valeurs.length - 1)) / (n - 1)
    const a = Math.floor(p)
    return valeurs[a] + ((valeurs[a + 1] ?? valeurs[a]) - valeurs[a]) * (p - a)
  })
}

/** Hauteur de l'enveloppe des pics en u (pics presque triangulaires, flancs un peu creusés). */
function enveloppe(pics, u) {
  return Math.max(0, ...pics.map(([c, h, demi, rapport = 1]) => {
    const d = u < c ? (c - u) / demi : (u - c) / (demi * rapport)
    return h * Math.max(0, 1 - d) ** 1.35
  }))
}

/** Ligne de crête : enveloppe + deux bruits (formes moyennes et détail rocheux), plus marqués près des sommets. */
function silhouette({ graine, base, pics }) {
  const n = Math.ceil(L / PAS) + 1
  const alea = mulberry32(graine)
  const formes = bruitFractal(alea, n, 0.5)
  const detail = bruitFractal(alea, n, 0.72)
  return Array.from({ length: n }, (_, i) => {
    const u = Math.min(1, (i * PAS) / L)
    const env = enveloppe(pics, u)
    const y = base - env - 0.02 * formes[i] * (0.4 + env * 2) - 0.01 * detail[i] * (0.2 + env * 4)
    return [u * L, Math.min(base, y) * H]
  })
}

/** Hauteur de la crête (unités) à l'abscisse x. */
const hauteurEn = (ligne, x) => ligne[Math.max(0, Math.min(ligne.length - 1, Math.round(x / PAS)))][1]

/** Flanc à l'ombre de chaque pic (lumière diffuse venue de la gauche) : un voile sombre, atténué par le brouillard. */
function flancs(crete, ligne, opacite) {
  return crete.pics.map(([c, , demi, rapport = 1]) => {
    const debut = c * L
    const fin = Math.min(L, (c + demi * rapport) * L)
    if (fin - debut < 0.08 * L) return '' // pic coupé par le bord de l'image : pas d'ombre en lame
    const arete = ligne.filter(([x]) => x >= debut && x <= fin)
    const bas = crete.base * H
    return `<polygon points="${points([...arete, [fin, bas], [debut + (fin - debut) * 0.22, bas]])}" fill="#000" opacity="${opacite.toFixed(3)}"/>`
  }).join('')
}

/** Couloirs rocheux : traînées effilées qui descendent des sommets en s'écartant (ligne de plus grande pente). */
function couloirs(crete, ligne, couleur, alea) {
  const bas = crete.base * H
  return crete.pics.flatMap(([c, , demi, rapport = 1]) => Array.from({ length: crete.couloirs }, () => {
    const cote = alea() < 0.5 ? -1 : 1
    const x0 = (c + cote * entre(alea, 0.03, 0.7) * demi * (cote > 0 ? rapport : 1)) * L
    const y0 = hauteurEn(ligne, x0) + 1.5
    const longueur = entre(alea, 0.25, 0.75) * (bas - y0)
    const dx = cote * longueur * entre(alea, 0.15, 0.5)
    const e = entre(alea, 1.5, 5) // demi-épaisseur en haut
    return `<path d="M${r1(x0 - e)} ${r1(y0)} Q ${r1(x0 + dx * 0.35 - e * 0.4)} ${r1(y0 + longueur * 0.5)} ${r1(x0 + dx)} ${r1(y0 + longueur)} Q ${r1(x0 + dx * 0.4 + e * 0.6)} ${r1(y0 + longueur * 0.45)} ${r1(x0 + e)} ${r1(y0)} Z" fill="${couleur}" opacity="${entre(alea, 0.45, 0.85).toFixed(2)}"/>`
  })).join('')
}

/** Rochers posés dans la neige du premier plan, avec un chapeau de neige. */
function rochers(couleurs) {
  const alea = mulberry32(88)
  return ROCHERS.map(([u, v, l]) => {
    const x = u * L
    const y = v * H
    const h = l * entre(alea, 0.45, 0.65)
    const contour = [[x - l / 2, y], [x - l * 0.42, y - h * 0.55], [x - l * 0.18, y - h], [x + l * 0.12, y - h * 0.9], [x + l * 0.4, y - h * 0.5], [x + l / 2, y]]
      .map(([px, py]) => [px + entre(alea, -1.5, 1.5), py + entre(alea, -1, 1)])
    const chapeau = [contour[1], contour[2], contour[3], contour[4], [x + l * 0.16, y - h * 0.62], [x - l * 0.2, y - h * 0.72]]
    return `<polygon points="${points(contour)}" fill="${couleurs.rocheProche}"/><polygon points="${points(chapeau)}" fill="${couleurs.sol}"/>`
  }).join('')
}

/** Flou de profondeur de champ d'un plan (unités de l'image) : nul au point, croît avec l'éloignement. */
function flouDuPlan(etat, distance) {
  const { distanceMiseAuPoint, flou } = etat.post.profondeurDeChamp
  return flou * Math.min(1.2, Math.max(0, (distance - distanceMiseAuPoint) / 100)) * ECHELLE
}

/** Couleurs calculées d'un état (hex), communes au dessin et à la mesure de contraste. */
export function couleursDuPaysage(etat, plans) {
  const auLoin = (albedo, distance) => couleurAuLoin(etat, albedo, distance)
  const premierPlan = plans[0].distance
  const ciel = { haut: etat.ciel.haut, horizon: etat.ciel.horizon }
  return {
    ciel,
    brouillard: etat.brouillard.couleur,
    sol: auLoin(etat.neige.albedo, premierPlan),
    rocheProche: auLoin(etat.roche.albedo, premierPlan),
    cretes: CRETES.map((c) => ({ neige: auLoin(etat.neige.albedo, plans[c.plan].distance), roche: auLoin(etat.roche.albedo, plans[c.plan].distance) })),
    toit: auLoin(etat.bois.albedo, premierPlan),
    neigeToit: auLoin(etat.neige.albedo, premierPlan),
    // Vitre éteinte : un verre sombre qui reflète un peu l'horizon.
    vitre: rgbVersHex(melangerLineaire(hexVersRgb(ciel.horizon), hexVersRgb('#0E0F11'), 0.72)),
  }
}

/** Le voile bas commence à 78 % de la hauteur et monte linéairement jusqu'à son opacité, au bord de l'image. */
const VOILE_DEBUT = 0.78
const partDuVoile = (y) => Math.min(1, Math.max(0, (y / H - VOILE_DEBUT) / (1 - VOILE_DEBUT)))

/** Voile noir posé par-dessus (comme dans le navigateur, en sRGB) : chaque canal × (1 − opacité). */
const voiler = ({ r, g, b }, opacite) => ({ r: Math.round(r * (1 - opacite)), g: Math.round(g * (1 - opacite)), b: Math.round(b * (1 - opacite)) })

/** Couleur du fond (ciel ou neige du premier plan) en un point de l'image, avant vignettage. */
function fondEn(couleurs, y) {
  if (y >= 0.87 * H) return hexVersRgb(couleurs.sol)
  const t = Math.min(1, y / (HORIZON * H))
  return melangerLineaire(hexVersRgb(couleurs.ciel.haut), hexVersRgb(couleurs.ciel.horizon), t)
}

/** Zones du micro-texte (unités de l'image) : en haut à gauche (nom, lignes), en bas à gauche (invitation). */
export const ZONES = {
  haut: { x: 48, y: 18, l: 230, h: 80 },
  bas: { x: 48, y: 632, l: 135, h: 14 },
}

/**
 * Contraste du micro-texte posé sur le paysage (une couleur par zone : { haut, bas } en hex) :
 * le plus faible sur une grille de points de chaque zone,
 * vignettage compris (multiplié en lumière linéaire, comme dans la scène).
 */
export function mesurerInterface(etat, plans, couleursTexte) {
  const couleurs = couleursDuPaysage(etat, plans)
  const mesure = ({ x, y, l, h }, couleurTexte) => {
    const texte = hexVersRgb(couleurTexte)
    let minimum = Infinity
    for (let i = 0; i <= 12; i++) {
      for (let j = 0; j <= 4; j++) {
        const px = x + (l * i) / 12
        const py = y + (h * j) / 4
        const vignette = multiplierLineaire(fondEn(couleurs, py), facteurVignette(etat.post.vignette, px / L, py / H))
        const fond = voiler(vignette, (etat.interface.voileBas ?? 0) * partDuVoile(py))
        minimum = Math.min(minimum, ratioContraste(texte, fond))
      }
    }
    return minimum
  }
  return { haut: mesure(ZONES.haut, couleursTexte.haut), bas: mesure(ZONES.bas, couleursTexte.bas) }
}

/** Dégradé radial du vignettage : la formule de postprocessing échantillonnée (voile noir, en sRGB). */
function degradeVignette(id, vignette) {
  const stops = Array.from({ length: 21 }, (_, i) => {
    const o = i / 20
    const f = facteurVignette(vignette, 0.5 + o * Math.SQRT1_2, 0.5)
    // multiplier par f en linéaire ≈ multiplier par f^(1/2,2) en sRGB : c'est l'opacité du voile noir
    return `<stop offset="${o}" stop-color="#000" stop-opacity="${(1 - f ** (1 / 2.2)).toFixed(3)}"/>`
  })
  return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="${Math.SQRT1_2.toFixed(4)}">${stops.join('')}</radialGradient>`
}

/**
 * Treillis de données (état « jour », références A1-A2) : des coquilles ordonnées qui convergent vers la cabane,
 * et quelques points isolés dans la brume, comme des données pas encore reliées.
 * En mode « profondeur » (section 09), des points proches s'ajoutent devant, flous de 4 et 8 px.
 */
function treillis(id, mode, avecFlou) {
  const filtre = (px) => (avecFlou && px ? ` filter="url(#${id}-t${px})"` : '')
  const poussiere = `<g${filtre(mode === 'profondeur' ? 1 : 0)}>${nuage({ graine: 7, n: 14, distance: 0, zone: { x: 0.36 * L, y: 0.12 * H, l: 0.56 * L, h: 0.72 * H }, classe: 'k-nuage--loin' })}</g>`
  const coquilles = treillisConvergent({ x: CABANE.x, y: CABANE.y, l: CABANE.l, graine: 11 })
  if (mode !== 'profondeur') return `${poussiere}${coquilles}`
  const proches = [
    { graine: 19, n: 10, zone: { x: 0.06 * L, y: 0.12 * H, l: 0.88 * L, h: 0.76 * H }, flou: 4, classe: 'k-nuage--proche' },
    { graine: 23, n: 5, zone: { x: 0.02 * L, y: 0.2 * H, l: 0.96 * L, h: 0.7 * H }, flou: 8, classe: 'k-nuage--tres-proche' },
  ].map((c) => `<g${filtre(c.flou)}>${nuage({ graine: c.graine, zone: c.zone, n: c.n, distance: 0, classe: c.classe })}</g>`)
  return `${poussiere}${coquilles}${proches.join('')}`
}

/**
 * Micro-interface de l'intro (référence A5), avec les textes de content/fr/ui.json.
 * Posé sur la 3D, le micro-texte est en Geist Mono 500 et 12 px (haut de l'échelle des étiquettes) :
 * en 400 et 11 px, ses traits sont plus fins qu'un pixel et il disparaît dans la neige.
 */
function microInterface(ctx) {
  const ui = ctx.contenu.ui.fr
  const t = (n) => r1(n * ECHELLE) // px d'écran → unités de l'image
  const passer = ui.entree.passerIntro
  const largeurPilule = t(passer.length * 7.4 + 28)
  return `<g class="k-ui" aria-hidden="true">
    <text class="k-ui-logo" x="48" y="${t(40)}" font-size="${t(20)}">${ctx.e(ui.navigation.monogramme)}</text>
    <text class="k-ui-texte" x="48" font-size="${t(12)}"><tspan x="48" y="${t(84)}">${ctx.e(ui.entree.microTexte.ligne1)}</tspan><tspan x="48" y="${t(100)}">${ctx.e(ui.entree.microTexte.ligne2)}</tspan><tspan x="48" y="${t(116)}">${ctx.e(ui.entree.microTexte.ligne3)}</tspan></text>
    <rect class="k-ui-pilule" x="${r1(L - 48 - largeurPilule)}" y="${t(16)}" width="${largeurPilule}" height="${t(32)}" rx="${t(16)}"/>
    <text class="k-ui-pilule-texte" x="${r1(L - 48 - largeurPilule / 2)}" y="${t(36)}" font-size="${t(12)}" text-anchor="middle">${ctx.e(passer)}</text>
    <text class="k-ui-texte k-ui-texte--maj k-ui-texte--bas" x="48" y="${r1(H - t(38))}" font-size="${t(12)}">${ctx.e(ui.entree.invitationScroll)}</text>
  </g>`
}

/** Une crête complète : neige et roche, flancs à l'ombre, couloirs ; floutée selon la profondeur de champ. */
function dessinerCrete(id, i, crete, etat, plans, couleurs, defs, avecFlou) {
  const distance = plans[crete.plan].distance
  const ligne = silhouette(crete)
  const haut = Math.min(...ligne.map(([, y]) => y))
  const bas = crete.base * H
  const contour = points([...ligne, [L, H], [0, H]])
  const neige = (haut + (bas - haut) * crete.neige - haut) / (bas - haut)
  const { neige: cNeige, roche: cRoche } = couleurs.cretes[i]
  defs.push(`<linearGradient id="${id}-g${i}" gradientUnits="userSpaceOnUse" x1="0" y1="${r1(haut)}" x2="0" y2="${r1(bas)}">
    <stop offset="0" stop-color="${cNeige}"/><stop offset="${neige.toFixed(3)}" stop-color="${cNeige}"/>
    <stop offset="${Math.min(1, neige + 0.14).toFixed(3)}" stop-color="${cRoche}"/><stop offset="1" stop-color="${cRoche}"/></linearGradient>`)
  defs.push(`<polygon id="${id}-p${i}" points="${contour}"/><clipPath id="${id}-c${i}"><use href="#${id}-p${i}"/></clipPath>`) // la crête sert deux fois : dessin et découpe
  const sd = avecFlou ? flouDuPlan(etat, distance) : 0
  if (sd > 0.05) defs.push(`<filter id="${id}-f${i}" x="-2%" y="-10%" width="104%" height="120%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${sd.toFixed(2)}"/></filter>`)
  // Le relief se lit moins loin dans le brouillard : l'ombre des flancs s'efface avec lui.
  const ombre = 0.16 * (1 - facteurBrouillard(etat.brouillard.densite, distance))
  const relief = `${flancs(crete, ligne, ombre)}${crete.couloirs ? couloirs(crete, ligne, cRoche, mulberry32(crete.graine + 1)) : ''}`
  return {
    plan: crete.plan,
    svg: `<g${sd > 0.05 ? ` filter="url(#${id}-f${i})"` : ''}><use href="#${id}-p${i}" fill="url(#${id}-g${i})"/><g clip-path="url(#${id}-c${i})">${relief}</g></g>`,
  }
}

/**
 * Dessine le paysage d'un état.
 * Options : id (unique dans la page), cabane ('pleine' | 'filaire'), treillis (false | 'simple' | 'profondeur'),
 * flou (profondeur de champ), vignettage, vignetteForcee (autres valeurs, pour la section 09), interface (micro-texte),
 * description (lue par les lecteurs d'écran).
 */
export function paysage(ctx, etat, { id, cabane = 'pleine', treillis: modeTreillis = false, flou = true, vignettage = true, vignetteForcee = null, interface: avecUi = true, description }) {
  const plans = ctx.ambiance.plans
  const c = couleursDuPaysage(etat, plans)
  const clair = etat.interface.texte.haut === 'night' // scène claire : traits et texte sombres
  const texteBas = etat.interface.texte.bas === 'night' ? ctx.tokens.night : ctx.tokens.snow
  const allumee = etat.fenetre.intensiteEmissive > 0
  const { night, snow } = ctx.tokens

  const defs = []
  const cretes = CRETES.map((crete, i) => dessinerCrete(id, i, crete, etat, plans, c, defs, flou))

  // Bandes de brume : posées devant le massif, derrière la crête proche.
  const bandes = etat.bandesBrume.map((b, i) => {
    defs.push(`<filter id="${id}-b${i}" x="-5%" y="-150%" width="110%" height="400%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${r1(b.epaisseur * H * 0.3)}"/></filter>`)
    return `<rect x="-40" y="${r1((b.hauteur - b.epaisseur / 2) * H)}" width="${L + 80}" height="${r1(b.epaisseur * H)}" fill="${c.brouillard}" opacity="${b.opacite}" filter="url(#${id}-b${i})"/>`
  })

  if (modeTreillis === 'profondeur' && flou) {
    ;[1, 4, 8].forEach((px) => defs.push(`<filter id="${id}-t${px}" x="-20%" y="-20%" width="140%" height="140%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${r1(px * ECHELLE)}"/></filter>`))
  }
  if (vignettage) defs.push(degradeVignette(`${id}-v`, vignetteForcee ?? etat.post.vignette))
  // Voile bas (ambiance.json → interface.voileBas) : il garantit le contraste du micro-texte posé sur la neige.
  const voile = avecUi ? etat.interface.voileBas ?? 0 : 0
  if (voile > 0) defs.push(`<linearGradient id="${id}-voile" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="${voile}"/></linearGradient>`)

  const sol = `<path d="M0 ${r1(0.872 * H)} C ${r1(0.3 * L)} ${r1(0.86 * H)}, ${r1(0.55 * L)} ${r1(0.9 * H)}, ${L} ${r1(0.875 * H)} V ${H} H 0 Z" fill="${c.sol}"/>`
  const lumiere = allumee
    ? `<ellipse cx="${r1(CABANE.x)}" cy="${r1(CABANE.y + 6)}" rx="${r1(CABANE.l * 1.5)}" ry="${r1(CABANE.l * 0.24)}" fill="url(#k-degrade-halo)" opacity="${Math.min(1, etat.fenetre.lueurNits / 16).toFixed(2)}"/>
       <ellipse cx="${r1(CABANE.x)}" cy="${r1(CABANE.y - CABANE.l * 0.5)}" rx="${r1(CABANE.l * 1.05)}" ry="${r1(CABANE.l * 0.85)}" fill="url(#k-degrade-halo)" opacity="${Math.min(1, etat.post.bloom.intensite * 0.6).toFixed(2)}"/>`
    : ''
  const maison = cabane === 'filaire'
    ? aFrameFilaire({ x: CABANE.x, y: CABANE.y, l: CABANE.l })
    : aFrame({ x: CABANE.x, y: CABANE.y, l: CABANE.l, fenetre: allumee, neige: true, avatar: allumee })

  const style = [
    `--p-toit:${c.toit}`, `--p-neige:${c.neigeToit}`, `--p-vitre:${c.vitre}`, `--p-interieur:${night}`,
    `--p-ui:${clair ? night : snow}`, `--p-ui-bas:${texteBas}`, `--p-pilule:${clair ? snow : night}`, `--p-pilule-texte:${clair ? night : snow}`,
  ].join(';')

  return `<svg class="k-paysage${clair ? ' k-sur-clair' : ''}" id="${id}" viewBox="0 0 ${L} ${H}" role="img" aria-label="${ctx.e(description ?? `Aperçu : ${etat.nom}`)}" style="${style}">
    <defs><linearGradient id="${id}-ciel" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2="${r1(HORIZON * H)}"><stop offset="0" stop-color="${c.ciel.haut}"/><stop offset="1" stop-color="${c.ciel.horizon}"/></linearGradient>${defs.join('')}</defs>
    <rect width="${L}" height="${H}" fill="url(#${id}-ciel)"/>
    ${cretes.filter((x) => x.plan >= 2).map((x) => x.svg).join('')}
    ${bandes.join('')}
    ${cretes.filter((x) => x.plan < 2).map((x) => x.svg).join('')}
    ${sol}${cabane === 'filaire' ? '' : rochers(c)}${lumiere}
    ${modeTreillis ? treillis(id, modeTreillis, flou) : ''}
    ${maison}
    ${vignettage ? `<rect width="${L}" height="${H}" fill="url(#${id}-v)"/>` : ''}
    ${voile > 0 ? `<rect class="k-voile-bas" y="${r1(VOILE_DEBUT * H)}" width="${L}" height="${r1((1 - VOILE_DEBUT) * H)}" fill="url(#${id}-voile)"/>` : ''}
    ${avecUi ? microInterface(ctx) : ''}
  </svg>`
}
