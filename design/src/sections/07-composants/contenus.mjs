// Section 07 · composants de contenu : statuts, cartes, niveau, tuile, filtres, loader, toast, timeline, annotation.
import { composant, matrice } from './outils.mjs'

const NOMS_COURTS = { 'nasa-data-pipeline': 'NASA', 'pollution-meteo': 'Pollution' } // pastilles « Prouvé dans »

function statut(ctx, cle) {
  return `<span class="statut statut--${cle}">${['en-cours', 'en-ligne'].includes(cle) ? '<span class="statut__point" aria-hidden="true"></span>' : ''}${ctx.e(ctx.contenu.ui.fr.projets.statuts[cle])}</span>`
}

export function statuts(ctx) {
  return composant(ctx, {
    id: 'statuts',
    titre: 'Étiquettes de statut',
    note: 'Terminé : contour mist. En cours : point ambre qui pulse toutes les 2 s (fixe en mouvement réduit). En ligne : point ambre fixe. Prochainement : contour en pointillés. Le mot porte toujours l’information, le point ne fait que l’appuyer.',
    vivant: `<ul class="statuts" role="list">${['termine', 'en-cours', 'en-ligne', 'prochainement'].map((c) => `<li>${statut(ctx, c)}</li>`).join('')}</ul>`,
  })
}

/** Carte de projet (version de la section Projets). */
export function carteProjet(ctx, projet, { classe = '', vivant = false } = {}) {
  const { ui } = ctx.contenu
  const chiffre = projet.slug === 'nasa-data-pipeline' ? { valeur: '11 246', libelle: 'publications APOD analysées' } : null
  const outils = projet.outils.length ? projet.outils.join(' · ') : '—'
  const prochainement = projet.statut === 'prochainement'
  const corps = `<span class="carte-projet__tete"><span class="carte-projet__numero chiffre">${projet.numero}</span>${statut(ctx, projet.statut)}</span>
      <span class="carte-projet__visuel${prochainement ? ' carte-projet__visuel--vide' : ''}" aria-hidden="true"><span class="carte-projet__gris"></span><span class="carte-projet__couleur"></span></span>
      <span class="carte-projet__titre h3">${ctx.e(projet.titre)}</span>
      ${projet.question ? `<span class="carte-projet__question petit">${ctx.e(projet.question)}</span>` : `<span class="carte-projet__question petit">${ctx.e(projet.description)}</span>`}
      ${chiffre ? `<span class="carte-projet__chiffre"><span class="chiffre ambre">${chiffre.valeur}</span><span class="petit discret">${ctx.e(chiffre.libelle)}</span></span>` : ''}
      <span class="carte-projet__outils"><span class="etiquette">${ctx.e(ui.fr.projets.outilsEtFonctions)}</span><span class="petit">${ctx.e(outils)}</span></span>`
  if (vivant && projet.lien.url) {
    return `<a class="carte-projet ${classe}" href="${ctx.e(projet.lien.url)}" target="_blank" rel="noopener">${corps}<span class="sr-only"> ${ctx.e(ui.fr.liensExternes.nouvelOnglet)}</span></a>`
  }
  return `<div class="carte-projet ${classe}${prochainement ? ' carte-projet--prochainement' : ''}">${corps}</div>`
}

export function cartesProjet(ctx) {
  const nasa = ctx.contenu.projets.find((p) => p.slug === 'nasa-data-pipeline')
  const energie = ctx.contenu.projets.find((p) => p.slug === 'energie')
  const copie = (classe, etat) => (etat === 'desactive' ? carteProjet(ctx, energie, { classe: 'carte-projet--mini' }) : carteProjet(ctx, nasa, { classe: `carte-projet--mini ${classe}` }))
  return composant(ctx, {
    id: 'carte-projet',
    titre: 'Carte de projet',
    note: 'Numéro, nom, question, chiffre clé en ambre, outils, visuel en niveaux de gris. Au survol : la carte monte de 4 px, son contour passe à l’ambre (0,2 s) et le visuel reprend ses couleurs (0,45 s). Sans page, la carte reste fixe, en pointillés (projet Énergie, « Prochainement »).',
    matriceHtml: matrice(ctx, copie),
    vivant: `<div class="cartes-vivantes">${carteProjet(ctx, nasa, { vivant: true })}${carteProjet(ctx, energie)}</div>`,
  })
}

