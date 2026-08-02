import { copyFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { Feed } from 'feed'
import { createContentLoader, type SiteConfig } from 'vitepress'
import { SITE } from './site'
import { byDateDesc, normalizeDate, validateFrontmatter, type Post } from './lib/posts'
import { urlForPage } from './head'

/**
 * Writes an RSS 2.0 feed with the full rendered body of the most recent posts.
 *
 * Runs in `buildEnd` because that is the only hook where the rendered HTML of
 * every post is available at once. Relative URLs inside post bodies are made
 * absolute so images and links resolve inside feed readers.
 */
export async function writeFeed(config: SiteConfig): Promise<void> {
  const feed = new Feed({
    title: SITE.title,
    description: SITE.description,
    id: SITE.origin,
    link: SITE.origin,
    language: SITE.lang,
    favicon: `${SITE.origin}/favicon.png`,
    copyright: `Content licensed ${SITE.license.content.name} — ${SITE.name}`,
    feedLinks: { rss: `${SITE.origin}/rss.xml` },
    author: { name: SITE.name, link: SITE.origin },
  })

  const pages = await createContentLoader('posts/**/*.md', {
    render: true,
    includeSrc: true,
  }).load()

  const posts = pages
    .map((page) => {
      const fm = validateFrontmatter(page.url, page.frontmatter)
      return { page, fm }
    })
    .filter(({ fm }) => fm.draft !== true)
    .map(({ page, fm }) => ({
      url: urlForPage(page.url.replace(/^\//, '')),
      title: fm.title,
      description: fm.description,
      date: fm.date,
      updated: fm.updated ? normalizeDate(fm.updated) : null,
      tags: fm.tags ?? [],
      cover: fm.cover ?? null,
      html: absolutize(stripCodeBlockChrome(page.html ?? '')),
    }))

  posts
    .sort((a, b) => byDateDesc({ ...a, ...emptyPost }, { ...b, ...emptyPost }))
    .slice(0, SITE.feedCount)
    .forEach((post) => {
      const link = new URL(post.url, SITE.origin).href
      feed.addItem({
        title: post.title,
        id: link,
        link,
        description: post.description,
        content: post.html,
        date: new Date(`${post.updated ?? post.date}T00:00:00Z`),
        published: new Date(`${post.date}T00:00:00Z`),
        author: [{ name: SITE.name, link: SITE.origin }],
        category: post.tags.map((name) => ({ name })),
        image: post.cover ? new URL(post.cover, SITE.origin).href : undefined,
      })
    })

  writeFileSync(path.join(config.outDir, 'rss.xml'), feed.rss2(), 'utf-8')
}

/**
 * Replaces VitePress' 404.html with a server-rendered one.
 *
 * VitePress treats `404.html` as the SPA fallback and emits it with an empty
 * body — it cannot know the requested path at build time, so the content is
 * left to hydrate client-side. Cloudflare serves that file directly for every
 * unmatched URL, so anything that does not run JavaScript would get a blank
 * page. `src/not-found.md` renders the same component through the normal
 * pipeline; this swaps it in and drops the duplicate route.
 */
export function writeRenderedNotFound(outDir: string): void {
  const rendered = path.join(outDir, 'not-found.html')
  copyFileSync(rendered, path.join(outDir, '404.html'))
  rmSync(rendered)
}

/**
 * Drops the chrome VitePress injects into every code block: the copy button
 * and the language label.
 *
 * Both are positioned over the block by the site's stylesheet, which a feed
 * reader does not load. Without it the button is a stray empty box — its click
 * handler is not there either — and the label renders as a loose word above
 * the code.
 */
function stripCodeBlockChrome(html: string): string {
  return html
    .replace(/<button\b[^>]*\bclass="copy"[^>]*><\/button>/g, '')
    .replace(/<span class="lang">[^<]*<\/span>/g, '')
}

/** Rewrites root-relative `src`/`href` attributes to absolute URLs. */
function absolutize(html: string): string {
  return html.replace(/(\s(?:src|href))="\/(?!\/)/g, `$1="${SITE.origin}/`)
}

/** byDateDesc only reads `date` and `title`; this satisfies the rest of the type. */
const emptyPost: Omit<Post, 'date' | 'title'> = {
  url: '',
  description: '',
  updated: null,
  tags: [],
  cover: null,
  coverAlt: null,
  coverSource: null,
  excerpt: '',
  draft: false,
}
