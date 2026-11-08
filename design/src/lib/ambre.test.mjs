import { describe, expect, it } from 'vitest'
import { classerPixel, compterAmbre, pourcentages } from './ambre.mjs'

describe("détection de l'ambre", () => {
  it("reconnaît l'ambre pur", () => {
    expect(classerPixel(242, 163, 58)).toBe('ambre')
  })

  it('ignore les neutres de la DA', () => {
    expect(classerPixel(154, 156, 159)).toBeNull() // mist
    expect(classerPixel(237, 237, 234)).toBeNull() // snow
    expect(classerPixel(14, 15, 17)).toBeNull() // night
  })

  it('classe amber-soft posé sur night en « teinte »', () => {
    expect(classerPixel(48, 37, 23)).toBe('teinte')
  })

  it('ignore un rouge ou un bleu', () => {
    expect(classerPixel(220, 40, 40)).toBeNull()
    expect(classerPixel(40, 90, 220)).toBeNull()
  })

  it('compte une image et exclut des lignes', () => {
    // Image 2 × 2 : ligne 0 = ambre + night, ligne 1 = ambre + ambre.
    const donnees = new Uint8Array([242, 163, 58, 255, 14, 15, 17, 255, 242, 163, 58, 255, 242, 163, 58, 255])
    expect(compterAmbre(donnees, 2, 2)).toEqual({ ambre: 3, teinte: 0, total: 4 })
    expect(compterAmbre(donnees, 2, 2, { lignesExclues: [[1, 2]] })).toEqual({ ambre: 1, teinte: 0, total: 2 })
    expect(pourcentages({ ambre: 1, teinte: 1, total: 4 }).somme).toBe(50)
  })
})
