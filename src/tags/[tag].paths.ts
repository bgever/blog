import { readPosts } from '../../.vitepress/lib/read-posts'
import { tagSlug } from '../../.vitepress/lib/posts'

/**
 * Statically generates one real page per tag, so /tags/personal is a genuine,
 * indexable URL rather than a client-side filter.
 */
export default {
  paths() {
    const isDev = process.env.NODE_ENV !== 'production'
    const labels = new Map<string, string>()

    for (const { frontmatter } of readPosts()) {
      if (frontmatter.draft === true && !isDev) continue
      for (const tag of frontmatter.tags ?? []) labels.set(tagSlug(tag), tag)
    }

    return [...labels.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([slug, label]) => ({ params: { tag: slug, label } }))
  },
}