/** Carte de compétence : accordéon à coins en équerre, avec les projets qui la prouvent. */
export function carteCompetence(ctx, { classe = '', ouvert = false, vivant = false, id = 'competence-etl-preuves' } = {}) {
  const groupe = ctx.contenu.competences.find((g) => g.id === 'analyse')
  const comp = groupe.competences.find((c) => c.id === 'etl')
  const projets = ctx.contenu.projets
  const pastilles = comp.preuves
    .map((p) => {
      const projet = projets.find((x) => x.slug === p.slug)
      const nom = ctx.e(NOMS_COURTS[p.slug] ?? projet.titre)
      return vivant
        ? `<li><a class="pastille" href="${ctx.e(projet.lien.url)}" target="_blank" rel="noopener">${nom}<span class="sr-only"> ${ctx.e(ctx.contenu.ui.fr.liensExternes.nouvelOnglet)}</span></a></li>`
        : `<li><span class="pastille">${nom}</span></li>`
    })
    .join('')
  const plus = ctx.icone('plus', { taille: 18, classe: 'carte-competence__plus' })
  const idCorps = vivant ? id : ''
  const entete = vivant
    ? `<button type="button" class="carte-competence__bouton" aria-expanded="${ouvert}" aria-controls="${idCorps}" data-demo="accordeon"><span class="etiquette">${ctx.e(groupe.titre)}</span><span class="carte-competence__libelle">${ctx.e(comp.libelle)}</span>${plus}</button>`
    : `<span class="carte-competence__bouton"><span class="etiquette">${ctx.e(groupe.titre)}</span><span class="carte-competence__libelle">${ctx.e(comp.libelle)}</span>${plus}</span>`
  return `<div class="carte-competence equerres ${classe}${ouvert ? ' est-ouvert' : ''}">
    ${entete}
    <div class="carte-competence__corps"${idCorps ? ` id="${idCorps}"` : ''}><div class="carte-competence__interieur">
      <p class="etiquette">${ctx.e(`${ctx.contenu.ui.fr.competences.prouveDans} :`)}</p><ul class="pastilles" role="list">${pastilles}</ul>
    </div></div>
  </div>`
}

export function carteCompetences(ctx) {
  const copie = (classe, etat) => (etat === 'desactive' ? 'sans objet : une compétence a toujours au moins une preuve' : carteCompetence(ctx, { classe, ouvert: etat === 'actif' }))
  return composant(ctx, {
    id: 'carte-competence',
    titre: 'Carte de compétence',
    note: 'Accordéon à coins en équerre. Fermé, il montre la compétence ; ouvert, les projets qui la prouvent. Ouverture en 0,45 s, sans rebond. « Actif » = ouvert.',
    matriceHtml: matrice(ctx, copie),
    vivant: carteCompetence(ctx, { vivant: true }),
  })
}

function niveauHtml(ctx, niveau) {
  const n = ctx.contenu.stack.niveaux.find((x) => x.id === niveau)
  const barres = [1, 2, 3].map((i) => `<span class="niveau__barre${i <= n.segments ? ' est-plein' : ''}"></span>`).join('')
  return `<span class="niveau"><span class="niveau__barres" aria-hidden="true">${barres}</span><span class="niveau__libelle etiquette">${ctx.e(n.libelle)}</span></span>`
}

export function niveaux(ctx) {
  return composant(ctx, {
    id: 'niveau',
    titre: 'Indicateur de niveau',
    note: '3 barres de 14 × 4 px espacées de 3 px : pleines en ambre, vides en mist à 25 %. Le niveau est toujours écrit à côté : la couleur ne porte pas seule l’information.',
    vivant: `<ul class="niveaux" role="list">${['maitrise', 'progression', 'bases'].map((n) => `<li>${niveauHtml(ctx, n)}</li>`).join('')}</ul>`,
  })
}

const TUILES = [
  { id: 'sql', icone: 'database' },
  { id: 'python', icone: 'logo-python' },
  { id: 'power-bi', icone: 'chart-column' },
  { id: 'git', icone: 'logo-git' },
  { id: 'excel', icone: 'sheet' },
]

