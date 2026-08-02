import { describe, expect, it } from 'vitest'
import { bundledThemes } from 'shiki'
import { codeThemes } from '../.vitepress/lib/highlight'
import {
  CODE_SURFACE,
  MIN_CONTRAST,
  raiseContrast,
  type RawTheme,
} from '../.vitepress/lib/code-theme'

/** WCAG contrast, re-implemented here so the test does not trust the module. */
function contrast(a: string, b: string): number {
  const luminance = (hex: string) => {
    const h = hex.replace('#', '')
    const alpha = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1
    const over = b.replace('#', '')
    const channels = [0, 2, 4].map((i) => {
      const raw =
        parseInt(h.slice(i, i + 2), 16) * alpha + parseInt(over.slice(i, i + 2), 16) * (1 - alpha)
      const v = raw / 255
      return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
    }) as [number, number, number]
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
  }
  const [la, lb] = [luminance(a), luminance(b)]
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Every foreground in a theme, paired with the colour it is read against. */
function foregrounds(theme: RawTheme, surface: string): { color: string; behind: string }[] {
  const rules = [...(theme.settings ?? []), ...(theme.tokenColors ?? [])]
  const fromRules = rules
    .filter((rule) => rule.settings?.foreground)
    .map((rule) => ({
      color: rule.settings.foreground!,
      behind: rule.settings.background ?? surface,
    }))
  const base = [theme.fg, theme.colors?.['editor.foreground']]
    .filter((c): c is string => !!c)
    .map((color) => ({ color, behind: surface }))
  return [...fromRules, ...base]
}

describe('raiseContrast', () => {
  it('leaves a colour that already passes untouched', () => {
    expect(raiseContrast('#393a34', '#ffffff')).toBe('#393a34')
  })

  it('darkens a faint colour on a light surface', () => {
    // Vitesse's comment green: 2.34:1 on white.
    const fixed = raiseContrast('#a0ada0', '#ffffff')
    expect(contrast(fixed, '#ffffff')).toBeGreaterThanOrEqual(MIN_CONTRAST)
    expect(contrast(fixed, '#ffffff')).toBeGreaterThan(contrast('#a0ada0', '#ffffff'))
  })

  it('lightens a faint colour on a dark surface', () => {
    // Vitesse's punctuation grey: 3.03:1 on the dark surface.
    const fixed = raiseContrast('#666666', CODE_SURFACE.dark)
    expect(contrast(fixed, CODE_SURFACE.dark)).toBeGreaterThanOrEqual(MIN_CONTRAST)
  })

  it('measures a translucent colour as it lands on the surface', () => {
    // 40% grey composites to a mid grey on white: 3.02:1, so it gets darkened.
    const fixed = raiseContrast('#393a3466', '#ffffff')
    expect(fixed).toHaveLength(7)
    expect(contrast(fixed, '#ffffff')).toBeGreaterThanOrEqual(MIN_CONTRAST)
    // Fully opaque at 11.5:1, it is left exactly as the theme wrote it.
    expect(raiseContrast('#dbd7caee', CODE_SURFACE.dark)).toBe('#dbd7caee')
  })

  it('keeps the hue when no lightness clears the bar', () => {
    // Vitesse's own diff background leaves no room at either end.
    expect(raiseContrast('#ffab70', '#c24e00')).toBe('#ffab70')
  })

  it('keeps the hue it was given', () => {
    // Vitesse's orange stays orange rather than drifting toward a neutral.
    const fixed = raiseContrast('#b07d48', '#ffffff')
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(fixed.slice(i, i + 2), 16))
    expect(r).toBeGreaterThan(g!)
    expect(g).toBeGreaterThan(b!)
  })
})

describe('codeThemes', () => {
  it('clears the contrast floor for every token read against the surface', async () => {
    const themes = await codeThemes()
    for (const appearance of ['light', 'dark'] as const) {
      const surface = CODE_SURFACE[appearance]
      // Rules that paint their own background (diff markup, `carriage-return`)
      // are not read against the surface, so they are checked by the test below.
      const colors = foregrounds(themes[appearance], surface).filter((c) => c.behind === surface)
      expect(colors.length).toBeGreaterThan(10)
      for (const { color } of colors) {
        expect(contrast(color, surface), `${color} (${appearance})`).toBeGreaterThanOrEqual(
          MIN_CONTRAST,
        )
      }
    }
  })

  it('is a strict improvement — no token loses contrast, none is touched needlessly', async () => {
    for (const appearance of ['light', 'dark'] as const) {
      const surface = CODE_SURFACE[appearance]
      const base = (await bundledThemes[`vitesse-${appearance}`]()).default as RawTheme
      const before = foregrounds(base, surface)
      const after = foregrounds((await codeThemes())[appearance], surface)

      expect(after).toHaveLength(before.length)
      before.forEach((original, i) => {
        expect(contrast(after[i]!.color, after[i]!.behind)).toBeGreaterThanOrEqual(
          contrast(original.color, original.behind) - 0.001,
        )
      })

      // Only the colours that fell short are rewritten; the rest stay Vitesse.
      const changed = before.filter((o, i) => o.color !== after[i]!.color)
      expect(changed.length).toBeGreaterThan(0)
      for (const { color, behind } of changed) {
        expect(contrast(color, behind)).toBeLessThan(MIN_CONTRAST)
      }
    }
  })
})
