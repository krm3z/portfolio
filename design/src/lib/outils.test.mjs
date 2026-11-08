// Tests des petits outils : brouillard, clamp(), aléa à graine, échappement HTML, lecture des tokens.
import { describe, expect, it } from 'vitest'
import { densitePourVisibilite95, facteurBrouillard, visibilite95 } from './brouillard.mjs'
import { evaluerClamp, evaluerLongueur } from './clamp.mjs'
import { echapper, typographier } from './html.mjs'
import { mulberry32 } from './prng.mjs'
import { lireTokens } from './tokens.mjs'

describe('brouillard FogExp2', () => {
  it('cache 95 % à la distance de visibilité', () => {
    expect(visibilite95(0.018)).toBeCloseTo(96.16, 1)
    expect(facteurBrouillard(0.018, visibilite95(0.018))).toBeCloseTo(0.95, 6)
    expect(densitePourVisibilite95(96.16)).toBeCloseTo(0.018, 4)
  })

  it('vaut 0 au contact et croît avec la distance', () => {
    expect(facteurBrouillard(0.02, 0)).toBe(0)
    expect(facteurBrouillard(0.02, 50)).toBeLessThan(facteurBrouillard(0.02, 80))
  })
})

describe('clamp()', () => {
  it("calcule l'échelle de la DA à 1440 et à 390 px", () => {
    expect(evaluerClamp('clamp(56px,7vw,120px)', 1440)).toBeCloseTo(100.8, 5)
    expect(evaluerClamp('clamp(56px,7vw,120px)', 390)).toBe(56)
    expect(evaluerClamp('clamp(40px, 4.4vw, 72px)', 1440)).toBeCloseTo(63.36, 5)
    expect(evaluerClamp('clamp(20px,18.5px + .38vw,24px)', 390)).toBe(20)
  })

  it('évalue une longueur simple', () => {
    expect(evaluerLongueur('14px', 1440)).toBe(14)
    expect(evaluerLongueur('4vw', 1000)).toBe(40)
  })
})

describe('aléa à graine', () => {
  it('donne la même suite pour la même graine', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    const suiteA = [a(), a(), a()]
    expect([b(), b(), b()]).toEqual(suiteA)
    suiteA.forEach((v) => expect(v >= 0 && v < 1).toBe(true))
  })
})

describe('html', () => {
  it('échappe les caractères spéciaux', () => {
    expect(echapper('IA & Data <x> "y"')).toBe('IA &amp; Data &lt;x&gt; &quot;y&quot;')
  })

  it("pose l'apostrophe typographique", () => {
    expect(typographier("Passer l'intro")).toBe('Passer l’intro')
  })

  it('colle la ponctuation haute au mot précédent (espaces insécables)', () => {
    expect(typographier('Le pic : 20 titres')).toBe('Le pic : 20 titres')
    expect(typographier('Envie d’en voir plus ?')).toBe('Envie d’en voir plus ?')
    expect(typographier('« Grain »')).toBe('« Grain »')
    expect(typographier('25 %')).toBe('25 %')
    expect(typographier('https://lelon.fr')).toBe('https://lelon.fr')
  })

  it('lie un nombre à son unité, sans toucher aux mots qui commencent pareil', () => {
    expect(typographier('200 ms · 600 vh')).toBe('200 ms · 600 vh')
    expect(typographier('25 h par semaine')).toBe('25 h par semaine')
    expect(typographier('3 mots')).toBe('3 mots')
    expect(typographier('2 heures')).toBe('2 heures')
  })
})

describe('lecture de tokens.css', () => {
  it('lit les :root de premier niveau et ignore les @media', () => {
    const css = '/* c */ :root{--a:#fff;--b: 1px ;} @media (min-width:768px){:root{--a:#000}} :root{--c:clamp(1px,2vw,3px)}'
    expect(lireTokens(css)).toEqual({ a: '#fff', b: '1px', c: 'clamp(1px,2vw,3px)' })
  })
})
