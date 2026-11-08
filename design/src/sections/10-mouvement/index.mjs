// Section 10 · Mouvement : les réglages de motion.json, puis huit démos (a à h).
// Les tables sont générées depuis motion.json ; les démos lisent leurs valeurs dans le même fichier,
// injecté dans la page (#donnees-motion). Chaque démo se rejoue et a sa version « mouvement réduit ».
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'
import { carteCompetence, carteProjet } from '../07-composants/contenus.mjs'

const NOMS_COURBES = { outExpo: 'ease-out-expo', inOut: 'ease-in-out', lineaire: 'linéaire' }
const FREQUENCES = { rare: 'rare', frequente: 'fréquente', occasionnelle: 'occasionnelle', boucle: 'en boucle', scroll: 'liée au scroll', continue: 'continue' }

/** Petit tracé d'une courbe d'accélération (temps en abscisse, progression en ordonnée). */
function traceCourbe(css) {
  const m = css.match(/cubic-bezier\(([^)]+)\)/)
  const [x1, y1, x2, y2] = m ? m[1].split(',').map(Number) : [0, 0, 1, 1]
  const c = 56 // côté utile
  const p = (x, y) => `${(4 + x * c).toFixed(1)} ${(60 - y * c).toFixed(1)}`
  return `<svg class="courbe__trace" viewBox="0 0 64 64" aria-hidden="true">
    <path class="courbe__repere" d="M4 60 H60 M4 60 V4"/>
    <path d="M${p(0, 0)} C ${p(x1, y1)}, ${p(x2, y2)}, ${p(1, 1)}"/>
  </svg>`
}

function courbes(ctx) {
  return `<ul class="courbes" role="list">${Object.entries(ctx.motion.courbes).map(([nom, c]) => `<li class="courbe">
    ${traceCourbe(c.css)}
    <div class="courbe__texte">
      <p class="courbe__nom">${ctx.e(NOMS_COURBES[nom] ?? nom)}</p>
      <p class="etiquette">${ctx.e(c.css)} · GSAP ${ctx.e(c.gsap)}</p>
      <p class="petit discret">${ctx.e(c.usage.charAt(0).toUpperCase() + c.usage.slice(1))}.</p>
    </div>
  </li>`).join('')}</ul>`
}

/** Durées, écarts et distances, avec pour chaque durée les animations qui l'utilisent (lu dans motion.json). */
function reglages(ctx) {
  const { durees, ecarts, distances, animations } = ctx.motion
  const utilisateurs = (ms) => Object.values(animations).filter((a) => a.duree === ms).map((a) => a.terme)
  const colonne = (titre, lignes) => `<div class="reglages__colonne"><p class="etiquette">${ctx.e(titre)}</p><dl>${lignes.map(([nom, valeur, note]) => `<div><dt>${ctx.e(nom)}</dt><dd class="chiffre">${valeur}</dd>${note ? `<dd class="petit discret reglages__note">${ctx.e(note)}</dd>` : ''}</div>`).join('')}</dl></div>`
  return `<div class="reglages">
    ${colonne('Durées', Object.entries(durees).map(([nom, ms]) => [nom, `${ms} ms`, utilisateurs(ms).slice(0, 4).join(', ')]))}
    ${colonne('Écarts entre éléments', Object.entries(ecarts).map(([nom, ms]) => [nom, `${ms} ms`]))}
    ${colonne('Distances', Object.entries(distances).map(([nom, px]) => [nom, `${px} px`]))}
  </div>
  <ul class="regles-mouvement" role="list">${ctx.motion.regles.map((r) => `<li>${ctx.e(r)}</li>`).join('')}</ul>`
}

const NOMS_PROPRIETES = { 'border-color': 'contour', opacity: 'couleur du visuel' }

/** Description lisible de la version réduite d'une animation (tous les cas de motion.json). */
function texteReduit(a) {
  const r = a.reduit
  if (r.note) return r.note.charAt(0).toUpperCase() + r.note.slice(1)
  if (r.contenu) return `Ouverture immédiate ; le contenu apparaît en fondu de ${r.contenu.duree} ms`
  if (r.bascule) return 'Bascule immédiate'
  if ('transform' in r && r.transform === null) {
    const autres = Object.entries(r).filter(([cle, v]) => cle !== 'transform' && typeof v === 'number')
    return autres.length ? `Sans déplacement ; ${autres.map(([cle, ms]) => `${NOMS_PROPRIETES[cle] ?? cle} en ${ms} ms`).join(', ')}` : 'Sans déplacement'
  }
  const parties = [r.proprietes?.join(',') === 'opacity' ? 'Opacité seule' : null, r.duree ? `${r.duree} ms` : 'immédiat', r.ecart === 0 ? 'sans décalage' : null]
  const texte = parties.filter(Boolean).join(', ')
  return texte.charAt(0).toUpperCase() + texte.slice(1)
}

