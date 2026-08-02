import { bundledThemes } from 'shiki'
import { CODE_SURFACE, withMinimumContrast, type RawTheme } from './code-theme'

/**
 * GitHub's own pair: the colours most readers already associate with code,
 * and the highest-contrast themes Shiki bundles — the correction below barely
 * has to touch them. Swap these two names to try another; the contrast floor
 * applies to whatever is set here.
 */
const BASE = { light: 'github-light-default', dark: 'github-dark-default' } as const

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
