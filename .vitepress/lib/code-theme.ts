/**
 * Syntax highlighting colours, raised to a readable contrast.
 *
 * A Shiki theme is authored against its own editor background, and the page
 * paints `--c-surface` instead — close, but not the same colour, so a token
 * that cleared the bar in VS Code can land under it here. Vitesse is soft to
 * begin with and lands well under: comments at 2.34:1 on the light surface,
 * brackets at 3.03:1 on the dark one, against a 4.5:1 WCAG AA threshold.
 *
 * So rather than trust the theme, the colours are checked against the surface
 * they actually land on: each one keeps its hue, and only those short of the
 * floor are pushed — darker on the light surface, lighter on the dark one —
 * until they clear it. This holds for whichever pair `highlight.ts` names.
 */

/** Background the code actually sits on: `--c-surface` in either appearance. */
export const CODE_SURFACE = { light: '#ffffff', dark: '#1b1a17' } as const

/**
 * The contrast floor every token has to clear, per appearance. Both are well
 * past the 4.5:1 WCAG AA asks for body text — clearing the bar is not the same
 * as being comfortable to read, and at AA Vitesse's faint tokens are still the
 * faint ones.
 *
 * The two differ because the surfaces do. Pure white is unforgiving: every
 * step of floor on the light side drags the whole palette darker, and past 6:1
 * Vitesse stops reading as itself. The dark surface is a warm near-black with
 * more headroom above it, so 7:1 lifts the brackets and comments that needed
 * it without flattening the rest.
 *
 * Even so this is a heavy hand — roughly four fifths of the palette is
 * rewritten either way, so much of what ships is this module's arithmetic
 * rather than the theme author's eye. Lower a side if its blocks ever start to
 * read as louder than the prose around them.
 */
export const MIN_CONTRAST = { light: 6, dark: 7 } as const

interface Rgb {
  r: number
  g: number
  b: number
}

/** A TextMate theme, narrowed to the parts that carry colour. */
export interface RawTheme {
  fg?: string
  bg?: string
  colors?: Record<string, string>
  settings?: ThemeRule[]
  tokenColors?: ThemeRule[]
  [key: string]: unknown
}

interface ThemeRule {
  scope?: string | string[]
  settings: { foreground?: string; background?: string; [key: string]: unknown }
}

/** Parses `#rgb`, `#rrggbb` and `#rrggbbaa`. Alpha comes back as 0–1. */
function parseHex(hex: string): (Rgb & { a: number }) | null {
  const raw = hex.trim().replace(/^#/, '')
  const full =
    raw.length === 3 || raw.length === 4
      ? raw
          .split('')
          .map((c) => c + c)
          .join('')
      : raw
  if (!/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(full)) return null
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
    a: full.length === 8 ? parseInt(full.slice(6, 8), 16) / 255 : 1,
  }
}