/** Ligne de valeurs d'une démo : durée, courbe, écart, fréquence. */
function valeurs(a) {
  const morceaux = []
  if (a.duree) morceaux.push(`${a.duree} ms`)
  if (a.cycle) morceaux.push(`toutes les ${a.cycle} ms`)
  if (a.pistes) morceaux.push(a.pistes.map((p) => `${p.duree} ms`).filter((v, i, t) => t.indexOf(v) === i).join(' et '))
  if (a.courbe) morceaux.push(NOMS_COURBES[a.courbe])
  if (a.pilotage) morceaux.push('sans courbe : suit le défilement')
  if (a.ecart) morceaux.push(`${a.ecart} ms d’écart`)
  morceaux.push(FREQUENCES[a.frequence] ?? a.frequence)
  return morceaux.join(' · ')
}

/** Gabarit commun d'une démo. */
function demo(ctx, { lettre, cle, titre, scene, classe = '' }) {
  const a = ctx.motion.animations[cle]
  const rejouer = ctx.icone('rotate-ccw', { taille: 14 })
  return `<article class="demo ${classe}" data-anim="${lettre}" aria-labelledby="demo-${lettre}-titre">
    <header class="demo__tete">
      <h4 class="demo__titre" id="demo-${lettre}-titre"><span class="demo__lettre chiffre" aria-hidden="true">${lettre}</span>${ctx.e(titre)}</h4>
      <p class="etiquette">${ctx.e(a.terme)}</p>
    </header>
    <div class="demo__scene">${scene}</div>
    <p class="demo__valeurs">${ctx.e(valeurs(a))}</p>
    <p class="petit discret">${ctx.e(a.but.charAt(0).toUpperCase() + a.but.slice(1))}. Réduit : ${ctx.e(texteReduit(a).charAt(0).toLowerCase() + texteReduit(a).slice(1))}.</p>
    <div class="demo__commandes">
      <button type="button" class="outil demo__rejouer">${rejouer}<span>Rejouer</span></button>
      <button type="button" class="outil demo__bascule" aria-pressed="false">Mouvement réduit</button>
    </div>
  </article>`
}

function scenes(ctx) {
  const { identite, parcours, projets, ui } = ctx.contenu
  const pitch = identite.pitch
  const mots = pitch.texte.split(' ').map((m) => `<span class="demo-mots__mot${m.startsWith(pitch.motAmbre) ? ' ambre' : ''}">${ctx.e(m)}</span>`).join(' ')
  const nom = identite.nom.split(' ').map((m) => `<span class="demo-masque__ligne"><span class="demo-masque__mot">${ctx.e(m)}</span></span>`).join(' ')
  const chiffre = identite.chiffresCles[0]
  const nombre = Number(chiffre.valeur.replace(/\D/g, ''))
  const affiche = new Intl.NumberFormat('fr-FR').format(nombre)
  const nasa = projets.find((p) => p.slug === 'nasa-data-pipeline')
  const alternes = identite.motsAlternes
  const actuel = parcours.findIndex((l) => l.id === 'b2-ynov')
  return {
    a: `<p class="demo-mots">${mots}</p>`,
    b: `<p class="demo-masque">${nom}</p>`,
    c: `<p class="demo-compteur"><span class="demo-compteur__valeur chiffre ambre" aria-hidden="true"><span class="demo-compteur__fantome">${affiche}</span><span class="demo-compteur__anime" data-final="${affiche}">${affiche}</span></span><span class="sr-only">${affiche} </span><span class="demo-compteur__libelle">${ctx.e(chiffre.libelle)}</span></p>`,
    d: `<div class="demo-survol">${carteProjet(ctx, nasa, { classe: 'carte-projet--demo' })}</div>`,
    e: `<div class="demo-accordeon">${carteCompetence(ctx, { vivant: true, id: 'demo-competence-etl' })}</div>`,
    f: `<div class="demo-flou__bloc"><p class="etiquette">${ctx.e(ui.fr.chapitres.parcours)}</p><p class="h2">${ctx.e(ui.fr.parcours.titre)}</p></div>`,
    g: `<p class="demo-alternes"><span class="demo-alternes__avant petit">${ctx.e(ui.fr.accueil.avant)}</span>
      <span class="sr-only">${alternes.map((m) => ctx.e(m.texte)).join(', ')}</span>
      <span class="demo-alternes__fenetre" aria-hidden="true">${alternes.map((m, i) => `<span class="demo-alternes__mot${m.ambre ? ' ambre' : ''}"${i ? ' style="transform:translateY(100%)"' : ''}>${ctx.e(m.texte)}</span>`).join('')}</span></p>`,
    h: `<div class="demo-timeline__defilement" tabindex="0" role="region" aria-label="Parcours : faire défiler pour faire avancer le point">
      <div class="demo-timeline__liste">
        <span class="demo-timeline__rail" aria-hidden="true"></span><span class="demo-timeline__point" aria-hidden="true"></span>
        <ol role="list">${parcours.map((l, i) => `<li class="demo-timeline__ligne${l.ambre ? ' demo-timeline__ligne--objectif' : ''}${i === actuel ? ' demo-timeline__ligne--actuelle' : ''}">
          <span class="etiquette">${ctx.e(l.periode)}</span><span class="demo-timeline__titre">${ctx.e(l.titre)}${l.organisation ? ` · ${ctx.e(l.organisation)}` : ''}</span></li>`).join('')}</ol>
      </div>
    </div>`,
  }
}

