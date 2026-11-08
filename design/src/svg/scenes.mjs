// Scènes du site en vignettes 16:9 (320 × 180), dessinées avec le kit. Elles servent aux références
// traduites (section 03), au storyboard (section 12) et à quelques principes (section 02).
// Toujours notre version : la cabane A-frame, la montagne, l'avatar, nos textes ; jamais l'igloo ni leurs objets.
// Chaque scène renvoie { svg, clair } : « clair » = fond clair (traits et textes sombres).
import { echapper, typographier } from '../lib/html.mjs'
import { entre, mulberry32 } from '../lib/prng.mjs'
import { aFrame, aFrameFilaire, avatar, bureau, crete, lignes, microUI, neigeTombe, nuage, polygoneCrete, treillisConvergent } from './kit.mjs'

/** Points isolés dans la brume : des données pas encore reliées (référence A1). */
const poussiere = (graine, zone, n = 10) => nuage({ graine, zone, n, distance: 0, classe: 'k-nuage--loin' })

const BRUME = '<rect class="k-fond-brume" width="320" height="180"/>'
const NEIGE = '<rect class="k-fond-clair" width="320" height="180"/>'
const r1 = (n) => Math.round(n * 10) / 10

/** Trois plans de crêtes ; sur fond clair, des gris de brume. */
function cretes({ clair = false, base = 0 } = {}) {
  const c = clair ? 'k-cretes-clair' : 'k-cretes'
  return [
    polygoneCrete(crete({ graine: 11, largeur: 320, base: 112 + base, amplitude: 46 }), 180, `class="${c}-3"`),
    polygoneCrete(crete({ graine: 23, largeur: 320, base: 132 + base, amplitude: 36 }), 180, `class="${c}-2"`),
    polygoneCrete(crete({ graine: 37, largeur: 320, base: 152 + base, amplitude: 14, iterations: 6 }), 180, `class="${c}-1"`),
  ].join('')
}

const texte = (x, y, contenu, { taille = 7, ancre = 'start', classe = 'k-texte' } = {}) =>
  `<text class="${classe}" x="${x}" y="${y}" style="font-size:${taille}px" text-anchor="${ancre}">${echapper(typographier(contenu))}</text>`

/** Points tirés dans la silhouette d'un buste (tête et épaules) : l'avatar fait de particules (référence A9). */
function bustePoints({ graine, x, y, t = 1, n = 140, dispersion = 0 }) {
  const alea = mulberry32(graine)
  const points = []
  while (points.length < n) {
    const px = entre(alea, x - 32 * t, x + 32 * t)
    const py = entre(alea, y - 62 * t, y)
    const tete = (px - x) ** 2 + (py - (y - 46 * t)) ** 2 <= (14 * t) ** 2
    const epaules = py >= y - 28 * t && ((px - x) / (30 * t)) ** 2 + ((py - y) / (28 * t)) ** 2 <= 1
    if (!tete && !epaules) continue
    const dx = dispersion * entre(alea, -1, 1) * 60
    const dy = dispersion * entre(alea, -1, 0.4) * 50
    points.push(`<circle class="k-point" cx="${r1(px + dx)}" cy="${r1(py + dy)}" r="${r1(entre(alea, 0.5, 1.2))}"/>`)
  }
  return `<g class="k-particules">${points.join('')}</g>`
}

