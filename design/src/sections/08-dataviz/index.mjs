// Section 08 · Dataviz : le style de tous les graphiques du site, sur les vraies données du projet NASA.
// Barres grises pour le contexte, ambre pour le fait ; valeurs écrites, une seule ligne de base, aucune grille.
// Chaque barre se lit aussi au clavier (infobulle) et les données existent en tableau.
import { PICS, SOURCE } from '../../data/nasa-pics.mjs'
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'

const MAX = Math.max(...PICS.map((p) => p.titres))

function graphique(ctx) {
  const barres = PICS.map((p, i) => {
    const libelle = `${p.mission} ${p.annee} : ${p.titres} titres` // le contexte est lu par aria-describedby
    return `<li class="graphique__colonne${p.fait ? ' graphique__colonne--fait' : ''}" style="--part:${(p.titres / MAX).toFixed(4)}">
      <span class="graphique__cible" tabindex="0" role="img" aria-label="${ctx.e(libelle)}" aria-describedby="info-pic-${i}">
        <span class="graphique__valeur chiffre" aria-hidden="true">${p.titres}</span>
        <span class="graphique__barre" aria-hidden="true"></span>
      </span>
      <span class="graphique__etiquette" aria-hidden="true"><span>${ctx.e(p.mission)}</span><span class="chiffre">${p.annee}</span></span>
      <span class="graphique__info" id="info-pic-${i}" role="tooltip">${ctx.e(p.contexte)}</span>
    </li>`
  }).join('')
  return `<figure class="graphique" aria-labelledby="graphique-titre">
    <figcaption class="graphique__tete">
      <p class="h2 graphique__titre" id="graphique-titre">Le survol de Pluton est le plus grand pic : 20 titres en 2015.</p>
      <p class="petit discret">Nombre de titres APOD qui citent la mission, l’année de l’événement. Source : projet NASA Data Pipeline, 11${' '}246 publications de 1995 à 2026.</p>
    </figcaption>
    <ol class="graphique__barres" role="list">${barres}</ol>
  </figure>`
}

function tableau(ctx) {
  const lignes = PICS.map((p) => `<tr><th scope="row">${ctx.e(p.mission)} ${p.annee}</th><td class="chiffre">${p.titres}</td><td>${ctx.e(p.contexte)}</td></tr>`).join('')
  return `<details class="donnees">
    <summary class="lien donnees__resume">Voir les données en tableau</summary>
    <div class="tableau-defilant" role="region" aria-label="Données du graphique" tabindex="0">
      <table class="tableau"><thead><tr><th scope="col">Événement</th><th scope="col">Titres</th><th scope="col">Contexte</th></tr></thead><tbody>${lignes}</tbody></table>
    </div>
    <p class="legende">${ctx.e(SOURCE)}.</p>
  </details>`
}

function regles(ctx) {
  const items = [
    ['Le titre dit le résultat', 'On lit la conclusion avant de regarder les barres.'],
    ['Du gris pour le contexte, de l’ambre pour le fait', 'Une seule barre en ambre ; les autres en #66686C (3,43:1 sur night).'],
    ['Les valeurs sont écrites', 'Pas d’axe ni de grille : une seule ligne de base. Les nombres restent en couleur de texte.'],
    ['Des barres fines', '24 px de large au plus, bout arrondi de 4 px, posées sur la ligne de base.'],
    ['Lisible sans la souris', 'Infobulle au survol et au clavier ; les mêmes données en tableau.'],
    ['Une donnée ne bouge pas pour le style', 'Les barres ne poussent pas à l’apparition.'],
  ]
  return `<ul class="regles-graphiques" role="list">${items.map(([t, d]) => `<li><p class="regles-graphiques__titre">${ctx.e(t)}</p><p class="petit discret">${ctx.e(d)}</p></li>`).join('')}</ul>`
}

export function rendre(ctx, section) {
  const corps = [
    bloc(ctx, { contenu: graphique(ctx) + tableau(ctx), classe: 'bloc--premier' }),
    bloc(ctx, { titre: 'Les règles de tous les graphiques du site', contenu: regles(ctx) }),
  ].join('\n')
  return enveloppeSection(ctx, section, {
    chapo: 'Un seul style pour tous les graphiques du site : du gris pour le contexte, de l’ambre pour le fait.',
    corps,
  })
}