function tuileHtml(ctx, { id, icone }, { classe = '', vivant = false } = {}) {
  const outil = ctx.contenu.stack.outils.find((o) => o.id === id)
  const nom = id === 'git' ? 'Git' : outil.nom
  const interieur = `<span class="tuile__carre">${ctx.icone(icone, { taille: 28 })}</span><span class="tuile__nom">${ctx.e(nom)}</span>`
  // Pas de bouton tant que la tuile n'a pas d'action (l'infobulle « Utilisé dans » arrive en phase 10).
  return vivant
    ? `<li class="tuile-case"><span class="tuile ${classe}">${interieur}</span>${niveauHtml(ctx, outil.niveau)}</li>`
    : `<span class="tuile ${classe}">${interieur}</span>`
}

export function tuiles(ctx) {
  const copie = (classe, etat) => (etat === 'desactive' ? 'sans objet' : tuileHtml(ctx, TUILES[0], { classe }))
  return composant(ctx, {
    id: 'tuile',
    titre: 'Tuile de stack',
    note: 'Carré de 72 × 72 px, logo de 28 px, nom en dessous. Logos de technologies en monochrome ; pictogramme quand aucun logo libre n’existe (Excel, Power BI). Au survol, la tuile dira où l’outil a servi (phase 10).',
    matriceHtml: matrice(ctx, copie),
    vivant: `<ul class="tuiles" role="list">${TUILES.map((t) => tuileHtml(ctx, t, { vivant: true })).join('')}</ul>`,
  })
}

/** Filtres façon Power BI, calculés sur les 8 projets publiés (Énergie à part). */
function donneesFiltres(ctx) {
  const publies = ctx.contenu.projets.filter((p) => p.statut !== 'prochainement')
  const categories = ctx.contenu.ui.fr.projets.categories
  return [
    { cle: 'tous', libelle: ctx.contenu.ui.fr.pageProjets.filtres.tous, nombre: publies.length },
    ...Object.entries(categories).map(([cle, libelle]) => ({ cle, libelle, nombre: publies.filter((p) => p.categories.includes(cle)).length })),
  ].map((f) => ({ ...f, part: f.nombre / publies.length }))
}

function filtreHtml(ctx, f, { classe = '', vivant = false, actif = false } = {}) {
  const interieur = `<span class="filtre__libelle">${ctx.e(f.libelle)}</span><span class="filtre__nombre chiffre">${f.nombre}</span><span class="filtre__piste" aria-hidden="true"><span class="filtre__barre" style="width:${Math.round(f.part * 100)}%"></span></span>`
  return vivant
    ? `<button type="button" class="filtre" aria-pressed="${actif}" data-demo="filtre" data-cle="${f.cle}">${interieur}</button>`
    : `<span class="filtre ${classe}">${interieur}</span>`
}

export function filtres(ctx) {
  const liste = donneesFiltres(ctx)
  const data = liste.find((f) => f.cle === 'data')
  const copie = (classe) => filtreHtml(ctx, data, { classe })
  return composant(ctx, {
    id: 'filtre',
    titre: 'Filtre façon Power BI',
    note: 'Libellé, nombre de projets et mini-barre proportionnelle. Actif : fond --amber-soft et barre ambre. Désactivé quand le croisement des filtres ne laisse aucun projet.',
    matriceHtml: matrice(ctx, copie),
    vivant: `<div class="filtres" role="group" aria-label="${ctx.e(ctx.contenu.ui.fr.pageProjets.filtres.label)}">${liste.map((f) => filtreHtml(ctx, f, { vivant: true, actif: f.cle === 'tous' })).join('')}</div>`,
  })
}

