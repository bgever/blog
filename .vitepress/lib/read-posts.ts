import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { globSync } from 'node:fs'
import matter from 'gray-matter'
import { validateFrontmatter, type PostFrontmatter } from './posts'

const SRC = path.resolve(fileURLToPath(new URL('../../src', import.meta.url)))

export interface RawPost {
  /** Path relative to srcDir, e.g. `posts/2021/hello-world-again.md`. */
  relativePath: string
  frontmatter: PostFrontmatter
}

/**
 * Reads post frontmatter straight off disk.
 *
 * Dynamic route `paths()` resolve before the VitePress config exists, so
 * `createContentLoader` is unavailable there — this is the way in.
 */
export function readPosts(): RawPost[] {
  const files = globSync('posts/**/*.md', { cwd: SRC }).sort()
  return files.map((relativePath) => {
    const raw = readFileSync(path.join(SRC, relativePath), 'utf-8')
    const { data } = matter(raw)
    return { relativePath, frontmatter: validateFrontmatter(relativePath, data) }
  })
}
