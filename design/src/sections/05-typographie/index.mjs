// Section 05 · Typographie : spécimens avec les vrais textes de content/fr, table de l'échelle
// (calculée à 1440 et à 390 px depuis tokens.css), chiffres à chasse fixe, licences.
import { evaluerClamp } from '../../lib/clamp.mjs'
import { bloc, enveloppeSection } from '../../page/gabarits.mjs'

const ECHELLE = [
  { role: 'Display', taille: 'fs-display', interligne: 'lh-display', lettrage: 'ls-display', graisse: 'Medium 500', usage: 'Nom, mot géant de l’accueil' },
  { role: 'Titre 1', taille: 'fs-h1', interligne: 'lh-h1', lettrage: 'ls-h1', graisse: 'Medium 500', usage: 'Pitch, titres de chapitre' },
  { role: 'Titre 2', taille: 'fs-h2', interligne: 'lh-h2', lettrage: 'ls-h2', graisse: 'Medium 500', usage: 'Titres de projet, sous-parties' },
  { role: 'Titre 3', taille: 'fs-h3', interligne: 'lh-h3', lettrage: null, graisse: 'Medium 500', usage: 'Cartes, blocs' },
  { role: 'Texte', taille: 'fs-texte', interligne: 'lh-texte', lettrage: null, graisse: 'Regular 400', usage: 'Texte courant, 65 caractères par ligne au plus' },
  { role: 'Petit', taille: 'fs-petit', interligne: 'lh-petit', lettrage: null, graisse: 'Regular 400', usage: 'Légendes, notes' },
  { role: 'Étiquette mono', taille: 'fs-etiquette', interligne: null, lettrage: 'ls-etiquette', graisse: 'Geist Mono 400', usage: 'Données, navigation, statuts (11 à 12 px, majuscules)' },
]

const px = (valeur) => `${Number(valeur.toFixed(1)).toString().replace('.', ',')} px`
const fr = (texte) => String(texte).replace('.', ',') // affichage français : 0,95 et non 0.95

function rendreSpecimens(ctx) {
  const { identite, projets, ui } = ctx.contenu
  const pitch = ctx.e(identite.pitch.texte).replace(identite.pitch.motAmbre, `<span class="ambre">${identite.pitch.motAmbre}</span>`)
  const projet = projets.find((p) => p.slug === 'pollution-meteo')
  const micro = ui.fr.entree.microTexte
  return `<div class="specimens">
    <div class="specimen">
      <p class="etiquette specimen__role">Display · General Sans 500</p>
      <p class="display specimen__nom">${ctx.e(identite.nom)}</p>
    </div>
    <div class="specimen">
      <p class="etiquette specimen__role">Titre 1 · le pitch, « éclaire » en ambre</p>
      <p class="h1 specimen__pitch">${pitch}</p>
    </div>
    <div class="specimen specimen--deux">
      <div>
        <p class="etiquette specimen__role">Titre 2 · le titre de projet le plus long</p>
        <p class="h2">${ctx.e(projet.titre)}</p>
      </div>
      <div>
        <p class="etiquette specimen__role">Texte · à propos, 65 caractères par ligne au plus</p>
        <p class="texte">${ctx.e(identite.apropos)}</p>
      </div>
    </div>
    <div class="specimen">
      <p class="etiquette specimen__role">Étiquettes · Geist Mono 400, majuscules</p>
      <ul class="specimen__etiquettes" role="list">
        <li class="etiquette">${ctx.e(micro.ligne1)}</li>
        <li class="etiquette etiquette--claire">${ctx.e(micro.ligne2)}</li>
        <li class="etiquette">${ctx.e(micro.ligne3)}</li>
        <li class="etiquette">${ctx.e(ui.fr.entree.invitationScroll)}</li>
        <li class="etiquette">${ctx.e(ui.fr.projets.statuts.termine)} · ${ctx.e(ui.fr.projets.statuts['en-cours'])}</li>
      </ul>
    </div>
  </div>`
}

