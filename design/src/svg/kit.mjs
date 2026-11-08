// Kit de dessin SVG partagé : cabane A-frame, treillis de données, crêtes, brume, neige, avatar, écran, micro-interface.
// Les vignettes (sections 02, 03, 09, 12) utilisent des classes CSS (svg/kit.css) ; les ambiances (section 11)
// passent des couleurs calculées depuis ambiance.json. Toutes les formes au hasard viennent d'un aléa à graine.
import { entre, mulberry32 } from '../lib/prng.mjs'

const r1 = (n) => Math.round(n * 10) / 10
const pts = (liste) => liste.map(([x, y]) => `${r1(x)},${r1(y)}`).join(' ')

/**
 * Géométrie de la cabane A-frame vue de face (choix de Kerem) : toit à forte pente qui retient la neige,
 * grande façade triangulaire vitrée côté bureau, petite cheminée.
 * x = centre, y = sol, l = largeur au sol. La hauteur vaut 1,18 × l (pente d'environ 67°).
 */
export function geometrieAFrame({ x, y, l }) {
  const h = l * 1.18
  const e = l * 0.07 // épaisseur du toit
  const sommet = [x, y - h]
  const gauche = [x - l / 2, y]
  const droite = [x + l / 2, y]
  const t = e / Math.sin(Math.atan2(h, l / 2)) // retrait horizontal du triangle intérieur
  const sommetInt = [x, y - h + e * 1.6]
  const gaucheInt = [x - l / 2 + t * 1.15, y]
  const droiteInt = [x + l / 2 - t * 1.15, y]
  const cheminee = { x: x + l * 0.17, y: y - h * 0.74, l: l * 0.09, h: h * 0.16 }
  return { h, e, sommet, gauche, droite, sommetInt, gaucheInt, droiteInt, cheminee }
}

/** Point situé à la fraction f entre a et b. */
const entreDeux = (a, b, f) => [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f]

/** Montants et traverses de la façade vitrée (lignes). */
function menuiseries(g) {
  const lignes = [[g.sommetInt, [g.sommetInt[0], g.gaucheInt[1]]]]
  for (const f of [0.38, 0.68]) lignes.push([entreDeux(g.sommetInt, g.gaucheInt, f), entreDeux(g.sommetInt, g.droiteInt, f)])
  return lignes
}

/** Cabane pleine (vignettes) : classes CSS. Options : fenetre allumée, neige, avatar assis visible derrière la vitre. */
export function aFrame({ x, y, l, fenetre = true, neige = true, avatar = false, classe = '' }) {
  const g = geometrieAFrame({ x, y, l })
  const c = g.cheminee
  const vitre = pts([g.sommetInt, g.gaucheInt, g.droiteInt])
  const montants = menuiseries(g).map(([a, b]) => `<line class="k-montant" x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/>`).join('')
  const neigeToit = neige
    ? `<polygon class="k-neige" points="${pts([g.sommet, entreDeux(g.sommet, g.gauche, 0.9), entreDeux(g.sommet, g.gauche, 0.88).map((v, i) => v + (i ? -g.e * 0.55 : -g.e * 0.25)), [g.sommet[0], g.sommet[1] - g.e * 0.7]])}"/>
       <polygon class="k-neige" points="${pts([g.sommet, entreDeux(g.sommet, g.droite, 0.9), entreDeux(g.sommet, g.droite, 0.88).map((v, i) => v + (i ? -g.e * 0.55 : g.e * 0.25)), [g.sommet[0], g.sommet[1] - g.e * 0.7]])}"/>
       <rect class="k-neige" x="${r1(c.x - c.l * 0.1)}" y="${r1(c.y - c.l * 0.35)}" width="${r1(c.l * 1.2)}" height="${r1(c.l * 0.4)}" rx="${r1(c.l * 0.2)}"/>`
    : ''
  const personnage = avatar && fenetre ? avatarAssisDerriereVitre(g, l) : ''
  return `<g class="k-cabane ${classe}">
    <rect class="k-cheminee" x="${r1(c.x)}" y="${r1(c.y)}" width="${r1(c.l)}" height="${r1(c.h)}"/>
    <polygon class="k-toit" points="${pts([g.sommet, g.gauche, g.droite])}"/>
    <polygon class="${fenetre ? 'k-vitre-allumee' : 'k-vitre'}" points="${vitre}"/>
    ${personnage}${montants}${neigeToit}
  </g>`
}

