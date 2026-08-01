/**
 * Shared post types and frontmatter validation.
 *
 * Validation is deliberately strict and throws: a malformed post should fail
 * the build rather than render a broken card or an image without alt text.
 */

export interface PostFrontmatter {
  title: string
  date: string
  description: string
  tags?: string[]
  cover?: string
  coverAlt?: string
  coverSource?: string
  updated?: string
  draft?: boolean
}

export interface Post {
  url: string
  title: string
  description: string
  /** ISO date, used for sorting and <time datetime>. */
  date: string
  updated: string | null
  tags: string[]
  cover: string | null
  coverAlt: string | null
  coverSource: string | null
  /** Plain-text first paragraph (or up to `<!-- more -->`), for cards. */
  excerpt: string
  draft: boolean
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

class PostError extends Error {
  constructor(file: string, message: string) {
    super(`Invalid post frontmatter in ${file}: ${message}`)
    this.name = 'PostError'
  }
}

/** Throws if a post is missing anything the theme, RSS or SEO layers rely on. */
export function validateFrontmatter(file: string, fm: Partial<PostFrontmatter>): PostFrontmatter {
  const required = ['title', 'description'] as const
  for (const key of required) {
    const value = fm[key]
    if (typeof value !== 'string' || value.trim() === '') {
      throw new PostError(file, `\`${key}\` is required and must be a non-empty string`)
    }
  }

  const date = normalizeDate(fm.date)
  if (!date) {
    throw new PostError(file, '`date` is required and must be a YYYY-MM-DD date')
  }

  if (fm.updated !== undefined && !normalizeDate(fm.updated)) {
    throw new PostError(file, '`updated` must be a YYYY-MM-DD date when present')
  }

  if (fm.cover !== undefined) {
    if (typeof fm.cover !== 'string' || !fm.cover.startsWith('/')) {
      throw new PostError(
        file,
        '`cover` must be a root-relative path to a local file (e.g. /covers/name.webp)',
      )
    }
    if (typeof fm.coverAlt !== 'string' || fm.coverAlt.trim() === '') {
      throw new PostError(file, '`coverAlt` is required whenever `cover` is set')
    }
  }

  if (fm.tags !== undefined) {
    if (!Array.isArray(fm.tags) || fm.tags.some((t) => typeof t !== 'string' || !t.trim())) {
      throw new PostError(file, '`tags` must be an array of non-empty strings')
    }
  }

  return { ...fm, date } as PostFrontmatter
}

/**
 * Accepts a `YYYY-MM-DD` string or a Date (js-yaml parses unquoted dates into
 * Date objects) and returns `YYYY-MM-DD`, or null if it is neither.
 */
export function normalizeDate(value: unknown): string | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10)
  }
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  if (ISO_DATE.test(trimmed)) return trimmed
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime())) return null
  return parsed.toISOString().slice(0, 10)
}

/**
 * `createContentLoader` builds page URLs from source paths WITHOUT applying
 * the `rewrites` from config.ts, so a loader URL arrives as
 * `/posts/2021/hello-world-again` while the page is actually served at
 * `/2021/hello-world-again`. Every listing link must pass through this or it
 * 404s in production.
 */
export function normalizePostUrl(loaderUrl: string): string {
  return loaderUrl.replace(/^\/posts\//, '/')
}

/** `personal` -> `personal`, `Web Dev` -> `web-dev`. Used for /tags/:slug URLs. */
export function tagSlug(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/** "3 July 2021" — matches the date format used throughout the theme. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${d} ${months[m - 1]} ${y}`
}

/**
 * Pulls the card excerpt out of rendered post HTML: everything before an
 * explicit `<!-- more -->` marker, else the first paragraph. Returns plain
 * text, since the card clamps it to three lines.
 */
export function extractExcerpt(html: string, rawMarkdown: string): string {
  const hasMore = /<!--\s*more\s*-->/.test(rawMarkdown)
  if (hasMore) {
    const [before] = rawMarkdown.split(/<!--\s*more\s*-->/)
    return toPlainText(stripInlineMarkdown(before ?? '')).trim()
  }
  const match = html.match(/<p>([\s\S]*?)<\/p>/)
  return toPlainText(match?.[1] ?? '').trim()
}

/**
 * Reduces inline markdown to the text a reader is meant to see, so the
 * `<!-- more -->` branch (which reads unrendered markdown) matches what the
 * first-paragraph branch gets for free from the rendered HTML. Without it a
 * card shows the literal `[Auth0](https://auth0.com/)` — a URL nobody can
 * click in a blurb. Images drop out completely: alt text describes a picture
 * the card does not show.
 *
 * The URL pattern tolerates one level of nested parentheses so that
 * Wikipedia-style `..._(disambiguation)` targets do not end mid-link.
 * Emphasis handles `*` only — `_` is too common inside identifiers to strip
 * safely with a regex.
 *
 * Code spans come out first and go back in last, so the passes in between
 * cannot reach inside them: `` `*glob*` `` is a literal shell pattern, not
 * emphasis, and matching the delimiter run by length keeps a span like
 * ``` ``a ` b`` ``` from ending at the backtick it is meant to contain.
 */
function stripInlineMarkdown(markdown: string): string {
  const url = String.raw`\((?:[^()]|\([^()]*\))*\)`
  const code: string[] = []
  return (
    markdown
      .replace(/\u0000/g, '')
      .replace(/(`+)([\s\S]*?)\1(?!`)/g, (_match, _ticks, content: string) =>
        placeholder(code.push(content) - 1),
      )
      .replace(new RegExp(String.raw`!\[[^\]]*\]${url}`, 'g'), '')
      .replace(/!\[[^\]]*\]\[[^\]]*\]/g, '')
      .replace(new RegExp(String.raw`\[([^\]]*)\]${url}`, 'g'), '$1')
      .replace(/\[([^\]]*)\]\[[^\]]*\]/g, '$1')
      // A definition's title may sit on the next line, indented; drop it with
      // the definition or the card shows a bare `"Docs title"`.
      .replace(
        /^[ \t]*\[[^\]]+\]:[ \t]*\S+.*(?:\n[ \t]+(?:"[^"]*"|'[^']*'|\([^)]*\))[ \t]*)?$/gm,
        '',
      )
      .replace(/(\*{1,3})(?=\S)([\s\S]*?\S)\1/g, '$2')
      .replace(/\u0000(\d+)\u0000/g, (_match, index: string) => code[Number(index)] ?? '')
  )
}

/**
 * Stands in for a code span while the other passes run. The NUL sentinel is
 * stripped from the source before any span is lifted, so nothing written in a
 * post can impersonate a placeholder and pull in someone else's code.
 */
function placeholder(index: number): string {
  return `\u0000${index}\u0000`
}

function toPlainText(input: string): string {
  return input
    .replace(/<[^>]+>/g, '')
    .replace(/^---[\s\S]*?---/, '')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

/** Newest first; ties broken by title so ordering is stable across builds. */
export function byDateDesc(a: Post, b: Post): number {
  if (a.date !== b.date) return a.date < b.date ? 1 : -1
  return a.title.localeCompare(b.title)
}
