// Section 11 · Ambiances : l'état « jour » du début de l'entrée, puis trois lumières candidates pour l'heure bleue.
// Chaque image est calculée depuis ambiance.json (svg/paysage.mjs) ; le tableau affiche les mêmes valeurs.
// Le contraste du micro-texte est calculé avec les formules de la scène (brouillard, vignettage).
import { hexVersRgb, melangerLineaire, rgbVersHex } from '../../lib/couleur.mjs'
import { formaterRatio, niveauTexte } from '../../lib/contraste.mjs'
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'
import { couleursDuPaysage, mesurerInterface, paysage } from '../../svg/paysage.mjs'

const fr = (n) => String(n).replace('.', ',') // 0,95 et non 0.95

/** Les quatre états dans l'ordre d'affichage, avec leur numéro de choix. */
function etats(ctx) {
  const { jour, candidates } = ctx.ambiance
  return [
    { id: 'jour', num: '0', etat: jour, neige: false },
    { id: 'brume-claire', num: '1', etat: candidates['brume-claire'], neige: true },
    { id: 'heure-bleue', num: '2', etat: candidates['heure-bleue'], neige: true },
    { id: 'nuit-tombee', num: '3', etat: candidates['nuit-tombee'], neige: true },
  ]
}

/** Couleurs du micro-texte (hex) par zone, lues dans ambiance.json. */
const couleursTexte = (ctx, etat) => ({
  haut: ctx.tokens[etat.interface.texte.haut],
  bas: ctx.tokens[etat.interface.texte.bas],
})

function mesureLisible(ctx, etat) {
  const m = mesurerInterface(etat, ctx.ambiance.plans, couleursTexte(ctx, etat))
  const ligne = (zone, ratio) => `<span class="ambiance__ratio${ratio < 4.5 ? ' ambiance__ratio--faible' : ''}">${zone} ${ctx.e(etat.interface.texte[zone === 'en haut' ? 'haut' : 'bas'])} ${formaterRatio(ratio)} · ${niveauTexte(ratio)}</span>`
  return { m, html: `${ligne('en haut', m.haut)} · ${ligne('en bas', m.bas)}` }
}

/** Rôle d'un état dans le choix de Kerem : retenu, étape intermédiaire de l'entrée, ou rien. */
function role(ctx, id) {
  const { origine, progression } = ctx.ambiance.choisi
  if (id === origine.base) return 'Retenue'
  if (id !== 'jour' && progression.etapes.includes(id)) return 'Étape de l’entrée'
  return ''
}

function figure(ctx, { id, num, etat, neige }) {
  const couleurs = couleursDuPaysage(etat, ctx.ambiance.plans)
  const statut = role(ctx, id)
  // Flocons : la neige du premier plan, éclaircie (ils sont plus près et pris dans la lumière du ciel).
  const flocon = rgbVersHex(melangerLineaire(hexVersRgb(couleurs.sol), hexVersRgb('#FFFFFF'), 0.45))
  const { html } = mesureLisible(ctx, etat)
  const image = paysage(ctx, etat, {
    id: `paysage-${id}`,
    cabane: id === 'jour' ? 'filaire' : 'pleine',
    treillis: id === 'jour' ? 'simple' : false,
    description: `${etat.nom} : ${etat.intention}`,
  })
  return `<figure class="ambiance" id="ambiance-${id}">
    <div class="ambiance__image">
      ${image}
      ${neige ? `<canvas class="ambiance__neige" aria-hidden="true" data-couleur="${flocon}" data-graine="${Number(num) * 17}"></canvas>` : ''}
      <span class="grain-local" aria-hidden="true"></span>
    </div>
    <figcaption class="ambiance__legende">
      <p class="ambiance__nom"><span class="ambiance__num chiffre" aria-hidden="true">${num === '0' ? '—' : num}</span>${ctx.e(etat.nom)}${statut ? `<span class="ambiance__statut${statut === 'Retenue' ? ' ambiance__statut--retenue' : ''}">${ctx.e(statut)}</span>` : ''}</p>
      <p class="texte discret ambiance__intention">${ctx.e(etat.intention.charAt(0).toUpperCase() + etat.intention.slice(1))}.</p>
      <p class="ambiance__mesure etiquette">Micro-texte : ${html}</p>
    </figcaption>
  </figure>`
}

