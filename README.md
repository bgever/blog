# bgever.com

Personal blog of Bart Verkoeijen. [VitePress](https://vitepress.dev) v1 with a custom theme,
[Tailwind CSS](https://tailwindcss.com) v4, deployed to [Cloudflare
Workers](https://developers.cloudflare.com/workers/) with static assets.

## License

Two licenses, deliberately:

- **Code** — [MIT](LICENSE). Copyright (c) 2021-2026 Bart Verkoeijen.
- **Content** — [CC BY-NC-SA 4.0](LICENSE-CONTENT). The writing and Bart's own images.

Third-party images (post covers licensed from Unsplash and elsewhere) are **not** covered by the
content license. Each is credited on its post through the `coverSource` frontmatter field and
listed in [LICENSE-CONTENT](LICENSE-CONTENT). Clear those separately if you reuse anything.

## Local development

Requires [fnm](https://github.com/Schniz/fnm) (or any Node version manager honoring `.nvmrc`) and
[pnpm 11](https://pnpm.io), pinned by the `packageManager` field so Corepack, CI and Cloudflare all
use the same version. **npm and yarn are blocked** by a `preinstall` guard — the lockfile is pnpm's
and mixing package managers breaks it. `.npmrc` sets `engine-strict=true`, so the `engines` field is
enforced rather than advisory and an older Node fails the install instead of the build.

```sh
fnm use          # Node 24, from .nvmrc
pnpm install
pnpm dev         # http://localhost:5173
```

| Command                 | What it does                                                    |
| ----------------------- | --------------------------------------------------------------- |
| `pnpm dev`              | Dev server. Drafts are visible here and nowhere else.           |
| `pnpm build`            | Static build into `dist/`. Fails on malformed post frontmatter. |
| `pnpm preview`          | Serve the built output locally.                                 |
| `pnpm test`             | Vitest: the Worker redirect table and frontmatter validation.   |
| `pnpm typecheck`        | `vue-tsc --noEmit`.                                             |
| `pnpm format`           | Prettier, including Tailwind class sorting.                     |
| `pnpm new-post "Title"` | Scaffold a post with complete frontmatter.                      |
| `pnpm deploy:worker`    | Build and `wrangler deploy`. Normally unnecessary — see below.  |

The deploy script is **not** called `deploy`: `pnpm deploy` is a reserved pnpm built-in (workspace
deploy) and would shadow the script rather than run it.

## Writing a post

```sh
pnpm new-post "Why I rewrote my blog"
```

That creates `src/posts/<year>/<slug>.md`, served at `/<year>/<slug>`.

```yaml
---
title: Hello World, again! # required
date: 2021-07-03 # required, YYYY-MM-DD
description: One or two sentences. # required — meta, social cards, RSS
tags: [personal] # optional
cover: /covers/hello-world-again.webp # optional, must be a local file
coverAlt: What is actually in the image # required whenever cover is set
coverSource: https://unsplash.com/... # optional, renders the credit
updated: 2026-03-12 # optional, shown as "Updated …"
draft: true # optional, hides it from builds
---
```

Validation is strict and throws: a missing `description`, a `cover` without `coverAlt`, or a remote
image URL **fails the build** rather than shipping a broken card or an inaccessible image. Covers
live in `src/public/covers/` as WebP, 1600px wide.

The homepage card excerpt is the post's first paragraph. Drop a `<!-- more -->` marker in the body
to extend it.

## How it is put together

```txt
.vitepress/
  config.ts          VitePress config: rewrites, sitemap, head, hooks
  site.ts            Single source of truth for site identity and links
  head.ts            Canonical, Open Graph, Twitter and JSON-LD tags
  rss.ts             RSS 2.0 feed, written in buildEnd
  posts.data.ts      Build-time content loader (validates, sorts, excerpts)
  lib/               Post types, validation, date and slug helpers
  theme/             The theme: layouts, components, Tailwind tokens, prose CSS
src/
  index.md           Homepage — intro header plus the 10 newest posts
  about.md           About
  archive.md         Every post, grouped by year
  tags/              Tag index plus a generated page per tag
  posts/<year>/      The posts themselves
  public/            Covers, avatar, icons, robots.txt
worker/index.ts      Redirects, then hands off to static assets
tests/               Vitest
```

A few decisions worth knowing before you change something:

- **Post URLs are `/<year>/<slug>`, not `/posts/<year>/<slug>`.** A `rewrites` function in
  `config.ts` strips the `posts/` prefix so the URLs the Eleventy site published keep working. This
  means `pageData.relativePath` is _already rewritten_ inside transform hooks — use `filePath` (via
  `isPostPage()`) to detect posts, not `relativePath`.
- **`markdown.headers` is enabled.** The default theme builds its outline client-side; a custom
  theme needs headers in `pageData` for the table of contents to exist at all.
- **Dynamic route `paths()` run before the config resolves**, so `createContentLoader` is
  unavailable there. `src/tags/[tag].paths.ts` reads frontmatter off disk via `lib/read-posts.ts`.
- **No search.** With one post it would be theater. When the archive justifies it,
  [Pagefind](https://pagefind.app) is the intended path: a build-time index and a drop-in UI, about
  twenty lines plus a postbuild step.
- **No analytics code.** Cloudflare Web Analytics is enabled from the dashboard, so there is no
  beacon script, no cookie and nothing to consent to.
- **The 404 page is built from `src/not-found.md`.** VitePress treats `404.html` as the SPA
  fallback and emits it with an empty body, since it cannot know the requested path at build time.
  Cloudflare serves that file directly for every unmatched URL, so anything not executing
  JavaScript would get a blank page. `buildEnd` renames the rendered `not-found.html` over it.

## Deployment

Pushes to `main` are built and deployed automatically by **Cloudflare Workers Builds**. GitHub
Actions runs the checks but does _not_ deploy, so there are no Cloudflare credentials in GitHub.

### Manual Cloudflare setup

These steps are done once, in the Cloudflare dashboard — they are not in this repo.

1. **Create the Worker and connect the repo.** Workers &amp; Pages → Create → Workers → Connect to
   Git → `bgever/blog`. Build settings:

   | Setting           | Value                                               |
   | ----------------- | --------------------------------------------------- |
   | Build command     | `pnpm build`                                        |
   | Deploy command    | `pnpm exec wrangler deploy`                         |
   | Root directory    | `/`                                                 |
   | Node version      | `24` (or add `NODE_VERSION=24` as a build variable) |
   | Production branch | `main`                                              |

   Workers Builds picks the package manager from the lockfile, so `pnpm-lock.yaml` gets it pnpm,
   at the version pinned in `packageManager`. Cloudflare's defaults are `npm run build` and
   `npx wrangler deploy` — replace both. `npx wrangler` would in fact work (it resolves the local
   binary from `node_modules/.bin`), but it silently falls back to fetching wrangler from the
   registry if that binary is ever missing, where `pnpm exec` fails loudly instead.

   If Workers Builds ever does run `npm install`, the `preinstall` guard fails the build with an
   explicit "use pnpm" error rather than quietly producing a second lockfile.

2. **Point the apex domain at the Worker.** Settings → Domains &amp; Routes → add `bgever.com` as a
   custom domain. Cloudflare creates the proxied DNS record itself.

3. **Redirect `www` to the apex.** Rules → Redirect Rules → Create:

   - **When** — `Hostname equals www.bgever.com`
   - **Then** — Dynamic redirect, `concat("https://bgever.com", http.request.uri.path)`,
     status **301**, preserve query string **on**

   This has to be a Redirect Rule rather than Worker code: on the `www` hostname a request for `/`
   would match `index.html` and be served by the static-asset layer _before_ the Worker ran, so a
   redirect in `worker/index.ts` would never fire. Redirect Rules run earlier, cost nothing, and are
   free on every plan.

4. **Enable Web Analytics.** Analytics &amp; Logs → Web Analytics → add `bgever.com`. Because the
   zone is proxied this needs no script tag, which is why there is no analytics code here.

### Redirects

Handled in `worker/index.ts` and covered by tests in `tests/redirects.test.ts`:

| Old URL            | Goes to              | Why                                       |
| ------------------ | -------------------- | ----------------------------------------- |
| `/blog`            | `/` (301)            | The post index moved to the site root     |
| `/contact`         | `/about` (301)       | The contact page and its form are gone    |
| `/admin/*`         | 404                  | Netlify CMS is gone and must not resolve  |
| `www.bgever.com/*` | `bgever.com/*` (301) | Redirect Rule, not the Worker — see above |

Old post URLs such as `/2021/hello-world-again/` need no redirect: the path is unchanged, and
Cloudflare's `auto-trailing-slash` handling 301s the trailing-slash form to the canonical one.
