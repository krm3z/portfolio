// Section 12 · Storyboard : 16 vignettes dans l'ordre réel du site (CLAUDE.md, section E).
// Légende au format « chapitre · plage de scroll · ce qui bouge ». L'entrée dure 600 vh sur ordinateur
// et 450 vh sur mobile, en 7 temps égaux (calculés ici) ; les autres plages restent à valider en phase 04.
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'
import { vignette } from '../../svg/kit.mjs'
import { dessinerScene } from '../../svg/scenes.mjs'

const ENTREE = { ordinateur: 600, mobile: 450, temps: 7 }

/** Plage du temps n (1 à 7) de l'entrée, en vh. */
function plage(total, n) {
  const pas = total / ENTREE.temps
  return `${Math.round(pas * (n - 1))} → ${Math.round(pas * n)} vh`
}

const PLANCHES = [
  { scene: 'B1', chapitre: 'loader', ce: 'Le texte géant défile ; la pilule compte jusqu’à 100 %, puis devient « Entrer ».' },
  { scene: 'A1', chapitre: 'entree', temps: 1, ce: 'Des points flottent dans la brume claire ; une minuscule cabane en fil de fer au centre.' },
  { scene: 'A2', chapitre: 'entree', temps: 2, ce: 'Les points se relient ; le treillis dessine la cabane, qui grandit.' },
  { scene: 'A3', chapitre: 'entree', temps: 3, ce: 'La cabane devient matière sur une île de neige ; le treillis s’efface.' },
  { scene: 'A4', chapitre: 'entree', temps: 4, ce: 'La brume s’ouvre : la montagne apparaît, la caméra recule et monte.' },
  { scene: 'A5', chapitre: 'entree', temps: 5, ce: 'Plan large ; la micro-interface s’installe aux coins.' },
  { scene: 'A6', chapitre: 'entree', temps: 6, ce: 'Le jour tombe : l’heure bleue, puis la nuit ; la fenêtre s’allume en ambre.' },
  { scene: 'E7', chapitre: 'entree', temps: 7, ce: 'L’avatar arrive dans la neige et entre ; la caméra traverse la vitre.' },
  { scene: 'B2', chapitre: 'accueil', ce: 'Au bureau, tourné vers le visiteur : le nom à gauche, le métier qui alterne à droite.' },
  { scene: 'B3', chapitre: 'apropos', ce: 'La caméra s’approche ; l’avatar glisse à gauche, le paragraphe arrive à droite.' },
  { scene: 'B4', chapitre: 'competences', ce: 'La caméra tourne : l’avatar tape face à ses dashboards ; les cartes s’ouvrent sur leurs preuves.' },
  { scene: 'B5', chapitre: 'parcours', ce: 'La scène passe au second plan, floue et assombrie ; le point ambre descend la timeline.' },
  { scene: 'B6', chapitre: 'projets', ce: 'La rangée de projets défile à l’horizontale pendant qu’on descend.' },
  { scene: 'B7', chapitre: 'stack', ce: 'Les tuiles tombent en cascade ; chaque outil montre les projets qui le prouvent.' },
  { scene: 'B8', chapitre: 'contact', ce: 'La scène revient au premier plan ; l’avatar se tourne vers le visiteur ; « Me contacter → ».' },
  { scene: 'A10', chapitre: 'contact', fin: true, ce: 'Fin possible : l’avatar se dissout en points et on revient au nuage du début.' },
]

function legende(ctx, p) {
  const nom = ctx.contenu.ui.fr.chapitres[p.chapitre]
  const quand = p.temps
    ? `<span class="chiffre">${plage(ENTREE.ordinateur, p.temps)}</span> · mobile <span class="chiffre">${plage(ENTREE.mobile, p.temps)}</span>`
    : p.chapitre === 'loader' ? 'avant le scroll' : 'plage à valider'
  const titre = p.temps ? `${nom} · temps ${p.temps}/${ENTREE.temps}` : p.fin ? `${nom} · fin` : nom
  return `<p class="planche__chapitre"><span class="etiquette">${ctx.e(p.chapitre)}</span> ${ctx.e(titre)}</p>
    <p class="planche__plage etiquette">${quand}</p>
    <p class="petit">${ctx.e(p.ce)}</p>`
}

export function rendre(ctx, section) {
  const planches = `<ol class="planches" role="list">${PLANCHES.map((p, i) => `<li class="planche">
    <figure>
      ${dessinerScene(ctx, p.scene, { description: ctx.e(p.ce), vignette })}
      <figcaption><span class="planche__num chiffre" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${legende(ctx, p)}</figcaption>
    </figure>
  </li>`).join('')}</ol>`
  const corps = [
    bloc(ctx, {
      contenu: planches,
      classe: 'bloc--premier',
      legende: `Entrée : ${ENTREE.ordinateur} vh sur ordinateur, ${ENTREE.mobile} vh sur mobile, en ${ENTREE.temps} temps égaux. Une seule scène persistante, sans coupure : l’extérieur pendant l’entrée, l’intérieur ensuite.`,
    }),
  ].join('\n')
  return enveloppeSection(ctx, section, {
    chapo: 'Le site du début à la fin, en 16 images : ce qu’on voit, quand, et ce qui bouge.',
    corps,
  })
}