function toHex({ r, g, b }: Rgb): string {
  const channel = (v: number) =>
    Math.round(Math.min(255, Math.max(0, v)))
      .toString(16)
      .padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

/** Flattens a translucent colour onto the surface behind it. */
function compositeOver(fg: Rgb & { a: number }, bg: Rgb): Rgb {
  return {
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
  }
}

function toLinear(channel: number): number {
  const v = channel / 255
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
}

function fromLinear(value: number): number {
  const v = value <= 0.0031308 ? value * 12.92 : 1.055 * value ** (1 / 2.4) - 0.055
  return v * 255
}

/** WCAG relative luminance. */
function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG contrast ratio, 1 (identical) to 21 (black on white). */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [la, lb] = [luminance(a), luminance(b)]
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/*
 * Lightness is adjusted in Oklab rather than sRGB: holding a/b fixed while
 * moving L keeps the hue recognisably Vitesse, where scaling RGB channels
 * would drift the hue and mixing toward white would wash out the chroma.
 * Conversion matrices are Björn Ottosson's.
 */
function toOklab({ r, g, b }: Rgb): [number, number, number] {
  const lr = toLinear(r)
  const lg = toLinear(g)
  const lb = toLinear(b)
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function fromOklab([L, A, B]: [number, number, number]): Rgb {
  const l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
  const m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
  const s = (L - 0.0894841775 * A - 1.291485548 * B) ** 3
  return {
    r: fromLinear(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: fromLinear(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: fromLinear(-0.0041960863 * l - 0.7034186147 * m + 1.7076147 * s),
  }
}

/** Clamps into sRGB so out-of-gamut results stay a real colour. */
function clamp({ r, g, b }: Rgb): Rgb {
  const c = (v: number) => Math.min(255, Math.max(0, v))
  return { r: c(r), g: c(g), b: c(b) }
}

/**
 * Walks the colour's lightness toward `targetL` and returns the first step
 * that clears `minRatio`, or the far end if nothing does.
 *
 * Stepping is a linear scan rather than a bisection because clamping an
 * out-of-gamut result back into sRGB makes contrast only near-monotonic in
 * the step size; the scan takes the first qualifying value either way. Each
 * candidate is measured after rounding to hex, so the ratio that had to clear
 * the threshold is the one the browser will actually paint.
 */
function walkLightness(
  [startL, A, B]: [number, number, number],
  targetL: 0 | 1,
  surface: Rgb,
  minRatio: number,
): { hex: string; ratio: number } {
  const STEPS = 200
  let last = { hex: '', ratio: 0 }
  for (let i = 1; i <= STEPS; i++) {
    const hex = toHex(clamp(fromOklab([startL + ((targetL - startL) * i) / STEPS, A, B])))
    last = { hex, ratio: contrastRatio(parseHex(hex)!, surface) }
    if (last.ratio >= minRatio) break
  }
  return last
}

/**
 * Returns `color` unchanged when it already clears `minRatio` against `bg`,
 * otherwise the nearest colour of the same hue that does. The floor is passed
 * in rather than defaulted — the two appearances use different ones, and a
 * default is just a chance to silently apply the wrong side's.
 */
export function raiseContrast(color: string, bg: string, minRatio: number): string {
  const parsed = parseHex(color)
  const surface = parseHex(bg)
  if (!parsed || !surface) return color

  const flat = compositeOver(parsed, surface)
  if (contrastRatio(flat, surface) >= minRatio) return color

  // Move away from the surface first: darker on a light background, lighter
  // on a dark one. A mid-tone background can cap that end below the threshold
  // while the other end clears it — the diff rules paint one — so try the
  // opposite direction before giving up.
  const oklab = toOklab(flat)
  const darker = walkLightness(oklab, 0, surface, minRatio)
  const lighter = walkLightness(oklab, 1, surface, minRatio)
  const [away, toward] = luminance(surface) > 0.18 ? [darker, lighter] : [lighter, darker]

  if (away.ratio >= minRatio) return away.hex
  if (toward.ratio >= minRatio) return toward.hex
  // Neither end reaches it: a background this middling leaves no room. Better
  // to keep the hue the theme chose than to flatten it to black for a token
  // that is already legible against the block it paints for itself.
  return color
}

/**
 * Copies a theme with every foreground raised to `minRatio` against `bg`.
 * The theme's own `bg` is left alone — the page paints `--c-surface` behind
 * the block, and that is the colour these ratios are measured against.
 */
export function withMinimumContrast(theme: RawTheme, bg: string, minRatio: number): RawTheme {
  const lift = (color: string | undefined) =>
    color === undefined ? undefined : raiseContrast(color, bg, minRatio)

  const liftRules = (rules: ThemeRule[] | undefined) =>
    rules?.map((rule) => {
      const { foreground, background } = rule.settings ?? {}
      if (!foreground) return rule
      // Diff and `carriage-return` rules paint their own background; those
      // tokens never touch the surface, so they are judged against it instead.
      const behind = background ?? bg
      return {
        ...rule,
        settings: { ...rule.settings, foreground: raiseContrast(foreground, behind, minRatio) },
      }
    })

  const next: RawTheme = { ...theme }
  if (theme.fg) next.fg = lift(theme.fg)
  if (theme.colors?.['editor.foreground']) {
    next.colors = {
      ...theme.colors,
      'editor.foreground': lift(theme.colors['editor.foreground'])!,
    }
  }
  if (theme.settings) next.settings = liftRules(theme.settings)
  if (theme.tokenColors) next.tokenColors = liftRules(theme.tokenColors)
  return next
}
