import { describe, expect, it } from 'vitest'
import { hexVersRgb } from './couleur.mjs'
import { formaterRatio, niveauNonTexte, niveauTexte, ratioContraste } from './contraste.mjs'

const c = (hex) => hexVersRgb(hex)
const night = c('#0E0F11')

describe('contraste WCAG', () => {
  it('retrouve les rapports calculés pendant la préparation', () => {
    expect(ratioContraste(c('#EDEDEA'), night)).toBeCloseTo(16.35, 1)
    expect(ratioContraste(c('#9A9C9F'), night)).toBeCloseTo(6.97, 1)
    expect(ratioContraste(c('#F2A33A'), night)).toBeCloseTo(9.2, 1)
    expect(ratioContraste(c('#9A9C9F'), c('#EDEDEA'))).toBeCloseTo(2.35, 1)
  })

  it('valide le gris de donnée du graphique et refuse le plus sombre', () => {
    expect(ratioContraste(c('#66686C'), night)).toBeGreaterThanOrEqual(3)
    expect(ratioContraste(c('#5C5E62'), night)).toBeLessThan(3)
  })

  it('est symétrique', () => {
    expect(ratioContraste(night, c('#EDEDEA'))).toBe(ratioContraste(c('#EDEDEA'), night))
  })

  it('juge sur la valeur exacte, sans arrondi', () => {
    const mist = ratioContraste(c('#9A9C9F'), night) // 6,97 : AA, pas AAA
    expect(niveauTexte(mist)).toBe('AA')
    expect(niveauTexte(7)).toBe('AAA')
    expect(niveauTexte(3.2)).toBe('AA grand texte')
    expect(niveauTexte(2.9)).toBe('Échec')
    expect(niveauNonTexte(3)).toBe('OK')
  })

  it('formate en français sans arrondir vers le haut', () => {
    expect(formaterRatio(6.9799)).toBe('6,97:1')
  })
})
