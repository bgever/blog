import { describe, expect, it } from 'vitest'
import {
  byDateDesc,
  extractExcerpt,
  formatDate,
  normaliseDate,
  tagSlug,
  validateFrontmatter,
  type Post,
} from '../.vitepress/lib/posts'
import { readPosts } from '../.vitepress/lib/read-posts'
import { isPostPage, urlForPage } from '../.vitepress/head'

const valid = {
  title: 'Hello World, again!',
  date: '2021-07-03',
  description: 'Motivations for why I started blogging again',
}

describe('validateFrontmatter', () => {
  it('accepts a well-formed post', () => {
    expect(validateFrontmatter('a.md', valid).title).toBe(valid.title)
  })

  it.each(['title', 'description'] as const)('rejects a missing %s', (key) => {
    const fm = { ...valid, [key]: undefined }
    expect(() => validateFrontmatter('a.md', fm)).toThrow(new RegExp(`\`${key}\` is required`))
  })

  it('rejects a missing date', () => {
    expect(() => validateFrontmatter('a.md', { ...valid, date: undefined })).toThrow(/`date`/)
  })

  it('rejects a cover without alt text', () => {
    const fm = { ...valid, cover: '/covers/x.webp' }
    expect(() => validateFrontmatter('a.md', fm)).toThrow(/`coverAlt` is required/)
  })

  it('rejects a remote cover URL', () => {
    const fm = { ...valid, cover: 'https://images.unsplash.com/x.jpg', coverAlt: 'x' }
    expect(() => validateFrontmatter('a.md', fm)).toThrow(/root-relative path/)
  })

  it('rejects a malformed updated date', () => {
    expect(() => validateFrontmatter('a.md', { ...valid, updated: 'soon' })).toThrow(/`updated`/)
  })

  it('rejects non-string tags', () => {
    expect(() => validateFrontmatter('a.md', { ...valid, tags: [1] as never })).toThrow(/`tags`/)
  })

  it('names the offending file in the message', () => {
    expect(() => validateFrontmatter('posts/2021/bad.md', {})).toThrow(/posts\/2021\/bad\.md/)
  })
})

describe('normaliseDate', () => {
  it('passes through an ISO date', () => {
    expect(normaliseDate('2021-07-03')).toBe('2021-07-03')
  })

  it('accepts a Date, as YAML produces for unquoted dates', () => {
    expect(normaliseDate(new Date('2021-07-03T03:31:10.231Z'))).toBe('2021-07-03')
  })

  it('returns null for nonsense', () => {
    expect(normaliseDate('not a date')).toBeNull()
  })
})

describe('tagSlug', () => {
  it.each([
    ['personal', 'personal'],
    ['Web Dev', 'web-dev'],
    ['C#', 'c'],
  ])('slugs %s to %s', (input, expected) => {
    expect(tagSlug(input)).toBe(expected)
  })
})

describe('formatDate', () => {
  it('renders the site date format', () => {
    expect(formatDate('2021-07-03')).toBe('3 July 2021')
  })
})

describe('extractExcerpt', () => {
  it('takes the first paragraph when there is no marker', () => {
    const html = '<p>First para.</p><p>Second para.</p>'
    expect(extractExcerpt(html, 'First para.\n\nSecond para.')).toBe('First para.')
  })

  it('honours an explicit <!-- more --> marker', () => {
    const md = 'Lead in.\n\nStill the lead.\n\n<!-- more -->\n\nThe rest.'
    expect(extractExcerpt('<p>Lead in.</p>', md)).toBe('Lead in. Still the lead.')
  })

  it('strips markup and decodes entities', () => {
    expect(extractExcerpt('<p>A <em>bold</em> &amp; brave claim.</p>', 'x')).toBe(
      'A bold & brave claim.',
    )
  })
})

describe('byDateDesc', () => {
  it('sorts newest first', () => {
    const posts = [
      { date: '2021-01-01', title: 'old' },
      { date: '2026-01-01', title: 'new' },
    ] as Post[]
    expect([...posts].sort(byDateDesc)[0]?.title).toBe('new')
  })
})

describe('urlForPage', () => {
  it.each([
    ['posts/2021/hello-world-again.md', '/2021/hello-world-again'],
    ['2021/hello-world-again.md', '/2021/hello-world-again'],
    ['about.md', '/about'],
    ['tags/index.md', '/tags'],
    ['index.md', '/'],
  ])('maps %s to %s', (input, expected) => {
    expect(urlForPage(input)).toBe(expected)
  })
})

describe('isPostPage', () => {
  it('detects a post from its source path even after rewrites', () => {
    expect(isPostPage({ filePath: 'src/posts/2021/x.md', relativePath: '2021/x.md' })).toBe(true)
  })

  it('does not treat a normal page as a post', () => {
    expect(isPostPage({ filePath: 'src/about.md', relativePath: 'about.md' })).toBe(false)
  })
})

describe('the posts actually in this repo', () => {
  const posts = readPosts()

  it('has at least one post', () => {
    expect(posts.length).toBeGreaterThan(0)
  })

  it('every post has valid frontmatter', () => {
    // readPosts validates as it reads; reaching here means every file passed.
    for (const post of posts) {
      expect(post.frontmatter.title).toBeTruthy()
      expect(normaliseDate(post.frontmatter.date)).not.toBeNull()
    }
  })

  it('every cover is a local file with alt text', () => {
    for (const post of posts) {
      if (!post.frontmatter.cover) continue
      expect(post.frontmatter.cover.startsWith('/')).toBe(true)
      expect(post.frontmatter.coverAlt?.trim()).toBeTruthy()
    }
  })
})