/** L'avatar assis à son bureau, vu à travers la grande vitre (silhouette sombre sur la lumière). */
function avatarAssisDerriereVitre(g, l) {
  const sol = g.gaucheInt[1]
  const x = g.sommet[0] + l * 0.05
  const u = l * 0.05
  return `<g class="k-interieur">
    <rect x="${r1(x - u * 4.6)}" y="${r1(sol - u * 5.4)}" width="${r1(u * 3.4)}" height="${r1(u * 2.2)}" class="k-ecran-dos"/>
    <rect x="${r1(x - u * 5.6)}" y="${r1(sol - u * 3)}" width="${r1(u * 5.4)}" height="${r1(u * 0.5)}"/>
    <circle cx="${r1(x + u * 1.3)}" cy="${r1(sol - u * 6.1)}" r="${r1(u * 0.95)}"/>
    <path d="M${r1(x + u * 0.2)} ${r1(sol - u * 1.2)} q ${r1(-u * 0.1)} ${r1(-u * 3.4)} ${r1(u * 1.1)} ${r1(-u * 4)} q ${r1(u * 1.4)} ${r1(u * 0.6)} ${r1(u * 1.2)} ${r1(u * 4)} z"/>
  </g>`
}

/** Cabane en fil de fer : arêtes, menuiseries et sommets en points (états « treillis » et « filaire »). */
export function aFrameFilaire({ x, y, l, points = true, classe = '' }) {
  const g = geometrieAFrame({ x, y, l })
  const c = g.cheminee
  const aretes = [
    [g.sommet, g.gauche], [g.sommet, g.droite], [g.gauche, g.droite],
    [g.sommetInt, g.gaucheInt], [g.sommetInt, g.droiteInt],
    ...menuiseries(g),
  ]
  const traits = aretes.map(([a, b]) => `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/>`).join('')
  const sommets = [g.sommet, g.gauche, g.droite, g.sommetInt, g.gaucheInt, g.droiteInt, ...menuiseries(g).flat()]
  return `<g class="k-filaire ${classe}">
    ${traits}<rect x="${r1(c.x)}" y="${r1(c.y)}" width="${r1(c.l)}" height="${r1(c.h)}" fill="none"/>
    ${points ? sommets.map(([px, py]) => `<circle class="k-point" cx="${r1(px)}" cy="${r1(py)}" r="1.6"/>`).join('') : ''}
  </g>`
}

/**
 * Points répartis sur une grille légèrement secouée : couvre la zone sans paquets ni trous.
 * Avec ellipse = true, on ne garde que les points dans l'ellipse inscrite (bord irrégulier) : un nuage, pas un cadre.
 */
function grilleSecouee(alea, zone, n, ellipse = false) {
  const colonnes = Math.max(1, Math.round(Math.sqrt((n * zone.l) / zone.h)))
  const lignes = Math.ceil(n / colonnes)
  const points = []
  for (let j = 0; j < lignes; j++) {
    for (let i = 0; i < colonnes && points.length < n; i++) {
      const x = zone.x + ((i + 0.5 + entre(alea, -0.42, 0.42)) * zone.l) / colonnes
      const y = zone.y + ((j + 0.5 + entre(alea, -0.42, 0.42)) * zone.h) / lignes
      const rayon = ((x - zone.x - zone.l / 2) / (zone.l / 2)) ** 2 + ((y - zone.y - zone.h / 2) / (zone.h / 2)) ** 2
      const garde = !ellipse || rayon <= 1 + entre(alea, -0.35, 0.15)
      const taille = entre(alea, 0.7, 1.8)
      if (garde) points.push([x, y, taille])
    }
  }
  return points
}

/**
 * Nuage de points de données reliés entre eux (l'image des données brutes).
 * Deux façons de relier : tous les points à moins de `distance`, ou (voisins = k) chaque point à ses k plus proches,
 * sur une grille secouée : un treillis régulier, comme un échafaudage de données (référence A2).
 */