function rendrePolices() {
  const famille = (nom, classe, role, graisses, licence) => `<article class="police ${classe}">
    <p class="police__apercu" aria-hidden="true">Aa</p>
    <h4 class="h3">${nom}</h4>
    <p class="petit discret">${role}</p>
    <ul class="police__graisses" role="list">${graisses.map(([g, n]) => `<li style="font-weight:${g}">${n} ${g}</li>`).join('')}</ul>
    <p class="petit discret police__licence">${licence}</p>
  </article>`
  return `<div class="polices">
    ${famille('General Sans', 'police--sans', 'Titres et textes. Une linéale rationnelle aux formes nettes.', [[400, 'Regular'], [500, 'Medium'], [600, 'Semibold']], 'Indian Type Foundry · ITF Free Font License : usage commercial libre et auto-hébergement permis, mais ni redistribution (y compris dans un dépôt public), ni modification, ni sous-ensemble.')}
    ${famille('Geist Mono', 'police--mono', 'Chiffres, données, étiquettes, navigation. Chiffres à chasse fixe.', [[400, 'Regular'], [500, 'Medium']], 'Vercel · SIL Open Font License 1.1 : peut être auto-hébergée et versionnée.')}
  </div>`
}

function rendreEchelle(ctx) {
  const t = ctx.tokens
  const lignes = ECHELLE.map((l) => {
    const taille = t[l.taille]
    const d = evaluerClamp(taille, 1440)
    const m = evaluerClamp(taille, 390)
    return `<tr>
      <th scope="row">${ctx.e(l.role)}</th>
      <td class="chiffre">${px(d)}</td>
      <td class="chiffre">${px(m)}</td>
      <td class="chiffre">${fr(l.interligne ? t[l.interligne] : '1.4')}</td>
      <td class="chiffre">${fr(l.lettrage ? t[l.lettrage] : '0')}</td>
      <td>${ctx.e(l.graisse)}</td>
      <td class="discret">${ctx.e(l.usage)}</td>
    </tr>`
  }).join('')
  return `<div class="tableau-defilant" role="region" aria-label="Échelle typographique" tabindex="0">
    <table class="tableau tableau--echelle">
      <thead><tr><th scope="col">Rôle</th><th scope="col">1440 px</th><th scope="col">390 px</th><th scope="col">Interligne</th><th scope="col">Interlettrage</th><th scope="col">Graisse</th><th scope="col">Usage</th></tr></thead>
      <tbody>${lignes}</tbody>
    </table>
  </div>`
}

function rendreChiffres() {
  const fin = ' ' // espace fine insécable entre les milliers
  const chiffres = [
    ['11' + fin + '246', 'publications APOD analysées'],
    ['2025', 'une année'],
    ['25' + fin + 'h', 'par semaine chez Carrefour'],
    ['0' + fin + '→' + fin + '100', 'indice d’impact pollution'],
  ]
  return `<ul class="chiffres" role="list">${chiffres
    .map(([c, l]) => `<li><span class="chiffres__valeur chiffre">${c}</span><span class="petit discret">${l}</span></li>`)
    .join('')}</ul>`
}

export function rendre(ctx, section) {
  const corps = [
    bloc(ctx, { contenu: rendreSpecimens(ctx), classe: 'bloc--premier' }),
    bloc(ctx, { titre: 'Deux familles, cinq graisses', contenu: rendrePolices() }),
    bloc(ctx, {
      titre: 'Échelle',
      contenu: rendreEchelle(ctx),
      legende: 'Tailles calculées depuis les clamp() de tokens.css. Les interlignes des titres 1 à 3 sont proposés : la DA ne les fixait pas.',
    }),
    bloc(ctx, {
      titre: 'Chiffres à chasse fixe',
      contenu: rendreChiffres(),
      legende: 'Geist Mono, tabular-nums : un compteur qui défile ne fait pas bouger la mise en page. Espace fine insécable entre les milliers et autour de la flèche.',
    }),
  ].join('\n')
  return enveloppeSection(ctx, section, { chapo: 'General Sans pour lire, Geist Mono pour compter.', corps })
}
