// Section 03 · Références traduites : les deux références plan par plan (CLAUDE.md, section C),
// chacune avec ce qu'on y voit et ce qu'elle devient chez nous. On garde le procédé, jamais l'objet :
// chaque vignette dessine notre version (svg/scenes.mjs), jamais l'igloo ni leurs objets.
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'
import { vignette } from '../../svg/kit.mjs'
import { dessinerScene } from '../../svg/scenes.mjs'

const REFERENCE_A = [
  ['A1', 'Un tout petit dôme en fil de fer au centre d’un fond presque blanc.', 'Une minuscule cabane A-frame en fil de fer, entourée de quelques points de données.'],
  ['A2', 'L’objet grandit ; un treillis de segments flotte autour, à plusieurs profondeurs.', 'Les points se relient en treillis et dessinent la cabane ; les segments proches sont flous.'],
  ['A3', 'L’objet devient solide sur une butte de neige ; le treillis s’efface.', 'La cabane devient matière (bois, neige, vitre éteinte) sur une île de neige.'],
  ['A4', 'Un sommet rocheux enneigé apparaît ; la caméra recule et monte.', 'La montagne sort de la brume autour de la cabane, avec le même mouvement de caméra.'],
  ['A5', 'Plan large dans la brume, interface minuscule aux quatre coins.', 'Plan large ; KU, trois lignes de micro-texte et « Faites défiler », en Geist Mono.'],
  ['A6', 'L’objet s’ouvre, la lumière s’échappe des joints, des franges de couleur passent.', 'Le jour tombe et la fenêtre s’allume en ambre ; l’aberration ne sert qu’à la transition.'],
  ['A7', 'Un objet flotte, relié à des étiquettes par de fines lignes de rappel.', 'Les lignes de rappel annotent le bureau et l’écran : SQL, Power BI, Python.'],
  ['A8', 'La caméra traverse un anneau lumineux.', 'La caméra traverse la grande vitre : l’extérieur devient le bureau.'],
  ['A9', 'Une figurine faite de particules ; des liens entre crochets.', 'Mon avatar en points au contact, avec [ LinkedIn ] [ GitHub ] [ Email ].'],
  ['A10', 'Retour au début, en boucle.', 'L’avatar se dissout en points et on revient au nuage du début.'],
]

const REFERENCE_B = [
  ['B1', 'Texte géant qui défile ; une pilule de chargement devient un bouton.', 'Fond snow, « DATA ANALYST • KEREM UYSAL • IA & DATA • » ; la pilule devient « Entrer ».'],
  ['B2', 'Buste 3D au centre, nom à gauche, métier qui alterne à droite.', 'Mon avatar en argile grise ; DATA ANALYST en ambre, puis SQL, POWER BI, IA GÉNÉRATIVE.'],
  ['B3', 'La caméra s’approche ; l’avatar glisse à gauche ; un paragraphe à droite.', 'La même chorégraphie, avec mon texte « À propos ».'],
  ['B4', 'L’avatar tape devant un grand écran rose ; deux cartes en accordéon.', 'L’écran montre mes vrais dashboards ; chaque carte s’ouvre sur les projets qui prouvent la compétence.'],
  ['B5', 'Timeline sur trois colonnes ; un point lumineux descend avec le scroll.', 'Du Bac 2025 à l’objectif de sept. 2027. Le point est ambre ; le titre reste en snow.'],
  ['B6', 'Rangée horizontale épinglée, cartes en zigzag.', 'Mes quatre projets en vedette, puis « Voir tous les projets ».'],
  ['B7', 'Grille de tuiles sombres qui tombent en cascade.', 'La stack avec des niveaux honnêtes (3, 2 ou 1 segment) et les projets qui les prouvent.'],
  ['B8', 'La pilule email devient un bouton ; le nom en grand ; des colonnes de liens.', '« Me contacter → » en ambre, « Copier l’email », puis Email, Localisation, Réseaux.'],
  ['B9', 'Une page de tous les projets, en grille de trois colonnes.', '/projets avec des filtres façon Power BI : Tous, Data, IA, Dev web.'],
]

function grille(ctx, liste) {
  return `<ol class="references" role="list">${liste.map(([id, reference, nous]) => `<li class="reference">
    <figure>
      ${dessinerScene(ctx, id, { description: ctx.e(`${id}, notre version : ${nous}`), vignette })}
      <figcaption>
        <p class="reference__id chiffre">${id}</p>
        <p class="petit discret"><span class="etiquette">Référence</span> ${ctx.e(reference)}</p>
        <p class="petit"><span class="etiquette">Chez nous</span> ${ctx.e(nous)}</p>
      </figcaption>
    </figure>
  </li>`).join('')}</ol>`
}

function ecarts(ctx) {
  const colonnes = [
    ['Ce qu’on garde', ['La genèse : du fil de fer à la matière', 'Le treillis de points, image des données', 'La brume, la profondeur, le monochrome', 'La micro-interface en monospace', 'Des transitions sans coupure, pilotées par le scroll', 'La structure du site et la chorégraphie caméra-sections']],
    ['Ce qu’on change', ['Le violet devient ambre, et l’ambre reste une lumière', 'Le fond violacé devient anthracite neutre', 'L’avatar, c’est Kerem', 'L’écran rose montre ses vrais dashboards', 'Des filtres façon Power BI, des niveaux honnêtes, des liens entre compétences et projets']],
    ['Ce qu’on ne reprend pas', ['L’igloo', 'Leurs logos, leurs objets, leurs textes', 'Leurs modèles 3D et leurs visuels']],
  ]
  return `<div class="ecarts">${colonnes.map(([titre, items]) => `<div><p class="etiquette">${ctx.e(titre)}</p><ul role="list">${items.map((i) => `<li>${ctx.e(i)}</li>`).join('')}</ul></div>`).join('')}</div>`
}

export function rendre(ctx, section) {
  const corps = [
    bloc(ctx, { titre: 'Ce qu’on garde, ce qu’on change', contenu: ecarts(ctx), classe: 'bloc--premier' }),
    bloc(ctx, { titre: 'Référence A · l’entrée', contenu: grille(ctx, REFERENCE_A), legende: 'A1 à A6 font l’entrée du site ; A7 à A10 inspirent les passages vers le bureau et la fin du contact.' }),
    bloc(ctx, { titre: 'Référence B · la structure du site', contenu: grille(ctx, REFERENCE_B) }),
  ].join('\n')
  return enveloppeSection(ctx, section, {
    chapo: 'Les deux références, plan par plan, et ce qu’elles deviennent ici. On garde le procédé, jamais l’objet.',
    corps,
  })
}