/** Les scènes, par identifiant (A1-A10 = référence A, B1-B9 = référence B). */
export const SCENES = {
  A1: () => ({
    clair: true,
    svg: `${BRUME}${poussiere(3, { x: 92, y: 40, l: 136, h: 90 }, 12)}${treillisConvergent({ x: 160, y: 112, l: 16, coquilles: [1.9], segments: 3, graine: 3 })}${aFrameFilaire({ x: 160, y: 112, l: 16 })}`,
  }),
  A2: () => ({
    clair: true,
    svg: `${BRUME}${poussiere(5, { x: 70, y: 16, l: 180, h: 120 })}${treillisConvergent({ x: 160, y: 156, l: 48, coquilles: [1.4, 1.8, 2.25], graine: 5 })}${aFrameFilaire({ x: 160, y: 156, l: 48 })}`,
  }),
  A3: () => ({
    clair: true,
    svg: `${BRUME}<g opacity="0.3">${treillisConvergent({ x: 160, y: 140, l: 56, coquilles: [1.4, 1.8], graine: 5 })}</g>
      <ellipse class="k-ile" cx="160" cy="140" rx="96" ry="13" filter="url(#k-flou-leger)"/>${aFrame({ x: 160, y: 138, l: 56, fenetre: false })}`,
  }),
  A4: () => ({
    clair: true,
    svg: `${BRUME}${cretes({ clair: true })}<ellipse class="k-ile" cx="160" cy="150" rx="120" ry="10" filter="url(#k-flou-leger)"/>${aFrame({ x: 160, y: 150, l: 30, fenetre: false })}
      <path class="k-trait-fin" d="M210 120 Q 250 92 268 52" marker-end="url(#k-fleche)"/>${texte(272, 48, 'CAMÉRA')}`,
  }),
  A5: () => ({
    clair: false,
    svg: `${cretes()}<rect class="k-sol-plein" x="0" y="158" width="320" height="22"/>${aFrame({ x: 206, y: 160, l: 24, fenetre: false })}${microUI({ l: 320, h: 180 })}`,
  }),
  A6: () => ({
    clair: false,
    svg: `${cretes()}<rect class="k-sol-plein" x="0" y="158" width="320" height="22"/>
      <ellipse class="k-halo" cx="206" cy="146" rx="40" ry="26"/><ellipse class="k-halo" cx="206" cy="163" rx="46" ry="6"/>
      ${aFrame({ x: 206, y: 160, l: 24, avatar: true })}${neigeTombe({ graine: 4, zone: { x: 0, y: 0, l: 320, h: 160 }, n: 24 })}`,
  }),
  // 7e temps de l'entrée : l'avatar arrive dans la neige, vers la cabane allumée.
  E7: () => ({
    clair: false,
    svg: `${cretes()}<rect class="k-sol-plein" x="0" y="150" width="320" height="30"/>
      <ellipse class="k-halo" cx="232" cy="122" rx="54" ry="36"/><ellipse class="k-halo" cx="232" cy="153" rx="60" ry="8"/>
      ${aFrame({ x: 232, y: 152, l: 44, avatar: false })}
      <path class="k-trait-fin k-traces" d="M40 172 Q 110 160 150 156"/>
      ${avatar({ x: 150, y: 156, t: 0.52, pose: 'marche', classe: 'k-avatar k-avatar--plein' })}
      ${neigeTombe({ graine: 6, zone: { x: 0, y: 0, l: 320, h: 150 }, n: 28 })}`,
  }),
  A7: () => ({
    clair: false,
    svg: `${bureau({ x: 150, y: 150, t: 1.3 })}
      <path class="k-trait-fin" d="M138 82 L 70 46 H 40"/>${texte(40, 42, 'SQL')}
      <path class="k-trait-fin" d="M170 90 L 240 54 H 276"/>${texte(276, 50, 'POWER BI', { ancre: 'end' })}
      <path class="k-trait-fin" d="M150 130 L 228 150 H 268"/>${texte(268, 146, 'PYTHON', { ancre: 'end' })}`,
  }),
  A8: () => ({
    clair: false,
    svg: `<polygon class="k-toit" points="160,-40 -30,200 350,200"/><polygon class="k-vitre" points="160,-16 -6,200 326,200"/>
      <line class="k-montant k-montant--clair" x1="160" y1="-16" x2="160" y2="200"/><line class="k-montant k-montant--clair" x1="46" y1="130" x2="274" y2="130"/>
      ${bureau({ x: 150, y: 176, t: 0.9 })}${avatar({ x: 214, y: 176, t: 0.9, pose: 'assis', classe: 'k-avatar' })}`,
  }),
  A9: () => ({
    clair: false,
    svg: `<ellipse class="k-socle" cx="160" cy="132" rx="70" ry="10"/><ellipse class="k-socle k-socle--2" cx="160" cy="132" rx="96" ry="15"/>
      ${bustePoints({ graine: 9, x: 160, y: 128, t: 1.2, n: 170 })}
      ${texte(160, 166, '[ LINKEDIN ]   [ GITHUB ]   [ EMAIL ]', { ancre: 'middle' })}`,
  }),
  A10: () => ({
    clair: false,
    svg: `${bustePoints({ graine: 9, x: 160, y: 128, t: 1.2, n: 110, dispersion: 0.9 })}${nuage({ graine: 13, zone: { x: 40, y: 20, l: 240, h: 140 }, n: 26, voisins: 1, ellipse: true })}`,
  }),

  B1: (ui) => ({
    clair: true,
    svg: `${NEIGE}${texte(10, 14, 'KU', { classe: 'k-texte k-texte--sombre' })}
      <g class="k-egaliseur"><rect x="296" y="8" width="2" height="7"/><rect x="300" y="5" width="2" height="10"/><rect x="304" y="9" width="2" height="6"/></g>
      ${texte(-20, 100, ui.loader.texteDefilant, { taille: 30, classe: 'k-texte-geant' })}
      <rect class="k-pilule" x="112" y="78" width="96" height="24" rx="12"/>${texte(160, 93, `${ui.loader.chargement.toUpperCase()} 64 %`, { ancre: 'middle', classe: 'k-texte k-texte--clair' })}`,
  }),
  B2: (ui, id) => ({
    clair: false,
    svg: `<line class="k-trait-fin" x1="10" y1="20" x2="310" y2="20"/>${texte(10, 14, 'KU')}${texte(150, 14, id.email, { ancre: 'middle', taille: 4.5 })}${texte(310, 14, [ui.navigation.apropos, ui.navigation.projets, ui.navigation.contact].join(' · ').toUpperCase(), { ancre: 'end', taille: 4.5 })}
      ${avatar({ x: 160, y: 180, t: 1.3, pose: 'buste', classe: 'k-avatar k-avatar--plein' })}
      ${texte(18, 94, ui.accueil.bonjour, { taille: 6.5, classe: 'k-texte k-texte--clair' })}${texte(18, 112, id.nom.toUpperCase(), { taille: 17, classe: 'k-texte-geant' })}
      ${texte(302, 94, ui.accueil.avant, { taille: 5, ancre: 'end', classe: 'k-texte k-texte--clair' })}${texte(302, 112, id.motsAlternes[0].texte, { taille: 17, ancre: 'end', classe: 'k-texte-geant k-texte-geant--ambre' })}
      <circle class="k-bouton-ambre" cx="246" cy="140" r="2.5"/>`,
  }),
  B3: (ui) => ({
    clair: false,
    svg: `${avatar({ x: 92, y: 182, t: 2.2, pose: 'buste', classe: 'k-avatar k-avatar--plein' })}
      ${texte(180, 58, ui.apropos.titre.toUpperCase(), { classe: 'k-texte k-texte--espace' })}${lignes({ x: 180, y: 70, l: 118, n: 6, pas: 9, h: 3, classe: 'k-ligne-claire' })}`,
  }),
  B4: (ui) => ({
    clair: false,
    svg: `${bureau({ x: 104, y: 168, t: 1.05 })}${avatar({ x: 104, y: 172, t: 1.05, pose: 'assis', classe: 'k-avatar k-avatar--plein' })}
      ${texte(16, 48, ui.competences.titre.toUpperCase(), { taille: 15, classe: 'k-texte-geant' })}
      <rect class="k-pointilles" x="190" y="62" width="114" height="100"/><path class="k-equerre" d="M190 70 V62 H198 M296 62 H304 V70 M304 154 V162 H296 M198 162 H190 V154"/>
      <line class="k-trait-fin" x1="190" y1="112" x2="304" y2="112"/>${lignes({ x: 198, y: 74, l: 90, n: 2, pas: 9, h: 3, classe: 'k-ligne-claire' })}${lignes({ x: 198, y: 124, l: 90, n: 2, pas: 9, h: 3 })}`,
  }),
  B5: (ui) => {
    const annees = ['2025', '2026', '2027']
    return {
      clair: false,
      svg: `${texte(160, 28, ui.parcours.titre, { taille: 15, ancre: 'middle', classe: 'k-texte-geant' })}
        <line class="k-trait-fin" x1="160" y1="44" x2="160" y2="172"/><circle class="k-bouton-ambre k-point-lumineux" cx="160" cy="104" r="3.5"/>
        ${annees.map((a, i) => `${lignes({ x: 28, y: 58 + i * 40, l: 90, n: 2, pas: 7, h: 2.5 })}${texte(186, 66 + i * 40, a, { taille: 13, classe: `k-texte-geant${i < 2 ? '' : ' k-texte-geant--attenue'}` })}${lignes({ x: 236, y: 58 + i * 40, l: 70, n: 2, pas: 7, h: 2.5 })}`).join('')}`,
    }
  },
  B6: (ui) => {
    const carte = (x, y, n) => `<rect class="k-ui" x="${x}" y="${y}" width="70" height="66" rx="3"/>${texte(x + 6, y + 13, String(n).padStart(2, '0'), { taille: 9 })}<rect class="k-ui-plein" x="${x + 6}" y="${y + 20}" width="58" height="26" rx="2"/>${lignes({ x: x + 6, y: y + 52, l: 50, n: 2, pas: 6, h: 2 })}`
    return {
      clair: false,
      svg: `${texte(16, 28, ui.projets.titre, { taille: 15, classe: 'k-texte-geant' })}
        ${carte(14, 46, 1)}<line class="k-trait-fin" x1="94" y1="40" x2="94" y2="176"/>${carte(104, 102, 2)}<line class="k-trait-fin" x1="184" y1="40" x2="184" y2="176"/>${carte(194, 46, 3)}
        <line class="k-trait-fin" x1="274" y1="40" x2="274" y2="176"/>${texte(282, 120, '→', { taille: 14, classe: 'k-texte-geant' })}`,
    }
  },
  B7: (ui) => {
    const tuiles = []
    for (let j = 0; j < 3; j++) {
      const n = j === 1 ? 7 : 6
      for (let i = 0; i < n; i++) {
        const x = 160 - (n * 30) / 2 + i * 30 + 3
        const y = 50 + j * 40
        tuiles.push(`<rect class="k-ui-plein" x="${x}" y="${y}" width="24" height="24" rx="5"/><circle class="k-micro" cx="${x + 12}" cy="${y + 12}" r="4"/><rect class="k-micro" x="${x + 6}" y="${y + 29}" width="12" height="2" rx="1"/>`)
      }
    }
    return { clair: false, svg: `${texte(160, 30, ui.stack.titre.toUpperCase(), { taille: 14, ancre: 'middle', classe: 'k-texte-geant' })}${tuiles.join('')}` }
  },
  B8: (ui, id) => ({
    clair: false,
    svg: `<rect class="k-bouton-ambre" x="118" y="10" width="84" height="18" rx="9"/>${texte(160, 22, `${ui.contact.meContacter.toUpperCase()} →`, { ancre: 'middle', classe: 'k-texte k-texte--sombre' })}
      ${texte(16, 74, id.nom.toUpperCase(), { taille: 26, classe: 'k-texte-geant' })}
      ${[ui.contact.email, ui.contact.localisation, ui.contact.reseaux].map((t, i) => `${texte(16 + i * 82, 112, t.toUpperCase())}${lignes({ x: 16 + i * 82, y: 120, l: 64, n: 2, pas: 8, h: 2.5 })}`).join('')}
      ${texte(304, 168, `${id.nom.toUpperCase()} ©`, { ancre: 'end', taille: 6 })}`,
  }),
  B9: (ui) => {
    const cartes = []
    for (let k = 0; k < 6; k++) {
      const x = 22 + (k % 3) * 94
      const y = 92 + Math.floor(k / 3) * 46
      cartes.push(`<rect class="k-ui-plein" x="${x}" y="${y}" width="86" height="26" rx="2"/>${lignes({ x, y: y + 31, l: 70, n: 2, pas: 5, h: 2 })}`)
    }
    const filtres = [ui.pageProjets.filtres.tous, ...Object.values(ui.projets.categories)].map((f) => f.toUpperCase()).map((f, i) => `<rect class="${i === 0 ? 'k-filtre-actif' : 'k-ui'}" x="${86 + i * 38}" y="66" width="34" height="13" rx="6.5"/>${texte(103 + i * 38, 75, f, { taille: 5.5, ancre: 'middle' })}`).join('')
    return {
      clair: false,
      svg: `<rect class="k-ui" x="112" y="8" width="96" height="16" rx="8"/>${texte(160, 19, `← ${ui.pageProjets.retourAccueil.toUpperCase()}`, { taille: 5.5, ancre: 'middle' })}
        ${texte(160, 46, ui.pageProjets.titre, { taille: 15, ancre: 'middle', classe: 'k-texte-geant' })}${texte(160, 58, ui.pageProjets.sousTitre, { taille: 6, ancre: 'middle' })}
        ${filtres}${cartes.join('')}`,
    }
  },
}

/** Rendu d'une scène dans son cadre 16:9 ; le texte des vignettes vient de content/fr. */
export function dessinerScene(ctx, id, { description, vignette }) {
  const { svg, clair } = SCENES[id](ctx.contenu.ui.fr, ctx.contenu.identite)
  return vignette(svg, { description, classe: clair ? 'k-sur-clair' : '' })
}
