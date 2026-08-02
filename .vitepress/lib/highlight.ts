import { bundledThemes } from 'shiki'
import { CODE_SURFACE, MIN_CONTRAST, withMinimumContrast, type RawTheme } from './code-theme'

/** The two appearances VitePress asks for, and the only keys used below. */
const APPEARANCES = ['light', 'dark'] as const

/**
 * Vitesse: the warmest pair Shiki bundles and the one that sits most quietly
 * beside Ink & Amber's cream and amber. It is also the softest, so it leans
 * hardest on the correction below. Swap these two names to try another; the
 * contrast floor applies to whatever is set here.
 */
const BASE = { light: 'vitesse-light', dark: 'vitesse-dark' } as const

/**
 * Loads the two Shiki themes and hands back contrast-corrected copies for
 * `markdown.theme`. See `code-theme.ts` for why they need correcting.
 */
export async function codeThemes(): Promise<{ light: RawTheme; dark: RawTheme }> {
  // Mapped over the appearances rather than written out twice, so a theme can
  // never end up corrected against the other side's surface or floor.
  const corrected = await Promise.all(
    APPEARANCES.map(async (appearance) => {
      const theme = (await bundledThemes[BASE[appearance]]()).default as RawTheme
      return withMinimumContrast(theme, CODE_SURFACE[appearance], MIN_CONTRAST[appearance])
    }),
  )
  return { light: corrected[0]!, dark: corrected[1]! }
}
