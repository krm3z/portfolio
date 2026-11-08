// Tests de cohérence entre les trois fichiers de design.
// Ils protègent la règle « une seule source de vérité » : si une valeur change d'un côté
// et pas de l'autre, le test échoue.
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { visibilite95 } from '../lib/brouillard.mjs'
import { hexVersRgb, saturationHsl } from '../lib/couleur.mjs'
import { lireTokens } from '../lib/tokens.mjs'
import { mesurerInterface } from '../svg/paysage.mjs'

const racineDesign = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const css = readFileSync(join(racineDesign, 'tokens.css'), 'utf8')
const motion = JSON.parse(readFileSync(join(racineDesign, 'motion.json'), 'utf8'))
const ambiance = JSON.parse(readFileSync(join(racineDesign, 'ambiance.json'), 'utf8'))
const tokens = lireTokens(css)

/** Normalise une courbe CSS pour comparer « cubic-bezier(.16,1,.3,1) » et « cubic-bezier(0.16, 1, 0.3, 1) ». */
const courbe = (texte) => texte.replace(/\s+/g, '').replace(/([(,])\./g, '$10.')

/** Corps d'un bloc CSS repéré par son début (accolades suivies). */
function corpsDuBloc(source, debut) {
  const i = source.indexOf(debut)
  if (i < 0) throw new Error(`Bloc introuvable : ${debut}`)
  const ouverture = source.indexOf('{', i)
  let profondeur = 0
  for (let j = ouverture; j < source.length; j++) {
    if (source[j] === '{') profondeur++
    if (source[j] === '}' && --profondeur === 0) return source.slice(ouverture + 1, j)
  }
  throw new Error(`Bloc non fermé : ${debut}`)
}

/** Déclarations « --nom: valeur » d'un texte CSS, triées. */
const declarations = (texte) =>
  [...texte.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/gi)].map(([, n, v]) => `${n}=${v.trim()}`).sort()

describe('tokens.css respecte la section D', () => {
  it('garde les 8 couleurs exactes', () => {
    expect(tokens).toMatchObject({
      night: '#0E0F11',
      'night-2': '#16171A',
      'night-3': '#1E2024',
      line: 'rgba(237, 237, 234, 0.10)',
      mist: '#9A9C9F',
      snow: '#EDEDEA',
      amber: '#F2A33A',
      'amber-soft': 'rgba(242, 163, 58, 0.15)',
    })
  })

  it("garde l'échelle typographique de la DA", () => {
    expect(tokens['fs-display']).toBe('clamp(56px, 7vw, 120px)')
    expect(tokens['lh-display']).toBe('0.95')
    expect(tokens['ls-display']).toBe('-0.03em')
    expect(tokens['fs-h1']).toBe('clamp(40px, 4.4vw, 72px)')
    expect(tokens['fs-h2']).toBe('clamp(28px, 3vw, 44px)')
    expect(tokens['lh-texte']).toBe('1.6')
  })
})

describe('tokens.css et motion.json disent la même chose', () => {
  it('pour les durées', () => {
    expect(tokens['dur-micro']).toBe(`${motion.durees.micro}ms`)
    expect(tokens['dur-interface']).toBe(`${motion.durees.interface}ms`)
    expect(tokens['dur-apparition']).toBe(`${motion.durees.apparition}ms`)
    expect(tokens['ecart-mots']).toBe(`${motion.ecarts.mots}ms`)
    expect(tokens['dur-cycle-mots']).toBe(`${motion.animations.motsAlternes.cycle}ms`)
    expect(tokens['dur-masque-mots']).toBe(`${motion.animations.motsAlternes.duree}ms`)
    expect(tokens['dur-compteur']).toBe(`${motion.animations.compteur.duree}ms`)
  })

  it('pour les courbes', () => {
    expect(courbe(tokens['ease-out-expo'])).toBe(courbe(motion.courbes.outExpo.css))
    expect(courbe(tokens['ease-in-out'])).toBe(courbe(motion.courbes.inOut.css))
  })

  it('pour les distances', () => {
    expect(tokens.montee).toBe(`${motion.distances.montee}px`)
    expect(tokens['carte-montee']).toBe(`${motion.distances.survolCarte}px`)
    expect(tokens['bouton-fleche']).toBe(`${motion.distances.fleche}px`)
  })

  it('aucune animation ne dépasse 300 ms sans raison écrite', () => {
    for (const [nom, anim] of Object.entries(motion.animations)) {
      const longue = typeof anim.duree === 'number' && anim.duree > 300
      if (longue) expect(anim.raison, `raison manquante pour ${nom}`).toBeTruthy()
      expect(anim.reduit, `version réduite manquante pour ${nom}`).toBeTruthy()
    }
  })
})

