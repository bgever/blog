import { createContentLoader } from 'vitepress'
import {
  byDateDesc,
  extractExcerpt,
  normaliseDate,
  normalisePostUrl,
  validateFrontmatter,
  type Post,
} from './lib/posts'

declare const data: Post[]
export { data }

/** Drafts render in `vitepress dev` so you can preview them, never in a build. */
const isDev = process.env.NODE_ENV !== 'production'

export default createContentLoader('posts/**/*.md', {
  render: true,
  includeSrc: true,
  transform(raw): Post[] {
    const posts = raw.map((page) => {
      const fm = validateFrontmatter(page.url, page.frontmatter)
      return {
        // The loader does not apply `rewrites`, so its URLs still carry the
        // /posts/ prefix that the served routes do not have.
        url: normalisePostUrl(page.url),
        title: fm.title,
        description: fm.description,
        date: fm.date,
        updated: fm.updated ? normaliseDate(fm.updated) : null,
        tags: fm.tags ?? [],
        cover: fm.cover ?? null,
        coverAlt: fm.coverAlt ?? null,
        coverSource: fm.coverSource ?? null,
        excerpt: extractExcerpt(page.html ?? '', page.src ?? ''),
        draft: fm.draft === true,
      } satisfies Post
    })

    return posts.filter((p) => isDev || !p.draft).sort(byDateDesc)
  },
})
