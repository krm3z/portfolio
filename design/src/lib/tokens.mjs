// Lecture de tokens.css : on récupère les variables des blocs :root de premier niveau
// (hors @media), pour générer les tables de la page depuis la source de vérité.

/** Retire les commentaires CSS. */
function sansCommentaires(css) {
  return css.replace(/\/\*[\s\S]*?\*\//g, '')
}

/** Retire les blocs @media (et leur contenu), en suivant les accolades. */
function sansMedia(css) {
  let sortie = ''
  let i = 0
  while (i < css.length) {
    if (css.startsWith('@media', i)) {
      let profondeur = 0
      while (i < css.length) {
        if (css[i] === '{') profondeur++
        if (css[i] === '}') {
          profondeur--
          if (profondeur === 0) {
            i++
            break
          }
        }
        i++
      }
      continue
    }
    sortie += css[i]
    i++
  }
  return sortie
}

/** Renvoie { nom: valeur } pour chaque variable des blocs :root de premier niveau. */
export function lireTokens(css) {
  const propre = sansMedia(sansCommentaires(css))
  const tokens = {}
  for (const bloc of propre.matchAll(/:root\s*\{([^}]*)\}/g)) {
    // La dernière déclaration d'un bloc peut se passer de point-virgule : on découpe sur « ; ».
    for (const declaration of bloc[1].split(';')) {
      const m = declaration.match(/^\s*--([a-z0-9-]+)\s*:\s*([\s\S]+?)\s*$/i)
      if (m) tokens[m[1]] = m[2]
    }
  }
  return tokens
}
