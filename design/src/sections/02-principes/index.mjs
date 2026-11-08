// Section 02 · Principes : six règles à suivre et six à éviter, chacune avec sa mini-illustration.
// Les règles résument CLAUDE.md (sections B et D) ; les dessins viennent du kit et des scènes du site.
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'
import { brume, crete, lignes, polygoneCrete, vignette } from '../../svg/kit.mjs'
import { SCENES } from '../../svg/scenes.mjs'

const marque = (bon) => bon
  ? '<g class="k-badge"><circle cx="300" cy="160" r="10"/><path d="M295 160 L299 164 L306 155"/></g>'
  : '<g class="k-badge k-badge--non"><circle cx="300" cy="160" r="10"/><path d="M296 156 L304 164 M304 156 L296 164"/></g>'

const cretesSombres = (classe = 'k-cretes') => [
  polygoneCrete(crete({ graine: 11, largeur: 320, base: 112, amplitude: 46 }), 180, `class="${classe}-3"`),
  polygoneCrete(crete({ graine: 23, largeur: 320, base: 132, amplitude: 36 }), 180, `class="${classe}-2"`),
  polygoneCrete(crete({ graine: 37, largeur: 320, base: 152, amplitude: 14, iterations: 6 }), 180, `class="${classe}-1"`),
].join('')

const pilule = (x, y, l, classe, texte) => `<rect class="${classe}" x="${x}" y="${y}" width="${l}" height="18" rx="9"/><text class="k-texte" x="${x + l / 2}" y="${y + 12}" text-anchor="middle">${texte}</text>`

/** Dessins propres aux principes (les autres viennent des scènes du site). */
const DESSINS = {
  lisible: (ctx) => {
    const { entree, navigation } = ctx.contenu.ui.fr
    const t = (x, y, texte, taille, classe = 'k-texte k-texte--clair') => `<text class="${classe}" x="${x}" y="${y}" style="font-size:${taille}px">${ctx.e(texte)}</text>`
    return `${cretesSombres()}<rect class="k-sol-plein" x="0" y="158" width="320" height="22"/>${t(14, 24, navigation.monogramme, 12, 'k-texte-geant')}${t(14, 42, entree.microTexte.ligne1, 6.5)}${t(14, 52, entree.microTexte.ligne2, 6.5)}${t(14, 62, entree.microTexte.ligne3, 6.5)}${t(14, 170, entree.invitationScroll.toUpperCase(), 6)}`
  },
  profondeur: () => `${cretesSombres()}${brume({ y: 116, l: 320, h: 18, opacite: 0.28 })}<rect class="k-sol-plein" x="0" y="158" width="320" height="22"/>`,
  accent: () => `<rect class="k-ui" x="40" y="26" width="240" height="128" rx="6"/>${lignes({ x: 60, y: 46, l: 150, n: 1, h: 7, classe: 'k-ligne-claire' })}${lignes({ x: 60, y: 66, l: 190, n: 4, pas: 9, h: 3 })}
    <rect class="k-bouton-ambre" x="60" y="118" width="80" height="20" rx="10"/><rect class="k-ui" x="148" y="118" width="80" height="20" rx="10"/>`,
  preuve: () => `<rect class="k-ui-plein" x="40" y="32" width="240" height="116" rx="4"/><path class="k-equerre" d="M40 42 V32 H50 M270 32 H280 V42 M280 138 V148 H270 M50 148 H40 V138"/>
    ${lignes({ x: 58, y: 50, l: 160, n: 2, pas: 9, h: 3, classe: 'k-ligne-claire' })}<text class="k-texte" x="58" y="94">PROUVÉ DANS :</text>
    ${pilule(58, 104, 66, 'k-ui', 'NASA')}${pilule(130, 104, 86, 'k-ui', 'POLLUTION')}`,
  continu: () => `${[30, 124, 218].map((x) => `<rect class="k-ui" x="${x}" y="52" width="72" height="56" rx="3"/>`).join('')}
    <path class="k-trait" d="M30 96 C 80 60, 110 120, 160 84 S 250 60, 290 70"/><line class="k-trait-fin" x1="306" y1="30" x2="306" y2="150"/><circle class="k-point" cx="306" cy="96" r="3"/>`,
  devant: () => `${lignes({ x: 40, y: 50, l: 180, n: 1, h: 8, classe: 'k-ligne-claire' })}${lignes({ x: 40, y: 72, l: 220, n: 6, pas: 10, h: 3 })}
    <polygon class="k-cretes-1" points="0,180 0,120 70,70 130,104 190,48 260,96 320,80 320,180"/>`,
  decor: () => `<text class="k-texte-geant k-texte-geant--ambre" x="40" y="62" style="font-size:22px">Mon parcours</text>
    <rect class="k-trait-ambre" x="40" y="78" width="240" height="64" rx="4"/>${lignes({ x: 54, y: 92, l: 200, n: 3, pas: 12, h: 3 })}`,
  rebond: () => `<line class="k-trait-fin k-traces" x1="40" y1="56" x2="290" y2="56"/><line class="k-trait-fin" x1="40" y1="150" x2="290" y2="150"/>
    <path class="k-trait" d="M40 150 C 90 150, 110 20, 160 36 S 200 70, 230 52 S 270 58, 290 56"/><text class="k-texte" x="290" y="48" text-anchor="end">CIBLE</text>`,
  attente: () => `<g opacity="0.25">${lignes({ x: 40, y: 50, l: 200, n: 1, h: 8, classe: 'k-ligne-claire' })}${lignes({ x: 40, y: 72, l: 220, n: 5, pas: 10, h: 3 })}</g>
    <circle class="k-trait-fin" cx="160" cy="96" r="18"/><path class="k-trait" d="M160 78 A 18 18 0 0 1 178 96"/>`,
  plat: () => `<polygon class="k-plat" points="0,180 0,120 60,70 120,118 180,60 250,112 320,84 320,180"/><polygon class="k-plat" points="0,180 0,150 90,118 170,148 240,120 320,146 320,180"/>`,
  sansSource: () => `<text class="k-texte-geant" x="160" y="104" text-anchor="middle" style="font-size:44px">11 246</text><text class="k-texte" x="160" y="132" text-anchor="middle">?</text>`,
}

