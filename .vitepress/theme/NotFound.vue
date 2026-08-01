<script setup lang="ts">
/**
 * Content-only by design: the router renders this INSIDE Layout (it becomes
 * `route.component` for missed routes, with frontmatter.layout 'page'), so any
 * chrome here would nest a second header and footer into the page. Layout
 * branches on `page.isNotFound` and mounts this directly, bypassing the
 * layout switch and the prose container.
 */
</script>

<template>
  <div class="mx-auto w-full max-w-[calc(var(--measure)+3rem)] px-6 py-[3rem]">
    <p class="text-[0.6875rem] font-semibold tracking-[0.14em] text-[var(--c-muted)] uppercase">
      404
    </p>
    <h1 class="mt-2 font-sans text-[2rem] leading-[1.15] font-bold tracking-[-0.024em]">
      Uh oh, the resource you requested isn’t here. Sorry.
    </h1>
    <p class="mt-4 font-serif text-[1.0625rem] leading-[1.72] text-[var(--c-muted)]">
      The page may have moved, or it may never have existed. These still work:
    </p>
    <ul class="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[0.9375rem] font-semibold">
      <li><a href="/" class="text-[var(--c-accent)] no-underline">Latest posts</a></li>
      <li><a href="/archive" class="text-[var(--c-accent)] no-underline">Archive</a></li>
      <li><a href="/tags" class="text-[var(--c-accent)] no-underline">Tags</a></li>
      <li><a href="/about" class="text-[var(--c-accent)] no-underline">About</a></li>
    </ul>
  </div>
</template>
