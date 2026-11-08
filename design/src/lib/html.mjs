// Échappement HTML : tout texte venu de content/ passe par ici avant d'entrer dans la page
// (exemple : « IA & Data » doit devenir « IA &amp; Data »).

const REMPLACEMENTS = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

/** Échappe un texte pour l'insérer dans du HTML (contenu ou attribut). */
export function echapper(texte) {
  return String(texte).replace(/[&<>"']/g, (c) => REMPLACEMENTS[c])
}

const INSECABLE = ' ' // espace insécable
const FINE = ' ' // espace fine insécable

/**
 * Typographie française pour l'affichage :
 *  - apostrophe droite → apostrophe typographique ;
 *  - espace insécable avant « : », espace fine insécable avant « ; ! ? % » et « » »,
 *    pour qu'aucune ponctuation ne commence une ligne ;
 *  - espace fine insécable après « « » ;
 *  - espace insécable entre un nombre et son unité (200 ms, 600 vh, 12 m, 25 h…), pour qu'ils ne se séparent pas.
 */
export function typographier(texte) {
  return String(texte)
    .replace(/'/g, '’')
    .replace(/ :/g, `${INSECABLE}:`)
    .replace(/ ([;!?%»])/g, `${FINE}$1`)
    .replace(/« /g, `«${FINE}`)
    .replace(/(\d) (ms|px|vh|vw|m|cd|nits|h|Ko|Mo|s|cm|segments?|titres?)(?![\p{L}\d])/gu, `$1${INSECABLE}$2`)
}
