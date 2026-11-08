// Gabarits partagés par les sections (en-tête de section, blocs).

/**
 * Enveloppe une section : titre (h2 au format h1), chapeau, puis le corps.
 * Le numéro est masqué aux lecteurs d'écran : l'index le donne déjà.
 */
export function enveloppeSection(ctx, section, { titre, chapo, corps, classe = '' }) {
  return `<section class="section section--${section.id} ${classe}" id="${section.id}" aria-labelledby="titre-${section.id}">
  <header class="section__tete">
    <h2 class="h1" id="titre-${section.id}"><span class="section__num" aria-hidden="true">${section.numero}</span>${ctx.e(titre ?? section.nom)}</h2>
    ${chapo ? `<p class="texte section__chapo">${ctx.e(chapo)}</p>` : ''}
  </header>
  ${corps}
</section>`
}

/** Un bloc titré à l'intérieur d'une section. */
export function bloc(ctx, { titre, id, contenu, classe = '', legende = '' }) {
  return `<div class="bloc ${classe}"${id ? ` id="${id}"` : ''}>
    ${titre ? `<h3 class="h3 bloc__titre">${ctx.e(titre)}</h3>` : ''}
    ${contenu}
    ${legende ? `<p class="legende">${ctx.e(legende)}</p>` : ''}
  </div>`
}
