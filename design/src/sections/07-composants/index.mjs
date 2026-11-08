// Section 07 · Composants : chaque élément d'interface avec ses cinq états et un exemplaire vivant.
import { enveloppeSection } from '../../page/gabarits.mjs'
import { barreDuHaut, boutonPrincipal, boutonSecondaire, curseur, lien, railSocial, sonEtPause } from './actions.mjs'
import { annotation, carteCompetences, cartesProjet, filtres, loader, niveaux, statuts, timeline, toast, tuiles } from './contenus.mjs'

export function rendre(ctx, section) {
  const blocs = [
    boutonPrincipal, boutonSecondaire, lien, barreDuHaut, railSocial, sonEtPause, statuts, cartesProjet,
    carteCompetences, niveaux, tuiles, filtres, loader, toast, curseur, timeline, annotation,
  ].map((fabrique) => fabrique(ctx))
  const corps = `<p class="petit discret composants__mode">Chaque matrice montre des copies figées des états ; sous « En vrai », le composant répond à la souris et au clavier.</p>
  <div class="composants">${blocs.join('\n')}</div>
  <div class="toast" id="toast" aria-hidden="true">${ctx.icone('check', { taille: 16 })}<span class="toast__texte"></span></div>`
  return enveloppeSection(ctx, section, {
    chapo: 'Chaque élément d’interface dans ses cinq états : repos, survol, focus clavier, actif, désactivé.',
    corps,
  })
}
