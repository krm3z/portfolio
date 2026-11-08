// Outils de la section 07 : matrice des cinq états et bloc de composant.

export const ETATS = [
  { cle: 'repos', nom: 'Repos', classe: '' },
  { cle: 'survol', nom: 'Survol', classe: 'est-survol' },
  { cle: 'focus', nom: 'Focus clavier', classe: 'est-focus' },
  { cle: 'actif', nom: 'Actif', classe: 'est-actif' },
  { cle: 'desactive', nom: 'Désactivé', classe: 'est-desactive' },
]

/**
 * Matrice des états : une copie figée par état (masquée aux lecteurs d'écran, non focalisable),
 * pour que chaque état se voie sur une capture. `rendu(classe, etat)` renvoie le HTML d'une copie,
 * ou une chaîne commençant par « sans objet » quand l'état n'existe pas pour ce composant.
 */
export function matrice(ctx, rendu, { clair = false } = {}) {
  const cellules = ETATS.map((etat) => {
    const html = rendu(etat.classe, etat.cle)
    const sansObjet = html.startsWith('sans objet')
    return `<div class="matrice__cellule${sansObjet ? ' matrice__cellule--vide' : ''}">
      <p class="etiquette">${etat.nom}</p>
      <div class="matrice__rendu"${clair ? ' data-surface="clair"' : ''}>${sansObjet ? `<p class="petit discret">${ctx.e(html.charAt(0).toUpperCase() + html.slice(1))}</p>` : html}</div>
    </div>`
  }).join('')
  return `<div class="matrice" aria-hidden="true">${cellules}</div>`
}

/** Bloc d'un composant : titre, note d'usage, matrice éventuelle, exemplaire vivant. */
export function composant(ctx, { id, titre, note, matriceHtml = '', vivant = '', etatsTexte = '' }) {
  return `<article class="composant" id="composant-${id}" aria-labelledby="titre-composant-${id}">
    <header class="composant__tete">
      <h3 class="h3" id="titre-composant-${id}">${ctx.e(titre)}</h3>
      <p class="petit discret composant__note">${ctx.e(note)}</p>
    </header>
    ${matriceHtml}
    ${etatsTexte ? `<p class="sr-only">${ctx.e(etatsTexte)}</p>` : ''}
    ${vivant ? `<div class="composant__vivant"><p class="etiquette">En vrai</p><div class="composant__scene">${vivant}</div></div>` : ''}
  </article>`
}
