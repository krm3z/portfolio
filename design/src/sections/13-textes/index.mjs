// Section 13 · Textes d'interface : le journal des corrections proposées en phase 01 et validées par Kerem
// le 8 novembre 2026, puis la table complète fr | en générée depuis content/fr/ui.json et content/en/ui.json.
// Les valeurs « après » sont lues dans les fichiers : la page montre ce qui est vraiment en place.
// La table complète montre le texte exact (échappé, sans retouche typographique).
import { echapper } from '../../lib/html.mjs'
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'

/** Aplatit un objet JSON en paires [clé pointée, valeur]. */
const aplatir = (objet, prefixe = '') => Object.entries(objet).flatMap(([cle, valeur]) =>
  valeur && typeof valeur === 'object' ? aplatir(valeur, `${prefixe}${cle}.`) : [[`${prefixe}${cle}`, valeur]])

function journal(ctx) {
  const fr = Object.fromEntries(aplatir(ctx.contenu.ui.fr))
  const en = Object.fromEntries(aplatir(ctx.contenu.ui.en))
  const guillemets = (texte) => `«\u202F${texte}\u202F»` // espaces fines insécables : « ne reste jamais seul en fin de ligne
  const deux = (cle) => `${guillemets(fr[cle])} · ${guillemets(en[cle])}`
  // [clé, ce qui est en place maintenant, pourquoi]
  const lignes = [
    ['navigation.competences (nouvelle)', deux('navigation.competences'), 'Le chapitre existe ; le menu qui liste les chapitres avait besoin de cette entrée.'],
    ['navigation.changerLangue', deux('navigation.changerLangue'), 'Le même bouton dans les deux langues, la langue active marquée ; la phrase longue reste dans changerLangueLabel.'],
    ['pageProjets.filtres.resultats', deux('pageProjets.filtres.resultats'), 'next-intl gère le pluriel (ICU) : plus de « (s) ».'],
    ['competences.prouveDans (nouvelle)', deux('competences.prouveDans'), 'Le libellé des pastilles de preuve vient de ui.json.'],
    ['contact.copieImpossible (nouvelle)', deux('contact.copieImpossible'), 'Message annoncé (aria-live) quand le navigateur refuse la copie.'],
    ['boucles.pause, boucles.reprendre (nouvelles)', `${deux('boucles.pause')} ; ${deux('boucles.reprendre')}`, 'Bouton pause des animations (critère WCAG 2.2.2).'],
    ['pageProjet.contexte (anglais)', guillemets(en['pageProjet.contexte']), 'Un mot, un sens. « Background » reste pour le parcours : c’est le mot naturel (choix de Kerem).'],
    ['contact.credit', deux('contact.credit'), 'La même honnêteté que pour LELON : le code est écrit par des agents, sous la direction de Kerem.'],
    ['identite.chiffresCles (fr)', `${guillemets(ctx.contenu.identite.chiffresCles[0].valeur)}, espace fine insécable`, 'Le nombre ne se coupe jamais en fin de ligne.'],
    ['Apostrophes et ponctuation haute', 'Inchangées dans les fichiers', 'L’apostrophe typographique et les espaces insécables sont posées à l’affichage, par une seule fonction testée (celle de cette page).'],
  ]
  return `<div class="tableau-defilant" role="region" aria-label="Corrections appliquées" tabindex="0">
    <table class="tableau tableau--textes"><thead><tr><th scope="col">Clé</th><th scope="col">En place</th><th scope="col">Pourquoi</th></tr></thead>
    <tbody>${lignes.map(([cle, enPlace, raison]) => `<tr><th scope="row"><code class="chiffre" translate="no">${ctx.e(cle)}</code></th><td>${echapper(enPlace)}</td><td class="discret">${ctx.e(raison)}</td></tr>`).join('')}</tbody></table>
  </div>`
}

function tableComplete(ctx) {
  const fr = aplatir(ctx.contenu.ui.fr)
  const en = Object.fromEntries(aplatir(ctx.contenu.ui.en))
  const lignes = fr.map(([cle, texte]) => `<tr><th scope="row"><code class="chiffre" translate="no">${ctx.e(cle)}</code></th><td lang="fr">${echapper(texte)}</td><td lang="en">${echapper(en[cle] ?? '—')}</td></tr>`).join('')
  return `<details class="donnees">
    <summary class="lien donnees__resume">Voir les ${fr.length} textes, en français et en anglais</summary>
    <div class="tableau-defilant" role="region" aria-label="Textes d’interface, français et anglais" tabindex="0">
      <table class="tableau tableau--textes"><thead><tr><th scope="col">Clé</th><th scope="col">Français</th><th scope="col">Anglais</th></tr></thead><tbody>${lignes}</tbody></table>
    </div>
  </details>`
}

export function rendre(ctx, section) {
  const corps = [
    bloc(ctx, { titre: 'Corrections appliquées', contenu: journal(ctx), classe: 'bloc--premier', legende: 'Proposées en phase 01, validées par Kerem le 8 novembre 2026, appliquées dans content/fr et content/en.' }),
    bloc(ctx, { titre: 'Tous les textes', contenu: tableComplete(ctx) }),
  ].join('\n')
  return enveloppeSection(ctx, section, {
    chapo: 'Les textes de l’interface, en français et en anglais, et les corrections qu’on y a faites.',
    corps,
  })
}
