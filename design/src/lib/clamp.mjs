// Calcule la taille réelle (en px) d'une expression CSS clamp() pour une largeur d'écran donnée.
// Sert à remplir la table de l'échelle typographique à 1440 et à 390 px.

/** Évalue une longueur simple : "56px", "7vw" ou une somme comme "18.5px + .38vw". */
export function evaluerLongueur(expression, largeur) {
  const termes = expression.replace(/\s+/g, '').replace(/-/g, '+-').split('+').filter(Boolean)
  return termes.reduce((somme, terme) => {
    const m = terme.match(/^(-?[\d.]+)(px|vw)$/)
    if (!m) throw new Error(`Longueur non prise en charge : ${terme}`)
    const valeur = Number(m[1])
    return somme + (m[2] === 'vw' ? (valeur * largeur) / 100 : valeur)
  }, 0)
}

/** Évalue "clamp(min, préférée, max)" à une largeur d'écran donnée. */
export function evaluerClamp(expression, largeur) {
  const m = String(expression).trim().match(/^clamp\((.+)\)$/)
  if (!m) return evaluerLongueur(expression, largeur)
  const [min, prefere, max] = m[1].split(',').map((partie) => evaluerLongueur(partie, largeur))
  return Math.min(max, Math.max(min, prefere))
}