export function nuage({ graine = 1, zone, n = 40, distance = 40, voisins = 0, ellipse = false, classe = '' }) {
  const alea = mulberry32(graine)
  const points = voisins
    ? grilleSecouee(alea, zone, n, ellipse)
    : Array.from({ length: n }, () => [entre(alea, zone.x, zone.x + zone.l), entre(alea, zone.y, zone.y + zone.h), entre(alea, 0.7, 1.8)])
  const paires = new Set()
  points.forEach((p, i) => {
    const ecarts = points.map((q, j) => [j, Math.hypot(p[0] - q[0], p[1] - q[1])]).filter(([j]) => j !== i)
    const retenus = voisins ? ecarts.sort((a, b) => a[1] - b[1]).slice(0, voisins) : ecarts.filter(([, d]) => d < distance)
    for (const [j] of retenus) paires.add(i < j ? `${i}-${j}` : `${j}-${i}`)
  })
  const liens = [...paires].map((cle) => {
    const [p, q] = cle.split('-').map((k) => points[Number(k)])
    return `<line x1="${r1(p[0])}" y1="${r1(p[1])}" x2="${r1(q[0])}" y2="${r1(q[1])}"/>`
  })
  return `<g class="k-nuage ${classe}"><g class="k-liens">${liens.join('')}</g>${points.map(([x, y, r]) => `<circle class="k-point" cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}"/>`).join('')}</g>`
}

/** Points d'un « A » posé au sol : pente gauche puis pente droite, n segments par pente (le sommet n'est pas doublé). */
function pentesEnA(sommet, gauche, droite, n) {
  const montee = Array.from({ length: n + 1 }, (_, i) => entreDeux(gauche, sommet, i / n))
  const descente = Array.from({ length: n }, (_, i) => entreDeux(sommet, droite, (i + 1) / n))
  return [...montee, ...descente]
}

/**
 * Treillis ordonné qui converge vers la cabane (état « jour », référence A2 traduite).
 * Des coquilles en forme d'A, de plus en plus grandes, posées sur le même sol que la cabane. Chaque coquille porte
 * le même nombre de points : on relie les voisins sur une coquille, puis chaque point à son homologue de la coquille
 * intérieure, jusqu'au contour de la cabane. Ces rayons convergent vers la silhouette ; les coquilles lointaines
 * sont plus pâles, pour ramener l'œil sur la cabane.
 */
export function treillisConvergent({ x, y, l, coquilles = [1.45, 1.95, 2.5], segments = 6, graine = 1, classe = '' }) {
  const alea = mulberry32(graine)
  const g = geometrieAFrame({ x, y, l })
  const secoue = ([px, py], s) => [px + entre(alea, -1, 1) * s, py + entre(alea, -1, 1) * s]
  let interieur = pentesEnA(g.sommet, g.gauche, g.droite, segments) // le contour de la cabane
  const couches = coquilles.map((s, k) => {
    const coquille = pentesEnA([x, y - g.h * s], [x - (l / 2) * s, y], [x + (l / 2) * s, y], segments).map((p, i, liste) =>
      i === 0 || i === liste.length - 1 ? p : secoue(p, 0.012 * l * s))
    const liens = []
    coquille.forEach((p, i) => {
      if (i < coquille.length - 1) liens.push([p, coquille[i + 1]]) // le long de la coquille
      liens.push([p, interieur[i]]) // rayon vers l'intérieur
      if (k === 0 && i % 2 === 0 && i < coquille.length - 1) liens.push([p, interieur[i + 1]]) // maille plus serrée près de la cabane
    })
    interieur = coquille
    const trait = liens.map(([a, b]) => `<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}"/>`).join('')
    const rayon = [1.7, 1.35, 1.05][k] ?? 1
    const opacite = [0.8, 0.5, 0.3][k] ?? 0.25
    return `<g style="opacity:${opacite}"><g class="k-liens">${trait}</g>${coquille.map(([px, py]) => `<circle class="k-point" cx="${r1(px)}" cy="${r1(py)}" r="${rayon}"/>`).join('')}</g>`
  })
  return `<g class="k-nuage k-treillis ${classe}">${couches.reverse().join('')}</g>`
}

