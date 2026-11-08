// Section 07 · composants d'action : boutons, lien, barre du haut, rail social, son, pause, curseur.
import { composant, matrice } from './outils.mjs'

/** Bouton principal : pilule ambre, texte night en Geist Mono 12 px majuscules, flèche qui glisse de 4 px. */
export function boutonPrincipal(ctx) {
  const libelle = ctx.e(ctx.contenu.ui.fr.contact.meContacter)
  const fleche = ctx.icone('arrow-right', { taille: 16, classe: 'bouton__fleche' })
  const copie = (classe) => `<span class="bouton ${classe}">${libelle}${fleche}</span>`
  return composant(ctx, {
    id: 'bouton-principal',
    titre: 'Bouton principal',
    note: 'Une seule action principale par écran. Pilule ambre, texte night en Geist Mono 12 px. Au survol, la flèche glisse de 4 px ; à l’appui, le bouton se tasse à 96 %. Désactivé : contour en pointillés, sans flèche.',
    matriceHtml: matrice(ctx, (classe) => copie(classe)),
    vivant: `<button type="button" class="bouton" data-demo="contact">${libelle}${fleche}</button>
      <button type="button" class="bouton" disabled>${libelle}${fleche}</button>`,
  })
}

export function boutonSecondaire(ctx) {
  const libelle = ctx.e(ctx.contenu.ui.fr.projets.voirTous)
  const copie = (classe) => `<span class="bouton bouton--secondaire ${classe}">${libelle}</span>`
  return composant(ctx, {
    id: 'bouton-secondaire',
    titre: 'Bouton secondaire',
    note: 'Pilule à contour --line, texte snow. Au survol, le contour passe à l’ambre.',
    matriceHtml: matrice(ctx, (classe) => copie(classe)),
    vivant: `<button type="button" class="bouton bouton--secondaire">${libelle}</button>`,
  })
}

export function lien(ctx) {
  const libelle = ctx.e(ctx.contenu.ui.fr.pageProjet.voirLeDepot)
  const icone = ctx.icone('arrow-up-right', { taille: 14, classe: 'lien__icone' })
  const nouvelOnglet = ctx.e(ctx.contenu.ui.fr.liensExternes.nouvelOnglet)
  const copie = (classe, etat) => (etat === 'desactive' ? 'sans objet : un lien inactif devient du texte simple' : `<span class="lien ${classe}">${libelle}${icone}</span>`)
  return composant(ctx, {
    id: 'lien',
    titre: 'Lien',
    note: 'Un trait discret au repos ; au survol et au focus, un soulignement snow se dessine de gauche à droite en 0,45 s. La flèche ↗ signale une sortie du site.',
    matriceHtml: matrice(ctx, copie),
    vivant: `<a class="lien" href="${ctx.e(ctx.contenu.projets[0].lien.url)}" target="_blank" rel="noopener">${libelle}${icone}<span class="sr-only"> ${nouvelOnglet}</span></a>`,
  })
}

/** Égaliseur de 4 barres : animé quand le son est actif, immobile sinon. */
const egaliseur = '<span class="egaliseur" aria-hidden="true"><span></span><span></span><span></span><span></span></span>'

function boutonSonHtml(ctx, { actif = false, classe = '', vivant = false } = {}) {
  const ui = ctx.contenu.ui.fr.son
  const libelle = actif ? ui.couper : ui.activer
  return vivant
    ? `<button type="button" class="bouton-icone bouton-son${actif ? ' est-allume' : ''}" data-demo="son" aria-label="${ctx.e(libelle)}" data-activer="${ctx.e(ui.activer)}" data-couper="${ctx.e(ui.couper)}">${egaliseur}</button>`
    : `<span class="bouton-icone bouton-son ${classe}${actif ? ' est-allume' : ''}">${egaliseur}</span>`
}

function boutonPauseHtml(ctx, { vivant = false, classe = '' } = {}) {
  const icones = `${ctx.icone('pause', { taille: 18, classe: 'bouton-pause__pause' })}${ctx.icone('play', { taille: 18, classe: 'bouton-pause__lecture' })}`
  return vivant
    ? `<button type="button" class="bouton-icone bouton-pause" data-demo="pause" aria-pressed="false" aria-label="${ctx.e(ctx.contenu.ui.fr.boucles.pause)}">${icones}</button>`
    : `<span class="bouton-icone bouton-pause ${classe}">${icones}</span>`
}