export function loader(ctx) {
  const ui = ctx.contenu.ui.fr.loader
  const texte = ctx.e(ui.texteDefilant)
  const bande = `<span class="loader__bande" aria-hidden="true"><span>${texte} ${texte} </span><span>${texte} ${texte} </span></span>`
  return composant(ctx, {
    id: 'loader',
    titre: 'Pilule de chargement du loader',
    note: 'Sur fond neige : le texte géant défile en boucle, la pilule affiche le vrai pourcentage chargé, puis devient le bouton « Entrer ». Sur fond clair, le texte passe en night et l’anneau de focus reçoit un liseré night de 1 px.',
    vivant: `<div class="loader" data-surface="clair" data-demo="loader">
        <p class="sr-only">${texte}</p>${bande}
        <div class="loader__pilules">
          <span class="pilule-chargement" data-etape="charge"><span class="etiquette">${ctx.e(ui.chargement)}</span> <span class="pilule-chargement__pct chiffre">64${' '}%</span><span class="pilule-chargement__curseur" aria-hidden="true"></span></span>
          <button type="button" class="bouton pilule-entrer" aria-label="${ctx.e(ui.entrerLabel)}">${ctx.e(ui.entrer)}${ctx.icone('arrow-right', { taille: 16, classe: 'bouton__fleche' })}</button>
        </div>
        <button type="button" class="bouton bouton--secondaire bouton--petit loader__rejouer" data-demo="rejouer-loader">Rejouer</button>
      </div>`,
  })
}

export function toast(ctx) {
  const ui = ctx.contenu.ui.fr.contact
  return composant(ctx, {
    id: 'toast',
    titre: 'Toast « Email copié »',
    note: 'Entre par le bas en 0,45 s, reste 2,4 s, repart par le même chemin en 0,2 s. Le message est aussi annoncé aux lecteurs d’écran. En vrai : clique sur l’email de la barre du haut.',
    vivant: `<div class="toast toast--statique" aria-hidden="true">${ctx.icone('check', { taille: 16 })}<span>${ctx.e(ui.emailCopie)}</span></div>`,
  })
}

export function timeline(ctx) {
  const lignes = ctx.contenu.parcours.filter((l) => ['b2-ynov', 'objectif-alternance'].includes(l.id))
  const html = lignes
    .map((l) => `<li class="timeline__ligne${l.ambre ? ' timeline__ligne--objectif' : ''}">
        <span class="timeline__poste"><span class="petit">${ctx.e(l.titre)}</span>${l.organisation ? `<span class="etiquette">${ctx.e(l.organisation)}</span>` : ''}</span>
        <span class="timeline__repere" aria-hidden="true"></span>
        <span class="timeline__annee chiffre${l.ambre ? ' ambre' : ''}">${ctx.e(l.periode)}</span>
        <span class="timeline__type petit discret">${ctx.e(ctx.contenu.ui.fr.parcours.types[l.type])}</span>
      </li>`)
    .join('')
  return composant(ctx, {
    id: 'timeline',
    titre: 'Ligne de timeline',
    note: 'Trois colonnes : poste, année, description. Une ligne verticale fine porte un point ambre lumineux qui descend avec le scroll ; chaque ligne s’allume au passage du point. L’objectif (sept. 2027) est en ambre.',
    vivant: `<ol class="timeline" role="list">${html}</ol>`,
  })
}

export function annotation(ctx) {
  return composant(ctx, {
    id: 'annotation',
    titre: 'Annotation technique',
    note: 'Héritée de la référence A7 : une ligne de rappel fine et une étiquette mono. Usage rare : l’entrée et les pages projets. Les noms suivent les conventions Blender du projet (ANCHOR_*, EMI_*).',
    vivant: `<figure class="annotation-demo">
        <svg viewBox="0 0 560 220" role="img" aria-label="Cabane A-frame annotée : fenêtre émissive, porte, pente du toit">
          <path class="annotation-demo__forme" d="M150 196 L240 34 L330 196 Z"/>
          <path class="annotation-demo__vitrage" d="M190 196 L240 106 L290 196 Z"/>
          <path class="annotation-demo__rappel" d="M262 150 L372 112 L452 112"/><circle class="annotation-demo__ancre" cx="262" cy="150" r="2.5"/>
          <text class="annotation-demo__texte" x="372" y="104">EMI_FENETRE · AMBRE</text>
          <path class="annotation-demo__rappel" d="M240 34 L124 34 L36 34"/><circle class="annotation-demo__ancre" cx="240" cy="34" r="2.5"/>
          <text class="annotation-demo__texte" x="36" y="26">FAÎTAGE · PENTE 60°</text>
          <path class="annotation-demo__rappel" d="M168 190 L96 160 L36 160"/><circle class="annotation-demo__ancre" cx="168" cy="190" r="2.5"/>
          <text class="annotation-demo__texte" x="36" y="152">ANCHOR_DOOR</text>
        </svg>
      </figure>`,
  })
}
