// Section 06 · Grille et espacements : la grille superposée à une mise en page (1440 et 390 px),
// l'échelle d'espacement, les rayons, la bordure et les coins en équerre.
// Les colonnes sont calculées avec les valeurs de tokens.css (marges, gouttière, nombre de colonnes).
import { evaluerClamp } from '../../lib/clamp.mjs'
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'

/** Géométrie de la grille pour une largeur d'écran. */
function geometrie(largeur, colonnes, marge, gouttiere = 24) {
  const colonne = (largeur - 2 * marge - (colonnes - 1) * gouttiere) / colonnes
  const x = (i) => marge + i * (colonne + gouttiere) // bord gauche de la colonne i (0 = première)
  const etendue = (debut, nombre) => ({ x: x(debut), l: nombre * colonne + (nombre - 1) * gouttiere })
  return { largeur, colonnes, marge, gouttiere, colonne, x, etendue }
}

const virgule = (n) => Number(n.toFixed(1)).toString().replace('.', ',')

/** Colonnes de la grille, en surimpression. */
function colonnesSvg(g, hauteur) {
  return Array.from({ length: g.colonnes }, (_, i) => `<rect class="grille-demo__col" x="${g.x(i)}" y="0" width="${g.colonne}" height="${hauteur}"/>`).join('')
}

/** Barres qui figurent des lignes de texte. */
const lignes = (x, y, l, nombre, pas = 14, h = 6) =>
  Array.from({ length: nombre }, (_, i) => `<rect class="grille-demo__ligne" x="${x}" y="${y + i * pas}" width="${i === nombre - 1 ? l * 0.6 : l}" height="${h}" rx="2"/>`).join('')

function maquetteOrdinateur() {
  // Marge d'ordinateur de tokens.css (bloc @media à partir de 768 px) : clamp(32px, 4vw, 80px).
  const g = geometrie(1440, 12, evaluerClamp('clamp(32px, 4vw, 80px)', 1440))
  const gauche = g.etendue(0, 5)
  const centre = g.etendue(4, 4)
  const droite = g.etendue(8, 4)
  const contenu = `
    <rect class="grille-demo__barre" x="0" y="0" width="1440" height="64"/>
    <text class="grille-demo__mono" x="${g.x(0)}" y="38">KU</text>
    <text class="grille-demo__mono" x="720" y="38" text-anchor="middle">keremuysal19@icloud.com</text>
    <text class="grille-demo__mono" x="${g.x(11) + g.colonne}" y="38" text-anchor="end">À PROPOS · COMPÉTENCES · PROJETS · CONTACT</text>
    <text class="grille-demo__texte" x="${gauche.x}" y="330">Bonjour, je suis</text>
    <text class="grille-demo__geant" x="${gauche.x}" y="430">KEREM</text>
    <text class="grille-demo__geant" x="${gauche.x}" y="530">UYSAL</text>
    <path class="grille-demo__avatar" d="M${centre.x + centre.l / 2 - 70} 760 q 0 -190 70 -205 q 70 15 70 205 z"/>
    <circle class="grille-demo__avatar" cx="${centre.x + centre.l / 2}" cy="470" r="62"/>
    <text class="grille-demo__mono" x="${droite.x + droite.l}" y="400" text-anchor="end">EN RECHERCHE D’ALTERNANCE · SEPT. 2027</text>
    <text class="grille-demo__geant grille-demo__geant--ambre" x="${droite.x + droite.l}" y="500" text-anchor="end">DATA ANALYST</text>
    ${lignes(gauche.x, 600, gauche.l * 0.7, 3)}
    <rect class="grille-demo__rail" x="${g.x(0)}" y="700" width="20" height="120" rx="10"/>`
  return `<figure class="grille-demo">
    <svg class="grille-demo__svg" viewBox="0 0 1440 900" role="img" aria-label="Accueil à 1440 px avec la grille de 12 colonnes superposée">
      <rect class="grille-demo__fond" width="1440" height="900"/>${contenu}${colonnesSvg(g, 900)}
      <rect class="grille-demo__marge" x="0" y="0" width="${g.marge}" height="900"/><rect class="grille-demo__marge" x="${1440 - g.marge}" y="0" width="${g.marge}" height="900"/>
    </svg>
    <figcaption class="legende chiffre">1440 px · 12 colonnes de ${virgule(g.colonne)} px · gouttière ${g.gouttiere} px · marges ${virgule(g.marge)} px (4vw)</figcaption>
  </figure>`
}