describe('mouvement réduit', () => {
  it('a le même bloc sous la media query et sous [data-mouvement="reduit"]', () => {
    const media = corpsDuBloc(css, '@media (prefers-reduced-motion: reduce)')
    const interrupteur = corpsDuBloc(css, '[data-mouvement="reduit"]')
    expect(declarations(interrupteur)).toEqual(declarations(media))
    expect(declarations(media).length).toBeGreaterThan(5)
  })
})

describe('ambiance.json', () => {
  const etats = { jour: ambiance.jour, ...ambiance.candidates }
  const grisDeLaScene = (e) => [
    e.ciel.haut,
    e.ciel.horizon,
    e.brouillard.couleur,
    e.neige.albedo,
    e.roche.albedo,
    e.bois.albedo,
    e.lumieres.hemisphere.ciel,
    e.lumieres.hemisphere.sol,
    e.lumieres.directionnelle.couleur,
  ]

  it('a un état « jour » et trois candidates gardées en archive', () => {
    expect(Object.keys(ambiance.candidates)).toEqual(['brume-claire', 'heure-bleue', 'nuit-tombee'])
  })

  it('le choix de Kerem reprend sa candidate de base, sans écart caché', () => {
    const { origine, valeurs, progression } = ambiance.choisi
    expect(Object.keys(ambiance.candidates)).toContain(origine.base)
    // Sans emprunt, les valeurs retenues sont exactement celles de la candidate (rien n'a été retouché en douce).
    if (Object.keys(origine.emprunts).length === 0) expect(valeurs).toEqual(ambiance.candidates[origine.base])
    // L'entrée part du jour et finit sur l'ambiance retenue ; chaque étape existe.
    expect(progression.etapes[0]).toBe('jour')
    expect(progression.etapes.at(-1)).toBe(origine.base)
    for (const etape of progression.etapes.slice(1)) expect(Object.keys(ambiance.candidates)).toContain(etape)
  })

  for (const [nom, etat] of Object.entries(etats)) {
    it(`${nom} : gris de la scène saturés à 8 % au plus (HSL)`, () => {
      for (const hex of grisDeLaScene(etat)) {
        expect(saturationHsl(hexVersRgb(hex)), `${nom} ${hex}`).toBeLessThanOrEqual(0.08)
      }
    })

    it(`${nom} : visibilité cohérente avec la densité, fenêtre en ambre`, () => {
      expect(etat.brouillard.visibilite95).toBeCloseTo(visibilite95(etat.brouillard.densite), 0)
      expect(etat.fenetre.emissif).toBe('#F2A33A')
      expect(typeof etat.exposition).toBe('number')
      expect(typeof etat.lumieres.ambiante.intensite).toBe('number')
    })

    it(`${nom} : contrasteMin suit les formules de la scène et reste au-dessus de 4,5:1`, () => {
      const { haut, bas } = etat.interface.texte
      const m = mesurerInterface(etat, ambiance.plans, { haut: tokens[haut], bas: tokens[bas] })
      expect(etat.interface.contrasteMin).toBe(Math.floor(Math.min(m.haut, m.bas) * 10) / 10)
      expect(etat.interface.contrasteMin).toBeGreaterThanOrEqual(4.5)
    })
  }
})
