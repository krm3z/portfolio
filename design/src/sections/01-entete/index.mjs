// Section 01 · En-tête : le titre de la page, la phrase, la date, la version, la philosophie visuelle,
// et le seul moment orchestré de la page (motion.json → ouvertureEntete) : des points apparaissent,
// se relient en cabane, puis la fenêtre s'allume. Le texte est lisible dès la première image.
import { META } from '../../data/meta.mjs'
import { aFrameFilaire, geometrieAFrame, nuage } from '../../svg/kit.mjs'

const r1 = (n) => Math.round(n * 10) / 10

/** L'illustration de l'ouverture : treillis, cabane en fil de fer, vitre allumée (sous les traits). */
function ouverture() {
  const cabane = { x: 200, y: 262, l: 124 }
  const g = geometrieAFrame(cabane)
  const vitre = [g.sommetInt, g.gaucheInt, g.droiteInt].map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ')
  // pathLength = 1 : chaque trait se dessine de 0 à 100 % avec stroke-dashoffset, quelle que soit sa longueur.
  const traits = (svg) => svg.replace(/<line /g, '<line pathLength="1" ')
  return `<svg class="ouverture" viewBox="0 0 400 300" role="img" aria-label="Des points de données se relient et dessinent une cabane A-frame, puis sa grande vitre s'allume en ambre">
    <g class="ouverture__lumiere">
      <ellipse class="k-halo" cx="200" cy="${r1(cabane.y - g.h * 0.36)}" rx="96" ry="78"/>
      <polygon class="k-vitre-allumee" points="${vitre}"/>
    </g>
    ${traits(nuage({ graine: 21, zone: { x: 36, y: 14, l: 328, h: 272 }, n: 64, voisins: 2, ellipse: true, classe: 'ouverture__treillis' }))}
    ${traits(aFrameFilaire({ x: cabane.x, y: cabane.y, l: cabane.l, classe: 'ouverture__cabane' }))}
  </svg>`
}

export function rendre(ctx, section) {
  const sources = [
    ['design/tokens.css', 'couleurs, typographie, espacements, rayons, durées'],
    ['design/motion.json', 'courbes, durées, écarts et version réduite de chaque animation'],
    ['design/ambiance.json', 'lumière de la scène : l’état « jour » et les trois ambiances candidates'],
  ]
  const [titre, sousTitre] = META.titre.split(' — ')
  // Chaque morceau du surtitre reste d'un bloc : la ligne ne se coupe qu'entre deux « · ».
  const surtitre = ['Phase 01', `version ${META.version}`, META.date].map((m) => `<span class="insecable">${ctx.e(m)}</span>`).join(' · ')
  return `<section class="section section--entete" id="${section.id}" aria-labelledby="titre-${section.id}">
  <div class="entete">
    <div class="entete__texte">
      <p class="etiquette entete__surtitre">${surtitre}</p>
      <h1 class="entete__titre" id="titre-${section.id}"><span class="display">${ctx.e(titre)}</span> <span class="entete__sous-titre h2">— ${ctx.e(sousTitre)}</span></h1>
      <p class="entete__phrase h3">${ctx.e(META.phrase)}</p>
      <div class="entete__philosophie">
        <p class="etiquette">Philosophie visuelle</p>
        <p class="entete__nom">${ctx.e(META.philosophie.nom)}</p>
        <p class="texte discret">${ctx.e(META.philosophie.texte)}</p>
      </div>
      <div class="entete__sources">
        <p class="etiquette">Trois fichiers font foi ; cette page les lit et les montre</p>
        <ul role="list">${sources.map(([f, d]) => `<li><code class="chiffre" translate="no">${f}</code><span class="petit discret">${ctx.e(d)}</span></li>`).join('')}</ul>
      </div>
    </div>
    <figure class="entete__image">
      ${ouverture()}
      <figcaption class="entete__legende"><span class="petit discret">Le seul moment orchestré de la page, joué une fois.</span>
        <button type="button" class="outil entete__rejouer">${ctx.icone('rotate-ccw', { taille: 14 })}<span>Rejouer</span></button></figcaption>
    </figure>
  </div>
</section>`
}