/** Crête de montagne (déplacement du point milieu) : renvoie la liste des points de la ligne de crête. */
export function crete({ graine = 1, largeur, base, amplitude, rugosite = 0.55, iterations = 7 }) {
  const alea = mulberry32(graine)
  let ligne = [[0, base - entre(alea, 0, amplitude)], [largeur, base - entre(alea, 0, amplitude)]]
  let ecart = amplitude
  for (let k = 0; k < iterations; k++) {
    const suivante = []
    for (let i = 0; i < ligne.length - 1; i++) {
      const [a, b] = [ligne[i], ligne[i + 1]]
      suivante.push(a, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + entre(alea, -ecart, ecart)])
    }
    suivante.push(ligne.at(-1))
    ligne = suivante
    ecart *= rugosite
  }
  return ligne.map(([x, y]) => [x, Math.min(base, y)])
}

/** Polygone d'une crête fermé jusqu'en bas. */
export function polygoneCrete(points, bas, attributs = '') {
  return `<polygon ${attributs} points="${pts([...points, [points.at(-1)[0], bas], [points[0][0], bas]])}"/>`
}

/** Bande de brume floue (filtre partagé #k-flou-brume). */
export function brume({ x = 0, y, l, h, opacite = 0.5, classe = 'k-brume', couleur }) {
  const fill = couleur ? ` fill="${couleur}"` : ''
  return `<rect class="${classe}" x="${r1(x)}" y="${r1(y)}" width="${r1(l)}" height="${r1(h)}" rx="${r1(h / 2)}" opacity="${opacite}"${fill} filter="url(#k-flou-brume)"/>`
}

/** Flocons de neige figés (petits disques). */
export function neigeTombe({ graine = 3, zone, n = 30, rayon = [0.6, 1.6], classe = 'k-flocon' }) {
  const alea = mulberry32(graine)
  return `<g class="${classe}">${Array.from({ length: n }, () => `<circle cx="${r1(entre(alea, zone.x, zone.x + zone.l))}" cy="${r1(entre(alea, zone.y, zone.y + zone.h))}" r="${r1(entre(alea, ...rayon))}"/>`).join('')}</g>`
}

/** Avatar en silhouette : « marche » (manteau long), « assis » (de dos, au bureau), « buste » (face). */
export function avatar({ x, y, t = 1, pose = 'marche', classe = 'k-avatar' }) {
  const u = (n) => r1(n * t)
  const formes = {
    marche: `<circle cx="${r1(x)}" cy="${r1(y - u(62))}" r="${u(7)}"/>
      <path d="M${r1(x - u(9))} ${r1(y - u(52))} h ${u(18)} l ${u(4)} ${u(34)} h ${u(-26)} z"/>
      <path d="M${r1(x - u(6))} ${r1(y - u(18))} l ${u(-5)} ${u(18)} h ${u(5)} l ${u(4)} ${u(-14)} l ${u(4)} ${u(14)} h ${u(5)} l ${u(-4)} ${u(-18)} z"/>`,
    assis: `<circle cx="${r1(x)}" cy="${r1(y - u(44))}" r="${u(7)}"/>
      <path d="M${r1(x - u(10))} ${r1(y - u(35))} q ${u(10)} ${u(-4)} ${u(20)} 0 l ${u(2)} ${u(22)} h ${u(-24)} z"/>
      <rect x="${r1(x - u(14))}" y="${r1(y - u(14))}" width="${u(28)}" height="${u(4)}" rx="${u(1)}"/>
      <rect x="${r1(x - u(2))}" y="${r1(y - u(10))}" width="${u(4)}" height="${u(10)}"/>`,
    buste: `<circle cx="${r1(x)}" cy="${r1(y - u(46))}" r="${u(14)}"/>
      <path d="M${r1(x - u(30))} ${r1(y)} q 0 ${u(-26)} ${u(30)} ${u(-28)} q ${u(30)} ${u(2)} ${u(30)} ${u(28)} z"/>`,
  }
  return `<g class="${classe}">${formes[pose]}</g>`
}

