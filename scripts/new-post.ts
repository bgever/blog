#!/usr/bin/env node
/**
 * Scaffolds a new post: `pnpm new-post "Some Title"`.
 *
 * Writes src/posts/<year>/<slug>.md with today's date and the full frontmatter
 * skeleton, so no field is ever quietly forgotten. Starts as a draft: drafts
 * render in `pnpm dev` but are excluded from builds, the sitemap and RSS.
 */
import { mkdirSync, existsSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = path.resolve(fileURLToPath(new URL('../src', import.meta.url)))

const title = process.argv.slice(2).join(' ').trim()
if (!title) {
  console.error('Usage: pnpm new-post "Post title"')
  process.exit(1)
}

const slug = title
  .toLowerCase()
  .replace(/['’]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')

if (!slug) {
  console.error(`Could not derive a URL slug from ${JSON.stringify(title)}.`)
  process.exit(1)
}

const now = new Date()
const date = now.toISOString().slice(0, 10)
const year = date.slice(0, 4)
const dir = path.join(SRC, 'posts', year)
const file = path.join(dir, `${slug}.md`)

if (existsSync(file)) {
  console.error(`Already exists: ${path.relative(process.cwd(), file)}`)
  process.exit(1)
}

const template = `---
title: ${title.includes(':') ? JSON.stringify(title) : title}
date: ${date}
description: One or two sentences. Used for search results, social cards and the RSS feed.
tags:
  - example
# Optional. Must be a local file under src/public/ — remote URLs are rejected.
# cover: /covers/${slug}.webp
# coverAlt: Describe what is actually in the image.
# coverSource: https://unsplash.com/photos/...
# Optional, when revisiting an old post:
# updated: ${date}
draft: true
---

Opening paragraph. This becomes the card excerpt on the homepage, so make it
worth reading on its own. Drop a \`<!-- more -->\` marker further down if you
want the excerpt to run longer than one paragraph.

## A section

Remove \`draft: true\` when it is ready to publish.
`

mkdirSync(dir, { recursive: true })
writeFileSync(file, template, 'utf-8')

console.log(`Created ${path.relative(process.cwd(), file)}`)
console.log(`It will be served at /${year}/${slug}`)
