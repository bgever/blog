import { bundledThemes } from 'shiki'
import { CODE_SURFACE, withMinimumContrast, type RawTheme } from './code-theme'

/** The Vitesse pair, chosen for hues that sit comfortably in Ink & Amber. */
const BASE = { light: 'vitesse-light', dark: 'vitesse-dark' } as const

/**
 * Loads the two Shiki themes and hands back contrast-corrected copies for
 * `markdown.theme`. See `code-theme.ts` for why they need correcting.
 */
export async function codeThemes(): Promise<{ light: RawTheme; dark: RawTheme }> {
  const [light, dark] = await Promise.all([
    bundledThemes[BASE.light]().then((m) => m.default as RawTheme),
    bundledThemes[BASE.dark]().then((m) => m.default as RawTheme),
  ])
  return {
    light: withMinimumContrast(light, CODE_SURFACE.light),
    dark: withMinimumContrast(dark, CODE_SURFACE.dark),
  }
}
