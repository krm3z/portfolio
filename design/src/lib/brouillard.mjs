// Brouillard exponentiel de three.js (THREE.FogExp2).
// Part de brouillard à une distance d : 1 − exp(−(densité × d)²).
// On reprend la même formule dans les illustrations 2D pour que les densités
// choisies en phase 01 donnent le même rendu dans la scène de la phase 05.

const RACINE_LN20 = Math.sqrt(Math.log(20)) // ≈ 1,7308 : (densité × d)² = ln 20 quand le brouillard atteint 95 %

/** Part de brouillard (0 = net, 1 = couleur du brouillard) à une distance donnée, en mètres. */
export function facteurBrouillard(densite, distance) {
  const x = densite * distance
  return 1 - Math.exp(-x * x)
}

/** Distance à laquelle un objet est caché à 95 % par le brouillard. */
export function visibilite95(densite) {
  return RACINE_LN20 / densite
}

/** Densité qui cache un objet à 95 % à la distance voulue (pour recaler si l'échelle change). */
export function densitePourVisibilite95(distance) {
  return RACINE_LN20 / distance
}