/** Barre du haut de 64 px : monogramme, email (clic = copie), navigation, FR/EN, pause, son. */
export function barreDuHaut(ctx) {
  const { identite, ui } = ctx.contenu
  const nav = [ui.fr.navigation.apropos, ui.fr.chapitres.competences, ui.fr.navigation.projets, ui.fr.navigation.contact]
  const liens = nav.map((n) => `<li><a class="barre__lien" href="#composant-barre">${ctx.e(n)}</a></li>`).join('<li aria-hidden="true" class="barre__point">·</li>')
  const copier = ctx.icone('copy', { taille: 14, classe: 'barre__copie' }) + ctx.icone('check', { taille: 14, classe: 'barre__coche' })
  const barre = `<header class="barre" data-demo="barre">
      <a class="barre__monogramme" href="#composant-barre" aria-label="KU, Kerem Uysal : retour en haut">${ctx.e(ui.fr.navigation.monogramme)}</a>
      <button type="button" class="barre__email" data-demo="copier" data-email="${ctx.e(identite.email)}" data-message="${ctx.e(ui.fr.contact.emailCopie)}" data-echec="${ctx.e(ui.fr.contact.copieImpossible)}" aria-label="${ctx.e(ui.fr.contact.copierEmail)} : ${ctx.e(identite.email)}"><span class="barre__adresse">${ctx.e(identite.email)}</span>${copier}</button>
      <nav class="barre__nav" aria-label="Navigation (démonstration)"><ul role="list">${liens}</ul></nav>
      <div class="barre__reglages">
        <button type="button" class="barre__langue" data-demo="langue" aria-label="${ctx.e(ui.fr.navigation.changerLangue)} : ${ctx.e(ui.fr.navigation.changerLangueLabel)}" data-libelle-fr="${ctx.e(ui.fr.navigation.changerLangue)} : ${ctx.e(ui.fr.navigation.changerLangueLabel)}" data-libelle-en="${ctx.e(ui.en.navigation.changerLangue)} : ${ctx.e(ui.en.navigation.changerLangueLabel)}"><span class="est-courante">FR</span> / <span>EN</span></button>
        ${boutonPauseHtml(ctx, { vivant: true })}
        ${boutonSonHtml(ctx, { vivant: true })}
        <button type="button" class="bouton-icone barre__menu" aria-label="${ctx.e(ui.fr.navigation.ouvrirMenu)}">${ctx.icone('menu', { taille: 20 })}</button>
      </div>
    </header>`
  return composant(ctx, {
    id: 'barre',
    titre: 'Barre du haut',
    note: 'Hauteur 64 px. Monogramme à gauche, email au centre (un clic le copie et affiche « Email copié »), navigation à droite, puis FR/EN, pause des animations et son. Sur téléphone : KU, FR/EN, pause, son et menu.',
    vivant: `<div class="barre-cadre">${barre}</div>`,
  })
}

export function railSocial(ctx) {
  const { identite, ui } = ctx.contenu
  const sortie = `<span class="sr-only"> ${ctx.e(ui.fr.liensExternes.nouvelOnglet)}</span>`
  const elements = [
    { href: identite.liens.github, nom: 'GitHub', icone: 'github', externe: true },
    { href: identite.liens.linkedin, nom: 'LinkedIn', icone: 'linkedin', externe: true },
    { href: `mailto:${identite.email}`, nom: `Email : ${identite.email}`, icone: 'mail', externe: false },
  ]
  const vivant = `<ul class="rail" role="list">${elements
    .map((el) => `<li><a class="rail__lien" href="${ctx.e(el.href)}"${el.externe ? ' target="_blank" rel="noopener"' : ''} aria-label="${ctx.e(el.nom)}">${ctx.icone(el.icone, { taille: 20 })}${el.externe ? sortie : ''}</a></li>`)
    .join('')}</ul>`
  const copie = (classe, etat) => (etat === 'desactive' ? 'sans objet' : `<span class="rail__lien ${classe}">${ctx.icone('github', { taille: 20 })}</span>`)
  return composant(ctx, {
    id: 'rail',
    titre: 'Rail social',
    note: 'Colonne verticale en bas à gauche, à partir de 1024 px. Icônes au trait de 1,5 px, zones de clic de 44 × 44 px.',
    matriceHtml: matrice(ctx, copie),
    vivant,
  })
}

export function sonEtPause(ctx) {
  const copieSon = (classe, etat) => (etat === 'desactive' ? 'sans objet' : boutonSonHtml(ctx, { actif: etat === 'actif', classe }))
  return composant(ctx, {
    id: 'son',
    titre: 'Bouton son et bouton pause',
    note: 'Le son : égaliseur de 4 barres, animé quand le son est actif, immobile quand il est coupé ; le libellé lu change avec l’état. La pause : arrête toutes les boucles de la page (mots alternés, point « En cours », texte du loader, neige). En mouvement réduit, les boucles sont arrêtées dès le départ.',
    matriceHtml: matrice(ctx, copieSon),
    vivant: `${boutonSonHtml(ctx, { vivant: true })}${boutonPauseHtml(ctx, { vivant: true })}`,
  })
}

export function curseur(ctx) {
  return composant(ctx, {
    id: 'curseur',
    titre: 'Curseur personnalisé',
    note: 'Point ambre de 10 px qui suit la souris avec un léger retard ; il devient un anneau de 36 px sur les liens et les boutons. Jamais au doigt, jamais en mouvement réduit : le curseur du système reprend la main.',
    vivant: `<div class="curseur-demo" aria-hidden="true">
        <div><span class="curseur-demo__point"></span><p class="etiquette">Sur la page</p></div>
        <div><span class="curseur-demo__anneau"></span><p class="etiquette">Sur un lien</p></div>
      </div>`,
  })
}
