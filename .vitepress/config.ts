import { defineConfig } from 'vitepress'
import { SITE } from './site'
import { headForPage, isPostPage } from './head'
import { writeFeed, writeRenderedNotFound } from './rss'
import { readPosts } from './lib/read-posts'

/**
 * Filtering drafts out of the content loader hides them from listings and
 * RSS, but VitePress still renders every .md under src as a page — so without
 * this a draft would ship at its real URL (and in the sitemap) in production.
 * Excluding the source files is the only thing that truly unpublishes them.
 */
const draftSources =
  process.env.NODE_ENV === 'production'
    ? readPosts()
        .filter((p) => p.frontmatter.draft === true)
        .map((p) => p.relativePath)
    : []

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  srcExclude: draftSources,
  cleanUrls: true,
  appearance: true,
  lang: SITE.lang,
  title: SITE.title,
  titleTemplate: `:title — ${SITE.name}`,
  description: SITE.description,
  sitemap: {
    hostname: SITE.origin,
    // Keep sitemap URLs identical to the canonical tags: no trailing slashes,
    // and sorted so the file has a stable diff between builds.
    transformItems: (items) =>
      items
        // The 404 page is not a destination; buildEnd renames not-found.html
        // to 404.html, so neither name belongs in the sitemap.
        .filter((item) => !/(^|\/)(404|not-found)(\.html)?$/.test(item.url))
        .map((item) => ({ ...item, url: item.url.replace(/\/+$/, '') }))
        .sort((a, b) => a.url.localeCompare(b.url)),
  },
  metaChunk: true,

  /**
   * Posts live under `src/posts/<year>/` for a tidy source tree but are served
   * at `/<year>/<slug>` — the URL shape the Eleventy site used, so no existing
   * link breaks.
   */
  rewrites: (id) => id.replace(/^posts\//, ''),

  head: [
    ['meta', { name: 'author', content: SITE.name }],
    ['meta', { name: 'theme-color', content: '#FAF9F6', media: '(prefers-color-scheme: light)' }],
    ['meta', { name: 'theme-color', content: '#12110F', media: '(prefers-color-scheme: dark)' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' }],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: `${SITE.name} — RSS`,
        href: `${SITE.origin}/rss.xml`,
      },
    ],
  ],

  markdown: {
    theme: { light: 'vitesse-light', dark: 'vitesse-dark' },
    // The default theme derives its outline client-side; a custom theme needs
    // headers in pageData, which is what the table of contents reads.
    headers: { level: [2, 3] },
  },

  transformPageData(pageData) {
    // Posts get the post layout without repeating `layout:` in every file.
    // Detected via filePath: `rewrites` has already stripped `posts/` off
    // relativePath by the time these hooks run.
    if (isPostPage(pageData)) {
      pageData.frontmatter.layout ??= 'post'
    }
    // Dynamic tag routes get their title and description from the route params.
    const label = pageData.params?.label
    if (typeof label === 'string') {
      pageData.title = `Posts tagged “${label}”`
      pageData.description = `Everything on this blog tagged “${label}”.`
    }
  },

  /** Appends canonical, OG/Twitter and JSON-LD tags to each page's <head>. */
  transformHead(ctx) {
    return headForPage(ctx.pageData)
  },

  async buildEnd(config) {
    await writeFeed(config)
    writeRenderedNotFound(config.outDir)
  },
})
