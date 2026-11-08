// Contraste WCAG 2.x entre deux couleurs.
// Le verdict se calcule sur la valeur exacte : on n'arrondit que pour l'affichage.
import { srgbVersLineaire } from './couleur.mjs'

/** Luminance relative WCAG d'une couleur { r, g, b } (0 = noir, 1 = blanc). */
export function luminanceRelative({ r, g, b }) {
  return 0.2126 * srgbVersLineaire(r) + 0.7152 * srgbVersLineaire(g) + 0.0722 * srgbVersLineaire(b)
}

/** Rapport de contraste entre deux couleurs opaques, de 1 à 21. */
export function ratioContraste(c1, c2) {
  const l1 = luminanceRelative(c1)
  const l2 = luminanceRelative(c2)
  const [clair, sombre] = l1 >= l2 ? [l1, l2] : [l2, l1]
  return (clair + 0.05) / (sombre + 0.05)
}

/**
 * Niveau atteint pour du texte courant.
 * AAA ≥ 7 ; AA ≥ 4,5 ; « AA grand texte » ≥ 3 (titres de 24 px, ou 18,66 px en gras) ; sinon Échec.
 */
export function niveauTexte(ratio) {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  if (ratio >= 3) return 'AA grand texte'
  return 'Échec'
}

/** Éléments non textuels (icônes, contours utiles, anneau de focus) : 3:1 minimum. */
export function niveauNonTexte(ratio) {
  return ratio >= 3 ? 'OK' : 'Échec'
}

/** Arrondi pour l'affichage, au format français : 16,35:1. */
export function formaterRatio(ratio) {
  return `${(Math.floor(ratio * 100) / 100).toFixed(2).replace('.', ',')}:1`
}
