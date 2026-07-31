/**
 * Single source of truth for site-wide identity. Imported by the VitePress
 * config, the RSS builder and the theme, so these values are never restated.
 */
export const SITE = {
  name: 'Bart Verkoeijen',
  title: 'Bart Verkoeijen',
  description:
    'Notes on web development, software craft, and building things — by Bart Verkoeijen, a Dutch software engineer based in Hong Kong.',
  /** Canonical origin. Apex, no trailing slash — `www` redirects here. */
  origin: 'https://bgever.com',
  lang: 'en',
  intro:
    'Dutch software engineer in Hong Kong. Founder of Flippercast. Writing about the craft of building for the web.',
  avatar: '/avatar.jpg',
  /** Fallback social card for pages and posts with no cover of their own. */
  ogImage: '/og-default.png',
  repo: 'https://github.com/bgever/blog',
  /** Number of posts on the homepage before readers are sent to /archive. */
  homePostCount: 10,
  /** Number of items in the RSS feed. */
  feedCount: 10,
  /** A post needs at least this many headings before it gets a table of contents. */
  tocMinHeadings: 3,
  links: [
    { label: 'GitHub', url: 'https://github.com/bgever' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/bartverkoeijen/' },
    { label: 'Flippercast', url: 'https://flippercast.com' },
  ],
  nav: [
    { label: 'Blog', url: '/' },
    { label: 'Archive', url: '/archive' },
    { label: 'Tags', url: '/tags' },
    { label: 'About', url: '/about' },
  ],
  licence: {
    content: {
      name: 'CC BY-NC-SA 4.0',
      url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    },
    code: { name: 'MIT', url: 'https://github.com/bgever/blog/blob/main/LICENSE' },
  },
} as const

export type SiteConfig = typeof SITE
