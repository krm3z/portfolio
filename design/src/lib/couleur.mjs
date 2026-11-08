// Outils de couleur : conversions entre hex, RGB, sRGB linéaire, OKLab et OKLCH.
// Toutes les fonctions sont pures (aucun effet de bord) : faciles à tester et à expliquer.

/** "#RRGGBB" ou "#RGB" → { r, g, b } entre 0 et 255. */
export function hexVersRgb(hex) {
  const propre = String(hex).trim().replace('#', '')
  const complet = propre.length === 3 ? propre.split('').map((c) => c + c).join('') : propre
  if (!/^[0-9a-fA-F]{6}$/.test(complet)) throw new Error(`Couleur hex invalide : ${hex}`)
  const n = parseInt(complet, 16)
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

/** { r, g, b } (0-255) → "#RRGGBB" en majuscules. */
export function rgbVersHex({ r, g, b }) {
  const deux = (v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')
  return `#${deux(r)}${deux(g)}${deux(b)}`.toUpperCase()
}

/** Lit une couleur CSS simple : "#RRGGBB", "#RGB" ou "rgba(r, g, b, a)". → { r, g, b, a } */
export function lireCouleurCss(valeur) {
  const texte = String(valeur).trim()
  if (texte.startsWith('#')) return { ...hexVersRgb(texte), a: 1 }
  const m = texte.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)$/)
  if (!m) throw new Error(`Couleur CSS non prise en charge : ${valeur}`)
  return { r: Number(m[1]), g: Number(m[2]), b: Number(m[3]), a: m[4] === undefined ? 1 : Number(m[4]) }
}

/** Pose une couleur semi-transparente sur un fond opaque, comme le fait le navigateur (en sRGB). */
export function composer(dessus, fond) {
  const a = dessus.a ?? 1
  const canal = (d, f) => Math.round(f + a * (d - f))
  return { r: canal(dessus.r, fond.r), g: canal(dessus.g, fond.g), b: canal(dessus.b, fond.b) }
}

/** Canal sRGB (0-255) → valeur linéaire (0-1). */
export function srgbVersLineaire(c255) {
  const c = c255 / 255
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Valeur linéaire (0-1) → canal sRGB (0-255, non arrondi). */
export function lineaireVersSrgb(lin) {
  const c = Math.min(1, Math.max(0, lin))
  return 255 * (c <= 0.0031308 ? c * 12.92 : 1.055 * c ** (1 / 2.4) - 0.055)
}

/** { r, g, b } → OKLab { L, a, b } (formules de Björn Ottosson). */
export function rgbVersOklab({ r, g, b }) {
  const lr = srgbVersLineaire(r)
  const lg = srgbVersLineaire(g)
  const lb = srgbVersLineaire(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return {
    L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  }
}

/** OKLab → OKLCH { L, C, h } avec h en degrés (0-360). */
export function oklabVersOklch({ L, a, b }) {
  const h = (Math.atan2(b, a) * 180) / Math.PI
  return { L, C: Math.hypot(a, b), h: h < 0 ? h + 360 : h }
}

/** Raccourci : { r, g, b } → OKLCH. */
export function rgbVersOklch(rgb) {
  return oklabVersOklch(rgbVersOklab(rgb))
}

/** Écart perceptif entre deux couleurs : distance euclidienne dans OKLab. */
export function distanceOklab(c1, c2) {
  const p = rgbVersOklab(c1)
  const q = rgbVersOklab(c2)
  return Math.hypot(p.L - q.L, p.a - q.a, p.b - q.b)
}

/** Saturation HSL (0-1). C'est la mesure retenue pour la règle « gris 3D ≤ 8 % ». */
export function saturationHsl({ r, g, b }) {
  const max = Math.max(r, g, b) / 255
  const min = Math.min(r, g, b) / 255
  if (max === min) return 0
  const l = (max + min) / 2
  return l <= 0.5 ? (max - min) / (max + min) : (max - min) / (2 - max - min)
}

/** Mélange linéaire de deux couleurs dans l'espace sRGB (t = 0 → c1, t = 1 → c2). */
export function melangerSrgb(c1, c2, t) {
  const m = (x, y) => Math.round(x + (y - x) * t)
  return { r: m(c1.r, c2.r), g: m(c1.g, c2.g), b: m(c1.b, c2.b) }
}

/** Mélange de deux couleurs en lumière linéaire, comme le brouillard dans un shader three.js (t = 0 → c1, t = 1 → c2). */
export function melangerLineaire(c1, c2, t) {
  const m = (x, y) => Math.round(lineaireVersSrgb(srgbVersLineaire(x) + (srgbVersLineaire(y) - srgbVersLineaire(x)) * t))
  return { r: m(c1.r, c2.r), g: m(c1.g, c2.g), b: m(c1.b, c2.b) }
}

/** Multiplie une couleur par un facteur en lumière linéaire (éclairage, exposition, vignettage). Plafonne au blanc. */
export function multiplierLineaire(c, facteur) {
  const m = (x) => Math.round(lineaireVersSrgb(srgbVersLineaire(x) * facteur))
  return { r: m(c.r), g: m(c.g), b: m(c.b) }
}