/** Bureau et écran : le dashboard allumé (l'écran est une source de lumière, donc ambre). */
export function bureau({ x, y, t = 1, ecranAllume = true }) {
  const u = (n) => r1(n * t)
  const barres = [0.5, 0.8, 0.35, 1, 0.6, 0.45].map((v, i) => `<rect class="k-ecran-barre" x="${r1(x - u(26) + i * u(9))}" y="${r1(y - u(44) - v * u(16))}" width="${u(5)}" height="${r1(v * u(16))}"/>`).join('')
  return `<g class="k-bureau">
    <rect class="k-meuble" x="${r1(x - u(44))}" y="${r1(y - u(14))}" width="${u(88)}" height="${u(3)}"/>
    <rect class="k-meuble" x="${r1(x - u(40))}" y="${r1(y - u(11))}" width="${u(3)}" height="${u(11)}"/><rect class="k-meuble" x="${r1(x + u(37))}" y="${r1(y - u(11))}" width="${u(3)}" height="${u(11)}"/>
    ${ecranAllume ? `<ellipse class="k-halo" cx="${r1(x)}" cy="${r1(y - u(40))}" rx="${u(46)}" ry="${u(26)}"/>` : ''}
    <rect class="${ecranAllume ? 'k-ecran' : 'k-ecran-eteint'}" x="${r1(x - u(32))}" y="${r1(y - u(64))}" width="${u(64)}" height="${u(38)}" rx="${u(2)}"/>
    ${ecranAllume ? barres : ''}
    <rect class="k-meuble" x="${r1(x - u(2))}" y="${r1(y - u(26))}" width="${u(4)}" height="${u(12)}"/>
  </g>`
}

/** Micro-interface aux coins (référence A5) : petites lignes de texte mono, figurées par des barres. */
export function microUI({ l, h, marge = 10 }) {
  const barre = (x, y, w) => `<rect class="k-micro" x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="2" rx="1"/>`
  return `<g class="k-micro-ui">
    ${barre(marge, marge, 26)}${barre(marge, marge + 6, 18)}${barre(marge, marge + 10, 22)}
    ${barre(l - marge - 30, marge, 30)}${barre(l - marge - 22, marge + 6, 22)}
    ${barre(marge, h - marge - 2, 30)}
  </g>`
}

/** Lignes de texte figurées. */
export function lignes({ x, y, l, n = 3, pas = 7, h = 2.5, classe = 'k-ligne' }) {
  return Array.from({ length: n }, (_, i) => `<rect class="${classe}" x="${r1(x)}" y="${r1(y + i * pas)}" width="${r1(i === n - 1 ? l * 0.6 : l)}" height="${h}" rx="1"/>`).join('')
}

/** Cadre de vignette 16:9 (320 × 180), avec description lue par les lecteurs d'écran (déjà échappée par l'appelant : ctx.e). */
export function vignette(contenu, { description, classe = '' }) {
  return `<svg class="k-vignette ${classe}" viewBox="0 0 320 180" role="img" aria-label="${description}"><rect class="k-fond" width="320" height="180"/>${contenu}</svg>`
}

/** Définitions partagées (filtres, dégradés), insérées une seule fois dans la page. */
export function definitionsPartagees() {
  return `<svg class="k-defs" width="0" height="0" aria-hidden="true" focusable="false" style="position:absolute">
    <defs>
      <filter id="k-flou-brume" x="-20%" y="-200%" width="140%" height="500%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="k-flou-leger" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>
      <filter id="k-flou-1" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1"/></filter>
      <filter id="k-flou-2" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="2"/></filter>
      <filter id="k-flou-4" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="4"/></filter>
      <marker id="k-fleche" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="k-fleche-tete" d="M1 1 L6 4 L1 7"/></marker>
      <filter id="k-lueur" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
      <radialGradient id="k-degrade-halo"><stop offset="0" style="stop-color:var(--amber);stop-opacity:0.55"/><stop offset="1" style="stop-color:var(--amber);stop-opacity:0"/></radialGradient>
      <linearGradient id="k-degrade-vitre" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--amber);stop-opacity:0.92"/><stop offset="1" style="stop-color:var(--amber)"/></linearGradient>
    </defs>
  </svg>`
}