function maquetteMobile() {
  const g = geometrie(390, 4, 24)
  const plein = g.etendue(0, 4)
  const contenu = `
    <rect class="grille-demo__barre" x="0" y="0" width="390" height="64"/>
    <text class="grille-demo__mono" x="${g.x(0)}" y="38">KU</text>
    <text class="grille-demo__mono" x="${plein.x + plein.l}" y="38" text-anchor="end">FR/EN · PAUSE · SON · MENU</text>
    <text class="grille-demo__texte" x="${plein.x}" y="130">Bonjour, je suis</text>
    <text class="grille-demo__geant" x="${plein.x}" y="200">KEREM</text>
    <text class="grille-demo__geant" x="${plein.x}" y="262">UYSAL</text>
    <circle class="grille-demo__avatar" cx="195" cy="390" r="52"/>
    <path class="grille-demo__avatar" d="M135 590 q 0 -150 60 -160 q 60 10 60 160 z"/>
    <text class="grille-demo__mono" x="${plein.x}" y="650">EN RECHERCHE D’ALTERNANCE</text>
    <text class="grille-demo__geant grille-demo__geant--ambre grille-demo__geant--moyen" x="${plein.x}" y="710">DATA ANALYST</text>
    ${lignes(plein.x, 750, plein.l * 0.9, 3)}`
  return `<figure class="grille-demo grille-demo--mobile">
    <svg class="grille-demo__svg" viewBox="0 0 390 844" role="img" aria-label="Accueil à 390 px avec la grille de 4 colonnes superposée">
      <rect class="grille-demo__fond" width="390" height="844"/>${contenu}${colonnesSvg(g, 844)}
      <rect class="grille-demo__marge" x="0" y="0" width="24" height="844"/><rect class="grille-demo__marge" x="366" y="0" width="24" height="844"/>
    </svg>
    <figcaption class="legende chiffre">390 px · 4 colonnes de ${virgule(g.colonne)} px · gouttière 24 px · marges 24 px</figcaption>
  </figure>`
}

function rendreEspacements() {
  const pas = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128]
  return `<ul class="espacements" role="list">${pas
    .map((p) => `<li><span class="espacements__valeur chiffre">${p}</span><span class="espacements__barre" style="width:${p}px"></span><span class="chiffre discret">--space-${p}</span></li>`)
    .join('')}</ul>`
}

function rendreFormes() {
  return `<ul class="formes" role="list">
    <li><span class="forme forme--petit"></span><span class="chiffre">6 px</span><span class="petit discret">Petit : champs, badges</span></li>
    <li><span class="forme forme--tuile"></span><span class="chiffre">12 px</span><span class="petit discret">Tuiles, cartes</span></li>
    <li><span class="forme forme--pilule"></span><span class="chiffre">999 px</span><span class="petit discret">Pilules : boutons, statuts, pastilles</span></li>
    <li><span class="forme forme--trait"></span><span class="chiffre">1 px --line</span><span class="petit discret">Bordures et séparateurs</span></li>
    <li><span class="forme forme--equerres equerres"></span><span class="chiffre">12 px · 1 px</span><span class="petit discret">Coins en équerre (référence B4)</span></li>
  </ul>`
}

export function rendre(ctx, section) {
  const corps = [
    bloc(ctx, {
      titre: 'La grille sur une vraie mise en page',
      contenu: `<div class="grilles">${maquetteOrdinateur()}${maquetteMobile()}</div>`,
      legende: 'Le réglage « Grille », dans le menu de la page, superpose les colonnes à toute la page.',
    }),
    bloc(ctx, { titre: 'Espacements', contenu: rendreEspacements() }),
    bloc(ctx, { titre: 'Rayons, bordure, équerres', contenu: rendreFormes() }),
  ].join('\n')
  return enveloppeSection(ctx, section, { chapo: 'Douze colonnes sur ordinateur, quatre sur téléphone, dix pas d’espacement.', corps })
}
