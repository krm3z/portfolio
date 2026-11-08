import { describe, expect, it } from 'vitest'
import {
  composer,
  distanceOklab,
  hexVersRgb,
  lireCouleurCss,
  melangerSrgb,
  rgbVersHex,
  rgbVersOklch,
  saturationHsl,
} from './couleur.mjs'

describe('couleur', () => {
  it('convertit hex ↔ rgb dans les deux sens', () => {
    expect(hexVersRgb('#F2A33A')).toEqual({ r: 242, g: 163, b: 58 })
    expect(hexVersRgb('#fff')).toEqual({ r: 255, g: 255, b: 255 })
    expect(rgbVersHex({ r: 14, g: 15, b: 17 })).toBe('#0E0F11')
  })

  it('refuse une couleur hex invalide', () => {
    expect(() => hexVersRgb('#12')).toThrow()
  })

  it('lit rgba() avec sa transparence', () => {
    expect(lireCouleurCss('rgba(242,163,58,0.15)')).toEqual({ r: 242, g: 163, b: 58, a: 0.15 })
    expect(lireCouleurCss('#9A9C9F')).toEqual({ r: 154, g: 156, b: 159, a: 1 })
  })

  it('compose amber-soft sur night comme le navigateur', () => {
    const resultat = composer(lireCouleurCss('rgba(242,163,58,0.15)'), hexVersRgb('#0E0F11'))
    expect(resultat).toEqual({ r: 48, g: 37, b: 23 })
  })

  it("donne la teinte OKLCH de l'ambre (≈ 70°)", () => {
    const { L, h } = rgbVersOklch(hexVersRgb('#F2A33A'))
    expect(L).toBeCloseTo(0.776, 2)
    expect(h).toBeGreaterThan(65)
    expect(h).toBeLessThan(75)
  })

  it('mesure la saturation HSL des gris de départ du prompt', () => {
    expect(saturationHsl(hexVersRgb('#3B4148'))).toBeCloseTo(0.099, 3)
    expect(saturationHsl(hexVersRgb('#15181C'))).toBeCloseTo(0.143, 3)
    expect(saturationHsl(hexVersRgb('#808080'))).toBe(0)
  })

  it('mesure un écart perceptif nul entre deux couleurs identiques', () => {
    expect(distanceOklab(hexVersRgb('#F2A33A'), hexVersRgb('#F2A33A'))).toBe(0)
  })

  it('mélange deux couleurs en sRGB', () => {
    expect(melangerSrgb({ r: 0, g: 0, b: 0 }, { r: 200, g: 100, b: 50 }, 0.5)).toEqual({ r: 100, g: 50, b: 25 })
  })
})
