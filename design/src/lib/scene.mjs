// Formules de la future scène 3D, reprises à l'identique dans les aperçus 2D de la page DA.
// Fonctions pures : la phase 05 pourra les tester contre le vrai rendu.
import { facteurBrouillard } from './brouillard.mjs'
import { hexVersRgb, melangerLineaire, multiplierLineaire, rgbVersHex } from './couleur.mjs'

/** smoothstep de GLSL (fonctionne aussi quand bord0 > bord1, comme sur les cartes graphiques). */
export function smoothstep(bord0, bord1, x) {
  const t = Math.min(1, Math.max(0, (x - bord0) / (bord1 - bord0)))
  return t * t * (3 - 2 * t)
}

/**
 * Vignettage de la bibliothèque postprocessing (effet Vignette, technique par défaut) :
 * la couleur est multipliée par ce facteur. u et v vont de 0 à 1 ; 1 = intact.
 */
export function facteurVignette({ decalage, obscurite }, u, v) {
  const d = Math.hypot(u - 0.5, v - 0.5)
  return smoothstep(0.8, decalage * 0.799, d * (obscurite + decalage))
}

/**
 * Couleur d'une matière vue à une distance donnée, dans l'aperçu 2D :
 * albédo × lumière ambiante × exposition (en linéaire), puis brouillard FogExp2.
 * L'éclairage est volontairement simplifié ; il sera recalé dans la vraie scène en phase 05.
 */
export function couleurAuLoin(etat, albedoHex, distance) {
  const eclairee = multiplierLineaire(hexVersRgb(albedoHex), etat.lumieres.ambiante.intensite * etat.exposition)
  const part = facteurBrouillard(etat.brouillard.densite, distance)
  return rgbVersHex(melangerLineaire(eclairee, hexVersRgb(etat.brouillard.couleur), part))
}
