// Détection des pixels ambre sur une capture d'écran.
// Deux comptes :
//  - « ambre » : couleur proche de #F2A33A (distance OKLab ≤ 0,10) ;
//  - « teinte » : halos, fonds ambrés et bords lissés (même teinte, chroma visible).
// L'objectif de la DA (5 % maximum) porte sur la somme des deux, la mesure la plus sévère.
import { hexVersRgb, rgbVersOklab, oklabVersOklch } from './couleur.mjs'

export const AMBRE = hexVersRgb('#F2A33A')
const AMBRE_LAB = rgbVersOklab(AMBRE)

export const SEUILS = Object.freeze({
  distanceMax: 0.1,
  teinteCentre: oklabVersOklch(AMBRE_LAB).h, // ≈ 69,6°
  teinteEcart: 15,
  chromaMin: 0.02,
  ecartRougeBleuMin: 12, // pré-filtre : un gris (r ≈ b) ne peut pas être ambré
})

/** Classe un pixel : 'ambre', 'teinte' ou null. */
export function classerPixel(r, g, b) {
  // Filtre rapide : l'ambre a toujours r > g > b avec un écart net entre r et b.
  if (r - b < SEUILS.ecartRougeBleuMin || g < b) return null
  const lab = rgbVersOklab({ r, g, b })
  const distance = Math.hypot(lab.L - AMBRE_LAB.L, lab.a - AMBRE_LAB.a, lab.b - AMBRE_LAB.b)
  if (distance <= SEUILS.distanceMax) return 'ambre'
  const { C, h } = oklabVersOklch(lab)
  const ecart = Math.abs(((h - SEUILS.teinteCentre + 540) % 360) - 180)
  return C >= SEUILS.chromaMin && ecart <= SEUILS.teinteEcart ? 'teinte' : null
}

/**
 * Compte les pixels ambre d'une image RGBA.
 * `lignesExclues` : liste de [début, fin[ en lignes (par exemple la section palette).
 */
export function compterAmbre(donnees, largeur, hauteur, { lignesExclues = [] } = {}) {
  let ambre = 0
  let teinte = 0
  let total = 0
  for (let y = 0; y < hauteur; y++) {
    if (lignesExclues.some(([debut, fin]) => y >= debut && y < fin)) continue
    let i = y * largeur * 4
    for (let x = 0; x < largeur; x++, i += 4) {
      total++
      const classe = classerPixel(donnees[i], donnees[i + 1], donnees[i + 2])
      if (classe === 'ambre') ambre++
      else if (classe === 'teinte') teinte++
    }
  }
  return { ambre, teinte, total }
}

/** Pourcentages à partir d'un compte. */
export function pourcentages({ ambre, teinte, total }) {
  if (total === 0) return { ambre: 0, teinte: 0, somme: 0 }
  const p = (n) => (100 * n) / total
  return { ambre: p(ambre), teinte: p(teinte), somme: p(ambre + teinte) }
}