const pastille = (hex) => `<span class="nuance-mini"><span class="nuance-mini__pastille" style="background:${hex}" aria-hidden="true"></span><span class="chiffre">${hex}</span></span>`

/** Lignes du tableau comparatif : libellé, puis la valeur à afficher pour un état. */
function lignes(ctx) {
  return [
    ['Ciel, haut → horizon', (e) => `${pastille(e.ciel.haut)} ${pastille(e.ciel.horizon)}`],
    ['Brouillard', (e) => `${pastille(e.brouillard.couleur)} <span class="chiffre">densité ${fr(e.brouillard.densite)}</span> · caché à 95 % à <span class="chiffre">${Math.round(e.brouillard.visibilite95)} m</span>`],
    ['Neige · roche · bois', (e) => `${pastille(e.neige.albedo)} ${pastille(e.roche.albedo)} ${pastille(e.bois.albedo)}`],
    ['Lumière ambiante', (e) => `<span class="chiffre">× ${fr(e.lumieres.ambiante.intensite)}</span>`],
    ['Hémisphère : ciel · sol', (e) => `${pastille(e.lumieres.hemisphere.ciel)} ${pastille(e.lumieres.hemisphere.sol)} <span class="chiffre">× ${fr(e.lumieres.hemisphere.intensite)}</span>`],
    ['Directionnelle', (e) => `<span class="chiffre">× ${fr(e.lumieres.directionnelle.intensite)}</span> · ${ctx.e(e.lumieres.directionnelle.role)}`],
    ['Lampe intérieure', (e) => `<span class="chiffre">${e.lumieres.interieure.intensite} cd</span>`],
    ['Fenêtre : émissif · lueur sur la neige', (e) => (e.fenetre.intensiteEmissive ? `<span class="chiffre">× ${fr(e.fenetre.intensiteEmissive)} · ${e.fenetre.lueurNits} nits</span>` : 'éteinte')],
    ['Exposition · tone mapping', (e) => `<span class="chiffre">${fr(e.exposition)}</span> · ${e.toneMapping}`],
    ['Bloom : intensité · seuil · rayon', (e) => `<span class="chiffre">${fr(e.post.bloom.intensite)} · ${fr(e.post.bloom.seuil)} · ${fr(e.post.bloom.rayon)}</span>`],
    ['Grain', (e) => `<span class="chiffre">${fr(e.post.grain)}</span>`],
    ['Vignettage : décalage · obscurité', (e) => `<span class="chiffre">${fr(e.post.vignette.decalage)} · ${fr(e.post.vignette.obscurite)}</span>`],
    ['Profondeur de champ : point · flou', (e) => `<span class="chiffre">${e.post.profondeurDeChamp.distanceMiseAuPoint} m · ${fr(e.post.profondeurDeChamp.flou)}</span>`],
    ['Voile bas sous le micro-texte', (e) => (e.interface.voileBas ? `<span class="chiffre">${fr(e.interface.voileBas)}</span>` : 'aucun')],
    ['Micro-texte : couleur et contraste', (e) => mesureLisible(ctx, e).html],
  ]
}

function tableau(ctx) {
  const liste = etats(ctx)
  const tete = liste.map(({ id, num, etat }) => {
    const statut = role(ctx, id)
    return `<th scope="col">${num === '0' ? '' : `${num} · `}${ctx.e(etat.nom.replace(/ \(.*\)$/, ''))}${statut ? ` <span class="ambiance__statut${statut === 'Retenue' ? ' ambiance__statut--retenue' : ''}">${ctx.e(statut)}</span>` : ''}</th>`
  }).join('')
  const corps = lignes(ctx).map(([libelle, valeur]) => `<tr><th scope="row">${ctx.e(libelle)}</th>${liste.map(({ etat }) => `<td>${valeur(etat)}</td>`).join('')}</tr>`).join('')
  return `<div class="tableau-defilant" role="region" aria-label="Valeurs des ambiances" tabindex="0">
    <table class="tableau tableau--ambiances"><thead><tr><th scope="col">Réglage</th>${tete}</tr></thead><tbody>${corps}</tbody></table>
  </div>`
}

