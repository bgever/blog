import type { HeadConfig, PageData } from 'vitepress'
import { SITE } from './site'
import { normaliseDate } from './lib/posts'

const abs = (path: string) => new URL(path, SITE.origin).href

/**
 * `posts/2021/x.md` -> `/2021/x`; mirrors the `rewrites` in config.ts.
 *
 * Never emits a trailing slash (except for the root), so canonical URLs and
 * the sitemap agree with `cleanUrls` and with Cloudflare's trailing-slash
 * handling. `tags/index.md` becomes `/tags`, not `/tags/`.
 */
export function urlForPage(relativePath: string): string {
  const path = relativePath
    .replace(/^posts\//, '')
    .replace(/(?:(^|\/)index)?\.md$/, '$1')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '')
  return '/' + path
}

/**
 * True for pages authored under `src/posts/`.
 *
 * Must test `filePath`, not `relativePath`: by the time transform hooks run,
 * `rewrites` has already mapped `posts/2021/x.md` to `2021/x.md`, so the
 * `posts/` prefix is gone from relativePath.
 */
export function isPostPage(pageData: { filePath?: string; relativePath: string }): boolean {
  const source = pageData.filePath || pageData.relativePath
  return /(^|\/)posts\//.test(source)
}

/**
 * Per-page canonical, Open Graph, Twitter and JSON-LD tags.
 *
 * og:image uses the post's own cover when it has one, falling back to the
 * static site card so every page has a usable social preview.
 */
export function headForPage(pageData: PageData): HeadConfig[] {
  const fm = pageData.frontmatter ?? {}
  const isPost = isPostPage(pageData)
  const url = abs(urlForPage(pageData.relativePath))
  const title = pageData.title ? `${pageData.title} — ${SITE.name}` : SITE.title
  const description = pageData.description || fm.description || SITE.description
  const image = abs(typeof fm.cover === 'string' ? fm.cover : SITE.ogImage)

  const head: HeadConfig[] = [
    ['link', { rel: 'canonical', href: url }],
    ['meta', { property: 'og:type', content: isPost ? 'article' : 'website' }],
    ['meta', { property: 'og:title', content: title }],
    ['meta', { property: 'og:description', content: description }],
    ['meta', { property: 'og:url', content: url }],
    ['meta', { property: 'og:image', content: image }],
    ['meta', { property: 'og:site_name', content: SITE.name }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: title }],
    ['meta', { name: 'twitter:description', content: description }],
    ['meta', { name: 'twitter:image', content: image }],
  ]

  if (isPost && typeof fm.coverAlt === 'string') {
    head.push(['meta', { property: 'og:image:alt', content: fm.coverAlt }])
  }

  head.push([
    'script',
    { type: 'application/ld+json' },
    JSON.stringify(jsonLd(pageData, url, image)),
  ])

  return head
}

function jsonLd(pageData: PageData, url: string, image: string): Record<string, unknown> {
  const fm = pageData.frontmatter ?? {}
  const author = {
    '@type': 'Person',
    name: SITE.name,
    url: SITE.origin,
    sameAs: SITE.links.map((l) => l.url),
  }

  if (isPostPage(pageData)) {
    const published = normaliseDate(fm.date)
    return {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: pageData.title,
      description: pageData.description || fm.description,
      image,
      url,
      datePublished: published,
      dateModified: normaliseDate(fm.updated) ?? published,
      author,
      publisher: author,
      keywords: Array.isArray(fm.tags) ? fm.tags.join(', ') : undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      license: SITE.licence.content.url,
    }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    description: SITE.description,
    url: SITE.origin,
    author,
  }
}
