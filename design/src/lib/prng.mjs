// Aléa à graine (algorithme mulberry32).
// Même graine = même suite de nombres : les illustrations sont identiques à chaque rendu,
// donc les captures et la mesure d'ambre sont reproductibles.

/** Renvoie une fonction qui donne un nombre dans [0, 1[ à chaque appel. */
export function mulberry32(graine) {
  let a = graine >>> 0
  return function alea() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Nombre au hasard entre min et max. */
export function entre(alea, min, max) {
  return min + alea() * (max - min)
}