function bible(ctx) {
  const items = [
    ['Palette', 'Des gris froids, saturés à 8 % au plus. L’ambre n’existe que dans la lumière : fenêtre, écran, lampe.'],
    ['Lumière', 'Un ciel couvert qui éclaire doucement, sans ombre dure. Une seule source chaude : la cabane. Plus il fait sombre, plus elle compte.'],
    ['Matières', 'Neige, pierre, bois désaturé, argile mate pour l’avatar. Rien ne brille, sauf l’ambre.'],
    ['Brouillard', 'Il crée la profondeur. Les distances sont en mètres ; on règle la densité par la distance où tout disparaît à 95 %.'],
    ['Caméra', 'Elle avance, monte et recule lentement, sans coupe. Le scroll la pilote.'],
  ]
  return `<dl class="bible">${items.map(([t, d]) => `<div><dt class="etiquette">${ctx.e(t)}</dt><dd>${ctx.e(d)}</dd></div>`).join('')}</dl>`
}

/**
 * Le choix de Kerem, lu dans ambiance.json (choisi). Les contrastes sont recalculés à chaque assemblage :
 * si une valeur change, le texte suit.
 */
function choix(ctx) {
  const { candidates, choisi } = ctx.ambiance
  const nom = (id) => (id === 'jour' ? 'jour' : candidates[id].nom.toLowerCase())
  const retenue = candidates[choisi.origine.base]
  const mesure = (etat) => mesurerInterface(etat, ctx.ambiance.plans, couleursTexte(ctx, etat))
  const finale = mesure(retenue)
  const intermediaires = choisi.progression.etapes.slice(1, -1)
  const lignes = [
    `Retenue : ${retenue.nom}, sans emprunt. Validée par ${choisi.valide.par} le 8 novembre 2026.`,
    `Pendant l’entrée, la nuit tombe : ${choisi.progression.etapes.map(nom).join(', puis ')}. Les valeurs passent d’un état à l’autre (phases 03 et 05).`,
    `Micro-texte en snow sur la nuit tombée : ${formaterRatio(Math.min(finale.haut, finale.bas))} au plus faible. ${intermediaires.map((id) => `Au passage par l’${nom(id)}, un voile bas de ${fr(candidates[id].interface.voileBas)} garde « Faites défiler » à ${formaterRatio(mesure(candidates[id]).bas)}.`).join(' ')}`,
  ]
  return `<ol class="recommandation" role="list">${lignes.map((l) => `<li>${ctx.e(l)}</li>`).join('')}</ol>`
}

export function rendre(ctx, section) {
  const [jour, ...candidates] = etats(ctx)
  const corps = [
    bloc(ctx, { titre: 'La bible du monde', contenu: bible(ctx), classe: 'bloc--premier' }),
    bloc(ctx, {
      titre: 'Le jour, au début de l’entrée',
      contenu: figure(ctx, jour),
      legende: 'Commun aux trois ambiances : l’entrée commence toujours ici.',
    }),
    bloc(ctx, { titre: 'Le choix', contenu: choix(ctx) }),
    bloc(ctx, {
      titre: 'Les trois lumières étudiées',
      contenu: `<div class="ambiances">${candidates.map((c) => figure(ctx, c)).join('')}</div>`,
      legende: 'Aperçus calculés avec la formule du brouillard de three.js et les distances en mètres. L’éclairage est simplifié : la vraie scène sera recalée en phase 05.',
    }),
    bloc(ctx, {
      titre: 'Les valeurs, côte à côte',
      contenu: tableau(ctx),
      legende: 'Lues dans design/ambiance.json. Contraste prévu : la couleur du texte face au fond le moins favorable, vignettage et voile compris ; objectif 4,5:1. Le contraste rendu (les pixels réellement dessinés) est mesuré sur les exports par scripts/da-ambiances.mjs.',
    }),
  ].join('\n')
  return enveloppeSection(ctx, section, {
    chapo: 'Le jour ouvre l’entrée, puis la nuit tombe : l’heure bleue, puis la nuit tombée, l’ambiance retenue.',
    corps,
  })
}