const FAIRE = [
  { titre: 'Lisible en cinq secondes', texte: 'Le nom, le métier et la recherche se lisent tout de suite, même pendant l’intro.', dessin: 'lisible' },
  { titre: 'L’ambre, c’est la lumière', texte: 'Fenêtre, écran, chiffre clé, bouton principal. Rien d’autre, et jamais plus de 5 % d’un écran.', scene: 'A6' },
  { titre: 'La profondeur par la brume', texte: 'Chaque plan s’efface avec la distance ; le premier plan reste net.', dessin: 'profondeur' },
  { titre: 'Une seule chose appelle l’œil', texte: 'Sur chaque écran, un seul élément en ambre : l’action principale ou la lumière.', dessin: 'accent' },
  { titre: 'Chaque compétence a sa preuve', texte: 'Elle renvoie à un projet, au parcours ou au making-of.', dessin: 'preuve' },
  { titre: 'Le scroll pilote, sans coupure', texte: 'Une seule scène, une seule caméra ; on passe d’un chapitre à l’autre sans écran noir.', dessin: 'continu' },
]

const EVITER = [
  { titre: 'Cacher le texte derrière la 3D', texte: 'La 3D accompagne le contenu ; elle ne passe jamais devant.', dessin: 'devant' },
  { titre: 'L’ambre en décoration', texte: 'Pas de titre, de bordure ou de fond ambré pour faire joli.', dessin: 'decor' },
  { titre: 'Rebondir', texte: 'Aucun rebond, aucun dépassement : les mouvements s’amortissent.', dessin: 'rebond' },
  { titre: 'Faire attendre la lecture', texte: 'Aucune animation ne retarde un texte ; « Passer l’intro » reste visible.', dessin: 'attente' },
  { titre: 'Un gris plat', texte: 'Sans brume ni grain, la montagne devient un décor en carton.', dessin: 'plat' },
  { titre: 'Un chiffre sans source', texte: 'Un nombre seul ne prouve rien : il dit d’où il vient.', dessin: 'sansSource' },
]

function regle(ctx, r, bon) {
  const scene = r.scene ? SCENES[r.scene](ctx.contenu.ui.fr, ctx.contenu.identite) : { svg: DESSINS[r.dessin](ctx), clair: false }
  const image = vignette(`${scene.svg}${marque(bon)}`, { description: ctx.e(`${bon ? 'À faire' : 'À éviter'} : ${r.titre}`), classe: scene.clair ? 'k-sur-clair' : '' })
  return `<li class="principe"><figure>${image}<figcaption><p class="principe__titre">${ctx.e(r.titre)}</p><p class="petit discret">${ctx.e(r.texte)}</p></figcaption></figure></li>`
}

export function rendre(ctx, section) {
  const liste = (regles, bon) => `<ul class="principes" role="list">${regles.map((r) => regle(ctx, r, bon)).join('')}</ul>`
  const corps = [
    bloc(ctx, { titre: 'À faire', contenu: liste(FAIRE, true), classe: 'bloc--premier' }),
    bloc(ctx, { titre: 'À éviter', contenu: liste(EVITER, false) }),
  ].join('\n')
  return enveloppeSection(ctx, section, {
    chapo: 'La 3D sert le contenu, elle ne le cache jamais. Six règles à suivre, six à éviter.',
    corps,
  })
}
