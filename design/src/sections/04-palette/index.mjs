// Section 04 · Palette : les 8 couleurs de la section D, leurs contrastes réels et leurs proportions.
// Tout est calculé à l'assemblage depuis tokens.css : changer une couleur là-bas met cette section à jour.
import { formaterRatio, niveauNonTexte, niveauTexte, ratioContraste } from '../../lib/contraste.mjs'
import { composer, lireCouleurCss, rgbVersHex } from '../../lib/couleur.mjs'
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'

const NUANCIER = [
  { nom: 'night', role: 'Fond principal' },
  { nom: 'night-2', role: 'Surfaces, cartes' },
  { nom: 'night-3', role: 'Survol des surfaces' },
  { nom: 'line', role: 'Bordures et séparateurs' },
  { nom: 'mist', role: 'Texte secondaire, brume' },
  { nom: 'snow', role: 'Texte principal, neige' },
  { nom: 'amber', role: 'Seul accent : la lumière' },
  { nom: 'amber-soft', role: 'Fonds actifs' },
]

/** Paires de contraste : celles du prompt, puis les compléments utiles au site. */
const PAIRES = [
  { texte: 'snow', fond: 'night' },
  { texte: 'snow', fond: 'night-2' },
  { texte: 'mist', fond: 'night' },
  { texte: 'mist', fond: 'night-2' },
  { texte: 'amber', fond: 'night' },
  { texte: 'amber', fond: 'night-2' },
  { texte: 'night', fond: 'amber', note: 'boutons principaux' },
  { texte: 'snow', fond: 'night-3', note: 'survol' },
  { texte: 'mist', fond: 'night-3', note: 'survol' },
  { texte: 'snow', fond: 'amber-soft', note: 'filtre actif' },
  { texte: 'amber', fond: 'amber-soft', note: 'filtre actif' },
  { texte: 'night', fond: 'snow', note: 'surface claire (loader)' },
  { texte: 'mist', fond: 'snow', note: 'interdit : texte night sur fond clair' },
  { texte: 'gris-donnee', fond: 'night', note: 'barres de graphique', nonTexte: true },
  { texte: 'amber', fond: 'snow', note: 'anneau de focus sur fond clair : liseré night ajouté', nonTexte: true },
]

/** Couleur opaque réellement vue : les tons transparents sont posés sur night. */
function couleurVue(tokens, nom) {
  const brute = lireCouleurCss(tokens[nom])
  return brute.a < 1 ? composer(brute, lireCouleurCss(tokens.night)) : brute
}

function rendreNuancier(ctx) {
  const cartes = NUANCIER.map(({ nom, role }) => {
    const valeur = ctx.tokens[nom]
    const transparente = valeur.startsWith('rgba')
    const vue = rgbVersHex(couleurVue(ctx.tokens, nom))
    return `<li class="nuance${nom === 'amber' ? ' nuance--ambre' : ''}">
      <span class="nuance__echantillon" style="background:var(--${nom})"></span>
      <span class="nuance__nom chiffre">--${nom}</span>
      <span class="nuance__valeur chiffre">${transparente ? valeur.replace(/\s/g, '') : valeur}</span>
      ${transparente ? `<span class="nuance__vue chiffre">sur night : ${vue}</span>` : ''}
      <span class="nuance__role">${ctx.e(role)}</span>
    </li>`
  }).join('')
  return `<ul class="nuancier" role="list">${cartes}</ul>`
}

