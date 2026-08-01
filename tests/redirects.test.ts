import { describe, expect, it } from 'vitest'
import worker, { isGone, normalizePath, resolveRedirect, type Env } from '../worker/index'

const ORIGIN = 'https://bgever.com'
const url = (path: string) => new URL(path, ORIGIN)

/** Minimal ASSETS stub: echoes back which path was requested. */
function makeEnv(): Env {
  return {
    ASSETS: {
      async fetch(input: Request | string | URL) {
        const href =
          typeof input === 'string' ? input : input instanceof URL ? input.href : input.url
        return new Response(`asset:${new URL(href).pathname}`, {
          status: 200,
          headers: { 'content-type': 'text/html' },
        })
      },
    },
  }
}

describe('normalizePath', () => {
  it('drops a trailing slash', () => {
    expect(normalizePath('/blog/')).toBe('/blog')
  })

  it('leaves the root alone', () => {
    expect(normalizePath('/')).toBe('/')
  })
})

describe('resolveRedirect', () => {
  it.each([
    ['/blog', `${ORIGIN}/`],
    ['/blog/', `${ORIGIN}/`],
    ['/contact', `${ORIGIN}/about`],
    ['/contact/', `${ORIGIN}/about`],
  ])('redirects %s to %s', (from, to) => {
    expect(resolveRedirect(url(from))).toBe(to)
  })

  it('preserves the query string', () => {
    expect(resolveRedirect(url('/blog?utm_source=rss'))).toBe(`${ORIGIN}/?utm_source=rss`)
  })

  it('does not redirect a real post URL', () => {
    expect(resolveRedirect(url('/2021/hello-world-again'))).toBeNull()
  })

  it('does not redirect the homepage', () => {
    expect(resolveRedirect(url('/'))).toBeNull()
  })
})

describe('isGone', () => {
  it.each(['/admin', '/admin/', '/admin/index.html', '/admin/config.yml'])(
    'treats %s as gone',
    (path) => {
      expect(isGone(url(path))).toBe(true)
    },
  )

  it('does not match a path that merely starts with the same letters', () => {
    expect(isGone(url('/administration'))).toBe(false)
  })
})

describe('worker.fetch', () => {
  it('returns a 301 for a retired URL', async () => {
    const res = await worker.fetch(new Request(`${ORIGIN}/blog`), makeEnv())
    expect(res.status).toBe(301)
    expect(res.headers.get('location')).toBe(`${ORIGIN}/`)
  })

  it('serves the 404 page with a 404 status for /admin', async () => {
    const res = await worker.fetch(new Request(`${ORIGIN}/admin/index.html`), makeEnv())
    expect(res.status).toBe(404)
    expect(await res.text()).toBe('asset:/404.html')
  })

  it('passes anything else through to static assets', async () => {
    const res = await worker.fetch(new Request(`${ORIGIN}/2021/hello-world-again`), makeEnv())
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('asset:/2021/hello-world-again')
  })
})
