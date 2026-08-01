/**
 * Cloudflare Worker in front of the static VitePress build.
 *
 * Static assets are matched and served by the platform *before* this runs, so
 * the Worker only ever sees requests that did not match a file. That makes it
 * the natural home for redirects of URLs the old Eleventy site published, and
 * it means normal page views cost no Worker invocations.
 *
 * `www` -> apex is deliberately NOT handled here: on the `www` hostname a
 * request for `/` would match `index.html` and be served before the Worker ran,
 * so the redirect would never fire. That one lives in a Cloudflare Redirect
 * Rule instead — see README.
 */

/**
 * The one binding this Worker needs. Declared locally rather than pulling in
 * @cloudflare/workers-types, whose globals collide with the DOM lib the rest of
 * the project (and the tests) rely on.
 */
export interface AssetFetcher {
  fetch(input: Request | string | URL, init?: RequestInit): Promise<Response>
}

export interface Env {
  ASSETS: AssetFetcher
}

/** Permanent redirects for URLs the Eleventy site published. */
export const REDIRECTS: Record<string, string> = {
  // The post index moved from /blog to the site root.
  '/blog': '/',
  // The contact page and its form are gone; About carries the contact links.
  '/contact': '/about',
}

/** Paths that must not resolve at all — the Netlify CMS is gone. */
export const GONE_PREFIXES: string[] = ['/admin']

/** Strips a trailing slash so `/blog/` matches the same rule as `/blog`. */
export function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

/**
 * Resolves a request URL to a redirect target, or null when there is none.
 * Exported so the redirect table can be tested without a Worker runtime.
 */
export function resolveRedirect(url: URL): string | null {
  const path = normalizePath(url.pathname)
  const target = REDIRECTS[path]
  if (!target) return null
  return new URL(target + url.search, url.origin).toString()
}

export function isGone(url: URL): boolean {
  const path = normalizePath(url.pathname)
  return GONE_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix + '/'))
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)

    const redirect = resolveRedirect(url)
    if (redirect) {
      return Response.redirect(redirect, 301)
    }

    if (isGone(url)) {
      return notFound(env, request)
    }

    return env.ASSETS.fetch(request)
  },
}

/** Serves the themed 404 page with a real 404 status. */
async function notFound(env: Env, request: Request): Promise<Response> {
  const page = await env.ASSETS.fetch(new URL('/404.html', request.url))
  return new Response(page.body, {
    status: 404,
    headers: page.headers,
  })
}