// L'aperçu « Aa » est une illustration de la paire (le rapport et le verdict sont écrits à côté) :
// il est dessiné en SVG avec un nom accessible, pour que les paires qui échouent exprès ne passent pas pour du texte.
function rendreContrastes(ctx) {
  const lignes = PAIRES.map(({ texte, fond, note, nonTexte }) => {
    const ratio = ratioContraste(couleurVue(ctx.tokens, texte), couleurVue(ctx.tokens, fond))
    const niveau = nonTexte ? (niveauNonTexte(ratio) === 'OK' ? 'OK (3:1 non textuel)' : 'Échec') : niveauTexte(ratio)
    const echec = niveau === 'Échec'
    return `<tr>
      <td><svg class="contraste__apercu" viewBox="0 0 44 32" role="img" aria-label="Exemple : texte ${texte} sur fond ${fond}"><rect width="44" height="32" rx="4" style="fill:var(--${fond})"/><text x="22" y="21" text-anchor="middle" style="fill:var(--${texte})">Aa</text></svg></td>
      <th scope="row" class="chiffre">${texte} / ${fond}</th>
      <td class="chiffre">${formaterRatio(ratio)}</td>
      <td><span class="badge${echec ? ' badge--echec' : ''}">${ctx.e(niveau)}</span></td>
      <td class="discret">${ctx.e(note ?? '')}</td>
    </tr>`
  }).join('')
  return `<div class="tableau-defilant" role="region" aria-label="Rapports de contraste" tabindex="0">
    <table class="tableau tableau--cartes">
      <thead><tr><th scope="col"><span class="sr-only">Aperçu</span></th><th scope="col">Texte / fond</th><th scope="col">Rapport</th><th scope="col">Niveau WCAG</th><th scope="col">Usage</th></tr></thead>
      <tbody>${lignes}</tbody>
    </table>
  </div>`
}

function rendreProportions(ctx) {
  const parts = [
    { nom: 'night', part: 70 },
    { nom: 'night-2', part: 15 },
    { nom: 'snow', part: 8 },
    { nom: 'mist', part: 5 },
    { nom: 'amber', part: 2 },
  ]
  const segments = parts
    .map((p) => `<span class="proportions__segment proportions__segment--${p.nom}" style="flex-basis:${p.part}%;background:var(--${p.nom})"></span>`)
    .join('')
  const legende = parts.map((p) => `<li><span class="chiffre">${p.part} %</span> ${p.nom}</li>`).join('')
  return `<figure class="proportions">
    <div class="proportions__barre" aria-hidden="true">${segments}<span class="proportions__plafond" style="left:95%"><span class="etiquette">ambre 5 % max</span></span></div>
    <figcaption><ul class="proportions__legende" role="list">${legende}</ul></figcaption>
  </figure>`
}

function rendreRegleAmbre(ctx) {
  const oui = ['La lumière : fenêtre, écran, lampe, feu', 'Les chiffres clés', 'L’action principale', 'L’élément actif (index, filtre, onglet)', 'L’anneau de focus clavier']
  const non = ['Une bordure ou un fond décoratif', 'Un titre entier', 'Une icône d’illustration', 'Un lien secondaire', 'Une deuxième couleur vive']
  const liste = (items) => `<ul class="liste-regles" role="list">${items.map((i) => `<li>${ctx.e(i)}</li>`).join('')}</ul>`
  return `<div class="regle-ambre">
    <div><p class="etiquette">L’ambre est permis pour</p>${liste(oui)}</div>
    <div><p class="etiquette">Jamais pour</p>${liste(non)}</div>
  </div>`
}

export function rendre(ctx, section) {
  const corps = [
    bloc(ctx, { titre: 'Huit couleurs', contenu: rendreNuancier(ctx) }),
    bloc(ctx, {
      titre: 'Contrastes réels',
      contenu: rendreContrastes(ctx),
      legende: 'Calculés à l’assemblage depuis tokens.css (WCAG 2). Les tons transparents sont mesurés posés sur night. Le niveau se juge sur la valeur exacte, arrondie vers le bas à l’affichage : mist sur night fait 6,96:1, donc AA et pas AAA.',
    }),
    bloc(ctx, {
      titre: 'Proportions sur un écran',
      contenu: rendreProportions(ctx),
      legende: 'Night environ 70 %, night-2 15 %, snow 8 %, mist 5 %, ambre de 2 à 5 %. Au-delà de 5 %, l’ambre cesse d’être une lumière et devient une décoration.',
    }),
    bloc(ctx, { titre: 'Où l’ambre a sa place', contenu: rendreRegleAmbre(ctx) }),
  ].join('\n')
  return enveloppeSection(ctx, section, { chapo: 'Huit couleurs : six neutres et deux tons d’ambre, réservés à la lumière.', corps })
}