function demos(ctx) {
  const s = scenes(ctx)
  const liste = [
    { lettre: 'a', cle: 'texteMotParMot', titre: 'Texte mot par mot' },
    { lettre: 'b', cle: 'titreMasque', titre: 'Titre révélé par un masque' },
    { lettre: 'c', cle: 'compteur', titre: 'Compteur' },
    { lettre: 'd', cle: 'survolCarte', titre: 'Survol d’une carte' },
    { lettre: 'e', cle: 'accordeon', titre: 'Accordéon' },
    { lettre: 'f', cle: 'transitionSection', titre: 'Changement de chapitre' },
    { lettre: 'g', cle: 'motsAlternes', titre: 'Mots qui alternent' },
    { lettre: 'h', cle: 'pointTimeline', titre: 'Point de la timeline' },
  ]
  return `<div class="demos">${liste.map((d) => demo(ctx, { ...d, scene: s[d.lettre] })).join('')}</div>`
}

/** Les autres animations du site (montrées dans la section 07), en table depuis motion.json. */
function catalogue(ctx) {
  const montrees = new Set(['texteMotParMot', 'titreMasque', 'compteur', 'survolCarte', 'accordeon', 'transitionSection', 'motsAlternes', 'pointTimeline'])
  const lignes = Object.entries(ctx.motion.animations).filter(([cle]) => !montrees.has(cle)).map(([, a]) => `<tr>
    <th scope="row"><span class="etiquette">${ctx.e(a.terme)}</span></th>
    <td>${ctx.e(a.but)}</td><td class="chiffre">${ctx.e(valeurs(a))}</td><td>${ctx.e(texteReduit(a))}</td></tr>`).join('')
  return `<div class="tableau-defilant" role="region" aria-label="Autres animations du site" tabindex="0">
    <table class="tableau tableau--mouvement"><thead><tr><th scope="col">Terme</th><th scope="col">À quoi elle sert</th><th scope="col">Réglage</th><th scope="col">Mouvement réduit</th></tr></thead><tbody>${lignes}</tbody></table>
  </div>`
}

function immobile(ctx) {
  const items = [
    ['La navigation et l’index', 'Ils changent tout de suite. On s’y repère, on ne les regarde pas.'],
    ['L’anneau de focus', 'Il apparaît sans délai, à chaque touche Tab.'],
    ['Les valeurs qu’on lit', 'Barres des graphiques, chiffres des tableaux : ils ne bougent pas pour le style. Le compteur (démo c) est l’exception, une seule fois par écran.'],
    ['Les textes longs', 'Ils apparaissent en fondu, en bloc. Le mot par mot reste réservé aux phrases courtes.'],
    ['Les raccourcis clavier', 'Échap, Entrée, flèches : aucune animation, la réponse est immédiate.'],
  ]
  return `<dl class="immobile">${items.map(([t, d]) => `<div><dt>${ctx.e(t)}</dt><dd class="petit discret">${ctx.e(d)}</dd></div>`).join('')}</dl>`
}

export function rendre(ctx, section) {
  const donnees = JSON.stringify(ctx.motion).replace(/</g, '\\u003c')
  const corps = [
    `<script type="application/json" id="donnees-motion">${donnees}</script>`,
    bloc(ctx, { titre: 'Courbes', contenu: courbes(ctx), classe: 'bloc--premier' }),
    bloc(ctx, { titre: 'Durées, écarts, distances', contenu: reglages(ctx) }),
    bloc(ctx, { titre: 'Huit démos', contenu: demos(ctx), legende: 'Chaque démo lit ses valeurs dans design/motion.json. L’interrupteur part du réglage de ton système.' }),
    bloc(ctx, { titre: 'Ce qui ne bouge pas', contenu: immobile(ctx) }),
    bloc(ctx, { titre: 'Les autres animations du site', contenu: catalogue(ctx), legende: 'Elles sont visibles dans la section 07, sur les composants.' }),
  ].join('\n')
  return enveloppeSection(ctx, section, {
    chapo: 'Lent, amorti, jamais de rebond. Chaque animation a une raison et une version réduite.',
    corps,
  })
}
