// Section 09 · Matière et lumière : grain, vignettage, profondeur de champ, lueur ambre (bloom),
// aberration chromatique. Chaque effet est montré sans, à sa vraie valeur, puis exagéré quand il est trop fin pour se voir.
// Grain, vignettage et profondeur de champ sont posés sur l'état « jour » (svg/paysage.mjs), commun aux trois ambiances.
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'
import { aFrame, aFrameFilaire } from '../../svg/kit.mjs'
import { paysage } from '../../svg/paysage.mjs'

const fr = (n) => String(n).replace('.', ',')

function panneau(ctx, { etiquette, image, legende }) {
  return `<figure class="panneau">
    <div class="panneau__image">${image}</div>
    <figcaption><p class="etiquette">${ctx.e(etiquette)}</p>${legende ? `<p class="petit discret">${ctx.e(legende)}</p>` : ''}</figcaption>
  </figure>`
}

/** L'état « jour », sans micro-texte, avec les options d'un panneau. */
const jour = (ctx, id, options = {}) => paysage(ctx, ctx.ambiance.jour, {
  id, cabane: 'filaire', treillis: 'simple', interface: false, description: 'État « jour » : brume claire, treillis de données et cabane en fil de fer', ...options,
})

function grain(ctx) {
  const opacite = fr(ctx.ambiance.jour.post.grain)
  return `<div class="panneaux">
    ${panneau(ctx, { etiquette: 'Sans grain', image: jour(ctx, 'm-grain-0') })}
    ${panneau(ctx, { etiquette: `Grain réel : ${opacite}, fusion overlay`, image: `${jour(ctx, 'm-grain-1')}<span class="grain-local grain-local--demo" aria-hidden="true"></span>`, legende: 'Presque invisible : il casse les aplats et les dégradés sans se voir.' })}
    ${panneau(ctx, { etiquette: 'Grain × 8, pour le voir', image: `${jour(ctx, 'm-grain-8')}<span class="grain-local grain-local--demo grain-local--x8" aria-hidden="true"></span>` })}
  </div>`
}

function vignettage(ctx) {
  const v = ctx.ambiance.jour.post.vignette
  return `<div class="panneaux">
    ${panneau(ctx, { etiquette: 'Sans vignettage', image: jour(ctx, 'm-vig-0', { vignettage: false }) })}
    ${panneau(ctx, { etiquette: `Valeur réelle : obscurité ${fr(v.obscurite)}`, image: jour(ctx, 'm-vig-1'), legende: 'Les bords s’assombrissent un peu : l’œil va au centre, comme dans la référence A1.' })}
    ${panneau(ctx, { etiquette: 'Obscurité × 3, pour le voir', image: jour(ctx, 'm-vig-3', { vignetteForcee: { ...v, obscurite: v.obscurite * 3 } }) })}
  </div>`
}

function profondeur(ctx) {
  return `<div class="panneaux panneaux--deux">
    ${panneau(ctx, { etiquette: 'Tout net', image: jour(ctx, 'm-pdc-0', { treillis: 'profondeur', flou: false, description: 'Treillis de données entièrement net' }) })}
    ${panneau(ctx, { etiquette: 'Profondeur de champ légère', image: jour(ctx, 'm-pdc-1', { treillis: 'profondeur', description: 'Cabane nette, points proches et lointains flous' }), legende: 'Mise au point sur la cabane. Les points lointains se floutent de 1 px, les points proches de 4 et 8 px. Ces flous restent fixes : on n’anime jamais un grand flou.' })}
  </div>`
}

function lueurAmbre(ctx) {
  const fenetre = (avecLueur) => `<rect class="k-fond" width="320" height="180"/>
    ${avecLueur ? '<ellipse class="k-halo" cx="160" cy="104" rx="64" ry="46"/><g filter="url(#k-lueur)"><polygon class="k-vitre-allumee" points="160,66 136,132 184,132"/></g>' : ''}
    ${aFrame({ x: 160, y: 134, l: 60, neige: false })}`
  return `<div class="panneaux panneaux--deux">
    ${panneau(ctx, { etiquette: 'Sans lueur', image: `<svg class="k-vignette" viewBox="0 0 320 180" role="img" aria-label="Fenêtre ambre sans halo">${fenetre(false)}</svg>` })}
    ${panneau(ctx, { etiquette: 'Lueur (bloom) sur l’ambre seulement', image: `<svg class="k-vignette" viewBox="0 0 320 180" role="img" aria-label="Fenêtre ambre avec un halo de lumière">${fenetre(true)}</svg>`, legende: 'Dans la scène, le bloom a un seuil : seules les surfaces émissives ambre (fenêtre, écran) le dépassent et brillent.' })}
  </div>`
}

function aberration(ctx) {
  const filaire = (decalage) => `<rect class="k-fond" width="320" height="180"/>
    <g class="k-ca-rouge" transform="translate(${-decalage} 0)">${aFrameFilaire({ x: 160, y: 150, l: 90, points: false })}</g>
    <g class="k-ca-cyan" transform="translate(${decalage} 0)">${aFrameFilaire({ x: 160, y: 150, l: 90, points: false })}</g>
    ${aFrameFilaire({ x: 160, y: 150, l: 90 })}`
  // 0,0012 × 1440 px ≈ 1,7 px à l'écran ; la vignette fait 320 unités de large, d'où 0,0012 × 320.
  const reel = 0.0012 * 320
  return `<div class="panneaux panneaux--deux">
    ${panneau(ctx, { etiquette: 'Valeur réelle : 0,0012 (≈ 1,7 px à 1440 px)', image: `<svg class="k-vignette" viewBox="0 0 320 180" role="img" aria-label="Cabane en fil de fer avec une aberration chromatique à peine visible">${filaire(reel)}</svg>` })}
    ${panneau(ctx, { etiquette: 'La même, × 4, pour la voir', image: `<svg class="k-vignette" viewBox="0 0 320 180" role="img" aria-label="Cabane en fil de fer avec des franges rouge et cyan">${filaire(reel * 4)}</svg>`, legende: 'Réservée aux transitions (passage par la fenêtre, changement de chapitre). Jamais au repos.' })}
  </div>`
}

export function rendre(ctx, section) {
  const corps = [
    bloc(ctx, { titre: 'Grain', contenu: grain(ctx), legende: 'Le réglage « Grain », dans le menu de la page, coupe le grain de la page ; les panneaux ci-dessus le gardent pour la comparaison.' }),
    bloc(ctx, { titre: 'Vignettage', contenu: vignettage(ctx) }),
    bloc(ctx, { titre: 'Profondeur de champ', contenu: profondeur(ctx) }),
    bloc(ctx, { titre: 'Lueur ambre', contenu: lueurAmbre(ctx) }),
    bloc(ctx, { titre: 'Aberration chromatique', contenu: aberration(ctx) }),
  ].join('\n')
  return enveloppeSection(ctx, section, { chapo: 'Ce qui donne du corps à l’image : grain, vignettage, profondeur, lueur.', corps })
}
