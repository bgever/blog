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
    return toPlainText(before ?? '').trim()
  }
  const match = html.match(/<p>([\s\S]*?)<\/p>/)
  return toPlainText(match?.[1] ?? '').trim()
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
