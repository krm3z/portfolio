import { describe, expect, it } from 'vitest'
import { hexVersRgb, melangerLineaire, multiplierLineaire } from './couleur.mjs'
import { couleurAuLoin, facteurVignette, smoothstep } from './scene.mjs'

describe('formules de la scène', () => {
  it('smoothstep suit GLSL, y compris avec des bords inversés', () => {
    expect(smoothstep(0, 1, 0.5)).toBe(0.5)
    expect(smoothstep(0.8, 0.2, 0.9)).toBe(0)
    expect(smoothstep(0.8, 0.2, 0.1)).toBe(1)
  })

  it('le vignettage laisse le centre intact et assombrit les coins', () => {
    const v = { decalage: 0.3, obscurite: 0.45 }
    expect(facteurVignette(v, 0.5, 0.5)).toBe(1)
    const coin = facteurVignette(v, 0, 0)
    expect(coin).toBeGreaterThan(0.3)
    expect(coin).toBeLessThan(0.6)
  })

  it('mélange en lumière linéaire : à mi-chemin, plus clair qu’un mélange sRGB', () => {
    const milieu = melangerLineaire(hexVersRgb('#000000'), hexVersRgb('#FFFFFF'), 0.5)
    expect(milieu.r).toBe(188)
  })

  it('multiplie en linéaire et plafonne au blanc', () => {
    expect(multiplierLineaire(hexVersRgb('#FFFFFF'), 2)).toEqual({ r: 255, g: 255, b: 255 })
    expect(multiplierLineaire(hexVersRgb('#808080'), 1)).toEqual({ r: 128, g: 128, b: 128 })
  })

  it('au-delà de la visibilité à 95 %, une matière prend la couleur du brouillard', () => {
    const etat = { lumieres: { ambiante: { intensite: 1 } }, exposition: 1, brouillard: { couleur: '#737980', densite: 0.018 } }
    expect(couleurAuLoin(etat, '#474B50', 0)).toBe('#474B50')
    expect(couleurAuLoin(etat, '#474B50', 300)).toBe('#737980')
  })
})
